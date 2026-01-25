<template>
	<view class="margin-t-20">
		<view class="min-height-120 padding-w-20">
				<view
                      class="listBox radiu-15" v-for="(item,index) in list" :key="index"
				:style="{ color: color || theme.textPrimary, border: `1rpx solid ${theme.neutral__200}` }">
				<view class="width-100b height-100 flex align-center justify-between"
					:style="{ borderBottom: `1px dashed ${getColorWithOpacity(theme.neutral__300, 0.3)}` }">
					<view class="height-90 flex direction-column align-start justify-center">
						<view class="flex align-center ">
							<text v-if="currentIndex==4" class="font-28 bold-font margin-r-10" :style="{ color: theme.textPrimary }">{{item.coinname}}</text>
							<text
								class="font-28 bold-font numbold-font" :style="{ color: theme.textPrimary }">{{item.type=='more'?$t('forex.long'):$t('forex.short')}}</text>
							<text class="font-26 bold-font" :style="{ color: fu_color || theme.textSecondary }">{{item.coinname}}</text>
						</view>
						<text class="font-20 numbold-font" :style="{ color: fu_color || theme.textTertiary }">{{item.createtime}}</text>
					</view>
					<button v-if="currentIndex==0" @click="revocation(item.id)" class="cu-btn loginBtn" :style="getButtonStyle()">{{$t('forex.revokeTime')}}</button>
					<text v-if="currentIndex==4" class="font-26" :style="{ color: theme.primary__500 }">{{statusFilter(item.status)}}</text>
				</view>
				<view class="width-100b margin-t-10 flex flex-wrap">
					<view style="width: 33%;" class="height-70 flex direction-column align-start justify-around">
						<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{Number(item.price).toFixed(price_jd)}}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.unit') }}</text>
					</view>
					<view style="width: 33%;" class="height-70 flex direction-column align-center justify-around">
						<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{item.num}}*{{item.multiple}}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.beishu') }}</text>
					</view>
					<view v-if="item.status==0||item.status==1" style="width: 33%;"
						class="height-70 flex direction-column align-end justify-around">
						<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{(item.close).toFixed(price_jd)}}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.currPrice') }}</text>
					</view>
					<view v-if="item.status==2" style="width: 33%;"
						class="height-70 flex direction-column align-end justify-around">
						<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{Number(item.pc_price).toFixed(price_jd)}}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.closing') }}</text>
					</view>
					<view v-if="item.status==3" style="width: 33%;"
						class="height-70 flex direction-column align-end justify-around">
						<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{ item.updatetime }}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.revokeTime') }}</text>
					</view>
					<view style="width: 33%;"
						class="margin-t-10 height-70 flex direction-column align-start justify-around">
						<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{ Number(item.promise_fee).toFixed(price_jd) }}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.margin') }}</text>
					</view>
					<view style="width: 33%;"
						class="margin-t-10 height-70 flex direction-column align-center justify-around">
						<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{ Number(item.fee).toFixed(price_jd) }}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.service') }}</text>
					</view>
					<view v-if="item.status==0||item.status==3" style="width: 33%;"
						class="margin-t-10 height-70 flex direction-column align-end justify-around">
						<text class="font-26 nummedium-font" :style="{ color: theme.textPrimary }">{{item.coinname}}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.currency') }}</text>
					</view>
					<view v-if="item.status==1" style="width: 33%;"
						class="margin-t-10 height-70 flex direction-column align-end justify-around">
                        <text v-if="item.type=='more'"
							class="font-24 nummedium-font"
							:style="{ color: item.close>=item.price ? theme.success : theme.danger }">{{((item.close - item.price)*item.num).toFixed(price_jd)}}</text>
						<text v-if="item.type=='free'"
							class="font-24 nummedium-font"
							:style="{ color: item.price>item.close ? theme.success : theme.danger }">{{(( item.price - item.close)*item.num).toFixed(price_jd)}}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.profit') }}</text>
					</view>
					<view v-if="item.status==2" style="width: 33%;"
						class="margin-t-10 height-70 flex direction-column align-end justify-around">
						<text
							class="font-26 nummedium-font"
							:style="{ color: item.income>=0 ? theme.success : theme.danger }">{{item.income||0}}</text>
						<text class="font-24 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.profit') }}</text>
					</view>
				</view>
				<view v-if="currentIndex==1" class="width-100b height-50 margin-t-10 flex align-center justify-end">
					<button v-if="currentIndex==1" @click="closeOut(item.id)"
						class="cu-btn loginBtn1" :style="getCloseButtonStyle()">
						<text :style="{ color: theme.white }">{{ $t('forex.close') }}</text>
					</button>
				</view>
				<view v-if="currentIndex==4" class="">
					<view v-if="item.status==0" class="width-100b height-50 margin-t-10 flex align-center justify-end">
						<button @click="revocation(item.id)" class="cu-btn loginBtn"
							:style="getRevokeButtonStyle()">{{ $t('forex.revoke') }}</button>
					</view>
					<view v-if="item.status==1" class="width-100b height-50 margin-t-10 flex align-center justify-between">
						<text @click="setCheck(item.id,item.zy_price,item.zs_price)"
							class="font-26 numbold-font weight-bold" :style="{ color: theme.textPrimary }">{{ $t('forex.set') }}</text>
						<button @click="closeOut(item.id)" class="cu-btn loginBtn1" :style="getCloseButtonStyle()">
							<text :style="{ color: theme.white }">{{ $t('forex.close') }}</text>
						</button>
					</view>
				</view>
			</view>

			<view class="">
				<view v-if="loading" class="width-100b padding-c-50 flex align-center justify-center">
					<u-loading-icon mode="flower" size="40" />
				</view>
				<view v-if="!loading&&list.length==0"
					class="width-100b padding-c-50 flex direction-column align-center justify-center">
					<text class="font-28 nummedium-font" :style="{ color: fu_color || theme.textTertiary }">{{ $t('forex.nodata') }}</text>
				</view>
			</view>
		</view>





	</view>
