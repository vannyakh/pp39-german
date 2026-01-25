<template>
    <view class="min-height-screen" :style="{background: theme.backgroundSecondary}">
        <bg-animate-shape/>
        <z-paging ref="paging" refresher-only @onRefresh="onRefresh">
            <!-- Custom refresher -->
            <custom-refresher slot="refresher" slot-scope="{refresherStatus}" :status="refresherStatus">
            </custom-refresher>


            <!-- Header with coin info -->
            <app-nav blur :title="coinInfo.name || ''" slot="top">
                <template #left>
                    <view class="flex align-center gap-20">
                        <text @tap="router.goBack()" class="font-28 cuIcon-back" :style="{ color: theme.textPrimary }"></text>
                        <view @tap="leftshow = true" class="flex align-center gap-10">
                            <text class="font-28 cuIcon-list" :style="{ color: theme.textPrimary }"></text>
                            <image class="width-48 height-48 card-glass radiu-50" :src="coinInfo.logo_image" mode="">
                            </image>
                        </view>
                    </view>
                </template>
            </app-nav>

            <v-container size="md" :fluid="true" class="relative">
                <!-- Price info -->
                <view class="padding-c-30 padding-w-32 flex align-center justify-between">
                    <view class="flex direction-column align-start justify-between">
                        <text class="font-50 numbold-font" :style="{ color: zhangdie >= 0 ? theme.success : theme.danger }">
                            {{ Number(dayData.close ? dayData.close : coinInfo.close || 0).toFixed(2) }}
                        </text>
                        <text class="font-32 nummedium-font" :style="{ color: zhangdie >= 0 ? theme.success : theme.danger }">
                            {{ zhangdie }}%
                        </text>
                    </view>
                    <view class="flex direction-column align-start">
                        <text class="font-30" :style="{ color: theme.textTertiary }">
                            {{ $t('forex.highprice') }}: {{Number(dayData.high || coinInfo.high).toFixed(coinInfo.price_jd) }}
                        </text>
                        <text class="font-30" :style="{ color: theme.textTertiary }">
                            {{ $t('forex.lowprice') }}: {{Number(dayData.low || coinInfo.low).toFixed(coinInfo.price_jd)}}
                        </text>
                    </view>
                </view>

                <!-- Chart -->
                <view style="width: 100%; display: block;">
                    <iframe style="width: 100%;height: 60vh;overflow: hidden" :src="Ksrc" frameborder="0"></iframe>
                </view>

                <!-- Trading Form -->
                <view class="relative flex flex-direction">
                    <view class="width-100b margin-0-auto height-76 flex align-center justify-between">
                        <view @click="buyType = 'free'" :class="buyType == 'free' ? 'rightbox' : 'triangle-right'"
                              :style="getTradeButtonStyle('free')">
                            <text :style="{ color: buyType == 'free' ? theme.white : theme.textTertiary }">{{ $t('cycle.sellout') }}</text>
                        </view>
                        <view @click="buyType = 'more'" :class="buyType == 'more' ? 'leftbox' : 'triangle-left'"
                              :style="getTradeButtonStyle('more')">
                            <text :style="{ color: buyType == 'more' ? theme.white : theme.textTertiary }">{{ $t('cycle.buyIn') }}</text>
                        </view>
                    </view>

                    <!-- Market/Limit Toggle -->
                    <view class="margin-t-20">
                        <custom-select id="market-select" v-model="marketType" :options="marketOptions"
                                       display-key="label" value-key="value" @change="handleMarketTypeChange"/>
                    </view>

                    <!-- Price Input -->
                    <view class="margin-t-20">
                        <view
                                class="input-container" :style="getInputContainerStyle()">
                            <text class="font-24 medium-font" :style="{ color: theme.textPrimary }">{{ $t('forex.index20') }}</text>
                            <input class="flex-1 input-field" type="digit"
                                   :disabled="marketType == 'market'" v-model="inputPirce"
                                   :placeholder="marketType == 'market' ? $t('forex.tag') : $t('forex.tag1')"
                                   :style="{ color: theme.textPrimary }"
                                   placeholder-class="input-placeholder"/>
                            <view class="flex font-24 nummedium-font align-center justify-between width-100">
                                <image class="width-35 height-35" src="/static/imgs/logos/usdcoin.png" mode="aspectFit">
                                </image>
                                <text :style="{ color: theme.textPrimary }">{{ $t('currency.usd') }}</text>
                            </view>
                        </view>
                    </view>

                    <!-- Amount Input -->
                    <view class="margin-t-20">
                        <view class="input-container" :style="getInputContainerStyle()">
                            <text class="font-24 medium-font" :style="{ color: theme.textPrimary }">{{ $t('forex.num') }}</text>
                            <input class="flex-1 input-field" type="digit"
                                   v-model="inputHans" :placeholder="$t('forex.placeholder')"
                                   :style="{ color: theme.textPrimary }"
                                   placeholder-class="input-placeholder"/>
                            <text class="font-24 medium-font" :style="{ color: theme.textPrimary }">{{ $t('forex.hands') }}</text>
                        </view>
                    </view>

                    <!-- Times Toggle -->
                    <view class="margin-t-20">
                        <custom-select id="time-select" :placeholder="$t('lockUp.text3')" v-model="selectedTime"
                                       :options="timeOptions"
                                       @change="handleTimeChange"/>
                    </view>

                    <!-- Trade Summary -->
                    <view class="width-100b margin-c-20">
                        <view class="height-42 flex align-center justify-between">
                            <text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">1{{ $t('forex.hands') }}≈</text>
                            <text class="font-24 nummedium-font" :style="{ color: theme.textPrimary }">
                                {{ calculateNormalPairValue() }}
                            </text>
                        </view>
                        <view class="height-42 flex align-center justify-between">
                            <text class="font-24 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.available') }}</text>
                            <text class="font-24 nummedium-font" :style="{ color: theme.textPrimary }">
                                {{ Number(balance_avaible || 0).toFixed(2) }} {{ $t('currency.usd') }}
                            </text>
                        </view>
                    </view>


                    <!-- Submit Button -->
                    <view class="width-100b">
                        <button @tap="tradeView" v-if="buyType == 'more'" class="submit-button more" :style="getButtonStyle('more')">
                            <text :style="{ color: theme.white }">{{ $t('forex.long') }}</text>
                        </button>
                        <button @tap="tradeView" v-if="buyType == 'free'" class="submit-button free" :style="getButtonStyle('free')">
                            <text :style="{ color: theme.white }">{{ $t('forex.short') }}</text>
                        </button>
                    </view>

                </view>

                <!-- Tab Controls -->
                <view
                        class="width-100b margin-t-50 height-72 flex align-center justify-between">
                    <view @tap="handleTabChange(index)" v-for="(item, index) in tabList" :key="index"
                          :class="['flex-1  flex direction-column align-center justify-between tab-item', current1 === index ? 'tab-item--active' : '']"
                          :style="current1 === index ? { '--tab-indicator-color': theme.primary__500 } : {}">
                        <text class="font-28 padding-c-15" :style="{ color: current1 === index ? theme.primary__500 : theme.textSecondary }">{{ item }}</text>
                    </view>
                </view>
            </v-container>

            <!-- Order List -->
            <swiper v-show="topTab == 1" :class="[contractOrderList.length > 2 ? 'swiper' : 'swiper_no']"
                    :current="current1"
                    @change="handleSwiperChange" class="min-height-120">
                <swiper-item v-for="(item, index) in tablist1" :key="index" class="swiper-item">
                    <scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="loadMore">
                        <forex-list-item @revocation="handleRevocation" @closeOut="handleCloseOut"
                                         :price_jd="coinInfo.price_jd" :loading="loading" :currentIndex="current1"
                                         :list="contractOrderList" :nowPrice="coinInfo.close" :color="theme.white"
                                         :fu_color="theme.fu_color">
                        </forex-list-item>
                    </scroll-view>
                </swiper-item>
            </swiper>
            <!-- space -->
            <view class="height-50"/>
        </z-paging>


        <!-- Popups left select coin -->
        <u-popup :show="leftshow" mode="left" :safe-area-inset-bottom="false">
            <view class="coin-selector-popup" :style="{background: theme.backgroundCard}">


                <!-- Header -->
                <view class="popup-header" :style="{background: theme.backgroundCard, borderBottom: `1rpx solid ${theme.neutral__200}`}">
                    <view class="header-content">
                        <text class="popup-title" :style="{ color: theme.textPrimary }">{{ $t('forex.title8') }}</text>
                        <view @tap="leftshow = false" class="close-icon" :style="{background: 'transparent'}">
                            <u-icon
                                name="close"
                                size="30"
                                :color="theme.textTertiary"
                            />
                        </view>
                    </view>
                </view>

                <!-- Coin Selector -->
                <view class="coin-selector-container">
                    <coin-selector
                        :coin-list="midList"
                        @select="handleCoinSelect"
                        :keyidx="String(idxcoin)"
                    />
                </view>
            </view>
        </u-popup>

        <!-- verify -->
        <u-popup style="z-index: 10100;" border-radius="18" mode="center" :show="TSShow">
            <view class="width-600 padding-b-20" :style="{background: theme.backgroundCard}">
                <view
                        class="width-100b height-220 padding-w-30 padding-c-40 flex direction-column align-center justify-between">
                    <image class="width-64 height-64" src="/static/imgs/quantify/tongzhi@2x.png" mode=""></image>
                    <view class="font-28 bold-font text-center padding-w-20" :style="{ color: theme.textPrimary }">{{ shimingTitle }}</view>
                </view>
                <view class="width-100b height-90 flex align-center justify-center">
                    <view @click="router.push('/pages/my/safety/real')" class="qcbtn3" :style="{background: theme.success}">
                        <text :style="{ color: theme.white }">{{ $t('cycle.shiming') }}</text>
                    </view>
                </view>
            </view>
        </u-popup>

        <u-popup :show="showConfirm" mode="center" round="10" @close="showConfirm = false">
            <view class="width-540 padding-40" :style="{background: theme.backgroundCard}">
                <view class="padding-b-30">
                    <!-- Trade Info -->
                    <view class="height-60 flex align-center justify-between">
                        <text class="font-28 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.jiaoyi') }} :</text>
                        <text class="font-28 nummedium-font" :style="{ color: theme.textPrimary }">
                            {{ computeTradeAmount | numFilter }} {{ $t('currency.usd')}}
                        </text>
                    </view>
                    <view class="height-60 flex align-center justify-between">
                        <text class="font-28 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.margin') }} :</text>
                        <text class="font-28 nummedium-font" :style="{ color: theme.textPrimary }">
                            {{ computeMarginAmount | numFilter }} {{ $t('currency.usd') }}
                        </text>
                    </view>
                    <view class="height-60 flex align-center justify-between">
                        <text class="font-28 nummedium-font" :style="{ color: theme.textTertiary }">{{ $t('forex.service') }} :</text>
                        <text class="font-28 nummedium-font" :style="{ color: theme.textPrimary }">
                            {{ computeServiceFee | numFilter }} {{$t('currency.usd') }}
                        </text>
                    </view>
                </view>

                <!-- Action Buttons -->
                <view class="width-466 margin-0-auto flex align-center justify-between">
                    <button @tap="showConfirm = false" class="action-button cancel-btn" :style="{background: theme.neutral__500}">
                        <text :style="{ color: theme.white }">{{$t('forex.cancel')}}</text>
                    </button>
                    <button @tap="handleTradeConfirm" class="action-button confirm-btn" :style="{background: theme.success}">
                        <text :style="{ color: theme.white }">{{$t('forex.confirm')}}</text>
                    </button>
                </view>
            </view>
        </u-popup>
    </view>
