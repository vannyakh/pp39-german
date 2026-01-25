<template>
	<view class="position-card" :style="{ background: theme.backgroundCard }">
		<!-- Header Row -->
		<view class="position-header" :style="{ borderBottomColor: theme.neutral__200 }">
			<view class="stock-name" :style="{ color: theme.textPrimary }">{{item.name}}</view>
			<view class="creation-time" :style="{ color: theme.textTertiary }">{{item.createtime}}</view>
		</view>

		<!-- Price and Quantity Row -->
		<view class="position-details">
			<view class="detail-section">
				<view class="detail-labels">
						<text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('ai_subscribe.current_price')}}</text>
						<text class="detail-label" :style="{ color: theme.textSecondary }">/</text>
						<text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('ai_subscribe.cost')}}</text>
				</view>
				<text class="detail-value" :style="{ color: theme.textPrimary }">{{item.close}}/{{item.price}}</text>
			</view>

			<view class="detail-section">
					<text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('ai_subscribe.lot')}}</text>
				<text class="detail-value" :style="{ color: theme.textPrimary }">{{item.num}}</text>
			</view>

			<view class="detail-section">
					<text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('ai_subscribe.pnl')}}</text>
				<text class="detail-value" :style="{ color: theme.textPrimary }">
					{{Number(item.rise_all_fall).toFixed(3)}}/
					<span :style="{ color: item.increase>=0 ? theme.success : theme.danger__500 }">{{item.increase}}%</span>
				</text>
			</view>
		</view>

		<!-- Position Details Row -->
		<view class="position-footer">
			<view class="detail-section">
					<text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('ai_subscribe.position_ratio')}}</text>
				<text class="detail-value" :style="{ color: item.position_ratio>=0 ? theme.success : theme.danger__500 }">
					{{item.position_ratio}}%
				</text>
			</view>

			<view class="detail-section">
					<text class="detail-label" :style="{ color: theme.textSecondary }">{{$t('ai_subscribe.total_purchased')}}</text>
				<text class="detail-value" :style="{ color: theme.textPrimary }">{{Number(item.num*item.price).toFixed(3)}}</text>
			</view>

			<view v-if="status == 2" @click="handleSell" class="action-section">
					<view class="action-button" :style="{ background: theme.primary__light, color: theme.white }">{{$t('ai_subscribe.sell')}}</view>
			</view>

			<view v-if="status==3" @click="handleDetail" class="action-section">
					<view class="action-button" :style="{ background: theme.success__500, color: theme.white }">{{$t('ai_subscribe.details')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PositionCard',
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
			this.$emit('detail', this.item)
		}
	}
}
</script>

<style lang="scss" scoped>
.position-card {
	width: 100%;
	margin-bottom: 16rpx;
	border-radius: 16rpx;
	padding: 24rpx;
	transition: all 0.3s ease;
}

.position-header {
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

.position-details {
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

.position-footer {
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
