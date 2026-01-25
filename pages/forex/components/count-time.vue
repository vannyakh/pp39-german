<template>
	<view class="">
		<text :class="seconds<10?'warning_w':''" style="color: #3EEAA1;" class="title">
			<!-- {{seconds<0?i18n.cycle.closeing:seconds+' s'}} -->
			{{timerrr}}
		</text>
	</view>
</template>

<script>
	export default {
		name: 'countTime',
		props: {
			// 倒计时的时间，秒为单位
			timestamp: {
				type: [Number, String],
				default: 0
			},
			// 是否自动开始倒计时
			autoplay: {
				type: Boolean,
				default: true
			},
			color: {
				type: String,
				default: '#fff'
			}
		},
		watch: {
			// 监听时间戳的变化
			timestamp(newVal, oldVal) {
				// 如果倒计时间发生变化，清除定时器，重新开始倒计时
				this.clearTimer();
				this.start();
			}
		},
		computed: {
			i18n() {
				return this.$t('message');
			},
			timerrr(){
				let time = this.seconds;
				if (time < 0) return '00:00:00';
				let hour = parseInt(time / 3600);
				let minute = parseInt((time % 3600) / 60);
				let second = parseInt(time % 60);
				return `${hour}:${minute}:${second}`;
			}
		},
		data() {
			return {
				timer: null, // 定时器
				seconds: 0, // 记录不停倒计过程中变化的秒数
			};
		},
		filters: {
			// 格式化时间
			formatTime(time) {
				if (time < 0) return '00:00:00';
				let hour = parseInt(time / 3600);
				let minute = parseInt((time % 3600) / 60);
				let second = parseInt(time % 60);
				return `${hour}:${minute}:${second}`;
			},

		},
		mounted() {
			// 如果自动倒计时
			this.autoplay && this.timestamp && this.start();
		},
		methods: {
			// 倒计时
			start() {
				// 避免可能出现的倒计时重叠情况
				this.clearTimer();
				if (this.timestamp <= 0) return;
				this.seconds = Number(this.timestamp);
				this.timer = setInterval(() => {
					this.seconds--;
					// 发出change事件
					// this.$emit('change', this.seconds);
					if (this.seconds < 0) {
						return this.end();
					}
				}, 1000);
			},
			// 停止倒计时
			end() {
				this.clearTimer();
				// 倒计时结束后等待2秒再刷新订单,因为服务器处理订单数据买卖需要时间
				setTimeout(() => {
					this.$emit('end', {});
				}, 2500)
			},
			// 清除定时器
			clearTimer() {
				if (this.timer) {
					// 清除定时器
					clearInterval(this.timer);
					this.timer = null;
				}
			}
		},
		beforeDestroy() {
			clearInterval(this.timer);
			this.timer = null;
		}
	};
</script>

<style lang="scss">
	.title {
		font-size: 24rpx;
		font-family: "NumMedium" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.normal_w {
		color: #fff;
	}

	.warning_w {
		color: #FF4040;
	}
</style>