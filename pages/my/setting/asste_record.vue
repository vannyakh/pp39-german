<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
			<app-nav slot="top" :title="$t('my42')"></app-nav>

            <view slot="top" class="padding-30" :style="{background: theme.backgroundCard}">
                <view class="flex align-center justify-between width-100b radiu-10" :style="{background: theme.backgroundTertiary}">
                    <view class="width-100b radiu-15 height-80 flex align-center justify-center" @click="set(item.type)"
                          :style="getTabStyle(item.type)"
                          v-for="(item,index) in categoryList" :key="index">
                        <view class="text-center font-26" :style="getTabTextStyle(item.type)">{{item.name}}</view>
                    </view>
                </view>

            </view>

			<v-container size="md">
                <view class="flex-1">
                    <!-- Skeleton loading for type 0 -->
                    <view v-if="isLoading && (!list || list.length === 0) && type==0" v-for="i in skeletonCount" :key="'skeleton-0-' + i">
                        <view class="listBox1 skeleton" :style="{background: theme.backgroundCard}">
                            <view class="height-96 flex align-center justify-between">
                                <view class="flex align-center">
                                    <view class="sk-icon" :style="getSkeletonStyle()"></view>
                                    <view class="flex direction-column margin-l-20">
                                        <view class="sk-line sk-title" :style="getSkeletonStyle()"></view>
                                        <view class="sk-line sk-sub" :style="getSkeletonStyle()"></view>
                                    </view>
                                </view>
                                <view class="sk-line sk-amount" :style="getSkeletonStyle()"></view>
                            </view>
                        </view>
                    </view>

                    <!-- Skeleton loading for type 1 -->
                    <view v-if="isLoading && (!list || list.length === 0) && type==1" v-for="i in skeletonCount" :key="'skeleton-1-' + i">
                        <view class="listBox skeleton" :style="{background: theme.backgroundCard}">
                            <view class="flex align-center justify-between margin-b-15">
                                <view class="flex direction-column align-start">
                                    <view class="sk-line sk-amount-large" :style="getSkeletonStyle()"></view>
                                    <view class="sk-line sk-sub" :style="getSkeletonStyle()"></view>
                                </view>
                                <view class="sk-line sk-status" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="padding-10">
                                <view class="sk-line sk-notice" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="padding-20">
                                <view class="sk-image" :style="getSkeletonStyle()"></view>
                            </view>
                        </view>
                    </view>

                    <!-- Skeleton loading for type 2 -->
                    <view v-if="isLoading && (!list || list.length === 0) && type==2" v-for="i in skeletonCount" :key="'skeleton-2-' + i">
                        <view class="listBox skeleton" :style="{background: theme.backgroundCard}">
                            <view class="flex align-center justify-between margin-b-15">
                                <view class="flex direction-column align-start">
                                    <view class="sk-line sk-amount-large" :style="getSkeletonStyle()"></view>
                                    <view class="sk-line sk-sub" :style="getSkeletonStyle()"></view>
                                </view>
                                <view class="sk-line sk-status" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="padding-10">
                                <view class="sk-line sk-description" :style="getSkeletonStyle()"></view>
                            </view>
                        </view>
                    </view>

                    <!-- Actual list items -->
                    <view class="" v-for="(item,index) in list" :key="index" >
                        <view v-if="type==0" class="listBox1" :style="{background: theme.backgroundCard}">
                            <view class="height-96 flex align-center justify-between">
                                <view class="flex align-center">
                                    <u-icon name="coupon" size="30" :color="theme.primary__500"></u-icon>
                                    <view class="flex direction-column margin-l-20">
                                        <text class="font-28" :style="{color: theme.textPrimary}">{{item.description}}</text>
                                        <text class="font-24" :style="{color: theme.textTertiary}">{{item.createtime}}</text>
                                    </view>
                                </view>
                                <text class="font-32" :style="{color: item.cart==1 ? theme.success : theme.danger}">{{item.cart==1?'+':'-'}}{{item.price}}</text>
                            </view>
                        </view>
                        <view v-if="type==1" class="listBox" :style="{background: theme.backgroundCard}">
                            <view class="flex align-center justify-between margin-b-15">
                                <view class="flex direction-column align-start">
                                    <text class="font-32" :style="{color: theme.success}">+{{item.price}}</text>
                                    <text class="font-28" :style="{color: theme.textTertiary}">{{item.addtime}}</text>
                                </view>
                                <text v-if="item.status==0" class="font-26" :style="{color: theme.danger}">{{$t('my45')}}</text>
                                <text v-if="item.status==1" class="font-26" :style="{color: theme.success}">{{$t('my46')}}</text>
                                <text v-if="item.status==2" class="font-26" :style="{color: theme.textTertiary}">{{$t('my47')}}</text>
                            </view>
                            <view v-if="item.notice" class="padding-10">
                                <text class="font-24" :style="{color: theme.textTertiary}">{{item.notice}}</text>
                            </view>
                            <view class="padding-20">
                                <image class="width-200 height-200" :src="item.image" mode=""></image>
                            </view>
                        </view>
                        <view v-if="type==2" class="listBox" :style="{background: theme.backgroundCard}">
                            <view class="flex align-center justify-between margin-b-15">
                                <view class="flex direction-column align-start">
                                    <text class="font-32" :style="{color: theme.danger}">-{{item.num}}</text>
                                    <text class="font-28" :style="{color: theme.textTertiary}">{{item.add_time}}</text>
                                </view>
                                <text v-if="item.status==0" class="font-26" :style="{color: theme.danger}">{{$t('my45')}}</text>
                                <text v-if="item.status==1" class="font-26" :style="{color: theme.success}">{{$t('my46')}}</text>
                                <text v-if="item.status==2" class="font-26" :style="{color: theme.textTertiary}">{{$t('my47')}}</text>
                            </view>
                            <view v-if="item.description" class="padding-10">
                                <text class="font-24" :style="{color: theme.textTertiary}">{{item.description}}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </v-container>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:0,
				list: [],
                isLoading: false,
                skeletonCount: 3,
                categoryList: [
                    {name: this.$t('my42'), type: 0},
                    {name: this.$t('my43'), type: 1},
                    {name: this.$t('my44'), type: 2},
                ],
			};
		},
        computed: {
            theme(){
                return this.$store.getters.theme
            }
        },
		methods: {
			set(index){
				if(this.type != index){
					this.type = index
					this.$refs.paging.reload()
				}
			},
			getTabStyle(tabType) {
				if (this.type === tabType) {
					return {
						background: this.theme.primary__500
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
				const highlightRgba = this.getColorWithOpacity(baseColor, 0.35)
				return {
					background: `linear-gradient(90deg, ${baseRgba} 0%, ${baseRgba} 40%, ${highlightRgba} 50%, ${baseRgba} 60%, ${baseRgba} 100%)`,
					backgroundSize: '200% 100%',
					animation: 'sk-shimmer 1.5s ease-in-out infinite'
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
			queryList(pageNo, pageSize) {
				this.isLoading = true;

				if(this.type==0){
					this.post('/my/detail', {
						type:0,
						page: pageNo,
					}).then(res => {
						if (res.code == 1) {
							console.log('数据', res)
							this.$refs.paging.complete(res.data.data);
						} else {
							this.$refs.paging.complete(false);
						}
					}).catch(error => {
						console.error('Failed to fetch data:', error);
						this.$refs.paging.complete(false);
					}).finally(() => {
						this.isLoading = false;
					});
				}
				if(this.type==1){
					this.post('/my/recharge_log', {
						page: pageNo,
					}).then(res => {
						if (res.code == 1) {
							//console.log('数据', res)
							this.$refs.paging.complete(res.data.data);
						} else {
							this.$refs.paging.complete(false);
						}
					}).catch(error => {
						console.error('Failed to fetch data:', error);
						this.$refs.paging.complete(false);
					}).finally(() => {
						this.isLoading = false;
					});
				}
				if(this.type==2){
					this.post('/my/width_log', {
						page: pageNo,
					}).then(res => {
						if (res.code == 1) {
							//console.log('数据', res)
							this.$refs.paging.complete(res.data.data);
						} else {
							this.$refs.paging.complete(false);
						}
					}).catch(error => {
						console.error('Failed to fetch data:', error);
						this.$refs.paging.complete(false);
					}).finally(() => {
						this.isLoading = false;
					});
				}
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
		border-radius: 12rpx;
		margin-bottom: 15rpx;
		margin-top: 15rpx;
		padding: 24rpx 32rpx 18rpx;
	}

	.listBox1 {
		width: 100%;
		border-radius: 12rpx;
		margin-bottom: 15rpx;
		margin-top: 15rpx;
		padding: 24rpx 32rpx 18rpx;
	}

	/* Skeleton styles */
	.skeleton {
		position: relative;
		overflow: hidden;

		.sk-line {
			border-radius: 8rpx;
			height: 24rpx;
			display: block;
		}

		.sk-icon {
			width: 60rpx;
			height: 60rpx;
			border-radius: 8rpx;
		}

		.sk-title {
			width: 260rpx;
			height: 28rpx;
			margin-bottom: 10rpx;
		}

		.sk-sub {
			width: 180rpx;
			height: 22rpx;
		}

		.sk-amount {
			width: 120rpx;
			height: 32rpx;
		}

		.sk-amount-large {
			width: 160rpx;
			height: 32rpx;
			margin-bottom: 10rpx;
		}

		.sk-status {
			width: 80rpx;
			height: 26rpx;
		}

		.sk-notice {
			width: 100%;
			height: 24rpx;
			margin-bottom: 8rpx;
		}

		.sk-description {
			width: 90%;
			height: 24rpx;
		}

		.sk-image {
			width: 200rpx;
			height: 200rpx;
			border-radius: 8rpx;
		}
	}

	@keyframes sk-shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}
</style>
