<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary}">
		<app-nav blur :title="$t('my10')"></app-nav>

		<v-container size="md">
            <!-- Tabs -->
            <view class="tabs-container">
                <view
                    class="tab-item"
                    :class="{ 'active': activeTab == 1 }"
                    @click="activeTab = 1"
                    :style="getTabStyle(1)"
                >
                    <text class="tab-text" :style="getTabTextStyle(1)">{{$t('bank_tab')}}</text>
                </view>
                <view
                    class="tab-item"
                    :class="{ 'active': activeTab == 2 }"
                    @click="activeTab = 2"
                    :style="getTabStyle(2)"
                >
                    <text class="tab-text" :style="getTabTextStyle(2)">{{$t('currency_tab')}}</text>
                </view>
            </view>
            <!-- Withdraw Card Section -->
            <view class="padding-c-20">
                <view
                    class="withdraw-card" :style="getWithdrawCardStyle()">
                    <view class="withdraw-icon">
                        <image
                            src="/static/imgs/my/wallet.png"
                            style="width: 90rpx; height: 90rpx; object-fit: contain;"
                            mode="aspectFit"
                        />
                    </view>
                    <text class="font-26" :style="{color: theme.textSecondary}">{{$t('my53')}}</text>
                    <!-- Show both CAD and USD for Bank tab, USDT for Currency tab -->
                    <template v-if="activeTab == 1">
                        <view class="font-28 weight-bold margin-t-20" :style="{color: theme.textPrimary}">
                            €: {{ formatNumber(spot_money_cnd) }}
                        </view>
                        <view class="font-28 weight-bold margin-t-10" :style="{color: theme.textPrimary}">
                            USD: {{ formatNumber(spot_money_us) }}
                        </view>
                    </template>
                    <template v-else>
                        <view class="font-28 weight-bold margin-t-20" :style="{color: theme.textPrimary}">
                            USDT: {{ formatNumber(spot_money_usdt) }}
                        </view>
                    </template>
                </view>
            </view>
            <!-- Bank Account / Currency Selector Section -->
            <view class="padding-c-20">
                <!-- Bank Account Selector (Tab 1) -->
                <view
                    v-if="activeTab == 1"
                    @click="showBankSelector = true"
                    class="flex align-center justify-between margin-b-16"
                    :style="getBankCardStyle()"
                >
                    <view class="flex align-center">
                        <image
                            src="/static/imgs/my/card.png"
                            style="width: 44rpx; height: 28rpx; margin-right: 18rpx; object-fit: contain;"
                            mode="aspectFit"
                        />
                        <view class="flex flex-direction">
                            <text class="font-28" :style="{color: theme.textPrimary}">
                                {{selectedBankAccount ? (selectedBankAccount.bank_name || $t('BankAccount1')) : $t('BankAccount1')}}
                            </text>
                            <text v-if="selectedBankAccount" class="font-24 margin-t-4" :style="{color: theme.textTertiary}">
                                {{formatAccountNumber(selectedBankAccount.bank_number)}}
                            </text>
                        </view>
                    </view>
                    <u-icon name="arrow-down" :color="theme.textTertiary" size="23"></u-icon>
                </view>

                <!-- Currency Selector (Tab 1) -->
                <view
                    v-if="activeTab == 1"
                    @click="showCurrencySelector = true"
                    class="flex align-center justify-between"
                    :style="getBankCardStyle()"
                >
                    <view class="flex align-center">
                        <view class="flex flex-direction">
                            <text class="font-28" :style="{color: theme.textPrimary}">
                                {{selectedCurrency ? selectedCurrency.name : $t('select_wallet')}}
                            </text>
                            <text v-if="selectedCurrency" class="font-24 margin-t-4" :style="{color: theme.textTertiary}">
                                {{$t('balance')}}: {{formatNumber(selectedCurrency.balance || 0)}}
                            </text>
                        </view>
                    </view>
                    <u-icon name="arrow-down" :color="theme.textTertiary" size="23"></u-icon>
                </view>

                <!-- Crypto Address Selector (Tab 2) -->
                <view
                    v-else
                    @click="showCryptoSelector = true"
                    class="flex align-center justify-between"
                    :style="getBankCardStyle()"
                >
                    <view class="flex align-center">
                        <image
                            src="/static/imgs/my/bank.png"
                            style="width: 44rpx; height: 28rpx; margin-right: 18rpx; object-fit: contain;"
                            mode="aspectFit"
                        />
                        <view class="flex flex-direction">
                            <text class="font-28" :style="{color: theme.textPrimary}">
                                {{selectedCrypto ? $t('usdt_address') : $t('select_crypto_address')}}
                            </text>
                            <text v-if="selectedCrypto" class="font-24 margin-t-4" :style="{color: theme.textTertiary}">
                                {{formatAccountNumber(selectedCrypto.address)}}
                            </text>
                            <text v-if="selectedCrypto && selectedCrypto.chain" class="font-24 margin-t-4" :style="{color: theme.textSecondary}">
                                {{selectedCrypto.chain}}
                            </text>
                        </view>
                    </view>
                    <u-icon name="arrow-down" :color="theme.textTertiary" size="23"></u-icon>
                </view>
            </view>

            <view class="">
                <view class="padding-w-20 margin-20-auto radiu-15" :style="{background: theme.backgroundCard}">
                    <view class="margin-b-20 padding-c-20">
                        <text class="font-28" :style="{color: theme.textTertiary}">{{$t('my59')}}:</text>
                    </view>
                    <view class="radiu-8 height-86 padding-w-20 flex align-center justify-between margin-b-24"
                          :style="{background: theme.backgroundTertiary}">
                        <input class="height-76 line-height-76 flex-1 font-28" :style="{color: theme.textPrimary}" type="text" v-model="wi_num"
                               :placeholder="$t('my60')" placeholder-class="input-placeholder" />
                         <text @click="setMaxAmount" class="font-25 padding-15 radiu-10" :style="getMaxButtonStyle()">{{$t('my61')}}</text>
                    </view>
                    <view class="margin-b-20">
                        <text class="font-28" :style="{color: theme.textTertiary}">{{$t('my62')}}:</text>
                    </view>
                    <view class="radiu-8 height-86 padding-w-20 flex align-center justify-between"
                          :style="{background: theme.backgroundTertiary}">
                        <input class="height-76 line-height-76 flex-1 font-28" :style="{color: theme.textPrimary}" type="text" password
                               v-model="pay_pwd" :placeholder="$t('my63')" placeholder-class="input-placeholder" />
                    </view>

                    <view @click="tixian" class="margin-c-20 height-80 radiu-8 flex align-center justify-center"
                          :style="{background: theme.primary__500, color: theme.white}">
                        <text class="font-28" :style="{color: theme.white}">{{$t('my64')}}</text>
                    </view>
                    <view class="padding-c-20 margin-b-20">
                        <view class="font-28 content-wrapper" :style="{color: theme.textPrimary}" v-html="width_desc"></view>
                    </view>
                </view>

            </view>
        </v-container>

        <!-- Bank Account Selector Bottom Sheet -->
        <v-bottom-sheet
            v-model="showBankSelector"
            :height="600"
            :textColor="theme.textPrimary"
            :backgroundColor="theme.backgroundCard"
            :closeOnBackdrop="true"
        >
            <view class="selector-list">
                <view
                    v-for="(account, index) in bankAccounts"
                    :key="index"
                    class="selector-item"
                    :class="{ 'selected': isBankSelected(account.id) }"
                    @click="selectBankAccount(account)"
                    :style="getSelectorItemStyle(account.id, 'bank')"
                >
                    <view class="selector-item-info">
                        <image
                            class="selector-icon"
                            src="/static/imgs/my/credit-card.png"
                            mode="aspectFit"
                        />
                        <view class="selector-item-details">
                            <text class="selector-item-title" :style="{color: theme.textPrimary}">
                                {{account.bank_name || $t('bank_account')}}
                            </text>
                            <text class="selector-item-subtitle" :style="{color: theme.textTertiary}">
                                {{formatAccountNumber(account.bank_number)}}
                            </text>
                        </view>
                    </view>
                    <view v-if="isBankSelected(account.id)" class="selected-indicator">
                        <u-icon name="checkmark" :color="theme.primary__500" size="24"></u-icon>
                    </view>
                </view>
                <view v-if="bankAccounts.length === 0" class="empty-selector">
                    <text class="empty-selector-text" :style="{color: theme.textTertiary}">{{$t('no_bank_accounts')}}</text>
                </view>
            </view>
        </v-bottom-sheet>

        <!-- Currency Selector Bottom Sheet -->
        <v-bottom-sheet
            v-model="showCurrencySelector"
            :height="600"
            :textColor="theme.textPrimary"
            :backgroundColor="theme.backgroundCard"
            :closeOnBackdrop="true"
        >
            <view class="selector-list">
                <view
                    v-for="(currency, index) in currencies"
                    :key="index"
                    class="selector-item"
                    :class="{ 'selected': isCurrencySelected(currency.type) }"
                    @click="selectCurrency(currency)"
                    :style="getSelectorItemStyle(currency.type, 'currency')"
                >
                    <view class="selector-item-info">
                        <view class="selector-item-details">
                            <text class="selector-item-title" :style="{color: theme.textPrimary}">{{ currency.name }}</text>
                            <text class="selector-item-subtitle" :style="{color: theme.textTertiary}">
                                {{$t('balance')}}: {{formatNumber(currency.balance || 0)}}
                            </text>
                        </view>
                    </view>
                    <view v-if="isCurrencySelected(currency.type)" class="selected-indicator">
                        <u-icon name="checkmark" :color="theme.primary__500" size="24"></u-icon>
                    </view>
                </view>
                <view v-if="currencies.length === 0" class="empty-selector">
                    <text class="empty-selector-text" :style="{color: theme.textTertiary}">{{$t('no_currencies')}}</text>
                </view>
            </view>
        </v-bottom-sheet>

        <!-- Crypto Address Selector Bottom Sheet -->
        <v-bottom-sheet
            v-model="showCryptoSelector"
            :height="600"
            :textColor="theme.textPrimary"
            :backgroundColor="theme.backgroundCard"
            :closeOnBackdrop="true"
        >
            <view class="selector-list">
                <view
                    v-for="(crypto, index) in cryptoAddresses"
                    :key="index"
                    class="selector-item"
                    :class="{ 'selected': isCryptoSelected(crypto.id) }"
                    @click="selectCrypto(crypto)"
                    :style="getSelectorItemStyle(crypto.id, 'crypto')"
                >
                    <view class="selector-item-info">
                        <image
                            class="selector-icon"
                            src="/static/imgs/my/bank.png"
                            mode="aspectFit"
                        />
                        <view class="selector-item-details">
                            <text class="selector-item-title" :style="{color: theme.textPrimary}">
                                {{$t('usdt_address')}}
                            </text>
                            <text class="selector-item-subtitle" :style="{color: theme.textTertiary}">
                                {{formatAccountNumber(crypto.address)}}
                            </text>
                            <text v-if="crypto.chain" class="selector-item-extra" :style="{color: theme.textSecondary}">
                                {{crypto.chain}}
                            </text>
                        </view>
                    </view>
                    <view v-if="isCryptoSelected(crypto.id)" class="selected-indicator">
                        <u-icon name="checkmark" :color="theme.primary__500" size="24"></u-icon>
                    </view>
                </view>
                <view v-if="cryptoAddresses.length === 0" class="empty-selector">
                    <text class="empty-selector-text" :style="{color: theme.textTertiary}">{{$t('no_crypto_addresses')}}</text>
                </view>
            </view>
        </v-bottom-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBar: uni.getSystemInfoSync().statusBarHeight,
				min_width: 0,
				money: 0,
				username: '',
				bank_name: '',
				card_num: '',
				ifsc: '',
				pay_pwd: '',
				wi_num: '',
				width_desc:"",
				flag: true,
				activeTab: 1,
				// Bank account selector
				bankAccounts: [],
				selectedBankAccount: null,
				showBankSelector: false,
				// Currency selector
				currencies: [],
				selectedCurrency: null,
				showCurrencySelector: false,
				// Crypto address selector
				cryptoAddresses: [],
				selectedCrypto: null,
				showCryptoSelector: false,
				// Spot money balances
				spot_money_cnd: 0,
				spot_money_us: 0,
				spot_money_usdt: 0
			};
		},
		onShow() {
			this.width_con()
		},
		watch: {
			activeTab(newTab) {
				// Reset selections when switching tabs
				if (newTab == 1) {
					this.selectedCrypto = null
				} else {
					this.selectedBankAccount = null
					this.selectedCurrency = null
				}
				// Clear form fields when switching tabs
				this.wi_num = ''
				this.pay_pwd = ''
				// Update money display based on selected currency
				this.updateMoneyDisplay()
			},
			selectedCurrency(newCurrency) {
				// Clear form fields when changing wallet selection
				this.wi_num = ''
				this.pay_pwd = ''
				this.updateMoneyDisplay()
			}
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			},
		},
		methods: {
			tixian() {
				if (!this.flag) return
				if (this.wi_num == '') return this.tos(this.$t('my60'))
				if (this.pay_pwd == '') return this.tos(this.$t('my63'))

				// Validate selection based on active tab
				if (this.activeTab == 1) {
					if (!this.selectedBankAccount) {
						return this.tos(this.$t('please_select_bank_account'))
					}
					if (!this.selectedCurrency) {
						return this.tos(this.$t('please_select_currency'))
					}
				} else {
					if (!this.selectedCrypto) {
						return this.tos(this.$t('please_select_crypto_address'))
					}
				}

				this.flag = false
				const postData = {
					type: this.activeTab, // 1 for Bank, 2 for Currency
					price: this.wi_num,
					pay_pwd: this.pay_pwd
				}

				// Add bank account or currency info based on active tab
				if (this.activeTab == 1) {
					// Bank withdrawal - need both bank account id and wallet type
					postData.id = this.selectedBankAccount.id
					postData.wallet_type = this.selectedCurrency.type // wallet type: 'ca' or 'usd'
				} else {
					// Crypto withdrawal
					postData.id = this.selectedCrypto.id
				}

				this.post('/my/width_sub', postData, true).then(res => {
					this.flag = true
					if (res.code == 1) {
						this.tos(res.msg)
						this.wi_num = ''
						this.pay_pwd = ''
					}
				})
			},
			width_con() {
				this.post('/my/width_con').then(res => {
					if (res.code == 1 && res.data) {
						this.min_width = res.data.min_width
						this.width_desc = res.data.width_desc

						// Store spot money balances
						this.spot_money_cnd = parseFloat(res.data.spot_money_cnd) || 0
						this.spot_money_us = parseFloat(res.data.spot_money_us) || 0
						this.spot_money_usdt = parseFloat(res.data.spot_money_usdt) || 0

						// Load bank accounts from bank_card.bank (only banks, not crypto)
						if (res.data.bank_card && res.data.bank_card.bank && Array.isArray(res.data.bank_card.bank)) {
							// Filter to only show banks (type == 1 or no type field means it's a bank)
							this.bankAccounts = res.data.bank_card.bank.filter(account => !account.type || account.type == 1)

							// Auto-select first bank account if none selected
							if (!this.selectedBankAccount && this.bankAccounts.length > 0) {
								this.selectedBankAccount = this.bankAccounts[0]
							}
						} else {
							this.bankAccounts = []
						}

						// Load currencies from bank_card.wallet_type (for Tab 1)
						if (res.data.bank_card && res.data.bank_card.wallet_type && Array.isArray(res.data.bank_card.wallet_type)) {
							this.currencies = res.data.bank_card.wallet_type

							// Auto-select first currency if none selected
							if (!this.selectedCurrency && this.currencies.length > 0) {
								this.selectedCurrency = this.currencies[0]
							}
						} else {
							this.currencies = []
						}

						// Load crypto addresses from ctypto.address_list (for Tab 2)
						if (res.data.ctypto && res.data.ctypto.address_list && Array.isArray(res.data.ctypto.address_list)) {
							this.cryptoAddresses = res.data.ctypto.address_list

							// Auto-select first crypto address if none selected
							if (!this.selectedCrypto && this.cryptoAddresses.length > 0) {
								this.selectedCrypto = this.cryptoAddresses[0]
							}
						} else {
							this.cryptoAddresses = []
						}

						// Update money display
						this.updateMoneyDisplay()
					}
				})
			},
			updateMoneyDisplay() {
				// This method is no longer needed as we display balances directly in template
				// But keeping it for potential future use
			},
			setMaxAmount() {
				if (this.activeTab == 1) {
					// Bank tab - use balance from selected wallet type
					if (this.selectedCurrency) {
						if (this.selectedCurrency.type === 'ca') {
							this.wi_num = this.formatNumber(this.spot_money_cnd || 0)
						} else if (this.selectedCurrency.type === 'usd') {
							this.wi_num = this.formatNumber(this.spot_money_us || 0)
						} else {
							this.wi_num = this.formatNumber(this.spot_money_cnd || 0)
						}
					} else {
						// Default to CAD if no wallet selected
						this.wi_num = this.formatNumber(this.spot_money_cnd || 0)
					}
				} else {
					// Currency tab - use USDT balance
					this.wi_num = this.formatNumber(this.spot_money_usdt || 0)
				}
			},
			getWithdrawCardStyle() {
				return {
					background: `linear-gradient(135deg, ${this.theme.primary__50}, ${this.theme.success__100})`
				}
			},
			getBankCardStyle() {
				return {
					background: this.theme.backgroundCard,
					borderRadius: '16rpx',
					border: `1rpx solid ${this.theme.neutral__200}`,
					boxShadow: '0 2rpx 12rpx 0 rgba(0,0,0,0.04)',
					padding: '24rpx 32rpx',
					minHeight: '80rpx'
				}
			},
			getMaxButtonStyle() {
				return {
					background: this.theme.primary__500,
					color: this.theme.white
				}
			},
			getTabStyle(tabNum) {
				if (this.activeTab == tabNum) {
					return {
						background: this.theme.primary__500,
						borderColor: this.theme.primary__500
					}
				}
				return {
					background: this.theme.backgroundTertiary,
					borderColor: this.theme.neutral__200
				}
			},
			getTabTextStyle(tabNum) {
				if (this.activeTab == tabNum) {
					return {
						color: this.theme.white
					}
				}
				return {
					color: this.theme.textPrimary
				}
			},
			// Select bank account
			selectBankAccount(account) {
				this.selectedBankAccount = account
				this.showBankSelector = false
			},
			// Select currency
			selectCurrency(currency) {
				this.selectedCurrency = currency
				this.showCurrencySelector = false
			},
			// Select crypto address
			selectCrypto(crypto) {
				this.selectedCrypto = crypto
				this.showCryptoSelector = false
			},
			// Check if bank account is selected
			isBankSelected(accountId) {
				return this.selectedBankAccount && this.selectedBankAccount.id === accountId
			},
			// Check if currency is selected
			isCurrencySelected(currencyType) {
				return this.selectedCurrency && this.selectedCurrency.type === currencyType
			},
			// Check if crypto address is selected
			isCryptoSelected(cryptoId) {
				return this.selectedCrypto && this.selectedCrypto.id === cryptoId
			},
			// Get selector item style
			getSelectorItemStyle(itemId, type) {
				let isSelected = false
				if (type === 'bank') {
					isSelected = this.isBankSelected(itemId)
				} else if (type === 'currency') {
					isSelected = this.isCurrencySelected(itemId)
				} else if (type === 'crypto') {
					isSelected = this.isCryptoSelected(itemId)
				}
				if (isSelected) {
					return {
						background: this.theme.primary__50,
						borderColor: this.theme.primary__500
					}
				}
				return {
					background: this.theme.backgroundCard,
					borderColor: this.theme.neutral__200
				}
			},
			// Format account number
			formatAccountNumber(address) {
				if (!address) return ''
				if (address.length <= 8) return address
				var temp = address.replace(address.substring(4, address.length - 4), "****")
				return temp
			},
			// Format number
			formatNumber(number) {
				if (number === null || number === undefined || number === '') return '0.00'
				const num = parseFloat(number)
				if (isNaN(num)) return '0.00'
				return num.toFixed(2)
			}
		}
	}
