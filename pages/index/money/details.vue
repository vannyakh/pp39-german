<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary}">
		<bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
			<app-nav slot="top" :title="$t('EarningsList')"></app-nav>


			<view slot="top" class="height-180 padding-w-48 flex align-center justify-between" :style="{background: theme.backgroundCard}">
				<view class="height-100 flex direction-column align-start justify-between">
					<text class="font-36" :style="{color: theme.textPrimary}">{{total_interest?total_interest:0}}</text>
					<text class="font-28" :style="{color: theme.textSecondary}">{{$t('Accumulated income')}}</text>
				</view>
				<view class="height-100 flex direction-column align-end justify-between">
					<text class="font-36" :style="{color: theme.textPrimary}">{{all_day?all_day:0}} {{$t('Week')}}</text>
					<text class="font-28" :style="{color: theme.textSecondary}">{{$t('Accumulated earnings week')}}</text>
				</view>
			</view>
			<view slot="top" class="height-90 padding-w-40 flex align-center justify-between margin-t-0" :style="{background: theme.backgroundCard}">
				<text class="font-26" :style="{color: theme.textTertiary}">{{$t('invest17')}}</text>
				<text class="font-26" :style="{color: theme.textTertiary}">{{$t('invest18')}}</text>
			</view>

			<view class="listBox" :style="getListItemStyle()" v-for="(item,index) in list" :key="index">
				<text class="font-28" :style="{color: theme.success}">+{{item.num}}</text>
				<text class="font-24" :style="{color: theme.textSecondary}">{{item.createtime}}</text>
			</view>

		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				id: '',
				alr_day: 0,
				alr_num: 0,
				curr_name: '',
				total_interest: 0

				// theme: '',
			};
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		onLoad(e) {
			this.id = e.id
			this.getInfo()
		},
		onShow() {

		},
		methods: {
			getInfo(){
				this.post('/stock_fund/product_user_con', {
					id: this.id,
				}).then(res => {
					if (res.code == 1) {
						this.alr_day = res.data.alr_day
						this.alr_num = res.data.alr_num
						this.curr_name = res.data.curr_name
					}
				})
			},
			queryList(pageNo, pageSize) {
				this.post('/stock_fund/product_user_log', {
					page: pageNo,
					id: this.id,
				}).then(res => {
					if (res.code == 1) {
						console.log('数据', res)
						this.total_interest = res.data.total_interest
						this.all_day = res.data.all_day
						this.$refs.paging.complete(res.data.detail_log.data);
					}
				})
			},
			getListItemStyle() {
				return {
					background: this.theme.backgroundCard
				}
			}
		}
	}
</script>

<style lang="scss">
	.min-height-screen {
		min-height: 100vh;
	}

	.listBox {
		width: 100%;
		height: 96rpx;
		border-radius: 24rpx;
		margin-bottom: 1px;
		padding: 0 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
