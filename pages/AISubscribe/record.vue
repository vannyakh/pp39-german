<template>
    <view class="min-height-screen" :style="{ background: theme.backgroundSecondary, color: theme.textPrimary }">
        <z-paging :language="$t('locale')" ref="paging" v-model="dataList" @query="queryList" :pageSize="20">
			<app-nav slot="top" :title="$t('ai_subscribe.title')" blur></app-nav>

            <!-- list all record  -->
            <v-container size="md">
                <view class="ai-record-container">
                    <view class="section-header">
						<text class="section-title" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.my_records') }}</text>
						<text class="section-subtitle" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.track_investments') }}</text>
                    </view>

                    <view class="record-list">
                        <!-- Skeleton Cards -->
                        <template v-if="isLoading && dataList.length === 0">
                            <view
                                class="record-card skeleton"
                                v-for="n in 3"
                                :key="'skeleton-' + n"
                                :style="{ background: theme.backgroundCard }"
                            >
                                <view class="card-header">
                                    <view class="stock-info">
                                        <view class="sk-line sk-image" :style="getSkeletonStyle()"></view>
                                        <view class="stock-details">
                                            <view class="stock-name-row">
                                                <view class="sk-line sk-stock-name" :style="getSkeletonStyle()"></view>
                                                <view class="sk-line sk-type-badge" :style="getSkeletonStyle()"></view>
                                            </view>
                                            <view class="sk-line sk-profit-rate" :style="getSkeletonStyle()"></view>
                                        </view>
                                    </view>
                                    <view class="sk-line sk-status-badge" :style="getSkeletonStyle()"></view>
                                </view>

                                <view class="card-body">
                                    <view class="investment-info">
                                        <view class="info-row">
                                            <view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
                                            <view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
                                        </view>
                                        <view class="info-row">
                                            <view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
                                            <view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
                                        </view>
                                        <view class="info-row">
                                            <view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
                                            <view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
                                        </view>
                                    </view>
                                </view>

                                <view class="card-footer">
                                    <view class="action-buttons">
                                        <view class="sk-line sk-btn" :style="getSkeletonStyle()"></view>
                                        <view class="sk-line sk-btn" :style="getSkeletonStyle()"></view>
                                    </view>
                                </view>
                            </view>
                        </template>

                        <!-- Actual Cards -->
                        <template v-else>
                            <view
                                class="record-card"
                                v-for="(item, index) in dataList"
                                :key="item.id"
                                @click="goToSubscribe(item)"
                                :style="{ background: theme.backgroundCard }"
                            >
                            <view class="card-header">
                                <view class="stock-info">
                                    <u--image
                                        class="stock-image"
                                        :src="item.image"
                                        width="60rpx"
                                        height="60rpx"
                                        mode="aspectFill"
                                    >
                                        <template v-slot:loading>
                                            <u-loading-icon :color="theme.primary" size="20"></u-loading-icon>
                                        </template>
                                    </u--image>
                                    <view class="stock-details">
                                        <view class="stock-name-row">
                                            <text class="stock-name" :style="{ color: theme.textPrimary }">{{ item.name }}</text>
                                            <view v-if="item.type" class="type-badge" :style="{ background: theme.primary__light, color: theme.white }">{{ item.type }}</view>
                                        </view>
                                        <!-- <text class="profit-rate">{{ item.profit_rate }}</text> -->
                                    </view>
                                </view>
                                <view class="status-badge" :class="item.status === '1' ? 'active' : 'inactive'">
										<text class="status-text">{{ item.status === '1' ? $t('ai_subscribe.active') : $t('ai_subscribe.inactive') }}</text>
                                </view>
                            </view>

                            <view class="card-body">
                                <view class="investment-info">
                                    <view class="info-row" :style="{ borderBottom: '1rpx solid ' + theme.neutral__200 }">
										<text class="info-label" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.investment_amount') }}</text>
                                        <text class="info-value" :style="{ color: theme.textPrimary }">{{ formatNumber(item.invest_num) }}</text>
                                    </view>
                                    <view class="info-row" :style="{ borderBottom: '1rpx solid ' + theme.neutral__200 }">
										<text class="info-label" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.remaining_balance') }}</text>
                                        <text class="info-value" :style="{ color: theme.textPrimary }">{{ formatNumber(item.remain_num) }}</text>
                                    </view>
                                    <view class="info-row">
										<text class="info-label" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.subscription_date') }}</text>
                                        <text class="info-value" :style="{ color: theme.textPrimary }">{{ item.createtime }}</text>
                                    </view>
                                </view>
                            </view>

                            <view class="card-footer">
                                <view class="action-buttons">
                                    <view class="action-btn fund-btn" @click.stop="goToFund(item)" :style="{ background: theme.primary }">
										<text class="btn-text">{{ $t('ai_subscribe.fund') }}</text>
                                    </view>
                                    <view class="action-btn detail-btn" @click.stop="goToSubscribe(item)" :style="{ color: theme.textPrimary, border: '1rpx solid ' + theme.neutral__300 }">
										<text class="btn-text">{{ $t('ai_subscribe.my_position') }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                        </template>
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
            isLoading: false,
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    methods: {
        getSkeletonStyle() {
            return {
                background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 50%, ${this.theme.neutral__200} 75%)`
            }
        },
        queryList(pageNo, pageSize) {
            // Show skeleton only on first page load
            if (pageNo === 1) {
                this.isLoading = true
            }

            this.post("/stock_ai/order_list", {
                page: pageNo,
            }).then((res) => {
                if (res.code === 1) {
                    this.$refs.paging.complete(res.data.data)
                } else {
                    this.$refs.paging.complete([])
                }
            }).catch((error) => {
                console.error('Failed to fetch records:', error)
                this.$refs.paging.complete([])
            }).finally(() => {
                this.isLoading = false
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
                day: 'numeric'
            })
        },
        getProgressPercentage(item) {
            const investNum = parseFloat(item.invest_num) || 0
            const remainNum = parseFloat(item.remain_num) || 0

            if (investNum === 0) return 0

            const used = investNum - remainNum
            const percentage = (used / investNum) * 100
            return Math.round(percentage)
        },
        goToSubscribe(item) {
            this.router.push(`/pages/AISubscribe/subscribe?id=${item.id}`)
        },
        goToFund(item) {
            this.router.push(`/pages/AISubscribe/fund?id=${item.id}`)
        }
    }
}
</script>

<style lang="scss" scoped>
    .ai-record-container {
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

        .record-list {
            display: flex;
            flex-direction: column;
            gap: 20rpx;
        }

        .record-card {
            border-radius: 20rpx;
            padding: 24rpx;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;

            &:active {
                transform: scale(0.98);
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20rpx;

                .stock-info {
                    display: flex;
                    align-items: center;
                    gap: 16rpx;
                    flex: 1;

                    .stock-image {
                        width: 60rpx;
                        height: 60rpx;
                        border-radius: 12rpx;
                    }

                    .stock-details {
                        flex: 1;

                        .stock-name-row {
                            display: flex;
                            align-items: center;
                            gap: 12rpx;
                            margin-bottom: 4rpx;
                            flex-wrap: wrap;
                        }

                        .stock-name {
                            font-size: 28rpx;
                            font-weight: bold;
                        }

                        .type-badge {
                            padding: 4rpx 12rpx;
                            border-radius: 4rpx;
                            font-size: 20rpx;
                            font-weight: 500;
                            white-space: nowrap;
                        }

                        .profit-rate {
                            font-size: 22rpx;
                            color: #22c55e;
                            font-weight: 600;
                        }
                    }
                }

                .status-badge {
                    padding: 8rpx 16rpx;
                    border-radius: 20rpx;
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;

                    &.active {
                        background: rgba(34, 197, 94, 0.2);
                        color: #22c55e;
                    }

                    &.inactive {
                        background: rgba(107, 114, 128, 0.2);
                        color: #6b7280;
                    }

                    .status-text {
                        font-size: 20rpx;
                        font-weight: 600;
                    }
                }
            }

            .card-body {
                margin-bottom: 20rpx;

                .investment-info {
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12rpx 0;

                        &:last-child {
                            border-bottom: none;
                        }

                        .info-label {
                            font-size: 24rpx;
                            opacity: 0.7;
                        }

                        .info-value {
                            font-size: 24rpx;
                            font-weight: 600;
                        }
                    }
                }
            }

            .card-footer {
                margin-top: 20rpx;

                .action-buttons {
                    display: flex;
                    gap: 12rpx;

                    .action-btn {
                        flex: 1;
                        padding: 12rpx 20rpx;
                        border-radius: 12rpx;
                        text-align: center;
                        transition: all 0.3s ease;

                        .btn-text {
                            font-size: 24rpx;
                            font-weight: 600;
                        }

                        &.fund-btn {
                            color: #fff;

                            &:active {
                                transform: scale(0.95);
                            }
                        }

                        &.detail-btn {
                            background: rgba(255, 255, 255, 0.1);

                            &:active {
                                transform: scale(0.95);
                            }
                        }
                    }
                }
            }

        }
    }

    /* Skeleton Loading Styles */
    .skeleton {
        position: relative;
        overflow: hidden;
        pointer-events: none;

        .sk-line {
            background-size: 200% 100%;
            animation: sk-shimmer 1.5s ease-in-out infinite;
            border-radius: 8rpx;
            display: block;
        }

        .sk-image {
            width: 60rpx;
            height: 60rpx;
            border-radius: 12rpx;
        }

        .sk-stock-name {
            width: 180rpx;
            height: 28rpx;
            margin-bottom: 4rpx;
        }

        .sk-type-badge {
            width: 80rpx;
            height: 24rpx;
            border-radius: 4rpx;
        }

        .sk-profit-rate {
            width: 100rpx;
            height: 22rpx;
        }

        .sk-status-badge {
            width: 100rpx;
            height: 32rpx;
            border-radius: 20rpx;
        }

        .sk-label {
            width: 160rpx;
            height: 24rpx;
        }

        .sk-value {
            width: 120rpx;
            height: 24rpx;
        }

        .sk-btn {
            flex: 1;
            height: 44rpx;
            border-radius: 12rpx;
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
