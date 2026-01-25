<template>
	<view class="min-height-screen" :style="{background: theme.backgroundSecondary}">
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
			<app-nav slot="top" :title="$t('invest.my_records_title')" blur></app-nav>

			<!-- Status Filter Tabs -->
			<view slot="top" class="filter-tabs-container" :style="{background: theme.backgroundCard}">
				<view class="filter-tabs" :style="{background: theme.backgroundTertiary}">
					<view
						@click="set(1)"
						class="filter-tab"
						:class="{ 'active': status === 1 }"
						:style="getTabStyle(status === 1)"
					>
						{{ $t('invest.pending') }}
					</view>
					<view
						@click="set(2)"
						class="filter-tab"
						:class="{ 'active': status === 2 }"
						:style="getTabStyle(status === 2)"
					>
						{{ $t('invest.active') }}
					</view>
					<view
						@click="set(3)"
						class="filter-tab"
						:class="{ 'active': status === 3 }"
						:style="getTabStyle(status === 3)"
					>
						{{ $t('invest.completed') }}
					</view>
					<view
						@click="set(0)"
						class="filter-tab"
						:class="{ 'active': status === 0 }"
						:style="getTabStyle(status === 0)"
					>
						{{ $t('invest.cancelled') }}
					</view>
				</view>
			</view>

			<v-container size="md">
				<view class="records-container">
                    <!-- Loading Skeleton -->
                    <view v-if="isLoading && list.length === 0" class="skeleton-container">
                        <view v-for="(item, index) in 3" :key="index" class="skeleton-record-card" :style="{background: theme.backgroundCard}">
                            <!-- Skeleton Header -->
                            <view class="skeleton-header">
                                <view class="skeleton-product-info">
                                    <view class="skeleton-product-name" :style="getSkeletonStyle()"></view>
                                    <view class="skeleton-amount" :style="getSkeletonStyle()"></view>
                                </view>
                                <view class="skeleton-status-badge" :style="getSkeletonStyle()"></view>
                            </view>

                            <!-- Skeleton Details -->
                            <view class="skeleton-details">
                                <view class="skeleton-row" v-for="i in 4" :key="i" :style="{ borderBottomColor: theme.neutral__200 }">
                                    <view class="skeleton-label" :style="getSkeletonStyle()"></view>
                                    <view class="skeleton-value" :style="getSkeletonStyle()"></view>
                                </view>
                            </view>

                            <!-- Skeleton Button -->
                            <view class="skeleton-button" :style="getSkeletonStyle()"></view>
                        </view>
                    </view>

                    <!-- Investment Record Cards -->
                    <view class="investment-record-card" v-else v-for="(item, index) in list" :key="index"
                    :style="{background: theme.backgroundCard}"
                    @click="handleDetailClick(item)">
                        <!-- Card Header -->
                        <view class="card-header">
                            <view class="product-info">
                                <text class="product-name" :style="{ color: theme.textPrimary }">{{ item.name }}</text>
                                <text class="investment-amount" :style="{ color: theme.primary__light }">{{ item.num }}</text>
                            </view>
                            <view class="status-badge" :class="getStatusClass(item.status)" :style="getStatusStyle(item.status)">
                                <text class="status-text">{{ getStatusText(item.status) }}</text>
                            </view>
                        </view>

                        <!-- Investment Details -->
                        <view class="investment-details">
                            <view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
						<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.amount') }}</text>
                                <text class="detail-value" :style="{ color: theme.textPrimary }">{{ item.num }}</text>
                            </view>
                            <view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
						<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.unit_price') }}</text>
                                <text class="detail-value" :style="{ color: theme.textPrimary }">{{ item.price }}</text>
                            </view>
                            <view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
						<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.interest_rate') }}</text>
                                <text class="detail-value" :style="{ color: theme.primary__light }">{{ item.rixi || 0 }}%</text>
                            </view>
                            <view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
						<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.investment_date') }}</text>
                                <text class="detail-value" :style="{ color: theme.textPrimary }">{{ item.addtime }}</text>
                            </view>

                            <!-- Conditional Details -->
                            <view v-if="item.status == 2 || item.status == 3 || item.status == 0" class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
							<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.approval_date') }}</text>
                                <text class="detail-value" :style="{ color: theme.textPrimary }">{{ item.approvetime }}</text>
                            </view>
                            <view v-if="item.status == 2 || item.status == 3" class="detail-row">
							<text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.last_update') }}</text>
                                <text class="detail-value" :style="{ color: theme.textPrimary }">{{ item.lasttime }}</text>
                            </view>
                        </view>

                        <!-- Action Button -->
                        <view v-if="item.status == 2 || item.status == 3" class="action-button-container">
                            <button
                                    class="action-button"
                                    :style="getButtonStyle()"
                                    @click.stop="router.push('/pages/invest/details?id='+item.id)"
                            >
                                <text :style="{ color: theme.white }">{{ $t('invest.view_details') }}</text>
                            </button>
                        </view>
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
				status:1,
				list: [],
				isLoading: false,
			};
		},

		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		methods: {
			set(index) {
				if (this.status != index) {
					this.status = index
					this.isLoading = true
					this.$refs.paging.reload()
				}
			},

			getStatusClass(status) {
				const statusClasses = {
					0: 'cancelled',
					1: 'pending',
					2: 'active',
					3: 'completed'
				}
				return statusClasses[status] || 'pending'
			},

			getStatusText(status) {
				const statusTexts = {
					0: this.$t('invest.cancelled'),
					1: this.$t('invest.pending'),
					2: this.$t('invest.active'),
					3: this.$t('invest.completed')
				}
				return statusTexts[status] || this.$t('invest.unknown_status')
			},

			queryList(pageNo, pageSize) {
				this.isLoading = true
				this.post('/invest/history', {
					status: this.status,
					page: pageNo,
				}).then(res => {
					if (res.code == 1) {
						this.$refs.paging.complete(res.data.data);
					} else {
						this.$refs.paging.complete([]);
					}
					this.isLoading = false
				}).catch(() => {
					this.$refs.paging.complete([]);
					this.isLoading = false
				})
			},

            handleDetailClick(item) {
                this.router.push('/pages/invest/details?id=' + item.id);
            },
            getSkeletonStyle() {
                return {
                    background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 37%, ${this.theme.neutral__200} 63%)`
                }
            },
            getTabStyle(isActive) {
                if (isActive) {
                    return {
                        background: `linear-gradient(135deg, ${this.theme.primary__light} 0%, ${this.theme.success__500} 100%)`,
                        color: this.theme.white
                    }
                }
                return {
                    color: this.theme.textTertiary
                }
            },
            getStatusStyle(status) {
                const statusStyles = {
                    0: { background: this.theme.danger__50, color: this.theme.danger__700 },      // Cancelled
                    1: { background: this.theme.warning__50, color: this.theme.warning__700 },    // Pending
                    2: { background: this.theme.success__50, color: this.theme.success__700 },   // Active
                    3: { background: this.theme.info__100, color: this.theme.info__800 }  // Completed
                };
                return statusStyles[status] || statusStyles[1];
            },
            getButtonStyle() {
                return {
                    background: `linear-gradient(135deg, ${this.theme.primary__light} 0%, ${this.theme.success__500} 100%)`
                }
            }
		},
	};
</script>

<style lang="scss" scoped>
/* Filter Tabs */
.filter-tabs-container {
	padding: 20rpx;
}

.filter-tabs {
	display: flex;
	border-radius: 16rpx;
	padding: 6rpx;
	gap: 6rpx;
}

.filter-tab {
	flex: 1;
	padding: 16rpx 12rpx;
	text-align: center;
	border-radius: 12rpx;
	font-size: 26rpx;
	font-weight: 500;
	transition: all 0.3s ease;

	&.active {
		font-weight: 600;
	}
}

/* Records Container */
.records-container {
	padding: 30rpx 0;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

/* Skeleton Loading Styles */
.skeleton-container {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.skeleton-record-card {
	border-radius: 20rpx;
	padding: 30rpx;
}

.skeleton-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 25rpx;
}

.skeleton-product-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.skeleton-product-name {
	width: 200rpx;
	height: 32rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 4rpx;
}

.skeleton-amount {
	width: 120rpx;
	height: 28rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 4rpx;
}

.skeleton-status-badge {
	width: 80rpx;
	height: 30rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 20rpx;
}

.skeleton-details {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
	margin-bottom: 25rpx;
}

.skeleton-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12rpx 0;
	border-bottom: 2rpx solid;
}

.skeleton-label {
	width: 40%;
	height: 26rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 4rpx;
}

.skeleton-value {
	width: 30%;
	height: 26rpx;
	background-size: 400% 100%;
	animation: skeleton-loading 1.4s ease infinite;
	border-radius: 4rpx;
}

.skeleton-button {
	width: 100%;
	height: 70rpx;
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

/* Investment Record Card */
.investment-record-card {
	border-radius: 20rpx;
	padding: 30rpx;
	transition: all 0.3s ease;

	&:hover {
		transform: translateY(-2rpx);
	}
}

/* Card Header */
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 25rpx;
}

.product-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.product-name {
	font-size: 32rpx;
	font-weight: bold;
	line-height: 1.3;
}

.investment-amount {
	font-size: 28rpx;
	font-weight: 600;
}

/* Status Badge */
.status-badge {
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	font-weight: 600;
}

.status-text {
	font-size: 22rpx;
	font-weight: 600;
}

/* Investment Details */
.investment-details {
	display: flex;
	flex-direction: column;
	gap: 15rpx;
	margin-bottom: 25rpx;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12rpx 0;
	border-bottom: 2rpx solid;

	&:last-child {
		border-bottom: none;
	}
}

.detail-label {
	font-size: 26rpx;
	font-weight: 500;
}

.detail-value {
	font-size: 26rpx;
	font-weight: 600;
}

/* Action Button */
.action-button-container {
	margin-top: 20rpx;
}

.action-button {
	width: 100%;
	height: 70rpx;
	border: none;
	border-radius: 16rpx;
	font-size: 28rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;

	&:active {
		transform: translateY(2rpx);
	}
}

/* Responsive adjustments */
@media (max-width: 750rpx) {
	.filter-tabs-container {
		padding: 15rpx;
	}

	.filter-tab {
		padding: 14rpx 10rpx;
		font-size: 24rpx;
	}

	.records-container {
		padding: 20rpx 0;
		gap: 15rpx;
	}

	.skeleton-record-card,
	.investment-record-card {
		padding: 25rpx;
	}

	.skeleton-product-name {
		width: 180rpx;
		height: 30rpx;
	}

	.skeleton-amount {
		width: 100rpx;
		height: 26rpx;
	}

	.skeleton-status-badge {
		width: 70rpx;
		height: 28rpx;
	}

	.skeleton-label,
	.skeleton-value {
		height: 24rpx;
	}

	.skeleton-button {
		height: 65rpx;
	}

	.product-name {
		font-size: 30rpx;
	}

	.investment-amount {
		font-size: 26rpx;
	}

	.detail-label,
	.detail-value {
		font-size: 24rpx;
	}

	.action-button {
		height: 65rpx;
		font-size: 26rpx;
	}
}
</style>
