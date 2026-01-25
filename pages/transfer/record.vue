<template>
    <view class="recharge-log-container" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
        <z-paging ref="paging" v-model="dataList" @query="queryList">
            <app-nav slot="top" blur :title="$t('transfer.history.title')"></app-nav>
            <view class="flex-1 w-full">
                <v-container size="md" padding>

                    <!-- skeleton list -->
                    <view v-if="isLoading && (!dataList || dataList.length === 0)" class="record-list-container">
                        <view v-for="i in skeletonCount" :key="i" class="transaction-item">
                            <view class="transaction-card skeleton" :style="{background: theme.backgroundCard, border: `2rpx solid ${theme.neutral__200}`}">
                                <view class="transaction-header">
                                    <view class="transaction-info">
                                        <view class="sk-line sk-title" :style="getSkeletonStyle()"></view>
                                        <view class="sk-line sk-sub" :style="getSkeletonStyle()"></view>
                                    </view>
                                    <view class="transaction-amount sk-amount">
                                        <view class="sk-line sk-amount-num" :style="getSkeletonStyle()"></view>
                                        <view class="sk-line sk-amount-cur" :style="getSkeletonStyle()"></view>
                                    </view>
                                </view>
                                <view class="transaction-details" :style="{borderTop: `1rpx solid ${theme.neutral__200}`}">
                                    <view class="detail-row">
                                        <view class="sk-line sk-detail-left" :style="getSkeletonStyle()"></view>
                                        <view class="sk-line sk-detail-right" :style="getSkeletonStyle()"></view>
                                    </view>
                                    <view class="detail-row">
                                        <view class="sk-line sk-detail-left" :style="getSkeletonStyle()"></view>
                                        <view class="sk-line sk-detail-right" :style="getSkeletonStyle()"></view>
                                    </view>
                                    <view class="detail-row">
                                        <view class="sk-line sk-detail-left short" :style="getSkeletonStyle()"></view>
                                        <view class="sk-line sk-detail-right medium" :style="getSkeletonStyle()"></view>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!--record list-->
                    <view v-else class="record-list-container">
                        <view v-for="(item, index) in dataList" :key="item.id || index" class="transaction-item">
                            <view class="transaction-card" :style="{background: theme.backgroundCard, border: `2rpx solid ${theme.neutral__200}`}">
                                <view class="transaction-header">
                                    <view class="transaction-info">
                                        <text class="transaction-memo" :style="{color: theme.textPrimary}">{{ formatMemo(item.from_wallet, item.to_wallet, item.currency) }}</text>
                                        <text class="transaction-date" :style="{color: theme.textTertiary}">{{ item.createtime }}</text>
                                    </view>
                                    <view class="transaction-amount">
                                        <text class="amount-text neutral" :style="{color: theme.textTertiary}">
                                            {{ formatMoney(item.money) }}
                                        </text>
                                        <text class="currency" :style="{color: theme.textTertiary, background: getColorWithOpacity(theme.white, 0.05), border: `1rpx solid ${getColorWithOpacity(theme.white, 0.1)}`}">{{ getCurrencySymbol(item.currency) }}</text>
                                    </view>
                                </view>
                                <view class="transaction-details" :style="{borderTop: `1rpx solid ${theme.neutral__200}`}">
                                    <view class="detail-row">
                                        <text class="detail-label" :style="{color: theme.textTertiary}">{{ $t('transfer.history.amount') }}</text>
                                        <text class="detail-value" :style="{color: theme.textPrimary}">{{ formatMoney(item.money) }} {{ getCurrencySymbol(item.currency) }}</text>
                                    </view>
                                    <view class="detail-row" v-if="item.from_wallet && item.to_wallet">
                                        <text class="detail-label" :style="{color: theme.textTertiary}">{{ $t('transfer.history.from') }}</text>
                                        <text class="detail-value" :style="{color: theme.textPrimary}">{{ capitalize(item.from_wallet) }} → {{ capitalize(item.to_wallet) }}</text>
                                    </view>
                                    <view class="detail-row">
                                        <text class="detail-label" :style="{color: theme.textTertiary}">{{ $t('transfer.history.time') }}</text>
                                        <text class="detail-value" :style="{color: theme.textPrimary}">{{ item.createtime }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                </v-container>
            </view>

        </z-paging>

    </view>
</template>

<script>
export default {
    data() {
        return {
            dataList: [],
            isLoading: false,
            skeletonCount: 3
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    methods: {
        // No date formatting needed; show raw API datetime

        formatMoney(amount) {
            const num = parseFloat(amount);
            return num.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        },

        getCurrencySymbol(currency) {
            const currencySymbols = {
                'CAD': 'C$', 'CND': 'C$',
                'USD': '$', 'US': '$',
                'EUR': '€',
                'GBP': '£',
                'JPY': '¥',
                'AUD': 'A$',
                'USDT': 'USDT',
                'FOREX': '$'
            };
            return currencySymbols[currency] || '$';
        },

        capitalize(v) {
            if (!v) return '';
            const s = String(v).toLowerCase();
            return s.charAt(0).toUpperCase() + s.slice(1);
        },

        formatMemo(from, to, currency) {
            const left = this.capitalize(from);
            const right = this.capitalize(to);
            const cur = String(currency || '').toUpperCase();
            return `${left} → ${right} · ${cur}`;
        },


        async queryList(pageNo, pageSize) {
            this.isLoading = true;
            try {
                const res = await this.post('/my/get_transfer_log',{
                    page: pageNo,
                    pageSize: pageSize
                })

                if (res.code === 1 && res.data && Array.isArray(res.data.data)) {
                    this.$refs.paging.complete(res.data.data);
                } else {
                    console.error('Sample Data Error:', 'No data available');
                    this.$refs.paging.complete(false);
                }
            } catch (error) {
                console.error('Failed to fetch transfer history:', error);
                this.$refs.paging.complete(false);
            } finally {
                this.isLoading = false;
            }
        },
        getSkeletonStyle() {
            const baseColor = this.theme.textTertiary || '#999999'
            const baseRgba = this.getColorWithOpacity(baseColor, 0.15)
            const highlightRgba = this.getColorWithOpacity(baseColor, 0.25)
            return {
                background: `linear-gradient(90deg, ${baseRgba} 0%, ${baseRgba} 40%, ${highlightRgba} 50%, ${baseRgba} 60%, ${baseRgba} 100%)`,
                backgroundSize: '200% 100%',
                animation: 'sk-shimmer 1.5s ease-in-out infinite'
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
.recharge-log-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;

    .record-list-container {
        display: flex;
        flex-direction: column;
        gap: 16rpx;
        margin-top: 20rpx;

        .transaction-item {
            margin-bottom: 16rpx;

            .transaction-card {
                border-radius: 16rpx;
                padding: 24rpx;
                backdrop-filter: blur(20rpx);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;

                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1rpx;
                }


                .transaction-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20rpx;

                    .transaction-info {
                        display: flex;
                        flex-direction: column;
                        gap: 8rpx;
                        flex: 1;

                        .transaction-memo {
                            font-size: 28rpx;
                            font-weight: 600;
                            line-height: 1.4;
                        }

                        .transaction-date {
                            font-size: 20rpx;
                            font-weight: 500;
                        }
                    }

                    .transaction-amount {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        gap: 4rpx;

                        .amount-text {
                            font-size: 28rpx;
                            font-weight: 700;
                            line-height: 1.2;
                            text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

                        }

                        .currency {
                            font-size: 18rpx;
                            font-weight: 500;
                            text-transform: uppercase;
                            padding: 2rpx 8rpx;
                            border-radius: 6rpx;
                        }
                    }
                }

                .transaction-details {
                    display: flex;
                    flex-direction: column;
                    gap: 12rpx;
                    padding-top: 20rpx;
                    position: relative;

                    &::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 1rpx;
                    }

                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .detail-label {
                            font-size: 22rpx;
                            font-weight: 500;
                        }

                        .detail-value {
                            font-size: 22rpx;
                            font-weight: 600;
                            text-align: right;
                        }
                    }
                }

                /* Skeleton styles */
                &.skeleton {
                    position: relative;
                    overflow: hidden;

                    .sk-line {
                        border-radius: 8rpx;
                        height: 24rpx;
                        display: block;
                    }

                    .sk-title {
                        width: 260rpx;
                        height: 28rpx;
                    }

                    .sk-sub {
                        width: 180rpx;
                        margin-top: 8rpx;
                    }

                    .transaction-amount.sk-amount {
                        align-items: flex-end;

                        .sk-amount-num {
                            width: 160rpx;
                            height: 28rpx;
                        }

                        .sk-amount-cur {
                            width: 60rpx;
                            height: 20rpx;
                            margin-top: 8rpx;
                        }
                    }

                    .sk-detail-left {
                        width: 200rpx;
                        height: 22rpx;

                        &.short {
                            width: 140rpx;
                        }
                    }

                    .sk-detail-right {
                        width: 220rpx;
                        height: 22rpx;

                        &.medium {
                            width: 200rpx;
                        }
                    }
                }
            }
        }
    }
}

@keyframes sk-shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}
</style>
