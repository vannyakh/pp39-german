<template>
	<z-paging ref="paging" refresher-only @onRefresh="onRefresh" :style="themeStyles">
		<!-- 顶部标题 -->
		<view slot="top" class="width-100b flex align-center justify-between padding-w-30  bj-102030"
			:style="{height: `calc(${statusBar}px + 100rpx)`,paddingTop:`${statusBar}px`}">
			<view  class="width-60 height-60  flex align-center justify-center radiu-10"
				:style="'background-color: '+theme.bg2+';color: '+theme.text">
				<i @click="router.goBack()" class="cuIcon-back color-white font-40"></i>
			</view>
			<view class="width-30s flex align-center bj-353648 radiu-12">
				<view @click="handleTabChange(index)" class="height-69  flex align-center  justify-start"
					v-for="(item,index) in tabList" :key="index" style="">
					<text
						:class="current1==index?'bold-font bj-606062 color-white ':'  color-white  medium-font'" class="font-28 height-60 flex align-center justify-center padding-w-20 radiu-12">{{item}}</text>
				</view>
			</view>
            <view class="height-72 padding-w-40 flex align-center justify-between"></view>
		</view>

		<view class="relative">
			<view class="width-100b bj-102030 height-72 padding-w-40 flex align-center justify-between">
				<view class="flex-1 height-46 flex  align-center justify-between">
					<view class="width-360 flex align-center">
						<text class="bold-font font-28 color-909AAB">{{i18n.licai.text36}}</text>
					</view>
					<image class="width-40 height-40" src="/static/imgs/index/shaixuan@2x.png" mode=""></image>
				</view>
			</view>
		</view>

        <!--Order List-->
        <view class="padding-w-20" style="height: calc(100vh - 10vh);">
            <swiper class="height-100b" :current="current1" @animationfinish="animationFinish"
                    @change="handleSwiperChange">
                <swiper-item v-for="(item,index) in tablist1" class="swiper-item">
                    <scroll-view scroll-y="true" style="height: 100%; " @scrolltolower="loadMore">
                        <secondListItem @timeOut="handleCloseOut" :currentIndex="current1" :loading="loading"
                                        :color="theme.text" :background="theme.bg" :fu_color="theme.fu_color"
                                        :list="contractOrderList" :nowPrice="lastData.close"></secondListItem>
                        <view class="height-140"></view>
                    </scroll-view>
                </swiper-item>
            </swiper>
        </view>

	</z-paging>
</template>

<script>
import _env from '../../env';
const env = _env();

import secondListItem from "./components/second_list_item1.vue";


export default {
    components: {
        secondListItem,
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
            flag: true
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
        animationFinish(e) {
            let current = e.detail.current;
            this.current1 = current;
        },
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
            console.log('getForexData')
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
                    this.getWallet()
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
        getWallet() {
            this.post('/wallet/wallet_index').then((res) => {
                if (res.code == 1) {
                    this.count_xh_usdt = res.data.all.usdt_num
                }
            })
        },
    }
}
</script>

<style lang="scss">
.swiper {

  /* #ifndef H5 */
  // 除了 H5 平台，其它平台均存在的代码
  height: calc(100vh - 676rpx - var(--status-bar-height));
  /* #endif */

  /* #ifdef H5 */
  // 只会出现在h5上
  height: calc(100vh - 76rpx - 104rpx);
  /* #endif */
}

.swiper_no {
  /* #ifndef H5 */
  // 除了 H5 平台，其它平台均存在的代码
  height: calc(100vh - 62rpx - var(--status-bar-height));
  /* #endif */

  /* #ifdef H5 */
  // 只会出现在h5上
  height: calc(100vh - 862rpx - 104rpx);
  /* #endif */
  background-color: #E27046;
}
</style>
