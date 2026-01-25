<template>
	<view class="min-height-screen flex flex-direction" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
		<bg-animate-shape/>
		<app-nav :title="$t('Fund details')" showRightImage rightImageUrl="/static/imgs/fund/record.png"
			@right-action="router.push('/pages/index/money/fund_record')"></app-nav>

		<view class="relative width-100b flex-2" :style="{background: theme.backgroundCard, overflow: 'hidden', height: '800rpx'}">
			<iframe style="width: 750rpx;height: 400px;overflow: hidden" :src="htmlSrc" frameborder="0"></iframe>
		</view>

		<view class="padding-w-20">
			<view class="flex direction-column padding-c-20 padding-w-32 radiu-20 width-100b margin-t-5"
				:style="{background: theme.backgroundCard}">
				<view class="height-66 flex align-center justify-between">
					<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Name')}}</text>
					<text class="font-28 bold-font" :style="{color: theme.textPrimary}">{{sharesInfo.name}}</text>
				</view>
				<view class="height-66 flex align-center justify-between">
					<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Price')}}</text>
					<view class="flex align-center justify-center gap-20">
						<view class="font-28 bold-font" :style="{color: getPriceColor(sharesInfo.increase)}">{{Number(sharesInfo.price).toFixed(3)}}</view>
						<!-- <view v-if="sharesInfo.country==42" class="font-30" :style="{color: theme.textPrimary}">{{$t('Symbol_ms')}}</view> -->
						<!-- <view v-if="sharesInfo.country==39" class="font-30" :style="{color: theme.textPrimary}">{{$t('Symbol_cn')}}</view> -->
					</view>

				</view>
				<view class="height-66 flex align-center justify-between">
					<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Mining Period')}}</text>
					<text class="font-28 bold-font" :style="{color: getPriceColor(sharesInfo.increase)}">
						{{sharesInfo.day}} <span class="margin-l-12">{{$t('day') }}</span>
					</text>
				</view>
				<!-- <view class="height-66 flex align-center justify-between">
					<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Quote Change')}}</text>
					<text class="font-28 bold-font" :style="{color: getPriceColor(sharesInfo.increase)}">
						{{sharesInfo.increase>=0?'+':''}}{{sharesInfo.increase}}%
					</text>
				</view> -->
				<view class="height-66 flex align-center justify-between">
					<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Income')}}</text>
					<text class="font-28 bold-font" :style="{color: getPriceColor(sharesInfo.increase)}">
						{{sharesInfo.fast_rixi}} %
					</text>
				</view>

				<view class="height-66 flex align-center justify-between">
					<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Select Quantity')}}</text>
					<u-number-box v-model="num">
					        <view
					            slot="minus"
					            class="minus"
					            :style="getMinusStyle()"
					        >
					            <u-icon
					                name="minus"
					                :color="theme.textPrimary"
					                size="14"
					            ></u-icon>
					        </view>
					        <text
					            slot="input"
					            style="width: 50px;text-align: center;"
					            class="input font-30 bold-font"
					            :style="{color: theme.textPrimary}"
					        >{{num}}</text>
					        <view
					            slot="plus"
					            class="plus"
					            :style="getPlusStyle()"
					        >
					            <u-icon
					                name="plus"
					                :color="theme.white"
					                size="14"
					            ></u-icon>
					        </view>
					    </u-number-box>
				</view>
				<view class="height-66 flex align-center justify-between">
					<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Total Amount')}}</text>
					<view class="flex align-center justify-center gap-20">
						<view class="font-28 bold-font" :style="{color: getPriceColor(sharesInfo.increase)}">{{Number(total_num).toFixed(3)}}</view>
						<!-- <view v-if="sharesInfo.country==42" class="font-30" :style="{color: theme.textPrimary}">{{$t('Symbol_ms')}}</view> -->
						<!-- <view v-if="sharesInfo.country==39" class="font-30" :style="{color: theme.textPrimary}">{{$t('Symbol_cn')}}</view> -->
					</view>
				</view>
			</view>
		</view>
		<view class="height-300"></view>
		<view class="height-120 fixed width-100b flex align-center justify-between padding-w-32" :style="{background: theme.backgroundCard}" style="bottom: 0;z-index: 999;gap: 12px;">
			<view @click="goumai" class="flex align-center justify-center padding-25 width-100b radiu-30"
				:style="{background: theme.primary__500, color: theme.white}">
				{{$t('Buy now')}}
			</view>
		</view>
	</view>
</template>

