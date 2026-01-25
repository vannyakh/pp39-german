<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
		<bg-animate-shape/>
		<app-nav title="Position Details"></app-nav>

		<view class="">
			<view class="radiu-20 margin-b-20 padding-w-32 padding-c-20" :style="{background: theme.backgroundCard}">
				<view class="flex align-center justify-between">
					<view class="flex direction-column">
						<view class="font-24 hidden-2 weight-bold" :style="{color: theme.textPrimary}">{{dataObj.name}}</view>
						<view class="font-20 weight-bold" :style="{color: theme.textSecondary}">{{dataObj.code}}</view>
					</view>
				</view>
				<view class="flex align-center justify-between margin-t-20">
					<view class="padding-5 radiu-4 flex align-center" :style="{background: theme.primary__500}">
						<text v-if="dataObj.status==1" class="font-24 padding-w-10" :style="{color: theme.white}">Pending order</text>
						<text v-if="dataObj.status==2" class="font-24 padding-w-10" :style="{color: theme.white}">Position in progress</text>
						<text v-if="dataObj.status==3" class="font-24 padding-w-10" :style="{color: theme.white}">Position Close</text>
					</view>
					<view class="padding-5 radiu-4 flex align-center" :style="{background: theme.primary}">
						<text v-if="dataObj.status==1" class="font-24 padding-w-10" :style="{color: theme.white}">Pending order</text>
						<text v-if="dataObj.status==2" class="font-24 padding-w-10" :style="{color: theme.white}">{{Number((dataObj.close-dataObj.price)/dataObj.price*100).toFixed(3)}}%</text>
						<text v-if="dataObj.status==3" class="font-24 padding-w-10" :style="{color: theme.white}">{{Number((dataObj.pc_price-dataObj.price)/dataObj.price*100).toFixed(3)}}%</text>
					</view>
				</view>
				<view class="flex align-center radiu-10 justify-around padding-10 margin-t-20"
					:style="{background: theme.backgroundTertiary}">
					<view class="flex direction-column justify-center">
						<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">Buy Price</text>
						<text class="font-32" :style="{color: theme.textPrimary}">{{dataObj.price}}</text>
					</view>
					<view class="f flex direction-column align-center justify-center">
						<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">Buy Amount</text>
						<text class="font-32" :style="{color: theme.textPrimary}">{{dataObj.num}}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="padding-w-32 margin-t-20">
			<view class="radiu-22 margin-b-20 padding-w-30 padding-c-20" :style="{background: theme.backgroundCard}">
				<view class="margin-b-20 padding-c-20">
					<text class="font-30 weight-bold" :style="{color: theme.textPrimary}">Basic Information</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10 margin-t-24">
					<text class="" :style="{color: theme.textSecondary}">Buy And Sell Type</text>
					<text v-if="dataObj.k_or_d=='k'" :style="{color: theme.textTertiary}">Sell</text>
					<text v-if="dataObj.k_or_d=='d'" :style="{color: theme.textTertiary}">Buy</text>
				</view>
				<!-- <view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">Order Number</text>
					<text :style="{color: theme.textTertiary}">?</text>
				</view> -->
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">Buy Time</text>
					<text :style="{color: theme.textTertiary}">{{dataObj.createtime}}</text>
				</view>
				<view v-if="dataObj.status==3" class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">Sell Time</text>
					<text :style="{color: theme.textTertiary}">{{dataObj.updatetime}}</text>
				</view>
				<view v-if="dataObj.status==3" class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">Sell Price</text>
					<text :style="{color: theme.textTertiary}">{{dataObj.pc_price}}</text>
				</view>
				<!-- <view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">Initial Mrgin</text>
					<text :style="{color: theme.textTertiary}">{{Number(dataObj.close*dataObj.num).toFixed(3)}}</text>
				</view> -->
				<!-- <view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">Leverage</text>
					<text :style="{color: theme.textTertiary}">{{dataObj.leverage?dataObj.leverage:1}}</text>
				</view> -->
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">Market Value</text>
					<text :style="{color: theme.textTertiary}">{{dataObj.close}}</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">Type</text>
					<text v-if="dataObj.type==1" :style="{color: theme.textTertiary}">Market Price</text>
					<text v-if="dataObj.type==2" :style="{color: theme.textTertiary}">Limit Price</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">P&L</text>
					<text :style="{color: theme.textTertiary}">{{Number(dataObj.rise_all_fall).toFixed(3)}}</text>
				</view>
				<!-- <view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textSecondary}">Fee</text>
					<text :style="{color: theme.textTertiary}">{{dataObj.fee?dataObj.fee:0}}</text>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataObj: [],
				timer: null,
			};
		},
		onLoad(e) {
			// console.log('id=',e)
			this.getdetails(e.id,e.status)
			// this.timer = setInterval(() => {
			// 	this.getdetails(e.id,e.status);
			// }, 4000)
		},
		// onHide: function() {
		// 	clearInterval(this.timer)
		// },
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		methods: {

			getdetails(id,status) {
				this.post('/stock_fund/order_list_id', {
					id: id,
					status:status
				}).then((res) => {
					console.log(res)
					if (res.code == 1) {
						if (res.data){
							this.dataObj = res.data
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.ac_yuan {
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
	}

	.in_yuan {
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
	}
</style>
