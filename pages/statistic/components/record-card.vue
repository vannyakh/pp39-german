<template>
    <view class="record-card" :style="{ background: theme.backgroundCard }">
        <!-- Header Row -->
        <view class="record-header" :style="{ borderBottomColor: theme.neutral__200 }">
            <view class="stock-name" :style="{ color: theme.textPrimary }">{{item.name}}</view>
            <view class="creation-time" :style="{ color: theme.textTertiary }">{{item.createtime}}</view>
        </view>

        <!-- Price and Quantity Row -->
        <view class="record-details">
            <view class="detail-section">
                <view class="detail-labels">
                    <text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('statistic.currentPrice')}}</text>
                    <text class="detail-label" :style="{ color: theme.textSecondary }">/</text>
                    <text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('statistic.cost')}}</text>
                </view>
                <text class="detail-value" :style="{ color: theme.textPrimary }">{{item.close}}/{{item.price}}</text>
            </view>

            <view class="detail-section">
                <text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('statistic.lot')}}</text>
                <text class="detail-value" :style="{ color: theme.textPrimary }">{{item.num}}</text>
            </view>

            <view class="detail-section">
                <text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('statistic.pnl')}}</text>
                <text class="detail-value" :style="{ color: theme.textPrimary }">
                    {{Number(item.rise_all_fall).toFixed(3)}}/
                    <span :style="{ color: item.increase>=0 ? theme.success : theme.danger__500 }">{{item.increase}}%</span>
                </text>
            </view>
        </view>

        <!-- record Details Row -->
        <view class="record-footer">
            <view class="detail-section">
                <text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('statistic.totalPurchased')}}</text>
                <text class="detail-value width-100b" :style="{ color: theme.textPrimary }">{{Number(item.num*item.price).toFixed(3)}}</text>
            </view>

            <view v-if="status == 2" @click="handleSell" class="action-section">
                <view class="action-button sell-button" :style="{ background: theme.primary__light, color: theme.white }">{{$t('statistic.sell')}}</view>
            </view>

        </view>
    </view>
</template>

<script>
export default {
    name: 'recordCard',
    props: {
        item: {
            type: Object,
            required: true
        },
        status: {
            type: Number,
            required: true
        }
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },

    methods: {
        handleSell() {
            this.$emit('sell', this.item)
        },
        handleDetail() {
            this.$emit('detail', this.item.id)
        }
    }
}
</script>

<style lang="scss" scoped>
.record-card {
    width: 100%;
    margin-bottom: 16rpx;
    border-radius: 16rpx;
    padding: 24rpx;
    transition: all 0.3s ease;
}

.record-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 2px solid;
    margin-bottom: 20rpx;
}

.stock-name {
    font-size: 28rpx;
    width: 350rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.creation-time {
    font-size: 24rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
}

.record-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24rpx;
}

.detail-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24rpx;
}

.detail-section:last-child {
    align-items: flex-end;
}

.detail-labels {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.detail-label {
    font-size: 22rpx;
    font-weight: 600;
}

.detail-value {
    font-size: 24rpx;
    font-weight: 600;
}

.record-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24rpx;
    margin-bottom: 24rpx;
}

.action-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
}

.action-button {
    padding: 12rpx;
    border-radius: 8rpx;
    text-align: center;
    width: 140rpx;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-button:hover {
    transform: scale(1.05);
}
</style>
