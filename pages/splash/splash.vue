<template>
	<view class="splash-container">
		<view class="loading-container" :class="{ 'fade-in': isAnimating }">
			<template v-if="isDownloading">
				<view class="progress-container">
					<view class="progress-bar" :style="{background: getColorWithOpacity(theme.white, 0.2)}">
						<view class="progress-fill" :style="{ width: `${downloadProgress}%`, background: theme.white }"></view>
					</view>
					<text class="progress-text" :style="{color: getColorWithOpacity(theme.white, 0.9)}">{{ updateStatus.text }}</text>
					<text class="progress-size" v-if="totalSize > 0" :style="{color: getColorWithOpacity(theme.white, 0.7)}">
						{{ (downloadedSize / 1024 / 1024).toFixed(2) }}MB / {{ (totalSize / 1024 / 1024).toFixed(2) }}MB
					</text>
				</view>
			</template>
			<template v-else>
				<view class="loading-dots">
					<view class="dot" :style="{backgroundColor: theme.white}"></view>
					<view class="dot" :style="{backgroundColor: theme.white}"></view>
					<view class="dot" :style="{backgroundColor: theme.white}"></view>
				</view>
				<text class="loading-text" :style="{color: getColorWithOpacity(theme.white, 0.9)}">{{ updateStatus.text || $t('splash.loading') }}</text>
			</template>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
	data() {
		return {
			isAnimating: false,
			isDownloading: false,
			downloadProgress: 0,
			totalSize: 0,
			downloadedSize: 0,
			updateStatus: {
				text: '',
				progress: 0,
				isUpdating: false
			},
			retryCount: 0,
			maxRetries: 3,
			appInitialized: false
		}
	},

	computed: {
		...mapState('app', [
			'networkStatus',
			'deviceInfo'
		]),
		theme() {
			return this.$store.getters.theme
		}
	},

	onLoad() {
		console.log('Initializing splash screen...')
		this.isAnimating = true
		this.initializeApp()
	},

	methods: {
		...mapActions('app', [
			'initApp',
			'setLoading',
			'checkNetworkStatus',
			'getDeviceInfo'
		]),

		async initializeApp() {
			try {
				// Set loading state
				this.setLoading(true)
				this.updateStatus.text = this.$t('splash.initializing')

				// Initialize core app functionality
				await this.initApp()

				// Check network status
				const networkStatus = await this.checkNetworkStatus()
				console.log(`Network status: ${networkStatus}`)

				if (networkStatus === 'offline') {
					this.updateStatus.text = this.$t('splash.offlineMode')
					await this.showNetworkErrorDialog()
					// Even if offline, try to continue with cached data
					setTimeout(() => {
						this.checkForUpdates()
					}, 1000)
					return
				}

				// Get device info for analytics and debugging
				await this.getDeviceInfo()
				console.log('Device info loaded')

				// Mark app as initialized
				this.appInitialized = true

				// Check for updates
				await this.checkForUpdates()
			} catch (error) {
				console.error('App initialization failed:', error)
				// Even if initialization fails, try to continue to the app
				await this.checkForUpdates()
			}
		},

		async checkForUpdates() {
			try {
				this.updateStatus.text = this.$t('splash.checkingUpdate')

				// Use the new GET API function with caching for version check
				const response = await this.post('/publics/version', {
					region: 2,
				}) // Disable cache for version checks
				console.log("🚀 ~ checkForUpdates ~ response:", response)

				console.log("Version check response:", response)

				if (!response || response.code !== 1 || !response.data) {
					throw new Error('Invalid response format')
				}

				const {
					downloadurl: downloadUrl,
					newversion: newVersion,
					oldversion: oldVersion,
					packagesize: packageSize,
					enforce: isForced
				} = response.data

				if (!downloadUrl || !newVersion) {
					console.log('No update available')
					await this.navigateToApp()
					return
				}

				// Get current version from system info or store
				const systemInfo = this.deviceInfo || uni.getSystemInfoSync()
				const currentVersion = systemInfo.appWgtVersion
				console.log(`Current version: ${currentVersion}, New version: ${newVersion}`)

				if (this.compareVersions(currentVersion, newVersion) >= 0) {
					console.log('Already on latest version')
					await this.navigateToApp()
					return
				}

				// Show update dialog for non-forced updates
				if (!isForced) {
					const shouldUpdate = await this.showUpdateDialog(newVersion, currentVersion, packageSize)
					if (!shouldUpdate) {
						await this.navigateToApp()
						return
					}
				}

				this.updateStatus.isUpdating = true
				await this.downloadAndInstallUpdate(downloadUrl)
			} catch (error) {
				console.error('Update check failed:', error)
				if (this.retryCount < this.maxRetries) {
					this.retryCount++
					console.log(`Retrying update check (${this.retryCount}/${this.maxRetries})...`)
					setTimeout(() => this.checkForUpdates(), 3000)
				} else {
					await this.navigateToApp()
				}
			}
		},

        // not used, but kept for compatibility
		compareVersions2(v1, v2) {
			const parts1 = v1.split('.').map(Number)
			const parts2 = v2.split('.').map(Number)

			for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
				const num1 = parts1[i] || 0
				const num2 = parts2[i] || 0
				if (num1 > num2) return 1
				if (num1 < num2) return -1
			}
			return 0
		},
        // Improved version comparison function
        compareVersions(v1, v2) {
            // Add null/undefined checks
            if (!v1 || !v2) {
                console.warn('compareVersions: Invalid version input', { v1, v2 });
                return 0; // Treat as equal if either version is invalid
            }

            // Ensure they're strings
            const version1 = String(v1);
            const version2 = String(v2);

            const parts1 = version1.split('.').map(Number);
            const parts2 = version2.split('.').map(Number);

            for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
                const num1 = parts1[i] || 0;
                const num2 = parts2[i] || 0;
                if (num1 > num2) return 1;
                if (num1 < num2) return -1;
            }
            return 0;
        },

		async downloadAndInstallUpdate(downloadUrl) {
			try {
				this.updateStatus.text = this.$t('splash.startingDownload')
				this.isDownloading = true
				this.downloadProgress = 0

				// Set loading state in app store
				this.setLoading(true)

				const dtask = plus.downloader.createDownload(downloadUrl, {
					filename: '_doc/update/',
					timeout: 60,
					retry: 3,
					retryInterval: 3
				}, async (d, status) => {
					if (status === 200) {
						await this.installUpdate(d.filename)
					} else {
						throw new Error('Download failed with status: ' + status)
					}
				})

				dtask.addEventListener('statechanged', (task, status) => {
					switch (task.state) {
						case 2: // Starting download
							this.updateStatus.text = this.$t('splash.downloading')
							break
						case 3: // Downloading
							const progress = (task.downloadedSize / task.totalSize) * 100
							this.downloadProgress = parseInt(progress)
							this.downloadedSize = task.downloadedSize
							this.totalSize = task.totalSize
							this.updateStatus.text =
								`${this.$t('splash.downloading')} ${this.downloadProgress}%`
							break
						case 4: // Download completed
							this.downloadProgress = 100
							this.updateStatus.text = this.$t('splash.installing')
							break
					}
				})

				dtask.start()
			} catch (error) {
				console.error('Download failed:', error)
				// Reset loading state
				this.setLoading(false)
				await this.handleUpdateError()
			}
		},

		async installUpdate(path) {
			try {
				this.updateStatus.text = this.$t('splash.installing')
				await new Promise((resolve, reject) => {
					plus.runtime.install(path, {
						force: true
					}, () => {
						resolve()
					}, (error) => {
						reject(error)
					})
				})

				await this.showSuccessDialog()
				plus.runtime.restart()
			} catch (error) {
				console.error('Installation failed:', error)
				// Reset loading state
				this.setLoading(false)
				await this.handleUpdateError()
			}
		},

		async handleUpdateError() {
			if (this.retryCount < this.maxRetries) {
				this.retryCount++
				const retry = await this.showRetryDialog()
				if (retry) {
					await this.checkForUpdates()
				} else {
					await this.navigateToApp()
				}
			} else {
				await this.navigateToApp()
			}
		},

		showNetworkErrorDialog() {
			return new Promise((resolve) => {
				uni.showModal({
					title: this.$t('splash.network.error.title') || 'Network Error',
					content: this.$t('splash.network.error.content') || 'Unable to connect to the server. Check your internet connection.',
					showCancel: false,
					confirmText: this.$t('splash.network.error.confirm') || 'OK',
					success: () => resolve()
				})
			})
		},

		showUpdateDialog(newVersion, currentVersion, packageSize) {
			return new Promise((resolve) => {
				uni.showModal({
					title: this.$t('splash.update.available.title'),
					content: this.$t('splash.update.available.content', {
						currentVersion,
						newVersion,
						size: (packageSize / 1024 / 1024).toFixed(2)
					}),
					confirmText: this.$t('splash.update.available.confirm'),
					cancelText: this.$t('splash.update.available.cancel'),
					success: (res) => resolve(res.confirm)
				})
			})
		},

		showRetryDialog() {
			return new Promise((resolve) => {
				uni.showModal({
					title: this.$t('splash.update.error.title'),
					content: this.$t('splash.update.error.content'),
					confirmText: this.$t('splash.update.error.retry'),
					cancelText: this.$t('splash.update.error.skip'),
					success: (res) => resolve(res.confirm)
				})
			})
		},

		showSuccessDialog() {
			return new Promise((resolve) => {
				uni.showModal({
					title: this.$t('splash.update.success.title'),
					content: this.$t('splash.update.success.content'),
					showCancel: false,
					success: () => resolve()
				})
			})
		},

		async navigateToApp() {
			// Make sure loading state is reset
			this.setLoading(false)

			// Clear cached API responses on app start
			this.clearRequestCache() //clearRequestCache

			const hasToken = uni.getStorageSync('token')

			if (hasToken) {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			} else {
				// Check for referral_code in URL parameters
				let referralCode = null

				// #ifdef H5
				// For H5, check URL search parameters
				const urlParams = new URLSearchParams(window.location.search)
				referralCode = urlParams.get('referral_code')
				// #endif

				// #ifdef APP-PLUS
				// For native apps, check launch options
				const launchOptions = plus.runtime.arguments
				if (launchOptions) {
					try {
						const params = new URLSearchParams(launchOptions)
						referralCode = params.get('referral_code')
					} catch (e) {
						console.log('Failed to parse launch arguments:', e)
					}
				}
				// #endif

				// If referral code exists, redirect to register page
				if (referralCode) {
					uni.reLaunch({
						url: `/pages/login/register?referral_code=${referralCode}`
					})
				} else {
					// Navigate to welcome page
					uni.reLaunch({
						url: '/pages/login/welcome'
					})
				}
			}
		},
		getColorWithOpacity(color, opacity) {
			if (!color) return 'transparent'
			if (color.startsWith('#')) {
				const r = parseInt(color.slice(1, 3), 16)
				const g = parseInt(color.slice(3, 5), 16)
				const b = parseInt(color.slice(5, 7), 16)
				return `rgba(${r}, ${g}, ${b}, ${opacity})`
			}
			if (color.startsWith('rgb')) {
				return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
			}
			return color
		}
	}
}
</script>

