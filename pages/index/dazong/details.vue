<template>
	<view class="min-height-screen" :style="{color: theme.textPrimary, background: theme.backgroundSecondary}">
		<app-nav :title="$t('index60')"></app-nav>
		<view class="padding-w-32 margin-t-20">
			<view class="bj-bianss margin-b-14 padding-w-32 padding-c-20 flex direction-column align-center justify-between" :style="{background: theme.backgroundCard}">
				<view class="flex align-start justify-center">
					<view class="flex align-center margin-b-12">
						<view class="font-30 margin-r-16 hidden-1 weight-bold" style="max-width: 500rpx; color: inherit;">
							<text :style="{ color: theme.textPrimary }">{{new_gu.name}}</text></view>
							<view class="radiu-4 flex align-center margin-l-10" :style="{background: theme.primary__500}">
								<view class="padding-6 radiu-4 font-24" :style="{background: theme.backgroundCard, color: theme.textPrimary}">
									{{checktype(new_gu.type)}}
								</view>
								<text class="font-24 padding-w-10" :style="{color: theme.white}">{{new_gu.code}}</text>
							</view>
					</view>
					<text class="font-24 margin-l-12" :style="{ color: theme.textTertiary }">{{$t('index20')}}：<span class="font-32 weight-bold" :style="{color: theme.primary}">{{new_gu.fx_price}}</span></text>
				</view>
				<view class="height-200 flex direction-column align-center justify-center">
					<text class="font-28 margin-t-20" :style="{ color: theme.textTertiary }">{{$t('index61')}}</text>
					<text class="font-64 weight-bold" :style="{color: theme.primary}">{{new_gu.fx_price}}</text>

				</view>
			</view>
			<view class="margin-b-20 padding-w-10 padding-c-20" :style="{background: theme.backgroundCard}">
				<!-- <view v-if="lianList" class="width-100b radiu-10 padding-b-20">
					<text class="height-116 font-30 weight-bold">{{$t('my89')}}</text>
					<view class="flex align-center flex-wrap margin-t-14">
						<view @click="changelian(item,index)" v-for="(item,index) in lianList"
							:class="index==lian?'onbox':'offbox'" class="numbold-font margin-r-20">{{item}}</view>
					</view>
				</view> -->
				<text class="font-30 weight-bold" :style="{ color: theme.textPrimary }">{{$t('index41')}}</text>
				<view class="margin-c-20 radiu-20 height-86 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 font-28" type="number" v-model="num" :placeholder="$t('index43')"
						:style="{ color: theme.textPrimary }"
						placeholder-class="input-placeholder" />
					<text class="font-28" :style="{ color: theme.textPrimary }">{{$t('index44')}}</text>
				</view>
				<view class="font-28 padding-w-20 margin-b-38" :style="{ color: theme.textTertiary }">{{$t('index45')}}：<span class="" :style="{color: theme.primary}">{{Number(new_gu.money).toFixed(3)}}</span></view>
				<view v-if="is_miyao" class="">
					<text class="font-30 weight-bold" :style="{ color: theme.textPrimary }">{{$t('index62')}}</text>
					<view class="margin-c-20 radiu-8 height-86 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
						<input class="flex-1 font-28" type="text" v-model="pay_pwd" password
							:placeholder="$t('index63')"
							:style="{ color: theme.textPrimary }"
							placeholder-class="input-placeholder" />
					</view>
				</view>

				<view class="font-28 padding-c-10 padding-w-20" :style="{ color: theme.textTertiary }">{{$t('index45')}}：<span
						class="" :style="{color: theme.primary}">{{Number(new_gu.money).toFixed(3)}}</span></view>
				<view class=" flex padding-c-20 align-center padding-w-20">
					<text class="font-28" :style="{ color: theme.textTertiary }">{{$t('index46')}}：<span class="" :style="{color: theme.primary}">{{Number(new_gu.fx_price*num).toFixed(3)}}</span></text>
					<!-- <text class="font-28 color-949494">{{$t('index46')}}：<span
							class="" :style="{color: theme.primary}">{{Number(new_gu.fx_price*num).toFixed(3)}}</span></text> -->
				</view>
				<view class="flex padding-c-10 align-center padding-w-20">
					<text class="font-28" :style="{ color: theme.textTertiary }">{{$t('my93')}}：<span class="" :style="{color: theme.primary}">{{Number(new_gu.dazhe).toFixed(3)}}%</span></text>
				</view>
				<view class="flex padding-c-10 align-center padding-w-20">
					<text class="font-28" :style="{ color: theme.textTertiary }">{{$t('hangqing30')}}：<span class="" :style="{color: theme.primary}">{{Number(new_gu.max_share_fee).toFixed(3)}}%</span></text>
				</view>
				<view class="flex padding-c-10 align-center padding-w-20">
					<text class="font-28" :style="{ color: theme.textTertiary }">{{$t('hangqing31')}}：<span class="" :style="{color: theme.primary}">{{Number(new_gu.max_stamp_duty).toFixed(3)}}%</span></text>
				</view>
				<view @click="shenggou()"
                      :style="{background: theme.primary__500, color: theme.white}"
					class="height-86 margin-t-100 radiu-10 flex align-center justify-center font-28">
					<text :style="{ color: theme.white }">{{$t('index64')}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				num: '',
				pay_pwd: '',
				lian: 0,
				leverage: 1,
				lianList: ['5','10'],
				new_gu: '',
				flag: true,

				is_miyao: true
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
			changelian(item, index) {
				this.lian = index
				this.leverage = item
			},
			shenggou() {
				if (!this.flag) return
				if (this.num == '') return this.tos(this.$t('index43'))
				if (this.is_miyao && this.pay_pwd == '') return this.tos(this.$t('index63'))
				this.flag = false
				this.post('/product/max_buy', {
					id: this.id,
					num: this.num,
					pay_pwd: this.pay_pwd,
					leverage: this.leverage,
				}, true).then((res) => {
					//console.log('申购',res)
					this.flag = true
					if (res.code == 1) {
						this.tos(res.msg)
						this.num = ''
						this.pay_pwd = ''
						setTimeout(() => {
							this.router.goTabBar('/pages/chicang/index')
						}, 500)
					}
				})
			},
			getdetails() {
				this.post('/product/max_con', {
					id: this.id
				}).then((res) => {
					if (res.code == 1) {
						this.new_gu = res.data
						this.is_miyao = res.data.is_miyao
						if (res.data.lever_status == true) {
							this.lianList = res.data.leverage
							if (this.lianList) this.leverage = this.lianList[0]
						}


					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.onbox {
		height: 66rpx;
		width: 70px;
		padding: 0 24rpx;
		border-radius: 10rpx;
		text-align: center;
		line-height: 66rpx;
		font-size: 30rpx;
		white-space: nowrap;
	}

	.offbox {
		height: 66rpx;
		width: 70px;
		padding: 0 24rpx;
		border-radius: 10rpx;
		text-align: center;
		line-height: 66rpx;
		font-size: 30rpx;
		white-space: nowrap;
	}

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

	.input-placeholder {
		color: inherit;
		opacity: 0.6;
	}
</style>
