<template>
    <view>
        <view class="width-100b margin-t-20">
            <view class="flex justify-between align-center">
                <text class="bold-font" :style="{color: theme.gray20}">{{$t('service6')}}</text>
                <view @click="router.goTabBar('/pages/quotation/index')" class="flex align-center">
                    <text class="bold-font" :style="{color: theme.gray40}">{{$t('service4')}}</text>
                    <u-icon name="arrow-right" size="20" color="#333333"></u-icon>
                </view>
            </view>

            <view class="margin-t-20">
                <view @click="setDetail(item.id)" class="margin-b-20 flex align-center justify-between" :style="{color: theme.gray20}" v-for="(item,index) in hotList" :key="index">
                    <view class="flex flex-direction flex-2">
                        <view class="font-28 weight-bold">{{item.name}}</view>
                        <view class="font-20" :style="{color: theme.gray60}">{{item.code}}</view>
                    </view>
                    <view class="flex-1 text-center" :class="(item.close)>=0?'color-41BD64':'color-657EFA'">{{item.close}}</view>
                    <view class="flex-1 text-right" :class="item.increase>=0?'color-41BD64':'color-657EFA'">{{item.increase>=0?'':''}}{{item.increase}}%</view>
                    <view class="flex-1 text-right" :class="item.rise_or_fall>=0?'color-41BD64':'color-657EFA'">{{item.rise_or_fall>=0?'':''}}{{item.rise_or_fall}}</view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        dataList: {
            type: Array,
            default: []
        },
    },
    watch: {
        dataList: {
            handler(val) {
                this.hotList = val
            },
            immediate: true
        }
    },
    data() {
        return {
            hotList: [],
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    methods: {
        setDetail(url) {
            if (this.status == true) {
                this.show = true
                return
            }
            url = '/pages/quotation/details?id=' + url;
            this.router.push(url);
        },
    },

}
</script>
