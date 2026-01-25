<template>
	<view class="min-height-screen" :style="{ background: theme.backgroundSecondary, color: theme.textPrimary }">
        <bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
            <view :style="{paddingTop: statusBar + 'px'}">
                <v-container size="md" :padding="false">
                    <!--header tab (Discover and Market)-->
                    <view class="header-discover-market">
                        <header-tab class="flex-1" :activeIndex="1"/>
                        <!-- Search Button -->
                        <view class="search-tab-btn" @click="router.push('/pages/index/searchView')"
                              :style="{ background: theme.backgroundTertiary }">
                            <text class="cuIcon-search search-icon" :style="{ color: theme.neutral__400 }"></text>
                        </view>
                    </view>


                </v-container>
            </view>


            <v-container size="md">
                <!--uni-app-->
                <market-tabs :tabs="tabs"
                             :currentTab="currentTab"
                             itemWidth="200rpx"
                             :color="theme.textTertiary"
                             :selectedColor="theme.primary__light"
                             @change="changeTab"></market-tabs>


                <!-- Hot Stocks Grid -->
                <hot-stocks-grid :hotStocks="hot" :loading="loading" @stock-click="handleStockClick"></hot-stocks-grid>

                <!-- Stock List -->
                <stock-list :stockList="list" :loading="loading" @stock-click="handleStockClick"></stock-list>


            </v-container>






		</z-paging>

		<!-- Freeze Notification Popup -->
		<u-popup :show="show" mode="center" round="10" @close="show=false">
			<view class="width-600 radiu-10 padding-30" :style="{ background: theme.backgroundCard }">
				<view class="padding-w-20 flex align-center justify-start text-center font-28" :style="{ color: theme.textPrimary }">
					<text class="font-40 bold-font margin-r-12" :style="{ color: theme.textPrimary }">{{$t('my90')}}</text>
				</view>
				<view class="margin-b-40">
					<view class="padding-w-20">
						<scroll-view scroll-y="true" style="height: 700rpx;">
							<text class="font-30 margin-r-12" :style="{ color: theme.textPrimary }" v-html="content"></text>
						</scroll-view>
					</view>
				</view>
				<view class="height-86 flex align-center justify-around font-28 radiu-8">
					<view class="flex height-86 width-190 align-center justify-center padding-w-20 radiu-8" :style="{ background: theme.primary__500 }">
						<text @click="show=false" class="font-28 margin-r-12" :style="{ color: theme.white }">{{$t('my91')}}</text>
					</view>
					<view @click="show=false"
						class="flex height-86 width-190 align-center justify-center padding-w-20 radiu-8" :style="{ background: theme.neutral__400 }">
						<text class="font-28 margin-r-12" :style="{ color: theme.white }">{{$t('my92')}}</text>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import HotStocksGrid from './components/hot-stocks-grid.vue'
import StockList from './components/stock-list.vue'

export default {
    components: {
        HotStocksGrid,
        StockList
    },
	data() {
		return {
			statusBar: uni.getSystemInfoSync().statusBarHeight,
			type: 1,
			country: 6,
			recharge_kefu: '',
			content: '',
			status: false,
			show: false,
			loading: false,
			initialLoad: true,
			list: [],
			hot: [],
			zhishu: [],
			timer: null,
            currentTab: 0
		}
	},
	computed: {
		theme() {
			return this.$store.getters.theme
		},
		tabs() {
			return [
				{
					name: this.$t('canadian_stock'),
					country: 6
				},
				{
					name: this.$t('us_stock'),
					country: 5
				},
			]
		}
	},
	onLoad() {
		this.init()
	},
	onShow() {
		this.getInfo()
		this.updateTabBarText()
	},
	onHide() {
		this.clearTimer()
	},
		methods: {
        handleStockClick(item) {
            this.setDetail(item.id)
        },
        changeTab(e) {
            this.currentTab = e.index
            // Handle market filtering based on selected tab
            this.filterByMarket(e.index)
        },
        filterByMarket(tabIndex) {
            // Clear current data
            this.list = []
            this.hot = []
            this.zhishu = []
            this.initialLoad = true // Reset initial load for new market

            // Set market type based on tab index
            switch(tabIndex) {
                case 0: // Canadian Stock
                    this.type = 1
                    this.country = 6 // Canadian country code
                    break
                case 1: // US
                    this.type = 1
                    this.country = 5 // US country code
                    break
                default:
                    this.type = 1
                    this.country = 6 // Default to Canadian
            }

            // Reload data with new filter
            if (this.$refs.paging) {
                this.$refs.paging.reload()
            }
        },
		set(index, valCountry) {
			if (this.type !== index) {
				this.type = index
				this.country = valCountry
				this.list = []
				this.hot = []
				this.zhishu = []
				if (this.$refs.paging) {
					this.$refs.paging.reload()
				}
			}
		},
		open(url) {
			if (!url) return

			// #ifdef APP-PLUS
			plus.runtime.openURL(url)
			// #endif
			// #ifdef H5
			window.location.href = url
			// #endif
		},
		getInfo() {
			this.post('/my/userinfo').then(res => {
				if (res.code === 1) {
					this.status = res.data.freezen_status === 1
				}
			})
		},
		init() {
			this.post('/my/recharge_con').then(res => {
				if (res.code === 1) {
					this.recharge_kefu = res.data.recharge_kefu
				}
			})
		},
		setDetail(url) {
			if (this.status) {
				this.show = true
				return
			}
			this.router.push('/pages/quotation/details?id=' + url)
		},
		async queryList(pageNo, pageSize) {
			// Only show loading skeleton on initial load
			if (this.initialLoad) {
				this.loading = true
			}

			try {
				// Get hot stocks first
				const hotStocksRes = await this.post('/shares/hot_list', {
                    country: this.country,
                })
				if (hotStocksRes.code === 1) {
					this.hot = hotStocksRes.data.hot || []
					this.zhishu = hotStocksRes.data.zhishu || []
				} else {
					this.hot = []
					this.zhishu = []
				}

				// Then get stock list
				const stockListRes = await this.post('/shares/increase_list', {
					country: this.country,
					page: pageNo || 1,
				})

				if (stockListRes.code === 1 && stockListRes.data && stockListRes.data.data) {
					this.list = stockListRes.data.data
					// Check if paging ref is available before calling complete
					if (this.$refs.paging) {
						this.$refs.paging.complete(stockListRes.data.data)
					}
					//this.startAutoRefresh()
				} else {
					// Handle API error or empty data
					this.list = []
					if (this.$refs.paging) {
						this.$refs.paging.complete(false)
					}
				}
			} catch (err) {
				console.error('API Error:', err)
				this.hot = []
				this.zhishu = []
				this.list = []
				if (this.$refs.paging) {
					this.$refs.paging.complete(false)
				}
			} finally {
				this.loading = false
				this.initialLoad = false // Mark initial load as complete
			}
		},
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
		startAutoRefresh() {
			this.clearTimer()
			this.timer = setTimeout(() => {
				// Don't show loading skeleton during auto-refresh
				this.queryList()
			}, 5000)
		},
		clearTimer() {
			if (this.timer) {
				clearTimeout(this.timer)
				this.timer = null
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.boxs {
	padding: 0 10rpx;
	height: 48rpx;
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #FFFFFF;
}
.header-discover-market{
    width: 90%;
    margin: auto;
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.search-tab-btn {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
    flex-shrink: 0;
}

.search-icon {
    font-size: 32rpx;
    transition: color 0.3s ease;
}



</style>