<style lang="scss" scoped>
.splash-container {
	position: relative;
	height: 100vh;
	background-image: url('/static/slash.png');
	background-size: cover;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

.loading-container {
	position: absolute;
	bottom: 15%;
	display: flex;
	flex-direction: column;
	align-items: center;
	opacity: 0;
	transform: translateY(20rpx);
	transition: all 0.5s ease-in-out;

	&.fade-in {
		opacity: 1;
		transform: translateY(0);
	}
}

.progress-container {
	width: 100%;
	max-width: 800rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;

	.progress-bar {
		width: 100%;
		height: 8rpx;
		border-radius: 4rpx;
		overflow: hidden;
		position: relative;

		.progress-fill {
			height: 100%;
			border-radius: 4rpx;
			transition: width 0.3s ease-out;
			position: absolute;
			left: 0;
			top: 0;
		}
	}

	.progress-text {
		font-size: 28rpx;
		text-align: center;
	}

	.progress-size {
		font-size: 24rpx;
		margin-top: 8rpx;
	}
}

.loading-dots {
	display: flex;
	gap: 12rpx;
	margin-bottom: 20rpx;

	.dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		opacity: 0.7;
		animation: bounce 1.4s infinite ease-in-out both;

		&:nth-child(1) {
			animation-delay: -0.32s;
		}

		&:nth-child(2) {
			animation-delay: -0.16s;
		}
	}
}

@keyframes bounce {

	0%,
	80%,
	100% {
		transform: scale(0);
		opacity: 0.5;
	}

	40% {
		transform: scale(1);
		opacity: 1;
	}
}

.loading-text {
	font-size: 28rpx;
	margin-top: 12rpx;
}
</style>
