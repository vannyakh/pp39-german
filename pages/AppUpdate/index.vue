<template>
	<view v-if="update" class="app-update">
		<view class="app-update__content">
			<view class="app-update__header">
				<view class="app-update__logo-wrapper">
					<image src="/static/logo.png" mode="aspectFit" class="app-update__logo-image"></image>
					<view class="app-update__logo-glow"></view>
				</view>
				<view class="app-update__version">
					<view class="app-update__version-item">
						<text class="app-update__version-label">Current Version</text>
						<text class="app-update__version-text">{{ currentVersion }}</text>
					</view>
					<view class="app-update__version-arrow">
						<view class="app-update__arrow-line"></view>
						<text class="app-update__arrow-icon">↓</text>
					</view>
					<view class="app-update__version-item">
						<text class="app-update__version-label">Latest Version</text>
						<text class="app-update__version-text">{{ latestVersion }}</text>
					</view>
				</view>
			</view>

			<view class="app-update__progress">
				<view class="app-update__status">
					<text class="app-update__text">{{ statusText }}</text>
					<view class="app-update__progress-info">
						<text class="app-update__progress-text">{{ progress }}%</text>
						<text class="app-update__progress-separator">|</text>
						<text class="app-update__progress-size" v-if="downloadSize">{{ downloadSize }}</text>
					</view>
				</view>
				<view class="app-update__progress-bar">
					<u-line-progress :percentage="progress" activeColor="#51AADB" class="progress" active
						:show-text="false" stroke-width="8" :duration="0.3" height="16"></u-line-progress>
				</view>
			</view>

			<view class="app-update__footer">
				<view class="app-update__tips">
					<view class="app-update__tips-icon">
						<text class="app-update__tips-icon-text">!</text>
					</view>
					<text class="app-update__tips-text">Do not close the app during the update process</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const UPDATE_STATUS = {
	CHECKING: 'checking',
	DOWNLOADING: 'downloading',
	INSTALLING: 'installing',
	SUCCESS: 'success',
	ERROR: 'error'
};

const STATUS_MESSAGES = {
	[UPDATE_STATUS.CHECKING]: 'Checking for updates, please wait',
	[UPDATE_STATUS.DOWNLOADING]: 'Downloading resources...',
	[UPDATE_STATUS.INSTALLING]: 'Installing, please wait...',
	[UPDATE_STATUS.SUCCESS]: 'New version installed successfully',
	[UPDATE_STATUS.ERROR]: 'Installation failed, please try again'
};

