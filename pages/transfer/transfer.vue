<template>
	<view class="transfer-container" :style="{ background: theme.backgroundPrimary, color: theme.textPrimary }">
		<!-- Header -->
		<bg-animate-shape />
		<app-nav blur :title="$t('transfer.title')" showRightImage rightImageUrl="/static/imgs/fund/record.png" @right-action="router.push('/pages/transfer/record')"></app-nav>

		<v-container size="md" class="transfer-content">
			<!-- Transfer Direction Card -->
			<view class="transfer-direction-card" :style="{ background: theme.backgroundCard, border: `2rpx solid ${theme.neutral__200}` }">
				<view class="transfer-direction">
					<!-- From Balance Section -->
					<view class="direction-item">
						<view class="direction-label" :style="{ color: theme.textTertiary }">{{ $t('transfer.from') }}</view>
						<view class="direction-value" @click="openFromSelector">
							<text class="direction-text" :class="{ swapping: isSwapping }" :style="{ color: theme.textPrimary }">
								{{ fromBalance.type === 'money' ? 'Trading' : fromBalance.type === 'spot' ? 'Spot' : $t('transfer.selectWallet') }}
							</text>
							<text class="cuIcon-right" :style="{ color: theme.textTertiary }" />
						</view>
					</view>
					<!-- To Balance Section -->
					<view class="direction-item">
						<view class="direction-label" :style="{ color: theme.textTertiary }">{{ $t('transfer.to') }}</view>
						<view class="direction-value" @click="openToSelector">
							<text class="direction-text" :class="{ swapping: isSwapping }" :style="{ color: theme.textPrimary }">
								{{ toBalance.type === 'money' ? 'Trading' : toBalance.type === 'spot' ? 'Spot' : $t('transfer.selectWallet') }}
							</text>
							<text class="cuIcon-right" :style="{ color: theme.textTertiary }" />
						</view>
					</view>
				</view>
				<!-- Swap Button -->
				<view class="swap-button" :class="{ rotating: isSwapping }" @click="swapAccounts" :style="getSwapButtonStyle()">
					<image src="/static/imgs/my/transfer.png" mode="aspectFit" class="swap-icon" />
				</view>
			</view>

			<!--select asset currency-->
			<view class="coin-section">
				<view class="section-label" :style="{ color: theme.textTertiary }">{{ $t('transfer.asset.select') }}</view>
				<view class="coin-selector" @click="openAssetSelector" :style="{ background: theme.backgroundCard, border: `2rpx solid ${theme.neutral__200}` }">
					<view class="coin-info">
						<view class="coin-icon" :style="{ background: theme.primary__500 }">
							<text class="coin-symbol" :style="{ color: theme.white }">{{ selectedAsset.icon }}</text>
						</view>
						<view class="coin-details">
							<text class="coin-name" :style="{ color: theme.textPrimary }">{{ selectedAsset.name || $t('transfer.asset.select') }}</text>
							<text class="coin-full-name" :style="{ color: theme.textSecondary }">
								{{ selectedAsset.name ? selectedAsset.currency : $t('transfer.asset.select') }}
							</text>
						</view>
					</view>
					<text class="cuIcon-right" :style="{ color: theme.textTertiary }" />
				</view>
			</view>

			<!-- Amount Section -->
			<view class="amount-section">
				<view class="section-label" :style="{ color: theme.textTertiary }">{{ $t('transfer.amount') }}</view>
				<view class="amount-input-container" :style="{ background: theme.backgroundCard, border: `2rpx solid ${theme.neutral__200}` }">
					<view class="amount-limits">
						<text class="limit-text" :style="{ color: theme.textTertiary }">{{ $t('transfer.minimum') }}</text>
						<view class="max-section">
							<text class="currency-label" :style="{ color: theme.textPrimary }">{{ currency }}</text>
							<text class="max-button" @click="setMaxAmount" :style="getMaxButtonStyle()">{{ $t('transfer.maximum') }}</text>
						</view>
					</view>
					<view class="amount-input">
						<input
							v-model="transferAmount"
							type="number"
							:placeholder="$t('transfer.enterAmount')"
							class="amount-field"
							:style="{ color: theme.textPrimary }"
							placeholder-class="input-placeholder"
						/>
					</view>
					<view class="available-balance">
						<text class="available-text" :style="{ color: theme.textTertiary }">
							{{ $t('transfer.available', { amount: formatNumber(availableBalance), currency: currency }) }}
						</text>
					</view>
				</view>
			</view>
		</v-container>

		<!-- Confirm Button -->
		<view class="bottom-section">
			<v-container size="md">
				<u-button
					:disabled="!isTransferValid"
					@click="confirmTransfer"
					class="confirm-button"
					:block="true"
					shape="circle"
					size="large"
					:text="isTransferValid ? $t('transfer.confirmTransfer') : $t('transfer.insufficientBalance')"
					:style="getConfirmButtonStyle()"
				></u-button>
			</v-container>
		</view>

		<!-- Balance Selector Bottom Sheet -->
		<v-bottom-sheet v-model="showAccountSelector" :close-on-backdrop="true" :title="$t('transfer.bottomSheet.title')" :backgroundColor="theme.backgroundCard">
			<view class="account-list">
				<view class="account-item" :class="{ disabled: isTypeDisabled('spot') }" @click="selectType('spot')" :style="getAccountItemStyle('spot')">
					<text class="account-name" :style="getAccountNameStyle('spot')">Spot</text>
					<view v-if="isTypeDisabled('spot')" class="disabled-indicator" :style="{ background: theme.warning__500 }">
						<text class="disabled-text" :style="{ color: theme.white }">{{ $t('transfer.bottomSheet.alreadySelected') }}</text>
					</view>
				</view>
				<view class="account-item" :class="{ disabled: isTypeDisabled('money') }" @click="selectType('money')" :style="getAccountItemStyle('money')">
					<text class="account-name" :style="getAccountNameStyle('money')">Trading</text>
					<view v-if="isTypeDisabled('money')" class="disabled-indicator" :style="{ background: theme.warning__500 }">
						<text class="disabled-text" :style="{ color: theme.white }">{{ $t('transfer.bottomSheet.alreadySelected') }}</text>
					</view>
				</view>
			</view>
		</v-bottom-sheet>

		<!--asset selector bottom sheet-->
		<v-bottom-sheet v-model="showAssetSelector" :close-on-backdrop="true" :title="$t('transfer.asset.select')" :backgroundColor="theme.backgroundCard">
			<view class="asset-list">
				<view
					v-for="asset in assetTypes"
					:key="asset.id"
					class="asset-item"
					:class="{ selected: selectedAsset.id === asset.id }"
					@click="selectAsset(asset)"
					:style="getAssetItemStyle(asset.id)"
				>
					<view class="asset-info">
						<view class="asset-icon" :style="{ background: theme.primary__500 }">
							<text class="asset-symbol" :style="{ color: theme.white }">{{ asset.icon }}</text>
						</view>
						<view class="asset-details">
							<text class="asset-name" :style="{ color: theme.textPrimary }">{{ asset.name }}</text>
							<text class="asset-full-name" :style="{ color: theme.textSecondary }">{{ asset.currency }}</text>
						</view>
					</view>
				</view>
			</view>
		</v-bottom-sheet>
	</view>
