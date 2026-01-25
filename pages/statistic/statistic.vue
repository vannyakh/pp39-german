<template>
    <view class="statistic-page" :style="{ background: theme.backgroundPrimary }">
        <app-nav :title="stock.name || '---'" showRightImage rightImageUrl="/static/imgs/fund/record.png"
                 @right-action="router.push('/pages/statistic/record')"></app-nav>

        <!-- Stock header info -->
        <view class="padding-w-30">
            <view class="flex justify-between align-center">
                <view class="flex flex-direction">
                    <text class="font-32" :style="{ color: theme.textPrimary }">{{ stock.name || '---' }}</text>
                </view>
                <view class="text-right flex flex-direction">
                    <text class="font-40 weight-bold" :style="{ color: theme.textPrimary }">{{ stock.price || '--' }}</text>
                    <view>
                        <text class="font-24"
                              :style="{ color: (Number(stock.change_pct) || 0) >= 0 ? theme.stockUp : theme.stockDown }">
                            {{ $t('statistic.dailyChange') }}: {{ (Number(stock.change_pct) || 0) >= 0 ? '+' : '' }}{{ stock.change_pct || '0.00' }}%
                        </text>
                    </view>
                </view>
            </view>
        </view>

        <!-- Interval tabs -->
        <view class="width-100b margin-0-auto flex justify-start gap-20 padding-w-30">
            <view v-for="opt in intervals" :key="opt.value" @click="setInterval(opt.value)" class="radiu-20 padding-16"
                  :style="tabStyle(opt)">
                <text class="font-24">{{ opt.label }}</text>
            </view>
        </view>

        <!-- Kline area (flex:1 full height) -->
        <view class="kline-box width-100b margin-0-auto">
            <iframe class="kline-iframe" :src="chartUrl"></iframe>
        </view>

        <!--detail and buy button-->
        <view class="detail-buy-section padding-w-30">
            <view class="detail-card">
                <view class="detail-row height-66 flex align-center justify-between">
                    <text class="font-28" :style="{color: theme.textSecondary}">{{$t('statistic.name')}}</text>
                    <text class="font-28 bold-font" :style="{color: theme.textPrimary}">{{stock.name || '---'}}</text>
                </view>
                <view class="detail-row height-66 flex align-center justify-between">
                    <text class="font-28" :style="{color: theme.textSecondary}">{{$t('statistic.new')}}</text>
                    <text class="font-28 bold-font" :style="{color: getPriceColor()}">{{Number(stock.price || 0).toFixed(3)}}</text>
                </view>
                <view class="detail-row height-66 flex align-center justify-between">
                    <text class="font-28" :style="{color: theme.textSecondary}">{{$t('statistic.balance') || 'Balance'}}</text>
                    <text class="font-28 bold-font" :style="{color: theme.textPrimary}">
                        {{Number(balance || 0).toFixed(2)}}
                    </text>
                </view>
                <view class="detail-row quantity-row">
                    <view class="quantity-section">
                        <text class="quantity-label font-30" :style="{color: theme.textSecondary}">{{$t('statistic.selectQuantity')}}</text>
                        <view class="quantity-controls-row">
                            <view @click="setHalfQuantity" class="quantity-action-btn" :style="getActionButtonStyle()">
                                <text class="font-24" :style="{color: theme.textPrimary}">{{$t('statistic.half') || 'Half'}}</text>
                            </view>
                            <view @click="setFullQuantity" class="quantity-action-btn" :style="getActionButtonStyle()">
                                <text class="font-24" :style="{color: theme.textPrimary}">{{$t('statistic.full') || 'Full'}}</text>
                            </view>
                            <view class="quantity-input-container">
                                <u-number-box v-model="quantity" :min="1" :max="maxQuantity" :step="1" :disabled="false">
                                    <view slot="minus" class="quantity-btn minus-btn" :style="getMinusStyle()">
                                        <u-icon name="minus" :color="theme.textPrimary" size="14"></u-icon>
                                    </view>
                                    <view slot="input" class="quantity-input-wrapper" :style="{background: theme.backgroundTertiary}">
                                        <input v-model.number="quantity" class="quantity-input font-28 bold-font" type="number" :style="{color: theme.textPrimary}" :min="1" :max="maxQuantity" @input="handleQuantityInput" />
                                    </view>
                                    <view slot="plus" class="quantity-btn plus-btn" :style="getPlusStyle()">
                                        <u-icon name="plus" :color="theme.white" size="14"></u-icon>
                                    </view>
                                </u-number-box>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="detail-row height-66 flex align-center justify-between">
                    <text class="font-28" :style="{color: theme.textSecondary}">{{$t('statistic.totalAmount')}}</text>
                    <text class="font-28 bold-font" :style="{color: getPriceColor()}">
                        {{Number(totalAmount).toFixed(3)}}
                    </text>
                </view>
            </view>

            <view class="buy-button-container padding-t-20 padding-b-30">
                <view @click="handleBuy" class="buy-button flex align-center justify-center padding-25 radiu-30"
                    :style="{background: theme.primary__500, color: theme.white}">
                    <text class="font-32">{{$t('statistic.buyNow')}}</text>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            selectedInterval: 'D',
            stock: {},
            chartData: [],
            chartUrl: '',
            language: 'en',
            quantity: 1,
            balance: 0,
            flag: true
        };
    },
    onLoad(options) {
        console.log("🚀 ~ onLoad ~ options:", options)
        if (options.id) {
            this.id = options.id;
        }
        this.language = uni.getStorageSync('language');
    },
    onShow() {
        this.getStatistic();
        this.getChartData();
        this.getChartUrl();
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        },
        themeKey() {
            return this.$store.state.themeKey || 'light'
        },
        intervals() {
            return [{
                value: 'D',
                label: this.$t('statistic.dailyK')
            }, {
                value: 'W',
                label: this.$t('statistic.weeklyK')
            }, {
                value: 'M',
                label: this.$t('statistic.monthlyK')
            }]
        },
        totalAmount() {
            const price = Number(this.stock.price || 0);
            const qty = Number(this.quantity || 1);
            return price * qty;
        },
        maxQuantity() {
            const price = Number(this.stock.price || 0);
            if (price <= 0) return 9999;
            const maxQty = Math.floor(this.balance / price);
            return Math.max(1, maxQty);
        }
    },
    methods: {
        getChartUrl() {
            this.chartUrl = `static/chart-widgets/index.html?stock_id=${this.id}&interval=${this.selectedInterval}&theme=${this.themeKey}&language=${this.language}`;
        },
        setInterval(v) {
            this.selectedInterval = v;
            this.getChartData();
            this.getChartUrl();
        },
        tabStyle(opt) {
            const active = this.selectedInterval === opt.value;
            return {
                background: active ? this.theme.primary__500 : this.theme.backgroundTertiary,
                color: active ? this.theme.white : this.theme.textPrimary
            };
        },
        getStatistic() {
            this.post('/index/get_stock_detail', {
                stock_id: this.id
            }).then(res => {
                console.log("🚀 ~ getStatistic ~ res:", res)
                this.stock = res.data;
                // Get balance from API response
                if (res.data && res.data.balance !== undefined) {
                    this.balance = Number(res.data.balance) || 0;
                } else if (res.data && res.data.available_balance !== undefined) {
                    this.balance = Number(res.data.available_balance) || 0;
                } else if (res.data && res.data.availableBalance !== undefined) {
                    this.balance = Number(res.data.availableBalance) || 0;
                }
            })
        },
        getChartData() {
            this.post('/index/kline', {
                stock_id: this.id,
                interval: this.selectedInterval
            }).then(res => {
                console.log("🚀 ~ getChartData ~ res:", res)
            })
        },
        getPriceColor() {
            const change = Number(this.stock.change_pct || 0);
            return change >= 0 ? this.theme.primary__500 : this.theme.success;
        },
        getMinusStyle() {
            return {
                background: this.theme.backgroundTertiary,
                borderRadius: '50%',
                width: '60rpx',
                height: '60rpx',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            };
        },
        getPlusStyle() {
            return {
                background: this.theme.primary__500,
                borderRadius: '50%',
                width: '60rpx',
                height: '60rpx',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            };
        },
        getActionButtonStyle() {
            return {
                background: this.theme.backgroundTertiary,
                padding: '12rpx 24rpx',
                borderRadius: '8rpx',
                border: `1px solid ${this.theme.neutral__200}`,
                minWidth: '100rpx',
                textAlign: 'center'
            };
        },
        setHalfQuantity() {
            const price = Number(this.stock.price || 0);
            if (price <= 0) return;
            const halfAmount = this.balance / 2;
            const halfQty = Math.floor(halfAmount / price);
            this.quantity = Math.max(1, halfQty);
        },
        setFullQuantity() {
            const price = Number(this.stock.price || 0);
            if (price <= 0) return;
            const fullQty = Math.floor(this.balance / price);
            this.quantity = Math.max(1, fullQty);
        },
        handleQuantityInput(e) {
            let value = e.detail.value || e.target.value;
            // Remove any negative signs
            value = String(value).replace(/[^0-9]/g, '');
            value = Number(value);
            if (isNaN(value) || value < 1) {
                this.quantity = 1;
            } else if (value > this.maxQuantity) {
                this.quantity = this.maxQuantity;
            } else {
                this.quantity = Math.floor(value);
            }
        },
        handleBuy() {
            if (!this.flag) return;
            if (!this.quantity || this.quantity < 1) {
                this.tos(this.$t('statistic.selectQuantity') || 'Please select quantity');
                return;
            }
            // Handle buy action here
            console.log('Buy:', {
                id: this.id,
                num: this.quantity,
            });
            this.flag = false;
            this.post('/etf/etf_sub', {
                id: this.id,
                num: this.quantity,
            }).then(res => {
                this.flag = true;
                if (res.code === 1) {
                    this.tos(res.msg);
                    // Navigate to record page after successful purchase
                    setTimeout(() => {
                        this.router.push('/pages/statistic/record');
                    }, 1000);
                } else {
                    this.tos(res.msg);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.statistic-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.kline-box {
  flex: 1;
  display: flex;
  min-height: 0; // allow child to grow in flex
  overflow: hidden;
}

.kline-iframe {
  width: 100%;
  border: 0;
  display: block;
}

.detail-buy-section {
  padding-top: 20rpx;
}

.detail-card {
  margin-bottom: 20rpx;
}

.detail-row {
  border-bottom: 1px solid;
  border-bottom-color: rgba(0, 0, 0, 0.05);
}

.detail-row:last-child {
  border-bottom: none;
}

.quantity-row {
  padding: 30rpx 0;
  min-height: auto;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}

.quantity-label {
  margin-bottom: 8rpx;
}

.quantity-controls-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16rpx;
  width: 100%;
}

.quantity-input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.quantity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.quantity-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  border-radius: 8rpx;
  padding: 8rpx;
}

.quantity-input {
  width: 100%;
  text-align: center;
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
}

.quantity-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.quantity-action-btn:active {
  opacity: 0.7;
  transform: scale(0.95);
}

.buy-button-container {
  position: sticky;
  bottom: 0;
  background: transparent;
  z-index: 10;
}

.buy-button {
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-button:active {
  opacity: 0.8;
  transform: scale(0.98);
}
</style>
