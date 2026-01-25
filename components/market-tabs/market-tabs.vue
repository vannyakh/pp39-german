<template>
    <view class="market-tabs-view" :style="{
        height: height + 'rpx',
        background: backgroundColor
    }" v-if="tabsWidth>0">
        <scroll-view v-if="scroll" class="market-tabs-scroll" :style="{ height: height + 'rpx' }" scroll-x="true" :scroll-left="scrollLeft">
            <view class="market-tabs-scroll-content" :style="{ width: getScrollContentWidth }">
                <view v-for="(item, index) in tabs" :key="index" class="market-tabs-item"
                    :style="{ width: getScrollItemWidth, height: height + 'rpx' }" @tap.stop="swichTabs(index)">
                    <view class="market-tabs-title" :class="{
                            'market-tabs-disabled': item.disabled,
                            'market-tabs-active': currentTab == index
                        }" :style="{
                            color: currentTab == index ? getSelectedColor : color,
                            fontSize: size + 'rpx',
                            fontWeight: bold && currentTab == index ? 'bold' : 'normal',
                            transform: `scale(${currentTab == index ? scale : 1})`,
                            transition: 'all 0.3s ease-in-out'
                        }">
                        {{ item.name }}
                        <view :class="[item.isDot ? 'market-badge__dot' : 'market-tabs__badge']"
                            :style="{ color: badgeColor, backgroundColor: getBadgeBgColor }" v-if="item.num || item.isDot">
                            {{ item.isDot ? '' : item.num }}
                        </view>
                    </view>
                </view>
                <!-- Slider inside scroll content -->
                <view v-if="isSlider" class="market-tabs-slider" :style="{
                        transform: 'translateX(' + getScrollSliderLeft + 'px)',
                        width: sliderWidth + 'rpx',
                        height: sliderHeight + 'rpx',
                        borderRadius: sliderRadius,
                        bottom: bottom,
                        background: getSliderBgColor,
                        marginBottom: bottom == '50%' ? '-' + sliderHeight / 2 + 'rpx' : 0
                    }">
                    <!-- Debug info -->
                    <text style="font-size: 20rpx; color: white;">{{ currentTab }}</text>
                </view>
            </view>
        </scroll-view>
        <view v-else>
            <view v-for="(item, index) in tabs" :key="index" class="market-tabs-item"
                :style="{ width: getItemWidth,height: height + 'rpx' }" @tap.stop="swichTabs(index)">
                <view class="market-tabs-title" :class="{
                        'market-tabs-disabled': item.disabled,
                        'market-tabs-active': currentTab == index
                    }" :style="{
                        color: currentTab == index ? getSelectedColor : color,
                        fontSize: size + 'rpx',
                        fontWeight: bold && currentTab == index ? 'bold' : 'normal',
                        transform: `scale(${currentTab == index ? scale : 1})`,
                        transition: 'all 0.3s ease-in-out'
                    }">
                    {{ item.name }}
                    <view :class="[item.isDot ? 'market-badge__dot' : 'market-tabs__badge']"
                        :style="{ color: badgeColor, backgroundColor: getBadgeBgColor }" v-if="item.num || item.isDot">
                        {{ item.isDot ? '' : item.num }}
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'MarketTabs',
    emits: ['change'],
    props: {
        //标签页
        tabs: {
            type: Array,
            default () {
                return [];
            }
        },
        //tabs宽度，不传值则默认使用windowWidth，单位px
        width: {
            type: [Number,String],
            default: 0
        },
        //rpx
        height: {
            type: Number,
            default: 80
        },
        //rpx 只对左右padding起作用，上下为0
        padding: {
            type: Number,
            default: 30
        },
        //背景色
        backgroundColor: {
            type: String,
            default: 'transparent'
        },
        //当前选项卡
        currentTab: {
            type: Number,
            default: 0
        },
        isSlider: {
            type: Boolean,
            default: true
        },
        //滑块宽度
        sliderWidth: {
            type: Number,
            default: 68
        },
        //滑块高度
        sliderHeight: {
            type: Number,
            default: 6
        },
        //滑块背景颜色
        sliderBgColor: {
            type: String,
            default: ''
        },
        sliderRadius: {
            type: String,
            default: '50rpx'
        },
        //滑块bottom
        bottom: {
            type: String,
            default: '0'
        },
        //标签页宽度
        itemWidth: {
            type: String,
            default: ''
        },
        //字体颜色
        color: {
            type: String,
            default: '#666'
        },
        //选中后字体颜色
        selectedColor: {
            type: String,
            default: ''
        },
        //字体大小
        size: {
            type: Number,
            default: 28
        },
        //选中后 是否加粗 ，未选中则无效
        bold: {
            type: Boolean,
            default: false
        },
        //2.3.0+
        scale: {
            type: [Number, String],
            default: 1
        },
        //角标字体颜色
        badgeColor: {
            type: String,
            default: '#fff'
        },
        //角标背景颜色
        badgeBgColor: {
            type: String,
            default: ''
        },
        //是否可滚动
        scroll: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            winWidth: 0,
            tabsWidth: 0,
            scrollLeft: 0
        };
    },
    watch: {
        currentTab(newVal) {
            console.log('Current tab changed to:', newVal);
            this.checkCor();
            // Auto-scroll to show the selected tab when currentTab changes
            this.$nextTick(() => {
                this.scrollToSelectedTab(newVal);
            });
        },
        tabs() {
            this.checkCor();
        },
        width(val) {
            this.tabsWidth = val;
            this.checkCor();
        }
    },
    computed: {
        getItemWidth() {
            let width = 100 / (this.tabs.length || 4) + '%'
            return this.itemWidth ? this.itemWidth : width
        },
        getScrollItemWidth() {
            // For scroll mode, use itemWidth prop if provided, otherwise use fixed width
            return this.itemWidth || '150rpx'
        },
        getScrollContentWidth() {
            // Calculate total width needed for all tabs
            let tabWidth = this.itemWidth ? parseInt(this.itemWidth) : 150; // Use itemWidth or default 150rpx
            let totalWidth = this.tabs.length * tabWidth;
            return totalWidth + 'rpx'
        },
        getSliderBgColor() {
            return this.sliderBgColor || '#066BE8';
        },
        getSelectedColor() {
            return this.selectedColor || '#066BE8';
        },
        getBadgeBgColor() {
            return this.badgeBgColor || '#f74d54';
        },
        getScrollSliderLeft() {
            // Use itemWidth prop if provided, otherwise use default
            let sliderWidth = uni.upx2px(Number(this.sliderWidth));
            let tabWidthValue = this.itemWidth ? parseInt(this.itemWidth) : 150; // Use itemWidth or default 150rpx
            let tabWidth = uni.upx2px(tabWidthValue);

            // Simple calculation: currentTab * tabWidth + center offset
            let position = (this.currentTab * tabWidth) + ((tabWidth - sliderWidth) / 2);

            return position;
        }
    },
    created() {
        // 高度自适应
        setTimeout(() => {
            uni.getSystemInfo({
                success: res => {
                    this.winWidth = res.windowWidth;
                    this.tabsWidth = this.width || this.winWidth;
                    this.checkCor();
                    
                    // Auto-scroll to show the current tab on load
                    this.$nextTick(() => {
                        this.scrollToSelectedTab(this.currentTab);
                    });
                }
            });
        }, 0);
    },
    methods: {
        checkCor: function() {
            let tabsNum = this.tabs.length;
            if (tabsNum == 0) return;

            if (this.scroll) {
                // For scroll mode, use simple positioning
                let sliderWidth = uni.upx2px(Number(this.sliderWidth));
                let tabWidthValue = this.itemWidth ? parseInt(this.itemWidth) : 150; // Use itemWidth or default 150rpx
                let tabWidth = uni.upx2px(tabWidthValue);

                // Simple calculation: currentTab * tabWidth + center offset
                this.scrollLeft = (this.currentTab * tabWidth) + ((tabWidth - sliderWidth) / 2);
            } else {
                // For normal mode, use percentage positioning
                let padding = uni.upx2px(Number(this.padding));
                let width = this.tabsWidth - padding * 2;
                let left = (width / tabsNum - uni.upx2px(Number(this.sliderWidth))) / 2 + padding;
                let scrollLeft = left;
                if (this.currentTab > 0) {
                    scrollLeft = scrollLeft + (width / tabsNum) * this.currentTab;
                }
                this.scrollLeft = scrollLeft;
            }
        },
        // 点击标题切换当前页时改变样式
        swichTabs: function(index) {
            if (this.tabs[index].disabled) return;

            // Add cool visual feedback
            this.$nextTick(() => {
                // Emit change event
                this.$emit('change', {
                    index: index
                });

                // Auto-scroll to show the selected tab
                this.scrollToSelectedTab(index);
            });
        },

        // Auto-scroll to show the selected tab
        scrollToSelectedTab: function(index) {
            if (!this.scroll) return;

            // Calculate the position to scroll to
            let tabWidthValue = this.itemWidth ? parseInt(this.itemWidth) : 150;
            let tabWidth = uni.upx2px(tabWidthValue);
            let containerWidth = this.tabsWidth;

            // Calculate the center position of the selected tab
            let tabCenter = (index * tabWidth) + (tabWidth / 2);
            let containerCenter = containerWidth / 2;

            // Calculate scroll position to center the tab
            let scrollPosition = Math.max(0, tabCenter - containerCenter);

            // Update scroll position
            this.scrollLeft = scrollPosition;
        }
    }
}
</script>

