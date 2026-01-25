<template>
    <view class="min-height-screen">
        <z-paging ref="paging" refresher-only @onRefresh="onRefresh" :style="themeStyles">
            <!-- Custom refresher -->
            <custom-refresher slot="refresher" slot-scope="{refresherStatus}" :status="refresherStatus">
            </custom-refresher>


            <!-- Header with coin info -->
            <view slot="top" class="width-100b flex align-center justify-between padding-w-30"
                  :style="{height: `calc(${statusBar}px + 100rpx)`,paddingTop:`${statusBar}px`,background:theme.bg2}">
                <view class="flex align-center justify-between gap-20 width-100b">
                    <i @tap="router.goBack()" class="cuIcon-back font-35"></i>
                    <view class="flex align-center width-100b gap-20">
                        <view @tap="leftshow = true" class="width-100b flex align-center gap-10">
                            <image class="width-48 height-48" :src="theme.imgs+'/left6@2x.png'" mode=""></image>
                            <image class="width-48 height-48 radiu-50" :src="coinInfo.logo_image" mode=""></image>
                            <text class="font-36 numbold-font margin-w-10">{{coinInfo.name}}</text>
                        </view>
                        <view @click="router.push('/pages/forex/forex')"
                              class="padding-c-10 padding-w-20 flex align-center radiu-10 border-1-009808">
                            <text class="font-20">Forex</text>
                            <i class="cuIcon-playfill"></i>
                        </view>
                        <view @click="router.push('/pages/forex/forexSuperFutureRecord?symbol='+coinInfo.symbol)" class="">
                            <u-icon name="file-text" color="#BDC3C7" size="40"></u-icon>
                        </view>
                    </view>
                </view>
            </view>

            <view class="relative">
                <!-- Price info -->
                <view class="padding-c-30 padding-w-32 flex align-center justify-between">
                    <view class="flex direction-column align-start justify-between">
                        <text :class="zhangdie >= 0 ? 'color-00C481' : 'color-FF4040'" class="font-50 numbold-font">
                            {{ Number(dayData.close ? dayData.close : coinInfo.close || 0).toFixed(2) }}
                        </text>
                        <text :class="zhangdie >= 0 ? 'color-00C481' : 'color-FF4040'" class="font-32 nummedium-font">
                            {{ zhangdie }}%
                        </text>
                    </view>
                    <view class="flex direction-column align-start">
                        <text class="font-30">
                            {{ i18n.forex.highprice }}: {{ Number(dayData.high || coinInfo.high).toFixed(coinInfo.price_jd) }}
                        </text>
                        <text class="font-30">
                            {{ i18n.forex.lowprice }}: {{ Number(dayData.low || coinInfo.low).toFixed(coinInfo.price_jd) }}
                        </text>
                    </view>
                </view>

                <!-- Chart -->
                <view class="width-100b">
                    <iframe style="width: 750rpx;height: 55vh;overflow: hidden" :src="Ksrc" frameborder="0"></iframe>
                </view>

                <!-- Tab Controls -->
                <view class="width-100b margin-t-50 height-72 padding-w-40 flex align-center justify-between">
                    <view @tap="handleTabChange(index)" v-for="(item,index) in tabList" :key="index"
                          class="flex-1 height-46 flex direction-column align-center justify-between">
                        <text :class="current1==index?'bold-font color-00C481':'color-D1D3D8 medium-font'"
                              class="font-28">{{item}}</text>
                        <view :style="current1==index?'':'visibility: hidden;'" class="heng"></view>
                    </view>
                </view>
            </view>

            <!-- Order List -->
            <swiper :class="[contractOrderList.length>2?'swiper':'swiper_no']"
                    :current="current1" @change="handleSwiperChange" class="min-height-120">
                <swiper-item v-for="(item,index) in tablist1" :key="index" class="swiper-item">
                    <scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="loadMore">
                        <secondListItem @timeOut="handleCloseOut" :currentIndex="current1" :loading="loading"
                                        :list="contractOrderList" :nowPrice="lastData.close" :color="theme.text"
                                        :background="theme.bg"></secondListItem>
                    </scroll-view>
                </swiper-item>
            </swiper>
            <!-- space -->
            <view class="height-50" />
        </z-paging>


        <!-- Popups -->
        <u-popup v-model="leftshow" mode="left" @close="leftshow = false" closeable>
            <coin-selector
                    :coin-list="midList"
                    @select="handleCoinSelect"
                    :theme="theme"
            />
        </u-popup>
        <!-- #ifdef APP-PLUS -->
        <view class="height-140 fixed width-100b flex align-center justify-between padding-w-32" style="bottom: 0;z-index: 999;gap: 12px;background-color: black;"
              :style="'background: '+theme.bg+';color: '+theme.text">
            <view @click="riseTimeType=true, riseNumber=''"
                  class="flex-1 height-100 flex align-center justify-between radiu-8">
                <view class="flex-1 flex direction-column align-center justify-center">
                    <text class="font-24 ">{{i18n.cycle.num}}</text>
                    <text class="font-24 ">{{riseNumber}}</text>
                </view>
                <view class="flex-1 flex direction-column align-center justify-center">
                    <text class="font-24 ">{{i18n.fastBuy.text12}}</text>
                    <text class="font-24 ">{{riseTime}}s</text>
                </view>
                <view class="flex-1 flex direction-column align-center justify-center">
                    <text class="font-24 ">{{i18n.cycle.rate}}</text>
                    <text class="font-24 ">{{riseWinpl}} %</text>
                </view>
                <i class="cuIcon-unfold font-28 color-1881D2"></i>
            </view>
            <view class="flex align-center justify-end gap-10">
                <view @click="buyRise('rise')"
                      class="width-164 height-80 line-height-80 bj-12B886 radiu-8 text-center">
                    <text class="font-30 color-white">{{i18n.cycle.up}}</text>
                </view>
                <view @click="buyRise('fall')"
                      class="width-164 height-80 line-height-80 bj-FF4040 radiu-8 text-center">
                    <text class="font-30 color-white">{{i18n.cycle.down}}</text>
                </view>
            </view>
        </view>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <view class="height-140 fixed width-100b flex align-center justify-between gap-20 padding-w-30 bottom-0"
              :style="'background: '+theme.bg+';color: '+theme.text">
            <view @click="riseTimeType=true, riseNumber=''"
                  class="flex-1 height-100 flex align-center justify-between radiu-8">
                <view class="flex-1 flex direction-column align-center justify-center">
                    <text class="font-24 ">{{i18n.cycle.num}}</text>
                    <text class="font-24 ">{{riseNumber}}</text>
                </view>
                <view class="flex-1 flex direction-column align-center justify-center">
                    <text class="font-24 ">{{i18n.fastBuy.text12}}</text>
                    <text class="font-24 ">{{riseTime}}s</text>
                </view>
                <view class="flex-1 flex direction-column align-center justify-center">
                    <text class="font-24 ">{{i18n.cycle.rate}}</text>
                    <text class="font-24 ">{{riseWinpl}} %</text>
                </view>
                <i class="cuIcon-unfold font-28 color-1881D2"></i>
            </view>
            <view class="flex align-center justify-end gap-10">
                <view @click="buyRise('rise')"
                      class="width-164 height-80 line-height-80 bj-00C481 radiu-8 text-center">
                    <text class="font-30 color-white">{{i18n.cycle.up}}</text>
                </view>
                <view @click="buyRise('fall')"
                      class="width-164 height-80 line-height-80 bj-FF4040 radiu-8 text-center">
                    <text class="font-30 color-white">{{i18n.cycle.down}}</text>
                </view>
            </view>
        </view>
        <!-- #endif -->

        <u-popup style="z-index: 999;" mode="bottom" v-model="riseTimeType">
            <view class="padding-w-30" :style="'background: '+theme.bg+';color: '+theme.text">
                <view class="height-70 line-height-70">
                    <text class="font-28">{{i18n.cycle.moshi}}</text>
                </view>
                <view class="height-79 flex align-center">
                    <view class="xuanzhebox">
                        <text>USDT</text>
                        <image class="width-60 height-60 absolute right-0" src="/static/imgs/new/gou1.png"
                               mode=""></image>
                    </view>
                </view>
                <view class="height-70 line-height-70">
                    <text class="font-28 ">{{i18n.cycle.open}}</text>
                </view>
                <view class="flex flex-wrap gap-10">
                    <view @click="riseNumber=item" class="xuanzhebox"
                          v-for="(item,index) in numlist" :key="index">
                        <text>{{item}}</text>
                        <image v-if="riseNumber==item" class="width-60 height-60 absolute right-0"
                               src="/static/imgs/new/gou1.png" mode=""></image>
                    </view>
                </view>
                <view class="flex align-center height-80 line-height-80 border-1-009808 margin-t-30">
                    <input class="height-100b flex-1 padding-w-20" type="number" v-model="riseNumber"
                           :placeholder="i18n.cycle.openInput" />
                </view>
                <view class="height-70 line-height-70">
                    <text class="font-28 ">{{i18n.cycle.time}}</text>
                </view>
                <view class="flex flex-wrap gap-10">
                    <view @click="selectTime(riseTime = item)" class="xuanzhebox"
                          v-for="(item,index) in coinInfo.trade_time" :key="index">
                        <text>{{item}} s</text>
                        <image v-if="riseTime==item" class="width-60 height-60 absolute right-0"
                               src="/static/imgs/new/gou1.png" mode=""></image>
                    </view>
                </view>

                <view class="height-80 flex align-center justify-between">
                    <text class="font-28 nummedium-font color-F2F5FF">{{i18n.cycle.available}} ：<span
                            class="color-12B886">{{Number(count_xh_usdt||0).toFixed(4)}} USDT</span></text>
                    <text class="font-28 nummedium-font color-F2F5FF">{{i18n.cycle.rate}} ：<span
                            class="color-12B886">{{riseWinpl}} %</span></text>
                </view>

                <view class="height-140 flex align-center justify-between">
                    <view @click="buyRise('rise')" class="loginBtn bj-00C481">
                        <text class="font-36 color-white">{{i18n.cycle.up}}</text>
                    </view>
                    <view @click="buyRise('fall')" class="loginBtn bj-FF4040">
                        <text class="font-36 color-white">{{i18n.cycle.down}}</text>
                    </view>
                </view>
            </view>
        </u-popup>

        <!-- verify -->
        <u-popup style="z-index: 10100;" border-radius="18" mode="center" v-model="TSShow">
            <view class="width-600 padding-b-20"
                  :style="'background-color: '+theme.bg+';color: '+theme.text">
                <view class="width-100b height-220 padding-w-30 padding-c-40 flex direction-column align-center justify-between">
                    <image class="width-64 height-64" src="/static/imgs/quantify/tongzhi@2x.png" mode=""></image>
                    <view class="font-28 bold-font text-center padding-w-20">{{shimingTitle}}</view>
                </view>
                <view class="width-100b height-90 flex align-center justify-center">
                    <view @click="router.push('/pages/my/safety/real')" class="qcbtn3">{{i18n.cycle.shiming}}</view>
                </view>
            </view>
        </u-popup>

    </view>