</template>

<script>
	export default {
		name: 'contractListItem',
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
			shizhi: { //设备比例
				type: Number,
				default: 0
			},
			price_jd: {
				type: Number,
				default: 4
			},
			background: {
				type: String,
				default: ''
			},
			color: {
				type: String,
				default: ''
			},
			fu_color: {
				type: String,
				default: ''
			}
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		data() {
			return {
				detailShow: false,
				id:'',
				coin_id:'',
				orderObj:'',
				// list:[],
			}
		},
		methods: {
			statusFilter(index) {
				return this.$t('tablist1State['+index+']')
			},
			// 撤销
			revocation(id) {
				uni.showLoading({
					mask: true
				})
				setTimeout(() => {
					uni.hideLoading()
					this.$emit('revocation', id)
				}, 2500)
			},
			// 平仓
			closeOut(id) {
				uni.showLoading({
					mask: true
				})
				setTimeout(() => {
					uni.hideLoading()
					this.$emit('closeOut', id)
				}, 2500)
			},
			// 设置止盈止损
			setCheck(id, zy_price, zs_price) {
				this.$emit('setCheck', id, zy_price, zs_price)
			},
			getOrder(id,coin_id){
				this.post('/market/order_con',{
					id:id,
					coin_id:coin_id
				}).then((res) => {
					// console.log('订单详情',res)
						if (res.code == 1) {
							this.orderObj = res.data
							if(res.data.detail){
								this.list = res.data.detail
							}
					}
				})
			},
			fncClickDetail(did,coin_id){
				this.detailShow=true
					if(did){
						this.id = did
						this.getOrder(did,coin_id)
					}
			},

			        close() {
			          this.detailShow = false
			          // console.log('close');
			        },
			getButtonStyle() {
				const textColor = this.color || this.theme.primary__500
				return {
					color: textColor,
					border: `1rpx solid ${textColor}`
				}
			},
			getRevokeButtonStyle() {
				const textColor = this.color || this.theme.primary__500
				return {
					color: textColor,
					border: `1rpx solid ${textColor}`
				}
			},
			getCloseButtonStyle() {
				return {
					background: this.theme.success
				}
			},
			getColorWithOpacity(color, opacity) {
				if (color && color.startsWith('#')) {
					const hex = color.substring(1);
					const r = parseInt(hex.substring(0, 2), 16);
					const g = parseInt(hex.substring(2, 4), 16);
					const b = parseInt(hex.substring(4, 6), 16);
					return `rgba(${r}, ${g}, ${b}, ${opacity})`;
				}
				return color;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.listBox {
		width: 100%;
		padding: 20rpx 30rpx;
		margin: 0 auto 20rpx;
	}

	.loginBtn {
		width: 190rpx;
		padding: 0 20rpx;
		height: 53rpx;
		border-radius: 4rpx;
		font-size: 24rpx;
		font-weight: bold;
        border: 1rpx solid;
	}

	.loginBtn1 {
		width: 190rpx;
		padding: 0 18rpx;
		height: 48rpx;
		border-radius: 4rpx;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.custom-popup {
	  clear: both; /* Clears floated elements */
	  top: 1px; /* Positions the popup 1px from the top */
	  width: 100%; /* Adjust width if necessary */
	}
</style>
