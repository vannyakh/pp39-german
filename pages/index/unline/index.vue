<template>
    <view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
        <z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20"
                  :loading-more-enabled="false">
            <app-nav slot="top" :title="$t('trading4')">
                <view slot="right" class="height-100b width-100b flex align-center justify-end padding-w-32">
                    <u-icon @click="router.push('/pages/index/unline/record')" name="order" :color="theme.primary__500" size="28"></u-icon>
                </view>
            </app-nav>


            <view slot="top" class="padding-w-32 padding-c-20" :style="{background: theme.backgroundCard}">
                <view class="radiu-10 text-center flex align-center justify-between"
                      :style="{background: theme.backgroundTertiary}">
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(1)"
                          :class="{'tab-active': type==1}"
                          :style="getTabStyle(1)">
                        <view class="text-center font-28" :style="getTabTextStyle(1)">{{$t('index67')}}</view>
                    </view>
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(2)"
                          :class="{'tab-active': type==2}"
                          :style="getTabStyle(2)">
                        <view class="text-center font-28" :style="getTabTextStyle(2)">{{$t('index68')}}</view>
                    </view>
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(3)"
                          :class="{'tab-active': type==3}"
                          :style="getTabStyle(3)">
                        <view class="text-center font-28" :style="getTabTextStyle(3)">{{$t('index69')}}</view>
                    </view>
                </view>
            </view>

            <!-- Loading Skeleton -->
            <template v-if="loading">
                <view class="padding-w-32 margin-t-20" v-for="n in 3" :key="'skeleton-unline-' + n">
                    <view class="listBox1" :style="{background: theme.backgroundCard}">
                        <view class="padding-w-20">
                            <view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: `1rpx solid ${theme.neutral__200}`}">
                                <view class="flex align-center">
                                    <view class="skeleton-line skeleton-name" :style="getSkeletonStyle()"></view>
                                    <view class="skeleton-line skeleton-code" :style="getSkeletonStyle()"></view>
                                </view>
                                <view class="flex align-center justify-center">
                                    <view class="skeleton-line skeleton-time" :style="getSkeletonStyle()"></view>
                                </view>
                            </view>
                        </view>

                        <view class="flex align-center justify-between padding-t-20 margin-t-20 margin-b-20">
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
                        <view class="skeleton-line skeleton-button" :style="getSkeletonStyle()"></view>
                    </view>
                </view>
            </template>

            <!-- Actual Data -->
            <template v-else>
                <view class="padding-w-32 margin-t-20" v-for="(item,index) in list" :key="'unline-item-' + index">
                    <view class="listBox1" :style="{background: theme.backgroundCard}">
                        <view class="padding-w-20">
                            <view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: `1rpx solid ${theme.neutral__200}`}">
                                <view class="flex align-center">
                                    <view class="hidden-1 font-30 width-180" :style="{color: theme.textPrimary}">
                                        {{item.name}}
                                    </view>
                                    <view class="radiu-4 flex align-center margin-l-10" :style="{background: theme.primary__500}">
                                        <view class="padding-6 radiu-4 font-24" :style="{background: theme.backgroundCard, color: theme.textPrimary}">
                                            {{checktype(item.type)}}
                                        </view>
                                        <text class="font-24 padding-w-10" :style="{color: theme.white}">{{item.code}}</text>
                                    </view>
                                </view>
                                <view class="flex align-center justify-center">
                                    <text class="font-24" :style="{color: theme.textTertiary}">{{$t('index24')}}：<span
                                            :style="{color: theme.textTertiary}">{{item.start_time}}</span></text>
                                </view>
                            </view>
                        </view>

                        <view class="flex align-center justify-between padding-t-20 margin-t-20 margin-b-20">
                            <view class="flex-1 flex direction-column justify-center">
                                <text class="font-32" :style="{color: theme.primary__500}">{{item.price}}/{{$t('index26')}}</text>
                                <text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index27')}}</text>
                            </view>
                            <view class="flex-1 flex direction-column align-center justify-center">
                                <text class="font-32" :style="{color: theme.primary__500}">{{item.profit_rate}}</text>
                                <text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index28')}}</text>
                            </view>
                            <view class="flex-1 flex direction-column align-end justify-center">
                                <text class="font-32" :style="{color: theme.primary__500}">{{item.count_num}}</text>
                                <text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index29')}}</text>
                            </view>
                        </view>
                        <view @click="router.push('/pages/index/unline/details?id='+item.id)" class="padding-10 radiu-10 text-center" :style="{background: theme.primary__500, color: theme.white}">
                            <text :style="{color: theme.white}">{{$t('index25')}}</text>
                        </view>
                    </view>
                </view>
            </template>

        </z-paging>

    </view>
</template>

<script>
export default {
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            type: 1,
            status: false,
            list: [],
            loading: false,

        };
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    methods: {
        changeType(index) {
            if (this.type != index) {
                this.type = index
                this.$refs.paging.reload()
            }
        },
        queryList(pageNo, pageSize) {
            this.loading = true;

            this.post('/product/xianxia_list', {
                status: this.type,
                page: pageNo,
            }).then(res => {
                if (res.code == 1) {
                    this.$refs.paging.complete(res.data);
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        getTabStyle(tabIndex) {
            if (this.type === tabIndex) {
                return {
                    background: this.theme.primary__500,
                    boxShadow: `0 2rpx 8rpx ${this.getColorWithOpacity(this.theme.primary__500, 0.2)}`
                }
            }
            return {}
        },
        getTabTextStyle(tabIndex) {
            if (this.type === tabIndex) {
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

	.listBox1 {
		width: 100%;
		margin-bottom: 12rpx;
		border-radius: 20rpx;
		padding: 20rpx 32rpx;
	}

	.btnsbox {
		width: 100%;
		height: 64rpx;
		border-radius: 20rpx;
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
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
		align-items: center;
		border-radius: 20rpx;
		padding: 0 20rpx;
		margin-bottom: 12rpx;
	}

	/* Skeleton Loading Styles */
	.skeleton-line {
		border-radius: 4rpx;
	}

	.skeleton-name {
		width: 180rpx;
		height: 30rpx;
		margin-right: 20rpx;
	}

	.skeleton-code {
		width: 120rpx;
		height: 24rpx;
	}

	.skeleton-time {
		width: 150rpx;
		height: 24rpx;
	}

	.skeleton-price {
		width: 100rpx;
		height: 32rpx;
		margin-bottom: 8rpx;
	}

	.skeleton-label {
		width: 80rpx;
		height: 24rpx;
	}

	.skeleton-button {
		width: 100%;
		height: 40rpx;
		border-radius: 10rpx;
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

