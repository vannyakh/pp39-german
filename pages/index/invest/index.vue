<template>
	<view class="" :style="{background: theme.light, minHeight: '100vh', color: theme.dark}">
		<z-paging :language="$t('locale')" ref="paging" @query="queryList" v-model="list" :loading-more-enabled="false"
			:pageSize="20">
			<myNav slot="top" :title="$t('invest1')" isRight righturl="/static/imgs/fund/record.png" @Jump="router.push('/pages/invest/my_record')"></myNav>
			<view class="padding-w-40">
				<view class="listBox boxshow" :style="{background: theme.light__gray,  color: theme.dark}" v-for="(item,index) in list" :key="index">
					<view class="height-48 flex align-center justify-center">
						<text class="font-32  bold-font weight-bold">{{item.name}}</text>
					</view>
					<view class="width-100b height-3 margin-20-auto"
						style="background-color: rgba(191, 195, 199, 0.2);"></view>
					<view class="height-100 flex align-center justify-between">
						<image class="width-96 height-96 radiu-5" :src="item.logo_image" mode=""></image>
						<view class="height-96 flex-1 margin-l-18 margin-t-50 align-center">
							<view class="height-48 flex align-center justify-between">
								<text class="font-32  bold-font weight-bold">{{item.price}}</text>
								<view class="flex direction-column align-center justify-center">
									<text class="font-22 bold-font ">{{$t('invest2')}}  {{item.rixi}}%</text>
									<text class="font-24  bold-font ">{{$t('invest3')}} {{item.min_num}}</text>
								</view>
							</view>
						</view>
					</view>
					<view  @click="router.push('/pages/invest/investing?id='+item.id)" 
						class="padding-w-18 margin-t-30 line-height-70 text-center height-70 radiu-40 "
						style="min-width: 270rpx;" :style="{background: theme.primary,  color: theme.white}">
						<text class="font-28 color-white margin-r-6">{{$t('invest1')}}</text>
					</view>
					<view class="height-60 flex align-center justify-around margin-t-30">
						<view class="flex direction-column align-center justify-end line-height-30 height-56">
							<text class="font-24  bold-font weight-bold">{{item.day}}</text>
							<text class="font-24">{{$t('invest4')}}</text>
						</view>
						<view class="padding-w-18 flex direction-column line-height-30 text-center height-56">
							<text class="font-24  bold-font weight-bold">{{item.max_num}}</text>
							<text class="font-24">{{$t('invest5')}}</text>
						</view>
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
				searchVal: '',

				list: [],
				list_all: [],

				
			}
		},
		computed: {
		    theme(){
		        return this.$store.getters.theme
		    }
		},
		onShow() {
			uni.setTabBarItem({
				index: 0,
				text: this.$t('tabBar1')
			});
			uni.setTabBarItem({
				index: 1,
				text: this.$t('tabBar2')
			});
			uni.setTabBarItem({
				index: 2,
				text: this.$t('tabBar3')
			});
			uni.setTabBarItem({
				index: 3,
				text: this.$t('tabBar6')
			});
			uni.setTabBarItem({
				index: 4,
				text: this.$t('tabBar5')
			});
			this.timer = setTimeout(() => {
				this.queryList()
			}, 4000)
			this.searchVal = ''
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.post('/invest/index').then(res => {
					if (res.code == 1) {
						console.log('product list', res)
						this.list_all = res.data.data
						this.$refs.paging.complete(res.data.data);
					}
				})
			},
			searchCion() {
				if (this.searchVal == '') {
					this.list = this.list_all
					return
				}
				let arrtemp = []
				this.list_all.forEach((item) => {
					if (item.name.indexOf(this.searchVal.toUpperCase()) != '-1') {
						arrtemp.push(item)
					}
				})
				this.list = arrtemp
			},
		}
	}
</script>

<style lang="scss">
	.fixed1 {
		position: fixed;
		top: 0;
		z-index: 1010;
	}

	.listBox {
		width: 100%;
		// height: 228rpx;
		padding: 34rpx;
		// background-color: #FFFFFF;
		border-radius: 15rpx;
		margin: 34rpx auto;
	}
</style>