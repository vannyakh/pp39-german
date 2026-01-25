<template>
    <view :style="{color:theme.dark}">
        <bg-animate-shape/>
        <z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20"
                  :loading-more-enabled="false">
            <myNav slot="top" :title="$t('E-IPO')" :black="false">
                <view slot="left" class="height-100b width-100b absolute flex align-center justify-between padding-w-32" style="left: 0rpx;">
                    <i @click="router.goBack()" class="cuIcon-back font-40 margin-r-10" :style="{ color: theme.dark }"></i>
                    <u-icon @click="router.push('/pages/index/eipo/record')" name="order" :color="theme.primary" size="28"></u-icon>
                </view>
            </myNav>


            <view slot="top" class="padding-w-32 padding-c-20" :style="{background: theme.light}">
                <view class="radiu-10 text-center flex align-center justify-between"
                      :style="{background:theme.light__gray}">
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(1)"
                          :style="{color: type==1?theme.white:theme.gray20, background: type==1?theme.bgPrimary:''}">
                        <view class="text-center font-28">{{$t('index22')}}</view>
                    </view>
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(2)"
                          :style="{color: type==2?theme.white:theme.gray20, background: type==2?theme.bgPrimary:''}">
                        <view class="text-center font-28">{{$t('index23')}}</view>
                    </view>
                </view>
            </view>

            <view class="padding-w-32 margin-t-20" v-for="(item,index) in list" :key="index">
                <view class="listBox1" :style="{background:theme.light}">
                    <view class="padding-w-20">
                        <view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom:'1px solid '+theme.light__gray}">
                            <view class="flex align-center">
                                <view class="hidden-1 font-30 width-180">
                                    {{item.name}}
                                </view>
                                <view class="radiu-4 flex align-center margin-l-10" :style="{background:theme.bgPrimary}">
                                    <view class="padding-6 radiu-4 font-24" :style="{background:theme.light}">
                                        {{checktype(item.type)}}
                                    </view>
                                    <text class="font-24 padding-w-10" :style="{color:theme.white}">{{item.code}}</text>
                                </view>
                            </view>
                            <view class="flex align-center justify-center">
                                <text class="font-24 color-949494">{{$t('index24')}}：<span
                                        class="color-949494">{{item.start_time}}</span></text>
                            </view>
                        </view>
                    </view>

                    <view class="flex align-center justify-between padding-t-20 margin-t-20 margin-b-20">
                        <view class="flex-1 flex direction-column justify-center">
                            <text class="font-32" :style="{color:theme.primary}">{{item.price}}/{{$t('index26')}}</text>
                            <text class="font-24 color-949494 margin-t-8">{{$t('index27')}}</text>
                        </view>
                        <view class="flex-1 flex direction-column align-center justify-center">
                            <text class="font-32" :style="{color:theme.primary}">{{item.profit_rate}}</text>
                            <text class="font-24 color-949494 margin-t-8">{{$t('index28')}}</text>
                        </view>
                        <view class="flex-1 flex direction-column align-end justify-center">
                            <text class="font-32" :style="{color:theme.primary}">{{item.count_num}}</text>
                            <text class="font-24 color-949494 margin-t-8">{{$t('index29')}}</text>
                        </view>
                    </view>
                    <view @click="setDetail(item.id)" class="padding-10 radiu-10 text-center" :style="{background:theme.bgPrimary, color:theme.white}">{{$t('index25')}}</view>

                </view>

            </view>

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

        };
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },
    methods: {
        setDetail(url) {
            url = '/pages/index/eipo/details?id=' + url;
            this.router.push(url);
        },
        changeType(index) {
            if (this.type != index) {
                this.type = index
                this.$refs.paging.reload()
            }
        },
        queryList(pageNo, pageSize) {
            this.post('/eiop/new_gu_list', {
                status: this.type,
                page: pageNo,
            }).then(res => {
                if (res.code == 1) {
                    this.$refs.paging.complete(res.data);
                }
            })
        },
    }
}
</script>

<style lang="scss">
.listBox1 {
  width: 100%;
  margin-bottom: 12rpx;
  border-radius: 20rpx;
  padding: 20rpx 32rpx;
}

.btnsbox {
  width: 100%;
  height: 64rpx;
  background: #C3F53C;
  border-radius: 20rpx;
  margin-top: 10rpx;
  border: 1rpx solid #2D2D2D;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #000;
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
  background: #1C1D24;
  // display: flex;
  align-items: center;
  border-radius: 20rpx;
  border: 1rpx solid #2D2D2D;
  // justify-content: space-between;
  padding: 0 20rpx;
  margin-bottom: 12rpx;
}
</style>
