<template>
	<view class="min-height-screen" :style="{background: theme.backgroundSecondary}">
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
            <app-nav slot="top" title="Investment" blur showRightImage
                     rightImageUrl="/static/imgs/fund/record.png" @right-action="router.push('/pages/invest/my_record')"
            ></app-nav>

            <v-container size="md">
                <view class="ai-trading-container">
                    <!-- Loading Skeleton -->
                    <view v-if="list.length === 0" class="skeleton-container">
                        <view v-for="(item, index) in 3" :key="index" class="skeleton-card" :style="{background: theme.backgroundCard}">
                            <!-- Skeleton Image -->
                            <view class="skeleton-image" :style="getSkeletonStyle()"></view>

                            <!-- Skeleton Content -->
                            <view class="skeleton-content">
                                <view class="skeleton-title" :style="getSkeletonStyle()"></view>
                                <view class="skeleton-badge" :style="getSkeletonStyle()"></view>

                                <view class="skeleton-details">
                                    <view class="skeleton-row" v-for="i in 6" :key="i" :style="{ borderBottomColor: theme.neutral__200 }">
                                        <view class="skeleton-label" :style="getSkeletonStyle()"></view>
                                        <view class="skeleton-value" :style="getSkeletonStyle()"></view>
                                    </view>
                                </view>

                                <view class="skeleton-button" :style="getSkeletonStyle()"></view>
                            </view>
                        </view>
                    </view>

                    <!-- Investment Cards -->
                    <investment-card
                        v-else
                        v-for="(item,index) in list"
                        :key="index"
                        :item="item"
                        @subscribe="handleSubscription"
                    />
                </view>
            </v-container>
		</z-paging>
        <home-return/>
	</view>
</template>

<script>
	import InvestmentCard from './components/investment-card.vue'

	export default {
		components: {
			InvestmentCard
		},
		data() {
			return {
				list: [],
			}
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.post('/invest/index', {
					page: pageNo,
					pageSize: pageSize
				}).then(res => {
					if (res.code == 1) {
						// Complete the paging with the data
						this.$refs.paging.complete(res.data);
					} else {
						// Handle error case
						this.$refs.paging.complete([]);
					}
				}).catch(() => {
					// Handle network error
					this.$refs.paging.complete([]);
				})
			},

			formatDate(date) {
				if (!date) {
					return 'Oct 10, 2025'
				}
				const d = new Date(date)
				const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
							   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
			},

			handleSubscription(item) {
				// Check if product is active
				if (item.status !== 1) {
					uni.showToast({
						title: 'This product is currently unavailable',
						icon: 'none'
					})
					return
				}

				uni.showLoading({
					title: 'Processing...'
				})

				// Simulate subscription process
				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: 'Subscription successful!',
						icon: 'success'
					})

					// Navigate to investment details
					this.router.push(`/pages/invest/investing?id=${item.id}`)
				}, 1500)
			},
			getSkeletonStyle() {
				return {
					background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 37%, ${this.theme.neutral__200} 63%)`
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
.ai-trading-container {
	padding: 30rpx 0;
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

/* Skeleton Loading Styles */
.skeleton-container {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.skeleton-card {
	border-radius: 20rpx;
	overflow: hidden;
}

.skeleton-image {
	width: 100%;
	height: 300rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
}

.skeleton-content {
	padding: 30rpx;
}

.skeleton-title {
	width: 70%;
	height: 32rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 4rpx;
	margin-bottom: 15rpx;
}

.skeleton-badge {
	width: 80rpx;
	height: 30rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 20rpx;
	margin-bottom: 30rpx;
}

.skeleton-details {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin-bottom: 40rpx;
}

.skeleton-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15rpx 0;
	border-bottom: 2rpx solid;
}

.skeleton-label {
	width: 40%;
	height: 28rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 4rpx;
}

.skeleton-value {
	width: 30%;
	height: 28rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 4rpx;
}

.skeleton-button {
	width: 100%;
	height: 80rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 16rpx;
}

@keyframes skeleton-loading {
	0% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0 50%;
	}
}

/* Responsive adjustments for skeleton */
@media (max-width: 750rpx) {
	.skeleton-image {
		height: 250rpx;
	}

	.skeleton-content {
		padding: 25rpx;
	}

	.skeleton-title {
		height: 30rpx;
	}

	.skeleton-label,
	.skeleton-value {
		height: 26rpx;
	}

	.skeleton-button {
		height: 70rpx;
	}
}
</style>
