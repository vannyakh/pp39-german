<template>
    <view class="min-height-screen" :style="{ background: theme.backgroundSecondary, color: theme.textPrimary }">
        <z-paging :language="$t('locale')" ref="paging" v-model="dataList" @query="queryList" :pageSize="20">
            <app-nav slot="top" :title="$t('exchange_history') || 'Exchange History'" blur></app-nav>

            <v-container size="md">
                <view class="exchange-history-container">
                    <view class="section-header">
                        <text class="section-title" :style="{ color: theme.textPrimary }">{{ $t('exchange_history') || 'Exchange History' }}</text>
                        <text class="section-subtitle" :style="{ color: theme.textTertiary }">{{ $t('exchange_history_subtitle') || 'View your currency exchange records' }}</text>
                    </view>

                    <view class="history-list">
                        <view
                            class="history-card"
                            v-for="(item, index) in dataList"
                            :key="item.id"
                            :style="{ background: theme.backgroundCard }"
                        >
                            <view class="card-header">
                                <view class="exchange-info">
                                    <view class="currency-pair">
                                        <view class="currency-from">
                                            <text class="currency-code" :style="{ color: theme.textPrimary }">{{ item.from_currency }}</text>
                                            <text class="currency-amount" :style="{ color: theme.textPrimary }">{{ formatNumber(item.amount_from) }}</text>
                                        </view>
                                        <view class="exchange-arrow">
                                            <u-icon name="arrow-right" :color="theme.primary__500" size="24"></u-icon>
                                        </view>
                                        <view class="currency-to">
                                            <text class="currency-code" :style="{ color: theme.textPrimary }">{{ item.to_currency }}</text>
                                            <text class="currency-amount" :style="{ color: theme.primary__500 }">{{ formatNumber(item.amount_to) }}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>

                            <view class="card-body">
                                <view class="detail-row" :style="{ borderBottom: '1rpx solid ' + theme.neutral__200 }">
                                    <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('exchange_rate') || 'Exchange Rate' }}</text>
                                    <text class="detail-value" :style="{ color: theme.textPrimary }">1 {{ item.from_currency }} = {{ item.ex }} {{ item.to_currency }}</text>
                                </view>
                                <view class="detail-row">
                                    <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('exchange_date') || 'Date' }}</text>
                                    <text class="detail-value" :style="{ color: theme.textPrimary }">{{ item.created_at }}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </v-container>
        </z-paging>
        <home-return/>
    </view>
</template>

<script>
export default {
    name: 'ExchangeHistory',
    data() {
        return {
            dataList: [],
            isLoading: false
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    methods: {
        queryList(pageNo, pageSize) {
            this.isLoading = true
            this.post('/my/exchange_history', {
                page: pageNo,
                pageSize: pageSize
            }).then(res => {
                this.isLoading = false
                if (res.code == 1) {
                    // Handle both direct array or wrapped in data property
                    const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data || [])
                    this.$refs.paging.complete(data)
                } else {
                    this.$refs.paging.complete([])
                }
            }).catch(() => {
                this.isLoading = false
                this.$refs.paging.complete([])
            })
        },
        formatNumber(num) {
            if (!num || num === '0.00') return '0.00'
            return parseFloat(num).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        },
        formatDate(dateString) {
            if (!dateString) return ''
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.exchange-history-container {
    padding: 20rpx 0;

    .section-header {
        text-align: center;
        margin-bottom: 30rpx;

        .section-title {
            display: block;
            font-size: 36rpx;
            font-weight: bold;
            margin-bottom: 8rpx;
        }

        .section-subtitle {
            display: block;
            font-size: 24rpx;
            opacity: 0.7;
        }
    }

    .history-list {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
    }

    .history-card {
        border-radius: 20rpx;
        padding: 24rpx;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;

        &:active {
            transform: scale(0.98);
        }

        .card-header {
            margin-bottom: 20rpx;

            .exchange-info {
                .currency-pair {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16rpx;

                    .currency-from,
                    .currency-to {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        gap: 8rpx;

                        .currency-code {
                            font-size: 24rpx;
                            font-weight: 600;
                            opacity: 0.7;
                        }

                        .currency-amount {
                            font-size: 32rpx;
                            font-weight: bold;
                        }
                    }

                    .exchange-arrow {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }
                }
            }
        }

        .card-body {
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12rpx 0;

                &:last-child {
                    border-bottom: none;
                }

                .detail-label {
                    font-size: 24rpx;
                }

                .detail-value {
                    font-size: 24rpx;
                    font-weight: 600;
                }
            }
        }
    }
}
</style>

