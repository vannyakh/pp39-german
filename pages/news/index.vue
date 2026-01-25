<template>
    <view class="min-height-screen" :style="{background:theme.backgroundSecondary, color:theme.textPrimary}">
        <bg-animate-shape/>
        <z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :auto="false">
            <!-- Header with Tabs -->
            <view slot="top" :style="{paddingTop: statusBar + 'px', boxShadow: '0px 1px 4px 0px rgba(0,0,0,.1)', background:theme.backgroundPrimary}">
                <view class="padding-c-10 padding-w-40">
                    <view class="width-100b flex align-center justify-between gap-10">
                        <view class="flex-1">
                            <u-tabs
                                :current="current"
                                :list="cateList"
                                :lineColor="theme.primary__light"
                                :activeStyle="{color: theme.primary__light, fontWeight: 'bold', transform: 'scale(1.05)'}"
                                @click="changeTab"
                            />
                        </view>
                        <view class="flex align-center">
                            <u-icon
                                @click="router.push('/pages/index/searchView')"
                                name="search"
                                size="28"
                                :color="theme.textPrimary"
                            />
                        </view>
                    </view>
                </view>
            </view>

            <!-- Loading Skeleton -->
            <v-container size="md" class="margin-t-20" v-if="isLoading && list.length === 0">
                <view
                    v-for="(item, index) in 5"
                    :key="index"
                    class="news-skeleton-card"
                    :style="{ borderBottom: '2rpx solid ' + theme.neutral__200 }"
                >
                    <!-- Left Section - Content Skeleton -->
                    <view class="news-skeleton-content">
                        <!-- Title skeleton -->
                        <view class="skeleton-title" :style="getSkeletonStyle()"></view>
                        <!-- Description skeleton -->
                        <view class="skeleton-description">
                            <view class="skeleton-line" :style="getSkeletonStyle()"></view>
                            <view class="skeleton-line short" :style="getSkeletonStyle()"></view>
                        </view>
                        <!-- Meta skeleton -->
                        <view class="skeleton-meta" :style="getSkeletonStyle()"></view>
                    </view>

                    <!-- Right Section - Image Skeleton -->
                    <view class="news-skeleton-image">
                        <view class="skeleton-image" :style="getSkeletonStyle()"></view>
                    </view>
                </view>
            </v-container>

            <!-- News List -->
            <v-container size="md" class="margin-t-20" v-else>
                <news-card
                    v-for="(item,index) in list"
                    :key="index"
                    :item="item"
                    @click="handleNewsClick"
                />
            </v-container>
        </z-paging>
    </view>
</template>

<script>
import NewsCard from '@/components/news-card/news-card.vue'

export default {
    components: {
        NewsCard
    },
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            list: [],
            cateId: "",
            cateList: [],
            current: 0,
            isLoading: false
        }
    },

    onLoad() {
        this.getNewsCate()
        this.updateTabBarText()
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        },
    },

    methods: {
        updateTabBarText() {
            const tabBarItems = [
                { index: 0, key: 'tabBar1' },
                { index: 1, key: 'tabBar2' },
                { index: 2, key: 'tabBar3' },
                { index: 3, key: 'tabBar4' },
                { index: 4, key: 'tabBar5' },
            ]

            tabBarItems.forEach(item => {
                uni.setTabBarItem({
                    index: item.index,
                    text: this.$t(item.key)
                })
            })

            // Update tab bar colors using theme
            uni.setTabBarStyle({
                color: this.theme.textTertiary,
                selectedColor: this.theme.primary__light,
                backgroundColor: this.theme.backgroundPrimary,
                borderStyle: 'transparent'
            })
        },
        changeTab(item, index) {
            this.cateId = item.id
            this.current = index
            this.isLoading = true
            this.queryList(1, 20)
        },

        getNewsCate() {
            this.isLoading = true
            this.post('/index/news_cate').then((res) => {
                if (res.code == 1) {
                    this.cateList = res.data
                    if (this.cateId == '') {
                        this.cateId = this.cateList[0].id
                    }
                    this.queryList(1, 20)
                }
            }).catch(() => {
                this.isLoading = false
            })
        },

        queryList(pageNo, pageSize) {
            this.post('/index/news_list', {
                cate_id: this.cateId,
                page: pageNo,
            }).then(res => {
                if (res.code == 1) {
                    this.$refs.paging.complete(res.data.data);
                }
                this.isLoading = false
            }).catch(() => {
                this.isLoading = false
            })
        },

        handleNewsClick(item) {
            // Additional logic can be added here if needed
            console.log('News clicked:', item)
        },

        getSkeletonStyle() {
            return {
                background: `linear-gradient(90deg, ${this.theme.neutral__100} 25%, ${this.theme.neutral__200} 37%, ${this.theme.neutral__100} 63%)`
            }
        }
    },
}
</script>

<style lang="scss" scoped>
/* Skeleton Loading Styles */
.news-skeleton-card {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
}

.news-skeleton-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 20rpx;
    margin-right: 20rpx;
}

.skeleton-title {
    width: 480rpx;
    height: 30rpx;
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
    border-radius: 4rpx;
}

.skeleton-description {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    width: 480rpx;
}

.skeleton-line {
    width: 100%;
    height: 24rpx;
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
    border-radius: 4rpx;

    &.short {
        width: 70%;
    }
}

.skeleton-meta {
    width: 120rpx;
    height: 22rpx;
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
    border-radius: 4rpx;
}

.news-skeleton-image {
    flex-shrink: 0;
}

.skeleton-image {
    width: 200rpx;
    height: 120rpx;
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
    border-radius: 10rpx;
}

@keyframes skeleton-loading {
    0% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
</style>
