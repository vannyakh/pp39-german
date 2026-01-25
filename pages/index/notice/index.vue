<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
			<app-nav slot="top" :title="$t('index2')"></app-nav>
				<v-container size="md">
					<view @click="router.push('/pages/index/notice/details?id='+item.id)" class="listBox" :style="{background: theme.backgroundCard}" v-for="(item,index) in list" :key="index">
						<view class="font-28 weight-bold hidden-2 margin-b-12" :style="{color: theme.textPrimary}">
							{{item.title}}
						</view>
						<text class="font-24" :style="{color: theme.textTertiary}">{{item.createtime}}</text>
					</view>
				</v-container>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			};
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.post('/index/messages_list', {
					page: pageNo,
				}).then(res => {
					//console.log('数据', res)
					if (res.code == 1) {
						this.$refs.paging.complete(res.data.data);
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.min-height-screen {
		min-height: 100vh;
	}

	.listBox {
		padding: 20rpx 32rpx;
		margin-bottom: 12rpx;
		margin-top: 20rpx;
		border-radius: 15rpx;
	}
</style>
