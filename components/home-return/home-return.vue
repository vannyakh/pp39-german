<template>
    <view class="home-return-container" @click="handleReturn">
        <view class="floating-button">
            <view class="button-background">
                <view class="button-content">
                    <u-icon
                        name="home-fill"
                        size="24"
                        color="#fff"
                        class="home-icon"
                    ></u-icon>
                </view>
            </view>
            <view class="ripple-effect"></view>
        </view>
    </view>
</template>

<script>
export default {
    name:"home-return",
    methods: {
        handleReturn() {
            // Add haptic feedback
            // #ifdef APP-PLUS
            uni.vibrateShort()
            // #endif

            this.router.push('/pages/index/index') || this.router.goTabBar('/pages/index/index');
        }
    }
}
</script>

<style lang="scss" scoped>
.home-return-container {
    position: fixed;
    bottom: 120rpx;
    right: 40rpx;
    z-index: 9999;
    cursor: pointer;
}

.floating-button {
    position: relative;
    width: 100rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:active {
        transform: scale(0.95);

        .button-background {
            transform: scale(0.95);
            box-shadow: 0 8rpx 24rpx rgba(75, 108, 255, 0.4);
        }

        .ripple-effect {
            animation: ripple 0.6s ease-out;
        }
    }

    &:hover {
        .button-background {
            transform: translateY(-4rpx);
            box-shadow: 0 12rpx 32rpx rgba(75, 108, 255, 0.3);
        }
    }
}

.button-background {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%);
    box-shadow:
        0 8rpx 24rpx rgba(75, 108, 255, 0.25),
        0 4rpx 8rpx rgba(0, 0, 0, 0.1),
        inset 0 2rpx 4rpx rgba(255, 255, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10rpx);
    border: 1rpx solid rgba(255, 255, 255, 0.1);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        pointer-events: none;
    }
}

.button-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.home-icon {
    filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
    transition: transform 0.2s ease;
}

.ripple-effect {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%) scale(0);
    pointer-events: none;
}

@keyframes ripple {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}

// Floating animation
.floating-button {
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8rpx);
    }
}

// Pulse glow effect
.button-background::after {
    content: '';
    position: absolute;
    top: -4rpx;
    left: -4rpx;
    right: -4rpx;
    bottom: -4rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%);
    opacity: 0.3;
    z-index: -1;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.3;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.1;
    }
}

// Responsive design
@media (max-width: 750rpx) {
    .home-return-container {
        bottom: 100rpx;
        right: 32rpx;
    }

    .floating-button {
        width: 88rpx;
        height: 88rpx;
    }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
    .button-background {
        box-shadow:
            0 8rpx 24rpx rgba(75, 108, 255, 0.3),
            0 4rpx 8rpx rgba(0, 0, 0, 0.2),
            inset 0 2rpx 4rpx rgba(255, 255, 255, 0.15);
    }
}
</style>
