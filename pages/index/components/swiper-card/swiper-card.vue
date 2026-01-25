<template>
	<view class="swiper-card" :class="cardClass" @click="handleClick">
		<swiper
			class="swiper"
			circular
			:indicator-dots="false"
			:autoplay="autoplay"
			:interval="interval"
			:duration="duration"
			@change="onSwiperChange"
		>
			<swiper-item v-for="(item, index) in swiperData" :key="index">
				<view class="swiper-item">
					<!-- Image Content Mode -->
					<view v-if="isImageContent(item)" class="swiper-image-content">
						<image 
							:src="item.image" 
							class="swiper-main-image" 
							mode="aspectFit"
						/>
						<!-- Image Overlay Slot -->
						<slot 
							name="image-overlay"
							:item="item"
							:index="index"
							:currentIndex="currentIndex"
						>
							<!-- Default image overlay content -->
							<view v-if="item.title || item.description" class="image-overlay">
								<view v-if="item.title" class="swiper-title">{{ item.title }}</view>
								<view v-if="item.description" class="swiper-description">{{ item.description }}</view>
							</view>
						</slot>
					</view>
					
					<!-- Icon + Text Content Mode -->
					<view v-else class="swiper-icon-content">
						<view class="swiper-icon">
							<image 
								:src="item.icon" 
								class="icon-image" 
								:class="{ 'custom-size': iconSizeValue }"
								:style="iconSizeValue ? { width: iconSizeValue, height: iconSizeValue } : {}"
								mode="aspectFit"
							/>
						</view>
						<view class="swiper-title">{{ item.title }}</view>
						<view class="swiper-description">{{ item.description }}</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		
		<!-- Numeric Indicator -->
		<view v-if="showIndicator" class="swiper-indicator">
			<text class="indicator-text">{{ currentIndex + 1 }} / {{ swiperData.length }}</text>
		</view>
	</view>
</template>

<script>
export default {
	name: 'SwiperCard',
	props: {
		// Swiper data array
		swiperData: {
			type: Array,
			required: true,
			default: () => []
		},
		// Card type for styling
		cardType: {
			type: String,
			default: 'default',
			validator: value => ['default', 'large', 'small'].includes(value)
		},
		// Swiper configuration
		autoplay: {
			type: Boolean,
			default: true
		},
		interval: {
			type: Number,
			default: 3000
		},
		duration: {
			type: Number,
			default: 500
		},
		// Indicator mode
		showIndicator: {
			type: Boolean,
			default: true
		},
		// Custom icon size
		iconSize: {
			type: [String, Number],
			default: null
		}
	},
	data() {
		return {
			currentIndex: 0
		}
	},
	computed: {
		cardClass() {
			return `swiper-card-${this.cardType}`
		},
		iconSizeValue() {
			if (this.iconSize) {
				return typeof this.iconSize === 'number' ? `${this.iconSize}rpx` : this.iconSize
			}
			return null
		}
	},
	methods: {
		onSwiperChange(e) {
			this.currentIndex = e.detail.current
			this.$emit('change', e.detail.current)
		},
		handleClick() {
			this.$emit('click')
		},
		isImageContent(item) {
			// Check if item has image property for image content mode
			return item && item.image
		}
	}
}
</script>

<style lang="scss" scoped>
.swiper-card {
	background: var(--card-glass-bg);
	border-radius: var(--radius-lg);
	//padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	backdrop-filter: blur(10px);
	transition: var(--transition-smooth);
	cursor: pointer;
	position: relative;
}

.swiper-card:active {
	transform: scale(0.98);
}

/* Swiper Styles */
.swiper {
	width: 100%;
	height: 100%;
	border-radius: var(--radius-lg);
	overflow: hidden;
}

.swiper-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20rpx;
	height: 100%;
	background: transparent;
	border-radius: var(--radius-lg);
}

.swiper-icon {
	margin-bottom: 15rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon-image {
	width: 60rpx;
	height: 60rpx;
}

.icon-image.custom-size {
	/* Custom size will be applied via inline styles */
}

/* Image Content Mode */
.swiper-image-content {
	position: relative;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.swiper-main-image {
	width: 100%;
	height: 100%;
	border-radius: var(--radius-md);
}

.image-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	padding: 20rpx;
	border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.image-overlay .swiper-title {
	color: white;
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.8);
}

.image-overlay .swiper-description {
	color: rgba(255, 255, 255, 0.9);
	text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.8);
}

/* Icon Content Mode */
.swiper-icon-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

.swiper-title {
	font-size: 28rpx;
	font-weight: bold;
	color: var(--text-color);
	margin-bottom: 8rpx;
	text-align: center;
}

.swiper-description {
	font-size: 22rpx;
	color: var(--text-color);
	opacity: 0.8;
	text-align: center;
	line-height: 1.3;
}

/* Swiper Numeric Indicator */
.swiper-indicator {
	position: absolute;
	bottom: 10rpx;
	right: 10rpx;
	background: rgba(214, 214, 214, 0.6);
	border-radius: 12rpx;
	padding: 4rpx 8rpx;
	backdrop-filter: blur(5px);
	display: flex;
	align-items: center;
}

.indicator-text {
	font-size: 18rpx;
	color: var(--text-color);
	font-weight: 500;
}

/* Card Type Styles */
.swiper-card-large {
	grid-row: 1 / 3;
	grid-column: 1;
}

.swiper-card-large .swiper-item {
	padding: 30rpx 20rpx;
}

.swiper-card-large .swiper-icon {
	margin-bottom: 20rpx;
}

.swiper-card-large .icon-image {
	width: 80rpx;
	height: 80rpx;
}

.swiper-card-large .swiper-main-image {
	border-radius: var(--radius-lg);
}

.swiper-card-large .image-overlay {
	padding: 30rpx;
	border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.swiper-card-large .swiper-title {
	font-size: 32rpx;
	margin-bottom: 10rpx;
}

.swiper-card-large .swiper-description {
	font-size: 24rpx;
}

.swiper-card-large .swiper-indicator {
	bottom: 15rpx;
	right: 15rpx;
}

.swiper-card-large .indicator-text {
	font-size: 20rpx;
}

.swiper-card-small {
	display: flex;
	align-items: center;
	gap: 12rpx;
	//padding: 15rpx;
}

.swiper-card-small .swiper-item {
	flex-direction: column;
	padding: 20rpx;
	gap: 0;
}

.swiper-card-small .swiper-icon {
	margin-bottom: 10rpx;
}

.swiper-card-small .icon-image {
	width: 50rpx;
	height: 50rpx;
}

.swiper-card-small .swiper-main-image {
	border-radius: var(--radius-sm);
}

.swiper-card-small .image-overlay {
	padding: 15rpx;
	border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}

.swiper-card-small .swiper-title {
	font-size: 24rpx;
	margin-bottom: 6rpx;
}

.swiper-card-small .swiper-description {
	font-size: 18rpx;
}

.swiper-card-small .swiper-indicator {
	bottom: 8rpx;
	right: 8rpx;
}

.swiper-card-small .indicator-text {
	font-size: 16rpx;
}
</style>