<style lang="scss" scoped>
.market-tabs-view {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.market-tabs-item {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: visible;
    padding: 0 20rpx;
    min-width: 80rpx;
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.market-tabs-item:active {
    transform: scale(0.95);
    opacity: 0.8;
}

.market-tabs-disabled {
    opacity: 0.6;
}

.market-tabs-title {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 3;
    overflow: visible;
    transition: all 0.3s ease-in-out;
    border-radius: 8rpx;
    padding: 8rpx 16rpx;
}

.market-tabs-active {
    transform: translateY(-2rpx);
}

.market-tabs-slider {
    position: absolute;
    left: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    transform-style: preserve-3d;
    box-shadow: 0 2rpx 12rpx rgba(6, 107, 232, 0.3);
}

.market-tabs__badge {
    position: absolute;
    font-size: 24rpx;
    height: 32rpx;
    min-width: 20rpx;
    padding: 0 6rpx;
    border-radius: 40rpx;
    right: 0;
    top: 0;
    transform: translate(88%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 4;
    font-weight: normal !important;
}

.market-badge__dot {
    position: absolute;
    height: 16rpx;
    width: 16rpx;
    border-radius: 50%;
    right: -10rpx;
    top: -10rpx;
    z-index: 4;
}

/* Scroll styles */
.market-tabs-scroll {
    width: 100%;
    white-space: nowrap;
}

.market-tabs-scroll-content {
    display: flex;
    align-items: center;
    position: relative;
}
</style>
