<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :loading-more-enabled="false"
			:auto="false">
			<app-nav slot="top" :title="$t('Favorites')" :titleColor="theme.textPrimary">
				<view slot="right" class="height-100b width-100b flex align-center justify-end padding-w-32">
					<image @click="router.push('/pages/index/searchView')" src="/static/imgs/index/soushuo.png" mode="aspectFit" style="width: 40rpx; height: 40rpx;"></image>
				</view>
			</app-nav>
			<v-container size="md">
				<!-- Loading Skeleton -->
				<template v-if="loading && initialLoad">
					<view class="flex direction-column card-glass radiu-20 margin-20-auto"
						v-for="n in 3" :key="'skeleton-optional-' + n" :style="{background: theme.backgroundCard, rowGap: '20rpx'}">
						<view class="padding-w-20">
							<view class="height-100 flex padding-c-30 align-start justify-between">
								<view class="flex align-center">
									<view class="skeleton-line skeleton-name" :style="getSkeletonStyle()"></view>
									<view class="skeleton-line skeleton-code" :style="getSkeletonStyle()"></view>
								</view>
								<view class="flex align-center justify-center">
									<view class="skeleton-line skeleton-delete" :style="getSkeletonStyle()"></view>
								</view>
							</view>
							<view class="skeleton-line skeleton-divider" :style="getSkeletonStyle()"></view>
						</view>
						<view class="height-96 flex align-center justify-around">
							<view class="flex direction-column text-center">
								<view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
								<view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
							</view>
							<view class="skeleton-line skeleton-vertical" :style="getSkeletonStyle()"></view>
							<view class="flex direction-column text-center">
								<view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
								<view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
							</view>
						</view>
					</view>
				</template>

				<!-- Actual Data -->
				<template v-else-if="!loading || !initialLoad">
					<view @click="setDetail(item.id)" class="flex direction-column card-glass radiu-20 margin-20-auto"
						v-for="(item, index) in list" :key="'optional-item-' + index" :style="{background: theme.backgroundCard, rowGap: '20rpx'}">
						<view class="padding-w-20">
							<view class="height-100 flex  padding-c-30 align-start justify-between">
								<view class="flex align-center">
									<view class="hidden-1 font-30 width-180" :style="{color: theme.textPrimary}">
										{{ item.name }}
									</view>
									<view class="radiu-4 flex align-center margin-l-10" :style="{background: theme.primary__500}">
										<view class="padding-6 radiu-4 font-24" :style="{background: theme.backgroundCard, color: theme.textPrimary}">
											{{ checktype(item.type) }}
										</view>
										<text class="font-24 padding-6" :style="{color: theme.white}">{{ item.code }}</text>
									</view>
								</view>
								<view class="flex align-center justify-center">
									<view @click.stop="Cshow = true, id=item.id" class="delectboxs" :style="getDeleteBoxStyle()">
										<i class="cuIcon-delete" :style="{color: theme.danger}"></i>
									</view>
								</view>
							</view>
	                        <u-line :color="theme.primary__500" dashed></u-line>
						</view>
						<view class="height-96 flex align-center justify-around">
							<view class="flex direction-column  text-center font-32">
								<text class="font-26" :style="{color: theme.textTertiary}">{{ $t('chicang14') }}</text>
								<text :style="{color: getPriceColor(item.increase)}">{{ item.close }}</text>
							</view>
	                        <u-line direction="col" length="50rpx" :color="theme.primary__500" dashed></u-line>
							<view class="flex direction-column text-center font-32">
								<text class="font-26" :style="{color: theme.textTertiary}">{{ $t('chicang15') }}</text>
								<text :style="{color: getPriceColor(item.increase)}">{{ item.increase }}%</text>
							</view>
						</view>
					</view>
				</template>
			</v-container>

		</z-paging>

		<u-popup :show="Cshow" mode="center" round="15" @close="Cshow = false" @open="Cshow = true">
			<view class="width-600  radiu-30 padding-30" :style="{background: theme.backgroundCard}">
				<view class="flex-1 height-160 radiu-12  flex direction-column gap-10 align-center justify-center">
					<view class="delectboxstop" :style="getDeleteBoxStyle()">
						<i class="cuIcon-delete font-50" :style="{color: theme.danger}"></i>
					</view>
					<text class="font-30 margin-t-8 text-center" :style="{color: theme.textPrimary}">{{$t('optional1')}}</text>
				</view>
				<view class="padding-30 flex align-center justify-around">
					<view @click="Cshow = false"
						class="font-28 flex align-center justify-center radiu-20 width-200 height-60"
						:style="{background: theme.textTertiary, color: theme.white}">
						<text :style="{color: theme.white}">{{$t('optional2')}}</text>
					</view>
					<view @click="quxiao(id)"
						class="font-28 flex align-center justify-center radiu-20 width-200 height-60"
						:style="{background: theme.primary__500, color: theme.white}">
						<text :style="{color: theme.white}">{{$t('optional3')}}</text>
					</view>
				</view>
			</view>
		</u-popup>
		<u-popup :show="show" mode="center" round="10" @close="show = false">
			<view class="width-600 radiu-10 padding-30" :style="{background: theme.backgroundCard}">
				<view class="padding-w-20 flex align-center justify-start text-center font-28">
					<text class="font-40 bold-font margin-r-12" :style="{color: theme.textPrimary}">{{ $t('my90') }}</text>
				</view>
				<view class="margin-b-40">
					<view class="padding-w-20">
						<scroll-view scroll-y="true" style="height: 700rpx;">
							<text class="font-30 margin-r-12 content-wrapper" :style="{color: theme.textPrimary}" v-html="content"></text>
						</scroll-view>
					</view>
				</view>
				<view class="height-86 flex align-center justify-around font-28 radiu-8">
					<view class="flex height-86 width-190 align-center justify-center padding-w-20 radiu-8" :style="{background: theme.textTertiary}">
						<text @click="show = false" class="font-28 margin-r-12" :style="{color: theme.white}">{{ $t('my91') }}</text>
					</view>
					<view @click="show = false"
						class="flex height-86 width-190 align-center justify-center padding-w-20  radiu-8" :style="{background: theme.primary__500}">
						<text class="font-28 margin-r-12" :style="{color: theme.white}">{{ $t('my92') }}</text>
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
			list: [],
			zhishu: [],
			timer: null,
			content: '',
			status: false,
			show: false,
			Cshow: false,
			id: null,
			loading: false,
			initialLoad: true,
		};
	},
	onHide() {
		clearTimeout(this.timer)
	},
	onShow() {
		this.getInfo()
		this.init()
		this.queryList()
        this.updateTabBarText()
	},
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
	methods: {
        updateTabBarText() {
            const tabBarItems = [
                { index: 0, key: 'tabBar1' },
                { index: 1, key: 'tabBar2' },
                { index: 2, key: 'tabBar3' },
                { index: 3, key: 'tabBar4' },
                { index: 4, key: 'tabBar5' },
            ]

            tabBarItems.forEach(item => {
                uni.setTabBarItem({
                    index: item.index,
                    text: this.$t(item.key)
                })
            })

            // Update tab bar colors using theme
            uni.setTabBarStyle({
                color: this.theme.textTertiary,
                selectedColor: this.theme.primary__light,
                backgroundColor: this.theme.backgroundPrimary,
                borderStyle: 'transparent'
            })
        },
		getInfo() {
			this.post('/my/userinfo').then(res => {
				// console.log('user information', res)
				if (res.code == 1) {
					res.data.freezen_status == 1 ? this.status = true : this.status = false
					console.log('user information', this.status)
				}
				// if (res.code == 1) {
				// 	this.status = res.data.freezen_status
				// }
			})

		},

		init() {
			this.post('/my/recharge_con').then(res => {
				// //console.log('充值内容', res)
				if (res.code == 1) {
					this.recharge_kefu = res.data.recharge_kefu
				}
			})
		},
		setDetail(url) {
			if (this.status == true) {
				this.show = true
				return
			}
			url = '/pages/quotation/details?id=' + url;
			this.router.push(url);
		},
		quxiao(id) {
			this.post('/shares/shoucang', {
				id: id
			}, true).then(res => {
				//console.log('取消收藏', res)
				if (res.code == 1) {
					this.tos(res.msg)
					this.$refs.paging.reload()
					this.id = null,
					this.Cshow = false
				}
			})
		},

		queryList(pageNo, pageSize) {
			// Only show loading skeleton on initial load
			if (this.initialLoad) {
				this.loading = true;
			}

			this.post('/shares/shoucang_list').then(res => {
				//console.log('数据', res)
				if (res.code == 1) {
					this.zhishu = res.data.zhishu
					this.$refs.paging.complete(res.data.list);

					this.timer = setTimeout(() => {
						this.queryList()
					}, 5000)
				}
			}).finally(() => {
				this.loading = false;
				this.initialLoad = false; // Mark initial load as complete
			})
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
		getPriceColor(increase) {
			return increase >= 0 ? this.theme.primary__500 : this.theme.danger
		},
		getDeleteBoxStyle() {
			return {
				background: this.getColorWithOpacity(this.theme.danger, 0.1)
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
	height: 130rpx;
	margin: 12rpx auto;
	padding-left: 20rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.delectboxs {
	width: 46rpx;
	height: 46rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.delectboxstop {
	width: 130rpx;
	height: 130rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
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

.skeleton-delete {
	width: 46rpx;
	height: 46rpx;
	border-radius: 50%;
}

.skeleton-divider {
	width: 100%;
	height: 2rpx;
	margin: 20rpx 0;
}

.skeleton-label {
	width: 80rpx;
	height: 26rpx;
	margin-bottom: 10rpx;
}

.skeleton-price {
	width: 100rpx;
	height: 32rpx;
}

.skeleton-vertical {
	width: 2rpx;
	height: 50rpx;
}

@keyframes skeleton-pulse {
	0% {
		background-position: -200% 0;
	}
	100% {
		background-position: 200% 0;
	}
}

.content-wrapper {
	::deep(text),
	::deep(p),
	::deep(div),
	::deep(span),
	::deep(h1),
	::deep(h2),
	::deep(h3),
	::deep(h4),
	::deep(h5),
	::deep(h6),
	::deep(li),
	::deep(ul),
	::deep(ol) {
		color: inherit;
	}
	::deep(img) {
		max-width: 100%;
		height: auto;
	}
}
</style>
