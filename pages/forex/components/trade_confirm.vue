<template>
    <view
            class="width-540 padding-40"
            :style="{background: theme.backgroundCard, color: theme.textPrimary}"
    >
        <view class="padding-c-30">
            <!-- Trading Amount -->
            <view class="height-60 flex align-center justify-between">
                <text class="font-28 nummedium-font" :style="{ color: theme.textTertiary }">{{$t('cycle.jiaoyi')}}:</text>
                <text class="font-28 nummedium-font" :style="{ color: theme.textPrimary }">{{(lastData.close * inputHans) | numFilter}} USDT</text>
            </view>

            <!-- Margin Amount -->
            <view class="height-60 flex align-center justify-between">
                <text class="font-28 nummedium-font" :style="{ color: theme.textTertiary }">{{$t('cycle.margin')}}:</text>
                <view v-if="marketType=='market'&&lastData.close" class="font-28 nummedium-font" :style="{ color: theme.textPrimary }">
                    {{(setting.promise_price * lastData.close * 100 * inputHans / (multiple||1)) | numFilter}} USDT
                </view>
                <view v-if="marketType=='limit'" class="font-28 nummedium-font" :style="{ color: theme.textPrimary }">
                    {{(setting.promise_price * inputPirce) | numFilter}} USDT
                </view>
            </view>

            <!-- Service Fee -->
            <view class="height-60 flex align-center justify-between">
                <text class="font-28 nummedium-font" :style="{ color: theme.textTertiary }">{{$t('cycle.service')}}:</text>
                <view v-if="marketType=='market'&&lastData.close" class="font-28 nummedium-font" :style="{ color: theme.textPrimary }">
                    {{(setting.contract_fee * setting.promise_price * lastData.close * 100 * inputHans / (multiple||1)) | numFilter}} USDT
                </view>
                <view v-if="marketType=='limit'" class="font-28 nummedium-font" :style="{ color: theme.textPrimary }">
                    {{(setting.contract_fee * setting.promise_price * inputPirce) | numFilter}} USDT
                </view>
            </view>
        </view>

        <!-- Confirm Button -->
        <view class="width-466 margin-0-auto flex align-center justify-center">
            <button
                    @tap="$emit('confirm')"
                    class="cu-btn loginBtn"
                    :style="getButtonStyle()"
            >
                <text :style="{ color: theme.white }">{{$t('cycle.confirm')}}</text>
            </button>
        </view>
    </view>
</template>

<script>
export default {
    name: 'TradeConfirm',

    props: {

        i18n: {
            type: Object,
            required: true
        },
        marketType: {
            type: String,
            required: true
        },
        lastData: {
            type: Object,
            default: () => ({})
        },
        inputHans: {
            type: [String, Number],
            default: 0
        },
        inputPirce: {
            type: [String, Number],
            default: 0
        },
        setting: {
            type: Object,
            default: () => ({
                promise_price: 0,
                contract_fee: 0
            })
        },
        multiple: {
            type: [String, Number],
            default: 1
        }
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },

    methods: {
        getButtonStyle() {
            return {
                width: '466rpx',
                borderRadius: '10rpx',
                height: '86rpx',
                background: this.theme.primary__500
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.loginBtn {
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    opacity: 0.8;
  }
}
</style>
