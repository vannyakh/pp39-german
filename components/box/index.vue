<template>
    <view class="box-container">
        <u-scroll-list 
            :indicator="indicator" 
            indicatorColor="#FFFFFF" 
            indicatorActiveColor="#FFFFFF"
        >
            <view class="scroll-content">
                <view 
                    class="stock-card" 
                    v-for="(item, index) in hotList2" 
                    :key="index"
                >
                    <view class="card-content">
                        <!-- Stock Header -->
                        <view class="stock-header">
                            <view class="stock-name">{{item.Name}}</view>
                            <view class="trend-icon">
                                <u-icon 
                                    :name="item.Chg >= 0 ? 'arrow-upward' : 'arrow-downward'" 
                                    size="15" 
                                    :color="item.Chg >= 0 ? '#29BC8B' : '#dd524d'"
                                />
                            </view>
                        </view>

                        <!-- Stock Price Info -->
                        <view class="price-section">
                            <view class="price">{{item.PrevClose}}</view>
                            <view class="change-amount" :class="item.ChgPct>=0?'text-up':'text-down'">
                                {{item.ChgPct}}
                            </view>
                            <view class="change-percent" :class="item.Chg>=0?'text-up':'text-down'">
                                {{item.Chg}}%
                            </view>
                        </view>

                        <!-- Progress Bars -->
                        <view class="progress-section">
                            <!-- Up Progress -->
                            <view class="progress-item">
                                <view class="progress-label">Up</view>
                                <view class="progress-bar">
                                    <u-line-progress 
                                        :percentage="item.up" 
                                        inactiveColor="#E6F5EF" 
                                        activeColor="#29BC8B"
                                    />
                                </view>
                            </view>

                            <!-- Down Progress -->
                            <view class="progress-item">
                                <view class="progress-label">Down</view>
                                <view class="progress-bar">
                                    <u-line-progress 
                                        :percentage="item.down" 
                                        inactiveColor="#FDECEC" 
                                        activeColor="#dd524d"
                                    />
                                </view>
                            </view>

                            <!-- Flat Progress -->
                            <view class="progress-item">
                                <view class="progress-label">Flat</view>
                                <view class="progress-bar">
                                    <u-line-progress 
                                        :percentage="item.flat" 
                                        inactiveColor="#F1F3F5" 
                                        activeColor="#ADB5BD"
                                    />
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </u-scroll-list>
    </view>
</template>

<script>
export default {
    name: 'StockBox',
    props: {
        dataList: {
            type: Array,
            default: () => []
        },
    },
    
    data() {
        return {
            indicator: true,
            hotList2: []
        }
    },
    
    computed: {},
    
    watch: {
        dataList: {
            handler(val) {
                this.hotList2 = val
            },
            immediate: true
        }
    }
}
</script>

<style lang="scss" scoped>
.box-container {
    width: 100%;
    margin-top: 20rpx;
}

.scroll-content {
    display: flex;
    gap: 10rpx;
    width: 100%;
}

.stock-card {
    border-radius: 20rpx;
    flex: 0 0 calc(50% - 10rpx);
    width: calc(50% - 10rpx);
    background: var(--white);
    border: 1rpx solid var(--neutral-600);
}

.card-content {
    display: flex;
    flex-direction: column;
    padding: 20rpx;
    gap: 20rpx;
    border-radius: 10rpx;
    width: 100%;
}

.stock-header {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.stock-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 50rpx;
}

.trend-icon {
    background-color: white;
    width: 50rpx;
    height: 50rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.price-section {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.price {
    font-size: 30rpx;
}

.change-amount {
    font-size: 20rpx;
}

.change-percent {
    font-size: 20rpx;
}

.progress-section {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.progress-item {
    display: flex;
    align-items: center;
}

.progress-label {
    margin-right: 10rpx;
    font-size: 23rpx;
    color: var(--neutral-300);
    min-width: 40rpx;
}

.progress-bar {
    flex: 1;
}
</style>
