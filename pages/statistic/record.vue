<template>
    <view class="min-height-screen" :style="{ background: theme.backgroundSecondary, color: theme.textPrimary }">
        <z-paging :language="$t('locale')" ref="paging" v-model="dataList" @query="queryList" :pageSize="20">
            <!-- Header Section -->
            <app-nav slot="top" :title="$t('statistic.title')" blur></app-nav>
            <view slot="top">
                <v-container size="md">
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
                <!-- Skeleton Loading for Position List -->
                <template v-if="loading" >
                    <view class="margin-t-25" v-for="n in 3" :key="'skeleton-' + n">
                        <view class="position-skeleton" :style="{ background: theme.backgroundCard }">
                            <view class="skeleton-header">
                                <view class="skeleton-line skeleton-stock-name" :style="getSkeletonStyle()"></view>
                                <view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="skeleton-content">
                                <view class="skeleton-row">
                                    <view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
                                    <view class="skeleton-line skeleton-value" :style="getSkeletonStyle()"></view>
                                </view>
                                <view class="skeleton-row">
                                    <view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
                                    <view class="skeleton-line skeleton-value" :style="getSkeletonStyle()"></view>
                                </view>
                                <view class="skeleton-row">
                                    <view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
                                    <view class="skeleton-line skeleton-value" :style="getSkeletonStyle()"></view>
                                </view>
                            </view>
                            <view class="skeleton-actions">
                                <view class="skeleton-line skeleton-button" :style="getSkeletonStyle()"></view>
                                <view class="skeleton-line skeleton-button" :style="getSkeletonStyle()"></view>
                            </view>
                        </view>
                    </view>
                </template>

                <!-- Actual Position Cards -->
                <template v-else>
                    <view class="margin-t-25" v-for="(item,index) in dataList" :key="index">
                        <record-card
                            :item="item"
                            :status="status"
                            @sell="showPopup"
                        />

                    </view>
                </template>

            </v-container>
        </z-paging>

        <!-- Sell Confirmation Popup -->
        <u-popup :show="show" :round="10" mode="center" bgColor="transparent" @close="show=false">
            <view class="height-370 flex flex-direction justify-between width-690 padding-20 radiu-20 popup-content" :style="{ background: theme.backgroundCard }">
                <view class="height-220 flex direction-column align-center justify-center">
                    <view class="font-30" :style="{ color: theme.textPrimary }">{{$t('statistic.positionProfit')}}</view>
                    <view class="font-48 margin-t-30" :style="{ color: theme.textPrimary }">{{Number(win_or_lost).toFixed(3)}}</view>
                    <view class="font-28 margin-t-30" :style="{ color: theme.textSecondary }">{{$t('statistic.unrealisedPnl')}}</view>
                </view>
                <view class="flex align-center justify-between gap-20">
                    <view @click="pingcang(id)"
                          class="padding-20 flex align-center justify-center width-100b radiu-10 danger-button"
                          :style="{ background: theme.danger__500, color: theme.white }">
                        {{$t('statistic.closePosition')}}
                    </view>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import RecordCard from './components/record-card.vue'
export default {
    components: { RecordCard },
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            show: false,
            status: 1,
            type: 1,
            dataList: [],
            loading: true,
            flag: true,
            id: '',
            win_or_lost: 0,
            categoryList: [
                {
                    name: this.$t('statistic.pendingOrder'),
                    key: '1',
                    type: 1
                },
                {
                    name: this.$t('statistic.holdingPosition'),
                    key: '2',
                    type: 2
                },
                {
                    name: this.$t('statistic.closedPosition'),
                    key: '3',
                    type: 3
                },
            ]
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    methods: {
        showPopup(item) {
            this.id = item.id
            this.win_or_lost = (item.close - item.price) * item.num * 100
            this.show = true
        },
        handleTabChange(item) {
            const index = parseInt(item.key)
            if (this.status !== index) {
                this.loading = true
                this.status = index
                this.$refs.paging.reload()
            }
        },
        pingcang(id) {
            if (!this.flag) return

            this.flag = false
            this.post("/etf/pingcang", {
                id: id,
            }, true).then((res) => {
                this.flag = true
                if (res.code === 1) {
                    this.tos(res.msg)
                    this.$refs.paging.reload()
                    this.show = false
                }
            })
        },
        queryList(pageNo, pageSize) {
            this.loading = true
            this.post("/etf/order_list", {
                status: this.status,
                page: pageNo,
            }).then((res) => {
                this.loading = false
                if (res.code === 1) {
                    this.$refs.paging.complete(res.data.list.data)
                    console.log('res data list', res.data.list.data)
                } else {
                    this.$refs.paging.complete(false)
                }
            }).catch(() => {
                this.loading = false
                this.$refs.paging.complete(false)
            })
        },

        getSkeletonStyle() {
            return {
                background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 50%, ${this.theme.neutral__200} 75%)`
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.text {
    font-size: 12px;
    margin-top: 5px;
}

.uni-px-5 {
    padding-left: 10px;
    padding-right: 10px;
}

.uni-pb-5 {
    padding-bottom: 10px;
}

.dropdown {
    position: relative;
}

.dropdown-list {
    list-style: none;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 100%;
    left: 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.dropdown-list li {
    padding: 10px;
    cursor: pointer;
}

.listBox {
    width: 100%;
    margin: 20rpx auto;
    border-radius: 20rpx;
    padding: 20rpx 32rpx 20rpx;
}

.boxs {
    width: 100rpx;
    height: 48rpx;
    border-radius: 4rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
}

.custom::after {
    content: "";
    width: 5px;
    height: 110%;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%) rotate(10deg);
    transform: translate(-50%, -50%) rotate(10deg);
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


/* Legacy market-type-btn styles for backward compatibility */
.market-type-btn {
    transition: all 0.3s ease;
    border-radius: 20rpx;
    cursor: pointer;
}

.market-type-btn.active {
    transform: scale(1.02);
}

/* Popup and Button Styles */
/* Colors are now handled via inline styles */

/* Skeleton Loading Styles */
.skeleton-line {
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
    border-radius: 8rpx;
}

.skeleton-title {
    width: 120rpx;
    height: 24rpx;
    margin-bottom: 20rpx;
}

.skeleton-amount {
    width: 160rpx;
    height: 32rpx;
}

.skeleton-stock-name {
    width: 200rpx;
    height: 28rpx;
}

.skeleton-price {
    width: 120rpx;
    height: 28rpx;
}

.skeleton-label {
    width: 80rpx;
    height: 20rpx;
}

.skeleton-value {
    width: 100rpx;
    height: 20rpx;
}

.skeleton-button {
    width: 120rpx;
    height: 60rpx;
    border-radius: 12rpx;
}

.position-skeleton {
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.skeleton-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
}

.skeleton-content {
    margin-bottom: 30rpx;
}

.skeleton-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.skeleton-actions {
    display: flex;
    gap: 20rpx;
    justify-content: flex-end;
}

@keyframes skeleton-loading {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}
</style>
