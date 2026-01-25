<template>
	<view class="investment-card" :style="{background: theme.backgroundCard}">
		<!-- Card Image -->
		<view class="card-image">
			<u-image
				class="platform-image"
				:src="item.logo_image"
				mode="aspectFill"
                width="100%"
                height="100%"
				:showLoading="true"
				:lazyLoad="true"
			>
				<view slot="loading">
					<u-loading-icon :color="theme.primary__light"></u-loading-icon>
				</view>
			</u-image>
		</view>

		<!-- Card Content -->
		<view class="card-content">
			<!-- Title -->
			<view class="platform-title-row">
				<view class="platform-title" :style="{ color: theme.textPrimary }">{{ item.name }}</view>
				<view v-if="item.type" class="type-badge" :style="{ background: theme.primary__light, color: theme.white }">{{ item.type }}</view>
			</view>

			<!-- Status Badge -->
			<view class="status-badge" :style="getStatusStyle(item.status)">
				{{ item.status === 1 ? $t('invest.active') : $t('invest.inactive') }}
			</view>

			<!-- Investment Details -->
			<view class="investment-details">
				<view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
					<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.amount') }}</text>
					<text class="detail-value" :style="{ color: theme.primary__light }">${{ item.price }}</text>
				</view>
				<view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
					<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.daily_interest_rate') }}</text>
					<text class="detail-value" :style="{ color: theme.primary__light }">{{ item.rixi }}</text>
				</view>
				<view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
					<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.period') }}</text>
					<text class="detail-value" :style="{ color: theme.primary__light }">{{ item.day }} {{ $t('invest.days') }}</text>
				</view>
				<view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
					<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.minimum_investment') }}</text>
					<text class="detail-value" :style="{ color: theme.primary__light }">{{ item.min_num }} {{ $t('invest.units') }}</text>
				</view>
				<view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
					<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.maximum_investment') }}</text>
					<text class="detail-value" :style="{ color: theme.primary__light }">{{ item.max_num }} {{ $t('invest.units') }}</text>
				</view>
				<view class="detail-row">
					<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.already_purchased') }}</text>
					<text class="detail-value" :style="{ color: theme.textPrimary }">{{ item.already_buy }} {{ $t('invest.units') }}</text>
				</view>
			</view>

			<!-- Subscription Button -->
			<button
				class="subscription-button"
				:class="{ 'disabled': item.status !== 1 }"
				:disabled="item.status !== 1"
				:style="getButtonStyle(item.status)"
				@click="handleSubscription"
			>
				{{ item.status === 1 ? $t('invest.subscribe_now') : $t('invest.currently_unavailable') }}
			</button>
		</view>
	</view>
</template>

<script>
export default {
	name: 'InvestmentCard',
	props: {
		item: {
			type: Object,
			required: true
		}
	},
	computed: {
		theme() {
			return this.$store.getters.theme
		}
	},
	methods: {
		handleSubscription() {
			// Check if product is active
			if (this.item.status !== 1) {
					uni.showToast({
						title: this.$t('invest.product_unavailable'),
						icon: 'none'
					})
				return
			}

			// Emit event to parent component
			this.$emit('subscribe', this.item)
		},
		getStatusStyle(status) {
			if (status === 1) {
				return {
					background: this.theme.success__50,
					color: this.theme.success__700
				}
			}
			return {
				background: this.theme.danger__50,
				color: this.theme.danger__700
			}
		},
		getButtonStyle(status) {
			if (status !== 1) {
				return {
					background: this.theme.neutral__400,
					color: this.theme.textTertiary
				}
			}
			return {
				background: `linear-gradient(135deg, ${this.theme.primary__light} 0%, ${this.theme.success__500} 100%)`,
				color: this.theme.white
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.investment-card {
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 20rpx;
}

.card-image {
	width: 100%;
	height: 300rpx;
	position: relative;
	overflow: hidden;
}

.platform-image {
	width: 100% !important;
	height: 100% !important;
}

.card-content {
	padding: 30rpx;
}

.platform-title-row {
	display: flex;
	align-items: center;
	gap: 12rpx;
	flex-wrap: wrap;
}

.platform-title {
	font-size: 32rpx;
	font-weight: bold;
	line-height: 1.4;
}

.type-badge {
	padding: 4rpx 12rpx;
	border-radius: 4rpx;
	font-size: 20rpx;
	font-weight: 500;
	white-space: nowrap;
}

.status-badge {
	display: inline-block;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: 600;
	margin-bottom: 30rpx;
}

.investment-details {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin-bottom: 40rpx;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15rpx 0;
	border-bottom: 2rpx solid;

	&:last-child {
		border-bottom: none;
	}
}

.detail-label {
	font-size: 28rpx;
	font-weight: 500;
}

.detail-value {
	font-size: 28rpx;
	font-weight: 600;
}

.subscription-button {
	width: 100%;
	height: 80rpx;
	border: none;
	border-radius: 16rpx;
	font-size: 30rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;

	&:active {
		transform: translateY(2rpx);
	}

	&.disabled {
		opacity: 0.6;

		&:active {
			transform: none;
		}
	}
}

/* Responsive adjustments */
@media (max-width: 750rpx) {
	.card-image {
		height: 250rpx;
	}

	.card-content {
		padding: 25rpx;
	}

	.platform-title {
		font-size: 30rpx;
	}

	.detail-label,
	.detail-value {
		font-size: 26rpx;
	}

	.subscription-button {
		height: 70rpx;
		font-size: 28rpx;
	}
}
</style>