<script>
	// import {
	// 	mixin
	// } from "./minxin/minxin.js"
	export default {
		// mixins: [mixin], //混入文件
		data() {
			return {
				statusBar: uni.getSystemInfoSync().statusBarHeight,
				buyTepy: 1,
				k_or_d: '',
				num: 1,
				total_price: 1,
				price: '',
				Cshow: false,
				sharesID: '',
				sharesInfo: {
					close: 0,
					increase: 0,
					rise_or_fall: 0,
				},
				htmlSrc: '', // 注意: 直接写 static ,前面不需要加任何路径和字符。
				new_price: 0, //最新价格
				lianList: [],
				leverage: 1,
				lian: 0,

				new_price: 0,
				new_price_close: 0,
				new_price_high: 0,
				new_price_low: 0,
				new_price_open: 0,
				value:1,


				flag: true
			};
		},
		watch: {
			Cshow(state) {
				if (state == false) {
					this.num = ''
					this.price = ''
				}
			}
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			},
			themeKey() {
				return this.$store.getters.themeKey
			},
			increase() {
				return Number((this.new_price - this.sharesInfo.previous_close) / this.sharesInfo.previous_close * 100)
					.toFixed(3)
			},
			rise_or_fall() {
				return Number(this.new_price - this.sharesInfo.previous_close).toFixed(3)
			},
			max_num() {
				// let money = this.sharesInfo.money * (1 - this.sharesInfo.share_fee / 100 - this.sharesInfo.stamp_duty /
				// 	100)
				// let new_price = this.new_price ? this.new_price : this.sharesInfo.close
				// return parseInt(money / (new_price * 100))


				let money = this.sharesInfo.money
				return money
			},
			total_num() {
				let total_num = this.sharesInfo.price*this.num
				return total_num

			},
		},
		onUnload() {
			this.zhezhaoceng = true
			clearTimeout(this.tentimer)
		},
		onLoad(e) {
			this.sharesID = e.share_id
			this.fundID = e.id
			this.getDetails(true)
		},
		onShow() {
			this.getDetails(true)
			this.htmlSrc = 'static/hybrid_fund/kline/index1.html?symbol=' + this.sharesID + '&is_fund=1&theme=' + this.themeKey + '&lang=' + this.$t('locale')
			// #ifdef H5
			// this.getKline_zhilian(0)
			// #endif
			// #ifdef APP-PLUS
			// this.htmlSrc = 'static/hybrid/kline/index1.html?symbol=' + this.sharesID + '&lang=' + this.$t('locale')
			// this.htmlSrc = 'https://h5.gsiwm21.com/static/hybrid/kline/index1.html?symbol=' + this.sharesID + '&lang=' + this.$t('locale')
			// #endif
		},
		methods: {

			change: function(e) {
			 		this.value = e.value
			 	},
			changelian(item, index) {
				// console.log('leverage-->',item)
				this.lian = index
				this.leverage = item
			},
			goumai() {
				if (!this.flag) return
				if (this.num == '') return this.tos(this.$t('hangqing23'))
				// if (this.buyTepy == 2) {
				// 	if (this.price == '') return this.tos(this.$t('hangqing33'))
				// }
				this.flag = false
				this.post('/stock_fund/shares_buy', {
					id: this.sharesID,
					total_price: this.total_num,
					// type: this.buyTepy,
					price: this.sharesInfo.price,
					// k_or_d: this.k_or_d,
					// leverage: this.leverage,
				}, true).then((res) => {
					this.flag = true
					//console.log('购买',res)
					if (res.code == 1) {
						this.tos(res.msg)
						this.Cshow = false
						this.k_or_d = ''
						setTimeout(() => {
							this.router.push('/pages/index/money/fund_record')
						}, 500)
						this.getDetails(false)

					}
				})
			},
			getDetails(type) {
				this.post('/stock_fund/shares_con', {
					id: this.fundID
				}, type).then((res) => {
					console.log('Stock details->======',this.sharesInfo)
					if (res.code == 1) {
						this.sharesInfo = res.data
						if (res.data.lever_status == true) {
							this.lianList = res.data.leverage
							if (this.lianList) this.leverage = this.lianList[0]
						}

					}
				})
			},
			shoucang() {
				if (!this.flag) return
				this.flag = false
				this.post('/stock_fund/shoucang', {
					id: this.sharesID
				}, true).then((res) => {
					this.flag = true
					//console.log('收藏',res)
					if (res.code == 1) {
						this.tos(res.msg)
						this.sharesInfo.is_cs = !this.sharesInfo.is_cs
					}
				})
			},

			// vue获取iframe传递过来的信息
			// app_getiframeMsg(num) {
			// 	if (num) {
			// 		//console.log('最新价格',num)
			// 		this.new_price = num
			// 	}
			// },

			// Vue gets the information passed by iframe
			app_getiframeMsg(params) {
				if (params.num) {
					console.log('app_getiframeMsg', params.num)
					this.new_price = params.num
					this.new_price_close = params.num
					this.new_price_open = params.open
					this.new_price_low = params.low
					this.new_price_high = params.high

				}
			},
			getPriceColor(increase) {
				return increase >= 0 ? this.theme.primary__500 : this.theme.success
			},
			getMinusStyle() {
				return {
					borderColor: this.theme.neutral__200
				}
			},
			getPlusStyle() {
				return {
					background: this.theme.primary__500
				}
			}
		}
	}
