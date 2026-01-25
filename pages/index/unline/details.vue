<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
		<bg-animate-shape/>
		<app-nav :title="$t('index65')"></app-nav>
		<view class="padding-w-32 margin-t-20">
			<view class="radiu-22 margin-b-20 padding-w-32 padding-c-20" :style="{background: theme.backgroundCard}">
				<view class="flex align-center justify-between">
					<view class="flex direction-column align-start justify-center">
						<view class="flex align-center margin-b-12">
							<view class="font-30 weight-bold" :style="{color: theme.textPrimary}">{{new_gu.name}}</view>
						</view>
						<view class="radiu-4 flex align-center margin-t-10" :style="{background: theme.primary__500}">
							<view class="padding-6 radiu-4 font-24" :style="{background: theme.white, color: theme.textPrimary}">
								{{checktype(new_gu.type)}}
							</view>
							<text class="font-24 padding-w-10" :style="{color: theme.white}">{{new_gu.code}}</text>
						</view>
					</view>
				</view>
				<view class="flex align-center justify-between padding-t-20 margin-t-20" :style="{borderTop: `1rpx solid ${getColorWithOpacity(theme.neutral__200, 0.3)}`}">
					<view class="flex-1 flex direction-column justify-center">
						<text class="font-32" :style="{color: theme.primary__500}">{{new_gu.price}}/{{$t('index26')}}</text>
						<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index27')}}</text>

					</view>
					<view class="flex-1 flex direction-column align-center justify-center">
						<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index28')}}</text>
						<text class="font-32" :style="{color: theme.primary__500}">{{new_gu.profit_rate}}</text>

					</view>
					<view class="flex-1 flex direction-column align-end justify-center">
						<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index29')}}</text>
						<text class="font-32" :style="{color: theme.success}">{{new_gu.count_num}}</text>

					</view>
				</view>
				<view class="padding-c-20">
					<view class="flex align-center justify-center margin-b-10">
						<view :class="setup>=1?'ac_yuan':'in_yuan'" :style="setup>=1?getAcYuanStyle():getInYuanStyle()">1</view>
						<view class="width-100 height-4" :style="setup>=2?{background: theme.primary__500}:{background: theme.neutral__200}"></view>
						<view :class="setup>=2?'ac_yuan':'in_yuan'" :style="setup>=2?getAcYuanStyle():getInYuanStyle()">2</view>
						<view class="width-100 height-4" :style="setup>=3?{background: theme.primary__500}:{background: theme.neutral__200}"></view>
						<view :class="setup>=3?'ac_yuan':'in_yuan'" :style="setup>=3?getAcYuanStyle():getInYuanStyle()">3</view>
						<view class="width-100 height-4" :style="setup>=4?{background: theme.primary__500}:{background: theme.neutral__200}"></view>
						<view :class="setup>=4?'ac_yuan':'in_yuan'" :style="setup>=4?getAcYuanStyle():getInYuanStyle()">4</view>
					</view>
					<view class="flex align-center justify-center">
						<view class="flex-1 flex direction-column align-center justify-center" :style="{color: setup>=1?theme.textPrimary:theme.textTertiary}">
							<text class="font-28 margin-b-4 text-center">{{$t('index33')}}</text>
							<text class="font-24">{{new_gu.start_time}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center" :style="{color: setup>=2?theme.textPrimary:theme.textTertiary}">
							<text class="font-28 margin-b-4 text-center">{{$t('index34')}}</text>
							<text class="font-24">{{new_gu.zq_time}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center" :style="{color: setup>=3?theme.textPrimary:theme.textTertiary}">
							<text class="font-28 margin-b-4 text-center">{{$t('index35')}}</text>
							<text class="font-24">{{new_gu.rj_time}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center" :style="{color: setup>=4?theme.textPrimary:theme.textTertiary}">
							<text class="font-28 margin-b-4 text-center">{{$t('index36')}}</text>
							<text class="font-24">-</text>
						</view>
					</view>
				</view>
			</view>
			<view class="margin-b-20 padding-w-10 padding-c-20">
				<text class="font-30 weight-bold" :style="{color: theme.textPrimary}">{{$t('index37')}}</text>
			</view>
			<view class="radiu-22 margin-b-20 padding-w-30 padding-c-20" :style="{background: theme.backgroundCard}">

				<view class="flex align-center justify-between font-26 padding-c-10 margin-t-24">
					<text class="" :style="{color: theme.textPrimary}">{{$t('index38')}}</text>
					<text class="" :style="{color: theme.textPrimary}">{{new_gu.muji_price}}</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textPrimary}">{{$t('index39')}}</text>
					<text class="" :style="{color: theme.textPrimary}">{{new_gu.zhongqian}}%</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textPrimary}">{{$t('index40')}}</text>
					<text class="" :style="{color: theme.textPrimary}">{{new_gu.zq_time}}</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textPrimary}">{{$t('index35')}}</text>
					<text class="" :style="{color: theme.textPrimary}">{{new_gu.rj_time}}</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text class="" :style="{color: theme.textPrimary}">{{$t('index30')}}</text>
					<text class="" :style="{color: theme.textPrimary}">{{new_gu.start_time}}</text>
				</view>
			</view>
			<view class="margin-b-20 padding-w-10 padding-c-20">
				<view class="flex align-center justify-between">
					<text class="font-30 weight-bold" :style="{color: theme.textPrimary}">{{$t('index41')}}</text>
					<view @click="xuanzhe" class="flex align-center">
						<text class="font-28" :style="{color: theme.primary__500}">{{$t('index42')}}</text>
						<image class="width-40 height-40 margin-l-10" :src="ifagree?'/static/imgs/login/xuanzhong@2x.png':'/static/imgs/login/weixuan@2x.png'" mode=""></image>
					</view>
				</view>
			</view>

			<view class="radiu-22 margin-b-20 padding-w-30 padding-c-20" :style="{background: theme.backgroundCard}">

				<view class="margin-c-20 radiu-8 height-86 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 font-28" type="number" v-model="num" :placeholder="$t('index43')" placeholder-class="input-placeholder" :style="{color: theme.textPrimary}"/>
					<text class="font-28" :style="{color: theme.textPrimary}">{{$t('index44')}}</text>
				</view>
				<text class="font-28" :style="{color: theme.textTertiary}">{{$t('index45')}}：<span class="" :style="{color: theme.primary__500}">{{new_gu.money}}</span></text>

				<view class="height-80 flex align-center">
					<text class="font-28" :style="{color: theme.textTertiary}">{{$t('index46')}}：<span class="" :style="{color: theme.primary__500}">{{Number(new_gu.price*num*100).toFixed(3)}}</span></text>
					<!-- <text class="font-28 color-949494">{{$t('index46')}}：<span class="" :style="{color:theme.primary}">{{Number(new_gu.price*num).toFixed(3)}}</span></text> -->
				</view>

				<view @click="shenggou" class="height-86 margin-t-50 radiu-8 flex align-center justify-center font-28"
                :style="{background: theme.primary__500, color: theme.white}">
					<text :style="{color: theme.white}">{{$t('index47')}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setup:1,
				new_gu:'',
				num:'',
				flag:true,
				ifagree:false
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
		methods:{
			xuanzhe(){
				this.ifagree=!this.ifagree
				if(this.ifagree){
					this.num =  parseInt(this.new_gu.money/(this.new_gu.price*100))
				}else{
					this.num = ''
				}
			},
			shenggou(){
				if(!this.flag) return
				if(this.num == '') return this.tos(this.$t('index43'))
				this.flag = false
				this.post('/product/xianxia_buy',{
					id:this.id,
					num:this.num
				},true).then((res) => {
					//console.log('申购',res)
					this.flag = true
					if (res.code == 1) {
						this.tos(res.msg)
						this.num = ''
						setTimeout(()=>{
							uni.redirectTo({
								url:'/pages/index/unline/record'
							})
						},500)
					}
				})
			},
			getdetails(){
				this.post('/product/xianxia_con',{
					id:this.id
				}).then((res) => {
					//console.log('线下详情',res)
					if (res.code == 1) {
						this.new_gu = res.data
					}
				})
			},
			getAcYuanStyle() {
				return {
					background: `linear-gradient(137deg, ${this.theme.primary__500}, ${this.theme.primary__300 || this.theme.primary__500})`,
					color: this.theme.white
				}
			},
			getInYuanStyle() {
				return {
					color: this.theme.textTertiary,
					border: `3rpx solid ${this.theme.textTertiary}`
				}
			},
			getColorWithOpacity(color, opacity) {
				if (!color) return 'transparent'
				if (color.startsWith('#')) {
					const r = parseInt(color.slice(1, 3), 16)
					const g = parseInt(color.slice(3, 5), 16)
					const b = parseInt(color.slice(5, 7), 16)
					return `rgba(${r}, ${g}, ${b}, ${opacity})`
				}
				if (color.startsWith('rgb')) {
					return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
				}
				return color
			},
		}
	}
</script>

<style lang="scss" scoped>
	.min-height-screen {
		min-height: 100vh;
	}

	.ac_yuan{
		width: 68rpx;
		height: 68rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
	}

	.in_yuan{
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
