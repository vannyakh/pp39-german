<template>
    <view class="coin-selector-container">
        <scroll-view
            scroll-y="true"
            class="coin-scroll-view"
            :enhanced="true"
            :show-scrollbar="false"
            :enable-back-to-top="true"
        >
            <view class="coin-list">
                <view
                    v-for="(item, index) in coinList"
                    :key="index"
                    @tap="selectCoin(index)"
                    :class="['coin-row', String(keyidx) == String(index) ? 'coin-row--active' : '']"
                    :style="getRowStyle(index)"
                >
                    <view class="coin-row__left">
                        <text class="coin-name" :style="{ color: theme.textPrimary }">{{ item.name }}</text>
                        <text v-if="item.symbol" class="coin-symbol" :style="{ color: theme.textTertiary }">{{ item.symbol }}</text>
                    </view>
                    <view class="coin-row__right">
                        <text class="coin-price" :style="{ color: theme.textPrimary }">{{ formatPrice(item.close, item.price_jd) }}</text>
                        <text class="coin-change" :class="getIncreaseClass(item.increase)"
                              :style="getChangeStyle(item.increase)">
                            {{ formatIncrease(item.increase) }}
                        </text>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    name: 'CoinSelector',

    props: {
        coinList: {
            type: Array,
            default: () => []
        },

        keyidx: {
            type: String,
            required: '0'
        }
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },

    methods: {
        selectCoin(index) {
            this.$emit('select', index)
        },

        formatPrice(price, decimals = 4) {
            return Number(price || 0).toFixed(decimals)
        },

        formatIncrease(increase) {
            return Number((increase || 0) * 100).toFixed(2) + '%'
        },

        getIncreaseClass(increase) {
            return increase > 0 ? 'up' : increase < 0 ? 'down' : 'flat'
        },
        getRowStyle(index) {
            const style = {
                borderBottom: `0.5rpx solid ${this.theme.neutral__200}`
            }
            if (String(this.keyidx) == String(index)) {
                style.backgroundColor = this.getColorWithOpacity(this.theme.primary__500, 0.1)
                style.borderLeft = `4rpx solid ${this.theme.primary__500}`
            }
            return style
        },
        getChangeStyle(increase) {
            if (increase > 0) {
                return {
                    background: this.getColorWithOpacity(this.theme.success, 0.15),
                    color: this.theme.success
                }
            } else if (increase < 0) {
                return {
                    background: this.getColorWithOpacity(this.theme.danger, 0.15),
                    color: this.theme.danger
                }
            } else {
                return {
                    background: this.theme.neutral__700,
                    color: this.theme.neutral__300
                }
            }
        },
        getColorWithOpacity(color, opacity) {
            if (color && color.startsWith('#')) {
                const hex = color.substring(1);
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
            return color;
        }
    }
}
</script>

<style lang="scss" scoped>
.coin-selector-container {
    width: 600rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 30rpx 0;
}

.coin-scroll-view {
    flex: 1;
    height: 100%;
    width: 100%;
}

.coin-list {
    width: 100%;
}

// Row layout
.coin-row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    transition: all 0.3s ease;
    min-height: 100rpx;
    box-sizing: border-box;

    &:active {
        opacity: 0.8;
        transform: scale(0.98);
    }

    &:last-child {
        border-bottom: none !important;
    }
}

.coin-row__left {
    display: flex;
    align-items: baseline;
    flex-direction: column;
    gap: 12rpx;
}

.coin-name {
    font-size: 32rpx;
    font-weight: 600;
}

.coin-symbol {
    font-size: 24rpx;
}

.coin-row__right {
    display: flex;
    align-items: center;
    gap: 18rpx;
}

.coin-price {
    font-size: 28rpx;
    font-family: "Medium" !important;
}

.coin-change {
    min-width: 140rpx;
    text-align: right;
    font-size: 24rpx;
    padding: 6rpx 14rpx;
    border-radius: 20rpx;
    font-weight: bold;
}
</style>