</template>

<script>
import _env from '../../env';

const env = _env();

import forexListItem from './components/forex_list_item.vue'
import coinSelector from './components/coin_selector.vue'
import tradeConfirm from './components/trade_confirm.vue'


export default {
    components: {
        forexListItem,
        coinSelector,
        tradeConfirm,
    },

    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            topTab: 1,
            leftshow: false,
            showConfirm: false,
            TSShow: false,
            coinInfo: {},
            dayData: {
                high: 0,
                low: 0
            },
            marketType: 'market',
            marketState: false,
            buyType: 'more',
            inputPirce: '',
            inputHans: '',
            doubleState: false,
            numlist: [],
            contractOrderList: [],
            page: 1,
            keyidx: 1,
            loading: false,
            silentLoading: false, // New
            state: 'more', // New
            lastLoadTime: 0, // New
            lastUnsettledLoadTime: 0, // New
            Ksrc: '',
            current1: 0,
            balance_avaible: 0,
            forex_fee: 0,
            wsConnection: null,
            socket: null, // New
            tradeConfirmData: {
                balance: 0,
                contract_fee: 0,
                promise_price: 0,
                isSpecialPair: false,
            },
            loadingText: '',
            midList: [],
            marketOptions: [],
            selectedTime: 0,
            timeOptions: [],
            shimingTitle: "",
            lastData: "",
            orderTimer: null,
            holdingTimer: null, // New
            unsettledTimer: null, // New
            orderIntervalDelay: 3000,
            minLoadInterval: 1000,
            timer: null,
            idxcoin: 0,
            kkk: '',
        }
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        },
        zhangdie() {
            if (this.dayData.close) {
                let increase = Number(this.dayData.close) - Number(this.dayData.open)
                return Number(increase / Number(this.coinInfo.open) * 100).toFixed(6)
            } else {
                return 0
            }
        },
        isSpecialPair() {
            return ['EURUSD', 'GBPUSD', 'AUDUSD'].includes(this.coinInfo.symbol)
        },

        tabList() {
            return [
                'Currently',
                'Future',
                'Closed',
                'Canceled'
            ]
        },
        tablist1() {
            return [
                this.$t('forexTabs.pending'),
                this.$t('forexTabs.holding'),
                this.$t('forexTabs.closed'),
                this.$t('forexTabs.cancelled')
            ]
        },
        computeTradeAmount() {
            return this.lastData.close * this.inputHans
        },
        computeMarginAmount() {
            if (this.marketType === 'market' && this.lastData.close) {
                return (this.tradeConfirmData.promise_price * this.lastData.close * 100 * this.inputHans) /
                    (this.selectedTime || 1)
            }
            return this.tradeConfirmData.promise_price * this.inputPirce
        },
        computeServiceFee() {
            if (this.marketType === 'market' && this.lastData.close) {
                return (this.tradeConfirmData.contract_fee * this.tradeConfirmData.promise_price *
                    this.lastData.close * 100 * this.inputHans) / (this.selectedTime || 1)
            }
            return this.tradeConfirmData.contract_fee * this.tradeConfirmData.promise_price * this.inputPirce
        }
    },

    watch: {
        current1: {
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.refreshList()
                    if (newVal === 1) {
                        this.startHoldingInterval()
                    } else {
                        this.stopHoldingInterval()
                    }
                }
            },
            immediate: true
        }
    },

    onLoad(e) {
        this.idxcoin = e.idx ?? 0
        if (e.symbol) {
            this.coinInfo.symbol = e.symbol
        } else {
            this.coinInfo.symbol = getApp().globalData.symbol
        }

        this.getForexData()
        this.marketOptions = [
            {label: this.$t('forex.Market'), value: 'market'},
            {label: this.$t('forex.LIMIT'), value: 'limit'}
        ]

    },

    onShow() {
        this.initWebSocket()
        if (this.current1 === 1) {
            this.startHoldingInterval()
        }
    },

    onHide() {
        this.cleanup()
        clearTimeout(this.timer)
    },

    onUnload() {
        this.cleanup()
    },

    methods: {
        async initData() {
            try {
                uni.showLoading({title: this.$t('forex.loading')})
            } catch (error) {
                this.handleError(error)
            } finally {
                uni.hideLoading()
            }
        },

        // Optimized orders loading
        async loadOrders() {
            if (this.loading || (this.state === 'over' && this.page > 1)) return

            try {
                this.loading = true
                this.state = 'loading'
                this.lastLoadTime = Date.now()

                const res = await this.post('/forex/get_contract', {
                    page: this.page,
                    symbol: this.coinInfo.symbol,
                    status: this.current1
                })

                if (res.code === 1) {
                    if (this.page === 1) {
                        this.contractOrderList = res.data.data
                    } else {
                        this.contractOrderList = [...this.contractOrderList, ...res.data.data]
                    }

                    this.state = this.page >= res.data.last_page ? 'over' : 'more'
                }
            } catch (error) {
                console.error('Load orders error:', error)
                this.handleError(error)
                this.state = 'more'
            } finally {
                this.loading = false
            }
        },

        // Position management
        async getHoldingOrders(isSilent = false) {
            const now = Date.now()
            if (!isSilent && (now - this.lastUnsettledLoadTime) < this.minLoadInterval) return

            try {
                if (!isSilent) {
                    this.loading = true
                } else {
                    if (this.silentLoading) return
                    this.silentLoading = true
                }

                this.lastUnsettledLoadTime = now

                const res = await this.post('/forex/get_contract', {
                    page: 1,
                    size: this.page * 10,
                    symbol: this.coinInfo.symbol,
                    status: this.current1
                })

                if (res.code === 1) {
                    if (res.data?.data) {
                        this.contractOrderList = res.data.data
                    }
                }
            } catch (error) {
                console.error('Get holding orders error:', error)
            } finally {
                if (!isSilent) {
                    this.loading = false
                } else {
                    this.silentLoading = false
                }
            }
        },

        startHoldingInterval() {
            this.stopHoldingInterval()
            this.getHoldingOrders(false) // Initial load

            this.holdingTimer = setInterval(() => {
                if (!this.silentLoading) {
                    this.getHoldingOrders(true)
                }
            }, this.orderIntervalDelay)
            // Register with global cleanup
            getApp().globalData.registerInterval(this.holdingTimer)
        },

        stopHoldingInterval() {
            if (this.holdingTimer) {
                clearInterval(this.holdingTimer)
                getApp().globalData.unregisterInterval(this.holdingTimer)
                this.holdingTimer = null
            }
        },

        refreshList() {
            if (this.loading || this.silentLoading) return

            this.page = 1
            this.contractOrderList = []
            this.state = 'more'

            if (this.current1 === 1) {
                this.startHoldingInterval()
            } else {
                this.stopHoldingInterval()
                this.loadOrders()
            }
        },

        // Load more for pagination
        loadMore() {
            if (this.state === 'more' && !this.loading) {
                this.page++
                this.loadOrders()
            }
        },

        // Pull to refresh
        onRefresh() {
            this.getForexData()
            this.initData()
            if (this.loading || this.silentLoading) {
                this.$refs.paging.complete()
                return
            }

            if (this.topTab == 1) {
                this.refreshList()
            } else if (this.topTab == 2) {
                this.getMore()
            }

            setTimeout(() => {
                this.$refs.paging.complete()
            }, 3000)
        },

        // UI handlers
        handleTabChange(index) {
            if (this.current1 === index) return
            this.current1 = index
        },

        handleSwiperChange(e) {
            this.current1 = e.detail.current
        },

        // Error handling
        handleError(error) {
            uni.showToast({
                title: error.message || this.$t('forex.error'),
                icon: 'none'
            })
        },

        // Cleanup
        cleanup() {
            this.stopHoldingInterval()
            if (this.orderTimer) {
                clearInterval(this.orderTimer)
                getApp().globalData.unregisterInterval(this.orderTimer)
                this.orderTimer = null
            }
            if (this.unsettledTimer) {
                clearInterval(this.unsettledTimer)
                getApp().globalData.unregisterInterval(this.unsettledTimer)
                this.unsettledTimer = null
            }
            this.closeWebSocket()
            this.loading = false
            this.silentLoading = false
        },
        // WebSocket initialization
        initWebSocket() {
            if (this.wsConnection) {
                this.wsConnection.close()
            }

            this.wsConnection = uni.connectSocket({
                url: env.VUE_APP_WS_FOREX_URL,
                success: () => {
                    console.log('WebSocket connected')
                }
            })

            this.wsConnection.onOpen(() => {
                this.subscribeToPrice()
            })

            this.wsConnection.onClose(() => {
                console.log('WebSocket closed')
                setTimeout(() => {
                    this.initWebSocket()
                }, 3000)
            })

            this.wsConnection.onError((error) => {
                console.error('WebSocket error:', error)
                this.wsConnection = null
            })

            this.wsConnection.onMessage((res) => {
                try {
                    const data = JSON.parse(res.data)
                    if (data.symbol === this.coinInfo.symbol) {
                        this.dayData = data.current
                        if (this.current1 === 1) {
                            this.getHoldingOrders(true)
                        }
                    }
                } catch (error) {
                    console.error('Message parsing error:', error)
                }
            })
        },

        // Price subscription
        subscribeToPrice() {
            if (!this.wsConnection) return

            this.wsConnection.send({
                data: JSON.stringify({
                    symbol: this.coinInfo.symbol,
                    type: "kline"
                })
            })
        },

        closeWebSocket() {
            if (this.wsConnection) {
                this.wsConnection.close()
                this.wsConnection = null
            }
        },

        // Trade validation and execution
        validateTrade() {
            if (this.marketType === 'limit' && !this.inputPirce) {
                uni.showToast({
                    title: this.$t('forex.tag1'),
                    icon: 'none'
                })
                return false
            }

            if (!this.inputHans) {
                uni.showToast({
                    title: this.$t('forex.numInput'),
                    icon: 'none'
                })
                return false
            }

            return true
        },

        async tradeView() {
            if (!this.validateTrade()) return
            this.showConfirm = true
        },

        async handleTradeConfirm() {
            if (!this.validateTrade()) return

            try {
                uni.showLoading({
                    title: this.$t('forex.submitting')
                })

                const newData = {
                    cart: this.marketType,
                    type: this.buyType,
                    num: this.inputHans,
                    price: this.marketType == 'limit' ? this.inputPirce : this.lastData.close,
                    coin_id: this.coinInfo.id,
                    multiple: this.selectedTime
                }

                const res = await this.post('/forex/buy_contract', newData)
                this.showConfirm = false

                if (res.code === 1) {
                    this.tos(res.msg)
                    this.resetTradeForm()
                    this.refreshList()
                } else {
                    if (res.data && res.data.jump == 1) {
                        this.shimingTitle = res.msg
                        this.TSShow = true
                    }
                }
            } catch (error) {
                console.error(error.message)
                this.handleError(error)
            } finally {
                uni.hideLoading()
                this.TSShow = false
            }
        },

        // Order operations
        async handleCloseOut(id) {
            try {
                const res = await this.post('/forex/pingcang', {
                    contract_id: id
                }, true)

                if (res.code === 1) {
                    uni.showToast({
                        title: res.msg,
                        icon: 'success'
                    })
                    this.refreshList()
                }
            } catch (error) {
                this.handleError(error)
            }
        },

        async handleRevocation(id) {
            try {
                const res = await this.post('/forex/cancel_cang', {
                    contract_id: id
                }, true)

                if (res.code === 1) {
                    uni.showToast({
                        title: res.msg,
                        icon: 'success'
                    })
                    this.refreshList()
                }
            } catch (error) {
                this.handleError(error)
            }
        },

        // Forex data handling
        async getForexData() {

            try {
                const res = await this.post('/forex/getForex')

                if (res.code === 1) {
                    this.handleForexData(res.data)
                }
            } catch (error) {
                this.handleError(error)
            }
        },

        handleForexData(data) {
            if (!data?.coin?.length) return

            this.midList = data.coin
            this.coinInfo = data.coin[this.idxcoin]
            if (data.setting) {
                this.balance_avaible = data.setting.balance
                this.timeOptions = data.setting.multiple
                this.tradeConfirmData = data.setting
            }
            if (getApp().globalData.symbol == '') {
                getApp().globalData.symbol = this.coinInfo.symbol
            }
            if (this.coinInfo.close) {
                this.lastData = {
                    open: Number(this.coinInfo.open),
                    close: Number(this.coinInfo.close)
                }
            }

            this.updateKlineUrl()
        },

        updateKlineUrl() {
            this.Ksrc = `${env.VUE_APP_FOREX_KLINE_URL}/h5.html?symbol=${this.coinInfo.symbol}`
        },

        // Form handling
        resetTradeForm() {
            this.inputHans = ''
            this.inputPirce = ''
        },

        resetTradeData() {
            this.inputHans = ''
            this.inputPirce = ''
            this.selectedTime = 0
            this.tradeConfirmData = {
                balance: 0,
                contract_fee: 0,
                promise_price: 0,
                isSpecialPair: false
            }
        },

        // UI handlers
        handleCoinSelect(index) {
            if (!this.midList[index]) return

            this.idxcoin = index
            this.leftshow = false
            this.coinInfo = this.midList[index]
            this.updateKlineUrl()
            this.resetTradeData()

            // Reset and restart intervals
            this.stopHoldingInterval()
            if (this.current1 === 1) {
                this.startHoldingInterval()
            }

            // Update URL without refreshing
            history.replaceState(
                {},
                '',
                `#/pages/forex/forex?symbol=${this.coinInfo.symbol}&idx=${index}`
            );

            getApp().globalData.symbol = this.coinInfo.symbol
            if (this.lastData.close) {
                this.lastData.close = Number(this.coinInfo.close)
            }

            this.subscribeToPrice()
            this.refreshList()
        },

        handleMarketTypeChange(option) {
            this.marketType = option.value
            if (option.value === 'market') {
                this.inputPirce = ''
            }
        },

        handleTimeChange(option) {
            this.selectedTime = option.value
        },

        // Value calculations
        calculateSpecialPairValue() {
            const price = this.dayData.close ? this.dayData.close : this.coinInfo.close || 0
            const baseValue = Number(price).toFixed(4)
            const multipliedValue = Number(price * 1000).toFixed(4)
            return `( ${baseValue}*1000 ) = ${multipliedValue} ${this.$t('currency.usd')}`
        },

        calculateNormalPairValue() {
            const price = this.dayData.close ? this.dayData.close : this.coinInfo.close || 0
            return `${Number(price).toFixed(4)} ${this.$t('currency.usd')}`
        },
        getInputContainerStyle() {
            return {
                background: this.theme.backgroundCard,
                border: `2rpx solid transparent`
            }
        },
        getButtonStyle(type) {
            if (type === 'more') {
                return {
                    background: `linear-gradient(90deg, ${this.theme.success} 0%, ${this.theme.success__500} 100%)`
                }
            } else {
                return {
                    background: `linear-gradient(90deg, ${this.theme.primary} 0%, ${this.theme.secondary} 100%)`
                }
            }
        },
        getTradeButtonStyle(type) {
            if (type === 'more') {
                if (this.buyType === 'more') {
                    return {
                        backgroundImage: `url('/static/imgs/menu/buy_active.png')`
                    }
                } else {
                    return {
                        backgroundImage: `url('/static/imgs/menu/buy.png')`
                    }
                }
            } else {
                if (this.buyType === 'free') {
                    return {
                        backgroundImage: `url('/static/imgs/menu/sell_active.png')`
                    }
                } else {
                    return {
                        backgroundImage: `url('/static/imgs/menu/sell.png')`
                    }
                }
            }
        }

    }
}
</script>

