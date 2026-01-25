<template>
    <view class="app-nav">
        <view class="app-nav__container" :style="{ height: `calc(${statusBarHeight}px + ${navHeight}px)` }">
            <view class="app-nav__wrapper" :class="{'app-nav__wrapper--blur': blur}" :style="{
                height: `calc(${statusBarHeight}px + ${navHeight}px)`,
                background: computedBackgroundColor
            }">
                <view class="app-nav__content" :style="{
                    paddingTop: statusBarHeight + 'px',
                    height: `calc(${statusBarHeight}px + ${navHeight}px)`
                }">
                    <!-- Left Slot -->
                    <view class="app-nav__left">
                        <slot name="left">
                            <i v-if="showBackButton"
                                @click="handleBack"
                                class="app-nav__back-icon cuIcon-back"
                                :style="{ color: computedBackIconColor }">
                            </i>
                        </slot>
                    </view>

                    <!-- Center Slot -->
                    <view class="app-nav__center">
                        <slot name="center">
                            <text class="app-nav__title" :style="{ color: computedTitleColor }">{{ title }}</text>
                        </slot>
                    </view>

                    <!-- Right Slot -->
                    <view class="app-nav__right">
                        <slot name="right">
                            <image v-if="showRightImage"
                                @tap="handleRightAction"
                                class="app-nav__right-image"
                                :style="rightImageStyle"
                                :src="rightImageUrl"
                            />
                            <text v-if="showRightText"
                                @tap="handleRightAction"
                                class="app-nav__right-text"
                                :style="{ color: computedRightTextColor }">
                                {{ rightText }}
                            </text>
                        </slot>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'AppNav',
    props: {
        title: {
            type: String,
            default: ''
        },
        navHeight: {
            type: String,
            default: '44'
        },
        titleColor: {
            type: String,
            default: ''
        },
        backIconColor: {
            type: String,
            default: ''
        },
        rightTextColor: {
            type: String,
            default: ''
        },
        showRightImage: {
            type: Boolean,
            default: false
        },
        showRightText: {
            type: Boolean,
            default: false
        },
        rightText: {
            type: String,
            default: '设置'
        },
        rightImageUrl: {
            type: String,
            default: '/static/logo.png'
        },
        rightImageWidth: {
            type: String,
            default: '38'
        },
        rightImageHeight: {
            type: String,
            default: '38'
        },
        backgroundColor: {
            type: String,
            default: ''
        },
        blur: {
            type: Boolean,
            default: false
        },
        enableBackNavigation: {
            type: Boolean,
            default: true
        },
        showBackButton: {
            type: Boolean,
            default: true
        },
        onBackPress: {
            type: Function,
            default: null
        }
    },

    data() {
        return {
            statusBarHeight: uni.getSystemInfoSync().statusBarHeight
        }
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        },
        computedTitleColor() {
            return this.titleColor || this.theme.textPrimary
        },
        computedBackIconColor() {
            return this.backIconColor || this.theme.textPrimary
        },
        computedRightTextColor() {
            return this.rightTextColor || this.theme.textPrimary
        },
        computedBackgroundColor() {
            if (this.backgroundColor) {
                return this.backgroundColor
            }
            if (this.blur) {
                // Use backgroundCard with 50% opacity for blur effect (80 in hex = 50% opacity)
                const color = this.theme.backgroundCard
                if (color && color.startsWith('#')) {
                    return color + '1'
                }
                return color || this.theme.backgroundPrimary
            }
            return this.theme.backgroundPrimary
        },
        rightImageStyle() {
            return {
                width: this.rightImageWidth + 'rpx',
                height: this.rightImageHeight + 'rpx'
            }
        }
    },

    methods: {
        handleRightAction() {
            this.$emit('right-action')
        },

        handleBack() {
            if (this.onBackPress) {
                this.onBackPress()
                return
            }

            if (!this.enableBackNavigation) {
                uni.switchTab({
                    url: '/pages/index/index'
                })
            } else {
                this.router.goBack()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.app-nav {
    &__container {
        position: relative;
        width: 100%;
    }

    &__wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: var(--z-fixed);
        transition: var(--transition-base);

        &--blur {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
    }

    &__content {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--spacing-xl);
    }

    &__left {
        flex: 1;
        display: flex;
        align-items: center;
    }

    &__center {
        flex: 2;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: var(--spacing-base);
    }

    &__title {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
        text-align: center;
    }

    &__back-icon {
        font-size: var(--font-size-lg);
        cursor: pointer;
        transition: var(--transition-base);

        &:hover {
            opacity: 0.8;
        }
    }

    &__right-image {
        transition: var(--transition-base);

        &:hover {
            opacity: 0.8;
        }
    }

    &__right-text {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-bold);
        cursor: pointer;
        transition: var(--transition-base);

        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
