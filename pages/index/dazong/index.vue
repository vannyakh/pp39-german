<template>
    <view class="min-height-screen" :style="{color: theme.textPrimary, background: theme.backgroundSecondary}">
        <z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20"
                  :loading-more-enabled="false">
            <app-nav slot="top" title="Bulk Transaction" blur showRightImage
                     rightImageUrl="/static/imgs/fund/record.png" @right-action="router.push('/pages/index/dazong/record')"
            ></app-nav>


            <view slot="top" class="padding-w-32 padding-c-20" :style="{background: theme.backgroundCard}">
                <view class="radiu-10 text-center flex align-center justify-between"
                      :style="{background: theme.backgroundTertiary}">
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(1)"
                          :style="getTabStyle(1)">
                        <text class="text-center font-28" :style="{ color: getTabStyle(1).color }">{{$t('index22')}}</text>
                    </view>
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(2)"
                          :style="getTabStyle(2)">
                        <text class="text-center font-28" :style="{ color: getTabStyle(2).color }">{{$t('index23')}}</text>
                    </view>
                </view>
            </view>

            <view class="padding-w-32 margin-t-20" v-for="(item,index) in list" :key="index">
                <view class="listBox2" :style="{background: theme.backgroundCard}">

                    <view class="flex direction-column ">
                        <view class="flex align-start padding-c-20 justify-between">
                            <view class="flex align-center margin-b-12 ">
                                <view class="font-30 margin-r-16 hidden-1" :style="{ color: theme.textPrimary }">
                                    {{item.name}}
                                </view>
                                <view class="radiu-4 flex align-center margin-l-10" :style="{background: theme.primary__500}">
                                    <view class="padding-6 radiu-4 font-24" :style="{background: theme.backgroundCard}">
                                        {{checktype(item.type)}}
                                    </view>
                                    <text class="font-24 padding-w-10" :style="{color: theme.white}">{{item.code}}</text>
                                </view>
                            </view>
                            <view class="flex text-center font-30 weight-bold" :style="{ color: theme.textTertiary }">{{$t('index20')}}: <span
                                    class="margin-l-12" :style="{color: theme.primary}">{{item.fx_price}}</span></view>
                        </view>
                        <view @click="router.push('/pages/index/dazong/details?id='+item.id)"
                              class="width-880 height-64 radiu-8 font-28 flex align-center justify-center"
                              :style="{background: theme.primary__500, color: theme.white}">
                            {{$t('index32')}}
                        </view>
                    </view>

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
        changeType(index) {
            if (this.type != index) {
                this.type = index
                this.$refs.paging.reload()
            }
        },
        getTabStyle(tabIndex) {
            if (this.type === tabIndex) {
                return {
                    color: this.theme.white,
                    background: this.theme.primary__500
                }
            }
            return {
                color: this.theme.textPrimary,
                background: 'transparent'
            }
        },
        queryList(pageNo, pageSize) {
            this.post('/product/max_list', {
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
  // display: flex;
  align-items: center;
  border-radius: 20rpx;
  // justify-content: space-between;
  padding: 0 20rpx;
  margin-bottom: 12rpx;
}
</style>
