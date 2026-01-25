<template>
    <view class="page-no-scroll" :style="{background: theme.backgroundPrimary}">
        <bg-animate-shape/>
        <app-nav background-color="transparent" :title="$t('service1')"></app-nav>


        <v-container size="md" :style="'flex:1; display: flex; flex-direction: column;'" :padding="false">
            <!-- Render only when URL is ready -->
            <view v-if="loading" class="loading-container" :style="{color: theme.textTertiary}">
                <u-loading-icon />
            </view>
            <view v-else>
                <!-- Show iframe/web-view when service URL is available -->
                <!-- H5 uses iframe -->
                <!-- #ifdef H5 -->
                <iframe
                        v-if="recharge_kefu"
                        id="ifra"
                        name="ifra"
                        :style="`width: 100%; height: ${iframeHeight}px; overflow: hidden; border: 0; display:block;`"
                        :src="recharge_kefu"
                        frameborder="0"
                ></iframe>
                <!-- #endif -->

                <!-- Non-H5 uses web-view for better compatibility -->
                <!-- #ifndef H5 -->
                <web-view
                        v-if="recharge_kefu"
                        :src="recharge_kefu"
                        :style="`width: 100%; height: ${iframeHeight}px; display:block;`"
                ></web-view>
                <!-- #endif -->

                <!-- Show image when no service URL is available -->
                <view v-if="showImage" class="service-image-container">
                    <view class="empty-state">
                        <image
                            class="service-image"
                            :src="imageSrc"
                            mode="aspectFit"
                            :style="`width: 100%; max-width: 600rpx; ${imageHeight ? 'height: ' + imageHeight + 'rpx;' : ''}`"
                            @error="handleImageError"
                            @load="handleImageLoad"
                        ></image>
                        <text v-if="hasError" class="error-message" :style="{color: theme.textTertiary}">{{ $t('service.error') || 'Unable to load service' }}</text>
                        <text v-if="!hasError && !loading" class="info-message" :style="{color: theme.textTertiary}">{{ $t('service.not_available') || 'Service is currently not available' }}</text>
                        <view v-if="hasError" class="retry-button" @click="retryLoad" :style="{background: theme.primary__500}">
                            <text class="retry-text" :style="{color: theme.white}">{{ $t('common.retry') || 'Retry' }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </v-container>
    </view>
</template>

<script>

export default {
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            recharge_kefu: '',
            loading: true,
            iframeHeight: 400,
            navHeight: 0,
            hasError: false,
            imageError: false,
            imageSrc: '/static/onlineservice.gif',
            imageLoaded: false,
            imageHeight: 400
        };
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        },
        showImage() {
            // Show image when no service URL or when empty string
            return !this.recharge_kefu || (typeof this.recharge_kefu === 'string' && this.recharge_kefu.trim() === '');
        }
    },
    onLoad() {
        this.init()
    },
    onReady() {
        this.measureNav().then(() => this.computeHeight())
    },
    onResize() {
        this.measureNav().then(() => this.computeHeight())
    },
    methods: {
        open(url) {
            if (url) {
                // #ifdef APP-PLUS
                plus.runtime.openURL(url)
                // #endif
                // #ifdef H5
                window.location.href = url
                // #endif
            }
        },

        async init() {
            try {
                this.hasError = false
                this.loading = true
                const res = await this.post('/my/recharge_con')
                if (res && res.code === 1 && res.data) {
                    // Handle empty string or null/undefined recharge_kefu
                    const serviceUrl = res.data.recharge_kefu
                    if (serviceUrl && typeof serviceUrl === 'string' && serviceUrl.trim() !== '') {
                        this.recharge_kefu = serviceUrl.trim()
                        this.hasError = false
                    } else {
                        // Empty string is a valid response (no service URL available)
                        this.recharge_kefu = ''
                        this.hasError = false
                    }
                } else {
                    // API returned error code or no data
                    console.warn('recharge_con unexpected response', res)
                    this.recharge_kefu = ''
                    this.hasError = true
                }
            } catch (err) {
                // Network or API error
                console.error('recharge_con error', err)
                this.recharge_kefu = ''
                this.hasError = true
            } finally {
                this.loading = false
                this.$nextTick(() => this.measureNav().then(() => this.computeHeight()))
            }
        },

        retryLoad() {
            this.init()
        },

        measureNav() {
            return new Promise((resolve) => {
                // Query the custom nav height
                const query = uni.createSelectorQuery().in(this)
                query.select('app-nav').boundingClientRect((rect) => {
                    if (rect && rect.height) {
                        this.navHeight = rect.height
                    }
                    resolve()
                }).exec()
            })
        },

        computeHeight() {
            // Compute available height for the embedded view
            let viewport = 600
            // #ifdef H5
            viewport = window?.innerHeight || document?.documentElement?.clientHeight || 600
            // #endif
            // No page scroll: use full viewport minus nav only
            const reserved = 80
            this.iframeHeight = Math.max(200, viewport - this.navHeight - reserved)
        },

        handleImageError(e) {
            // If primary image fails, try fallback
            console.warn('Service image load error, trying fallback:', e)
            this.imageError = true
            // Try fallback image path
            if (this.imageSrc === '/static/service.png') {
                this.imageSrc = '/static/imgs/my/service.png'
            }
        },

        handleImageLoad(e) {
            console.log('Service image loaded successfully', e)
            this.imageLoaded = true
            this.imageError = false
            // Get image dimensions and adjust height if needed
            // In uni-app, aspectFit mode should handle height automatically
            // But we can set a reasonable height for better display
            if (e.detail && e.detail.width && e.detail.height) {
                // Calculate height based on max-width 600rpx and aspect ratio
                const ratio = e.detail.height / e.detail.width
                this.imageHeight = Math.min(600 * ratio, 800) // Max 800rpx height
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page-no-scroll {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.loading-container {
  padding: 24rpx;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.service-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600rpx;
  margin: 0 auto;
}

.service-image {
  width: 100%;
  max-width: 600rpx;
  margin: 0 auto 30rpx;
  display: block;
  object-fit: contain;
  /* aspectFit mode maintains aspect ratio based on width */
  /* Height is set dynamically after image loads */
}

.error-message {
  font-size: 28rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.info-message {
  font-size: 28rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.retry-button {
  padding: 20rpx 60rpx;
  border-radius: 50rpx;
  transition: all 0.3s ease;
}

.retry-button:active {
  transform: scale(0.95);
  opacity: 0.8;
}

.retry-text {
  font-size: 28rpx;
  font-weight: 500;
}
</style>

