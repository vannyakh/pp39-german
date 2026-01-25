
<template>
	<view class="kefu-float" :class="{ 'is-animated': animate }" :style="floatStyle" @click="handleClick">
		<image :src="iconSrc" class="kefu-icon" mode="aspectFit" />
	</view>
</template>

<script>
export default {
	name: 'KefuFloat',
	props: {
		// Optional explicit link to open
		href: {
			type: String,
			default: ''
		},
		// Distance from bottom/right
		bottom: {
			type: String,
			default: '120rpx'
		},
        top: {
            type: String,
            default: ''
        },
		right: {
			type: String,
			default: '20rpx'
		},
		// Button size (width/height)
		size: {
			type: String,
			default: '100rpx'
		},
		// Allow override of icon path if needed
		icon: {
			type: String,
			default: '/static/imgs/customer_service/kefu.png'
		},
		// Enable a subtle attention animation
		animate: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		floatStyle() {
			return {
				position: 'fixed',
				bottom: this.bottom,
				right: this.right,
				width: this.size,
				height: this.size,
                top: this.top,
				zIndex: 1000
			}
		},
		iconSrc() {
			return this.icon
		}
	},
	methods: {
		handleClick() {
			// 1) If href prop provided, open it
			if (this.href) {
				this.openLink(this.href)
				return
			}

			// 2) Try to read from store (object or array formats)
			const linkState = this.$store && this.$store.state && this.$store.state.kefuList
			if (linkState) {
				if (typeof linkState === 'object' && !Array.isArray(linkState)) {
					const first = Object.values(linkState)[0]
					if (first) return this.openLink(first)
				}
				if (Array.isArray(linkState) && linkState.length > 0) {
					return this.openLink(linkState[0])
				}
			}

			// 3) Fallback: navigate to customer service page
			this.router.push('/pages/index/service/index')
		},
		openLink(link) {
			const url = link || ''
			// #ifdef APP-PLUS
			plus.runtime.openURL(url)
			// #endif
			// #ifdef WEB
			window.open(url)
			// #endif
		}
	}
}
</script>

<style lang="scss" scoped>
.kefu-float {
	//background: #ffffff;
	//border-radius: 50%;
	//box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	//border: 2rpx solid rgba(0, 0, 0, 0.05);
}

.kefu-icon {
	width: 100%;
	height: 100%;
}

/* subtle float animation */
.is-animated {
	animation: kefu-bob 2.8s ease-in-out infinite;
}

@keyframes kefu-bob {
	0%, 100% {
		transform: translateY(0);
		filter: drop-shadow(0 6rpx 14rpx rgba(0,0,0,0.18));
	}
	50% {
		transform: translateY(-10rpx);
		filter: drop-shadow(0 10rpx 18rpx rgba(0,0,0,0.22));
	}
}
</style>


