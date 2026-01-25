<template>
	<view  :style="{background: theme.light, minHeight: '100vh', color: theme.dark}">
		<myNav :title="$t('invest1')"></myNav>
		<view class="">
		<view class="topBoxs flex align-center justify-start">
			<view class="radiu-10" :style="{background: theme.light__gray}">
				<image class="width-160 height-160 radiu-10" :src="obj.logo_image" mode=""></image>
			</view>
			<view class="direction-column">
				<view class="flex">
					<text class="font-35 padding-w-50 bold-font">{{obj.name}}</text>
				</view>
				<view class="height-45"></view>
				<view class="flex">
					<text class="font-35 bold-font padding-w-50 ">{{obj.price}}</text>
					<text class="font-24 padding-w-5 color-white flex  radiu-20 justify-center align-center ":style="{background: theme.primary, color: theme.white,border: '1px solid '+theme.gray11}"> {{$t('invest2')}} {{obj.rixi}}%</text>
				</view>
			</view>
		</view>
		<view class="boxshow width-670 margin-50-auto radiu-20 padding-b-30 "
			 style="overflow: hidden;" :style="{background: theme.light__gray, color: theme.dark}">
			<view class="height-96 padding-w-24 flex align-center justify-between">
				<text class="font-28">{{$t('invest3')}}</text>
				<text class="font-28">{{obj.min_num}}</text>
			</view>
			<view class="height-96 padding-w-24 flex align-center justify-between">
				<text class="font-28">{{$t('invest4')}}</text>
				<text class="font-28">{{obj.day}}</text}>
			</view>
			<view class="height-96 padding-w-24 flex align-center justify-between">
				<text class="font-28">{{$t('invest5')}}</text>
				<text class="font-28">{{obj.max_num}}</text>
			</view>
			
			<view class="padding-w-20 padding-c-10">
				<view class="height-96 align-center justify-between bj-dbdbeb radiu-20 ">
					<input class="height-96 flex-1 line-height-96 font-26 padding-w-20" type="number" v-model="money"
						:placeholder="$t('invest6')" />
				</view>
			</view>
			<view class="padding-w-20 padding-c-10 ">
				<view class="padding-w-20 height-5" style="background-color: rgba(191, 195, 199, 0.2);"></view>
			</view>

			<view class="padding-w-20 padding-c-10">
				<view @click="touzi" class="padding-w-18 margin-t-30 line-height-70 text-center height-70 radiu-40 "
					style="min-width: 270rpx;"  :style="{background: theme.primary,  color: theme.white}">
					<text class="font-28 color-white margin-r-6">{{$t('invest1')}}</text>
				</view>
			</view>
			<view class="padding-w-24">
				<text v-if="obj.description" class="height-60 font-28 bold-font line-height-60">{{$t('invest7')}}</text>
				<view class="padding-c-20">
					<text class="font-26 ">{{obj.description}}</text>
				</view>
			</view>
		</view>
		<view class="height-40"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				list:[],
				obj: {},
				money: '',
				pay_pwd: '',
				flag: true,
				rixi_arr: [],
				
				fast_rixi:0,
				flag:true
			};
		},
		computed: {
			theme(){
			    return this.$store.getters.theme
			},
			// i18n() {
			// 	return this.$t('message');
			// },
			allNumber() {
				if (this.money == '') {
					return 0
				} else {
					let temp = Number(this.money) + Number(this.money * this.rixi / 100 * this.obj.day)
					return Number(temp).toFixed(2)
				}
			},
			rixi() {
				if (this.money == '') {
					return this.obj.rixi
				} else {
					let num = 0
					this.rixi_arr.forEach((item) => {
						if (this.money >= item.key) {
							num = item.value
						}
					})
					return num
				}
			}
		},
		onLoad(e) {
			this.id = e.id
			this.product_con()
		},
		onShow() {
			
		},
		methods: {
			touzi() {
				if (!this.flag) return
				if (this.money == '') return this.tos(this.$t('invest6'))
				// if(this.pay_pwd == ''){
				// 	this.tos(this.i18n.licai.text17)
				// 	return
				// }
				this.post('/invest/buy', {
					num: this.money,
					// pay_pwd:this.pay_pwd,
					id: this.id
				}, true).then(res => {
					console.log(res)
					if (res.code == 1) {
						this.tos(res.msg)
						// this.pay_pwd = ''
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/invest/my_record'
							})
						}, 500)
					}
				})
			},
			product_con() {
				this.post('/invest/detail', {
					id: this.id
				}).then(res => {
					console.log('invest-->', res)
					if (res.code == 1) {
						this.obj = res.data
						
						// this.fast_rixi = res.data.fast_rixi
						// this.rixi_arr = res.data.rixi_arr
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.topBox {
		width: 670rpx;
		height: 183rpx;
		margin: 24rpx auto;
		border-radius: 10rpx;
		padding: 36rpx 20rpx;
		background: linear-gradient(45deg, #124778 0%, #4C8BF4 75%, #0081FF 100%);
	}

	.topBoxs {
		width: 670rpx;
		// height: 183rpx;
		margin: 24rpx auto;
		border-radius: 10rpx;
		// padding: 36rpx 20rpx;
		// background: linear-gradient(45deg, #fff8f7 0%, #fff8f7 75%, #fff8f7 100%);
	}
</style>