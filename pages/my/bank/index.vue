<template>
	<view class="min-height-screen flex flex-direction" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
		<app-nav blur :title="$t('my18')"></app-nav>

		<v-container size="md" class="flex-1 flex direction-column">
			<view class="margin-t-20 flex direction-column flex-1">
                <!-- Bank Accounts List -->
                <view v-if="loading" class="flex justify-center align-center" style="padding: 100rpx 0;">
                    <u-loading-icon mode="circle" :color="theme.primary__500"></u-loading-icon>
                </view>

                <view v-else-if="bankAccounts.length === 0" class="empty-state">
                    <image class="empty-icon" src="/static/imgs/my/bank.png" mode="aspectFit"></image>
                    <text class="empty-text" :style="{color: theme.textSecondary}">{{$t('no_bank_accounts')}}</text>
                    <text class="empty-desc" :style="{color: theme.textTertiary}">{{$t('add_first_bank_account') }}</text>
                </view>

                <view v-else class="bank-list">
                    <view
                        v-for="(account, index) in bankAccounts"
                        :key="index"
                        class="bank-item"
                        :style="getBankItemStyle()"
                    >
                        <view class="bank-item-header">
                            <view class="flex align-center">
                                <image
                                    class="bank-icon"
                                    :src="account.bank_type == 2 ? '/static/imgs/my/bank.png' : '/static/imgs/my/credit-card.png'"
                                    mode="aspectFit"
                                ></image>
                                <view class="bank-info-text">
                                    <text v-if="account.bank_type == 1" class="bank-name" :style="{color: theme.textPrimary}">{{account.bank_name || ($t('bank_account'))}}</text>
                                    <text class="bank-type" :style="{color: theme.textTertiary}">
                                        {{account.bank_type == 2 ? (account.chain ? `${$t('usdt_address')} (${account.chain})` : $t('usdt_address')) : ($t('bank_address'))}}
                                    </text>
                                </view>
                            </view>
                            <view @click.stop="editAccount(account)" class="edit-icon-wrapper">
                                <u-icon name="edit-pen" :color="theme.primary__500" size="24"></u-icon>
                            </view>
                        </view>
                        <view class="bank-item-content">
                            <text class="bank-account-number" :style="{color: theme.textPrimary}">
                                {{account.bank_type == 2 ? formatAccountNumber(account.usdt_address) : formatAccountNumber(account.card_num)}}
                            </text>
                            <text v-if="account.bank_type == 1 && account.username" class="bank-username" :style="{color: theme.textSecondary}">
                                {{account.username}}
                            </text>
                        </view>
                    </view>
                </view>

                <!-- Add New Button -->
                <view class="margin-t-24">
                    <view @click="goToAdd" class="add-btn" :style="{background: theme.primary__500, color: theme.white}">
                        <u-icon name="plus" :color="theme.white" size="24"></u-icon>
                        <text class="add-btn-text" :style="{color: theme.white}">{{$t('add_bank_account') }}</text>
                    </view>
                </view>
            </view>
		</v-container>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bankAccounts: [],
				loading: true,
			}
		},
		onLoad() {
			this.loadBankAccounts()
		},
		onShow() {
			// Reload when page is shown (e.g., after adding/editing)
			this.loadBankAccounts()
		},
        computed: {
            theme(){
                return this.$store.getters.theme
            }
        },
		methods: {
			loadBankAccounts(){
				this.loading = true
				this.post('/my/collection_list').then(res => {
					this.loading = false
					if (res.code == 1 && res.data) {
						let accounts = []

						// Handle back_card array (bank accounts, bank_type = 1)
						if (res.data.back_card && Array.isArray(res.data.back_card)) {
							const bankAccounts = res.data.back_card.map(item => ({
								id: item.id,
								bank_type: 1,
								bank_name: item.bank_name || '',
								card_num: item.bank_number || '',
								username: item.bank_zhi || '',
								mobile: item.mobile || ''
							}))
							accounts = accounts.concat(bankAccounts)
						}

						// Handle ctypto array (USDT addresses, bank_type = 2)
						if (res.data.ctypto && Array.isArray(res.data.ctypto)) {
							const cryptoAccounts = res.data.ctypto.map(item => ({
								id: item.id,
								bank_type: 2,
								usdt_address: item.address || '',
								chain: item.chain || '',
								bank_name: '' // Crypto accounts might not have bank_name
							}))
							accounts = accounts.concat(cryptoAccounts)
						}

						this.bankAccounts = accounts
					} else {
						this.bankAccounts = []
					}
				}).catch(err => {
					this.loading = false
					console.error('Failed to load bank accounts:', err)
					this.bankAccounts = []
				})
			},
			goToAdd(){
				uni.navigateTo({
					url: '/pages/my/bank/add'
				})
			},
			editAccount(account){
				// Encode account data as URL parameters
				let url = '/pages/my/bank/add?'
				const params = []

				if (account.id) params.push(`id=${encodeURIComponent(account.id)}`)
				// Convert bank_type to number (handle both string and number from API)
				const bankType = parseInt(account.bank_type) || 1
				params.push(`bank_type=${bankType}`)
				params.push(`bank_name=${encodeURIComponent(account.bank_name || '')}`)

				if (bankType == 2) {
					params.push(`usdt_address=${encodeURIComponent(account.usdt_address || account.card_num || '')}`)
					if (account.chain) {
						params.push(`chain=${encodeURIComponent(account.chain)}`)
					}
				} else {
					params.push(`username=${encodeURIComponent(account.username || '')}`)
					params.push(`card_num=${encodeURIComponent(account.card_num || '')}`)
					params.push(`mobile=${encodeURIComponent(account.mobile || '')}`)
				}

				url += params.join('&')

				uni.navigateTo({
					url: url
				})
			},
			getBankItemStyle() {
				return {
					background: this.theme.backgroundCard,
					borderColor: this.theme.neutral__200
				}
			},
			formatAccountNumber(address) {
				if (!address) return ''
				if (address.length <= 8) return address
				var temp = address.replace(address.substring(4, address.length - 4), "****")
				return temp
			},
		}
	}
