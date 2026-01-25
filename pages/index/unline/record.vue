<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20" :loading-more-enabled="false">
			<app-nav slot="top" :title="$t('index15')"></app-nav>

            <view slot="top" class="padding-32" :style="{background: theme.backgroundCard}">
                <view class="flex align-center justify-between width-100b radiu-10" :style="{background: theme.backgroundTertiary}">
                    <view class="width-100b radiu-15 padding-15" @click="changeType(item.type)"
                          :class="{'tab-active': type==item.type}"
                          :style="getTabStyle(item.type)"
                          v-for="(item,index) in categoryList" :key="index">
                        <view class="text-center font-28" :style="getTabTextStyle(item.type)">{{item.name}}</view>
                    </view>
                </view>

            </view>

			<view class="padding-w-32 margin-t-20">
				<!-- Loading Skeleton -->
				<template v-if="loading">
					<view class="listBox radiu-20" v-for="n in 3" :key="'skeleton-unline-record-' + n" :style="{background: theme.backgroundCard}">
						<view class="flex direction-column align-start justify-center">
							<view class="skeleton-line skeleton-name" :style="getSkeletonStyle()"></view>
							<view class="width-100b flex align-center justify-between margin-c-12">
								<view class="skeleton-line skeleton-date" :style="getSkeletonStyle()"></view>
								<view v-if="type==2" class="skeleton-line skeleton-date" :style="getSkeletonStyle()"></view>
							</view>
							<view class="width-100b flex align-center justify-between">
								<view class="radiu-4 flex align-center margin-t-10">
									<view class="skeleton-line skeleton-code" :style="getSkeletonStyle()"></view>
									<view class="skeleton-line skeleton-code-text" :style="getSkeletonStyle()"></view>
								</view>
								<view class="skeleton-line skeleton-status" :style="getSkeletonStyle()"></view>
							</view>
						</view>
						<view class="flex align-center justify-between padding-t-20 margin-t-20" :style="{borderTop: `1rpx solid ${getColorWithOpacity(theme.neutral__200, 0.3)}`}">
							<view class="flex-1 flex direction-column justify-center">
								<view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
								<view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
							</view>
							<view v-if="type==2" class="flex-1 flex direction-column align-center justify-center">
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
						<view class="flex align-center justify-between padding-t-20" v-if="type==2">
							<view class="flex-1 flex direction-column justify-center">
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
					</view>
				</template>

				<!-- Actual Data -->
				<template v-else>
					<view class="listBox radiu-20" v-for="(item,index) in list" :key="'unline-record-item-' + index" :style="{background: theme.backgroundCard}">
						<view class="flex direction-column align-start justify-center">
							<view class="font-30 margin-r-16 hidden-1" :style="{color: theme.textPrimary}">{{item.name}}</view>
							<view class="width-100b flex align-center justify-between margin-c-12">
								<text class="font-24" :style="{color: theme.textTertiary}">{{$t('index33')}}：<span :style="{color: theme.danger}">{{item.createtime}}</span></text>
								<text v-if="type==2" class="font-24" :style="{color: theme.textTertiary}">{{$t('index51')}}：<span :style="{color: theme.danger}">{{item.updatetime}}</span></text>
							</view>
							<view class="width-100b flex align-center justify-between">
								<view class="radiu-4 flex align-center margin-t-10">
									<view class="padding-6 radiu-4 font-24" :style="{background: theme.primary__500, color: theme.white}">
										{{checktype(item.type)}}
									</view>
									<text class="font-24 padding-w-10" :style="{color: theme.primary__500}">{{item.code}}</text>
								</view>
								<text v-if="item.status==1" class="font-24" :style="{color: theme.textTertiary}">{{$t('index49')}}</text>
								<text v-if="item.status==2" class="font-24" :style="{color: theme.success}">{{$t('index50')}}</text>
								<view v-if="item.status==3" class="flex align-center">
									<text class="font-24 margin-r-20" :style="{color: theme.success}">{{$t('index52')}}</text>
									<view @click="pingcang(item.id)" class="padding-c-6 width-100 text-center radiu-4 font-24" :style="{background: theme.primary__500, color: theme.white}">
										<text :style="{color: theme.white}">{{$t('index53')}}</text>
									</view>
								</view>
								<text v-if="item.status==4" class="font-24" :style="{color: theme.textTertiary}">{{$t('index54')}}</text>
							</view>
						</view>
						<view class="flex align-center justify-between padding-t-20 margin-t-20" :style="{borderTop: `1rpx solid ${getColorWithOpacity(theme.neutral__200, 0.3)}`}">
							<view class="flex-1 flex direction-column justify-center">
								<text class="font-32" :style="{color: theme.danger}">{{item.price}}/{{$t('index26')}}</text>
								<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index27')}}</text>
							</view>
							<view v-if="item.status==4" class="flex-1 flex direction-column align-center justify-center">
								<text class="font-32" :style="{color: theme.danger}">{{item.pc_price}}</text>
								<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index55')}}</text>
							</view>
							<view class="flex-1 flex direction-column align-center justify-center">
								<text class="font-32" :style="{color: theme.danger}">{{item.sg_num}}</text>
								<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index41')}}</text>
							</view>
							<view class="flex-1 flex direction-column align-end justify-center">
								<text class="font-32" :style="{color: theme.danger}">{{item.num}}</text>
								<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index56')}}</text>
							</view>
						</view>
						<view class="flex align-center justify-between padding-t-20" v-if="type==2">
							<view class="flex-1 flex direction-column justify-center">
								<text class="font-32" :style="{color: theme.danger}">{{item.close}}/{{$t('index26')}}</text>
								<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index57')}}</text>
							</view>
							<view class="flex-1 flex direction-column align-center justify-center">
								<text class="font-32" :style="{color: theme.danger}">{{item.rise_all_fall}}</text>
								<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index58')}}</text>
							</view>
							<view class="flex-1 flex direction-column align-end justify-center">
								<text class="font-32" :style="{color: theme.danger}">{{item.invoice}}</text>
								<text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index59')}}</text>
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
				this.post('/product/xianxia_ping', {
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
			queryList(pageNo, pageSize) {
				this.loading = true;

				this.post('/product/xianxia_log', {
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
			getTabStyle(tabType) {
				if (this.type === tabType) {
					return {
						background: this.theme.primary__500,
						boxShadow: `0 2rpx 8rpx ${this.getColorWithOpacity(this.theme.primary__500, 0.2)}`
					}
				}
				return {}
			},
			getTabTextStyle(tabType) {
				if (this.type === tabType) {
					return {
						color: this.theme.white
					}
				}
				return {
					color: this.theme.textSecondary
				}
			},
			getSkeletonStyle() {
				const baseColor = this.theme.textTertiary || '#999999'
				const baseRgba = this.getColorWithOpacity(baseColor, 0.15)
				const highlightRgba = this.getColorWithOpacity(baseColor, 0.25)
				return {
					background: `linear-gradient(90deg, ${baseRgba} 25%, ${highlightRgba} 50%, ${baseRgba} 75%)`,
					backgroundSize: '200% 100%',
					animation: 'skeleton-pulse 1.5s infinite'
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

	.listBox {
		width: 100%;
		margin-bottom: 12rpx;
		padding: 20rpx 32rpx;
	}

	/* Skeleton Loading Styles */
	.skeleton-line {
		border-radius: 4rpx;
	}

	.skeleton-name {
		width: 200rpx;
		height: 30rpx;
		margin-bottom: 12rpx;
	}

	.skeleton-date {
		width: 120rpx;
		height: 24rpx;
	}

	.skeleton-code {
		width: 60rpx;
		height: 24rpx;
		margin-right: 10rpx;
	}

	.skeleton-code-text {
		width: 80rpx;
		height: 24rpx;
	}

	.skeleton-status {
		width: 80rpx;
		height: 24rpx;
	}

	.skeleton-price {
		width: 100rpx;
		height: 32rpx;
		margin-bottom: 8rpx;
	}

	.skeleton-label {
		width: 60rpx;
		height: 24rpx;
	}

	@keyframes skeleton-pulse {
		0% {
			background-position: -200% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}

	/* Tab Active State Styling */
	.tab-active {
		transition: all 0.3s ease-in-out;
	}
</style>
