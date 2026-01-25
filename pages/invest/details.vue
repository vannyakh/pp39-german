<template>
	<view class="min-height-screen" :style="{background: theme.backgroundSecondary}">
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
			<app-nav slot="top" :title="$t('invest.earnings_list')"></app-nav>

			<!-- Simple Summary Section -->
			<view slot="top" class="summary-section" :style="{background: theme.backgroundTertiary}">
				<view class="summary-row">
					<view class="summary-item">
						<text class="summary-value" :style="{ color: theme.textPrimary }">{{total_interest}}</text>
						<text class="summary-label" :style="{ color: theme.textTertiary }">{{$t('invest.accumulated_income')}}</text>
					</view>
					<view class="summary-item">
						<text class="summary-value" :style="{ color: theme.textPrimary }">{{all_day}} {{$t('invest.days')}}</text>
						<text class="summary-label" :style="{ color: theme.textTertiary }">{{$t('invest.accumulated_days')}}</text>
					</view>
				</view>
			</view>

			<!-- Simple List Header -->
			<view slot="top" class="list-header" :style="{background: theme.backgroundTertiary}">
				<text class="header-text" :style="{ color: theme.textTertiary }">{{$t('invest.quantity')}}</text>
				<text class="header-text" :style="{ color: theme.textTertiary }">{{$t('invest.time')}}</text>
			</view>

			<!-- Simple List -->
			<v-container size="md">
                <view class="earnings-list">
                    <view class="list-item" v-for="(item,index) in list" :key="index" :style="{background: theme.backgroundCard}">
                        <text class="earnings-amount" :style="{ color: theme.success }">+{{item.num}}</text>
                        <text class="earnings-time" :style="{ color: theme.textTertiary }">{{item.createtime}}</text>
                    </view>
                </view>
            </v-container>

		</z-paging>

        <home-return/>
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
				total_interest: 0,
                all_day: 0
			};
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		onLoad(e) {
			this.id = e.id
		},
		onShow() {

		},
		methods: {
			// getInfo(){
			// 	this.post('/invest/product_user_con', {
			// 		id: this.id,
			// 	}).then(res => {
			// 		if (res.code == 1) {
			// 			this.alr_day = res.data.alr_day
			// 			this.alr_num = res.data.alr_num
			// 			this.curr_name = res.data.curr_name
			// 		}
			// 	})
			// },
			queryList(pageNo, pageSize) {
				this.post('/invest/product_user_log', {
					page: pageNo,
					id: this.id,
				}).then(res => {
					if (res.code == 1) {
						this.total_interest = res.data.total_interest
						this.all_day = res.data.all_day
						this.$refs.paging.complete(res.data.detail_log.data);
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
/* Simple Summary Section */
.summary-section {
	padding: 40rpx;
	margin: 20rpx;
	border-radius: 12rpx;
}

.summary-row {
	display: flex;
	justify-content: space-between;
}

.summary-item {
	text-align: center;
}

.summary-value {
	display: block;
	font-size: 36rpx;
	font-weight: 600;
	margin-bottom: 8rpx;
}

.summary-label {
	display: block;
	font-size: 24rpx;
}

/* Simple List Header */
.list-header {
	padding: 24rpx 40rpx;
	margin: 0 20rpx;
	display: flex;
	justify-content: space-between;
	border-radius: 8rpx;
}

.header-text {
	font-size: 26rpx;
	font-weight: 500;
}

/* Simple List */
.earnings-list {
	padding: 20rpx 0;
}

.list-item {
	padding: 32rpx 40rpx;
	margin-bottom: 2rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 8rpx;
}

.earnings-amount {
	font-size: 28rpx;
	font-weight: 600;
}

.earnings-time {
	font-size: 24rpx;
}
</style>
