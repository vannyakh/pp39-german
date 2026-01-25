<template>
	<view>
        <bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20" :loading-more-enabled="false">
			<myNav slot="top" :title="$t('index15')"></myNav>

            <view slot="top" class="padding-32" :style="{background: theme.light}">
                <view class="flex align-center justify-between width-100b radiu-10" :style="{background:theme.light__gray}">
                    <view class="width-100b radiu-15 padding-15" @click="changeType(item.type)"
                          :style="{color: type==item.type?theme.white:theme.gray20, background: type==item.type?theme.bgPrimary:''}"
                          v-for="(item,index) in categoryList" :key="index">
                        <view  class="text-center font-28">{{item.name}}</view>
                    </view>
                </view>

            </view>

			<view class="padding-w-32 margin-t-20">
				<view class="listBox radiu-20" :style="{background: theme.light}"
                      v-for="(item,index) in list" :key="index">
					<view class="padding-w-0">
						<view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: '1px solid '+theme.light__gray}">
							<view class="flex align-center">
								<view class="hidden-1 font-28 width-180">
									{{item.name}}
								</view>
									<view class="radiu-4 flex bj-bians align-center" :style="{background:theme.bgPrimary}">
										<view class="padding-6 bg-white radiu-4 font-24 color-000000">
											{{checktype(item.type)}}
										</view>
										<text class="font-24 padding-w-10" :style="{color:theme.white}">{{item.code}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="padding-w-0">
						<view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: '1px solid '+theme.light__gray}">

							<view  class="flex align-center justify-center">
								<text class="font-24 color-949494">{{$t('index33')}}：<span class="" :style="{color:theme.dark}">{{item.createtime}}</span></text>
								<text style="margin-left:10px;" v-if="type==2" class="font-24 color-949494">{{$t('index51')}}：<span class="" :style="{color:theme.dark}">{{item.updatetime}}</span></text>
							</view>
						</view>
					</view>

					<view class="flex align-center justify-between margin-t-20" >
						<view class="flex-1 flex direction-column justify-center">
							<view class="height-60  padding-c-20  absolute margin-l-210" :style="{background: theme.light__gray,width: '2rpx'}" />
							<text class="font-32 ">{{item.price}}/{{$t('index26')}}</text>
							<text class="font-20 color-949494 margin-t-8">{{$t('index27')}}</text>
						</view>
						<view v-if="item.status==4" class="flex-1 flex direction-column align-center justify-center">

							<text class="font-32 ">{{item.pc_price}}</text>
							<text class="font-20 color-949494 margin-t-8">{{$t('index55')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center">
							<view class="height-60  padding-c-20  absolute margin-l-220" :style="{background: theme.light__gray,width: '2rpx'}"/>
							<text class="font-32 ">{{item.sg_num}}</text>
							<text class="font-20 color-949494 margin-t-8">{{$t('index41')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-end justify-center">
							<text class="font-32 ">{{item.num}}</text>
							<text class="font-20 color-949494 margin-t-8">{{$t('index56')}}</text>
						</view>
					</view>
					<view class="flex align-center justify-between padding-t-20" v-if="type==2">
						<view class="flex-1 flex direction-column justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220" :style="{background: theme.light__gray,width: '2rpx'}" />
							<text class="font-32">{{item.close}}/{{$t('index26')}}</text>
							<text class="font-20 color-949494 margin-t-8">{{$t('index57')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220" :style="{background: theme.light__gray,width: '2rpx'}" />
							<text class="font-32 ">{{item.rise_all_fase}}</text>
							<text class="font-20 color-949494 margin-t-8">{{$t('index58')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-end justify-center">
							<text class="font-32 ">{{item.invoice}}</text>
							<text class="font-20 color-949494 margin-t-8">{{$t('index59')}}</text>
						</view>
					</view>
					<view class="flex align-center justify-between padding-t-20" v-if="type==2">
						<view class="flex-1 flex direction-column justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220" :style="{background: theme.light__gray,width: '2rpx'}" />
							<text class="font-32">{{item.count_price}}</text>
							<text class="font-20 color-949494 margin-t-8">Winning Amount</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220" :style="{background: theme.light__gray,width: '2rpx'}" />
							<text class="font-32 ">{{item.subscribe_amount}}</text>
							<text class="font-20 color-949494 margin-t-8">Subscribed Amount</text>
						</view>
						<view class="flex-1 flex direction-column align-end justify-center">
							<text class="font-32 ">{{item.unsubscribedamount}}</text>
							<text class="font-20 color-949494 margin-t-8">Unsubscribed Amount</text>
						</view>
					</view>
					<view class="flex  align-center justify-center padding-c-10 margin-t-30" :style="{borderTop: '1px solid '+theme.light__gray}">
						<view class="width-100b flex align-center justify-center">
							<text v-if="item.status==1" class="font-24 color-949494">{{$t('index49')}}</text>
							<!--<text v-if="item.status==2" class="font-24 color-41BD64">{{$t('index50')}}</text>-->
							<view v-if="item.status==2" class="flex align-center">
								<view v-if="item.complete==0">
									<text  class="font-24 color-41BD64 margin-r-20"></text>
									<view @click="subscribe(item.id)" style="padding:5px;" class="width-150 text-center bj-bians radiu-4 font-24 color-white">
										Subscribe
									</view>
								</view>
							</view>
							<view v-if="item.status==3" class="flex align-center">
							<text class="font-24 color-41BD64 margin-r-20">{{$t('index52')}}</text>
								<view @click="pingcang(item.id)" class="padding-c-6 width-100 text-center bj-bians radiu-4 font-24 color-white">
									{{$t('index53')}}
								</view>
							</view>
							<text v-if="item.status==4" class="font-24 color-949494">{{$t('index54')}}</text>
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
				list: [],
				type:1,
				flag:true,
                categoryList: [
                    {name: this.$t('index49'), type: 1},
                    {name: this.$t('index50'), type: 2},
                ]
			};
		},
        computed: {
            theme(){
                return this.$store.getters.theme
            }
        },
		methods: {
			changeType(index){
				if(this.type != index){
					this.type = index
					this.$refs.paging.reload()
				}
			},
			pingcang(id){
				if(!this.flag) return
				this.flag = false
				this.post('/product/new_pingcang', {
					id: id
				},true).then(res => {
					this.flag = true
					//console.log('平仓', res)
					if (res.code == 1) {
						this.tos(res.msg)
						this.$refs.paging.reload()
					}
				})
			},
			subscribe(id){
				this.post('/eiop/subscribe', {
					id: id
				},true).then(res => {
					if (res.code == 1) {
						this.tos(res.msg)
						this.$refs.paging.reload()
					}
				})
			},
			queryList(pageNo, pageSize) {
				this.post('/eiop/new_gu_log', {
					type:this.type,
					page: pageNo,
				}).then(res => {
					if (res.code == 1) {
						//console.log('数据', res)
						this.$refs.paging.complete(res.data);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.listBox {
		width: 100%;
		// height: 233rpx;
		//background: #25262F;
		margin-bottom: 12rpx;
		padding: 20rpx 32rpx;
	}
</style>