export default {
	name: 'AppUpdate',

	data() {
		return {
			progress: 0,
			update: false,
			status: UPDATE_STATUS.CHECKING,
			// Production
			versionApiUrl: 'https://singapore-1201806-version.s3.ap-southeast-1.amazonaws.com/version.json',
			// Demo
			// versionApiUrl: 'https://cloud-file.exodex.xyz/d/root/DEMO/__UNI__7E6E966.wgt?sign=J-FhLVSl7TDFJRaPJsEjS7gSWhowq7cgwFEKfLLgpsY=:0',
			currentVersion: '',
			latestVersion: '',
			downloadSize: ''
		};
	},

	computed: {
		statusText() {
			return STATUS_MESSAGES[this.status] || STATUS_MESSAGES[UPDATE_STATUS.CHECKING];
		}
	},

	onLoad() {
		console.log('Checking for updates, please wait...');
		this.checkForUpdates();
	},

	onShow: function () {
		//console.log('App Show')
	},

	onHide: function () {
		//console.log('App Hide')
	},

	methods: {
		async checkForUpdates() {
			try {
				this.status = UPDATE_STATUS.CHECKING;
				this.currentVersion = uni.getStorageSync('current_version');
				const response = await this.fetchVersionInfo();

				// Check if response exists and has the expected structure
				if (!response || !response.data) {
					console.error('Invalid version info response:', response);
					this.redirectToApp();
					return;
				}
				console.log(response)
				const {
					code,
					data
				} = response.data;
				console.log(code)
				// Check if the response code is 1 and data exists
				if (code !== 1 || !data) {
					// console.error('Invalid version info format:', response);
					this.redirectToApp();
					return;
				}

				const {
					version,
					url: downloadUrl
				} = data;
				console.log('downloadUrl', downloadUrl)
				// Validate version and downloadUrl
				if (!version || !downloadUrl) {
					console.error('Missing version or download URL:', data);
					this.redirectToApp();
					return;
				}

				this.latestVersion = version;

				if (this.currentVersion === version) {
					console.log('App is up to date');
					this.redirectToApp();
					return;
				}

				this.update = true;
				uni.setStorageSync('current_version', version);
				await this.startUpdate(downloadUrl);

			} catch (error) {
				console.error('Update check failed:', error);
				this.handleUpdateError();
			}
		},

		async fetchVersionInfo() {
			try {
				const [error, res] = await uni.request({
					url: this.versionApiUrl,
					method: 'GET',
					timeout: 10000 // 10 second timeout
				});

				if (error) {
					console.error('Request error:', error);
					throw error;
				}

				if (!res || !res.data) {
					console.error('Invalid response:', res);
					throw new Error('Invalid response from version check');
				}

				return res;
			} catch (error) {
				console.error('Failed to fetch version info:', error);
				throw error;
			}
		},

		redirectToApp() {
			const route = uni.getStorageSync('token') ? '/pages/index/index' : '/pages/login/index';
			setTimeout(() => {
				uni.reLaunch({
					url: route
				});
			}, 200);
		},

		async startUpdate(downloadUrl) {
			this.status = UPDATE_STATUS.DOWNLOADING;

			try {
				const downloadTask = await this.createDownloadTask(downloadUrl);
				this.setupDownloadListeners(downloadTask);
				downloadTask.start();
			} catch (error) {
				console.error('Update failed:', error);
				this.handleUpdateError();
			}
		},

		createDownloadTask(url) {
			return plus.downloader.createDownload(
				url, {
				retryInterval: 3,
				timeout: 10
			},
				(download, status) => this.handleDownloadComplete(download, status)
			);
		},

		setupDownloadListeners(task) {
			task.addEventListener('statechanged', (task, status) => {
				if (task.state === 3) {
					const downloadProgress = (task.downloadedSize / task.totalSize) * 100;
					this.progress = Math.floor(downloadProgress);
					this.downloadSize = this.formatFileSize(task.totalSize);
				}
			});
		},

		formatFileSize(bytes) {
			if (bytes === 0) return '0 B';
			const k = 1024;
			const sizes = ['B', 'KB', 'MB', 'GB'];
			const i = Math.floor(Math.log(bytes) / Math.log(k));
			return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
		},

		async handleDownloadComplete(download, status) {
			if (!status) {
				this.handleDownloadError();
				return;
			}

			this.progress = 100;
			this.status = UPDATE_STATUS.INSTALLING;

			try {
				const path = this.getLocalFilePath(download.filename);
				await this.installUpdate(path);
			} catch (error) {
				console.error('Installation failed:', error);
				this.handleUpdateError();
			}
		},

		getLocalFilePath(filename) {
			let path = plus.io.convertLocalFileSystemURL(filename);
			return plus.os.name === 'iOS' ? 'file://' + path : path;
		},

		async installUpdate(path) {
			return new Promise((resolve, reject) => {
				plus.io.resolveLocalFileSystemURL(path, async (entry) => {
					try {
						await this.verifyAndInstall(entry, path);
						resolve();
					} catch (error) {
						reject(error);
					}
				}, reject);
			});
		},

		async verifyAndInstall(entry, path) {
			return new Promise((resolve, reject) => {
				entry.file(async (file) => {
					if (file.size <= 0) {
						throw new Error('Invalid update file');
					}

					try {
						await this.performInstallation(path, entry);
						resolve();
					} catch (error) {
						reject(error);
					}
				});
			});
		},

		async performInstallation(path, entry) {
			return new Promise((resolve, reject) => {
				plus.runtime.install(path, {
					force: true
				},
					() => this.handleInstallSuccess(entry, resolve),
					error => this.handleInstallError(error, entry, reject)
				);
			});
		},

		handleInstallSuccess(entry, resolve) {
			this.status = UPDATE_STATUS.SUCCESS;
			this.cleanupAndRestart(entry);
			resolve();
		},

		handleInstallError(error, entry, reject) {
			console.error('Installation failed:', error);
			this.status = UPDATE_STATUS.ERROR;
			this.cleanup(entry);
			reject(error);
		},

		cleanupAndRestart(entry) {
			this.cleanup(entry);
			uni.showModal({
				title: 'Upgrade the app',
				content: 'New version installed successfully',
				showCancel: false,
				success: () => {
					setTimeout(() => plus.runtime.restart(), 1500);
				}
			});
		},

		cleanup(entry) {
			entry?.remove(
				() => console.log('Cleanup successful'),
				error => console.error('Cleanup failed:', error)
			);
		},

		handleUpdateError() {
			this.status = UPDATE_STATUS.ERROR;
			this.progress = 0;

			uni.showModal({
				title: 'Hint',
				content: 'Update check failed, do you want to retry？',
				success: (res) => {
					if (res.confirm) {
						this.checkForUpdates();
					} else {
						this.redirectToApp();
					}
				}
			});
		},

		handleDownloadError() {
			uni.showModal({
				title: 'Hint',
				content: 'Download failed, please exit and try again',
				showCancel: false,
				success: () => plus.runtime.quit()
			});
		}
	}
};
</script>

