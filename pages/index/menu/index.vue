<template>
	<view :style="{color:theme.dark}">
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20"
			:loading-more-enabled="false">
			<myNav slot="top" title="" :black="false">
				<view slot="left" class="height-100b width-100b absolute flex align-center justify-between padding-w-32" style="left: 0rpx;">
                    <i @click="router.goBack()" class="cuIcon-back font-40 margin-r-10" :style="{ color: theme.dark }"></i>
					<view @click="router.push('/pages/index/searchView')" class="flex-1 height-56 radiu-45 padding-w-24 flex align-center" :style="{background:theme.light__gray}">
						<i class="cuIcon-search font-24"></i>
						<text class="font-24 margin-l-10">{{$t('index1')}}</text>
					</view>
					<image v-if="cur==0" @click="router.push('/pages/index/new_SG/record')" class="width-56 height-56 radiu-50b margin-l-20"src="/static/imgs/index/menu.png" mode=""></image>
					<image v-if="cur==1"  @click="router.push('/pages/index/unline/record')" class="width-56 height-56 radiu-50b margin-l-20"src="/static/imgs/index/menu.png" mode=""></image>
					<image v-if="cur==2" @click="router.push('/pages/index/dazong/record')" class="width-56 height-56 radiu-50b margin-l-20"src="/static/imgs/index/menu.png" mode=""></image>
					<image v-if="cur==3" @click="router.push('/pages/index/vip_QC/record')" class="width-56 height-56 radiu-50b margin-l-20"src="/static/imgs/index/menu.png" mode=""></image>
				</view>
			</myNav>
			
			<view slot="top" class="padding-b-28 padding-w-32">
				<view class="height-72  radiu-45 flex align-center justify-between" style="position: relative">
					<view class="height-100b  width-100b" style="transform: translateY(-2px)">
						<u-tabs :list="$t('index14')" lineWidth="30" lineHeight="2" lineColor="#f56c6c"
                                :activeStyle="{color: theme.primary, fontWeight: 'bold', transform: 'scale(1.05)'}"
							@click="tabclick" :current="cur"></u-tabs>
					</view>
				</view>
			</view>
   

			<view slot="top" class="padding-w-32 padding-c-20" :style="{background: theme.light}">
				<view v-if="cur==1" class="text-center flex align-center justify-between width-100b radiu-10"
                      :style="{background:theme.light__gray}">
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(1)"
                          :style="{color: type==1?theme.white:theme.gray20, background: type==1?theme.bgPrimary:''}">
                        <view class="text-center font-28">{{$t('index67')}}</view>
                    </view>
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(2)"
                          :style="{color: type==2?theme.white:theme.gray20, background: type==2?theme.bgPrimary:''}">
                        <view class="text-center font-28">{{$t('index68')}}</view>
                    </view>
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(3)"
                          :style="{color: type==3?theme.white:theme.gray20, background: type==3?theme.bgPrimary:''}">
                        <view class="text-center font-28">{{$t('index69')}}</view>
                    </view>
                    
				</view>
				<view v-else class="radiu-10 text-center flex align-center justify-between"
                      :style="{background:theme.light__gray}">
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(1)"
                          :style="{color: type==1?theme.white:theme.gray20, background: type==1?theme.bgPrimary:''}">
                        <view class="text-center font-28">{{$t('index22')}}</view>
                    </view>
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(2)"
                          :style="{color: type==2?theme.white:theme.gray20, background: type==2?theme.bgPrimary:''}">
                        <view class="text-center font-28">{{$t('index23')}}</view>
                    </view>
				</view>
			</view>

			<view class="padding-w-32 margin-t-20" v-for="(item,index) in list" :key="index">
				<view v-if="cur==0||cur==1" class="listBox1" :style="{background:theme.light}">
					<view class="padding-w-20">
						<view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom:'1px solid '+theme.light__gray}">
							<view class="flex align-center">
								<view class="hidden-1 font-30 width-180">
									{{item.name}}
								</view>
								<view class="radiu-4 flex align-center margin-l-10" :style="{background:theme.bgPrimary}">
									<view class="padding-6 radiu-4 font-24" :style="{background:theme.light}">
										{{checktype(item.type)}}
									</view>
									<text class="font-24 padding-w-10" :style="{color:theme.white}">{{item.code}}</text>
								</view>
							</view>
							<view class="flex align-center justify-center">
								<text class="font-24 color-949494">{{$t('index24')}}：<span
										class="color-949494">{{item.start_time}}</span></text>
							</view>
						</view>
					</view>

					<view class="flex align-center justify-between padding-t-20 margin-t-20 margin-b-20">
						<view class="flex-1 flex direction-column justify-center">
							<text class="font-32" :style="{color:theme.primary}">{{item.price}}/{{$t('index26')}}</text>
							<text class="font-24 color-949494 margin-t-8">{{$t('index27')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center">
							<text class="font-32" :style="{color:theme.primary}">{{item.profit_rate}}</text>
							<text class="font-24 color-949494 margin-t-8">{{$t('index28')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-end justify-center">
							<text class="font-32" :style="{color:theme.primary}">{{item.count_num}}</text>
							<text class="font-24 color-949494 margin-t-8">{{$t('index29')}}</text>
						</view>
					</view>
					<view v-if="cur==0" @click="setDetail(item.id)" class="padding-10 radiu-10 text-center" :style="{background:theme.bgPrimary, color:theme.white}">{{$t('index25')}}</view>
					<view v-if="cur==1" @click="router.push('/pages/index/unline/details?id='+item.id)" class="padding-10 radiu-10 text-center" :style="{background:theme.bgPrimary, color:theme.white}">
						{{$t('index25')}}</view>
				</view>
				<!-- <view v-if="cur==1" class="listBox1">
					<view class="flex align-center justify-between">
						<view class="flex direction-column align-start justify-center">
							<view class="flex align-center margin-b-12">
								<view class="font-30 color-212121 margin-r-16 hidden-1" style="max-width: 250rpx;">{{item.name}}</view>
								<text class="font-24 color-949494">{{$t('index30')}}：<span class="color-FF5B3E">{{item.start_time}}</span></text>
							</view>
							<view class="radiu-4 flex align-center bj-tips margin-t-10">
								<view class="padding-6 bj-bians radiu-4 font-24 color-white">
									{{checktype(item.type)}}
								</view>
								<text class="font-24 padding-w-10 color-657EFA">{{item.code}}</text>
							</view>
						</view>
						<view @click="router.push('/pages/index/unline/details?id='+item.id)" class="btnsbox">{{$t('index25')}}</view>
					</view>
					<view class="flex align-center justify-between padding-t-20 margin-t-20" style="border-top: 1rpx solid rgba(179,186,195,0.3);">
						<text class="font-24 color-949494">{{$t('index31')}}：<span class="font-32 color-FF5B3E">{{item.fx_price}}/{{$t('index26')}}</span></text>
					</view>
				</view> -->
				<view v-if="cur==2" class="listBox2" :style="{background:theme.light}">

					<view class="flex direction-column ">
						<view class="flex align-start padding-c-20 justify-between">
							<view class="flex align-center margin-b-12 ">
								<view class="font-30 margin-r-16 hidden-1">
									{{item.name}}
								</view>
								<view class="radiu-4 flex align-center margin-l-10" :style="{background:theme.bgPrimary}">
									<view class="padding-6 radiu-4 font-24" :style="{background:theme.light}">
										{{checktype(item.type)}}
									</view>
									<text class="font-24 padding-w-10" :style="{color:theme.white}">{{item.code}}</text>
								</view>
							</view>
							<view class="flex text-center font-30  color-999999  weight-bold">{{$t('index20')}}: <span
									class="margin-l-12" :style="{color:theme.primary}">{{item.fx_price}}</span></view>
						</view>
						<view @click="setDetails(item.id)"
							class="width-880 height-64 radiu-8 font-28 flex align-center justify-center"
							:style="{background: theme.bgPrimary, color:theme.white}">
							{{$t('index32')}}
						</view>
					</view>

				</view>
    
				<view v-if="cur==3" class="flex direction-column radiu-20 margin-20-auto padding-w-10"
					:style="{background:theme.light, color:item.increase>=0?theme.green__dark:theme.red__dark}">
					<view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: '1px solid '+theme.light__gray}">
						<view class="flex align-center">
							<view class="font-30 margin-r-16 hidden-1">
								{{item.name}}
							</view>
							<view class="radiu-4 flex align-center margin-l-10" :style="{background:theme.bgPrimary}">
								<view class="padding-6 bj-white radiu-4 font-20 color-000000">
									{{checktype(item.type)}}
								</view>
								<text class="font-20 padding-w-10" :style="{color:theme.white}">{{item.code}}</text>
							</view>
						</view>
						<view class="flex-1 flex align-center justify-end">
							<view @click="setDetailss(item.id)"
								class="width-140 height-45 radiu-8 font-20 flex align-center justify-center"
								:style="{background:item.increase>=0?theme.bgPrimary:theme.slate__gray, color:theme.white}">
								{{$t('index32')}}
							</view>
						</view>
					</view>

					<view class="height-96 flex align-center justify-around">
						<view class="height-50 padding-c-20 absolute" :style="{background: theme.light__gray,width: '1rpx'}"/>
						<view class="flex direction-column text-center font-32">
							<text class="font-26 color-white">{{$t('chicang15')}}</text>
							<text :style="{color:item.increase>=0?theme.green__dark:theme.red__dark}">{{item.increase}}%</text>
						</view>
						<view class="flex direction-column  text-center font-32">
							<text class="font-26 color-white">{{$t('index20')}}</text>
							<text :style="{color:item.increase>=0?theme.green__dark:theme.red__dark}">{{item.fx_price}}</text>
						</view>
						
					</view>
					<!-- <view class="flex-1 flex direction-column align-start justify-center">
						<view class="flex align-center">
							<view class="font-30 margin-r-16 color-white hidden-1" style="border-left: 3px solid #C3F53C;">{{item.name}}</view>
						</view>
						<view class="radiu-4 flex align-center bj-bians  margin-t-10">
							<view class="padding-6 bj-white radiu-4 font-24 color-000000">
								{{checktype(item.type)}}
							</view>
							<text class="font-24 padding-w-10 color-000000">{{item.code}}</text>
						</view>
					</view> -->
					<!-- <view class="flex-1 text-center font-30 weight-bold">{{item.fx_price}}</view> -->
					<!-- <view class="flex-1 text-center font-30 weight-bold">{{item.increase}}%</view> -->

				</view>

			</view>

		</z-paging>
		<u-popup :show="show" mode="center" round="10" @close="show=false">
			<view class="width-600 bj-white radiu-10 padding-30">
				<view class="padding-w-20 flex align-center justify-start text-center font-28 color-000000">
					<text class="font-40 bold-font color-212121 margin-r-12">{{$t('my90')}}</text>
				</view>
				<view class="margin-b-40">
					<view class="padding-w-20">
						<scroll-view scroll-y="true" style="height: 700rpx;">
							<text class="font-30 color-212121 margin-r-12" v-html="content"></text>
						</scroll-view>
					</view>
				</view>
				<view class="height-86 flex align-center justify-around font-28 radiu-8">
					<view class="bj-3333335 flex height-86 width-190 align-center justify-center padding-w-20 radiu-8">
						<text @click="show=false" class="font-28 color-white margin-r-12">{{$t('my91')}}</text>
					</view>
					<view @click="show=false"
						class="bj-949494 flex height-86 width-190 align-center justify-center padding-w-20  radiu-8">
						<text class="font-28 color-white margin-r-12">{{$t('my92')}}</text>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBar: uni.getSystemInfoSync().statusBarHeight,
				cur: 0,
				type: 1,
				status: false,
				recharge_kefu: '',
				content: '',

				tablist: [{
					"name": "新股申购"
				}, {
					"name": "线下配售"
				}, {
					"name": "大宗交易"
				}, {
					"name": "VIP"
				}],
				list: [],
				show: false,

			};
		},
		onLoad(e) {
			this.cur = e.cur
		},
		onShow() {
			this.getInfo()
			this.init()
			this.freezenNofy()
		},
        computed: {
            theme() {
                return this.$store.getters.theme
            }
        },
		methods: {
			setDetail(url) {
				if (this.status == true) {
					this.show = true
					return
				}
				url = '/pages/index/new_SG/details?id=' + url;
				this.router.push(url);
			},
			setDetails(url) {
				if (this.status == true) {
					this.show = true
					return
				}
				url = '/pages/index/dazong/details?id=' + url;
				this.router.push(url);
			},
			setDetailss(url) {
				if (this.status == true) {
					this.show = true
					return
				}
				url = '/pages/index/vip_QC/details?id=' + url;
				this.router.push(url);
			},
			getInfo() {
				this.post('/my/userinfo').then(res => {
					// console.log('user information', res)
					if (res.code == 1) {
						res.data.freezen_status == 1 ? this.status = true : this.status = false
						//console.log('user information', this.status)
					}
					// if (res.code == 1) {
					// 	this.status = res.data.freezen_status
					// }
				})
				this.freezenNofy()
			},
			freezenNofy() {
				this.post('/my/freezenNofy').then(res => {
					//console.log('freezenNofy', res)
					if (res.code == 1) {
						this.content = res.data.content
					}
				})
			},
			open(url) {
				if (url) {
					// #ifdef APP-PLUS
					plus.runtime.openURL(url)
					// #endif
					// #ifdef H5
					window.location.href = url
					// #endif
				}
			},
			init() {
				this.post('/my/recharge_con').then(res => {
					// //console.log('充值内容', res)
					if (res.code == 1) {
						this.recharge_kefu = res.data.recharge_kefu
					}
				})
			},
			tabclick(e) {
				this.cur = e.index
				this.$refs.paging.reload()
			},
			changeType(index) {
				if (this.type != index) {
					this.type = index
					this.$refs.paging.reload()
				}
			},
			queryList(pageNo, pageSize) {
				// 新股列表
				if (this.cur == 0) {
					this.post('/product/new_gu_list', {
						status: this.type,
						page: pageNo,
					}).then(res => {
						//console.log('新股列表', res)
						if (res.code == 1) {
							this.$refs.paging.complete(res.data);
						}
					})
				}
				// 线下配售列表
				if (this.cur == 1) {
					this.post('/product/xianxia_list', {
						status: this.type,
						page: pageNo,
					}).then(res => {
						//console.log('线下配售列表', res)
						if (res.code == 1) {
							this.$refs.paging.complete(res.data);
						}
					})
				}
				// 大宗交易列表
				if (this.cur == 2) {
					this.post('/product/max_list', {
						page: pageNo,
					}).then(res => {
						//console.log('大宗交易列表', res)
						if (res.code == 1) {
							this.$refs.paging.complete(res.data);
						}
					})
				}
				// VIP抢筹列表
				if (this.cur == 3) {
					this.post('/product/vip_list', {
						page: pageNo,
					}).then(res => {
						//console.log('VIP抢筹列表', res)
						if (res.code == 1) {
							this.$refs.paging.complete(res.data);
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.listBox1 {
		width: 100%;
		margin-bottom: 12rpx;
		border-radius: 20rpx;
		padding: 20rpx 32rpx;
	}

	.btnsbox {
		width: 100%;
		height: 64rpx;
		background: #C3F53C;
		border-radius: 20rpx;
		margin-top: 10rpx;
		border: 1rpx solid #2D2D2D;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #000;
	}

	.listBox2 {
		width: 100%;
		height: 180rpx;
		padding: 0 20rpx;
		margin-bottom: 12rpx;
		border-radius: 20rpx;
	}

	.listBox3 {
		width: 100%;
		height: 130rpx;
		background: #1C1D24;
		// display: flex;
		align-items: center;
		border-radius: 20rpx;
		border: 1rpx solid #2D2D2D;
		// justify-content: space-between;
		padding: 0 20rpx;
		margin-bottom: 12rpx;
	}
</style>
