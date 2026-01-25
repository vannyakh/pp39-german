<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary}">
		<bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
			<app-nav slot="top" :title="$t('Fund Record')"></app-nav>
			<view slot="top" class="margin-t-0 padding-w-0 width-100b ">
				<view class="width-100b padding-10 font-24 flex align-center box-shadow-10"
					:style="{ background: theme.backgroundCard, borderRadius: '10px', border: `0px solid ${theme.neutral__200}` }">

					<view @click="set(1)" class="padding-c-18 flex align-center justify-center"
						style="width: calc(100%/3);"
						:style="getTabStyle(1)">
						{{$t('Pending')}}
					</view>
					<view @click="set(2)" class="padding-c-18 flex align-center justify-center"
						style="width: calc(100%/3);"
						:style="getTabStyle(2)">
						{{$t('Approved')}}
					</view>
					<view @click="set(3)" class="padding-c-18 flex align-center justify-center"
						style="width: calc(100%/3);"
						:style="getTabStyle(3)">
						{{$t('Finished')}}
					</view>
					<view @click="set(0)" class="padding-c-18 flex align-center justify-center"
						style="width: calc(100%/3);"
						:style="getTabStyle(0)">
						{{$t('Failed')}}
					</view>
				</view>
			</view>

			<view class="listBoxs" :style="getCardStyle()" v-for="(item, index) in list" :key="index">
				<view class="height-48 flex align-center justify-between">
					<text class="font-30" :style="{color: theme.textPrimary}">{{$t('invest12')}}: <span class="bold-font margin-l-10" :style="{color: theme.textPrimary}">{{item.name}}</span></text>
					<view class="flex align-center justify-center height-58 width-160 radiu-20" :style="{border: `2rpx solid ${theme.neutral__200}`}">
						<text v-if="item.status == 1" :style="{color: theme.warning__500}">{{$t('Pending')}}</text>
						<text v-if="item.status == 2" :style="{color: theme.success}">{{$t('Approved')}}</text>
						<text v-if="item.status == 3" :style="{color: theme.primary__500}">{{$t('Finished')}}</text>
						<text v-if="item.status == 0" :style="{color: theme.danger}">{{$t('Failed')}}</text>
					</view>
				</view>
				<view class="flex align-center ">
					<view class="flex align-center justify-end line-height-30 height-56 gap-20">
						<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Price')}}:</text>
						<view class="flex align-center justify-center gap-20">
							<view class="font-28 bold-font" :style="{color: theme.textPrimary}">{{ item.initial_price}}</view>
							<!-- <view v-if="item.country==42" class="font-30" :style="{color: theme.textPrimary}">{{$t('Symbol_ms')}}</view> -->
							<!-- <view v-if="item.country==39" class="font-30" :style="{color: theme.textPrimary}">{{$t('Symbol_cn')}}</view> -->
						</view>
					</view>
				</view>
				<view class="flex align-center">
					<view class="flex align-center justify-end line-height-30 height-56 gap-20">
						<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Total Price')}}:</text>
						<view class="flex align-center justify-center gap-20">
							<view class="font-28 bold-font" :style="{color: theme.textPrimary}">{{ item.total_price}}</view>
							<!-- <view v-if="item.country==42" class="font-30" :style="{color: theme.textPrimary}">{{$t('Symbol_ms')}}</view> -->
							<!-- <view v-if="item.country==39" class="font-30" :style="{color: theme.textPrimary}">{{$t('Symbol_cn')}}</view> -->
						</view>
					</view>
				</view>
				<view class="flex align-center ">
					<view class="flex align-center justify-end line-height-30 height-56">
						<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Mining Period')}}: <span class="bold-font margin-l-10" :style="{color: theme.textPrimary}">{{item.day}} {{$t('day')}}</span></text>
					</view>
				</view>
				<view class="flex align-center ">
					<view class="flex align-center justify-end line-height-30 height-56">
						<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Buy Time')}}: <span class="bold-font margin-l-10" :style="{color: theme.textPrimary}"> {{item.createtime}}</span></text>
					</view>
				</view>
				<view v-if="item.status == 2 || item.status == 3 || item.status == 0" class="flex align-center ">
					<view class="flex align-center justify-end line-height-30 height-56">
						<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Approved time')}}: <span class="bold-font margin-l-10" :style="{color: theme.textPrimary}">{{item.updatetime}}</span></text>
					</view>
				</view>
				<view v-if="item.status == 2 || item.status == 3" class="flex align-center ">
					<view class="flex align-center justify-end line-height-30 height-56">
						<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Finished Time')}}: <span class="bold-font margin-l-10" :style="{color: theme.textPrimary}">{{item.close_time}}</span></text>
					</view>
				</view>
				<view class="flex align-center">
					<view class="flex align-center justify-end line-height-30 height-56">
						<text class="font-30" :style="{color: theme.textSecondary}">{{$t('Income')}}: <span class="bold-font margin-l-10" :style="{color: getIncomeColor(item.fast_rixi)}">{{item.fast_rixi?item.fast_rixi:0}} %</span></text>
					</view>
				</view>

				<view v-if="item.status == 2 || item.status == 3" @click="router.push('/pages/index/money/details?id='+item.id)"
					class="padding-w-18 margin-t-30 line-height-70 text-center height-70 radiu-40" :style="getButtonStyle()"
					style="min-width: 270rpx;">
					<text class="font-28 margin-r-6" :style="{color: theme.white}">{{$t('View details')}}</text>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status: 1,
				list: [],
			};
		},

		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		onShow() {
			setTimeout(() => {
				this.show2 = true;
			}, 2000);
		},
		methods: {
			set(index) {
				if (this.status != index) {
					this.status = index
					this.$refs.paging.reload()
				}
			},
			queryList(pageNo, pageSize) {
				this.post('/stock_fund/order_list', {
					status: this.status,
					page: pageNo,
				}).then(res => {
					if (res.code == 1) {
						console.log("数据", res);
						this.$refs.paging.complete(res.data.data);
					}
				})
			},
			getTabStyle(tabIndex) {
				if (this.status === tabIndex) {
					return {
						background: this.theme.primary__500,
						color: this.theme.white,
						borderRadius: '10px'
					}
				}
				return {
					background: this.theme.transparent,
					color: this.theme.textTertiary,
					borderRadius: '10px'
				}
			},
			getCardStyle() {
				return {
					background: this.theme.backgroundCard
				}
			},
			getIncomeColor(value) {
				return value >= 0 ? this.theme.primary__500 : this.theme.success
			},
			getButtonStyle() {
				return {
					background: this.theme.primary__500
				}
			}
		},
	};
</script>

<style lang="scss">
	.min-height-screen {
		min-height: 100vh;
	}

	.listBox {
		width: 670rpx;
		height: 360rpx;
		border-radius: 10rpx;
		margin: 16rpx auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.listBoxs {
		width: 670rpx;
		padding: 34rpx;
		border-radius: 20rpx;
		margin: 34rpx auto;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}
</style>
