<template>
  <view 
    class="v-container"
    :class="[
      `v-container--${size}`,
      { 'v-container--fluid': fluid },
      { 'v-container--padding': padding },
      { 'v-container--safe-top': safeTop },
      { 'v-container--safe-bottom': safeBottom },
      { 'v-container--with-header': withHeader }
    ]"
    :style="containerStyle"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: 'v-container',
  props: {
    // Container size: xs, sm, md, lg, xl
    size: {
      type: String,
      default: 'md',
      validator: value => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    // Whether to use fluid width (no max-width)
    fluid: {
      type: Boolean,
      default: false
    },
    // Whether to add padding
    padding: {
      type: Boolean,
      default: true
    },
    // Whether to respect top safe area
    safeTop: {
      type: Boolean,
      default: false
    },
    // Whether to respect bottom safe area
    safeBottom: {
      type: Boolean,
      default: false
    },
    // Whether container is used with header
    withHeader: {
      type: Boolean,
      default: false
    },
    // Custom header height (if withHeader is true)
    headerHeight: {
      type: String,
      default: ''
    },
    // Custom background color
    backgroundColor: {
      type: String,
      default: ''
    },
    // Custom text color
    textColor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      safeAreaTop: 0,
      safeAreaBottom: 0
    }
  },
  created() {
    // Get system info for safe areas
    const systemInfo = uni.getSystemInfoSync()
    if (systemInfo.safeArea) {
      this.safeAreaTop = systemInfo.safeArea.top
      this.safeAreaBottom = systemInfo.screenHeight - systemInfo.safeArea.bottom
    }
  },
  computed: {
    containerStyle() {
      const style = {}
      if (this.backgroundColor) {
        style.backgroundColor = this.backgroundColor
      }
      if (this.textColor) {
        style.color = this.textColor
      }
      if (this.safeTop) {
        style.paddingTop = `${this.safeAreaTop}px`
      }
      if (this.safeBottom) {
        style.paddingBottom = `${this.safeAreaBottom}px`
      }
      if (this.withHeader && this.headerHeight) {
        style.paddingTop = `${this.headerHeight}`
      }
      return style
    }
  }
}
</script>

<style lang="scss">
.v-container {
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  transition: all 0.3s ease;

  // Container sizes
  &--xs {
    max-width: 600rpx;
  }

  &--sm {
    max-width: 720rpx;
  }

  &--md {
    max-width: 960rpx;
  }

  &--lg {
    max-width: 1140rpx;
  }

  &--xl {
    max-width: 1320rpx;
  }

  // Fluid container
  &--fluid {
    max-width: 100%;
  }

  // Padding
  &--padding {
    padding-left: 30rpx;
    padding-right: 30rpx;
  }

  // Safe area handling
  &--safe-top {
    padding-top: env(safe-area-inset-top);
  }

  &--safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }

  // Header integration
  &--with-header {
    padding-top: calc(88rpx + env(safe-area-inset-top));
  }

  // Responsive breakpoints
  @media screen and (max-width: 768px) {
    &--padding {
      padding-left: 20rpx;
      padding-right: 20rpx;
    }
  }

  @media screen and (max-width: 480px) {
    &--padding {
      padding-left: 16rpx;
      padding-right: 16rpx;
    }
  }
}
</style>
