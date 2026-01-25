<template>
  <view @click="onItemClick" class="listBox" :class="bdItem">
    <view class="flex align-center justify-between">
      <view class="flex-1 flex align-center gap-20">
        <u-image shape="circle" width="70rpx" height="70rpx" :src="item.logo_image">
          <u-loading-icon slot="loading"></u-loading-icon>
        </u-image>
        <view class="flex direction-column align-start gap-10">
          <text :class="ctxtColor" class="font-30 numbold-font" :style="{ color: theme.textPrimary }">{{ item.name }}</text>
          <text class="font-22" :style="{ color: theme.textTertiary }">{{ item.symbol }}</text>
        </view>
      </view>
       <view v-if="barChart" class="flex-1 flex align-center justify-center">
                <view class="mock-chart" :class="{ 'up-chart': item.increase >= 0, 'down-chart': item.increase < 0 }"
                      :style="{ color: getChartColor(item.increase) }">
                    <view v-for="(bar, index) in mockChartBars" :key="index"
                          class="chart-bar"
                          :style="{ height: bar + '%', background: getChartColor(item.increase) }">
                    </view>
                </view>
            </view>

      <view class="flex flex-direction gap-5 flex-1">
        <view class="flex flex-1 justify-end">
          <view :class="[item.increase < 0 ? 'downs' : 'ups']"
            class="nummedium-font text-center  radiu-10 padding-c-10 padding-w-20"
            :style="getChangeStyle(item.increase)">
            {{ formattedIncrease }}
          </view>
        </view>
      </view>
      <view class="flex flex-direction gap-5 flex-1">
        <view class="flex-1 text-right">
          <text :class="ctxtColor" class="font-28 nummedium-font" :style="{ color: theme.textPrimary }">{{ formattedPrice }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CryptoForex',

  props: {
    item: {
      type: Object,
      required: true,
      default: () => ({})
    },
    bdItem: {
      type: String,
      required: true
    },
    ctxtColor: {
      type: String,
      required: true
    },
      barChart: {
        type: Boolean,
        default: false
      }
  },

  data() {
    return {
      mockChartBars: [],
      isAnimating: false
    }
  },

  mounted() {
    this.initChartData()
  },

  computed: {
    theme() {
      return this.$store.getters.theme
    },
    formattedPrice() {
      return Number(this.item.close).toFixed(4)
    },

    formattedIncrease() {
      const sign = this.item.increase < 0 ? '' : '+'
      return `${sign}${(this.item.increase * 100).toFixed(6)}%`
    },
    formartProfit() {
      const sign = this.item.increase < 0 ? '' : '+'
      return `${sign}${((this.item.close * this.item.increase) / 100).toFixed(4)}`
    }
  },

  methods: {
    onItemClick() {
      this.$emit('click', this.item)
    },
    getChangeStyle(increase) {
      if (increase < 0) {
        return {
          color: this.theme.danger
        }
      }
      return {
        color: this.theme.success
      }
    },
    getChartColor(increase) {
      if (increase < 0) {
        return this.getColorWithOpacity(this.theme.danger, 0.5)
      }
      return this.getColorWithOpacity(this.theme.success, 0.5)
    },
    getChartHoverColor(increase) {
      if (increase < 0) {
        return this.getColorWithOpacity(this.theme.danger, 0.8)
      }
      return this.getColorWithOpacity(this.theme.success, 0.8)
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
    },

    initChartData() {
      const bars = []
      const baseHeight = 40
      const variance = 20

      for (let i = 0; i < 8; i++) {
        const randomVariance = Math.random() * variance - (variance / 2)
        bars.push(0) // Start with zero height
      }

      this.mockChartBars = bars
      this.animateChartBars()
    },

    animateChartBars() {
      if (this.isAnimating) return
      this.isAnimating = true

      const finalHeights = []
      const baseHeight = 40
      const variance = 20

      for (let i = 0; i < 8; i++) {
        const randomVariance = Math.random() * variance - (variance / 2)
        finalHeights.push(baseHeight + randomVariance)
      }

      // Animate each bar with a delay
      finalHeights.forEach((height, index) => {
        setTimeout(() => {
          this.$set(this.mockChartBars, index, height)
          if (index === finalHeights.length - 1) {
            setTimeout(() => {
              this.isAnimating = false
            }, 300)
          }
        }, index * 100)
      })
    }
  },

  watch: {
    'item.increase'() {
      this.animateChartBars()
    }
  }
}
</script>

<style lang="scss" scoped>
.listBox {
  width: 100%;
  border-radius: 15rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  .ups, .downs {
		width: 66px;
		line-height: 24px;
        font-size: 28rpx;
        border-radius: 8rpx;
        padding: 4rpx 0rpx;
         min-width: 120rpx;
        text-align: center;
         transition: all 0.3s ease;
    }

  .mock-chart {
    display: flex;
    align-items: flex-end;
    gap: 4rpx;
    height: 60rpx;
    width: 80%;
    padding: 4rpx;
    opacity: 0.8;

    .chart-bar {
      flex: 1;
      background: currentColor;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 4rpx;
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover::after {
        opacity: 1;
      }
    }

    &.up-chart {
      .chart-bar {
        &:hover {
          transform: scaleY(1.1);
        }
      }
    }

    &.down-chart {
      .chart-bar {
        &:hover {
          transform: scaleY(1.1);
        }
      }
    }
  }
}
</style>
