<template>
    <view class="news-card" @click="handleClick" :style="{ borderBottomColor: theme.neutral__200 }">
        <!-- Left Section - Content -->
        <view class="news-content-section">
            <view class="news-title" :style="{ color: theme.textPrimary }">{{ item.title }}</view>
            <view class="news-description" :style="{ color: theme.textSecondary }">{{ item.content }}</view>
            <view class="news-meta">
                <text class="news-time" :style="{ color: theme.textTertiary }">{{ item.createtime }}</text>
            </view>
        </view>

        <!-- Right Section - Image -->
        <view class="news-image-section">
            <view class="news-image-container" :style="{ backgroundColor: theme.backgroundTertiary }">
                <u--image
                    :showLoading="true"
                    :src="item.cover_image"
                    :lazyLoad="true"
                    width="200rpx"
                    height="120rpx"
                    radius="10"
                    mode="aspectFill"
                >
                    <view slot="loading">
                        <u-loading-icon :color="theme.primary__light"></u-loading-icon>
                    </view>
                </u--image>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'NewsCard',
    props: {
        item: {
            type: Object,
            required: true
        },
        route: {
            type: String,
            default: '/pages/index/notice/zixun_details'
        }
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },

    methods: {
        handleClick() {
            this.$emit('click', this.item)
            this.router.push(`${this.route}?id=${this.item.id}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.news-card {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 2rpx solid;
    transition: all 0.3s ease;
    cursor: pointer;
}

.news-card:active {
    transform: scale(0.98);
}

.news-content-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20rpx;
    margin-right: 20rpx;
}

.news-title {
    font-size: 30rpx;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 480rpx;
}

.news-description {
    font-size: 24rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 480rpx;
    line-height: 1.4;
}

.news-meta {
    display: flex;
    align-items: center;
}

.news-time {
    font-size: 22rpx;
}

.news-image-section {
    flex-shrink: 0;
}

.news-image-container {
    width: 100%;
    height: 100%;
    border-radius: 8rpx;
    overflow: hidden;
}
</style>