<style lang="scss">
.app-update {
	height: 100vh;
	background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%);
	position: relative;
	overflow: hidden;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 40%;
		background: linear-gradient(180deg, rgba(114, 129, 252, 0.1) 0%, rgba(114, 129, 252, 0) 100%);
		z-index: 0;
	}

	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx;
		height: 100%;
		position: relative;
		z-index: 1;
	}

	&__header {
		margin-top: 120rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		animation: fadeInDown 0.8s ease-out;
	}

	&__logo-wrapper {
		position: relative;
		margin-bottom: 40rpx;
	}

	&__logo-image {
		width: 220rpx;
		height: 220rpx;
		border-radius: 50%;
		box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
		border: 4rpx solid rgba(114, 129, 252, 0.2);
		transition: all 0.3s ease;
		position: relative;
		z-index: 2;

		&:hover {
			transform: scale(1.05);
			border-color: rgba(114, 129, 252, 0.4);
		}
	}

	&__logo-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 240rpx;
		height: 240rpx;
		background: radial-gradient(circle, rgba(114, 129, 252, 0.2) 0%, rgba(114, 129, 252, 0) 70%);
		border-radius: 50%;
		animation: pulse 2s infinite;
		z-index: 1;
	}

	&__version {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20rpx;
		background: rgba(255, 255, 255, 0.9);
		padding: 30rpx 40rpx;
		border-radius: 20rpx;
		width: 80%;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
		backdrop-filter: blur(10px);
	}

	&__version-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8rpx;
	}

	&__version-label {
		font-size: 24rpx;
		color: #666;
	}

	&__version-text {
		font-size: 36rpx;
		color: #333;
		font-weight: 600;
	}

	&__version-arrow {
		position: relative;
		padding: 20rpx 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
	}

	&__arrow-line {
		width: 2rpx;
		height: 40rpx;
		background: linear-gradient(to bottom, #7281FC, transparent);
	}

	&__arrow-icon {
		font-size: 36rpx;
		color: #7281FC;
		animation: bounce 2s infinite;
	}

	&__progress {
		width: 90%;
		margin-bottom: 200rpx;
		animation: fadeInUp 0.8s ease-out;
	}

	&__status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}

	&__text {
		font-size: 32rpx;
		color: #333;
		font-weight: 500;
	}

	&__progress-info {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	&__progress-text {
		font-size: 28rpx;
		color: #7281FC;
		font-weight: 500;
	}

	&__progress-separator {
		color: #ddd;
	}

	&__progress-size {
		font-size: 24rpx;
		color: #999;
	}

	&__progress-bar {
		margin-bottom: 20rpx;

		:deep(.u-line-progress) {
			border-radius: 8rpx;
			overflow: hidden;
			background-color: rgba(114, 129, 252, 0.1);
			box-shadow: inset 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
		}
	}

	&__footer {
		width: 100%;
		text-align: center;
		margin-bottom: 40rpx;
		animation: fadeIn 0.8s ease-out;
	}

	&__tips {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		margin-bottom: 20rpx;
		background: rgba(255, 77, 79, 0.1);
		padding: 16rpx 24rpx;
		border-radius: 12rpx;
	}

	&__tips-icon {
		width: 32rpx;
		height: 32rpx;
		background: #FF4D4F;
		color: #FFFFFF;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
		font-weight: bold;
	}

	&__tips-text {
		font-size: 24rpx;
		color: #FF4D4F;
		font-weight: 500;
	}
}

@keyframes fadeInDown {
	from {
		opacity: 0;
		transform: translateY(-30rpx);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(30rpx);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

@keyframes bounce {

	0%,
	20%,
	50%,
	80%,
	100% {
		transform: translateY(0);
	}

	40% {
		transform: translateY(-10rpx);
	}

	60% {
		transform: translateY(-5rpx);
	}
}

@keyframes pulse {
	0% {
		transform: translate(-50%, -50%) scale(1);
		opacity: 0.5;
	}

	50% {
		transform: translate(-50%, -50%) scale(1.1);
		opacity: 0.3;
	}

	100% {
		transform: translate(-50%, -50%) scale(1);
		opacity: 0.5;
	}
}
</style>