<template>
	<view class="search-list-item" :class="getPriceClass(item.increase)" @click="handleItemClick" :aria-label="`Stock ${item.name} ${item.code}`"
		  :style="getItemStyle(item.increase)">
		<!-- Stock Info Section -->
		<view class="stock-info">
			<view class="stock-name" :title="item.name" :style="{color: theme.textPrimary}">{{item.name || 'N/A'}}</view>
			<view class="stock-meta">
				<text class="stock-code" :style="getStockCodeStyle(item.increase)">{{item.code || 'N/A'}}</text>
				<text v-if="item.country==6" class="country-tag" :style="{color: theme.textTertiary, background: theme.backgroundTertiary}">{{$t('Spanish')}}</text>
				<text v-if="item.country==5" class="country-tag" :style="{color: theme.textTertiary, background: theme.backgroundTertiary}">{{$t('US')}}</text>
				<text v-if="item.country && item.country !== 6 && item.country !== 5" class="country-tag" :style="{color: theme.textTertiary, background: theme.backgroundTertiary}">{{$t('Other')}}</text>
			</view>
		</view>

		<!-- Price Section -->
		<view class="price-section">
			<text class="price-value" :style="{color: getPriceColor(item.increase)}">
				{{formatPrice(item.close)}}
			</text>
		</view>

		<!-- Change Section -->
		<view class="change-section">
			<text class="change-percent" :style="{color: getPriceColor(item.increase)}">
				{{formatPercentage(item.increase)}}
			</text>
		</view>

		<!-- Rise/Fall Section -->
		<view class="rise-fall-section">
			<view class="rise-fall-badge" :style="getRiseFallBadgeStyle(item.increase)">
				<text :style="{color: theme.white}">{{formatPrice(item.rise_or_fall)}}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'SearchListItem',
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
		handleItemClick() {
			this.$emit('item-click', this.item);
		},

		getPriceClass(increase) {
			if (!increase && increase !== 0) return 'price-neutral';
			return increase > 0 ? 'price-up' : increase < 0 ? 'price-down' : 'price-neutral';
		},

		formatPrice(price) {
			if (!price && price !== 0) return 'N/A';
			const num = Number(price);
			if (isNaN(num)) return 'N/A';
			return num.toFixed(3);
		},

		formatPercentage(percentage) {
			if (!percentage && percentage !== 0) return 'N/A';
			const num = Number(percentage);
			if (isNaN(num)) return 'N/A';
			return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
		},
		getItemStyle(increase) {
			const style = {
				background: this.getColorWithOpacity(this.theme.backgroundCard, 0.5)
			}
			const borderColor = this.getPriceColor(increase)
			if (borderColor) {
				style.borderLeft = `6rpx solid ${borderColor}`
			}
			return style
		},
		getStockCodeStyle(increase) {
			const priceColor = this.getPriceColor(increase)
			return {
				color: priceColor || this.theme.primary__500,
				background: this.getColorWithOpacity(priceColor || this.theme.primary__500, 0.1)
			}
		},
		getPriceColor(increase) {
			if (!increase && increase !== 0) return this.theme.textTertiary
			if (increase > 0) return this.theme.success
			if (increase < 0) return this.theme.danger
			return this.theme.textTertiary
		},
		getRiseFallBadgeStyle(increase) {
			const backgroundColor = this.getPriceColor(increase)
			return {
				background: backgroundColor,
				boxShadow: `0 2rpx 8rpx ${this.getColorWithOpacity(backgroundColor, 0.3)}`
			}
		},
		getColorWithOpacity(color, opacity) {
			if (!color) return 'transparent'
			if (color.startsWith('#')) {
				const r = parseInt(color.slice(1, 3), 16)
				const g = parseInt(color.slice(3, 5), 16)
				const b = parseInt(color.slice(5, 7), 16)
				return `rgba(${r}, ${g}, ${b}, ${opacity})`
			}
			if (color.startsWith('rgb')) {
				return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
			}
			return color
		}
	}
}
</script>

<style lang="scss" scoped>
.search-list-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	height: 140rpx;
	backdrop-filter: blur(10rpx);
	-webkit-backdrop-filter: blur(10rpx);
	margin: 16rpx auto;
	padding: 0 32rpx;
	border-radius: 16rpx;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;

	&:active {
		transform: scale(0.98);
		opacity: 0.9;
	}

	/* Stock Info Section */
	.stock-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12rpx;
		max-width: 200rpx;

		.stock-name {
			font-size: 28rpx;
			font-weight: 600;
			line-height: 1.4;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 100%;
		}

		.stock-meta {
			display: flex;
			align-items: center;
			gap: 8rpx;
			flex-wrap: wrap;

			.stock-code {
				font-size: 24rpx;
				font-weight: 500;
				padding: 4rpx 12rpx;
				border-radius: 8rpx;
			}

			.country-tag {
				font-size: 20rpx;
				padding: 2rpx 8rpx;
				border-radius: 4rpx;
			}
		}
	}

	/* Price Section */
	.price-section {
		flex: 1;
		text-align: center;
		padding: 0 16rpx;

		.price-value {
			font-size: 28rpx;
			font-weight: 700;
			line-height: 1.4;
		}
	}

	/* Change Section */
	.change-section {
		flex: 1;
		text-align: center;
		padding: 0 16rpx;

		.change-percent {
			font-size: 28rpx;
			font-weight: 600;
			line-height: 1.4;
		}
	}

	/* Rise/Fall Section */
	.rise-fall-section {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 16rpx;

		.rise-fall-badge {
			padding: 8rpx 16rpx;
			border-radius: 8rpx;
			font-size: 24rpx;
			font-weight: 600;
			min-width: 80rpx;
			text-align: center;
			line-height: 1.4;
			transition: all 0.2s ease;
		}
	}
}

</style>
