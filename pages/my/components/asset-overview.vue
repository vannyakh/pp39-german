<template>
    <view class="asset-overview-container">
        <!-- Navigation Tabs -->
        <scroll-view class="nav-tabs-scroll" scroll-x="true" :show-scrollbar="false" :style="{ borderBottomColor: theme.neutral__200 }">
            <view class="nav-tabs">
                <view
                    v-for="(tab, index) in navTabs"
                    :key="index"
                    class="nav-tab"
                    :class="{ 'active': currentTabIndex === index }"
                    @click="switchTab(index)"
                >
                    <text class="nav-tab-text" :style="{ color: currentTabIndex === index ? theme.textPrimary : theme.textTertiary, fontWeight: currentTabIndex === index ? 600 : 400 }">{{ tab.name }}</text>
                    <view v-if="currentTabIndex === index" class="nav-tab-indicator" :style="{ background: theme.primary__light }"></view>
                </view>
            </view>
        </scroll-view>

        <!-- Tab Content -->
        <view class="tab-content-container">
            <!-- Overview Tab -->
            <view v-if="currentTabIndex === 0" class="tab-content">
                    <!-- Total Asset Section -->
                    <view class="total-asset-section">
                        <view class="total-asset-header">
                            <text class="total-asset-label" :style="{ color: theme.textPrimary }">{{ $t('total_asset') }}</text>
                            <view class="visibility-toggle" @click="toggleAssetVisibility">
                                <u-icon
                                    :name="showAssetValue ? 'eye' : 'eye-off'"
                                    size="20"
                                    :color="theme.textTertiary"
                                ></u-icon>
                            </view>
                        </view>
                        <view class="total-asset-value">
                            <text class="asset-amount" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('overview', userAssets.overview && userAssets.overview.totalAsset) : '****' }}</text>
                        </view>
                    </view>

                    <!-- Action Buttons -->
                    <view class="action-buttons">
                        <view @click="handleDeposit" class="action-button deposit" :style="getDepositButtonStyle()">
                            <image class="action-icon" src="/static/imgs/my/deposit-1.png" mode="aspectFit"></image>
                            <text class="action-text" :style="{ color: theme.white }">{{ $t('deposit') }}</text>
                        </view>
                        <view @click="handleWithdraw" class="action-button withdraw" :style="getButtonStyle()">
                            <image class="action-icon" src="/static/imgs/my/withdrawal.png" mode="aspectFit"></image>
                            <text class="action-text" :style="{ color: theme.textPrimary }">{{ $t('withdraw') }}</text>
                        </view>
                        <view @click="handleTransfer" class="action-button transfer" :style="getButtonStyle()">
                            <image class="action-icon" src="/static/imgs/my/exchange.png" mode="aspectFit"></image>
                            <text class="action-text" :style="{ color: theme.textPrimary }">{{ $t('transfer.title') }}</text>
                        </view>
                    </view>

                    <!-- All Asset Breakdown -->
                    <view class="all-asset-section">
                        <view class="all-asset-card" :style="{ background: theme.backgroundCard, borderColor: theme.neutral__200 }">
                            <view class="section-header">
                                <view class="section-title-wrapper">
                                    <text class="section-title" :style="{ color: theme.textPrimary }">{{ $t('all_asset') }}</text>
                                    <view class="section-title-indicator" :style="{ background: theme.primary__light }"></view>
                                </view>
                            </view>
                            <view class="asset-breakdown">
                                <view class="asset-item" :style="{ borderBottomColor: theme.neutral__200 }">
                                    <text class="asset-name" :style="{ color: theme.textPrimary }">{{ $t('spot_trading') }}</text>
                                    <text class="asset-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('spot', userAssets.overview && userAssets.overview.spot) : '****' }}</text>
                                </view>
                                
                                <view class="asset-item" :style="{ borderBottomColor: theme.neutral__200 }">
                                    <text class="asset-name" :style="{ color: theme.textPrimary }">{{ $t('cad') }}</text>
                                    <view class="asset-value-wrapper">
                                        <text class="asset-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.overview && userAssets.overview.ca) : '****' }}</text>
                                        <text v-if="showAssetValue && userAssets.overview && userAssets.overview.cad_usd" class="asset-value-subtitle" :style="{ color: theme.textSecondary }">= {{ formatAmount('us', userAssets.overview.cad_usd) }}</text>
                                    </view>
                                </view>
                                <view class="asset-item" :style="{ borderBottomColor: theme.neutral__200 }">
                                    <text class="asset-name" :style="{ color: theme.textPrimary }">{{ $t('us') }}</text>
                                    <text class="asset-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.overview && userAssets.overview.us) : '****' }}</text>
                                </view>
                                <!--<view class="asset-item" :style="{ borderBottomColor: theme.neutral__200 }">
                                    <text class="asset-name" :style="{ color: theme.textPrimary }">{{ $t('forex_trading') }}</text>
                                    <text class="asset-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('forex', userAssets.overview && userAssets.overview.forex) : '****' }}</text>
                                </view>-->
                            </view>
                        </view>
                    </view>
            </view>

            <!-- Spot Tab -->
            <view v-if="currentTabIndex === 1" class="tab-content">
                    <!-- Total Asset Section -->
                    <view class="total-asset-section">
                        <view class="total-asset-header">
                            <text class="total-asset-label" :style="{ color: theme.textPrimary }">{{ $t('total_asset') }}</text>
                            <view class="visibility-toggle" @click="toggleAssetVisibility">
                                <u-icon
                                    :name="showAssetValue ? 'eye' : 'eye-off'"
                                    size="20"
                                    :color="theme.textTertiary"
                                ></u-icon>
                            </view>
                        </view>
                        <view class="total-asset-value">
                            <text class="asset-amount" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('spot', userAssets.spot && userAssets.spot.totalAsset) : '****' }}</text>
                        </view>
                    </view>

                    <!-- Action Buttons -->
                    <view class="action-buttons">
                        <view @click="handleDeposit" class="action-button deposit" :style="getDepositButtonStyle()">
                            <image class="action-icon" src="/static/imgs/my/deposit-1.png" mode="aspectFit"></image>
                            <text class="action-text" :style="{ color: theme.white }">{{ $t('deposit') }}</text>
                        </view>
                        <view @click="handleWithdraw" class="action-button withdraw" :style="getButtonStyle()">
                            <image class="action-icon" src="/static/imgs/my/withdrawal.png" mode="aspectFit"></image>
                            <text class="action-text" :style="{ color: theme.textPrimary }">{{ $t('withdraw') }}</text>
                        </view>
                        <view @click="handleTransfer" class="action-button transfer" :style="getButtonStyle()">
                            <image class="action-icon" src="/static/imgs/my/exchange.png" mode="aspectFit"></image>
                            <text class="action-text" :style="{ color: theme.textPrimary }">{{ $t('transfer.title') }}</text>
                        </view>
                        <view @click="handleExchange" class="action-button exchange" :style="getButtonStyle()">
                            <image class="action-icon" src="/static/imgs/my/transfer-1.png" mode="aspectFit"></image>
                            <text class="action-text" :style="{ color: theme.textPrimary }">{{ $t('Exhange') }}</text>
                        </view>
                    </view>

                    <!-- All Asset Section -->
                    <view class="all-asset-section">
                        <view class="all-asset-card" :style="{ background: theme.backgroundCard, borderColor: theme.neutral__200 }">
                            <view class="section-header">
                                <view class="section-title-wrapper">
                                    <text class="section-title" :style="{ color: theme.textPrimary }">{{ $t('all_asset') }}</text>
                                    <view class="section-title-indicator" :style="{ background: theme.primary__light }"></view>
                                </view>
                            </view>
                            <view class="asset-breakdown">
                                <view class="asset-item" :style="{ borderBottomColor: theme.neutral__200 }">
                                    <text class="asset-name" :style="{ color: theme.textPrimary }">{{ $t('cad') }}</text>
                                    <view class="asset-value-wrapper">
                                        <text class="asset-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('spot_cad', userAssets.spot && userAssets.spot.cad) : '****' }}</text>
                                        <text v-if="showAssetValue && userAssets.spot && userAssets.spot.cad_usd" class="asset-value-subtitle" :style="{ color: theme.textSecondary }">= {{ formatAmount('spot_us', userAssets.spot.cad_usd) }}</text>
                                    </view>
                                </view>
                                <view class="asset-item" :style="{ borderBottomColor: theme.neutral__200 }">
                                    <text class="asset-name" :style="{ color: theme.textPrimary }">{{ $t('us') }}</text>
                                    <text class="asset-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('spot_us', userAssets.spot && userAssets.spot.us) : '****' }}</text>
                                </view>
                                <view class="asset-item" :style="{ borderBottomColor: theme.neutral__200 }">
                                    <text class="asset-name" :style="{ color: theme.textPrimary }">{{ $t('usdt') }}</text>
                                    <text class="asset-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('spot_usdt', userAssets.spot && userAssets.spot.usdt) : '****' }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
            </view>

            <!-- CA Stock Tab -->
            <view v-if="currentTabIndex === 2" class="tab-content">
                    <!-- Total Asset (US) Section -->
                    <view class="total-asset-us-section" :style="{ background: theme.backgroundCard }">
                        <view class="total-asset-us-header">
                            <text class="total-asset-us-label" :style="{ color: theme.textSecondary }">{{ $t('total_asset_ca') }}</text>
                            <view @click="handleTransfer" class="transfer-button" :style="{ background: theme.primary__light, color: theme.white }">
                                <image class="transfer-icon" src="/static/imgs/my/exchange-1.png" mode="aspectFit"></image>
                                <text class="transfer-text" :style="{ color: theme.white }">{{ $t('transfer.title') }}</text>
                            </view>
                        </view>
                        <view class="total-asset-us-value">
                            <text class="asset-us-amount" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.ca && userAssets.ca.totalAsset) : '****' }}</text>
                        </view>
                    </view>

                    <!-- Financial Summary Card -->
                    <view class="financial-summary-card" :style="{ background: theme.backgroundCard }">
                        <view class="financial-grid">
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('total_assets') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.ca && userAssets.ca.count_money_cnd) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('occupied_funds') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.ca && userAssets.ca.zy_money_cnd) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('available_funds') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.ca && userAssets.ca.money_cnd) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('withdrawal_funds') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.ca && userAssets.ca.kq_money_cnd) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('position_total_profit') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.ca && userAssets.ca.cc_yinli_cnd) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('account_total_profit') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.ca && userAssets.ca.count_yinli_cnd) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('freeze_cash') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.ca && userAssets.ca.freeze_cash_cnd) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('pending_cash') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('ca', userAssets.ca && userAssets.ca.pending_cash_cnd) : '****' }}</text>
                            </view>
                        </view>
                    </view>
            </view>

            <!-- US Stock Tab -->
            <view v-if="currentTabIndex === 3" class="tab-content">
                    <!-- Total Asset (CA) Section -->
                    <view class="total-asset-ca-section" :style="{ background: theme.backgroundCard }">
                        <view class="total-asset-ca-header">
                            <text class="total-asset-ca-label" :style="{ color: theme.textSecondary }">{{ $t('total_asset_us') }}</text>
                            <view @click="handleTransfer" class="transfer-button" :style="{ background: theme.primary__light, color: theme.white }">
                                <image class="transfer-icon" src="/static/imgs/my/exchange-1.png" mode="aspectFit"></image>
                                <text class="transfer-text" :style="{ color: theme.white }">{{ $t('transfer.title') }}</text>
                            </view>
                        </view>
                        <view class="total-asset-ca-value">
                            <text class="asset-ca-amount" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.us && userAssets.us.totalAsset) : '****' }}</text>
                        </view>
                    </view>

                    <!-- Financial Summary Card -->
                    <view class="financial-summary-card" :style="{ background: theme.backgroundCard }">
                        <view class="financial-grid">
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('total_assets') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.us && userAssets.us.count_money_us) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('occupied_funds') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.us && userAssets.us.zy_money_us) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('available_funds') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.us && userAssets.us.money_us) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('withdrawal_funds') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.us && userAssets.us.kq_money_us) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('position_total_profit') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.us && userAssets.us.cc_yinli_us) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('account_total_profit') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.us && userAssets.us.count_yinli_us) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('freeze_cash') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.us && userAssets.us.freeze_cash_us) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('pending_cash') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('us', userAssets.us && userAssets.us.pending_cash_us) : '****' }}</text>
                            </view>
                        </view>
                    </view>
            </view>

            <!-- Forex Tab -->
            <view v-if="currentTabIndex === 4" class="tab-content">
                    <!-- Total Asset (USDT) Section -->
                    <view class="total-asset-usdt-section" :style="{ background: theme.backgroundCard }">
                        <view class="total-asset-usdt-header">
                            <text class="total-asset-usdt-label" :style="{ color: theme.textSecondary }">{{ $t('total_asset') }}</text>
                            <view @click="handleTransfer" class="transfer-button" :style="{ background: theme.primary__light, color: theme.white }">
                                <image class="transfer-icon" src="/static/imgs/my/exchange-1.png" mode="aspectFit"></image>
                                <text class="transfer-text" :style="{ color: theme.white }">{{ $t('transfer.title') }}</text>
                            </view>
                        </view>
                        <view class="total-asset-usdt-value">
                            <text class="asset-usdt-amount" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('forex', userAssets.forex && userAssets.forex.totalAsset) : '****' }}</text>
                        </view>
                    </view>

                    <!-- Financial Summary Card -->
                    <view class="financial-summary-card" :style="{ background: theme.backgroundCard }">
                        <view class="financial-grid">
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('total_assets') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('forex', userAssets.forex && userAssets.forex.totalAssets) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('occupied_funds') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('forex', userAssets.forex && userAssets.forex.occupiedFunds) : '****' }}</text>
                            </view>
                            <view class="financial-item">
                                        <text class="financial-label" :style="{ color: theme.textSecondary }">{{ $t('position_total_profit') }}</text>
                                <text class="financial-value" :style="{ color: theme.textPrimary }">{{ showAssetValue ? formatAmount('forex', userAssets.forex && userAssets.forex.positionTotalProfit) : '****' }}</text>
                            </view>
                        </view>
                    </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'AssetOverview',
    props: {
        // Props for external data if needed
        userAssets: {
            type: Object,
            default: () => ({})
        },
        currency: {
            type: String,
            default: 'USD'
        },
        currencySymbol: {
            type: String,
            default: '$'
        },
        walletCurrencies: {
            type: Object,
            default: () => ({
                overview: { code: 'USD', symbol: '$' },
                // Spot overall
                spot: { code: 'USD', symbol: '$' },
                // Spot breakdown
                spot_cad: { code: 'CAD', symbol: 'C$' },
                spot_us: { code: 'USD', symbol: '$' },
                spot_usdt: { code: 'USDT', symbol: 'USDT' },
                // Stock wallets
                ca: { code: 'CAD', symbol: 'C$' },
                us: { code: 'USD', symbol: '$' },
                // Forex defaults to USD
                forex: { code: 'USD', symbol: 'USD' }
            })
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    data() {
        return {
            currentTabIndex: 0,
            showAssetValue: true,
            navTabs: [
                { name: this.$t('asset_overview'), key: 'overview' },
                { name: this.$t('asset_spot'), key: 'spot' },
                { name: this.$t('asset_ca'), key: 'ca' },
                { name: this.$t('asset_us'), key: 'us' },
                // { name: this.$t('asset_forex'), key: 'forex' }
            ]
        }
    },
    methods: {
        switchTab(index) {
            this.currentTabIndex = index;
        },

        toggleAssetVisibility() {
            this.showAssetValue = !this.showAssetValue;
        },

        getSymbol(section) {
            const fallback = this.currencySymbol || '$';
            const map = this.walletCurrencies || {};
            const sym = map[section] && map[section].symbol;
            return sym || fallback;
        },

        formatAmount(section, value) {
            if (value === null || value === undefined || value === '') return '';
            const symbol = this.getSymbol(section);
            // Normalize number-like strings, keep original if already has a symbol
            const str = String(value).trim();
            if (/^[^\d-]*[\d.,-]/.test(str) && str.replace(/[\d.,\s-]/g, '').length > 0) {
                // appears to already include a currency symbol or unit; return as is
                return str;
            }
            return `${symbol} ${str}`;
        },

        handleDeposit() {
            this.$emit('deposit');
        },

        handleWithdraw() {
            this.$emit('withdraw');
        },

        handleTransfer() {
            this.$emit('transfer');
        },
        handleExchange() {
            this.$emit('exchange');
        },

        getDepositButtonStyle() {
            return {
                background: this.theme.primary__500
            }
        },

        getButtonStyle() {
            return {
                background: `linear-gradient(135deg, ${this.theme.primary__50} 0%, ${this.theme.primary__100} 100%)`
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/* Asset Overview Section */

/* Navigation Tabs */
.nav-tabs-scroll {
  margin-bottom: 30rpx;
}

.nav-tabs {
  display: flex;
  white-space: nowrap;
  padding: 0;
}

.nav-tab {
  flex-shrink: 0;
  text-align: center;
  padding: 20rpx 24rpx;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  min-width: 120rpx;
}

.nav-tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  border-radius: 2rpx;
}

/* Tab Content */
.tab-content-container {
  margin-top: 20rpx;
}

/* .tab-content intentionally left without extra rules */

/* Total Asset Section */
.total-asset-section {
  margin-bottom: 40rpx;
}

.total-asset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.total-asset-label {
  font-size: 28rpx;
  font-weight: 500;
}

.visibility-toggle {
  padding: 8rpx;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.total-asset-value {
  text-align: left;
}

.asset-amount {
  font-size: 40rpx;
  font-weight: 700;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 10rpx;
}

.action-button {
  flex: 1;
  padding: 15rpx 10rpx;
  border-radius: 16rpx;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.action-text {
  font-size: 26rpx;
  font-weight: 600;
}
.action-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 12rpx;
}

/* All Asset Section */
.all-asset-section {
  margin-top: 20rpx;
    margin-bottom: 20rpx;
}

.all-asset-card {
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 20rpx;
}

.section-title-wrapper {
  position: relative;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
}

.section-title-indicator {
  position: absolute;
  bottom: -6rpx;
  left: 0;
  width: 50rpx;
  height: 3rpx;
  border-radius: 2rpx;
}

.asset-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.asset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom-style: dashed;
    border-bottom-width: 1rpx;
}

.asset-item:last-child {
  border-bottom: none;
}

.asset-name {
  font-size: 26rpx;
  font-weight: 400;
}

.asset-value-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rpx;
}

.asset-value {
  font-size: 26rpx;
  font-weight: 600;
}

.asset-value-subtitle {
  font-size: 22rpx;
  font-weight: 400;
}

/* CA, US, and Forex Tab Styles */
.total-asset-us-section,
.total-asset-ca-section,
.total-asset-usdt-section {
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
}

.total-asset-us-header,
.total-asset-ca-header,
.total-asset-usdt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.total-asset-us-label,
.total-asset-ca-label,
.total-asset-usdt-label {
  font-size: 26rpx;
  font-weight: 500;
}

.transfer-button {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.transfer-icon {
  width: 24rpx;
  height: 24rpx;
}

.transfer-text {
  font-size: 24rpx;
  font-weight: 500;
}

.total-asset-us-value,
.total-asset-ca-value,
.total-asset-usdt-value {
  text-align: left;
}

.asset-us-amount,
.asset-ca-amount,
.asset-usdt-amount {
  font-size: 36rpx;
  font-weight: 700;
}

/* Financial Summary Card */
.financial-summary-card {
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
  margin-bottom: 20rpx;
}

.financial-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24rpx;
}

.financial-item {
  text-align: center;
  padding: 16rpx 8rpx;
}

.financial-label {
  font-size: 22rpx;
  margin-bottom: 8rpx;
  font-weight: 400;
    display: flex;
    flex-direction: column;
}

.financial-value {
  font-size: 24rpx;
  font-weight: 600;
}
</style>
