<template>
  <view class="label-marquee-container" :style="containerStyle">
    <view v-if="needsMarquee" class="label-marquee-wrap">
      <view
        class="label-marquee-content"
        :style="marqueeStyle"
        @animationiteration="onAnimationIteration"
      >
        <text>{{ text }}</text>
        <text>{{ text }}</text>
      </view>
      <view class="label-marquee-blur label-marquee-blur--left"></view>
      <view class="label-marquee-blur label-marquee-blur--right"></view>
    </view>
    <text v-else class="label-marquee-static" :style="staticTextStyle">{{ text }}</text>
  </view>
</template>

<script>
export default {
  name: 'LabelMarquee',
  props: {
    text: {
      type: String,
      default: ''
    },
    speed: {
      // Lower is faster (seconds for one loop)
      type: Number,
      default: 15
    },
    direction: {
      type: String,
      default: 'left', // 'left' or 'right'
      validator: v => ['left', 'right'].includes(v)
    },
    containerWidth: {
      type: Number,
      default: 200 // rpx
    },
    fontSize: {
      type: Number,
      default: 24 // rpx
    },
    color: {
      type: String,
      default: '#333'
    },
    threshold: {
      // Minimum characters before marquee triggers
      type: Number,
      default: 10
    }
  },
  computed: {
    needsMarquee() {
      // Simple check: if text is longer than threshold, enable marquee
      return this.text && this.text.length > this.threshold;
    },
    containerStyle() {
      return {
        width: this.containerWidth + 'rpx',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    },
    marqueeStyle() {
      return {
        display: 'flex',
        width: 'max-content',
        animation: `label-marquee-loop-${this._uid} ${this.speed}s linear infinite`,
        whiteSpace: 'nowrap',
        flexDirection: this.direction === 'left' ? 'row' : 'row-reverse',
        fontSize: this.fontSize + 'rpx',
        color: this.color
      };
    },
    staticTextStyle() {
      return {
        fontSize: this.fontSize + 'rpx',
        color: this.color,
        textAlign: 'center',
        wordBreak: 'break-all'
      };
    }
  },
  mounted() {
    // Inject keyframes for this instance (scoped by _uid)
    if (!document.getElementById(`label-marquee-keyframes-${this._uid}`)) {
      const style = document.createElement('style');
      style.id = `label-marquee-keyframes-${this._uid}`;
      // Animation keyframes depend on direction
      let keyframes = '';
      if (this.direction === 'left') {
        keyframes = `
          @keyframes label-marquee-loop-${this._uid} {
            0%   { transform: translateX(0); }
            70.6% { transform: translateX(-50%); }
            100% { transform: translateX(-50%); }
          }
        `;
      } else {
        keyframes = `
          @keyframes label-marquee-loop-${this._uid} {
            0%   { transform: translateX(-50%); }
            70.6% { transform: translateX(0); }
            100% { transform: translateX(0); }
          }
        `;
      }
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
  },
  methods: {
    onAnimationIteration() {
      // Optional: emit event on loop
      this.$emit('loop');
    }
  }
};
</script>

<style lang="scss" scoped>
.label-marquee-container {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.label-marquee-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.label-marquee-content {
  white-space: nowrap;
  display: flex;
  width: max-content;
  align-items: center;
}

.label-marquee-static {
  font-size: inherit;
  color: inherit;
  text-align: center;
  word-break: break-all;
}

.label-marquee-blur {
  position: absolute;
  top: 0;
  width: 20rpx;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  &--left {
    left: 0;
    background: linear-gradient(to right, rgba(46,46,46,0), rgba(255,255,255,0));
  }
  &--right {
    right: 0;
    background: linear-gradient(to left, rgba(46,46,46,0), rgba(255,255,255,0));
  }
}

.label-marquee-content text {
  white-space: nowrap;
  display: inline-block;
  padding-right: 40rpx;
}
</style>
