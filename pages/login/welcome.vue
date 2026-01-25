<template>
	<view class="welcome-page">
		<!-- Background color overlay -->
		<view class="color-overlay" :style="{ background: getColorWithOpacity(theme.neutral__900 || '#000000', 0.4) }"></view>

		<!-- Background with trading elements -->
		<view class="background-overlay">
			<view class="trading-elements">
				<view class="candlestick-pattern pattern-1" :style="{ background: getColorWithOpacity(theme.white, 0.15) }"></view>
				<view class="candlestick-pattern pattern-2" :style="{ background: getColorWithOpacity(theme.white, 0.1) }"></view>
				<view class="chart-line line-1" :style="{ background: getColorWithOpacity(theme.white, 0.2) }"></view>
				<view class="chart-line line-2" :style="{ background: getColorWithOpacity(theme.white, 0.15) }"></view>
				<view class="glow-circle circle-1"></view>
				<view class="glow-circle circle-2"></view>
			</view>
		</view>

		<app-nav :showBackButton="false" blur>
			<template #right>
				<view class="language" @click="router.push('/pages/my/lang')">
					<image :src="$t('logo')" class="lang-logo"></image>
					<text class="lang-text" :style="{ color: theme.white }">{{ $t('language') }}</text>
				</view>
			</template>
		</app-nav>

		<!-- Main Content -->
		<view class="welcome-content">
			<!-- Logo Section -->
			<view class="logo-section">
				<view class="logo-container" :style="{ background: getColorWithOpacity(theme.white, 0.2), boxShadow: `0 8rpx 24rpx ${getColorWithOpacity(theme.neutral__900, 0.2)}` }">
					<image class="logo-image" :src="appLogo" mode="aspectFill"></image>
				</view>
			</view>

			<!-- Welcome Message -->
			<view class="welcome-message">
				<text class="welcome-title" :style="{ color: theme.white }">{{ $t('welcome.title') || 'Welcome to Trading' }}</text>
				<text class="welcome-subtitle" :style="{ color: getColorWithOpacity(theme.white, 0.9) }">{{ $t('welcome.subtitle') || 'Trade stocks, coins, and forex with confidence' }}</text>
			</view>

			<!-- Features -->
			<view class="features-list">
				<view class="feature-item">
					<u-icon name="checkmark-circle" size="24" :color="theme.white"></u-icon>
					<text class="feature-text" :style="{ color: getColorWithOpacity(theme.white, 0.9) }">{{ $t('welcome.feature1') || 'Real-time Market Data' }}</text>
				</view>
				<view class="feature-item">
					<u-icon name="checkmark-circle" size="24" :color="theme.white"></u-icon>
					<text class="feature-text" :style="{ color: getColorWithOpacity(theme.white, 0.9) }">{{ $t('welcome.feature2') || 'Secure Trading Platform' }}</text>
				</view>
				<view class="feature-item">
					<u-icon name="checkmark-circle" size="24" :color="theme.white"></u-icon>
					<text class="feature-text" :style="{ color: getColorWithOpacity(theme.white, 0.9) }">{{ $t('welcome.feature3') || '24/7 Customer Support' }}</text>
				</view>
			</view>
		</view>

		<!-- Get Started Button -->
		<view class="action-buttons">
			<button
				@click="welcomeStart"
				class="action-button primary-button"
				:style="getPrimaryButtonStyle()"
			>
				<text class="button-text" :style="{ color: theme.white }">{{ $t('welcome.getStarted') || 'Get Started' }}</text>
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			appLogo: ''
		}
	},
	computed: {
		theme() {
			return this.$store.getters.theme
		}
	},
	onLoad() {
		this.checkAuthAndLoad()
	},
	onShow() {
		// Check again when page is shown (in case user navigated back)
		this.checkAuthAndLoad()
	},
	methods: {
        checkAuthAndLoad() {
            // Check if user is already logged in
            const hasToken = uni.getStorageSync('token')
            if (hasToken) {
                uni.reLaunch({
                    url: '/pages/index/index'
                })
                return true  // Add return value
            }
            this.appLogo = this.$store.state.logo || '/static/logo.png'
            return false  // Add return value
        },

        welcomeStart() {
            if (this.checkAuthAndLoad()) {
                return
            }
            this.router.push('/pages/login/index')
        },

		getPrimaryButtonStyle() {
			return {
				background: this.theme.primary__500,
				color: this.theme.white,
				boxShadow: `0 4rpx 12rpx ${this.getColorWithOpacity(this.theme.neutral__900 || this.theme.textPrimary, 0.15)}`
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
.welcome-page {
	position: relative;
	min-height: 100vh;
	height: 100vh;
	background-image: url('/static/slash.png');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	display: flex;
	flex-direction: column;
	padding: 60rpx 30rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 60rpx);
	overflow: hidden;
}

.color-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
}

.background-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
	z-index: 2;
}

.trading-elements {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}

.candlestick-pattern {
	position: absolute;
	border-radius: 4rpx;
	opacity: 0.8;
}

.pattern-1 {
	width: 8rpx;
	height: 60rpx;
	top: 20%;
	right: 15%;
	transform: rotate(15deg);
}

.pattern-2 {
	width: 8rpx;
	height: 80rpx;
	top: 50%;
	left: 10%;
	transform: rotate(-10deg);
}

.chart-line {
	position: absolute;
	height: 2rpx;
	border-radius: 2rpx;
	opacity: 0.6;
}

.line-1 {
	width: 120rpx;
	top: 30%;
	left: 20%;
	transform: rotate(25deg);
}

.line-2 {
	width: 100rpx;
	top: 65%;
	right: 25%;
	transform: rotate(-20deg);
}

.glow-circle {
	position: absolute;
	border-radius: 50%;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
	animation: float 6s ease-in-out infinite;
}

.circle-1 {
	width: 100rpx;
	height: 100rpx;
	top: 15%;
	left: 15%;
	animation-delay: 0s;
}

.circle-2 {
	width: 80rpx;
	height: 80rpx;
	bottom: 25%;
	right: 20%;
	animation-delay: 3s;
}

@keyframes float {
	0%, 100% { transform: translateY(0px); }
	50% { transform: translateY(-20px); }
}

.welcome-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 3;
	position: relative;
}

.logo-section {
	margin-bottom: 60rpx;
}

.logo-container {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	backdrop-filter: blur(10rpx);
}

.logo-image {
	width: 100%;
	height: 100%;
}

.welcome-message {
	text-align: center;
	margin-bottom: 60rpx;
}

.welcome-title {
	font-size: 48rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 20rpx;
	text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
}

.welcome-subtitle {
	font-size: 28rpx;
	display: block;
	line-height: 1.6;
}

.features-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	width: 100%;
	max-width: 500rpx;
}

.feature-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.feature-text {
	font-size: 26rpx;
	flex: 1;
}

.action-buttons {
	display: flex;
	flex-direction: column;
	z-index: 3;
	position: relative;
}

.action-button {
	width: 100%;
	height: 88rpx;
	border: none;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
}

.action-button:active {
	transform: translateY(2rpx);
}

.button-text {
	font-size: 32rpx;
	font-weight: 600;
}

.language {
	display: flex;
	align-items: center;
	gap: 8rpx;
	z-index: 3;
	position: relative;
	.lang-logo {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
	}
	.lang-text {
		font-size: 28rpx;
	}
}
</style>

