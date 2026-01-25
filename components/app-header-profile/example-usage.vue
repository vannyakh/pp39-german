<template>
  <view class="example-page">
    <view class="example-section">
      <text class="example-title">App Header Profile Component Examples</text>

      <!-- Example 1: Using API Data Object -->
      <view class="example-item">
        <text class="example-subtitle">1. Using API Data Object (Recommended)</text>
        <app-header-profile
          :user-data="apiUserData"
          @avatar-click="handleAvatarClick"
          @content-click="handleContentClick"
          @action-click="handleSupportClick"
        />
      </view>

      <!-- Example 2: Individual Props -->
      <view class="example-item">
        <text class="example-subtitle">2. Using Individual Props</text>
        <app-header-profile
          username="1888888888"
          :avatar-url="apiUserData.avatar"
          :is-verified="apiUserData.is_auth"
          @action-click="handleSupportClick"
        />
      </view>

      <!-- Example 3: Large Size with Online Status -->
      <view class="example-item">
        <text class="example-subtitle">3. Large Size with Online Status</text>
        <app-header-profile
          :user-data="apiUserData"
          size="large"
          show-online-status
          online-status="online"
          @action-click="handleSupportClick"
        />
      </view>

      <!-- Example 4: Custom Action Button with Emoji -->
      <view class="example-item">
        <text class="example-subtitle">4. Custom Action Button (Emoji)</text>
        <app-header-profile
          :user-data="apiUserData"
          action-type="settings"
          action-icon="⚙️"
          @action-click="handleSettingsClick"
        />
      </view>

      <!-- Example 5: uView Icons -->
      <view class="example-item">
        <text class="example-subtitle">5. uView Icons</text>
        <app-header-profile
          :user-data="apiUserData"
          action-type="support"
          action-icon-type="uview"
          action-icon="kefu"
          action-icon-size="28"
          @action-click="handleSupportClick"
        />
        <text class="example-note">Using uView kefu icon</text>
      </view>

      <!-- Example 6: Dark Theme -->
      <view class="example-item">
        <text class="example-subtitle">6. Dark Theme</text>
        <app-header-profile
          :user-data="apiUserData"
          theme="dark"
          action-type="notification"
          action-icon="🔔"
          @action-click="handleNotificationClick"
        />
      </view>
    </view>
  </view>
</template>

<script>
import AppHeaderProfile from './app-header-profile.vue'

export default {
  name: 'ExampleUsage',
  components: {
    AppHeaderProfile
  },
  data() {
    return {
      // Your API response data
      apiUserData: {
        id: 2,
        cds_code: "034553341",
        pay_pwd: "AC86C867FEE98DDC3D1CE6649A5F9704",
        mobile: "1888888888",
        username: "1888888888",
        email: "",
        avatar: "",
        xinyu: 100,
        m_prefix: "60",
        is_auth: true
      }
    }
  },
  methods: {
    handleAvatarClick(data) {
      console.log('Avatar clicked:', data)
      uni.showToast({
        title: 'Avatar clicked',
        icon: 'none'
      })
    },

    handleContentClick(data) {
      console.log('Content clicked:', data)
      uni.showToast({
        title: 'User info clicked',
        icon: 'none'
      })
    },

    handleSupportClick(data) {
      console.log('Support clicked:', data)
      uni.showToast({
        title: 'Support clicked',
        icon: 'none'
      })
    },

    handleSettingsClick(data) {
      console.log('Settings clicked:', data)
      uni.showToast({
        title: 'Settings clicked',
        icon: 'none'
      })
    },

    handleNotificationClick(data) {
      console.log('Notification clicked:', data)
      uni.showToast({
        title: 'Notification clicked',
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.example-page {
  padding: 20rpx;
  background-color: var(--bg-color);
  min-height: 100vh;
}

.example-section {
  max-width: 750rpx;
  margin: 0 auto;
}

.example-title {
  font-size: 36rpx;
  font-weight: bold;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 40rpx;
  display: block;
}

.example-item {
  margin-bottom: 40rpx;
  background-color: var(--white);
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.example-subtitle {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 20rpx;
  display: block;
}
</style>