</template>

<script>
export default {
	data() {
		return {
			transferAmount: '',
			showFromSelector: false,
			showToSelector: false,
			showAccountSelector: false,
			isSwapping: false,
			isLoading: false,
			isTransferring: false,
			fromBalance: {
				id: null,
				type: null, // 'spot' | 'money'
				name: 'Select Wallet',
				balance: 0
			},
			toBalance: {
				id: null,
				type: null, // 'spot' | 'money'
				name: 'Select Wallet',
				balance: 0
			},
			accountData: {
				spot_list: [],
				money_list: [],
				spot_data: {},
				money_data: {}
			},
			showAssetSelector: false,
			selectedAsset: {
				id: '',
				name: '',
				currency: '',
				symbol: '',
				icon: '💱'
			},
			assetTypes: []
		};
	},
	computed: {
		theme() {
			return this.$store.getters.theme;
		},
		availableBalance() {
			// Determine the balance based on from wallet type and selected asset
			if (!this.fromBalance || !this.fromBalance.type || !this.selectedAsset || !this.selectedAsset.name) return 0;
			const type = this.fromBalance.type; // 'spot' | 'money'
			const asset = String(this.selectedAsset.name).toLowerCase();
			const data = type === 'spot' ? this.accountData.spot_data : this.accountData.money_data;
			const key = this.getBalanceKey(type, asset);
			const raw = data && data[key];
			const numValue = typeof raw === 'string' ? parseFloat(raw) : typeof raw === 'number' ? raw : 0;
			return isNaN(numValue) ? 0 : Math.max(0, numValue);
		},
		isTransferValid() {
			const amount = parseFloat(this.transferAmount);
			const hasTypes = this.fromBalance.type && this.toBalance.type && this.fromBalance.type !== this.toBalance.type;
			const hasAsset = this.selectedAsset && this.selectedAsset.name;
			return amount > 0 && amount >= 0.01 && amount <= this.availableBalance && hasTypes && hasAsset;
		},
		currency() {
			return this.selectedAsset && this.selectedAsset.currency ? this.selectedAsset.currency : '';
		},
		currencySymbol() {
			return this.selectedAsset && this.selectedAsset.symbol ? this.selectedAsset.symbol : '';
		},
		accountOptions() {
			const out = [];
			(this.accountData.spot_list || []).forEach((i) =>
				out.push({
					compositeId: `spot-${i.id}`,
					id: i.id,
					type: 'spot',
					name: i.wallet
				})
			);
			(this.accountData.money_list || []).forEach((i) =>
				out.push({
					compositeId: `money-${i.id}`,
					id: i.id,
					type: 'money',
					name: i.wallet
				})
			);
			return out;
		}
	},
	mounted() {
		// Set proper translation for initial wallet names
		this.fromBalance.name = this.$t('transfer.selectWallet');
		this.toBalance.name = this.$t('transfer.selectWallet');
	},
	onShow() {
		this.getWallets();
	},
	methods: {
		isTypeDisabled(type) {
			if (this.showFromSelector) {
				return this.toBalance.type === type && this.toBalance.type != null;
			} else if (this.showToSelector) {
				return this.fromBalance.type === type && this.fromBalance.type != null;
			}
			return false;
		},
		selectType(type) {
			// Prevent selecting the same type for From and To
			if (this.showFromSelector && this.toBalance.type === type && this.toBalance.type != null) {
				uni.showToast({ title: this.$t('transfer.sameWalletError'), type: 'error', duration: 2000 });
				return;
			}
			if (this.showToSelector && this.fromBalance.type === type && this.fromBalance.type != null) {
				uni.showToast({ title: this.$t('transfer.sameWalletError'), type: 'error', duration: 2000 });
				return;
			}
			if (this.showFromSelector) {
				this.fromBalance = { id: null, type, name: type === 'money' ? 'Trading' : 'Spot', balance: 0 };
				this.showFromSelector = false;
			} else if (this.showToSelector) {
				this.toBalance = { id: null, type, name: type === 'money' ? 'Trading' : 'Spot', balance: 0 };
				this.showToSelector = false;
			}
			this.showAccountSelector = false;
			// Reset selected asset when changing types to force re-select
			this.selectedAsset = { id: '', name: '', fullName: '', symbol: '', icon: '💱' };
			this.updateAssetTypes();
		},
		async getWallets() {
			if (this.isLoading) return; // Prevent multiple simultaneous calls

			this.isLoading = true;
			try {
				const res = await this.post('/my/get_transfer');
				if (res.code === 1) {
					// Expected shape: { spot_list:[], money_list:[], spot_data:{}, money_data:{} }
					this.accountData = {
						spot_list: res.data.spot_list || [],
						money_list: res.data.money_list || [],
						spot_data: res.data.spot_data || {},
						money_data: res.data.money_data || {}
					};

					// Initialize defaults (static types)
					if (!this.fromBalance.type) {
						this.fromBalance = { id: null, type: 'spot', name: 'Spot', balance: 0 };
					}
					if (!this.toBalance.type) {
						this.toBalance = { id: null, type: 'money', name: 'Trading', balance: 0 };
					}

					// Initialize assets based on selections
					this.updateAssetTypes();
					if (!this.selectedAsset.name && this.assetTypes.length) {
						this.selectAsset(this.assetTypes[0]);
					}
				} else {
					uni.showToast({
						title: res.msg || this.$t('transfer.loadWalletsFailed'),
						type: 'error',
						duration: 2000
					});
				}
			} catch (error) {
				console.error('Error loading wallets:', error);
				uni.showToast({
					title: this.$t('transfer.networkError'),
					type: 'error',
					duration: 2000
				});
			} finally {
				this.isLoading = false;
			}
		},
		formatNumber(number) {
			// Convert string to number if needed
			const numValue = typeof number === 'string' ? parseFloat(number) : number;
			if (typeof numValue !== 'number' || isNaN(numValue)) return '0.00';

			// Use 2 decimal places for USD amounts instead of 8
			return numValue.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
		},

		swapAccounts() {
			if (this.isSwapping) return; // Prevent multiple clicks during animation

			this.isSwapping = true;

			// Start the animation and swap after a delay
			setTimeout(() => {
				const temp = this.fromBalance;
				this.fromBalance = this.toBalance;
				this.toBalance = temp;
				// Update asset list after swapping
				this.updateAssetTypes();

				// Reset animation state
				setTimeout(() => {
					this.isSwapping = false;
				}, 100);
			}, 200);
		},
		openFromSelector() {
			this.showFromSelector = true;
			this.showToSelector = false;
			this.showAccountSelector = true;
		},
		openToSelector() {
			this.showFromSelector = false;
			this.showToSelector = true;
			this.showAccountSelector = true;
		},
		isAccountDisabled(balance) {
			// Check if this account is already selected in the opposite selector
			if (this.showFromSelector) {
				// When selecting "From", disable if it's already selected as "To"
				return this.toBalance.id === balance.id && this.toBalance.type === balance.type;
			} else if (this.showToSelector) {
				// When selecting "To", disable if it's already selected as "From"
				return this.fromBalance.id === balance.id && this.fromBalance.type === balance.type;
			}
			return false;
		},
		selectAccount(balance) {
			// Prevent selection if account is disabled (already selected)
			if (this.isAccountDisabled(balance)) {
				uni.showToast({
					title: this.$t('transfer.sameWalletError'),
					type: 'error',
					icon: true,
					duration: 2000
				});
				return;
			}

			if (this.showFromSelector) {
				this.fromBalance = {
					id: balance.id,
					type: balance.type,
					name: balance.name,
					balance: 0
				};
				this.showFromSelector = false;
			} else if (this.showToSelector) {
				this.toBalance = {
					id: balance.id,
					type: balance.type,
					name: balance.name,
					balance: 0
				};
				this.showToSelector = false;
			}
			this.showAccountSelector = false;
			this.updateAssetTypes();
		},
		setMaxAmount() {
			this.transferAmount = this.availableBalance.toString();
		},
		closeSelectors() {
			this.showFromSelector = false;
			this.showToSelector = false;
		},
		async updateLocalBalances() {
			// Optimistically update local balances before API refresh
			const transferAmount = parseFloat(this.transferAmount);
			// No local lists to update here; balances derive from backend data per asset
		},
		async confirmTransfer() {
			if (!this.isTransferValid || this.isTransferring) return;

			this.isTransferring = true;
			try {
				uni.showLoading({ title: this.$t('transfer.processingTransfer') });

				const assetName = this.selectedAsset && this.selectedAsset.name;
				const res = await this.post('/my/post_transfer', {
					from: this.fromBalance.type,
					to: this.toBalance.type,
					asset: assetName,
					amount: this.transferAmount
				});

				uni.hideLoading();

				if (res.code === 1) {
					// Success - Update local state optimistically
					await this.updateLocalBalances();

					uni.showToast({
						title: this.$t('transfer.transferSuccess'),
						type: 'success',
						icon: true,
						duration: 2000
					});

					// Reset form
					this.transferAmount = '';

					// Refresh wallet data to ensure sync with backend
					await this.getWallets();

					// Navigate to transfer record page
					this.router.push('/pages/transfer/record');
				} else {
					uni.showToast({
						title: res.msg || this.$t('transfer.transferFailed'),
						type: 'error',
						icon: true,
						duration: 2000
					});
				}
			} catch (error) {
				uni.hideLoading();
				console.error('Transfer error:', error);
				uni.showToast({
					title: this.$t('transfer.networkError'),
					type: 'error',
					icon: true,
					duration: 2000
				});
			} finally {
				this.isTransferring = false;
			}
		},
		openAssetSelector() {
			this.updateAssetTypes();
			this.showAssetSelector = true;
		},
		selectAsset(asset) {
			this.selectedAsset = {
				id: asset.id,
				name: asset.name,
				currency: asset.currency,
				symbol: asset.symbol,
				icon: asset.icon
			};
			this.showAssetSelector = false;

			// Show confirmation toast
			uni.showToast({
				title: `${this.$t('transfer.asset.selected')} ${asset.name}`,
				type: 'success',
				duration: 1500
			});
		},
		// Helpers
		getWalletId(type, name) {
			if (!type || !name) return null;
			const list = type === 'spot' ? this.accountData.spot_list : this.accountData.money_list;
			const item = (list || []).find((i) => String(i.name).toUpperCase() === String(name).toUpperCase());
			return item ? item.id : null;
		},
		getIconForAsset(name) {
			const n = String(name).toUpperCase();
			if (n === 'CND' || n === 'Euro') return '🇪🇺';
			if (n === 'US' || n === 'USD') return '🇺🇸';
			if (n === 'USDT') return '₮';
			if (n === 'FOREX' || n === 'FX') return '💱';
			return '💱';
		},
		updateAssetTypes() {
			// Show full list by selected type
			const fromType = this.fromBalance && this.fromBalance.type;
			const toType = this.toBalance && this.toBalance.type;
			const spotList = (this.accountData.spot_list || []).map((i) => ({
				id: i.name,
				name: i.name,
				currency: i.currency,
				symbol: i.symbol,
				icon: this.getIconForAsset(i.name)
			}));
			const moneyList = (this.accountData.money_list || []).map((i) => ({
				id: i.name,
				name: i.name,
				currency: i.currency,
				symbol: i.symbol,
				icon: this.getIconForAsset(i.name)
			}));

			if (fromType) {
				this.assetTypes = fromType === 'spot' ? spotList : moneyList;
				return;
			}
			if (toType) {
				this.assetTypes = toType === 'spot' ? spotList : moneyList;
				return;
			}
			this.assetTypes = [];
		},
		getBalanceKey(type, assetLower) {
			// type: 'spot'|'money', assetLower: 'cnd'|'us'|'usdt'|'forex'
			if (type === 'spot') {
				if (assetLower === 'cnd' || assetLower === 'euro') return 'spot_money_cnd';
				if (assetLower === 'us' || assetLower === 'usd') return 'spot_money_us';
				if (assetLower === 'forex' || assetLower === 'fx' || assetLower === 'usdt') return 'spot_money_forex';
			} else {
				if (assetLower === 'cnd' || assetLower === 'euro') return 'money_cnd';
				if (assetLower === 'us' || assetLower === 'usd') return 'money_us';
				if (assetLower === 'forex' || assetLower === 'fx' || assetLower === 'usdt') return 'money_forex';
			}
			return '';
		},
		getSwapButtonStyle() {
			if (this.isSwapping) {
				return {
					background: this.theme.primary__500
				};
			}
			return {
				background: this.theme.neutral__200
			};
		},
		getMaxButtonStyle() {
			return {
				background: this.theme.primary__500,
				color: this.theme.white
			};
		},
		getAccountItemStyle(type) {
			const isDisabled = this.isTypeDisabled(type);
			if (isDisabled) {
				return {
					background: this.theme.backgroundTertiary,
					border: `2rpx solid ${this.theme.neutral__200}`,
					opacity: 0.5
				};
			}
			return {
				background: this.theme.backgroundCard,
				border: `2rpx solid ${this.theme.neutral__200}`
			};
		},
		getAccountNameStyle(type) {
			const isDisabled = this.isTypeDisabled(type);
			return {
				color: isDisabled ? this.theme.textTertiary : this.theme.textPrimary
			};
		},
		getAssetItemStyle(assetId) {
			const isSelected = this.selectedAsset.id === assetId;
			if (isSelected) {
				return {
					background: this.getColorWithOpacity(this.theme.primary__500, 0.1),
					border: `2rpx solid ${this.theme.primary__500}`
				};
			}
			return {
				background: this.theme.backgroundCard,
				border: `2rpx solid ${this.theme.neutral__200}`
			};
		},
		getColorWithOpacity(color, opacity) {
			if (!color) return 'transparent';
			if (color.startsWith('#')) {
				const r = parseInt(color.slice(1, 3), 16);
				const g = parseInt(color.slice(3, 5), 16);
				const b = parseInt(color.slice(5, 7), 16);
				return `rgba(${r}, ${g}, ${b}, ${opacity})`;
			}
			if (color.startsWith('rgb')) {
				return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
			}
			return color;
		},
		getConfirmButtonStyle() {
			if (this.isTransferValid) {
				return {
					background: this.theme.primary__500,
					color: this.theme.white
				};
			}
			return {
				background: this.theme.textTertiary,
				color: this.theme.white
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.transfer-container {
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.input-placeholder {
	color: inherit;
	opacity: 0.6;
}

.transfer-content {
	flex: 1;
	padding-top: 24rpx;
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.transfer-direction-card {
	border-radius: 16rpx;
	padding: 24rpx;
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.transfer-direction {
		display: flex;
		gap: 16rpx;
		flex-direction: column;
		flex: 1;

		.direction-item {
			display: flex;
			gap: 16rpx;
			padding: 16rpx 0;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			transform-origin: center;

			.direction-label {
				font-size: 24rpx;
				font-weight: 500;
				transition: all 0.3s ease;
				width: 100rpx;
			}

			.direction-value {
				display: flex;
				align-items: center;
				gap: 8rpx;
				cursor: pointer;
				transition: all 0.3s ease;
				transform-origin: center;
				transform: translateY(0);
				opacity: 1;
				justify-content: space-between;
				flex: 1;

				.direction-text {
					font-size: 28rpx;
					font-weight: 600;
					transition: all 0.3s ease;
					opacity: 1;

					&.swapping {
						opacity: 0;
					}
				}

				.balance-info {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					margin-left: auto;
					margin-right: 8rpx;

					.balance-amount {
						font-size: 24rpx;
						font-weight: 500;
					}
				}
			}

			// Different transforms for From and To sections
			&:first-child .direction-text.swapping {
				transform: translateY(100%);
			}

			&:last-child .direction-text.swapping {
				transform: translateY(-100%);
			}
		}
	}

	.swap-button {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		padding: 15rpx;

		&:active {
			transform: scale(0.95);
		}

		&.rotating {
			animation: rotateSwap 0.4s ease-in-out;
		}

		&:hover {
			transform: scale(1.05);
		}
		.swap-icon {
			width: 100%;
			height: 100%;
		}
	}
}

.coin-section,
.amount-section {
	.section-label {
		font-size: 24rpx;
		margin-bottom: 16rpx;
		font-weight: 500;
	}
}

.coin-selector {
	border-radius: 16rpx;
	padding: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	position: relative;

	.coin-info {
		display: flex;
		align-items: center;
		gap: 16rpx;

		.coin-icon {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.coin-symbol {
				font-size: 24rpx;
				font-weight: bold;
			}
		}

		.coin-details {
			display: flex;
			flex-direction: column;
			gap: 4rpx;

			.coin-name {
				font-size: 28rpx;
				font-weight: 600;
			}

			.coin-full-name {
				font-size: 20rpx;
			}
		}
	}
}

.amount-input-container {
	border-radius: 16rpx;
	padding: 24rpx;
	position: relative;

	.amount-limits {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;

		.limit-text {
			font-size: 24rpx;
		}

		.max-section {
			display: flex;
			align-items: center;
			gap: 16rpx;

			.currency-label {
				font-size: 28rpx;
				font-weight: 600;
			}

			.max-button {
				padding: 8rpx 16rpx;
				border-radius: 8rpx;
				font-size: 24rpx;
				font-weight: 600;
				cursor: pointer;
			}
		}
	}

	.amount-input {
		.amount-field {
			width: 100%;
			background: transparent;
			border: none;
			outline: none;
			font-size: 40rpx;
			font-weight: 600;
			padding: 16rpx 0;
			height: 100rpx;

			&::placeholder {
				opacity: 0.6;
			}
		}
	}

	.available-balance {
		.available-text {
			font-size: 24rpx;
		}
	}
}

.bottom-section {
	padding: 24rpx 0 safe-area-inset-bottom;
	padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
	padding-top: 24rpx;

	.confirm-button {
		font-weight: 600;
	}
}

// Modal Styles - Optimized for v-bottom-sheet
.account-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	max-height: 600rpx;
	overflow-y: auto;
	padding: 0; // Remove padding as v-bottom-sheet handles it
}

.account-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
	border-radius: 16rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	margin-bottom: 8rpx;
	position: relative;

	&:active {
		transform: scale(0.98);
	}

	&.disabled {
		opacity: 0.5;
		cursor: not-allowed;

		&:hover {
			transform: none;
		}

		&:active {
			transform: none;
		}
	}

	.account-name {
		font-size: 32rpx;
		font-weight: 600;
	}

	.account-balance {
		font-size: 28rpx;
		font-weight: 500;
	}

	.disabled-indicator {
		position: absolute;
		right: 24rpx;
		top: 50%;
		transform: translateY(-50%);
		padding: 4rpx 12rpx;
		border-radius: 12rpx;

		.disabled-text {
			font-size: 20rpx;
			font-weight: 600;
		}
	}
}

// Asset List Styles
.asset-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	max-height: 600rpx;
	overflow-y: auto;
	padding: 0;
}

.asset-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx;
	border-radius: 16rpx;
	cursor: pointer;
	transition: all 0.3s ease;
	margin-bottom: 8rpx;
	position: relative;

	&:active {
		transform: scale(0.98);
	}

	.asset-info {
		display: flex;
		align-items: center;
		gap: 16rpx;
		flex: 1;

		.asset-icon {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;

			.asset-symbol {
				font-size: 28rpx;
			}
		}

		.asset-details {
			display: flex;
			flex-direction: column;
			gap: 4rpx;

			.asset-name {
				font-size: 32rpx;
				font-weight: 600;
			}

			.asset-full-name {
				font-size: 24rpx;
			}
		}
	}

	.asset-rate {
		margin-right: 16rpx;

		.rate-text {
			font-size: 22rpx;
			font-weight: 500;
		}
	}
}

@keyframes rotateSwap {
	0% {
		transform: rotate(0deg) scale(1);
	}

	25% {
		transform: rotate(90deg) scale(1.1);
	}

	50% {
		transform: rotate(180deg) scale(1.2);
	}

	75% {
		transform: rotate(270deg) scale(1.1);
	}

	100% {
		transform: rotate(360deg) scale(1);
	}
}
</style>
