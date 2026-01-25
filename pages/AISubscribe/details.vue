<template>
	<view class="position-details-page min-height-screen" :style="{ background: theme.backgroundSecondary, color: theme.textPrimary }">
		<app-nav :title="$t('ai_subscribe.position_details')" blur></app-nav>

		<v-container size="md">
			<!-- Skeleton for Header Card -->
			<view v-if="isLoading || !dataObj || Object.keys(dataObj).length === 0" class="position-header-card skeleton" :style="{ background: theme.backgroundCard, borderColor: theme.neutral__200 }">
				<view class="stock-info">
					<view class="stock-details">
						<view class="sk-line sk-stock-name" :style="getSkeletonStyle()"></view>
						<view class="sk-line sk-stock-code" :style="getSkeletonStyle()"></view>
					</view>
				</view>
				<view class="status-section">
					<view class="sk-line sk-status-badge" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-percentage-badge" :style="getSkeletonStyle()"></view>
				</view>
				<view class="price-lot-section" :style="{ background: theme.backgroundTertiary }">
					<view class="info-item">
						<view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
						<view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
					</view>
					<view class="info-item">
						<view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
						<view class="sk-line sk-value" :style="getSkeletonStyle()"></view>
					</view>
				</view>
			</view>

			<!-- Actual Header Card -->
			<view v-else class="position-header-card" :style="{ background: theme.backgroundCard, borderColor: theme.neutral__200 }">
				<view class="stock-info">
					<view class="stock-details">
						<view class="stock-name" :style="{ color: theme.textPrimary }">{{dataObj.name}}</view>
						<view class="stock-code" :style="{ color: theme.textTertiary }">{{dataObj.code}}</view>
					</view>
				</view>
				<view class="status-section">
					<view class="status-badge status-pending" v-if="dataObj.status==1" :style="{ background: theme.info__500, color: theme.white }">
						{{ $t('ai_subscribe.pending_order') }}
					</view>
					<view class="status-badge status-active" v-if="dataObj.status==2" :style="{ background: theme.primary__500, color: theme.white }">
						{{ $t('ai_subscribe.position_in_progress') }}
					</view>
					<view class="status-badge status-closed" v-if="dataObj.status==3" :style="{ background: theme.success__500, color: theme.white }">
						{{ $t('ai_subscribe.position_close') }}
					</view>

					<view class="percentage-badge" :style="{ color: theme.danger__500 }">
						<span v-if="dataObj.status==1">{{ $t('ai_subscribe.pending_order') }}</span>
						<span v-if="dataObj.status==2">{{calculatePercentage(dataObj.close, dataObj.price)}}%</span>
						<span v-if="dataObj.status==3">{{calculatePercentage(dataObj.pc_price, dataObj.price)}}%</span>
					</view>
				</view>
				<view class="price-lot-section" :style="{ background: theme.backgroundTertiary }">
					<view class="info-item">
						<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.buy_price') }}</text>
						<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.price}}</text>
					</view>
					<view class="info-item">
						<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.lot') }}</text>
						<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.num}}</text>
					</view>
				</view>
			</view>
		</v-container>

		<v-container size="md">
			<!-- Skeleton for Basic Info Card -->
			<view v-if="isLoading || !dataObj || Object.keys(dataObj).length === 0" class="basic-info-card skeleton" :style="{ background: theme.backgroundCard, borderColor: theme.neutral__200 }">
				<view class="card-header">
					<view class="sk-line sk-card-title" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
				<view class="info-row">
					<view class="sk-line sk-row-label" :style="getSkeletonStyle()"></view>
					<view class="sk-line sk-row-value" :style="getSkeletonStyle()"></view>
				</view>
			</view>

			<!-- Actual Basic Info Card -->
			<view v-else class="basic-info-card" :style="{ background: theme.backgroundCard, borderColor: theme.neutral__200 }">
				<view class="card-header">
					<text class="card-title" :style="{ color: theme.textPrimary }">{{ $t('ai_subscribe.basic_information') }}</text>
				</view>
				<view class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.buy_sell_type') }}</text>
					<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.k_or_d=='k' ? $t('ai_subscribe.sell') : $t('ai_subscribe.buy')}}</text>
				</view>
				<view class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.buy_time') }}</text>
					<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.createtime}}</text>
				</view>
				<view v-if="dataObj.status==3" class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.sell_time') }}</text>
					<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.updatetime}}</text>
				</view>
				<view v-if="dataObj.status==3" class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.sell_price') }}</text>
					<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.pc_price}}</text>
				</view>
				<view class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.initial_margin') }}</text>
					<text class="info-value" :style="{ color: theme.textPrimary }">{{calculateMargin(dataObj.close, dataObj.num)}}</text>
				</view>
				<view class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.leverage') }}</text>
					<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.leverage || 1}}</text>
				</view>
				<view class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.market_value') }}</text>
					<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.close}}</text>
				</view>
				<view class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.type') }}</text>
					<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.type==1 ? $t('ai_subscribe.market_price') : $t('ai_subscribe.limit_price')}}</text>
				</view>
				<view class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.pnl') }}</text>
					<text class="info-value" :style="{ color: getPnLColor(dataObj.rise_all_fall) }">
						{{formatNumber(dataObj.rise_all_fall)}}
					</text>
				</view>
				<view class="info-row">
					<text class="info-label" :style="{ color: theme.textSecondary }">{{ $t('ai_subscribe.fee') }}</text>
					<text class="info-value" :style="{ color: theme.textPrimary }">{{dataObj.fee || 0}}</text>
				</view>
			</view>
		</v-container>

        <home-return/>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataObj: {},
				timer: null,
				isLoading: false,
			};
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		onLoad(e) {
			this.getdetails(e.id,e.status)
		},

		methods: {
			getSkeletonStyle() {
				return {
					background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 50%, ${this.theme.neutral__200} 75%)`
				}
			},
			getdetails(id,status) {
				this.isLoading = true
				this.post('/stock_ai/order_list_id', {
					id: id,
					status:status
				}).then((res) => {
					if (res.code == 1) {
						if (res.data){
							this.dataObj = res.data
						}
					}
				}).catch((error) => {
					console.error('Failed to fetch position details:', error)
				}).finally(() => {
					this.isLoading = false
				})
			},

			// Safe percentage calculation with validation
			calculatePercentage(current, base) {
				if (!current || !base || base === 0) return '0.000'
				const percentage = ((current - base) / base) * 100
				return isNaN(percentage) ? '0.000' : percentage.toFixed(3)
			},

			// Safe margin calculation with validation
			calculateMargin(price, quantity) {
				if (!price || !quantity) return '0.000'
				const margin = price * quantity
				return isNaN(margin) ? '0.000' : margin.toFixed(3)
			},

			// Safe number formatting with validation
			formatNumber(value) {
				if (value === null || value === undefined || value === '') return '0.000'
				const num = Number(value)
				return isNaN(num) ? '0.000' : num.toFixed(3)
			},

			// Get P&L class based on value
			getPnLClass(value) {
				if (!value || isNaN(Number(value))) return ''
				return Number(value) >= 0 ? 'profit-text' : 'loss-text'
			},

			// Get P&L color based on value
			getPnLColor(value) {
				if (!value || isNaN(Number(value))) return this.theme.textPrimary
				return Number(value) >= 0 ? this.theme.success : this.theme.danger__500
			}
		}
	}
</script>

<style lang="scss" scoped>
/* Position Details Page Styles */
.position-header-card {
	border-radius: 32rpx;
	margin-bottom: 32rpx;
	padding: 48rpx 32rpx;
	border: 2rpx solid;
}

.stock-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.stock-details {
	display: flex;
	flex-direction: column;
}

.stock-name {
	font-size: 28rpx;
	font-weight: 600;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.stock-code {
	font-size: 22rpx;
	font-weight: 600;
}

.status-section {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 32rpx;
}

.status-badge {
	padding: 8rpx 24rpx;
	border-radius: 12rpx;
	font-size: 22rpx;
	font-weight: 500;
}

.percentage-badge {
	padding: 8rpx 24rpx;
	border-radius: 12rpx;
	background: transparent;
	font-size: 25rpx;
	font-weight: 500;
}

.price-lot-section {
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 24rpx;
	margin-top: 32rpx;
	border-radius: 16rpx;
}

.info-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.info-label {
	font-size: 25rpx;
}

.info-value {
	font-size: 28rpx;
	font-weight: 600;
}

.basic-info-card {
	border-radius: 32rpx;
	padding: 48rpx 32rpx;
	border: 2rpx solid;
}

.card-header {
	margin-bottom: 32rpx;
}

.card-title {
	font-size: 28rpx;
	font-weight: 600;
}

.info-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 0;
}

.info-row:last-child {
	border-bottom: none;
}

/* Skeleton Loading Styles */
.skeleton {
	position: relative;
	overflow: hidden;

	.sk-line {
		background-size: 200% 100%;
		animation: sk-shimmer 1.5s ease-in-out infinite;
		border-radius: 8rpx;
		height: 24rpx;
		display: block;
	}

	.sk-stock-name {
		width: 260rpx;
		height: 32rpx;
		margin-bottom: 12rpx;
	}

	.sk-stock-code {
		width: 180rpx;
		height: 24rpx;
	}

	.sk-status-badge {
		width: 140rpx;
		height: 32rpx;
		border-radius: 6rpx;
	}

	.sk-percentage-badge {
		width: 100rpx;
		height: 28rpx;
		border-radius: 6rpx;
	}

	.sk-label {
		width: 120rpx;
		height: 20rpx;
		margin-bottom: 8rpx;
	}

	.sk-value {
		width: 80rpx;
		height: 28rpx;
	}

	.sk-card-title {
		width: 200rpx;
		height: 28rpx;
	}

	.sk-row-label {
		width: 160rpx;
		height: 22rpx;
	}

	.sk-row-value {
		width: 120rpx;
		height: 22rpx;
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
