<template>
    <view class="min-height-screen" :style="{background: theme.backgroundPrimary}">
        <z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20"
                  :loading-more-enabled="false">
            <app-nav slot="top" title="IPO" blur showRightImage
                     rightImageUrl="/static/imgs/fund/record.png" @right-action="router.push('/pages/index/new_SG/record')"
            ></app-nav>


            <!---tab-->
            <view slot="top" class="padding-w-32 padding-c-20" :style="{background: theme.backgroundCard}">
                <view class="radiu-10 text-center flex align-center justify-between"
                      :style="{background: theme.backgroundTertiary}">
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          :class="{'tab-active': type === 1}"
                          :style="getTabStyle(1)"
                          @click="changeType(1)">
                        <view class="text-center font-28" :style="getTabTextStyle(1)">{{$t('index22')}}</view>
                    </view>
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          :class="{'tab-active': type === 2}"
                          :style="getTabStyle(2)"
                          @click="changeType(2)">
                        <view class="text-center font-28" :style="getTabTextStyle(2)">{{$t('index23')}}</view>
                    </view>
                </view>
            </view>

            <view class="padding-w-32 margin-t-20" v-for="(item,index) in list" :key="index">
                <view class="listBox1" :style="{background: theme.backgroundCard}">
                    <view class="padding-w-20">
                        <view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: `1px solid ${theme.neutral__200}`}">
                            <view class="flex align-center">
                                <view class="hidden-1 font-30 width-180" :style="{color: theme.textPrimary}">
                                    {{item.name}}
                                </view>
                                <view class="radiu-4 flex align-center margin-l-10" :style="{background: theme.primary__500}">
                                    <view class="padding-6 radiu-4 font-24" :style="{background: theme.backgroundCard}">
                                        <text :style="{color: theme.textPrimary}">{{checktype(item.type)}}</text>
                                    </view>
                                    <text class="font-24 padding-w-10" :style="{color: theme.white}">{{item.code}}</text>
                                </view>
                            </view>
                            <view class="flex align-center justify-center">
                                <text class="font-24" :style="{color: theme.textTertiary}">{{$t('index24')}}：<span :style="{color: theme.textTertiary}">{{item.start_time}}</span></text>
                            </view>
                        </view>
                    </view>

                    <view class="flex align-center justify-between padding-t-20 margin-t-20 margin-b-20">
                        <view class="flex-1 flex direction-column justify-center">
                            <text class="font-32" :style="{color: theme.primary__500}">{{item.price}}/{{$t('index26')}}</text>
                            <text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index27')}}</text>
                        </view>
                        <view class="flex-1 flex direction-column align-center justify-center">
                            <text class="font-32" :style="{color: theme.primary__500}">{{item.profit_rate}}</text>
                            <text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index28')}}</text>
                        </view>
                        <view class="flex-1 flex direction-column align-end justify-center">
                            <text class="font-32" :style="{color: theme.primary__500}">{{item.count_num}}</text>
                            <text class="font-24 margin-t-8" :style="{color: theme.textTertiary}">{{$t('index29')}}</text>
                        </view>
                    </view>
                    <view @click="setDetail(item.id)" class="padding-10 radiu-10 text-center" :style="{background: theme.primary__500, color: theme.white}">{{$t('index25')}}</view>

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
            url = '/pages/index/new_SG/details?id=' + url;
            this.router.push(url);
        },
        changeType(index) {
            if (this.type != index) {
                this.type = index
                this.$refs.paging.reload()
            }
        },
        queryList(pageNo, pageSize) {
            this.post('/product/new_gu_list', {
                status: this.type,
                page: pageNo,
            }).then(res => {
                if (res.code == 1) {
                    this.$refs.paging.complete(res.data);
                }
            })
        },
        getTabStyle(index) {
            if (this.type === index) {
                return {
                    background: this.theme.primary__500
                }
            }
            return {}
        },
        getTabTextStyle(index) {
            if (this.type === index) {
                return {
                    color: this.theme.white
                }
            }
            return {
                color: this.theme.textTertiary
            }
        }
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
  border-radius: 20rpx;
  margin-top: 10rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
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
  align-items: center;
  border-radius: 20rpx;
  padding: 0 20rpx;
  margin-bottom: 12rpx;
}

/* Tab Active Styles */
.tab-active {
  transition: all 0.3s ease-in-out;
}
</style>
