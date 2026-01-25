<template>
    <view class="container-mine" :style="{ background: theme.backgroundPrimary }">
        <bg-animate-shape/>
        <view class="homebg"/>

        <v-container size="md" class="relative">
            <!-- Modern Header Section -->
            <view class="modern-header" :style="{paddingTop: statusBar + 'px' }">
                <view class="header-content">
                    <view class="user-profile-section">
                        <view class="profile-left">
                            <image class="profile-avatar" :src="userinfo.avatar" mode="aspectFill"></image>
                            <view class="user-info">
                                <text class="user-greeting" :style="{ color: theme.white }">{{ $t('mine.info.getting') }}, {{ userinfo.mobile }}</text>
                                <view class="user-member-id" :style="{ color: theme.white }">
                                  {{ $t('mine.info.member') }}: {{ formatMemberId(userinfo.cds_code) }}
                                </view>

                                <view class="flex ">
                                    <view class="verification-badge" v-if="userinfo.is_auth" :style="{ background: 'rgba(255, 255, 255, 0.2)' }">
                                <u-icon name="checkmark-circle" size="20" :color="theme.primary__light"></u-icon>
                                <text class="verification-text" :style="{ color: theme.white }">{{ $t('my1') }}</text>
                            </view>
                            <view @click="router.push('/pages/my/setting/realName')" class="verification-badge"
                                  v-else :style="{ background: 'rgba(255, 255, 255, 0.2)' }">
                                <u-icon name="close-circle" size="20" :color="theme.primary__light"></u-icon>
                                <text class="verification-text" :style="{ color: theme.white }">{{ $t('my2') }}</text>
                            </view>
                                </view>
                            </view>

                        </view>
                        <view class="profile-right">
                            <view class="header-actions">
                                <view @click="router.push('/pages/my/setting/index')" class="action-icon-wrapper" :style="{ background: 'rgba(255, 255, 255, 0.1)' }">
                                    <u-icon name="setting-fill" size="28" :color="theme.white"></u-icon>
                                    <view class="ripple-effect"></view>
                                </view>
                                <view @click="toggleTheme" class="theme-toggle" :style="{ background: 'rgba(255, 255, 255, 0.1)' }">
                                    <image class="theme-icon"
                                           :src="themeChange?'/static/imgs/my/sunny-filled.png':'/static/imgs/my/moon.png'"
                                           mode="aspectFit"></image>
                                    <view class="ripple-effect"></view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- Asset Overview Component -->
            <asset-overview
                :userAssets="userAssets"
                @deposit="handleDeposit"
                @withdraw="handleWithdraw"
                @transfer="handleTransfer"
                @exchange="handleExchange"
            />

            <!-- Common Functions Section -->
            <view class="functions-section" :style="{ background: theme.backgroundCard, borderColor: theme.backgroundCard }">
                <view class="section-title" :style="{ color: theme.textPrimary }">{{ $t('my12') }}</view>
                <view class="functions-grid">
                    <view @click="router.push('/pages/my/setting/passpwd')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/pwd.png" mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('my13') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view @click="router.push('/pages/my/setting/pay_pwd')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/fundpwd.png" mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('my14') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view @click="router.push('/pages/my/setting/asste_record')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/flow.png" mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('my15') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view v-if="userinfo.is_auth" @click="show1=true" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/realname.png" mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('my16') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view v-else @click="router.push('/pages/my/setting/realName')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/realname.png" mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('my16') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                </view>
            </view>

            <!-- Other Functions Section -->
            <view class="other-functions-section" :style="{ background: theme.backgroundCard, borderColor: theme.backgroundCard }">
                <view class="section-title" :style="{ color: theme.textPrimary }">{{ $t('my17') }}</view>
                <view class="other-functions-grid">
                    <view @click="router.push('/pages/my/bank/index')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/bank.png" mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('my18') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view @click="router.push('/pages/statistic/statistic?id=1')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/trading-bond.png"
                                   mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('mine.tradingBound') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view @click="router.push('/pages/index/service/index')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/deposit-usdt.png"
                                   mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ `${$t('trading5')}  ${$t('usdt')}` }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view @click="router.push('/pages/index/service/index')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/service.png"
                                   mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('Customer') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view @click="router.push('/pages/login/agreement?type=agreement')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/userge.png" mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('my21') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view @click="router.push('/pages/my/aboutus')" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/privacy.png" mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">{{ $t('my24') }}</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                    <view @click="modalClearCache=true" class="function-item">
                        <view class="function-main">
                            <image class="function-icon" src="/static/imgs/my/clear-cache.png" mode="aspectFit"></image>
                            <text class="function-text" :style="{ color: theme.textPrimary }">Clear Cache</text>
                        </view>
                        <u-icon name="arrow-right" size="22" :color="theme.neutral__400"></u-icon>
                    </view>
                </view>
            </view>

            <!-- #ifdef APP-PLUS -->
            <view class="flex align-center justify-center width-100b relative text-primary">
                <view class="font-26">{{ $t('Version') }} {{ version }}</view>
            </view>
            <!-- #endif -->
            <view class="height-100"></view>
        </v-container>


        <u-popup :show="show" mode="center" round="10" @close="show=false">
            <view class="width-600 bj-white radiu-10 padding-30">
                <view class="padding-w-20 flex align-center justify-start text-center font-28 color-000000">
                    <text class="font-40 bold-font color-212121 margin-r-12">{{ $t('my90') }}</text>
                </view>
                <view class="margin-b-40">
                    <view class="padding-w-20">
                        <scroll-view scroll-y="true" style="height: 700rpx;">
                            <text class="font-30 color-212121 margin-r-12" v-html="content"></text>
                        </scroll-view>
                    </view>
                </view>
                <view class="height-86 flex align-center justify-around font-28 radiu-8">
                    <view class="bj-3333335 flex height-86 width-190 align-center justify-center padding-w-20 radiu-8">
                        <text @click="show=false" class="font-28 color-white margin-r-12">{{ $t('my91') }}</text>
                    </view>
                    <view @click="show=false"
                          class="bj-949494 flex height-86 width-190 align-center justify-center padding-w-20  radiu-8">
                        <text class="font-28 color-white margin-r-12">{{ $t('my92') }}</text>
                    </view>
                </view>
            </view>
        </u-popup>
        <u-popup :show="show1" mode="center" round="20" @close="show1=false">
            <view class="width-600 bj-white radiu-15 padding-30">
                <view class="padding-w-20 flex align-center justify-start text-center font-28 color-000000">
                    <text class="font-40 color-212121 margin-r-12">{{ $t('real-name') }}</text>
                </view>
                <view class="margin-b-20"></view>
                <view class="height-86 flex align-center justify-around font-28 radiu-8">
                    <view class=" flex height-65 width-190 align-center justify-center padding-w-20 radiu-10"
                          :style="{background: theme.bgPrimary, color: theme.white}">
                        <text @click="show1=false" class="font-28 color-white margin-r-12">{{ $t('my91') }}</text>
                    </view>
                </view>
            </view>
        </u-popup>
        <tui-modal :show="modalClearCache" :button="buttonText" :maskClosable="false" :backgroundColor="theme.bg2" blur
                   :color="theme.text" @click="handleClick" @cancel="modalClearCache=false"
                   title="Are you sure you want to clear cache?" :content="content"></tui-modal>
    </view>