</script>

<style lang="scss" scoped>
	.min-height-screen {
		min-height: 100vh;
	}

	.add-btn {
		width: 100%;
		height: 86rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12rpx;
		font-size: 28rpx;
	}

	.add-btn-text {
		font-size: 28rpx;
		font-weight: 500;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 40rpx;
	}

	.empty-icon {
		width: 120rpx;
		height: 120rpx;
		opacity: 0.5;
		margin-bottom: 32rpx;
	}

	.empty-text {
		font-size: 32rpx;
		font-weight: 500;
		margin-bottom: 16rpx;
	}

	.empty-desc {
		font-size: 24rpx;
		text-align: center;
	}

	.bank-list {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
	}

	.bank-item {
		border-radius: 16rpx;
		padding: 32rpx;
		border: 1rpx solid;
		transition: all 0.3s ease;
	}

	.bank-item-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}

	.bank-icon {
		width: 56rpx;
		height: 56rpx;
		margin-right: 20rpx;
	}

	.bank-info-text {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
		flex: 1;
	}

	.bank-name {
		font-size: 30rpx;
		font-weight: 600;
	}

	.bank-type {
		font-size: 24rpx;
	}

	.bank-item-content {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.bank-account-number {
		font-size: 32rpx;
		font-weight: 600;
		letter-spacing: 2rpx;
	}

	.bank-username {
		font-size: 26rpx;
	}

	.edit-icon-wrapper {
		padding: 8rpx;
		border-radius: 8rpx;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.edit-icon-wrapper:active {
		opacity: 0.7;
		transform: scale(0.95);
		background: rgba(0, 0, 0, 0.05);
	}
</style>

