<template>
    <view class="min-height-screen" :style="{ background: theme.backgroundSecondary, color: theme.textPrimary }">
        <z-paging :language="$t('locale')" ref="paging" v-model="dataList" @query="queryList" :pageSize="20">
            <!--head tab--->
            <view slot="top" class="head-tab-section" :style="{ paddingTop: (statusBar + 20) + 'px', background: theme.backgroundCard }">
                <v-container size="md">
                    <view class="head-tab-container">
                        <view class="header-back" @click="router.goBack()" :style="{ background: theme.backgroundTertiary }">
                            <text class="cuIcon-back back-icon" :style="{ color: theme.neutral__400 }"></text>
                        </view>
                        <!-- Market Type Selector -->
                        <view class="market-selector">
                            <view class="market-selector-wrapper" :style="{ background: theme.backgroundTertiary }">
                                <view class="market-selector-bg" :class="{ 'active-left': type == 1, 'active-right': type == 2 }" :style="{ background: theme.primary__500 }"></view>
                                <view class="market-tab-btn"
                                      :class="{ 'active': type == 1 }"
                                      @click="changeType(1,6)">
                                    <view class="tab-content">
                                        <view class="tab-text font-28" :style="{ color: type == 1 ? theme.white : theme.neutral__400 }">{{$t('stock.tabs.market_1')}}</view>
                                    </view>
                                </view>
                                <view class="market-tab-btn"
                                      :class="{ 'active': type == 2 }"
                                      @click="changeType(2,5)">
                                    <view class="tab-content">
                                        <view class="tab-text font-28" :style="{ color: type == 2 ? theme.white : theme.neutral__400 }">{{$t('stock.tabs.market_2')}}</view>
                                    </view>
                                </view>
                            </view>
                        </view>

                        <!-- Search Button -->
                        <view class="search-tab-btn" @click="router.push('/pages/index/searchView')" :style="{ background: theme.backgroundTertiary }">
                            <text class="cuIcon-search search-icon" :style="{ color: theme.neutral__400 }"></text>
                        </view>
                    </view>
                </v-container>
            </view>

            <!-- Header Section -->
            <view slot="top">
                <v-container size="md">
                    <!-- Balance Cards -->
                    <view class="balance-cards margin-t-20">
                        <view class="balance-card full-width" :style="{ background: theme.backgroundCard }">
                            <view class="card-header">
						<text class="card-title" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.remaining_balance') }}</text>
                                <view class="card-actions">
                                    <u-icon
                                        :name="showBalance ? 'eye' : 'eye-off'"
                                        size="28"
                                        :color="theme.textPrimary"
                                        @click="toggleBalanceVisibility"
                                    ></u-icon>
                                </view>
                            </view>
                            <text class="card-amount" :style="{ color: theme.textPrimary }">{{ showBalance ? ' ' + formatNumber(remainBalance) : '****' }}</text>
                        </view>
                    </view>


                    <!-- Category Tabs -->
                    <view class="margin-t-20">
                        <v-tab-list
                                :list="categoryList"
                                :defaultActiveKey="status.toString()"
                                :activeColor="theme.primary__500"
                                :backgroundColor="theme.backgroundCard"
                                :textColor="theme.neutral__900"
                                :activeTextColor="theme.white"
                                :inactiveTextColor="theme.textTertiary"
                                :activeBackgroundColor="theme.primary__500"
                                :lineColor="theme.white"
                                :borderColor="theme.neutral__200"
                                rounded="full"
                                @change="handleTabChange"
                        />
                    </view>
                </v-container>
            </view>

            <!-- Position List -->
            <v-container size="md">
                <!-- Skeleton Cards -->
                <template v-if="isLoading && dataList.length === 0">
                    <view class="margin-t-25 skeleton-card" v-for="n in 3" :key="'skeleton-' + n" :style="{ background: theme.backgroundCard }">
                        <view class="position-header" :style="{ borderBottomColor: theme.neutral__200 }">
                            <view class="sk-line sk-stock-name" :style="getSkeletonStyle()"></view>
                            <view class="sk-line sk-creation-time" :style="getSkeletonStyle()"></view>
                        </view>

                        <view class="position-details">
                            <view class="detail-section">
                                <view class="detail-labels">
                                    <view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
                                    <view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
                                    <view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
                                </view>
                                <view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="detail-section">
                                <view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
                                <view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="detail-section">
                                <view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
                                <view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
                            </view>
                        </view>

                        <view class="position-footer">
                            <view class="detail-section">
                                <view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="detail-section">
                                <view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
                                <view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="action-section">
                                <view class="sk-line sk-action-btn" :style="getSkeletonStyle()"></view>
                            </view>
                        </view>
                    </view>
                </template>

                <!-- Actual Cards -->
                <template v-else>
                    <view class="margin-t-25" v-for="(item,index) in dataList" :key="index">
                        <subscribe-card
                                :item="item"
                                :status="status"
                                @sell="showPopup"
                                @detail="showDetail"
                        />
                    </view>
                </template>
            </v-container>
        </z-paging>

        <!-- Sell Confirmation Popup -->
        <u-popup :show="sellShow" :round="20" mode="center" bgColor="transparent" @close="sellShow = false">
            <view class="sell-modal" :style="{ background: theme.backgroundCard }">
                <view class="modal-header" :style="{ borderBottom: '1rpx solid ' + theme.neutral__200 }">
						<text class="modal-title" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.confirm_sell_order') }}</text>
                    <view class="close-btn" @click="sellShow = false">
                        <u-icon name="close" size="20" :color="theme.textPrimary"></u-icon>
                    </view>
                </view>

                <view class="modal-content">
                    <view class="sell-info">
							<text class="info-label" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.sell_confirmation') }}</text>
							<text class="info-note" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.sell_warning') }}</text>
                    </view>

                    <view class="modal-actions">
                        <view class="action-btn cancel-btn" @click="sellShow = false" :style="{ color: theme.textPrimary }">
								<text class="btn-text">{{ $t('ai_subscribe.cancel') }}</text>
                        </view>
                        <view class="action-btn confirm-btn" @click="confirmSell">
								<text class="btn-text">{{ $t('ai_subscribe.confirm_sell') }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </u-popup>

        <home-return/>
    </view>
</template>

<script>
import subscribeCard from './components/subscribe-card/index.vue'
export default {
    components: {
        subscribeCard
    },
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            dataList: [],
            sellShow: false,
            status: 2,
            type: 1,
            country: 6,
            id: null,
            selectedItem: null,
            remainBalance: 0,
            showBalance: true,
            isLoading: false,
            categoryList: [
							{ key: '2', name: this.$t('ai_subscribe.my_position'), type: 'all' },
							{ key: '1', name: this.$t('ai_subscribe.close_position'), type: 'active' },
							{ key: '3', name: this.$t('ai_subscribe.completed'), type: 'completed' }
            ]
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    onLoad(options) {
        if (options.id) {
            this.id = options.id
        }
    },
    methods: {
        getSkeletonStyle() {
            return {
                background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 50%, ${this.theme.neutral__200} 75%)`
            }
        },
        changeType(index, valCountry, typeName) {
            if (this.type !== index) {
                this.type = index
                this.country = valCountry
                console.log('Market Type Changed:', { index, valCountry, typeName })
                this.$refs.paging.reload()
            }
        },

        handleTabChange(item) {
            const index = parseInt(item.key)
            if (this.status !== index) {
                this.status = index
                console.log('Tab Changed:', { key: item.key, name: item.name, type: item.type, status: index })
                this.$refs.paging.reload()
            }
        },

        queryList(pageNo, pageSize) {
            // Show skeleton only on first page load
            if (pageNo === 1) {
                this.isLoading = true
            }

            this.post("/stock_ai/ai_stock_order_list", {
                status: this.status,
                country: this.country,
                id: this.id,
                page: pageNo,
            }).then((res) => {
                if (res.code === 1) {
                    this.remainBalance = res.data.remain_balance || 0
                    this.$refs.paging.complete(res.data.list.data)
                } else {
                    this.remainBalance = 0
                    this.$refs.paging.complete([])
                }
            }).catch((error) => {
                console.error('Failed to fetch positions:', error)
                this.remainBalance = 0
                this.$refs.paging.complete([])
            }).finally(() => {
                this.isLoading = false
            })
        },
        showPopup(item) {
            // Handle sell popup
            this.selectedItem = item
            this.sellShow = true
            console.log('Sell item:', item)
        },
        showDetail(item) {
            // Navigate to details page with item ID and status
            this.router.push(`/pages/AISubscribe/details?id=${item.id}&status=${item.status}`)
        },
        confirmSell() {
            if (!this.selectedItem) return

            // Submit sell order to API
            this.post("/stock_ai/pingcang", {
                id: this.selectedItem.id
            }).then((res) => {
                if (res.code === 1) {
						uni.showToast({
							title: this.$t('ai_subscribe.sell_order_confirmed'),
							icon: 'success'
						})
                    this.sellShow = false
                    // Refresh the list
                    this.$refs.paging.reload()
                } else {
						uni.showToast({
							title: res.msg || this.$t('ai_subscribe.sell_order_failed'),
							icon: 'none'
						})
                }
            }).catch(err => {
					uni.showToast({
						title: this.$t('ai_subscribe.network_error'),
						icon: 'none'
					})
            })
        },
        formatNumber(num) {
            if (!num || num === '0.000') return '0.00'
            return parseFloat(num).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        },
        toggleBalanceVisibility() {
            this.showBalance = !this.showBalance
        }

    }
}
</script>

<style lang="scss" scoped>
    .balance-cards {
        display: flex;
        gap: 16rpx;

        .balance-card {
            border-radius: 16rpx;
            padding: 20rpx;
            backdrop-filter: blur(10px);

            &.full-width {
                flex: 1;
                width: 100%;
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12rpx;

                .card-title {
                    font-size: 24rpx;
                    opacity: 0.8;
                }

                .card-actions {
                    cursor: pointer;
                    transition: opacity 0.3s ease;

                    &:active {
                        opacity: 0.7;
                    }
                }
            }

            .card-amount {
                font-size: 32rpx;
                font-weight: bold;

                &.profit {
                    color: #22c55e;
                }

                &.loss {
                    color: #ef4444;
                }
            }
        }
    }

    .sell-modal {
        width: 600rpx;
        border-radius: 20rpx;
        backdrop-filter: blur(20px);
        overflow: hidden;

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24rpx;

            .modal-title {
                font-size: 32rpx;
                font-weight: bold;
            }

            .close-btn {
                width: 40rpx;
                height: 40rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;

                &:active {
                    transform: scale(0.9);
                }
            }
        }

        .modal-content {
            padding: 24rpx;

            .sell-info {
                text-align: center;
                margin-bottom: 24rpx;

                .info-label {
                    display: block;
                    font-size: 28rpx;
                    margin-bottom: 8rpx;
                }

                .info-note {
                    font-size: 22rpx;
                    opacity: 0.6;
                }
            }

            .modal-actions {
                display: flex;
                gap: 16rpx;

                .action-btn {
                    flex: 1;
                    padding: 16rpx;
                    border-radius: 12rpx;
                    text-align: center;
                    transition: all 0.3s ease;

                    .btn-text {
                        font-size: 26rpx;
                        font-weight: 600;
                    }

                    &.cancel-btn {
                        background: rgba(255, 255, 255, 0.1);

                        &:active {
                            transform: scale(0.95);
                        }
                    }

                    &.confirm-btn {
                        background: #ef4444;
                        color: #fff;

                        &:active {
                            transform: scale(0.95);
                        }
                    }
                }
            }
        }
    }

    .market-type-btn {
        transition: all 0.3s ease;
        border-radius: 12rpx;
        margin: 0 8rpx;

        &.active {
            color: #fff;

            .market-active-text {
                color: #fff;
            }
        }

        &:not(.active) {
            background: rgba(255, 255, 255, 0.1);
        }

        &:active {
            transform: scale(0.98);
        }
    }


    /* Head Tab Section Styles */
    .head-tab-section {
        padding: 20rpx 0;
    }

    .head-tab-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20rpx;
    }

    .market-selector {
        flex: 1;
    }

    .market-selector-wrapper {
        position: relative;
        display: flex;
        border-radius: 16rpx;
        padding: 6rpx;
        overflow: hidden;
    }

    .market-selector-bg {
        position: absolute;
        top: 6rpx;
        left: 6rpx;
        width: calc(50% - 6rpx);
        height: calc(100% - 12rpx);
        border-radius: 12rpx;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
    }

    .market-selector-bg.active-right {
        transform: translateX(100%);
    }

    .market-tab-btn {
        position: relative;
        z-index: 2;
        flex: 1;
        padding: 16rpx 20rpx;
        transition: all 0.3s ease;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tab-content {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tab-text {
        transition: color 0.3s ease;
        font-weight: 500;
    }

    .search-tab-btn {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        cursor: pointer;
        flex-shrink: 0;
    }

    .search-icon {
        font-size: 32rpx;
        transition: color 0.3s ease;
    }
    .header-back {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        cursor: pointer;
        flex-shrink: 0;
    }

    .back-icon {
        font-size: 32rpx;
        transition: color 0.3s ease;
    }

    /* Skeleton Loading Styles */
    .skeleton-card {
        border-radius: 16rpx;
        padding: 24rpx;
        pointer-events: none;

        .sk-line {
            background-size: 200% 100%;
            animation: sk-shimmer 1.5s ease-in-out infinite;
            border-radius: 8rpx;
            display: block;
        }

        .position-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            border-bottom: 2px solid;
            margin-bottom: 20rpx;
            padding-bottom: 20rpx;
        }

        .sk-stock-name {
            width: 350rpx;
            height: 28rpx;
        }

        .sk-creation-time {
            width: 120rpx;
            height: 24rpx;
        }

        .position-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx;
        }

        .detail-section {
            display: flex;
            flex-direction: column;
            gap: 8rpx;

            .detail-labels {
                display: flex;
                gap: 4rpx;
            }
        }

        .sk-label {
            width: 100rpx;
            height: 20rpx;
        }

        .sk-value {
            width: 120rpx;
            height: 24rpx;
        }

        .position-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .sk-action-btn {
            width: 100rpx;
            height: 44rpx;
            border-radius: 8rpx;
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
