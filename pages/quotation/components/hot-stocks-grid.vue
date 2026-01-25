<template>
    <view class="hot-stocks-section">
        <!-- Loading Skeleton -->
        <scroll-view v-if="loading" class="hot-stocks-scroll" scroll-x="true" show-scrollbar="false">
            <view class="hot-stocks-container">
                <view class="hot-stock-item" v-for="n in 3" :key="'skeleton-' + n">
                    <view class="radiu-20 skeleton-card" :style="{ background: theme.backgroundCard }">
                        <view class="skeleton-content">
                            <view class="skeleton-line skeleton-title" :style="getSkeletonStyle()"></view>
                            <view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
                            <view class="skeleton-line skeleton-change" :style="getSkeletonStyle()"></view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- Hot Stocks Data -->
        <scroll-view v-else class="hot-stocks-scroll" scroll-x="true" show-scrollbar="false">
            <view class="hot-stocks-container">
                <view @click="handleStockClick(item)" class="hot-stock-item" v-for="(item,index) in hotStocks" :key="index">
                    <view class="radiu-20" :style="{background: theme.backgroundTertiary}">
                        <view :style="getBoxStyle(item.increase)"
                              class="flex direction-column align-center justify-between">
                            <view class="width-100b flex align-center direction-column justify-between gap-30">
                                <view class="font-26 hidden-1 width-190" :style="{color: theme.textPrimary}">{{item.name}}</view>
                            </view>
                            <view class="flex align-start justify-start margin-t-10">
                                <view class="font-30 bold-font" :style="{color: item.increase>=0 ? theme.success : theme.danger__500}">{{item.close}}</view>
                            </view>
                            <view class="width-100b flex align-center justify-between margin-t-10 gap-10">
                                <view class="font-24" :style="{color: item.increase>=0 ? theme.success : theme.danger__500}">{{item.rise_or_fall>=0?'+':''}}{{item.rise_or_fall}}</view>
                                <view class="font-24" :style="{color: item.increase>=0 ? theme.success : theme.danger__500}">{{item.increase>=0?'+':''}}{{item.increase}}%</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    name: 'HotStocksGrid',
    props: {
        hotStocks: {
            type: Array,
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    methods: {
        handleStockClick(item) {
            this.$emit('stock-click', item)
        },
        getBoxStyle(increase) {
            if (increase >= 0) {
                // TopBox2 - Success/Profit gradient
                return {
                    background: `linear-gradient(to top, ${this.theme.white} 0%, ${this.theme.success__light || 'rgba(34, 175, 134, 0.1)'} 100%)`,
                    backgroundSize: '100% 100%',
                    width: '100%',
                    padding: '22rpx',
                    borderRadius: '12px'
                }
            } else {
                // TopBox1 - Danger/Loss gradient
                return {
                    background: `linear-gradient(to top, ${this.theme.white} 0%, ${this.theme.danger__light || 'rgba(255, 59, 48, 0.1)'} 100%)`,
                    backgroundSize: '100% 100%',
                    width: '100%',
                    padding: '22rpx',
                    borderRadius: '12px'
                }
            }
        },
        getSkeletonStyle() {
            return {
                background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 50%, ${this.theme.neutral__200} 75%)`
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/* TopBox styles now handled via inline styles */

/* Hot Stocks Scroll Styles */
.hot-stocks-scroll {
    margin-top: 20rpx;
    white-space: nowrap;
}

.hot-stocks-container {
    display: flex;
    gap: 20rpx;
    padding: 0 20rpx;
}

.hot-stock-item {
    flex-shrink: 0;
    width: 250rpx;
}

/* Skeleton Loading Styles */
.skeleton-card {
    padding: 22rpx;
    border-radius: 12px;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 100%;
}

.skeleton-line {
    border-radius: 4rpx;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
    background-size: 200% 100%;
}

.skeleton-title {
    width: 120rpx;
    height: 26rpx;
    margin-bottom: 20rpx;
}

.skeleton-price {
    width: 80rpx;
    height: 30rpx;
    margin-bottom: 20rpx;
}

.skeleton-change {
    width: 100rpx;
    height: 24rpx;
}

@keyframes skeleton-pulse {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        opacity: 1;
    }
}

</style>
