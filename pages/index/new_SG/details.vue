<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
		<app-nav :title="$t('index48')"></app-nav>

		<view class="padding-w-32 margin-t-20">
			<view class="radiu-20 margin-b-20 padding-w-32 padding-c-20" :style="{background: theme.backgroundCard}">
				<view class="flex align-center justify-between">
					<view class="flex  align-center justify-center">
						<view class="flex align-center">
							<view class="font-30 weight-bold" :style="{color: theme.textPrimary}">{{new_gu.name}}</view>
						</view>
						<view class="radiu-4 flex align-center margin-l-20" :style="{background: theme.primary__500}">
							<view class="padding-6 radiu-4 font-24" :style="{background: theme.backgroundCard, color: theme.textPrimary}">
								{{checktype(new_gu.type)}}
							</view>
							<text class="font-24 padding-w-10" :style="{color: theme.white}">{{new_gu.code}}</text>
						</view>
					</view>
				</view>
				<view class="flex align-center justify-between padding-t-20 margin-t-20"
					:style="{borderTop: `1px solid ${theme.neutral__200}`}">
					<view class="flex-1 flex direction-column justify-center">

						<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index27')}}</text>
						<text class="font-32" :style="{color: theme.textPrimary}">{{new_gu.price}}/{{$t('index26')}}</text>
					</view>
					<view class="flex-1 flex direction-column align-center justify-center">
						<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index28')}}</text>
						<text class="font-32" :style="{color: theme.textPrimary}">{{new_gu.profit_rate}}</text>

					</view>
					<view class="flex-1 flex direction-column align-end justify-center">
						<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index29')}}</text>
						<text class="font-32" :style="{color: theme.textPrimary}">{{new_gu.count_num}}</text>

					</view>
				</view>
				<view class="padding-c-20">
					<view class="flex align-center justify-center margin-b-10">
						<view :class="setup>=1?'ac_yuan':'in_yuan'" :style="getStepStyle(1)">1</view>
						<view class="width-100 height-4" :style="getLineStyle(2)"></view>
						<view :class="setup>=2?'ac_yuan':'in_yuan'" :style="getStepStyle(2)">2</view>
						<view class="width-100 height-4" :style="getLineStyle(3)"></view>
						<view :class="setup>=3?'ac_yuan':'in_yuan'" :style="getStepStyle(3)">3</view>
						<view class="width-100 height-4" :style="getLineStyle(4)"></view>
						<view :class="setup>=4?'ac_yuan':'in_yuan'" :style="getStepStyle(4)">4</view>
					</view>
					<view class="flex align-center justify-center">
						<view class="flex-1 flex direction-column text-center align-center justify-center"
							:style="{color: theme.textTertiary}">
							<text class="font-26 margin-b-4 text-center" :style="{color: theme.textTertiary}">{{$t('index33')}}</text>
							<text class="font-24" :style="{color: theme.textTertiary}">{{new_gu.start_time}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center"
							:style="{color: theme.textTertiary}">
							<text class="font-26 margin-b-4 text-center" :style="{color: theme.textTertiary}">{{$t('index34')}}</text>
							<text class="font-24" :style="{color: theme.textTertiary}">{{new_gu.zq_time}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center"
							:style="{color: theme.textTertiary}">
							<text class="font-26 margin-b-4 text-center" :style="{color: theme.textTertiary}">{{$t('index35')}}</text>
							<text class="font-24" :style="{color: theme.textTertiary}">{{currentDate}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center"
							:style="{color: theme.textTertiary}">
							<text class="font-26 margin-b-4 text-center" :style="{color: theme.textTertiary}">{{$t('index36')}}</text>
							<text class="font-24" :style="{color: theme.textTertiary}">-</text>
						</view>
					</view>
				</view>
			</view>
			<view class=" margin-b-20 padding-w-10 padding-c-20">
				<text class="font-30 weight-bold" :style="{color: theme.textPrimary}">{{$t('index37')}}</text>
			</view>

			<view class="radiu-22 margin-b-20 padding-w-30 padding-c-20" :style="{background: theme.backgroundCard}">
				<view class="flex align-center justify-between font-26 padding-c-10 margin-t-24">
					<text :style="{color: theme.textPrimary}">{{$t('index38')}}:</text>
					<text :style="{color: theme.textTertiary}">{{new_gu.muji_price}}</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text :style="{color: theme.textPrimary}">{{$t('index39')}}:</text>
					<text :style="{color: theme.textTertiary}">{{new_gu.zhongqian}}%</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text :style="{color: theme.textPrimary}">{{$t('index40')}}:</text>
					<text :style="{color: theme.textTertiary}">{{new_gu.zq_time}}</text>
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text :style="{color: theme.textPrimary}">{{$t('index35')}}:</text>
					<text :style="{color: theme.textTertiary}">{{currentDate}}</text>
					<!-- <text :style="{color: theme.textTertiary}">{{new_gu.rj_time}}</text> -->
				</view>
				<view class="flex align-center justify-between font-26 padding-c-10">
					<text :style="{color: theme.textPrimary}">{{$t('index30')}}:</text>
					<text :style="{color: theme.textTertiary}">{{new_gu.start_time}}</text>
				</view>
			</view>

			<view :style="{background: theme.backgroundCard}">
				<view @click="shenggou"
                      :style="{background: theme.primary__500, color: theme.white}"
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
				currentDate: '',
				ifagree: false
			};
		},
		onLoad(e) {
			this.id = e.id
			this.getdetails()
			this.currentDate = this.formatDateTime()
		},
        computed: {
            theme(){
                return this.$store.getters.theme
            }
        },
		methods: {
			formatDateTime() {
				const current = new Date()
				const year = current.getFullYear()
				const month = String(current.getMonth() + 1).padStart(2, '0')
				const day = String(current.getDate()).padStart(2, '0')
				const hours = String(current.getHours()).padStart(2, '0')
				const minutes = String(current.getMinutes()).padStart(2, '0')
				const seconds = String(current.getSeconds()).padStart(2, '0')
				return `${day}-${month}-${year}`
				// return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
			},
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
				this.post('/product/new_gu_buy', {
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
								url: '/pages/index/new_SG/record'
							})
						}, 500)
					}
				})
			},
			getdetails() {
				this.post('/product/new_gu_con', {
					id: this.id
				}).then((res) => {
					if (res.code == 1) {
						this.new_gu = res.data
						// this.num = res.data.max_num
					}
				})
			},
			getStepStyle(step) {
				if (this.setup >= step) {
					return {
						background: `linear-gradient(137deg, ${this.theme.primary__500}, ${this.theme.secondary__500 || this.theme.primary__500})`,
						color: this.theme.white
					}
				}
				return {
					color: this.theme.textTertiary,
					border: `3rpx solid ${this.theme.textTertiary}`
				}
			},
			getLineStyle(step) {
				if (this.setup >= step) {
					return {
						background: `linear-gradient(137deg, ${this.theme.primary__500}, ${this.theme.secondary__500 || this.theme.primary__500})`
					}
				}
				return {
					background: this.theme.textTertiary
				}
			}
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
