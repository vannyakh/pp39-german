<template>
    <view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
        <z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20"
                  :loading-more-enabled="false">
            <app-nav slot="top" title="VIP">
                <view slot="right" class="height-100b width-100b flex align-center justify-end padding-w-32">
                    <u-icon @click="router.push('/pages/index/vip_QC/record')" name="order" :color="theme.primary__500" size="28"></u-icon>
                </view>
            </app-nav>


            <view slot="top" class="padding-w-32 padding-c-20" :style="{background: theme.backgroundCard}">
                <view class="radiu-10 text-center flex align-center justify-between"
                      :style="{background: theme.backgroundTertiary}">
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(1)"
                          :style="getTabStyle(1)">
                        <view class="text-center font-28" :style="getTabTextStyle(1)">{{$t('index22')}}</view>
                    </view>
                    <view class="width-100b radiu-15 flex align-center justify-center height-80"
                          @click="changeType(2)"
                          :style="getTabStyle(2)">
                        <view class="text-center font-28" :style="getTabTextStyle(2)">{{$t('index23')}}</view>
                    </view>
                </view>
            </view>

            <view class="padding-w-32 margin-t-20" v-for="(item,index) in list" :key="index">
                <view class="flex direction-column radiu-20 margin-20-auto padding-w-10"
                      :style="{background: theme.backgroundCard}">
                    <view class="height-100 flex padding-c-30 align-start justify-between" :style="{borderBottom: `1rpx solid ${theme.neutral__200}`}">
                        <view class="flex align-center">
                            <view class="font-30 margin-r-16 hidden-1" :style="{color: theme.textPrimary}">
                                {{item.name}}
                            </view>
                            <view class="radiu-4 flex align-center margin-l-10" :style="{background: theme.primary__500}">
                                <view class="padding-6 radiu-4 font-20" :style="{background: theme.backgroundCard, color: theme.textPrimary}">
                                    {{checktype(item.type)}}
                                </view>
                                <text class="font-20 padding-w-10" :style="{color: theme.white}">{{item.code}}</text>
                            </view>
                        </view>
                        <view class="flex-1 flex align-center justify-end">
                            <view @click="router.push('/pages/index/vip_QC/details?id='+item.id)"
                                  class="width-140 height-45 radiu-8 font-20 flex align-center justify-center"
                                  :style="getButtonStyle(item.increase)">
                                <text :style="{color: theme.white}">{{$t('index32')}}</text>
                            </view>
                        </view>
                    </view>

                    <view class="height-96 flex align-center justify-around">
                        <view class="height-50 padding-c-20 absolute" :style="{background: theme.neutral__200, width: '1rpx'}"/>
                        <view class="flex direction-column text-center font-32">
                            <text class="font-26" :style="{color: theme.textTertiary}">{{$t('chicang15')}}</text>
                            <text :style="{color: getPriceColor(item.increase)}">{{item.increase}}%</text>
                        </view>
                        <view class="flex direction-column  text-center font-32">
                            <text class="font-26" :style="{color: theme.textTertiary}">{{$t('index20')}}</text>
                            <text :style="{color: getPriceColor(item.increase)}">{{item.fx_price}}</text>
                        </view>

                    </view>
                    <!-- <view class="flex-1 flex direction-column align-start justify-center">
						<view class="flex align-center">
							<view class="font-30 margin-r-16 color-white hidden-1" style="border-left: 3px solid #C3F53C;">{{item.name}}</view>
						</view>
						<view class="radiu-4 flex align-center bj-bians  margin-t-10">
							<view class="padding-6 bj-white radiu-4 font-24 color-000000">
								{{checktype(item.type)}}
							</view>
							<text class="font-24 padding-w-10 color-000000">{{item.code}}</text>
						</view>
					</view> -->
                    <!-- <view class="flex-1 text-center font-30 weight-bold">{{item.fx_price}}</view> -->
                    <!-- <view class="flex-1 text-center font-30 weight-bold">{{item.increase}}%</view> -->

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
        queryList(pageNo, pageSize) {
            this.post('/product/vip_list', {
                status: this.type,
                page: pageNo,
            }).then(res => {
                if (res.code == 1) {
                    this.$refs.paging.complete(res.data);
                }
            })
        },
        getTabStyle(tabIndex) {
            if (this.type === tabIndex) {
                return {
                    background: this.theme.primary__500
                }
            }
            return {}
        },
        getTabTextStyle(tabIndex) {
            if (this.type === tabIndex) {
                return {
                    color: this.theme.white
                }
            }
            return {
                color: this.theme.textSecondary
            }
        },
        getButtonStyle(increase) {
            if (increase >= 0) {
                return {
                    background: this.theme.primary__500,
                    color: this.theme.white
                }
            }
            return {
                background: this.theme.textTertiary,
                color: this.theme.white
            }
        },
        getPriceColor(increase) {
            return increase >= 0 ? this.theme.primary__500 : this.theme.success
        },
    }
}
</script>

<style lang="scss" scoped>
.min-height-screen {
  min-height: 100vh;
}

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
</style>
