<template>
	<view >
		<view class="listBox" v-for="(item,index) in list" :key="index"
			  :style="{ border: `1rpx solid ${theme.neutral__200}` }">
			<view class="width-100b height-40 flex align-center justify-between">
				<view class="flex align-center line-height-40">
					<text
						class="font-28 bold-font margin-r-30"
						:style="{ color: item.rise_or_fall=='rise' ? theme.success : theme.danger }">{{item.rise_or_fall=='rise'?$t('forex.up'):$t('forex.down')}}</text>
					<text class="font-26 nummedium-font" :style="{ color: theme.textTertiary }">{{item.show_name}}</text>
				</view>
			</view>
			<view class="width-100b margin-t-10 flex flex-wrap">
				<view style="width: 33%;" class="height-70 flex direction-column align-start justify-around">
					<text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{$t('forex.unit')}}</text>
					<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{Number(item.current_price).toFixed(price_jd)}}</text>
				</view>
				<view style="width: 33%;" class="height-70 flex direction-column align-center justify-around">
					<text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.tradeNumber') }}</text>
					<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{Number(item.trade_num).toFixed(price_jd)}}</text>
				</view>
				<view v-if="currentIndex==0" style="width: 33%;" class="height-70 flex direction-column align-end justify-around">
					<!-- <text class="font-24 nummedium-font">{{timeCount(item.createtime+item.trade_cycle-item.nowtime)}}s</text> -->
					<text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.countTime') }}</text>
					<countTime @end="timeCount" :autoplay="true" :timestamp="item.createtime+item.trade_cycle-item.nowtime"></countTime>
				</view>
				<view v-if="currentIndex==1" style="width: 33%;" class="height-70 flex direction-column align-end justify-around">
					<text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.tradingCycle') }}</text>
					<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{item.trade_cycle}}s</text>
				</view>
				<view v-if="currentIndex==0" style="width: 33%;" class="margin-t-10 height-70 flex direction-column align-start justify-around">
					<text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.currPrice') }}</text>
					<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{Number(nowPrice).toFixed(price_jd)}}</text>
				</view>
				<view v-if="currentIndex==1" style="width: 33%;" class="margin-t-10 height-70 flex direction-column align-start justify-around">
					<text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.closing') }}</text>
					<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{Number(item.close_price).toFixed(price_jd)}}</text>
				</view>
				<view style="width: 33%;" class="margin-t-10 height-70 flex direction-column align-center justify-around">
					<text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.complete') }}</text>
					<text v-if="currentIndex==0" class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{item.open_time}}</text>
					<text v-if="currentIndex==1" class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{item.createtime}}</text>
				</view>
				<view v-if="currentIndex==0" style="width: 33%;" class="margin-t-10 height-70 flex direction-column align-end justify-around">
					<text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.profit') }}</text>
					<text v-if="item.rise_or_fall=='rise'"
						class="font-24 nummedium-font"
						:style="{ color: nowPrice>item.current_price ? theme.success : theme.danger }">{{nowPrice>item.current_price?item.expect_income:'-'+item.lose_income}}</text>
					<text v-if="item.rise_or_fall=='fall'"
						class="font-24 nummedium-font"
						:style="{ color: item.current_price>nowPrice ? theme.success : theme.danger }">{{item.current_price>nowPrice?item.expect_income:'-'+item.lose_income}}</text>
				</view>
				<view v-if="currentIndex==1" style="width: 33%;" class="margin-t-10 height-70 flex direction-column align-end justify-around">
					<text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.profit') }}</text>
					<text
						class="font-26 nummedium-font"
						:style="{ color: item.trade_result=='win' ? theme.success : theme.danger }">{{Number(item.trade_result_num).toFixed(price_jd)}}</text>
				</view>
			</view>
		</view>

		<view class="">
			<view v-if="loading" class="width-100b padding-c-50 flex align-center justify-center">
				<u-loading-icon mode="flower" size="40"/>
			</view>
			<view v-if="!loading&&list.length==0"
				class="width-100b padding-c-50 flex direction-column align-center justify-center">
				<text class="font-28 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.nodata') }}</text>
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
				default: 4
			},
		},

		computed: {
			theme() {
				return this.$store.getters.theme
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
		/* height: 186rpx; */
		padding: 20rpx 30rpx;
		margin: 0 auto 20rpx;

	}

	.loginBtn {
		width: 120rpx;
		height: 48rpx;
		border-radius: 4rpx;
		font-size: 24rpx;
	}

	.loginBtn1 {
		width: 120rpx;
		height: 48rpx;
		border-radius: 4rpx;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
