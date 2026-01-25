<template>
    <view class="min-height-screen" :style="{background: theme.backgroundSecondary}">
        <app-nav blur :title="$t('forex.title')"></app-nav>
        <v-container size="md">

            <!-- Tab List -->
            <v-tab-list
                :list="tabList"
                :defaultActiveKey="activeTab"
                @change="handleTabChange"
                :activeColor="theme.primary__500"
                :backgroundColor="theme.backgroundCard"
                :textColor="theme.textTertiary"
                :activeTextColor="theme.primary__500"
                :lineColor="theme.primary__500"
                :borderColor="theme.neutral__200"
                :activeBackgroundColor="getActiveTabBackgroundColor()"
                rounded="full"
            />

            <!-- Forex Content -->
            <view class="forex-content">
                <crypto-forex
                    v-for="(item, index) in filteredForexes"
                    :key="index"
                    :item="item"
                    ctxt-color=""
                    bd-item="card-glas"
                    @click="goForex(item.symbol, index)"
                />
            </view>

        </v-container>


    </view>
</template>
<script>
    export default {
        data() {
            return {
                timerForex: null,
                forexes: [],
                activeTab: 'all',
                tabList: [
                    { key: 'all', name: 'All' },
                    { key: 'major', name: 'Major' },
                    { key: 'minor', name: 'Minor' },
                    { key: 'exotic', name: 'Exotic' }
                ]
            };
        },
        onLoad() {
            this.getForexData()
        },
        onUnload() {
            this.clearIntervals()
        },
        onHide() {
            this.clearIntervals()
        },
        computed: {
            theme() {
                return this.$store.getters.theme
            },
            filteredForexes() {
                if (this.activeTab === 'all') {
                    return this.forexes;
                }
                // Filter forex pairs based on category
                return this.forexes.filter(item => {
                    const symbol = item.symbol || '';
                    switch (this.activeTab) {
                        case 'major':
                            // Major pairs: USD, EUR, GBP, JPY, CHF, AUD, CAD, NZD
                            return symbol.includes('USD') || symbol.includes('EUR') ||
                                   symbol.includes('GBP') || symbol.includes('JPY') ||
                                   symbol.includes('CHF') || symbol.includes('AUD') ||
                                   symbol.includes('CAD') || symbol.includes('NZD');
                        case 'minor':
                            // Minor pairs: Cross pairs without USD
                            return !symbol.includes('USD') &&
                                   (symbol.includes('EUR') || symbol.includes('GBP') ||
                                    symbol.includes('JPY') || symbol.includes('CHF') ||
                                    symbol.includes('AUD') || symbol.includes('CAD') ||
                                    symbol.includes('NZD'));
                        case 'exotic':
                            // Exotic pairs: Emerging market currencies
                            return symbol.includes('TRY') || symbol.includes('ZAR') ||
                                   symbol.includes('MXN') || symbol.includes('SEK') ||
                                   symbol.includes('NOK') || symbol.includes('DKK') ||
                                   symbol.includes('PLN') || symbol.includes('CZK');
                        default:
                            return true;
                    }
                });
            }
        },
        methods: {
            // Forex data handling
            async getForexData() {
                // Clear existing interval first
                if (this.timerForex) {
                    clearInterval(this.timerForex)
                    this.timerForex = null
                }
                try {
                    const res = await this.post('/forex/getForex')
                    if (res.code === 1) {
                        this.forexes = res.data.coin
                        // Only set new interval if one doesn't exist
                        if (!this.timerForex) {
                            this.timerForex = setInterval(() => {
                                this.getForexData()
                            }, 3000)
                            // Register with global cleanup
                            getApp().globalData.registerInterval(this.timerForex)
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            },
            clearIntervals() {
                if (this.timerForex) {
                    clearInterval(this.timerForex)
                    getApp().globalData.unregisterInterval(this.timerForex)
                    this.timerForex = null
                }
            },
            goForex(item, idx) {
                uni.navigateTo({ url: '/pages/forex/forex?symbol=' + item + '&idx=' + idx })
            },
            handleTabChange(tab) {
                this.activeTab = tab.key;
            },
            getActiveTabBackgroundColor() {
                // Convert hex color to rgba with 0.1 opacity
                const primaryColor = this.theme.primary__500;
                if (primaryColor && primaryColor.startsWith('#')) {
                    // Remove # and convert to RGB
                    const hex = primaryColor.substring(1);
                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);
                    return `rgba(${r}, ${g}, ${b}, 0.1)`;
                }
                // Fallback to primary__50 if available
                return this.theme.primary__50 || 'rgba(6, 107, 232, 0.1)';
            }
        },
    };
</script>

<style lang="scss" scoped>
.forex-content {
    margin-top: 24rpx;
}
</style>
