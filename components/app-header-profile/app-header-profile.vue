<template>
  <view class="app-header-profile" :class="[`app-header-profile--${size}`, { 'app-header-profile--verified': displayIsVerified }]">
    <!-- Profile Picture -->
    <view class="app-header-profile__avatar" @click="handleAvatarClick">
      <image
        v-if="displayAvatarUrl"
        :src="displayAvatarUrl"
        class="app-header-profile__avatar-image"
        mode="aspectFill"
      />
      <view v-else class="app-header-profile__avatar-placeholder">
        <text class="app-header-profile__avatar-text">{{ avatarText }}</text>
      </view>
      <view v-if="showOnlineStatus" class="app-header-profile__online-status" :class="`app-header-profile__online-status--${onlineStatus}`"></view>
    </view>

    <!-- User Info -->
    <view class="app-header-profile__content" @click="handleContentClick">
      <view class="app-header-profile__greeting">
        <text class="app-header-profile__greeting-text">{{ greeting }}</text>
        <text class="app-header-profile__username">{{ displayUsername }}</text>
      </view>

      <view class="app-header-profile__status">
        <text v-if="displayIsVerified" class="app-header-profile__verified-text">{{ verifiedText }}</text>
        <view v-if="displayIsVerified && showVerifiedIcon" class="app-header-profile__verified-badge">
          <u-icon
            v-if="verifiedIconType === 'uview'"
            :name="verifiedIcon"
            :size="verifiedIconSize"
            :color="verifiedIconColor || '#fff'"
          />
          <text v-else-if="verifiedIconType === 'class'" :class="['app-header-profile__verified-icon', verifiedIcon]"></text>
          <text v-else class="app-header-profile__verified-icon">{{ verifiedIcon }}</text>
        </view>
        <text v-if="!displayIsVerified && unverifiedStatusText" class="app-header-profile__status-text">{{ unverifiedStatusText }}</text>
        <view v-if="!displayIsVerified && showUnverifiedIcon" class="app-header-profile__unverified-badge">
          <u-icon
            v-if="unverifiedIconType === 'uview'"
            :name="unverifiedIcon"
            :size="unverifiedIconSize"
            :color="unverifiedIconColor || '#fff'"
          />
          <text v-else-if="unverifiedIconType === 'class'" :class="['app-header-profile__unverified-icon', unverifiedIcon]"></text>
          <text v-else class="app-header-profile__unverified-icon">{{ unverifiedIcon }}</text>
        </view>
      </view>
    </view>

    <!-- Action Button -->
    <view class="app-header-profile__action" @click="handleActionClick">
      <view class="app-header-profile__action-icon" :class="`app-header-profile__action-icon--${actionType}`">
        <u-icon
          v-if="actionIconType === 'uview'"
          :name="actionIcon"
          :size="actionIconSize"
          :color="actionIconColor"
        />
        <text v-else class="app-header-profile__action-text">{{ actionIcon }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AppHeaderProfile',
  props: {
    // User Info
    username: {
      type: String,
      default: ''
    },
    greeting: {
      type: String,
      default: 'Hello'
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    avatarText: {
      type: String,
      default: 'U'
    },

    // API Data Object (optional - can pass entire user object)
    userData: {
      type: Object,
      default: () => ({})
    },

    // Verification
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedText: {
      type: String,
      default: 'Verified'
    },

    // Verified icon configuration
    showVerifiedIcon: {
      type: Boolean,
      default: true
    },
    verifiedIconType: {
      type: String,
      default: 'class', // class, uview, text
      validator: (value) => ['class', 'uview', 'text'].includes(value)
    },
    verifiedIcon: {
      type: String,
      default: 'cuIcon-check' // when type==='uview', pass u-icon name (e.g., 'checkmark')
    },
    verifiedIconSize: {
      type: [String, Number],
      default: 16
    },
    verifiedIconColor: {
      type: String,
      default: ''
    },

    // Unverified icon configuration
    showUnverifiedIcon: {
      type: Boolean,
      default: true
    },
    unverifiedIconType: {
      type: String,
      default: 'class', // class, uview, text
      validator: (value) => ['class', 'uview', 'text'].includes(value)
    },
    unverifiedIcon: {
      type: String,
      default: 'cuIcon-close' // when type==='uview', pass u-icon name (e.g., 'close'
    },
    unverifiedIconSize: {
      type: [String, Number],
      default: 16
    },
    unverifiedIconColor: {
      type: String,
      default: ''
    },

    // Text to display when not verified (fallbacks to statusText if empty)
    unVerifiedText: {
      type: String,
      default: 'Unverified'
    },

    // Status
    statusText: {
      type: String,
      default: ''
    },
    showOnlineStatus: {
      type: Boolean,
      default: false
    },
    onlineStatus: {
      type: String,
      default: 'online', // online, offline, away
      validator: (value) => ['online', 'offline', 'away'].includes(value)
    },

    // Action Button
    actionType: {
      type: String,
      default: 'support', // support, settings, notification, custom
      validator: (value) => ['support', 'settings', 'notification', 'custom'].includes(value)
    },
    actionIcon: {
      type: String,
      default: '🎧'
    },
    actionIconType: {
      type: String,
      default: 'emoji', // emoji, uview
      validator: (value) => ['emoji', 'uview'].includes(value)
    },
    actionIconSize: {
      type: [String, Number],
      default: 24
    },
    actionIconColor: {
      type: String,
      default: ''
    },

    // Appearance
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    theme: {
      type: String,
      default: 'light', // light, dark
      validator: (value) => ['light', 'dark'].includes(value)
    },

    // Masking
    maskUsername: {
      type: Boolean,
      default: true
    },
    maskPattern: {
      type: String,
      default: '****'
    },

    // Mobile number formatting
    showMobilePrefix: {
      type: Boolean,
      default: true
    },

    // Store integration
    useStore: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['userinfo']),

    // Get user data from store, props, or userData object
    currentUserData() {
      // Priority: userData prop > store userinfo > individual props
      if (Object.keys(this.userData).length > 0) {
        return this.userData
      }

      if (this.useStore && this.userinfo && Object.keys(this.userinfo).length > 0) {
        return this.userinfo
      }

      return {
        username: this.username,
        avatar: this.avatarUrl,
        is_auth: this.isVerified,
        mobile: this.username,
        m_prefix: '60'
      }
    },

    displayUsername() {
      const username = this.currentUserData.username || this.currentUserData.mobile || this.username
      if (!username) return ''

      if (this.maskUsername && username.length > 3) {
        const start = username.substring(0, 3)
        const end = username.substring(username.length - 3)
        return `${start}${this.maskPattern}${end}`
      }

      return username
    },

    displayAvatarUrl() {
      return this.currentUserData.avatar || this.avatarUrl
    },

    displayIsVerified() {
      return this.currentUserData.is_auth !== undefined ? this.currentUserData.is_auth : this.isVerified
    },

    displayMobilePrefix() {
      return this.currentUserData.m_prefix || '60'
    },

    // Prefer explicit unVerifiedText, fallback to legacy statusText
    unverifiedStatusText() {
      if (this.displayIsVerified) return ''
      return this.unVerifiedText || this.statusText
    }
  },
  methods: {
    handleAvatarClick() {
      this.$emit('avatar-click', {
        username: this.displayUsername,
        avatarUrl: this.displayAvatarUrl,
        userData: this.currentUserData
      })
    },

    handleContentClick() {
      this.$emit('content-click', {
        username: this.displayUsername,
        isVerified: this.displayIsVerified,
        userData: this.currentUserData
      })
    },

    handleActionClick() {
      this.$emit('action-click', {
        actionType: this.actionType,
        actionIcon: this.actionIcon,
        actionIconType: this.actionIconType,
        userData: this.currentUserData
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header-profile {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background-color: var(--card-glass-bg);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

  &--small {
    padding: 15rpx 20rpx;

    .app-header-profile__avatar {
      width: 60rpx;
      height: 60rpx;
    }

    .app-header-profile__greeting-text {
      font-size: 24rpx;
    }

    .app-header-profile__username {
      font-size: 24rpx;
    }

    .app-header-profile__verified-text {
      font-size: 20rpx;
    }

    .app-header-profile__action-icon {
      width: 50rpx;
      height: 50rpx;
    }
  }

  &--large {
    padding: 30rpx 40rpx;

    .app-header-profile__avatar {
      width: 100rpx;
      height: 100rpx;
    }

    .app-header-profile__greeting-text {
      font-size: 32rpx;
    }

    .app-header-profile__username {
      font-size: 32rpx;
    }

    .app-header-profile__verified-text {
      font-size: 28rpx;
    }

    .app-header-profile__action-icon {
      width: 80rpx;
      height: 80rpx;
    }
  }

  &--verified {
    .app-header-profile__verified-badge {
      background-color: var(--primary);
    }
  }
}

.app-header-profile__avatar {
  position: relative;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.app-header-profile__avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.app-header-profile__avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.app-header-profile__avatar-text {
  color: var(--white);
  font-size: 28rpx;
  font-weight: bold;
}

.app-header-profile__online-status {
  position: absolute;
  bottom: 2rpx;
  right: 2rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  border: 2rpx solid var(--white);

  &--online {
    background-color: #4cd964;
  }

  &--offline {
    background-color: #c0c0c0;
  }

  &--away {
    background-color: #f0ad4e;
  }
}

.app-header-profile__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.app-header-profile__greeting {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.app-header-profile__greeting-text {
  font-size: 28rpx;
  color: var(--text-color);
  margin-right: 8rpx;
}

.app-header-profile__username {
  font-size: 28rpx;
  color: var(--text-color);
  font-weight: 500;
}

.app-header-profile__status {
  display: flex;
  align-items: center;
}

.app-header-profile__verified-text {
  font-size: 24rpx;
  color: var(--text-color);
  margin-right: 8rpx;
}

.app-header-profile__verified-badge {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header-profile__verified-icon {
  color: var(--white);
  font-size: 16rpx;
  font-weight: bold;
}

.app-header-profile__unverified-badge {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background-color: #f0ad4e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header-profile__unverified-icon {
  color: var(--white);
  font-size: 16rpx;
  font-weight: bold;
}

.app-header-profile__status-text {
  font-size: 24rpx;
  color: var(--secondary-color);
  margin-right: 8rpx;
}

.app-header-profile__action {
  margin-left: 20rpx;
  flex-shrink: 0;
}

.app-header-profile__action-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &--support {
    background-color: var(--secondary-50);
    color: var(--secondary);
  }

  &--settings {
    background-color: var(--primary-50);
    color: var(--primary);
  }

  &--notification {
    background-color: #ff6b6b;
    color: var(--white);
  }

  &--custom {
    background-color: var(--primary-50);
    color: var(--primary);
  }

  &:active {
    transform: scale(0.95);
  }
}

.app-header-profile__action-text {
  font-size: 24rpx;
}

/* Dark theme support */
.app-header-profile--dark {
  background-color: var(--card-background);

  .app-header-profile__greeting-text,
  .app-header-profile__username,
  .app-header-profile__verified-text {
    color: var(--text-primary);
  }

  .app-header-profile__status-text {
    color: var(--secondary-color);
  }
}
</style>