<style lang="scss" scoped>
.input-placeholder {
  color: inherit;
  opacity: 0.6;
}


// Swiper styles
.swiper {
  /* #ifndef H5 */
  height: calc(100vh - 676rpx - var(--status-bar-height));
  /* #endif */

  /* #ifdef H5 */
  height: calc(100vh - 676rpx - 104rpx);
  /* #endif */
}

.swiper_no {
  /* #ifndef H5 */
  height: calc(100vh - 862rpx - var(--status-bar-height));
  /* #endif */

  /* #ifdef H5 */
  height: calc(100vh - 862rpx - 104rpx);
  /* #endif */
}

// Trade buttons
.leftbox {
  width: 50%;
  height: 66rpx;
  background-size: 100%;
  background-repeat: round;
  font-size: 14px;
  line-height: 33px;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.leftbox_white {
  width: 50%;
  height: 66rpx;
  background-size: 100%;
  background-repeat: round;
  font-size: 14px;
  line-height: 33px;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.triangle-left {
  width: 50%;
  height: 66rpx;
  border-radius: 8rpx 0rpx 0rpx 8rpx;
  background-size: 100%;
  background-repeat: round;
  font-size: 28rpx;
  line-height: 66rpx;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rightbox {
  width: 50%;
  height: 66rpx;
  background-size: 100%;
  background-repeat: round;
  font-size: 14px;
  line-height: 33px;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.triangle-right {
  width: 50%;
  height: 66rpx;
  border-radius: 0rpx 8rpx 8rpx 0rpx;
  background-size: 100%;
  background-repeat: round;
  font-size: 28rpx;
  line-height: 66rpx;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Misc UI elements
.maskBox {
  width: 100vh;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 10000;
}

.xialabox {
  width: 100%;
  border: 1px solid rgba(171, 171, 171, 0.2);
  border-radius: 4rpx;
  overflow: hidden;
  transition: 0.3s;
  position: absolute;
  top: 0;
  z-index: 10100;
}

.xialabox1 {
  width: 100%;
  border: 1px solid rgba(171, 171, 171, 0.2);
  border-radius: 4rpx;
  overflow: hidden;
  transition: 0.3s;
  position: absolute;
  top: 0;
  z-index: 10100;
}

.loginBtn {
  width: 100%;
  height: 74rpx;
  border-radius: 4rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heng {
  width: 48rpx;
  height: 4rpx;
  margin: 10rpx auto;
}

.action-button {
  width: 220rpx;
  height: 70rpx;
  border-radius: 10rpx;
  font-size: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qcbtn3 {
  width: 300rpx;
  height: 70rpx;
  border-radius: 20rpx;
  font-size: 28rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 20rpx;
  gap: 20rpx;

  .input-field {
    height: 100%;

  }
}

.submit-button {
  width: 100%;
  height: 80rpx;
  border: none;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* Tab active styles */
.tab-item {
  position: relative;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
}
.tab-item:active {
  opacity: 0.8;
}
.tab-item--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  border-radius: 6rpx;
  background: var(--tab-indicator-color);
}

/* Coin Selector Popup Styles */
.coin-selector-popup {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.popup-header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 30rpx;
  min-height: 100rpx;
}

.popup-title {
  font-size: 32rpx;
  font-weight: bold;
}

.close-icon {
  padding: 8rpx;
  border-radius: 8rpx;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.8;
  }
}

.coin-selector-container {
  flex: 1;
  overflow: hidden;
}
</style>
