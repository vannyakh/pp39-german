<template>
	<view :style="{background: theme.light, minHeight: '100vh', color: theme.dark}">
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :loading-more-enabled="false"
			:pageSize="20">
			<myNav slot="top" :title="$t('invest8')"></myNav>
			<!-- <view class="listBoxs " v-for="(item, index) in list" :key="index">
				<view class="height-48 flex align-center justify-center">
					<text class="font-32 bold-font weight-bold">{{item.name}}</text>
				</view>
				<view class="width-100b height-5 margin-0-auto" style="background-color: rgba(191, 195, 199, 0.2)"></view>
				<view class="flex align-center justify-between">
					<view class="height-96 flex-1 margin-l-18  align-center">
						<view class="height-48 flex align-center justify-between">
							<text class="font-32 bold-font weight-bold">{{item.price}}</text>
							<view class="flex direction-column align-center justify-center">
							 <text v-if="item.status == 1" class="color-999999">{{$t('invest9')}}</text>
							 <text v-if="item.status == 2"class="color-0165EE">{{$t('invest10')}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="flex align-center justify-around">
					<view class="flex direction-column align-center justify-end line-height-30 height-56">
						<text class="font-24 bold-font weight-bold">{{item.num}}</text>
						<text class="font-24">{{$t('invest6')}}</text>
					</view>
					<view class="padding-w-18 flex direction-column line-height-30 text-center height-56">
					<text class="font-26 bold-font weight-bold">{{item.createtime}}</text>
						<text class="font-24">{{$t('invest11')}}</text>
					</view>
				</view>
			</view> -->
			<view class="listBoxs boxshow" :style="{background: theme.light__gray,  color: theme.dark}" v-for="(item, index) in list" :key="index">
				<view class="height-48 flex align-center justify-between">
					<text class="font-30 bold-font weight-bold">{{$t('invest12')}}: {{item.name}}</text>
					<view class="flex direction-column align-center justify-center">
						<text v-if="item.status == 1" class="color-66B6FF">{{$t('invest9')}}</text>
						<text v-if="item.status == 2" class="color-000000">{{$t('invest10')}}</text>
					</view>
				</view>
				<view class="flex align-center ">
					<view class="flex align-center justify-end line-height-30 height-56">
						<text class="font-30 bold-font">{{$t('invest6')}}: </text>
						<text class="font-28">{{item.num}}</text>
					</view>
				</view>
				<view class="flex align-center ">
					<view class="flex align-center justify-end line-height-30 height-56">
						<text class="font-30 bold-font">{{$t('invest11')}}:</text>
						<text class="font-28">{{item.createtime}}</text>
					</view>
				</view>
				<view class="flex align-center ">
					<view class="flex align-center justify-end line-height-30 height-56">
						<text class="font-30 bold-font">{{$t('invest2')}}:</text>
						<text class="font-28">{{item.rixi}}%</text>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],

			};
		},

		computed: {
			theme(){
			    return this.$store.getters.theme
			},
		},
		onShow() {
			setTimeout(() => {
				this.show2 = true;
			}, 2000);
		},
		methods: {
			// showPop(item, index) {
			// 	// console.log(item);
			// 	let that = this;
			// 	let paynum = ((item.rixi * item.num) / 100) * 1;
			// 	paynum = item.num - paynum;
			// 	uni.showModal({
			// 		confirmText: this.i18n.licai.text40,
			// 		cancelText: this.i18n.licai.text41,
			// 		title: this.i18n.licai.text42,
			// 		content: this.i18n.licai.text43 + " " + paynum,
			// 		success: function(res) {
			// 			if (res.confirm) {
			// 				that.productCancel(item.id, index);
			// 				console.log("confirm");
			// 			} else if (res.cancel) {
			// 				console.log("cancel");
			// 			}
			// 		},
			// 	});
			// },
			// productCancel(id, index) {
			// 	this.post("/product/product_cancel", {
			// 		id: id,
			// 	}).then((res) => {
			// 		if (res.code == 1) {
			// 			this.tos(res.msg);
			// 			this.list[index].status = 0;
			// 		} else {
			// 			this.tos(res.msg);
			// 		}
			// 	});
			// },
			queryList(pageNo, pageSize) {
				this.post("/invest/history").then((res) => {
					if (res.code == 1) {
						console.log("数据", res);
						this.$refs.paging.complete(res.data.data);
					}
				});
			},
		},
	};
</script>

<style lang="scss">
	.listBox {
		width: 670rpx;
		height: 360rpx;
		// background: #FAFAFA;
		box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(12, 21, 238, 0.2);
		border-radius: 10rpx;
		margin: 16rpx auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.listBoxs {
		width: 670rpx;
		// height: 360rpx;
		// height: 228rpx;
		padding: 34rpx;
		// background-color: #FFFFFF;
		border-radius: 20rpx;
		margin: 34rpx auto;
	}
</style>