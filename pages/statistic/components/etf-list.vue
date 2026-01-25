<template>
    <view class="etf-list-section">
        <!-- Table Header -->
        <view class="flex align-center justify-between margin-t-30">
            <view class="width-100b flex align-center justify-between">
                <view class="flex-1 text-left font-25" :style="{ color: theme.textPrimary }">{{$t('statistic.name')}}</view>
                <view class="flex-1 text-right font-25" :style="{ color: theme.textPrimary }">{{$t('statistic.new')}}</view>
                <view class="flex-1 text-right font-25" :style="{ color: theme.textPrimary }">{{$t('statistic.change')}}</view>
            </view>
        </view>

        <!-- Day List -->
        <view class="width-100b">
            <!-- Loading Skeleton -->
            <view v-if="loading" class="etf-list-skeleton">
                <view class="listBox" v-for="n in 5" :key="'skeleton-' + n" :style="{ borderBottomColor: theme.neutral__200 }">
                    <view class="flex-1 flex direction-column align-start">
                        <view class="flex align-center gap-10">
                            <view class="skeleton-line skeleton-name" :style="getSkeletonStyle()"></view>
                            <view class="skeleton-line skeleton-type" :style="getSkeletonStyle()"></view>
                        </view>
                        <view class="skeleton-line skeleton-code" :style="getSkeletonStyle()"></view>
                    </view>
                    <view class="flex-1 text-center">
                        <view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
                    </view>
                    <view class="flex flex-direction align-end gap-10">
                        <view class="skeleton-line skeleton-change" :style="getSkeletonStyle()"></view>
                        <view class="skeleton-line skeleton-percent" :style="getSkeletonStyle()"></view>
                    </view>
                </view>
            </view>

            <!-- Day Data -->
            <view v-else>
                <view @click="handleStockClick(item)" class="listBox" :style="{ color: theme.textPrimary }"
                      v-for="(item,index) in dataList" :key="index">
                    <view class="flex-1 flex direction-column align-start">
                        <view class="flex align-center gap-10">
                            <view class="hidden-1 font-30 width-180" :style="{ color: theme.textPrimary }">{{item.name}}</view>
                            <view v-if="item.type" class="type-badge" :style="{ background: theme.primary__light, color: theme.white }">{{item.type}}</view>
                        </view>
                    </view>
                    <view class="flex-1 text-center font-32">
                        <text :style="{color: (Number(item.change_pct) || 0) >= 0 ? theme.success : theme.danger__500}">{{item.price}}</text>
                    </view>
                    <view class="flex flex-direction align-end gap-10">
                        <view class="flex-1 text-center bold-font"
                              :style="{color: (Number(item.change_pct) || 0) >= 0 ? theme.success : theme.danger__500}">
                            {{(Number(item.change_pct) || 0) >= 0 ? '+' : ''}}{{Number(item.change_pct || 0).toFixed(2)}}%
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'ETFList',
    props: {
        dataList: {
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
            this.$emit('etf-click', item)
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
.listBox {
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.type-badge {
    padding: 4rpx 12rpx;
    border-radius: 4rpx;
    font-size: 20rpx;
    font-weight: 500;
    white-space: nowrap;
}

/* Skeleton Loading Styles */
.etf-list-skeleton .listBox {
    border-bottom: 2rpx solid;
}

.skeleton-line {
    border-radius: 4rpx;
    animation: skeleton-pulse 1.5s ease-in-out infinite;
    background-size: 200% 100%;
}

.skeleton-name {
    width: 120rpx;
    height: 30rpx;
    margin-bottom: 10rpx;
}

.skeleton-code {
    width: 80rpx;
    height: 24rpx;
}

.skeleton-type {
    width: 40rpx;
    height: 24rpx;
}

.skeleton-price {
    width: 100rpx;
    height: 32rpx;
}

.skeleton-change {
    width: 60rpx;
    height: 24rpx;
}

.skeleton-percent {
    width: 50rpx;
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