</script>

<!-- #ifdef APP-PLUS -->
<script module="renderModal" lang="renderjs">
	export default {
		mounted() {
			window.addEventListener('message', (event) => {
				const res = event.data;
				if (res.cmd == 'newprice') {
					this.$ownerInstance.callMethod('app_getiframeMsg', res.params)
					// this.$ownerInstance.callMethod('app_getiframeMsg', res.params.num)
				}
			});
		},
	}
</script>
<!-- #ifdef -->

<style lang="scss">
	page {
		height: 100%;
	}
	.min-height-screen {
		min-height: 100vh;
	}

	.minus {
			width: 30px;
			height: 30px;
			border-width: 1px;
			border-style: solid;
			border-top-left-radius: 100px;
			border-top-right-radius: 100px;
			border-bottom-left-radius: 100px;
			border-bottom-right-radius: 100px;
			@include flex;
			justify-content: center;
			align-items: center;
		}

		.input {
			padding: 0 10px;
		}

		.plus {
			width: 30px;
			height: 30px;
			border-radius: 50%;
			/* #ifndef APP-NVUE */
			display: flex;
			/* #endif */
			justify-content: center;
			align-items: center;
		}

	.TopBox1 {
		width: 100%;
		height: 210rpx;
		padding: 22rpx;
		border-radius: 12px;
		background-image: url("/static/imgs/index/GreenGraph.png");
		background-repeat: repeat;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.TopBox2 {
		width: 100%;
		height: 210rpx;
		padding: 22rpx;
		border-radius: 12px;
		background-image: url("/static/imgs/index/RedGraphno.png");
		background-repeat: repeat;
		background-size: 100% 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.tab-indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2rpx;
		background: transparent;
		transition: all 0.3s ease;

		&--active {
			background: currentColor;
		}
	}

	.onbox {
		height: 66rpx;
		padding: 0 24rpx;
		background: linear-gradient(137deg, #7822b0 0%, #a65e7e 100%, #a65e7e 15%);
		border-radius: 10rpx;
		text-align: center;
		line-height: 66rpx;
		font-size: 30rpx;
		color: #fff;
		white-space: nowrap;
	}

	.offbox {
		height: 66rpx;
		padding: 0 24rpx;
		background: rgba(139, 153, 162, 0.2);
		border-radius: 10rpx;
		text-align: center;
		line-height: 66rpx;
		font-size: 30rpx;
		color: #8B99A2;
		white-space: nowrap;
	}

	.tuikuan-showModal {
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: absolute;
		top: 0rpx;
		z-index: 100100;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.donut {
		display: inline-block;
		border: 4px solid rgba(32, 32, 34, 0.1);
		border-left-color: #47D5C9;
		border-right-color: #ED4A3E;
		border-radius: 50%;
		width: 30px;
		height: 30px;
		animation: donut-spin 1.0s linear infinite;
	}

	@keyframes donut-spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.times {
		/* width: 16.66%; */
		flex: 1;
		height: 70rpx;
		line-height: 70rpx;
		color: #212121;
		font-size: 24rpx;
		text-align: center;
	}

	.active {
		position: relative;
		color: #8036a5;
		font-weight: 500;
	}

	.selectbox {
		width: 200rpx;
		height: 86rpx;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f4f5f7;
		// border: solid 1rpx #2D2D2E;
		color: #949494;
	}

	.selectbox:active {
		background: linear-gradient(137deg, #7822b0 0%, #a65e7e 100%, #a65e7e 15%);
		color: #fff;
	}

	.selectbox1 {
		width: 200rpx;
		height: 86rpx;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #F7F7F7;
		color: #949494;
	}

	.selectbox1:active {
		background-color: #41BD64;
		color: #fff;
	}

	// .active:before {
	// 	content: " ";
	// 	position: absolute;
	// 	bottom: 4rpx;
	// 	left: 10%;
	// 	z-index: 1;
	// 	width: 80%;
	// 	height: 3rpx;
	// 	background: linear-gradient(133deg, #657EFA 0%, #4F7AFA 100%);
	// 	border-radius: 3rpx;
	// }
</style>
