<template>
    <view class="header-tab-container">
        <view class="tab-wrapper" :style="{ background: theme.backgroundTertiary }">
            <view
                class="tab-item"
                :class="{ 'tab-active': currentTab === tab.value }"
                @click="handleTabClick(tab.value)"
                v-for="tab in tabs"
                :key="tab.value"
                :style="getTabItemStyle(tab.value)"
            >
                <text class="tab-text" :class="{ 'tab-text-active': currentTab === tab.value }"
                      :style="getTabTextStyle(tab.value)">
                    {{ getTabLabel(tab.label) }}
                </text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'HeaderTab',
    props: {
        tabs: {
            type: Array,
            required: false,
            default: () => [
                { label: 'tabBar1', value: 'discover', path: '/pages/index/index' },
                { label: 'tabBar2', value: 'market', path: '/pages/quotation/index' }
            ]
        },
        activeIndex: {
            type: [Number, String],
            default: 0
        }
    },
    computed: {
        theme() {
            return this.$store.getters.theme
        },
        currentTab() {
            const index = parseInt(this.activeIndex)
            return this.tabs[index] ? this.tabs[index].value : this.tabs[0].value
        }
    },
    methods: {
        getTabLabel(label) {
            // Check if label is a translation key (starts with common translation prefixes)
            if (typeof label === 'string' && (label.startsWith('tabBar') || label.startsWith('my') || label.startsWith('common'))) {
                return this.$t(label)
            }
            // Return the label as-is if it's not a translation key
            return label
        },

        handleTabClick(tabValue) {
            const selectedTab = this.tabs.find(tab => tab.value === tabValue)
            const selectedIndex = this.tabs.findIndex(tab => tab.value === tabValue)

            if (selectedTab && selectedTab.path) {
                uni.switchTab({
                    url: selectedTab.path,
                    fail: () => {
                        uni.navigateTo({
                            url: selectedTab.path
                        })
                    }
                })
            }
            this.$emit('tab-change', selectedIndex)
        },
        getTabItemStyle(tabValue) {
            if (this.currentTab === tabValue) {
                return {
                    background: this.theme.backgroundCard
                }
            }
            return {}
        },
        getTabTextStyle(tabValue) {
            if (this.currentTab === tabValue) {
                return {
                    color: this.theme.textPrimary
                }
            }
            return {
                color: this.theme.textTertiary
            }
        }
    }
}
</script>

<style lang="scss" scoped>
/* Header Tab Styles */
.header-tab-container {
    padding: 20rpx 0;
}

.tab-wrapper {
    display: flex;
    border-radius: 50rpx;
    padding: 6rpx;
    position: relative;
}

.tab-item {
    flex: 1;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 40rpx;
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
}

.tab-active {
    transform: translateY(-1rpx);
}

.tab-text {
    font-size: 28rpx;
    font-weight: 500;
    transition: color 0.3s ease;
}

.tab-text-active {
    font-weight: 600;
}
</style>
