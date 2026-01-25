<template>
    <view class="min-height-screen" :style="{ background: theme.backgroundSecondary, color: theme.textPrimary }">
        <z-paging :language="$t('locale')" ref="paging" v-model="dataList" @query="queryList" :pageSize="20">
			<app-nav slot="top" :title="$t('ai_subscribe.title')" blur></app-nav>

            <!-- list fund -->
            <v-container size="md">
                <view class="fund-container">
                    <view class="section-header">
						<text class="section-title" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.transaction_history') }}</text>
						<text class="section-subtitle" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.track_transactions') }}</text>
                    </view>

                    <view class="transaction-list">
                        <view
                            class="transaction-card"
                            v-for="(item, index) in dataList"
                            :key="item.id"
                            :style="{ background: theme.backgroundCard }"
                        >
                            <view class="transaction-header">
                                <view class="transaction-info">
                                    <text class="transaction-description" :style="{ color: theme.textPrimary }">{{ item.description }}</text>
                                    <text class="transaction-date" :style="{ color: theme.textPrimary }">{{ item.createtime }}</text>
                                </view>
                                <view class="transaction-amount" :class="getAmountClass(item.cart)">
                                    <text class="amount-text">{{ formatAmount(item.price, item.cart) }}</text>
                                </view>
                            </view>

                            <view class="transaction-details" v-if="item.notice">
                                <text class="notice-text" :style="{ color: theme.textPrimary }">{{ item.notice }}</text>
                            </view>

                            <view class="transaction-footer">
                                <view class="transaction-meta">
                                    <view class="meta-item">
										<text class="meta-label" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.id') }}</text>
                                        <text class="meta-value" :style="{ color: theme.textPrimary }">#{{ item.id }}</text>
                                    </view>
                                    <view class="meta-item">
										<text class="meta-label" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.country') }}</text>
                                        <text class="meta-value" :style="{ color: theme.textPrimary }">{{ getCountryName(item.country) }}</text>
                                    </view>
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
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            dataList: [],
            recordId: null,
        }
    },
    onLoad(options) {
        if (options.id) {
            this.recordId = options.id
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    methods: {
        queryList(pageNo, pageSize) {
            this.post("/stock_ai/detail", {
                page: pageNo,
                id: this.recordId,
            }).then((res) => {
                if (res.code === 1) {
                    this.$refs.paging.complete(res.data.data)
                } else {
                    this.$refs.paging.complete([])
                }
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
        },
        formatAmount(price, cart) {
            const amount = parseFloat(price) || 0
            const formatted = amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4
            })
            return cart === 1 ? `+${formatted}` : `-${formatted}`
        },
        getAmountClass(cart) {
            return cart === 1 ? 'credit' : 'debit'
        },
        getCountryName(country) {
            const countries = {
                5: 'CAD',
                6: 'US'
            }
            return countries[country] || 'Unknown'
        }
    }
}
</script>

<style lang="scss" scoped>
    .fund-container {
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

        .transaction-list {
            display: flex;
            flex-direction: column;
            gap: 16rpx;
        }

        .transaction-card {
            border-radius: 16rpx;
            padding: 20rpx;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;

            &:active {
                transform: scale(0.98);
            }

            .transaction-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12rpx;

                .transaction-info {
                    flex: 1;
                    margin-right: 16rpx;

                    .transaction-description {
                        display: block;
                        font-size: 28rpx;
                        font-weight: 600;
                        margin-bottom: 4rpx;
                    }

                    .transaction-date {
                        font-size: 22rpx;
                        opacity: 0.6;
                    }
                }

                .transaction-amount {
                    text-align: right;

                    .amount-text {
                        font-size: 28rpx;
                        font-weight: bold;
                    }

                    &.credit {
                        .amount-text {
                            color: #22c55e;
                        }
                    }

                    &.debit {
                        .amount-text {
                            color: #ef4444;
                        }
                    }
                }
            }

            .transaction-details {
                margin-bottom: 12rpx;
                padding: 8rpx 12rpx;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8rpx;

                .notice-text {
                    font-size: 22rpx;
                    opacity: 0.8;
                }
            }

            .transaction-footer {
                .transaction-meta {
                    display: flex;
                    gap: 20rpx;

                    .meta-item {
                        display: flex;
                        align-items: center;
                        gap: 6rpx;

                        .meta-label {
                            font-size: 20rpx;
                            opacity: 0.6;
                        }

                        .meta-value {
                            font-size: 20rpx;
                            font-weight: 500;
                        }
                    }
                }
            }
        }
    }
</style>
