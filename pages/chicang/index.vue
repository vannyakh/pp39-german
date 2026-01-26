<template>
	<view class="min-height-screen" :style="{ background: theme.backgroundSecondary, color: theme.textPrimary }">
        <bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="dataList" @query="queryList" :pageSize="20">
            <!--head tab--->
            <view slot="top" class="head-tab-section" :style="{ paddingTop: (statusBar + 20) + 'px', background: theme.backgroundCard }">
                <v-container size="md">
                    <view class="head-tab-container">
                        <!-- Market Type Selector -->
                        <view class="market-selector">
                            <view class="market-selector-wrapper" :style="{ background: theme.backgroundTertiary }">
                                <view class="market-selector-bg" :class="{ 'active-left': type == 1, 'active-right': type == 2 }" :style="{ background: theme.primary__500 }"></view>
                                <view class="market-tab-btn"
                                      :class="{ 'active': type == 1 }"
                                      @click="changeType(1,6)">
                                    <view class="tab-content">
                                        <view class="tab-text font-28" :style="{ color: type == 1 ? theme.white : theme.neutral__400 }">{{$t('stock.tabs.market_1')}}</view>
                                    </view>
                                </view>
                                <view class="market-tab-btn"
                                      :class="{ 'active': type == 2 }"
                                      @click="changeType(2,5)">
                                    <view class="tab-content">
                                        <view class="tab-text font-28" :style="{ color: type == 2 ? theme.white : theme.neutral__400 }">{{$t('stock.tabs.market_2')}}</view>
                                    </view>
                                </view>
                            </view>
                        </view>

                        <!-- Search Button -->
                        <view class="search-tab-btn" @click="router.push('/pages/index/searchView')" :style="{ background: theme.backgroundTertiary }">
                            <text class="cuIcon-search search-icon" :style="{ color: theme.neutral__400 }"></text>
                        </view>
                    </view>
                </v-container>
            </view>
			<!-- Header Section -->
			<view slot="top">
				<v-container size="md">
					<!-- Balance Cards -->
					<view class="width-100b margin-t-20">
						<view class="text-center flex align-center justify-between">
							<!-- Skeleton for Balance Cards -->
							<view v-if="loading" class="width-100b flex direction-column align-center justify-center height-150 radiu-20" :style="{ background: theme.backgroundCard }">
								<view class="skeleton-line skeleton-title" :style="getSkeletonStyle()"></view>
								<view class="skeleton-line skeleton-amount" :style="getSkeletonStyle()"></view>
							</view>
							<view v-else class="width-100b flex direction-column align-center justify-center height-150 radiu-20" :style="{ background: theme.backgroundCard }">
								<view class="flex align-center justify-center gap-20">
									<view class="text-center font-28" :style="{ color: theme.textSecondary }">{{$t('Total_Balance')}} (€)</view>
                                    <u-icon :name="showPwd1?'eye-fill':'eye-off'" size="25" @click="showPwd1=!showPwd1" :color="theme.neutral__500"></u-icon>
								</view>
								<view class="height-50 text-center font-30 bold-font" :style="{ color: theme.textPrimary }">
									{{showPwd1?money_cnd:'********'}}
								</view>
							</view>
							<view class="width-30"></view>
							<!-- Skeleton for Balance Cards -->
							<view v-if="loading" class="width-100b flex direction-column align-center justify-center height-150 radiu-20" :style="{ background: theme.backgroundCard }">
								<view class="skeleton-line skeleton-title" :style="getSkeletonStyle()"></view>
								<view class="skeleton-line skeleton-amount" :style="getSkeletonStyle()"></view>
							</view>
							<view v-else class="width-100b flex direction-column align-center justify-center height-150 radiu-20" :style="{ background: theme.backgroundCard }">
								<view class="flex align-center justify-center gap-20">
									<view class="text-center font-28" :style="{ color: theme.textSecondary }">{{$t('Total_Balance')}} (US)</view>
                                    <u-icon :name="showPwd2?'eye-fill':'eye-off'" size="25" @click="showPwd2=!showPwd2" :color="theme.neutral__500"></u-icon>
								</view>
								<view class="height-50 text-center font-30 bold-font" :style="{ color: theme.textPrimary }">
									{{showPwd2?money_us:'********'}}
								</view>
							</view>
						</view>
					</view>

					<!-- Category Tabs -->
					<view class="margin-t-20">
						<v-tab-list
							:list="categoryList"
							:defaultActiveKey="status.toString()"
							:activeColor="theme.primary__500"
							:backgroundColor="theme.backgroundCard"
							:textColor="theme.neutral__900"
							:activeTextColor="theme.white"
                            :inactiveTextColor="theme.textTertiary"
							:activeBackgroundColor="theme.primary__500"
							:lineColor="theme.white"
							:borderColor="theme.neutral__200"
                            rounded="full"
							@change="handleTabChange"
						/>
					</view>
				</v-container>
			</view>

			<!-- Position List -->
			<v-container size="md">
				<!-- Skeleton Loading for Position List -->
				<template v-if="loading" >
                        <view class="margin-t-25" v-for="n in 3" :key="'skeleton-' + n">
                        <view class="position-skeleton" :style="{ background: theme.backgroundCard }">
                            <view class="skeleton-header">
                                <view class="skeleton-line skeleton-stock-name" :style="getSkeletonStyle()"></view>
                                <view class="skeleton-line skeleton-price" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="skeleton-content">
                                <view class="skeleton-row">
                                    <view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
                                    <view class="skeleton-line skeleton-value" :style="getSkeletonStyle()"></view>
                                </view>
                                <view class="skeleton-row">
                                    <view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
                                    <view class="skeleton-line skeleton-value" :style="getSkeletonStyle()"></view>
                                </view>
                                <view class="skeleton-row">
                                    <view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
                                    <view class="skeleton-line skeleton-value" :style="getSkeletonStyle()"></view>
                                </view>
                            </view>
                            <view class="skeleton-actions">
                                <view class="skeleton-line skeleton-button" :style="getSkeletonStyle()"></view>
                                <view class="skeleton-line skeleton-button" :style="getSkeletonStyle()"></view>
                            </view>
                        </view>
                    </view>
                </template>

				<!-- Actual Position Cards -->
                <template v-else>
                    <view class="margin-t-25" v-for="(item,index) in dataList" :key="index">
                        <position-card
                            :item="item"
                            :status="status"
                            @sell="showPopup"
                            @detail="showDetail"
                        />

                    </view>
                </template>

			</v-container>
		</z-paging>

		<!-- Sell Confirmation Popup -->
        <u-popup :show="show" :round="10" mode="center" bgColor="transparent" @close="show=false">
			<view class="height-370 flex flex-direction justify-between width-690 padding-20 radiu-20 popup-content" :style="{ background: theme.backgroundCard }">
				<view class="height-220 flex direction-column align-center justify-center">
					<view class="font-30" :style="{ color: theme.textPrimary }">{{$t('position4')}}</view>
					<view v-if="country==6" class="font-48 margin-t-30" :style="{ color: theme.textPrimary }">Euro {{Number(win_or_lost).toFixed(3)}}</view>
					<view v-if="country==5" class="font-48 margin-t-30" :style="{ color: theme.textPrimary }">US {{Number(win_or_lost).toFixed(3)}}</view>
					<view class="font-28 margin-t-30" :style="{ color: theme.textSecondary }">{{$t('optional7')}}</view>
				</view>
				<view class="flex align-center justify-between gap-20">
					<view @click="showDetail(id,status)"
                          class="padding-20 flex align-center justify-center width-100b radiu-10 primary-button"
                          :style="{ background: theme.primary__500, color: theme.white }">
						{{$t('position5')}}
					</view>
					<view @click="pingcang(id)"
                          class="padding-20 flex align-center justify-center width-100b radiu-10 danger-button"
                          :style="{ background: theme.danger__500, color: theme.white }">
						{{$t('position6')}}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import positionCard from './components/position-card/index.vue'