</script>

<style lang="scss" scoped>
.min-height-screen {
	min-height: 100vh;
}

.withdraw-card {
    border-radius: 20rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, 0.1);
    padding: 32rpx 28rpx;
    position: relative;
    overflow: hidden;
    min-height: 180rpx;
    backdrop-filter: blur(20rpx);

  .withdraw-icon {
    position: absolute;
    right: 32rpx;
    top: 32rpx;
    opacity: 0.18
  }
}

.input-placeholder {
	color: inherit;
	opacity: 0.6;
}

.content-wrapper {
	:deep(p) {
		color: inherit;
	}
	:deep(span) {
		color: inherit;
	}
	:deep(div) {
		color: inherit;
	}
	:deep(img) {
		max-width: 100%;
		height: auto;
	}
}

.tabs-container {
	display: flex;
	gap: 20rpx;
	margin-bottom: 24rpx;
}

.tab-item {
	flex: 1;
	height: 80rpx;
	border-radius: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1rpx solid;
	transition: all 0.3s ease;
}

.tab-item.active {
	transform: scale(1.02);
}

.tab-text {
	font-size: 28rpx;
	font-weight: 500;
}

.selector-list {
	max-height: 500rpx;
	overflow-y: auto;
}

.selector-item {
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 16rpx;
	border: 1rpx solid;
	display: flex;
	align-items: center;
	justify-content: space-between;
	transition: all 0.3s ease;
}

.selector-item.selected {
	transform: scale(1.02);
}

.selector-item-info {
	display: flex;
	align-items: center;
	flex: 1;
}

.selector-icon {
	width: 48rpx;
	height: 48rpx;
	margin-right: 20rpx;
}

.selector-item-details {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	flex: 1;
}

.selector-item-title {
	font-size: 30rpx;
	font-weight: 600;
}

.selector-item-subtitle {
	font-size: 26rpx;
}

.selector-item-extra {
	font-size: 24rpx;
}

.selected-indicator {
	display: flex;
	align-items: center;
	justify-content: center;
}

.empty-selector {
	padding: 60rpx 20rpx;
	text-align: center;
}

.empty-selector-text {
	font-size: 28rpx;
}
</style>
