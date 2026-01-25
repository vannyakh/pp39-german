<template>
    <view class="flex flex-direction" :style="{color: theme.dark}">
        <!--		<myNav :title="`${sharesInfo.name||''}${new_price?increase:sharesInfo.increase}%`"></myNav>-->

        <view :style="{paddingTop: statusBar + 'px', background: theme.light__gray}">
            <view class="relative padding-c-20 padding-w-40">
                <view class="width-100b flex align-center justify-between gap-10">
                    <view class="flex-1 flex align-center hidden-1">
                        <u-icon @click="router.goBack()" name="arrow-left" size="22" color="#333"></u-icon>
                        <text class="padding-l-20 color-333333">{{sharesInfo.name}}</text>
                        <text class="padding-l-10 font-22" :style="{color:theme.gray20}">{{sharesInfo.code}}</text>
                    </view>
                    <view class="flex align-center gap-15">
                        <u-icon @click="router.push('/pages/index/searchView')" name="search" size="28" color="#666"></u-icon>
                    </view>
                </view>
            </view>
        </view>


        <view class="padding-c-22 padding-w-32 flex flex-direction">
            <view class="flex align-center justify-between">
                <view class="flex-1 flex align-center gap-20">
                    <text class="font-64 weight-bold" :style="{color:theme.red__dark}">{{new_price?new_price:sharesInfo.close}}</text>
                    <text class="font-28" :style="{color:theme.red__dark}">{{new_price?rise_or_fall:sharesInfo.rise_or_fall}}</text>
                    <text class="font-28" :style="{color:theme.red__dark}">{{new_price?increase:sharesInfo.increase}}%</text>
                </view>
            </view>

            <view class="flex align-center justify-between margin-t-16">
                <view class="flex-1 flex align-center font-24">
                    <text class="color-949494 margin-r-24">{{$t('hangqing9')}}</text>
                    <text class="">{{sharesInfo.open}}</text>
                </view>
                <view class="flex-1 flex align-center justify-center font-24">
                    <text class="color-949494 margin-r-24">{{$t('hangqing10')}}</text>
                    <text class=" ">{{sharesInfo.high}}</text>
                </view>
                <view class="flex-1 flex align-center justify-end font-24">
                    <text class="color-949494 margin-r-24">{{$t('hangqing11')}}</text>
                    <text class=" ">{{sharesInfo.volume}}</text>
                </view>
            </view>
            <view class="flex align-center justify-between margin-t-16">
                <view class="flex-1 flex align-center font-24">
                    <text class="color-949494 margin-r-24">{{$t('hangqing12')}}</text>
                    <text class=" ">{{sharesInfo.previous_close}}</text>
                </view>
                <view class="flex-1 flex align-center justify-center font-24">
                    <text class="color-949494 margin-r-24">{{$t('hangqing13')}}</text>
                    <text class=" ">{{sharesInfo.low}}</text>
                </view>
                <view class="flex-1 flex align-center justify-end font-24">
                </view>
            </view>
            
        </view>
        

        <view class="flex align-center justify-between padding-c-20 padding-w-32 width-100b" :style="{background: theme.light}">
            <view @click="Cshow=true,k_or_d='d'"
                  class="flex align-center justify-center padding-20 width-100b" :style="{background: theme.green__dark, color: theme.white}">
                {{$t('index64')}}
            </view>

            <view @click="Cshow=true,k_or_d='k'"
                  class="flex align-center justify-center padding-20 width-100b" :style="{background: theme.red__dark, color: theme.white}">
                {{$t('Sell')}}
            </view>
        </view>
        

    </view>
</template>

<script>
import {
    mixin
} from "./minxin/minxin.js"
export default {
    mixins: [mixin], //混入文件
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            buyTepy: 1,
            k_or_d: '',
            num: '',
            price: '',
            Cshow: false,
            sharesID: '',
            sharesInfo: {
                close: 0,
                increase: 0,
                rise_or_fall: 0,
            },
            new_price: 0, //最新价格
            lianList: [],
            leverage: 1,
            flag: true
        };
    },
    watch: {
        Cshow(state) {
            if (state == false) {
                this.num = ''
                this.price = ''
            }
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        },
        increase() {
            return Number((this.new_price - this.sharesInfo.previous_close) / this.sharesInfo.previous_close * 100)
                .toFixed(3)
        },
        rise_or_fall() {
            return Number(this.new_price - this.sharesInfo.previous_close).toFixed(3)
        },
        max_num() {
            let money = this.sharesInfo.money * (1 - this.sharesInfo.share_fee / 100 - this.sharesInfo.stamp_duty /
                100)
            let new_price = this.new_price ? this.new_price : this.sharesInfo.close
            return parseInt(money / new_price)
        }
    },
    onUnload() {
        this.zhezhaoceng = true
        clearTimeout(this.tentimer)
    },
    onLoad(e) {
        this.sharesID = e.id
        this.getDetails(true)
    },
    onShow() {
        this.getDetails(true)
        // #ifdef H5
        this.getKline_zhilian(0)
        // #endif
        // #ifdef APP-PLUS
        this.htmlSrc = 'static/hybrid/kline/index1.html?symbol=' + this.sharesID + '&lang=' + this.$t('locale')
        // #endif
    },
    methods: {
        goumai() {
            if (!this.flag) return
            if (this.num == '') return this.tos(this.$t('hangqing23'))
            if (this.buyTepy == 2) {
                if (this.price == '') return this.tos(this.$t('hangqing33'))
            }
            this.flag = false
            this.post('/shares/shares_buy', {
                id: this.sharesID,
                num: this.num,
                type: this.buyTepy,
                price: this.price,
                k_or_d: this.k_or_d,
                leverage: this.leverage,
            }, true).then((res) => {
                this.flag = true
                //console.log('购买',res)
                if (res.code == 1) {
                    this.tos(res.msg)
                    this.Cshow = false
                    this.k_or_d = ''
                    this.getDetails(false)
                }
            })
        },
        getDetails(type) {
            this.post('/shares/shares_con', {
                id: this.sharesID
            }, type).then((res) => {
                if (res.code == 1) {
                    this.sharesInfo = res.data

                    if (res.data.lever_status == true) {
                        this.lianList = res.data.leverage
                        if (this.lianList) this.leverage = this.lianList[0]
                    }

                }
            })
        },

        app_getiframeMsg(num) {
            if (num) {
                this.new_price = num
            }
        },
    }
}
</script>

<style lang="scss">

</style>