export default {
	components: {
        positionCard
	},
	data() {
		return {
			statusBar: uni.getSystemInfoSync().statusBarHeight,
			show: false,
			status: 2,
			country: 6,// canada 6 | usa 5
			type: 1,
            dataList: [],
			loading: true,
			showPwd1: true,
			showPwd2: true,
			flag: true,
			total_asset: 0.00,
			total_floating_profit: 0.00,
			total_markets: 0.00,
			win_or_lost: 0,
			money: 0.00,
			money_cnd: 0.00,
            money_us: 0.00,
			id: '',
			timer: null,
			categoryList: [
				{
					name: this.$t('chicang1'),
					key: '2',
					type: 2
				},
				{
					name: this.$t('chicang2'),
					key: '3',
					type: 3
				},
				{
					name: this.$t('chicang3'),
					key: '1',
					type: 1
				}
			]
		}
	},
	computed: {
		theme() {
			return this.$store.getters.theme
		}
	},
	onShow() {
		this.updateTabBarText()
		//this.startAutoRefresh()
	},
	onHide() {
		this.clearTimer()
	},
	methods: {
		changeType(index, valCountry) {
			if (this.type !== index) {
				this.loading = true
				this.type = index
				this.country = valCountry
				this.$refs.paging.reload()
			}
		},
		showPopup(item) {
			this.id = item.id
			this.win_or_lost = (item.close - item.price) * item.num
			this.show = true
		},
		showDetail(ids, status) {
			this.router.push('/pages/chicang/position_details?id=' + ids + '&status=' + this.status)
		},
		handleTabChange(item) {
			const index = parseInt(item.key)
			if (this.status !== index) {
				this.loading = true
				this.status = index
				this.$refs.paging.reload()
			}
		},
		pingcang(id) {
			if (!this.flag) return

			this.flag = false
			this.post("/shares/pingcang", {
				id: id,
			}, true).then((res) => {
				this.flag = true
				if (res.code === 1) {
					this.tos(res.msg)
					this.$refs.paging.reload()
					this.show = false
				}
			})
		},
		queryList(pageNo, pageSize) {
			this.loading = true
			this.post("/shares/order_list", {
				status: this.status,
				country: this.country,
				page: pageNo,
			}).then((res) => {
				this.loading = false
				if (res.code === 1) {
					this.total_floating_profit = res.data.total_floating_profit
					this.total_markets = res.data.total_markets
					this.total_asset = res.data.total_asset
					this.money_us = res.data.money_us
					this.money_cnd = res.data.money_cnd
					this.money = res.data.money
					this.$refs.paging.complete(res.data.list.data)
                    console.log('res data list', res.data.list.data)
                    this.startAutoRefresh()
				} else {
					this.$refs.paging.complete(false)
				}
			}).catch(() => {
				this.loading = false
				this.$refs.paging.complete(false)
			})
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

		getSkeletonStyle() {
			return {
				background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 50%, ${this.theme.neutral__200} 75%)`
			}
		},
		startAutoRefresh() {
			this.clearTimer()
			this.timer = setInterval(() => {
				this.refreshData()
			}, 4000)
		},
		clearTimer() {
			if (this.timer) {
				clearInterval(this.timer)
				this.timer = null
			}
		},
		refreshData() {
			// Auto-refresh without showing skeleton loading
			this.post("/shares/order_list", {
				status: this.status,
				country: this.country,
				page: 1,
			}).then((res) => {
				if (res.code === 1) {
					this.total_floating_profit = res.data.total_floating_profit
					this.total_markets = res.data.total_markets
					this.total_asset = res.data.total_asset
					this.money_us = res.data.money_us
					this.money_cnd = res.data.money_cnd
					this.money = res.data.money
					// this.dataList = res.data.list.data
                    this.$refs.paging.complete(res.data.list.data)
				}
			}).catch(() => {
				// Silent fail for auto-refresh
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.text {
	font-size: 12px;
	margin-top: 5px;
}

.uni-px-5 {
	padding-left: 10px;
	padding-right: 10px;
}

.uni-pb-5 {
	padding-bottom: 10px;
}

.dropdown {
	position: relative;
}

.dropdown-list {
	list-style: none;
	padding: 0;
	margin: 0;
	position: absolute;
	top: 100%;
	left: 0;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.dropdown-list li {
	padding: 10px;
	cursor: pointer;
}

.listBox {
	width: 100%;
	margin: 20rpx auto;
	border-radius: 20rpx;
	padding: 20rpx 32rpx 20rpx;
}

.boxs {
	width: 100rpx;
	height: 48rpx;
	border-radius: 4rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
}

.custom::after {
	content: "";
	width: 5px;
	height: 110%;
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%) rotate(10deg);
	transform: translate(-50%, -50%) rotate(10deg);
}

/* Head Tab Section Styles */
.head-tab-section {
	padding: 20rpx 0;
}

.head-tab-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 20rpx;
}

.market-selector {
	flex: 1;
}

.market-selector-wrapper {
	position: relative;
	display: flex;
	border-radius: 16rpx;
	padding: 6rpx;
	overflow: hidden;
}

.market-selector-bg {
	position: absolute;
	top: 6rpx;
	left: 6rpx;
	width: calc(50% - 6rpx);
	height: calc(100% - 12rpx);
	border-radius: 12rpx;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	z-index: 1;
}

.market-selector-bg.active-right {
	transform: translateX(100%);
}

.market-tab-btn {
	position: relative;
	z-index: 2;
	flex: 1;
	padding: 16rpx 20rpx;
	transition: all 0.3s ease;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tab-content {
	display: flex;
	align-items: center;
	justify-content: center;
}

.tab-text {
	transition: color 0.3s ease;
	font-weight: 500;
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


/* Legacy market-type-btn styles for backward compatibility */
.market-type-btn {
	transition: all 0.3s ease;
	border-radius: 20rpx;
	cursor: pointer;
}

.market-type-btn.active {
	transform: scale(1.02);
}

/* Popup and Button Styles */
/* Colors are now handled via inline styles */

/* Skeleton Loading Styles */
.skeleton-line {
	background-size: 200% 100%;
	animation: skeleton-loading 1.5s infinite;
	border-radius: 8rpx;
}

.skeleton-title {
	width: 120rpx;
	height: 24rpx;
	margin-bottom: 20rpx;
}

.skeleton-amount {
	width: 160rpx;
	height: 32rpx;
}

.skeleton-stock-name {
	width: 200rpx;
	height: 28rpx;
}

.skeleton-price {
	width: 120rpx;
	height: 28rpx;
}

.skeleton-label {
	width: 80rpx;
	height: 20rpx;
}

.skeleton-value {
	width: 100rpx;
	height: 20rpx;
}

.skeleton-button {
	width: 120rpx;
	height: 60rpx;
	border-radius: 12rpx;
}

.position-skeleton {
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.skeleton-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.skeleton-content {
	margin-bottom: 30rpx;
}

.skeleton-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.skeleton-actions {
	display: flex;
	gap: 20rpx;
	justify-content: flex-end;
}

@keyframes skeleton-loading {
	0% {
		background-position: -200% 0;
	}
	100% {
		background-position: 200% 0;
	}
}
</style>
