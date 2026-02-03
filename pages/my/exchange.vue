<template>
    <view class="exchange-page" :style="{background: theme.backgroundPrimary}">
        <bg-animate-shape/>
        <app-nav blur :title="$t('Exhange')" show-right-image
        right-image-url="/static/imgs/fund/record.png"
                 @right-action="router.push('/pages/my/exchange_history')"></app-nav>

        <v-container size="md">
            <view class="exchange-container">
                <!-- Exchange Rate Display -->
                <view class="rate-display-card" :style="getCardStyle()">
                    <text class="rate-text" :style="{color: theme.textSecondary}">
                        1 {{ (fromCurrency && fromCurrency.code) || '---' }} = {{ exchangeRate }} {{ (toCurrency && toCurrency.code) || '---' }}
                    </text>
                </view>

                <!-- Currency Exchange Container -->
                <view class="currency-exchange-wrapper">
                    <!-- From Currency Section -->
                    <view class="currency-section">
                        <view class="currency-selector" @click="openCurrencySelector('from')" :style="getSelectorStyle()">
                            <view class="currency-info">
                                <image class="currency-flag" :src="(fromCurrency && fromCurrency.flag) || ''" mode="aspectFill"></image>
                                <view class="currency-details">
                                    <text class="currency-code" :style="{color: theme.textPrimary}">{{ (fromCurrency && fromCurrency.code) || '---' }}</text>
                                    <text class="currency-name" :style="{color: theme.textTertiary}">{{ (fromCurrency && fromCurrency.name) || '---' }}</text>
                                </view>
                            </view>
                            <u-icon name="arrow-down" :color="theme.textTertiary" size="20"></u-icon>
                        </view>
                        <view class="balance-display" :style="getSelectorStyle()">
                            <text class="balance-label" :style="{color: theme.textTertiary}">{{ $t('balance') || 'Balance' }}</text>
                            <text class="balance-amount" :style="{color: theme.textPrimary}">
                                {{ (fromCurrency && fromCurrency.symbol) || '$' }} {{ formatNumber((fromCurrency && fromCurrency.balance) || 0) }}
                            </text>
                        </view>
                    </view>

                    <!-- Swap Button -->
                    <view class="swap-button-container">
                        <view class="swap-button" :class="{ 'rotate-animation': isRotating }" @click="swapCurrencies" :style="getSwapButtonStyle()">
                            <image class="swap-icon" src="/static/imgs/my/exchange.png" mode="aspectFit"></image>
                        </view>
                    </view>

                    <!-- To Currency Section -->
                    <view class="currency-section">
                        <view class="currency-selector" @click="openCurrencySelector('to')" :style="getSelectorStyle()">
                            <view class="currency-info">
                                <image class="currency-flag" :src="(toCurrency && toCurrency.flag) || ''" mode="aspectFill"></image>
                                <view class="currency-details">
                                    <text class="currency-code" :style="{color: theme.textPrimary}">{{ (toCurrency && toCurrency.code) || '---' }}</text>
                                    <text class="currency-name" :style="{color: theme.textTertiary}">{{ (toCurrency && toCurrency.name) || '---' }}</text>
                                </view>
                            </view>
                            <u-icon name="arrow-down" :color="theme.textTertiary" size="20"></u-icon>
                        </view>
                        <view class="balance-display" :style="getSelectorStyle()">
                            <text class="balance-label" :style="{color: theme.textTertiary}">{{ $t('balance') || 'Balance' }}</text>
                            <text class="balance-amount" :style="{color: theme.textPrimary}">
                                {{ (toCurrency && toCurrency.symbol) || '$' }} {{ formatNumber((toCurrency && toCurrency.balance) || 0) }}
                            </text>
                        </view>
                    </view>
                </view>

                <!-- Amount Input Section -->
                <view class="amount-section" :style="getCardStyle()">
                    <view class="amount-header">
                        <text class="amount-label" :style="{color: theme.textPrimary}">{{ $t('amount1') || 'Amount' }}</text>
                        <view class="quick-amount-buttons">
                            <view
                                v-for="percent in quickAmounts"
                                :key="percent"
                                class="quick-amount-btn"
                                @click="setQuickAmount(percent)"
                                :style="getQuickAmountStyle()"
                            >
                                <text class="quick-amount-text" :style="{color: theme.primary__500}">{{ percent }}%</text>
                            </view>
                        </view>
                    </view>
                    <view class="amount-input-container" :style="getInputContainerStyle()">
                        <text class="currency-symbol-input" :style="{color: theme.textPrimary}">{{ (fromCurrency && fromCurrency.symbol) || '$' }}</text>
                        <input
                            class="amount-input"
                            type="number"
                            v-model="inputAmount"
                            :placeholder="$t('amount') || 'Enter amount'"
                            placeholder-class="input-placeholder"
                            :style="{color: theme.textPrimary}"
                            @input="calculateResult"
                        />
                    </view>
                    <view class="converted-amount">
                        <text class="converted-label" :style="{color: theme.textTertiary}">≈</text>
                        <text class="converted-value" :style="{color: theme.textPrimary}">
                            {{ (toCurrency && toCurrency.symbol) || '$' }} {{ formatNumber(convertedAmount) }}
                        </text>
                    </view>
                </view>

                <!-- Submit Button -->
                <view class="submit-section">
                    <u-button
                        :disabled="!canSubmit"
                        type="primary"
                        shape="circle"
                        size="large"
                        @click="handleSubmit"
                        :style="getSubmitButtonStyle()"
                    >
                        <text class="submit-text">{{ $t('Submit') || 'Submit' }}</text>
                    </u-button>
                </view>
            </view>
        </v-container>

        <!-- Currency Selector Bottom Sheet -->
        <v-bottom-sheet
            v-model="showCurrencySelector"
            :title="$t('select_currency') || 'Select Currency'"
            :backgroundColor="theme.backgroundCard"
            :textColor="theme.textPrimary"
            :closeOnBackdrop="true"
        >
            <view class="currency-list">
                <view
                    v-for="currency in availableCurrencies"
                    :key="currency.id"
                    class="currency-item"
                    :class="{ 'selected': isSelected(currency.id) }"
                    @click="selectCurrency(currency)"
                    :style="getCurrencyItemStyle(currency.id)"
                >
                    <view class="currency-item-info">
                        <image class="currency-item-flag" :src="currency.flag" mode="aspectFill"></image>
                        <view class="currency-item-details">
                            <text class="currency-item-code" :style="{color: theme.textPrimary}">{{ currency.code }}</text>
                            <text class="currency-item-name" :style="{color: theme.textTertiary}">{{ currency.name }}</text>
                            <text class="currency-item-balance" :style="{color: theme.textSecondary}">
                                {{ $t('balance') || 'Balance' }}: {{ (currency.symbol) || '$' }} {{ formatNumber((currency.balance) || 0) }}
                            </text>
                        </view>
                    </view>
                    <view v-if="isSelected(currency.id)" class="selected-indicator">
                        <u-icon name="checkmark" :color="theme.primary__500" size="24"></u-icon>
                    </view>
                </view>
            </view>
        </v-bottom-sheet>
    </view>
