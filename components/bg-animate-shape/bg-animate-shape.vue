<template>
    <view>
        <view class="shape-background">
            <view class="shape-background-item shape-1"></view>
            <view class="shape-background-item shape-2"></view>
            <view class="shape-background-item shape-3"></view>
            <view class="shape-background-item shape-4"></view>
            <view class="shape-background-item shape-5"></view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'BgAnimateShape',
    computed: {
        theme() {
            return this.$store?.getters?.theme || {}
        }
    }
}
</script>

<style lang="scss" scoped>
.shape-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.shape-background-item {
  position: absolute;
  filter: blur(80px);
  opacity: 0.25;

  &.shape-1 {
    width: 350rpx;
    height: 350rpx;
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--primary) 100%);
    border-radius: 50%;
    top: 8%;
    left: -12%;
  }

  &.shape-2 {
    width: 450rpx;
    height: 450rpx;
    background: linear-gradient(225deg, var(--secondary) 0%, var(--primary) 50%, var(--secondary) 100%);
    border-radius: 40%;
    top: 55%;
    right: -18%;
  }

  &.shape-3 {
    width: 280rpx;
    height: 280rpx;
    background: linear-gradient(45deg, var(--primary) 0%, var(--secondary) 50%, var(--primary) 100%);
    border-radius: 60% 40% 30% 70%;
    top: 30%;
    left: 70%;
  }

  &.shape-4 {
    width: 200rpx;
    height: 200rpx;
    background: linear-gradient(315deg, var(--secondary) 0%, var(--primary) 50%, var(--secondary) 100%);
    border-radius: 30% 70% 70% 30%;
    top: 70%;
    left: 15%;
  }

  &.shape-5 {
    width: 320rpx;
    height: 320rpx;
    background: linear-gradient(180deg, var(--primary) 0%, var(--secondary) 50%, var(--primary) 100%);
    border-radius: 70% 30% 50% 50%;
    top: 15%;
    right: 25%;
  }
}

</style>
