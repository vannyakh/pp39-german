<template>
	<view class="min-height-screen" :style="{ background: theme.backgroundSecondary, color: theme.textPrimary }">
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList"
                  @refresherStatusChange="handleRefreshStatus"
                  :auto="false">
            <template #refresher>
                <custom-refresher :status="refresherStatus"/>
            </template>

			<!-- Header Search -->
			<view :style="{paddingTop: statusBar + 'px'}">
                <v-container size="md" :padding="false">
                    <!--header tab (Discover and Market)-->
                    <view class="header-discover-market">
                        <header-tab :activeIndex="0"/>
                    </view>

                </v-container>

			</view>

			<!-- Main Content -->
			<v-container size="md" class="relative">
                <!-- Banner -->
                <view class="width-100b margin-c-20 relative">
                    <u-swiper :list="banner" height="180" radius="10" keyName="image"></u-swiper>
                </view>
                <view class="notice">
                    <u-notice-bar direction="row" speed="20"
                                  url="/pages/index/notice/index"
                                  :color="theme.textPrimary" :bgColor="theme.backgroundCard"
                                  :text="messages"></u-notice-bar>
                </view>

                <!--Exchange rate-->
                <view class="exchange-rate-container">
                    <view class="exchange-grid" :style="{ background: theme.backgroundCard }">
                        <view class="exchange-item" v-for="(item, index) in exchangeRate" :key="index" :style="{ background: 'rgba(255, 255, 255, 0.05)' }">
                            <view class="currency-from" :style="{ color: theme.textSecondary, opacity: 0.8 }">{{ item.from }}</view>
                            <view class="rate-value" :style="{ color: theme.primary__light }">{{ item.rate }}</view>
                            <view class="currency-to" :style="{ color: theme.textSecondary, opacity: 0.7 }">{{ item.to }}</view>
                        </view>
                    </view>
                </view>
				<!-- Menu Grid -->
				<view class="menu-grid-container">
					<view class="menu-grid" :style="{ background: theme.backgroundCard }">
						<view
							v-for="(item, index) in activeMenuList"
							:key="index"
							@click="goToPage(item)"
							class="menu-item"
						>
							<view class="menu-icon-container circle" :style="{ backgroundColor: theme.backgroundTertiary }">
								<image class="menu-icon" :src="item.icon" mode="aspectFit"></image>
							</view>
							<label-marquee :text="$t(item.translationKey)"
										   :containerWidth="150" :threshold="13"
                                           :color="theme.textPrimary"
										   :locale="$i18n.locale" />
						</view>
					</view>
				</view>

			<!-- Let's Get Started Section -->
			<view class="lets-get-started-container">
				<view class="section-title" :style="{ color: theme.textPrimary }">{{ $t('lets_get_started') }}</view>

				<view class="get-started-grid">
					<!-- Open An Account Card (Large) -->
					<swiper-card
						:swiper-data="openAccountSwiper"
						card-type="large"
						:autoplay="autoplay"
						:interval="openAccountInterval"
						:duration="duration"
						:show-indicator="true"
						:icon-size="100"
						@click="handleOpenAccount"
						@change="onOpenAccountSwiperChange"
						class="open-account-card"
					/>

					<!-- Right Side Cards -->
					<view class="right-cards">
						<!-- First Trade Card -->
						<swiper-card
							:swiper-data="firstTradeSwiper"
							card-type="small"
							:autoplay="autoplay"
							:interval="firstTradeInterval"
							:duration="duration"
							:show-indicator="false"
							:icon-size="60"
							@click="handleFirstTrade"
							@change="onFirstTradeSwiperChange"
							class="first-trade-card"
						/>

						<!-- Invest In Indices Card -->
						<swiper-card
							:swiper-data="investIndicesSwiper"
							card-type="small"
							:autoplay="autoplay"
							:interval="investIndicesInterval"
							:duration="duration"
							:show-indicator="true"
							:icon-size="70"
							@click="handleInvestIndices"
							@change="onInvestIndicesSwiperChange"
							class="invest-indices-card"
						/>
					</view>
				</view>
			</view>

				<!-- News Section -->
				<view class="width-100b margin-t-30 relative">
					<view class="flex justify-between align-center margin-b-10">
						<text class="bold-font" :style="{ color: theme.textPrimary }">{{$t('service3')}}</text>
						<view @click="router.goTabBar('/pages/news/index')" class="flex align-center">
							<text class="bold-font" :style="{ color: theme.textPrimary }">{{$t('service4')}}</text>
							<u-icon name="arrow-right" size="20" :color="theme.textPrimary"></u-icon>
						</view>
					</view>

                    <news-card
                            v-for="(item,index) in list"
                            :key="index"
                            :item="item"
                            @click="handleNewsClick"
                    />
				</view>
			</v-container>
		</z-paging>

        <kefu-float bottom="140rpx" right="24rpx" />

		<!-- Window Message Popup -->
		<u-popup mode="center" :show="Tshow" round="20" closeable @close="Tshow=false">
			<view class="width-680 radiu-20 padding-c-30" :style="{ background: theme.backgroundCard }">
				<view class="padding-w-20">
					<scroll-view scroll-y="true" style="height: 700rpx;">
						<view class="padding-30 width-100b" style="overflow: hidden;" :style="{ color: theme.textPrimary }" v-html="window_message"></view>
					</scroll-view>
				</view>
			</view>
		</u-popup>

		<!-- Real Name Popup -->
		<u-popup :show="show1" mode="center" round="20" @close="show1=false">
			<view class="width-600 radiu-15 padding-30" :style="{ background: theme.backgroundCard }">
				<view class="padding-w-20 flex align-center justify-start text-center font-28" :style="{ color: theme.textPrimary }">
					<text class="font-40 margin-r-12" :style="{ color: theme.textPrimary }">{{$t('real-name')}}</text>
				</view>
				<view class="margin-b-20"></view>
				<view class="height-86 flex align-center justify-around font-28 radiu-8">
					<view class="flex height-65 width-190 align-center justify-center padding-w-20 radiu-10" :style="{background: theme.primary__light, color: theme.white}">
						<text @click="show1=false" class="font-28 margin-r-12" :style="{ color: theme.white }">{{$t('my91')}}</text>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import {quickMenu} from "../../constant/mockupData";
