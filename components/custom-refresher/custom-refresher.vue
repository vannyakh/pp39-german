<template>
    <view class="refresher-container" :style="{ height: `${height}rpx` }">
        <view class="refresher-content" :class="[status, { 'disabled': disabled }]">
            <view class="image-wrapper" :class="{ 'loading': status === 'loading' }">
                <image
                        class="refresher-image"
                        mode="aspectFit"
                        :src="icon"
                        :alt="statusText"
                />
            </view>
            <text class="refresher-text" :class="status">{{statusText}}</text>
        </view>
    </view>
</template>

<script>
export default {
    name: 'CustomRefresher',
    props: {
        status: {
            type: String,
            default: 'default',
            validator: (value) => ['default', 'release-to-refresh', 'loading', 'complete'].includes(value)
        },
        icon: {
            type: String,
            default: '/static/logo.png'
        },
        height: {
            type: [Number, String],
            default: 150
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        statusText() {
            const statusTextMap = {
                'default': this.$t('common.zPaging.default'),
                'release-to-refresh': this.$t('common.zPaging.releaseToRefresh'),
                'loading': this.$t('common.zPaging.loading'),
                'complete': this.$t('common.zPaging.complete'),
            };
            return statusTextMap[this.status] || statusTextMap['default'];
        }
    }
}
</script>

<style lang="scss" scoped>
.refresher-container {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
  justify-content: center;
  width: 100%;
}

.refresher-content {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.3s ease;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.image-wrapper {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 16rpx;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
  justify-content: center;
  transform: rotate(0deg);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.loading {
    animation: spin 1s linear infinite;
  }
}

.refresher-content.release-to-refresh .image-wrapper {
  transform: rotate(180deg);
}

.refresher-image {
  width: 60rpx;
  height: 60rpx;
  will-change: transform;
}

.refresher-text {
  font-size: 24rpx;
  color: var(--text-secondary);
  transition: color 0.3s ease;
  text-align: center;
}

.refresher-content.loading .refresher-text,
.refresher-content.release-to-refresh .refresher-text {
  color: var(--primary);
}

/* #ifndef APP-NVUE */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
/* #endif */

/* #ifdef APP-NVUE */
.image-wrapper.loading {
  transform: rotate(360deg);
}
/* #endif */
</style>