</template>

<script>
import _env from '../../env';
const env = _env();

import coinSelector from './components/coin_selector.vue'
import secondListItem from "./components/second_list_item.vue";


export default {
    components: {
        secondListItem,
        coinSelector,
    },

    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            leftshow: false,
            TSShow: false,
            coinInfo: {},
            dayData: {
                high: 0,
                low: 0
            },
            contractOrderList: [],
            page: 1,
            loading: false,
            silentLoading: false,
            state: 'more',
            Ksrc: '',
            tablist1: ['交易中', '已平仓'],
            current1: 0,
            forex_fee: 0,
            wsConnection: null,
            socket: null,
            midList: [],
            shimingTitle: "",
            lastData: "",
            timer: null,
            riseNumber: 100,
            riseTime: 0,
            riseTimeType: false,
            winpl: 0,
            riseWinpl: '',
            numlist: [],
            count_xh_usdt: 0,
            flag: true,
            tradeLimits: {},
        }
    },

    computed: {
        i18n() {
            return this.$t('message')
        },
        zhangdie() {
            if (!this.coinInfo.close || !this.coinInfo.open) return 0
            const increase = Number(this.coinInfo.close) - Number(this.coinInfo.open)
            return Number(increase / Number(this.coinInfo.open) * 100).toFixed(6)
        },
        isSpecialPair() {
            return ['EURUSD', 'GBPUSD', 'AUDUSD'].includes(this.coinInfo.symbol)
        },
        theme() {
            return this.$store.getters.theme
        },
        themeStyles() {
            return {
                'background-color': this.theme.bg,
                'color': this.theme.text
            }
        },
        tabList(){
            return this.i18n.forex.tablist2
        },
    },

    watch: {
        current1: {
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.refreshList()
                }
            },
            immediate: true
        }
    },

    onLoad(e) {
        if (e.symbol){
            this.coinInfo.symbol = e.symbol
        } else {
            this.coinInfo.symbol = getApp().globalData.symbol
        }
        this.getForexData()
    },

    onShow() {
        this.initWebSocket()
    },

    onHide() {
        this.cleanup()
    },

    onUnload() {
        this.cleanup()
    },

    methods: {
        handleCloseOut(){
            this.current1 = 1
            this.refreshList()
        },
        async initData() {
            try {
                uni.showLoading({ title: this.i18n.forex.loading })
                await this.getForexData()
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

                // Use different endpoints based on current1 value
                const endpoint = this.current1 === 0 ? '/forexcycle/get_order' : '/forexcycle/get_all_order'

                // Different parameters based on current1
                const params = this.current1 === 0
                    ? { symbol: this.coinInfo.symbol }
                    : {
                        page: this.page,
                        symbol: this.coinInfo.symbol
                    }

                const res = await this.post(endpoint, params)

                if (res.code === 1) {
                    // Handle different response structures
                    const orderData = this.current1 === 0 ? res.data : res.data.data

                    if (this.page === 1) {
                        this.contractOrderList = orderData
                    } else {
                        this.contractOrderList = [...this.contractOrderList, ...orderData]
                    }

                    // Only check last_page for get_all_order endpoint
                    this.state = this.current1 === 0 ? 'over' :
                        (this.page >= res.data.last_page ? 'over' : 'more')
                }
            } catch (error) {
                console.error('Load orders error:', error)
                this.handleError(error)
                this.state = 'more'
            } finally {
                this.loading = false
            }
        },

        refreshList() {
            if (this.loading || this.silentLoading) return

            this.page = 1
            this.contractOrderList = []
            this.state = 'more'
            this.loadOrders()
        },

        loadMore() {
            if (this.state === 'more' && !this.loading) {
                this.page++
                this.loadOrders()
            }
        },

        onRefresh() {
            this.getForexData()
            this.initData()
            if (this.loading || this.silentLoading) {
                this.$refs.paging.complete()
                return
            }

            setTimeout(() => {
                this.$refs.paging.complete()
            }, 3000)
        },

        handleTabChange(index) {
            this.current1 = index
        },

        handleSwiperChange(e) {
            this.current1 = e.detail.current
        },

        handleError(error) {
            uni.showToast({
                title: error.message || this.i18n.forex.error,
                icon: 'none'
            })
        },

        cleanup() {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }
            this.closeWebSocket()
            this.loading = false
            this.silentLoading = false
        },
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
                this.handleWebSocketMessage(res)
            })
        },

        async getForexData() {
            try {
                uni.showLoading({ title: this.i18n.forex.loading })
                const res = await this.post('/forexcycle/get_cycle_coin')

                if (res.code === 1 && Array.isArray(res.data)) {
                    if (res.data.length === 0) {
                        throw new Error(this.i18n.forex.noCoinData || 'No coin data available')
                    }

                    this.handleForexData(res.data)
                    this.initWebSocket()
                    this.refreshList()
                } else {
                    throw new Error(res.msg || this.i18n.forex.error)
                }
            } catch (error) {
                console.error('Forex data fetch error:', error)
                this.handleError(error)
            } finally {
                uni.hideLoading()
            }
        },

        handleWebSocketMessage(res) {
            try {
                const data = JSON.parse(res.data)
                if (data.symbol === this.coinInfo.symbol) {
                    this.dayData = {
                        ...data.current,
                        high: Number(data.current.high || 0),
                        low: Number(data.current.low || 0),
                        open: Number(data.current.open || 0),
                        close: Number(data.current.close || 0)
                    }
                    // Check if order status changed
                    if (data.order_status === 'finished') {
                        this.current1 = 1  // Switch to active orders tab
                        this.refreshList()
                    }
                }
            } catch (error) {
                console.error('Message parsing error:', error)
            }
        },

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

        handleForexData(data) {
            this.midList = data.map(coin => ({
                ...coin,
                high: Number(coin.high || 0),
                low: Number(coin.low || 0),
                open: Number(coin.open || 0),
                close: Number(coin.close || 0),
                increase: Number(coin.increase || 0),
                exchange_rate: Number(coin.exchange_rate || 0),
                volume: Number(coin.volume || 0)
            }))

            const savedSymbol = getApp().globalData.symbol
            this.coinInfo = this.midList.find(coin => coin.symbol === savedSymbol) || this.midList[0]
            this.count_xh_usdt = this.coinInfo.balance

            if (!savedSymbol) {
                getApp().globalData.symbol = this.coinInfo.symbol
            }

            if (this.coinInfo) {
                if (Array.isArray(this.coinInfo.trade_time) && this.coinInfo.trade_time.length > 0) {
                    this.riseTime = this.coinInfo.trade_time[0]
                }

                if (Array.isArray(this.coinInfo.num_list)) {
                    this.numlist = this.coinInfo.num_list
                }

                this.updateProfitLoss()

                this.lastData = {
                    open: Number(this.coinInfo.open),
                    close: Number(this.coinInfo.close)
                }

                if (this.coinInfo.limit_num) {
                    const [min, max] = this.coinInfo.limit_num.split('-').map(Number)
                    this.tradeLimits = { min, max }
                }
            }

            this.updateKlineUrl()
        },

        updateKlineUrl() {
            this.Ksrc = `${env.VUE_APP_FOREX_KLINE_URL}/?symbol=${this.coinInfo.symbol}&theme=${uni.getStorageSync("theme")}`
        },

        updateProfitLoss() {
            if (this.coinInfo && this.riseTime) {
                if (this.coinInfo.cyclejson && this.coinInfo.cyclejson[this.riseTime]) {
                    this.riseWinpl = this.coinInfo.cyclejson[this.riseTime]
                }

                if (this.coinInfo.lostjson && this.coinInfo.lostjson[this.riseTime]) {
                    this.winpl = this.coinInfo.lostjson[this.riseTime]
                }
            }
        },

        selectTime(time) {
            this.riseTime = time
            this.updateProfitLoss()
        },

        buyRise(type) {
            if (!this.flag) return
            if (this.riseNumber == '') {
                this.tos(this.i18n.cycle.openInput)
                return
            }
            if (this.riseTime == 0) {
                this.tos(this.i18n.cycle.timeclick)
                return
            }
            this.flag = false
            this.post('/forexcycle/start_order', {
                position: type,
                symbol: this.coinInfo.symbol,
                cycle: this.riseTime,
                num: this.riseNumber,
            }, true).then(res => {
                this.flag = true
                this.riseTimeType = false
                if (res.code == 1) {
                    this.tos(res.msg)
                    this.getForexData()
                    this.resetData()
                    if (this.current1 == 0) {
                        this.refreshList()
                    } else {
                        this.current1 = 0
                    }
                } else {
                    this.tos(res.msg)
                    if (res.data.jump == 1) {
                        this.shimingTitle = res.msg
                        this.TSShow = true
                    }
                }
            })
        },
        resetData() {
            this.riseNumber = ''
            this.riseTime = 0
            this.riseTimeType = false
        },

        handleCoinSelect(index) {
            if (!this.midList[index]) return

            this.leftshow = false
            this.coinInfo = this.midList[index]

            getApp().globalData.symbol = this.coinInfo.symbol

            if (this.coinInfo) {
                if (Array.isArray(this.coinInfo.trade_time) && this.coinInfo.trade_time.length > 0) {
                    this.riseTime = this.coinInfo.trade_time[0]
                }

                if (Array.isArray(this.coinInfo.num_list)) {
                    this.numlist = this.coinInfo.num_list
                }

                this.updateProfitLoss()

                this.lastData = {
                    open: Number(this.coinInfo.open),
                    close: Number(this.coinInfo.close)
                }

                if (this.coinInfo.limit_num) {
                    const [min, max] = this.coinInfo.limit_num.split('-').map(Number)
                    this.tradeLimits = { min, max }
                }
            }

            this.updateKlineUrl()
            this.initWebSocket()
            this.refreshList()
        },
    }
}
</script>

