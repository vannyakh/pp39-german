<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary}">
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20" :loading-more-enabled="false">
			<app-nav slot="top" :title="$t('index15')"></app-nav>

            <view slot="top" class="padding-32" :style="{background: theme.backgroundCard}">
                <view class="flex align-center justify-between width-100b radiu-10" :style="{background: theme.backgroundTertiary}">
                    <view class="width-100b radiu-15 padding-15"
                          :class="{'tab-active': type==item.type}"
                          :style="getTabStyle(item.type)"
                          @click="changeType(item.type)"
                          v-for="(item,index) in categoryList" :key="index">
                        <view class="text-center font-28" :style="getTabTextStyle(item.type)">{{item.name}}</view>
                    </view>
                </view>

            </view>

			<view class="padding-w-32 margin-t-20">
				<!-- Loading Skeleton -->
				<template v-if="loading">
					<view class="listBox radiu-20" :style="{background: theme.backgroundCard}"
                          v-for="n in 2" :key="'skeleton-record-' + type + '-' + renderKey + '-' + n">
						<view class="padding-w-0">
							<view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: `1px solid ${theme.neutral__200}`}">
								<view class="flex align-center">
									<view class="skeleton-line skeleton-name" :style="getSkeletonStyle()"></view>
									<view class="skeleton-line skeleton-code" :style="getSkeletonStyle()"></view>
								</view>
							</view>
						</view>
						<view class="padding-w-0">
							<view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: `1px solid ${theme.neutral__200}`}">
								<view class="flex align-center justify-center">
									<view class="skeleton-line skeleton-date" :style="getSkeletonStyle()"></view>
								</view>
							</view>
						</view>
						<view class="flex align-center justify-between margin-t-20">
							<view class="flex-1 flex direction-column justify-center">
								<view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
								<view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
							</view>
							<view class="flex-1 flex direction-column align-center justify-center">
								<view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
								<view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
							</view>
							<view class="flex-1 flex direction-column align-center justify-center">
								<view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
								<view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
							</view>
							<view class="flex-1 flex direction-column align-end justify-center">
								<view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
								<view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
							</view>
						</view>
						<view class="flex align-center justify-center padding-c-10 margin-t-30" :style="{borderTop: `1px solid ${theme.neutral__200}`}">
							<view class="skeleton-line skeleton-button" :style="getSkeletonStyle()"></view>
						</view>
					</view>
				</template>

				<!-- Actual Data -->
				<template v-else>
					<view class="listBox radiu-20" :style="{background: theme.backgroundCard}"
                          v-for="(item,index) in list" :key="'record-item-' + type + '-' + renderKey + '-' + (item.id || index)">

					<view class="padding-w-0">
						<view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: `1px solid ${theme.neutral__200}`}">
							<view class="flex align-center">
								<view class="hidden-1 font-28 width-180" :style="{color: theme.textPrimary}">
									{{item.name}}
								</view>
									<view class="radiu-4 flex align-center" :style="{background: theme.primary__500}">
										<view class="padding-6 radiu-4 font-24" :style="{background: theme.backgroundCard, color: theme.textPrimary}">
											{{checktype(item.type)}}
										</view>
										<text class="font-24 padding-w-10" :style="{color: theme.white}">{{item.code}}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="padding-w-0">
						<view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: `1px solid ${theme.neutral__200}`}">

							<view  class="flex align-center justify-center">
								<text class="font-24" :style="{color: theme.textTertiary}">{{$t('index33')}}：<span :style="{color: theme.textPrimary}">{{item.createtime}}</span></text>
								<text style="margin-left:10px;" v-if="type==2" class="font-24" :style="{color: theme.textTertiary}">{{$t('index51')}}：<span :style="{color: theme.textPrimary}">{{item.updatetime}}</span></text>
							</view>
						</view>
					</view>

					<view class="flex align-center justify-between margin-t-20" >
						<view class="flex-1 flex direction-column justify-center">
							<view class="height-60  padding-c-20  absolute margin-l-210" :style="{background: theme.neutral__200,width: '2rpx'}" />
							<text class="font-32" :style="{color: theme.textPrimary}">{{item.price}}/{{$t('index26')}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index27')}}</text>
						</view>
						<view v-if="item.status==4" class="flex-1 flex direction-column align-center justify-center">

							<text class="font-32" :style="{color: theme.textPrimary}">{{item.pc_price}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index55')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center">
							<view class="height-60  padding-c-20  absolute margin-l-220" :style="{background: theme.neutral__200,width: '2rpx'}"/>
							<text class="font-32" :style="{color: theme.textPrimary}">{{item.sg_num}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index41')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-end justify-center">
							<text class="font-32" :style="{color: theme.textPrimary}">{{item.num}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index56')}}</text>
						</view>
					</view>
					<view class="flex align-center justify-between padding-t-20" v-if="type==2">
						<view class="flex-1 flex direction-column justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220" :style="{background: theme.neutral__200,width: '2rpx'}" />
							<text class="font-32" :style="{color: theme.textPrimary}">{{item.close}}/{{$t('index26')}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index57')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220" :style="{background: theme.neutral__200,width: '2rpx'}" />
							<text class="font-32" :style="{color: theme.textPrimary}">{{item.rise_all_fase}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index58')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-end justify-center">
							<text class="font-32" :style="{color: theme.textPrimary}">{{item.invoice}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index59')}}</text>
						</view>
					</view>
					<view class="flex align-center justify-between padding-t-20" v-if="type==2">
						<view class="flex-1 flex direction-column justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220" :style="{background: theme.neutral__200,width: '2rpx'}" />
							<text class="font-32" :style="{color: theme.textPrimary}">{{item.count_price}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">Winning Amount</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220" :style="{background: theme.neutral__200,width: '2rpx'}" />
							<text class="font-32" :style="{color: theme.textPrimary}">{{item.subscribe_amount}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">Subscribed Amount</text>
						</view>
						<view class="flex-1 flex direction-column align-end justify-center">
							<text class="font-32" :style="{color: theme.textPrimary}">{{item.unsubscribedamount}}</text>
							<text class="font-20 margin-t-8" :style="{color: theme.textTertiary}">Unsubscribed Amount</text>
						</view>
					</view>
					<view class="flex  align-center justify-center padding-c-10 margin-t-30" :style="{borderTop: `1px solid ${theme.neutral__200}`}">
						<view class="width-100b flex align-center justify-center">
							<text v-if="item.status==1" class="font-24" :style="{color: theme.textTertiary}">{{$t('index49')}}</text>
							<!--<text v-if="item.status==2" class="font-24" :style="{color: theme.success}">{{$t('index50')}}</text>-->
							<view v-if="item.status==2" class="flex align-center">
								<view v-if="item.complete==0">
									<view @click="subscribe(item.id)" style="padding:5px;" class="width-150 text-center radiu-4 font-24" :style="{background: theme.primary__500, color: theme.white}">
										Subscribe
									</view>
								</view>
							</view>
							<view v-if="item.status==3" class="flex align-center">
							<text class="font-24 margin-r-20" :style="{color: theme.success}">{{$t('index52')}}</text>
								<view @click="pingcang(item.id)" class="padding-c-6 width-100 text-center radiu-4 font-24" :style="{background: theme.primary__500, color: theme.white}">
									{{$t('index53')}}
								</view>
							</view>
							<text v-if="item.status==4" class="font-24" :style="{color: theme.textTertiary}">{{$t('index54')}}</text>
						</view>
					</view>
				</view>
				</template>
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
				loading: false,
				renderKey: Date.now(), // Unique key for each render
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
					this.renderKey = Date.now() // Update render key when switching tabs
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
				this.post('/product/subscribe', {
					id: id
				},true).then(res => {
					if (res.code == 1) {
						this.tos(res.msg)
						this.$refs.paging.reload()
					}
				})
			},
			queryList(pageNo, pageSize) {
				this.loading = true;
				this.renderKey = Date.now(); // Update render key when loading new data
				this.post('/product/new_gu_log', {
					type:this.type,
					page: pageNo,
				}).then(res => {
					if (res.code == 1) {
						//console.log('数据', res)
						this.$refs.paging.complete(res.data);
					}
				}).finally(() => {
					this.loading = false;
				})
			},
			getTabStyle(itemType) {
				if (this.type === itemType) {
					return {
						background: this.theme.primary__500
					}
				}
				return {}
			},
			getTabTextStyle(itemType) {
				if (this.type === itemType) {
					return {
						color: this.theme.white
					}
				}
				return {
					color: this.theme.textTertiary
				}
			},
			getSkeletonStyle() {
				return {
					background: this.theme.backgroundTertiary
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.listBox {
		width: 100%;
		// height: 233rpx;
		//background: #25262F;
		margin-bottom: 12rpx;
		padding: 20rpx 32rpx;
	}

	/* Tab Active Styles */
	.tab-active {
		transition: all 0.3s ease-in-out;
	}

	/* Skeleton Loading Styles */
	.skeleton-line {
		border-radius: 4rpx;
		animation: skeleton-pulse 1.5s ease-in-out infinite;
	}

	.skeleton-name {
		width: 120rpx;
		height: 28rpx;
		margin-right: 10rpx;
	}

	.skeleton-code {
		width: 80rpx;
		height: 24rpx;
	}

	.skeleton-date {
		width: 200rpx;
		height: 24rpx;
	}

	.skeleton-price {
		width: 60rpx;
		height: 32rpx;
		margin-bottom: 8rpx;
	}

	.skeleton-label {
		width: 40rpx;
		height: 20rpx;
	}

	.skeleton-button {
		width: 120rpx;
		height: 40rpx;
	}

	@keyframes skeleton-pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}
</style>
