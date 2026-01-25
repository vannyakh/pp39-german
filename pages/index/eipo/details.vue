<template>
	<view :style="{color:theme.dark}">
        <bg-animate-shape/>
		<myNav :title="$t('Eipo Details')"></myNav>

		<view class="padding-w-32 margin-t-20">
			<view class="radiu-20 margin-b-20 padding-w-32 padding-c-20" :style="{background:theme.light}">
				<view class="flex align-center justify-between">
					<view class="flex  align-start justify-center">
						<view class="flex align-center margin-b-12">
							<view class="font-30 weight-bold">{{new_gu.name}}</view>
						</view>
						<view class="radiu-4 flex align-center margin-l-20" :style="{background:theme.bgPrimary}">
							<view class="padding-6 bj-white radiu-4 font-24 color-000000">
								{{checktype(new_gu.type)}}
							</view>
							<text class="font-24 padding-w-10" :style="{color:theme.white}">{{new_gu.code}}</text>
						</view>
					</view>
				</view>
				<view class="flex align-center justify-between padding-t-20 margin-t-20"
					:style="{borderTop: '1px solid '+theme.light__gray}">
					<view class="flex-1 flex direction-column justify-center">

						<text class="font-24 color-949494 margin-t-8">{{$t('index27')}}</text>
						<text class="font-32 ">{{new_gu.price}}/{{$t('index26')}}</text>
					</view>
					<view class="flex-1 flex direction-column align-center justify-center">
						<text class="font-24 color-949494 margin-t-8">{{$t('index28')}}</text>
						<text class="font-32 ">{{new_gu.profit_rate}}</text>

					</view>
					<view class="flex-1 flex direction-column align-end justify-center">
						<text class="font-24 color-949494 margin-t-8">{{$t('index29')}}</text>
						<text class="font-32 ">{{new_gu.count_num}}</text>

					</view>
				</view>
				<view class="padding-c-20">
					<view class="flex align-center justify-center margin-b-10">
						<view :class="setup>=1?'ac_yuan':'in_yuan'">1</view>
						<view :class="setup>=2?'bj-bians':'bj-949494'" class="width-100 height-4"></view>
						<view :class="setup>=2?'ac_yuan':'in_yuan'">2</view>
						<view :class="setup>=3?'bj-bians':'bj-949494'" class="width-100 height-4"></view>
						<view :class="setup>=3?'ac_yuan':'in_yuan'">3</view>
						<view :class="setup>=4?'bj-bians':'bj-949494'" class="width-100 height-4"></view>
						<view :class="setup>=4?'ac_yuan':'in_yuan'">4</view>
					</view>
					<view class="flex align-center justify-center">
						<view :class="setup>=1?'color-949494':'color-949494'"
							class="flex-1 flex direction-column text-center align-center justify-center">
							<text class="font-26 margin-b-4 text-center">{{$t('index33')}}</text>
							<text class="font-24">{{new_gu.start_time}}</text>
						</view>
						<view :class="setup>=2?'color-949494':'color-949494'"
							class="flex-1 flex direction-column align-center justify-center">
							<text class="font-26 margin-b-4 text-center">{{$t('index34')}}</text>
							<text class="font-24">{{new_gu.zq_time}}</text>
						</view>
						<view :class="setup>=3?'color-949494':'color-949494'"
							class="flex-1 flex direction-column align-center justify-center">
							<text class="font-26 margin-b-4 text-center">{{$t('index35')}}</text>
							<text class="font-24">{{new_gu.rj_time}}</text>
						</view>
						<view :class="setup>=4?'color-949494':'color-949494'"
							class="flex-1 flex direction-column align-center justify-center">
							<text class="font-26 margin-b-4 text-center">{{$t('index36')}}</text>
							<text class="font-24">-</text>
						</view>
					</view>
				</view>
			</view>
			<view class=" margin-b-20 padding-w-10 padding-c-20">
				<text class="font-30 weight-bold">{{$t('index37')}}</text>
			</view>

			<view class="radiu-22 margin-b-20 padding-w-30 padding-c-20" :style="{background: theme.light}">
				<view class="flex align-center justify-between font-26 padding-c-10 margin-t-24">
					<text class="">{{$t('index38')}}:</text>
					<text class="color-949494">{{new_gu.muji_price}}</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="">{{$t('index39')}}:</text>
					<text class="color-949494">{{new_gu.zhongqian}}%</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="">{{$t('index40')}}:</text>
					<text class="color-949494">{{new_gu.zq_time}}</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="">{{$t('index35')}}:</text>
					<text class="color-949494">{{new_gu.rj_time}}</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="">{{$t('index30')}}:</text>
					<text class="color-949494">{{new_gu.start_time}}</text>
				</view>
			</view>
			<!-- <view class="margin-b-20 padding-w-10 padding-c-20">
				<view class="flex align-center justify-between">
					<text class="font-30  weight-bold">{{$t('index41')}}</text>
					<view @click="xuanzhe" class="flex align-center">
						<text class="font-28 " :style="{color:theme.primary}">{{$t('index42')}}</text>
						<image class="width-40 height-40 margin-l-10"
							:src="ifagree?'/static/imgs/login/xuanzhong@2x.png':'/static/imgs/login/weixuan@2x.png'"
							mode=""></image>
					</view>
				</view>
			</view> -->

			<view class="radiu-22 margin-b-20 padding-w-30 padding-c-20" :style="{background: theme.light}">
				<!-- <view class="margin-c-20 radiu-8 height-86 padding-w-20 flex align-center justify-between" :style="{background:theme.light__gray}">
					<input class="flex-1 font-28 " disabled type="number" v-model="num" :placeholder="$t('index43')"
						placeholder-class="color-949494" />
					<text class="font-28 ">{{$t('index44')}}</text>
				</view>
				<text class="font-28 color-949494">{{$t('index45')}}：<span
						class="">{{new_gu.money}}</span></text>

				<view class="height-80 flex align-center">
					<text class="font-28 color-949494">{{$t('index46')}}：<span
							class="">{{Number(new_gu.price*num).toFixed(3)}}</span></text>
				</view> -->

				<view @click="shenggou"
                      :style="{background:theme.bgPrimary, color:theme.white}"
					class="height-86 margin-t-50 radiu-10 flex align-center justify-center font-28">
					{{$t('index47')}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setup: 1,
				new_gu: '',
				num: '0',
				flag: true,
				ifagree: false
			};
		},
		onLoad(e) {
			this.id = e.id
			this.getdetails()
		},
        computed: {
            theme(){
                return this.$store.getters.theme
            }
        },
		methods: {
			xuanzhe() {
				this.ifagree = !this.ifagree
				if (this.ifagree) {
					this.num = parseInt(this.new_gu.money / (this.new_gu.price * 100))
				} else {
					this.num = ''
				}
			},

			shenggou() {
				if (!this.flag) return
				if (this.num == '') return this.tos(this.$t('index43'))
				this.flag = false
				this.post('/eiop/new_gu_buy', {
					id: this.id,
					num: this.num
				}, true).then((res) => {
					//console.log('申购',res)
					this.flag = true
					if (res.code == 1) {
						this.tos(res.msg)
						this.num = ''
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/index/eipo/record'
							})
						}, 500)
					}
				})
			},
			getdetails() {
				this.post('/eiop/new_gu_con', {
					id: this.id
				}).then((res) => {
					if (res.code == 1) {
						this.new_gu = res.data
						// this.num = res.data.max_num
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.ac_yuan {
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		background: linear-gradient(137deg,#ff8d39,#7e15c2);
		color: #fff;
	}

	.in_yuan {
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		color: #949494;
		border: 3rpx solid #949494;
	}
</style>