<style lang="scss">
.limitBox_up {
  height: 46rpx;
  padding: 0 14rpx;
  background: rgba(6, 195, 141, 0.2);
  border-radius: 4rpx;
  font-size: 28rpx;
  line-height: 46rpx;
  color: #06C38D;
}

.limitBox_down {
  height: 46rpx;
  padding: 0 14rpx;
  background: rgba(220, 75, 67, 0.2);
  border-radius: 4rpx;
  font-size: 28rpx;
  line-height: 46rpx;
  color: #DC4B43;
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

.loginBtn {
  width: 100%;
  height: 74rpx;
  box-shadow: 0rpx 6rpx 10rpx rgba(16, 194, 168, 0.18);
  border-radius: 4rpx;
  font-size: 32rpx;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heng {
  width: 48rpx;
  height: 4rpx;
  margin: 10rpx auto;
  background: linear-gradient(180deg, #00A609 0%, #1edf29 100%);
}

.cancel-btn {
  background-color: #808080;
}

.confirm-btn {
  background-color: #00A609;
}
.qcbtn3 {
  width: 300rpx;
  height: 70rpx;
  background: #00A609;
  border-radius: 20rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.xuanzhebox {
  width: 164rpx;
  height: 60rpx;
  border: 1rpx solid #05a508;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25rpx;

}
</style>
