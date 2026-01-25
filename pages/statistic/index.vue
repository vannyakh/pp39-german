<template>
    <view
        class="min-height-screen"
        :style="{
            background: theme.backgroundSecondary,
            color: theme.textPrimary,
        }"
    >
        <z-paging
            :language="$t('locale')"
            ref="paging"
            v-model="dataList"
            @query="queryList"
            :pageSize="20"
        >
            <app-nav
                slot="top"
                :title="$t('statistic.title')"
                showRightImage
                rightImageUrl="/static/imgs/fund/record.png"
                @right-action="router.push('/pages/statistic/record')"
            ></app-nav>

            <v-container size="md">
                <!-- ETF list -->
                <etf-list
                    :dataList="dataList"
                    :loading="isLoading"
                    @etf-click="handleETFClick"
                ></etf-list>
            </v-container>
        </z-paging>
    </view>
</template>

<script>
import ETFList from "./components/etf-list.vue";

export default {
    components: {
        "etf-list": ETFList,
    },
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            isLoading: false,
            dataList: [],
        };
    },
    computed: {
        theme() {
            return this.$store.getters.theme;
        },
    },
    onShow() {},
    methods: {
        queryList(pageNo, pageSize) {
            this.isLoading = true;
            this.post("/etf/list", {
                page: pageNo,
            })
                .then((res) => {
                    if (res.code == 1) {
                        this.$refs.paging.complete(res.data.data);
                    } else {
                        this.$refs.paging.complete([]);
                    }
                    this.isLoading = false;
                })
                .catch(() => {
                    this.$refs.paging.complete([]);
                    this.isLoading = false;
                });
        },
        handleETFClick(item) {
            console.log("ETF item clicked", item);
            this.router.push({
                path: "/pages/statistic/statistic",
                query: { id: item.id || item.code },
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
