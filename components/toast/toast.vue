<template>
	<view class="toast" :class="[
		visible ? 'toast-show' : '',
		content ? 'toast-padding' : '',
		icon ? '' : 'unicon-padding',
		`toast-${type}`
	]" :style="toastStyle">
		<view class="toast-icon" :class="{ 'toast-icon-show': visible }" v-if="icon">{{ iconEmoji }}</view>
		<view class="toast-text" :class="[icon ? '' : 'unicon', visible ? 'text-show' : '']">{{ title }}</view>
		<view class="toast-text content-ptop" :class="{ 'text-show': visible }" v-if="content && icon">{{ content }}</view>
	</view>
</template>

<script>
export default {
	name: "Toast",
	/**
	 * A versatile toast notification component that provides feedback to users.
	 * Features:
	 * - Multiple types (success, error, warning, info)
	 * - Customizable duration
	 * - Optional icon support
	 * - Title and content display
	 * - Smooth animations
	 * - Auto-dismiss functionality
	 *
	 * @example
	 * <toast
	 *   ref="toast"
	 *   :zIndex="99999"
	 * />
	 *
	 * // Usage in methods:
	 * this.$refs.toast.show({
	 *   title: "Success",
	 *   content: "Operation completed",
	 *   icon: true,
	 *   duration: 2000,
	 *   type: "success"
	 * });
	 */
	props: {
		zIndex: {
			type: Number,
			default: 99999
		}
	},
	data() {
		return {
			timer: null,
			// Whether to show the toast
			visible: false,
			// Toast title
			title: "Success",
			// Toast content
			content: "",
			// Whether to show icon
			icon: false,
			// Toast type
			type: "default",
			// Icon emoji
			iconEmoji: ""
		};
	},
	computed: {
		toastStyle() {
			return {
				zIndex: this.zIndex,
				width: this.getWidth(this.icon, this.content)
			}
		}
	},
	methods: {
		/**
		 * Gets emoji icon based on type
		 * @param {string} type - Toast type
		 * @returns {string} Emoji character
		 */
		getIconEmoji(type) {
			switch (type) {
				case 'success':
					return '✓';
				case 'error':
					return '✕';
				case 'warning':
					return '⚠';
				case 'info':
					return 'ℹ';
				default:
					return 'ℹ';
			}
		},
		/**
		 * Shows the toast with specified options
		 * @param {Object} options - Toast configuration options
		 * @param {string} [options.title=""] - Toast title text
		 * @param {string} [options.content=""] - Toast content text
		 * @param {boolean} [options.icon=false] - Whether to show an icon
		 * @param {string} [options.iconEmoji=""] - Custom emoji/text icon
		 * @param {number} [options.duration=2000] - Duration in milliseconds before auto-dismiss
		 * @param {string} [options.type="default"] - Toast type (success, error, warning, info, default)
		 */
		show: function(options) {
			let {
				duration = 2000,
				icon = false,
				type = "default"
			} = options;

			// Clear any existing timer
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}

			// Reset state if toast is already visible
			if (this.visible) {
				this.visible = false;
				setTimeout(() => {
					this.updateToast(options, icon, type);
				}, 100);
			} else {
				this.updateToast(options, icon, type);
			}

			// Set auto-dismiss timer
			this.timer = setTimeout(() => {
				this.visible = false;
				setTimeout(() => {
					this.reset();
				}, 300);
			}, duration);
		},
		updateToast(options, icon, type) {
			this.title = options.title || "";
			this.content = options.content || "";
			this.icon = icon;
			this.type = type;

			// Set icon emoji based on type or use custom emoji
			if (icon) {
				if (options.iconEmoji) {
					this.iconEmoji = options.iconEmoji;
				} else {
					this.iconEmoji = this.getIconEmoji(type);
				}
			}

			// Show toast with slight delay for smooth animation
			setTimeout(() => {
				this.visible = true;
			}, 50);
		},
		reset() {
			this.title = "";
			this.content = "";
			this.icon = false;
			this.iconEmoji = "";
			this.type = "default";
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
		},
		/**
		 * Calculates the width of the toast based on content and icon
		 * @param {boolean} icon - Whether an icon is present
		 * @param {string} content - Content text
		 * @returns {string} Width value for the toast
		 */
		getWidth(icon, content) {
			let width = "auto";
			if (icon) {
				width = content ? '420rpx' : '360rpx'
			}
			return width
		}
	}
}
</script>

<style lang="scss" scoped>
.toast {
	background: linear-gradient(135deg, rgba(0, 0, 0, 0.393), rgba(0, 0, 0, 0.392));
	border-radius: 16rpx;
	position: fixed;
	visibility: hidden;
	opacity: 0;
	left: 50%;
	top: 48%;
	transform: translate(-50%, -50%) scale(0.8);
	transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 60rpx 20rpx 54rpx 20rpx;
	box-sizing: border-box;
	backdrop-filter: blur(10px);

	&.toast-show {
		visibility: visible;
		opacity: 1;
		transform: translate(-50%, -50%) scale(1);
	}

	&.toast-success {
		background: linear-gradient(135deg, rgba(52, 199, 89, 0.162), rgba(52, 199, 89, 0.176));
	}

	&.toast-error {
		background: linear-gradient(135deg, rgba(255, 59, 48, 0.162), rgba(255, 59, 48, 0.176));
	}

	&.toast-warning {
		background: linear-gradient(135deg, rgba(255, 149, 0, 0.162), rgba(255, 149, 0, 0.176));
	}

	&.toast-info {
		background: linear-gradient(135deg, rgba(0, 122, 255, 0.162), rgba(0, 122, 255, 0.176));
	}

	&.toast-padding {
		padding-top: 50rpx !important;
		padding-bottom: 50rpx !important;
	}
}

.unicon-padding {
	padding: 24rpx 40rpx !important;
	word-break: break-all;
}

.toast-icon {
	width: 120rpx;
	height: 120rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 28rpx;
	font-size: 80rpx;
	line-height: 1;
	opacity: 0;
	transform: scale(0.5);
	transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

	&.toast-icon-show {
		opacity: 1;
		transform: scale(1);
	}
}

.toast-text {
	font-size: 30rpx;
	line-height: 30rpx;
	font-weight: 400;
	color: #fff;
	text-align: center;
	opacity: 0;
	transform: translateY(10rpx);
	transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	transition-delay: 0.1s;

	&.unicon {
		line-height: 40rpx !important;
		font-size: 32rpx !important;
	}

	&.text-show {
		opacity: 1;
		transform: translateY(0);
	}

	&.content-ptop {
		padding-top: 10rpx;
		font-size: 26rpx !important;
		transition-delay: 0.2s;
	}
}

@keyframes bounce {
	0%, 20%, 50%, 80%, 100% {
		transform: translateY(0);
	}

	40% {
		transform: translateY(-10rpx);
	}

	60% {
		transform: translateY(-5rpx);
	}
}

.toast-show .toast-icon-show {
	animation: bounce 1s ease 0.3s;
}
</style>