</template>

<script>
import clipboard from "@/components/copy/clipboard.js"
import AssetOverview from './components/asset-overview.vue'
// #ifdef APP-PLUS
import APPUpdate, {
    getCurrentNo
} from '@/components/APPUpdate/js_sdk/appUpdate';
// #endif

export default {
    components: {
        AssetOverview
    },
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            version: uni.getStorageSync('appVersion'),
            userinfo: {},
            content: '',
            status: false,
            show: false,
            show1: false,
            modalClearCache: false,
            cacheSize: '0MB',
            recharge_kefu: '',
            userAssets: {
                overview: {
                    totalAsset: '0.00',
                    spot: '0.00',
                    ca: '0.00',
                    us: '0.00',
                    forex: '0.00'
                },
                spot: {
                    totalAsset: '0.00',
                    cad: '0.00',
                    us: '0.00',
                    usdt: '0.00'
                },
                ca: {
                    totalAsset: '0.00',
                    count_money_cnd: '0.00',
                    zy_money_cnd: '0.00',
                    money_cnd: '0.00',
                    loan_cnd: '0.00',
                    kq_money_cnd: '0.00',
                    cc_yinli_cnd: '0.00',
                    count_yinli_cnd: '0.00',
                    freeze_cash_cnd: '0.00',
                    pending_cash_cnd: '0.00',
                    close_not_yet_one_day_cnd: '0.00'
                },
                us: {
                    totalAsset: '0.00',
                    count_money_us: '0.00',
                    zy_money_us: '0.00',
                    money_us: '0.00',
                    loan_us: '0.00',
                    kq_money_us: '0.00',
                    cc_yinli_us: '0.00',
                    count_yinli_us: '0.00',
                    freeze_cash_us: '0.00',
                    pending_cash_us: '0.00',
                    close_not_yet_one_day_us: '0.00'
                },
                forex: {
                    totalAsset: '0.00',
                    totalAssets: '0.00',
                    occupiedFunds: '0.00',
                    availableFunds: '0.00',
                    positionTotalProfit: '0.00',
                },
                day_trading: "0.00"
            },
        }
    },
    onLoad() {
        // #ifdef APP-PLUS
        getCurrentNo(res => {
            this.version = res.versionName;
        });
        // #endif
    },
    onShow() {
        this.init()
        this.getInfo()
        this.getwallet()
        this.updateTabBarText()

    },
    computed: {
        buttonText() {
            return [{
                text: "Cancel",
                type: "green",
                plain: true
            },
                {
                    text: "Ok",
                    type: "red",
                    plain: false
                }
            ]
        },
        theme() {
            return this.$store.getters.theme
        },
        themeChange() {
            return this.$store.state.themeKey === 'dark';
        },
        backgroundGradient() {
            const primaryColor = this.theme.primary__light
            const secondaryColor = this.theme.secondary
            if (this.theme.primary && this.theme.primary.includes('gradient')) {
                return this.theme.primary.replace('137deg', '90deg')
            }
            return `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
        },
    },
    methods: {
        formatMemberId(value) {
            console.log('Formatting member ID:', value);
            if (value == null || value === '') return '';

            const str = String(value).padStart(9, '0');
            return str.slice(0, 3) + '***' + str.slice(-3);
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

        clearCache() {
            uni.showLoading()
            uni.clearStorage()
            uni.hideLoading()
            uni.reLaunch({
                url: '/pages/login/index'
            })

            // #ifdef APP-PLUS
            plus.cache.calculate((size) => {
                const sizeInMB = (size / (1024 * 1024)).toFixed(3);
                this.cacheSize = sizeInMB + 'MB';
            });
            // #endif

            // #ifdef H5
            this.cacheSize = '0MB';
            // #endif
        },
        handleClick(e) {
            if (e.index == 0) {
                this.modalClearCache = false;
            } else {
                this.clearCache()
                this.modalClearCache = false;
            }

        },
        open(url) {
            if (url) {
                // #ifdef APP-PLUS
                plus.runtime.openURL(url)
                // #endif
                // #ifdef H5
                window.location.href = url
                // #endif
            }
        },
        init() {
            this.post('/my/recharge_con').then(res => {
                if (res.code == 1) {
                    this.recharge_kefu = res.data.recharge_kefu
                }
            })
        },
        getInfo() {
            this.post('/my/userinfo').then(res => {
                if (res.code == 1) {
                    this.userinfo = res.data
                    res.data.freezing_cash_status == 1 ? this.status = true : this.status = false
                    this.$store.dispatch('updateUserAvatar', this.userinfo.avatar)
                    this.$store.dispatch('updateUserField', this.userinfo)
                }
            })
        },

        setDetail(url) {
            if (this.status == true) {
                this.show = true
                return
            }
            url = '/pages/my/setting/Z_to_Y';
            this.router.push(url);
        },

        getwallet() {
            this.post('/my/wallet').then(res => {
                if (res.code == 1) {
                    console.log('Wallet data:', res.data);
                    this.userAssets = res.data.userAssets
                }
            })
        },
        // copy to clipboard
        copy(data) {
            // #ifndef H5
            clipboard.setText(data);
            // #endif
            // #ifdef H5
            let result
            let textarea = document.createElement("textarea")
            textarea.value = data
            textarea.readOnly = "readOnly"
            document.body.appendChild(textarea)
            textarea.select() // 选中文本内容
            textarea.setSelectionRange(0, data.length)
            result = document.execCommand("copy")
            textarea.remove()
            // #endif
            this.tos(this.$t('my25'))
        },

        toggleTheme() {
            this.$store.dispatch('toggleTheme');
            this.router.push('/pages/login/welcome');
        },

        handleDeposit() {
            this.router.push('/pages/index/service/index');
        },

        handleWithdraw() {
            this.setDetail();
        },

        handleTransfer() {
            this.router.push('/pages/transfer/transfer');
        },
        handleExchange() {
            this.router.push('/pages/my/exchange')
        }
    }
}
</script>

<style lang="scss" scoped>
.container-mine {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Modern Header */

.header-content {
  padding: 60rpx 30rpx 60rpx 30rpx;
}

.user-profile-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.profile-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.user-greeting {
  font-size: 32rpx;
  font-weight: 700;
}

.user-member-id {
  font-size: 24rpx;
}

.verification-badge {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 5rpx 10rpx;
  border-radius: 20rpx;
  //align-self: flex-start;
}

.verification-text {
  font-size: 20rpx;
  font-weight: 600;
}

.profile-right {
  padding-top: 20rpx;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.action-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
}

.action-icon-wrapper:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.action-icon-wrapper:active {
  transform: scale(0.95);
}

.action-icon {
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.ripple-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
  pointer-events: none;
}

.action-icon-wrapper:active .ripple-effect {
  width: 100rpx;
  height: 100rpx;
  opacity: 0;
}

.theme-toggle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-icon {
  width: 48rpx;
  height: 48rpx;
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.action-button {
  flex: 1;
  padding: 30rpx 20rpx;
  border-radius: 32rpx;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.action-button:hover {
  transform: translateY(-2rpx);
  box-shadow: 0 6rpx 24rpx rgba(24, 62, 48, 0.35);
}

.action-text {
  font-size: 26rpx;
  font-weight: 600;
}
.action-icon {
    width: 48rpx;
    height: 48rpx;
    margin-right: 12rpx;
}

/* Functions Sections */
.functions-section, .other-functions-section {
  margin-bottom: 20rpx;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  border: 2rpx solid transparent;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  margin-bottom: 24rpx;
}

.functions-grid, .other-functions-grid {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.function-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20rpx;
  padding: 15rpx 10rpx;
  transition: all 0.3s ease;
  justify-content: space-between;
  border-bottom: 2rpx solid transparent;
  background: transparent;
}

.function-item:last-child {
  border-bottom: 0;
}

.function-item:hover {
  transform: translateY(-2rpx);
}

.function-icon {
  width: 50rpx;
  height: 50rpx;
}

.function-text {
  font-size: 22rpx;
  text-align: center;
  font-weight: 500;
}

.function-main {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}
</style>