import SwiperCard from "./components/swiper-card";

export default {
	components: {
		SwiperCard
	},
	data() {
		return {
            refresherStatus: 'default',
			statusBar: uni.getSystemInfoSync().statusBarHeight,
			recharge_kefu: '',
			list: [],
			messages: '',
			cateList: [],
			cate_id: '',
			banner: [],
			Tshow: false,
			show1: false,
			window_message: '',
			userinfo: {},
			menuList: quickMenu,
            exchangeRate: [],
            autoplay: true,
            // Different intervals for each swiper to avoid simultaneous changes
            openAccountInterval: 4000,    // Slower for large card
            firstTradeInterval: 3500,     // Medium speed
            investIndicesInterval: 3000,  // Faster for small card
            duration: 800,                // Slower transition duration
            openAccountSwiper: [
                { title: this.$t('step_1'), description: this.$t('register_account'), icon: '/static/imgs/index/opened.png' },
                { title: this.$t('step_2'), description: this.$t('verify_identity'), icon: '/static/imgs/index/opened.png' },
                { title: this.$t('step_3'), description: this.$t('start_trading'), icon: '/static/imgs/index/opened.png' }
            ],
            firstTradeSwiper: [
                { title: this.$t('low_risk'), description: this.$t('start_with_5'), icon: '/static/imgs/index/invest.png' },
                { title: this.$t('easy_learning'), description: this.$t('simple_interface'), icon: '/static/imgs/index/invest.png' },
                { title: this.$t('quick_start'), description: this.$t('instant_trading'), icon: '/static/imgs/index/invest.png' }
            ],
            investIndicesSwiper: [
                { title: this.$t('diversified'), description: this.$t('wide_range_etfs'), icon: '/static/imgs/index/trade.png' },
                { title: this.$t('stable_growth'), description: this.$t('long_term_returns'), icon: '/static/imgs/index/trade.png' },
                { title: this.$t('professional'), description: this.$t('expert_management'), icon: '/static/imgs/index/trade.png' }
            ]
		}
	},
	computed: {
		theme() {
			return this.$store.getters.theme
		},
		activeMenuList() {
			return this.menuList.filter(item => {
				console.log(item);
				console.log(this.userinfo);
				
				if (item.name === 'KYC' && this.userinfo.is_auth) {
					return false
				}
				return true
			})
		}
	},
	onLoad() {
		this.getindex()
		this.getnews_cate()
	},
	onShow() {
		this.recharge_con()
		this.updateTabBarText()
	},
	methods: {
        handleRefreshStatus(status) {
            this.refresherStatus = status
        },
		goToPage(item) {
			if (!item.path) return

			console.log(item);
			
			if (item.types === 1) {
				this.router.goTabBar(item.path)
			} else {
				this.router.push(item.path)
			}
		},
		getInfo() {
			this.post('/my/userinfo').then(res => {
				if (res.code === 1) {
					this.userinfo = res.data
					this.$store.commit('setavatar', res.data.avatar)
				}
			})
		},
		getindex() {
			this.post('/index/index').then(res => {
				if (res.code === 1) {
					this.banner = res.data.banner
					let temp = res.data.window_message.replace(/\<img/gi, ' <img style="width:100% !important;" ')
					this.window_message = temp
					this.Tshow = res.data.open_window === 1
					this.messages = res.data.message ? res.data.message.title : ''

					// Handle exchange rates
					if (res.data.exchange_myr_cny && res.data.exchange_myr_idr) {
						this.exchangeRate = [
							{ from: '1 US', rate: res.data.exchange_myr_cny, to: 'US' },
							{ from: '1 US', rate: res.data.exchange_myr_idr, to: 'Euro' }
						]
					}
				}
			})
		},
		recharge_con() {
			this.post('/my/recharge_con').then(res => {
				if (res.code === 1) {
					this.recharge_kefu = res.data.recharge_kefu
				}
			})
		},
		getnews_cate() {
			this.post('/index/news_cate').then((res) => {
				if (res.code === 1) {
					this.cateList = res.data
					if (this.cate_id === '') {
						this.cate_id = res.data[0].id
					}
					this.queryList(1, 20)
				}
			})
		},
		queryList(pageNo, pageSize) {
			this.post('/index/news_list', {
				cate_id: this.cate_id,
				page: pageNo,
			}).then(res => {
				if (res.code === 1) {
					this.$refs.paging.complete(res.data.data)
				}
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
        handleNewsClick(item) {
            console.log('News clicked:', item)
        },
        handleOpenAccount() {
            // Navigate to account opening page
            this.router.push('/pages/login/register')
        },
        handleFirstTrade() {
            // Navigate to trading page
            this.router.push('/pages/quotation/index')
        },
        handleInvestIndices() {
            // Navigate to investment page
            this.router.push('/pages/invest/index')
        },
        onOpenAccountSwiperChange(index) {
            //console.log('Open Account swiper changed to:', index)
        },
        onFirstTradeSwiperChange(index) {
            //console.log('First Trade swiper changed to:', index)
        },
        onInvestIndicesSwiperChange(index) {
            //console.log('Invest Indices swiper changed to:', index)
        }
	}
}
</script>

<style lang="scss" scoped>
    .exchange-rate-container {
      margin: 15rpx 0;
        display: none;

      .exchange-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12rpx;
        border-radius: 16rpx;
        padding: 16rpx;
        backdrop-filter: blur(10px);
      }

      .exchange-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 12rpx;
        border-radius: 12rpx;

        .currency-from {
          font-size: 20rpx;
          margin-bottom: 6rpx;
        }

        .rate-value {
          font-size: 28rpx;
          font-weight: bold;
          margin-bottom: 6rpx;
        }

        .currency-to {
          font-size: 20rpx;
        }
      }
    }
	.menu-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: 12rpx;
		border-radius: 32rpx;
		padding: 20rpx;
		backdrop-filter: blur(10px);
	}

	.menu-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5rpx;
		padding: 8rpx;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.menu-item:active {
		transform: scale(0.95);
	}

	.menu-icon-container {
		width: 80rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
        border-radius: 50%;
	}


	.menu-item:active .menu-icon-container {
		transform: translateY(2rpx);
	}

	.menu-icon {
		width: 100%;
		height: 100%;
		//filter: brightness(0) invert(1);
	}
    .notice{
      border-radius: 10rpx;
      overflow: hidden;
      margin: 20rpx 0;
    }
    .header-discover-market{
      width: 70%;
      margin: auto;
    }

    /* Let's Get Started Section */
    .lets-get-started-container {
        margin: 30rpx 0;
    }

    .section-title {
        font-size: 28rpx;
        font-weight: bold;
        text-align: left;
        margin-bottom: 20rpx;
    }

    .get-started-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 15rpx;
        height: 320rpx;
    }

    /* Open Account Card (Large) */
    .open-account-card {
        grid-row: 1 / 3;
        grid-column: 1;
    }


    /* Right Cards Container */
    .right-cards {
        display: contents;
    }

    /* First Trade Card */
    .first-trade-card {
        grid-row: 1;
        grid-column: 2;
    }

    /* Invest Indices Card */
    .invest-indices-card {
        grid-row: 2;
        grid-column: 2;
    }


</style>