</template>

<script>
export default {
    name: 'Exchange',
    data() {
        return {
            currencies: [],
            exchangeRates: {},
            fromCurrencyId: null,
            toCurrencyId: null,
            inputAmount: '',
            convertedAmount: 0,
            showCurrencySelector: false,
            selectorType: 'from', // 'from' or 'to'
            quickAmounts: [25, 50, 75, 100],
            isRotating: false
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        },
        fromCurrency() {
            if (this.currencies.length === 0) {
                return { code: '', name: '', symbol: '', flag: '', balance: 0 }
            }
            return this.currencies.find(c => c.id === this.fromCurrencyId) || this.currencies[0] || { code: '', name: '', symbol: '', flag: '', balance: 0 }
        },
        toCurrency() {
            if (this.currencies.length === 0) {
                return { code: '', name: '', symbol: '', flag: '', balance: 0 }
            }
            return this.currencies.find(c => c.id === this.toCurrencyId) || this.currencies[1] || this.currencies[0] || { code: '', name: '', symbol: '', flag: '', balance: 0 }
        },
        availableCurrencies() {
            // Filter out the currently selected currency from the opposite side
            if (this.selectorType === 'from') {
                return this.currencies.filter(c => c.id !== this.toCurrencyId)
            } else {
                return this.currencies.filter(c => c.id !== this.fromCurrencyId)
            }
        },
        exchangeRate() {
            if (!this.fromCurrency || !this.toCurrency) return '1.0000'
            const fromCode = this.fromCurrency.code
            const toCode = this.toCurrency.code
            const key = `${fromCode}_to_${toCode}`
            const rate = this.exchangeRates[key] || 1
            return parseFloat(rate).toFixed(4)
        },
        canSubmit() {
            if (!this.fromCurrency) return false
            const amount = this.parseNumber(this.inputAmount)
            const balance = parseFloat(this.fromCurrency.balance) || 0
            return amount > 0 && amount <= balance
        }
    },
    watch: {
        fromCurrencyId() {
            this.calculateResult()
        },
        toCurrencyId() {
            this.calculateResult()
        }
    },
    onLoad() {
        // Load wallet data on page load
        this.loadWalletData()
    },
    onShow() {
        // Reload wallet data when page is shown
        this.loadWalletData()
    },
    methods: {
        // Open currency selector
        openCurrencySelector(type) {
            this.selectorType = type
            this.showCurrencySelector = true
        },

        // Select currency from bottom sheet
        selectCurrency(currency) {
            if (this.selectorType === 'from') {
                // Don't allow selecting the same as 'to'
                if (currency.id !== this.toCurrencyId) {
                    this.fromCurrencyId = currency.id
                }
            } else {
                // Don't allow selecting the same as 'from'
                if (currency.id !== this.fromCurrencyId) {
                    this.toCurrencyId = currency.id
                }
            }
            this.showCurrencySelector = false
        },

        // Check if currency is selected
        isSelected(currencyId) {
            if (this.selectorType === 'from') {
                return currencyId === this.fromCurrencyId
            } else {
                return currencyId === this.toCurrencyId
            }
        },

        // Swap currencies
        swapCurrencies() {
            // Trigger rotation animation
            if (this.isRotating) return
            this.isRotating = true

            const temp = this.fromCurrencyId
            this.fromCurrencyId = this.toCurrencyId
            this.toCurrencyId = temp
            // Clear input on swap
            this.inputAmount = ''
            this.convertedAmount = 0

            // Reset animation after completion
            setTimeout(() => {
                this.isRotating = false
            }, 500)
        },

        // Calculate converted amount
        calculateResult() {
            const amount = this.parseNumber(this.inputAmount)
            if (amount > 0) {
                const rate = parseFloat(this.exchangeRate)
                this.convertedAmount = amount * rate
            } else {
                this.convertedAmount = 0
            }
        },

        // Set quick amount percentage
        setQuickAmount(percent) {
            if (!this.fromCurrency) return
            const maxAmount = parseFloat(this.fromCurrency.balance) || 0
            const amount = (maxAmount * percent / 100).toFixed(2)
            this.inputAmount = amount
            this.calculateResult()
        },

        // Handle submit
        handleSubmit() {
            if (!this.canSubmit) {
                this.tos(this.$t('invalid_amount') || 'Invalid amount')
                return
            }

            const amount = this.parseNumber(this.inputAmount)

            if (!this.fromCurrency || !this.toCurrency || !this.fromCurrency.code || !this.toCurrency.code) {
                this.tos(this.$t('invalid_amount') || 'Invalid currency selection')
                return
            }

            this.post('/my/exchange_sub', {
                fromCurrency: this.fromCurrency.code,
                toCurrency: this.toCurrency.code,
                amount: amount
            }).then(res => {
                if (res.code == 1) {
                    this.tos(res.msg || this.$t('exchange_success') || 'Exchange successful')
                    // Reset form
                    this.inputAmount = ''
                    this.convertedAmount = 0
                    // Reload wallet data
                    this.loadWalletData()
                    // Navigate to asset record after delay
                    setTimeout(() => {
                        uni.reLaunch({
                            url: '/pages/my/exchange_history'
                        })
                    }, 1500)
                } else {
                    this.tos(res.msg || this.$t('exchange_failed') || 'Exchange failed')
                }
            }).catch(err => {
                console.error('Exchange error:', err)
                this.tos(this.$t('exchange_failed') || 'Exchange failed')
            })
        },

        // Load wallet data
        loadWalletData() {
            this.post('/my/exchange_currency').then(res => {
                if (res.code == 1) {
                    const data = res.data

                    // Update currencies with flag paths
                    if (data.currencies && Array.isArray(data.currencies)) {
                        this.currencies = data.currencies.map(currency => ({
                            ...currency,
                            flag: this.getFlagPath(currency.code),
                            balance: parseFloat(currency.balance) || 0
                        }))

                        // Set default currencies if not set
                        if (this.currencies.length > 0) {
                            if (!this.fromCurrencyId && this.currencies.length > 0) {
                                this.fromCurrencyId = this.currencies[0].id
                            }
                            if (!this.toCurrencyId && this.currencies.length > 1) {
                                this.toCurrencyId = this.currencies[1].id
                            } else if (!this.toCurrencyId && this.currencies.length === 1) {
                                this.toCurrencyId = this.currencies[0].id
                            }
                        }
                    }

                    // Update exchange rates
                    if (data.exchange_rate && typeof data.exchange_rate === 'object') {
                        this.exchangeRates = data.exchange_rate
                    }

                    // Recalculate result if amount is entered
                    if (this.inputAmount) {
                        this.calculateResult()
                    }
                }
            }).catch(err => {
                console.error('Failed to load exchange data:', err)
                uni.showToast({
                    title: this.$t('network_error') || 'Failed to load data',
                    icon: 'none'
                })
            })
        },

        // Get flag path based on currency code
        getFlagPath(code) {
            const flagMap = {
                'USD': '/static/locale/logo/usd.png',
                'EUR': '/static/imgs/ERO.png',
                'USDT': '/static/locale/logo/usdt.png'
            }
            return flagMap[code] || '/static/imgs/ERO.png'
        },

        // Parse number safely
        parseNumber(val) {
            if (!val || val === '') return 0
            const num = parseFloat(String(val).replace(/,/g, ''))
            return Number.isFinite(num) ? num : 0
        },

        // Format number with commas
        formatNumber(num) {
            if (!num || num === 0) return '0.00'
            return Number(num).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        },

        // Style methods
        getCardStyle() {
            return {
                background: this.theme.backgroundCard,
                borderColor: this.theme.neutral__200
            }
        },

        getSelectorStyle() {
            return {
                background: this.theme.backgroundTertiary,
                borderColor: this.theme.neutral__200
            }
        },

        getInputContainerStyle() {
            return {
                background: this.theme.backgroundTertiary,
                borderColor: this.theme.neutral__200
            }
        },

        getSwapButtonStyle() {
            return {
                background: 'transparent'
            }
        },

        getQuickAmountStyle() {
            return {
                background: this.theme.backgroundTertiary,
                borderColor: this.theme.neutral__200
            }
        },

        getSubmitButtonStyle() {
            return {
                background: this.canSubmit ? this.theme.primary__500 : this.theme.neutral__300
            }
        },

        getCurrencyItemStyle(currencyId) {
            const isSelected = this.isSelected(currencyId)
            return {
                background: isSelected ? this.theme.primary__50 : this.theme.backgroundTertiary,
                borderColor: isSelected ? this.theme.primary__500 : this.theme.neutral__200
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.exchange-page {
    min-height: 100vh;
    padding-bottom: 40rpx;
}

.exchange-container {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

// Rate Display
.rate-display-card {
    padding: 24rpx 32rpx;
    border-radius: 16rpx;
    border: 1rpx solid;
    text-align: center;
}

.rate-text {
    font-size: 26rpx;
    font-weight: 500;
}

// Currency Exchange Wrapper
.currency-exchange-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 24rpx;
}

// Currency Section
.currency-section {
    padding: 0;
    flex: 1;
}

.currency-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 24rpx;
    border-radius: 12rpx;
    border: 1rpx solid;
    margin-bottom: 16rpx;
    cursor: pointer;
    transition: all 0.3s ease;
}

.currency-info {
    display: flex;
    align-items: center;
    gap: 16rpx;
    flex: 1;
}

.currency-flag {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
}

.currency-details {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
}

.currency-code {
    font-size: 32rpx;
    font-weight: 600;
}

.currency-name {
    font-size: 20rpx;
}

.balance-display {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    padding: 16rpx 24rpx;
    border-radius: 12rpx;
    border: 1rpx solid;
    margin-top: 16rpx;
    background: inherit;
}

.balance-label {
    font-size: 24rpx;
}

.balance-amount {
    font-size: 28rpx;
    font-weight: 600;
}

// Swap Button
.swap-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    flex-shrink: 0;
}

.swap-button {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.swap-button:active {
    transform: scale(0.95);
}

.swap-button.rotate-animation {
    animation: rotateCircle 0.5s ease-in-out;
}

@keyframes rotateCircle {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.swap-icon {
    width: 100%;
    height: 100%;
}

// Amount Section
.amount-section {
    padding: 32rpx;
    border-radius: 16rpx;
    border: 1rpx solid;
}

.amount-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
}

.amount-label {
    font-size: 28rpx;
    font-weight: 600;
}

.quick-amount-buttons {
    display: flex;
    gap: 12rpx;
}

.quick-amount-btn {
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    border: 1rpx solid;
    cursor: pointer;
    transition: all 0.3s ease;
}

.quick-amount-btn:active {
    opacity: 0.7;
}

.quick-amount-text {
    font-size: 22rpx;
    font-weight: 500;
}

.amount-input-container {
    display: flex;
    align-items: center;
    padding: 24rpx;
    border-radius: 12rpx;
    border: 1rpx solid;
    margin-bottom: 16rpx;
}

.currency-symbol-input {
    font-size: 32rpx;
    font-weight: 600;
    margin-right: 12rpx;
}

.amount-input {
    flex: 1;
    font-size: 32rpx;
    font-weight: 600;
    height: 48rpx;
    line-height: 48rpx;
}

.input-placeholder {
    color: inherit;
    opacity: 0.4;
}

.converted-amount {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.converted-label {
    font-size: 24rpx;
}

.converted-value {
    font-size: 28rpx;
    font-weight: 600;
}

// Submit Section
.submit-section {
    margin-top: 8rpx;
}

.submit-text {
    font-size: 32rpx;
    font-weight: 600;
}

// Currency List in Bottom Sheet
.currency-list {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.currency-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    border-radius: 12rpx;
    border: 1rpx solid;
    cursor: pointer;
    transition: all 0.3s ease;
}

.currency-item:active {
    opacity: 0.7;
}

.currency-item.selected {
    border-width: 2rpx;
}

.currency-item-info {
    display: flex;
    align-items: center;
    gap: 16rpx;
    flex: 1;
}

.currency-item-flag {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
}

.currency-item-details {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
}

.currency-item-code {
    font-size: 30rpx;
    font-weight: 600;
}

.currency-item-name {
    font-size: 24rpx;
}

.currency-item-balance {
    font-size: 22rpx;
    margin-top: 4rpx;
}

.selected-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
