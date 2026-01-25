<template>
  <view class="v-bottom-sheet" :style="containerStyle">
    <!-- Backdrop -->
    <view
      v-if="visible"
      class="v-bottom-sheet__backdrop"
      :class="{ 'v-bottom-sheet__backdrop--visible': visible }"
      @click="handleBackdropClick"
    ></view>

    <!-- Sheet Content -->
    <view
      class="v-bottom-sheet__content"
      :class="[
        { 'v-bottom-sheet__content--visible': visible },
        { 'v-bottom-sheet__content--fullscreen': fullscreen }
      ]"
      :style="contentStyle"
    >
      <!-- Handle -->
      <view class="v-bottom-sheet__handle"></view>

      <!-- Header -->
      <view v-if="$slots.header || title" class="v-bottom-sheet__header">
        <slot name="header">
          <text class="v-bottom-sheet__title">{{ title }}</text>
        </slot>
      </view>

      <!-- Body -->
      <view class="v-bottom-sheet__body">
        <slot></slot>
      </view>

      <!-- Footer -->
      <view v-if="$slots.footer" class="v-bottom-sheet__footer">
        <slot name="footer"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'v-bottom-sheet',
  props: {
    // Whether the bottom sheet is visible
    value: {
      type: Boolean,
      default: false
    },
    // Bottom sheet title
    title: {
      type: String,
      default: ''
    },
    // Whether to use fullscreen mode
    fullscreen: {
      type: Boolean,
      default: false
    },
    // Custom background color
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    // Custom text color
    textColor: {
      type: String,
      default: '#333333'
    },
    // Whether to close on backdrop click
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentZIndex: 1000
    }
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    contentStyle() {
      return {
        backgroundColor: this.backgroundColor,
        color: this.textColor
      }
    },
    containerStyle() {
      return {
        zIndex: this.currentZIndex
      }
    }
  },
  methods: {
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.visible = false;
      }
    }
  },
  watch: {
    value(newValue) {
      if (newValue) {
        // Prevent body scroll when sheet is open
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
      }
    }
  }
}
</script>

<style lang="scss">
.v-bottom-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  // Backdrop
  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: auto;

    &--visible {
      opacity: 1;
    }
  }

  // Content
  &__content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    border-radius: 24rpx 24rpx 0 0;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    pointer-events: auto;
    max-height: 90vh;
    display: flex;
    flex-direction: column;

    &--visible {
      transform: translateY(0);
    }

    &--fullscreen {
      border-radius: 0;
      max-height: 100vh;
    }
  }

  // Handle
  &__handle {
    width: 40rpx;
    height: 4rpx;
    background-color: #e0e0e0;
    border-radius: 2rpx;
    margin: 12rpx auto;
  }

  // Header
  &__header {
    padding: 24rpx 32rpx;
    border-bottom: 2rpx solid #f5f5f5;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    line-height: 1.4;
  }

  // Body
  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 24rpx 32rpx;
  }

  // Footer
  &__footer {
    padding: 24rpx 32rpx;
    border-top: 2rpx solid #f5f5f5;
  }
}
</style>
