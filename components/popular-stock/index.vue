<template>
    <view class="popular-stock-container">
        <!-- Header Section -->
        <view class="header-section">
            <view class="flex justify-between align-center">
                <text class="section-title">
                    {{$t('service6')}}
                </text>
                <view @click="router.goTabBar('/pages/quotation/index')" class="flex align-center">
                    <text class="view-all-text">{{$t('service4')}}</text>
                    <u-icon name="arrow-right" size="20" color="var(--text-color)" />
                </view>
            </view>
        </view>

        <!-- Stock List -->
        <view class="stock-list">
            <view
                @click="setDetail(item.id)"
                class="stock-item"
                :style="{color: theme.gray20}"
                v-for="(item,index) in hotList"
                :key="index"
            >
                <!-- Stock Info -->
                <view class="stock-info">
                    <view class="stock-name" :style="{color: theme.dark}">{{item.name}}</view>
                    <view class="stock-code-section">
                        <view class="stock-code" :style="{color: theme.gray60}">{{item.code}}</view>
                        <text v-if="item.country==42" class="country-tag" :style="{color: theme.gray70}">
                            {{$t('Spanish')}}
                        </text>
                        <text v-if="item.country==39" class="country-tag" :style="{color: theme.gray70}">
                            {{$t('US')}}
                        </text>
                    </view>
                </view>

                <!-- Stock Price & Change -->
                <view class="stock-price-section">
                    <view class="stock-price" :class="item.increase>=0?'color-657EFA':'color-41BD64'">
                        {{item.close}}
                    </view>
                    <view class="stock-change" :class="item.increase>=0?'color-657EFA':'color-41BD64'">
                        {{item.increase}}%
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'PopularStock',
    props: {
        dataList: {
            type: Array,
            default: () => []
        },
    },

    data() {
        return {
            hotList: [],
        }
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },

    watch: {
        dataList: {
            handler(val) {
                this.hotList = val
            },
            immediate: true
        }
    },

    methods: {
        setDetail(url) {
            if (this.status == true) {
                this.show = true
                return
            }
            const detailUrl = '/pages/quotation/details?id=' + url;
            this.router.push(detailUrl);
        },
    },
}
</script>

<style lang="scss" scoped>
.popular-stock-container {
    width: 100%;
    margin-top: 20rpx;
}

.header-section {
    margin-bottom: 20rpx;
}

.section-title {
    font-weight: bold;
    color: var(--text-color);
}

.view-all-text {
    font-weight: bold;
    color: var(--text-color);
}

.stock-list {
    margin-top: 10rpx;
}

.stock-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f4f4f4;
    transition: all 0.3s ease;

    &:active {
        background-color: rgba(0, 0, 0, 0.05);
        transform: scale(0.98);
    }
}

.stock-info {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.stock-name {
    font-size: 27rpx;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 410rpx;
}

.stock-code-section {
    display: flex;
    align-items: center;
}

.stock-code {
    font-size: 20rpx;
    line-height: 30rpx;
}

.country-tag {
    font-size: 24rpx;
    padding: 0 10rpx;
    line-height: 30rpx;
}

.stock-price-section {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10rpx;
}

.stock-price {
    font-weight: bold;
    text-align: center;
}

.stock-change {
    text-align: right;
}
</style>
