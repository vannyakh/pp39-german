<template>
	<view class="">
		<view class="" v-for="(item,index) in list" :key="index">
			<view class="listBox padding-20 margin-20-auto " >
				<view class="width-100b height-60 flex align-center justify-between">
					<view class="height-100 width-100b flex align-center justify-between">
						<view class="flex align-center gap-10">
                            <u-image shape="circle" width="50rpx" height="50rpx" :src="item.logo_image">
                                <u-loading-icon slot="loading"></u-loading-icon>
                            </u-image>
							<text class="font-26 color-white numbold-font" >{{item.name}}</text>
							<!-- <text class="font-26 numbold-font" :style="'color:'+fu_color">{{item.show_name}}</text> -->
						</view>
						<!-- <text class="font-28 bold-font numbold-font">{{item.rise_or_fall=='rise'}}</text> -->
						<text class="font-28 bold-font numbold-font  " :class="item.rise_or_fall=='rise'?'color-00C481':'color-FF4040'">{{item.rise_or_fall=='rise'?i18n.cycle.up:i18n.cycle.down}}</text>
					</view>
				</view>
				<view class="width-100b margin-t-10 flex flex-wrap">
					<view class="height-50 width-100b flex align-center justify-between" style="">
						<text class="font-24 nummedium-font color-909AAB" >{{i18n.cycle.unit}}</text>
						<text class="font-26 nummedium-font color-909AAB">{{Number(item.current_price).toFixed(price_jd)}} <span class="margin-l-10">USDT</span> </text>
					</view>
					<view style="" class="height-50 width-100b flex align-center justify-between">
						<text class="font-24 nummedium-font color-909AAB" >{{i18n.cycle.tradeNumber}}</text>
						<text class="font-26 nummedium-font color-909AAB">{{Number(item.trade_num).toFixed(price_jd)}}</text>
					</view>
					<view v-if="currentIndex==0" style="" class="height-50 width-100b flex  align-center justify-between">
						<!-- <text class="font-24 nummedium-font">{{timeCount(item.createtime+item.trade_cycle-item.nowtime)}}s</text> -->
						<text class="font-24 nummedium-font" :style="'color:'+fu_color">{{i18n.cycle.countTime}}</text>
						<countTime @end="timeCount" :autoplay="true" :timestamp="item.createtime+item.trade_cycle-item.nowtime"></countTime>
					</view>
					<view v-if="currentIndex==1" style="" class="height-50 width-100b flex  align-center justify-between">
						<text class="font-24 nummedium-font color-909AAB">{{i18n.cycle.tradingCycle}} </text>
						<text class="font-26 nummedium-font color-909AAB">{{item.trade_cycle}}s  </text>
					</view>
					<view v-if="currentIndex==0" style="" class="margin-t-10 width-100b height-50 flex align-center justify-between">
						<text class="font-24 nummedium-font color-909AAB">{{i18n.cycle.currPrice}} </text>
						<text class="font-26 nummedium-font color-909AAB">{{Number(nowPrice).toFixed(price_jd)}}</text>
					</view>
					<view v-if="currentIndex==1" style="" class="margin-t-10 width-100b height-50 flex align-center justify-between">
						<text class="font-24 nummedium-font color-909AAB" >{{i18n.cycle.closing}}</text>
						<text class="font-26 nummedium-font color-909AAB">{{Number(item.close_price).toFixed(price_jd)}}</text>
					</view>
					<view style="" class="margin-t-10 height-50 width-100b flex  align-center justify-between">
						<text class="font-24 nummedium-font color-909AAB" >{{i18n.cycle.complete}}</text>
						<text v-if="currentIndex==0" class="font-26 nummedium-font color-909AAB">{{item.open_time}} </text>
						<text v-if="currentIndex==1" class="font-26 nummedium-font color-909AAB">{{item.createtime}} </text>
					</view>
					<view v-if="currentIndex==0" style="" class="margin-t-10 height-50 width-100b flex  align-center justify-between">
						<text class="font-24 nummedium-font" :style="'color:'+fu_color">{{i18n.cycle.profit}}</text>
						<text v-if="item.rise_or_fall=='rise'" :class="nowPrice>item.current_price?'color-00C481':'color-FF4040'" class="font-24 nummedium-font">{{nowPrice>item.current_price?item.expect_income:'-'+item.trade_num}}</text>
						<text v-if="item.rise_or_fall=='fall'" :class="item.current_price>nowPrice?'color-00C481':'color-FF4040'" class="font-24 nummedium-font">{{item.current_price>nowPrice?item.expect_income:'-'+item.trade_num}}</text>
					</view>
					<view v-if="currentIndex==1" style="" class="margin-t-10 height-50 width-100b flex  align-center justify-between">
						<text class="font-24 nummedium-font color-909AAB" >{{i18n.cycle.profit}}</text>
						<text :class="item.trade_result=='win'?'color-00C481':'color-FF4040'" class="font-26 nummedium-font ">{{Number(item.trade_result_num).toFixed(price_jd)}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="">
			<view v-if="loading" class="width-100b padding-c-50 flex align-center justify-center">
				<u-loading-icon mode="flower" size="40"></u-loading-icon>
			</view>
			<view v-if="!loading&&list.length==0"
				class="width-100b padding-c-50 flex direction-column align-center justify-center">
				<text class="font-28 nummedium-font" :style="'color:'+fu_color">{{i18n.cycle.nodata}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import countTime from './count-time.vue'
	export default {
		components: {
			countTime,
		},
		name: 'secondListItem',
		props: {
			//标题
			list: {
				type: Array,
				default: []
			},
			currentIndex: {
				type: Number,
				default: 0
			},
			loading: {
				type: Boolean,
				default: false
			},
			nowPrice: { //币种当前价格
				type: Number,
				default: 0
			},
			price_jd:{
				type: Number,
				default: 2
			},
			background:{
				type: String,
				default: '#ffffff'
			},
			color:{
				type: String,
				default: '#fff'
			},
			fu_color:{
				type: String,
				default: '#B7B7B7'
			}
		},
		computed: {
			i18n() {
				return this.$t('message');
			}
		},
		data() {
			return {
			}
		},
		methods: {
			timeCount() {
				this.$emit('timeOut');
			}
		}
	}
</script>

<style scoped>
	.listBox {
		width: 100%;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		border: 1rpx solid #414668;
		background: #1A1B24;
	}
</style>
