<template>
	<view class="min-height-screen" :style="{background: theme.backgroundSecondary}">
		<z-paging :language="$t('locale')" ref="paging" :pageSize="20">
			<app-nav slot="top" :title="$t('invest.details_title')" blur></app-nav>

			<v-container size="md">
			    <view class="investing-container">
                    <!-- Product Header Card -->
                    <view class="product-header-card" :style="{background: theme.backgroundCard}">
                        <view class="product-image-container">
                            <u-image
                                    class="product-image"
                                    :src="obj.logo_image"
                                    mode="aspectFill"
                                    width="100%"
                                    height="100%"
                                    :showLoading="true"
                                    :lazyLoad="true"
                            >
                                <view slot="loading">
                                    <u-loading-icon :color="theme.primary__light"></u-loading-icon>
                                </view>
                            </u-image>
                        </view>

                        <view class="product-info">
                            <view class="product-title-row">
                                <view class="product-title" :style="{ color: theme.textPrimary }">{{ obj.name }}</view>
                                <view v-if="obj.type" class="type-badge" :style="{ background: theme.primary__light, color: theme.white }">{{ obj.type }}</view>
                            </view>
                            <view class="product-price" :style="{ color: theme.primary__light }">{{ obj.price }}</view>
                            <view class="interest-rate-badge" :style="getBadgeStyle()">
                                <text class="rate-text" :style="{ color: theme.white }">{{ obj.rixi }} Daily Interest</text>
                            </view>
                        </view>
                    </view>

                    <!-- Investment Details Card -->
                    <view class="details-card" :style="{background: theme.backgroundCard}">
                        <view class="card-title" :style="{ color: theme.textPrimary }">{{ $t('invest.details_card_title') }}</view>

                        <view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
                            <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.daily_interest_rate') }}</text>
                            <text class="detail-value" :style="{ color: theme.primary__light }">{{ obj.rixi }}</text>
                        </view>
                        <view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
                            <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.minimum_investment') }}</text>
                            <text class="detail-value" :style="{ color: theme.primary__light }">{{ obj.min_num }} {{ $t('invest.units') }}</text>
                        </view>
                        <view class="detail-row" :style="{ borderBottomColor: theme.neutral__200 }">
                            <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.period') }}</text>
                            <text class="detail-value" :style="{ color: theme.primary__light }">{{ obj.day }} {{ $t('invest.days') }}</text>
                        </view>
                        <view class="detail-row">
                            <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('invest.maximum_investment') }}</text>
                            <text class="detail-value" :style="{ color: theme.primary__light }">{{ obj.max_num }} {{ $t('invest.units') }}</text>
                        </view>
                    </view>

                    <!-- Investment Input Card -->
                    <view class="investment-input-card" :style="{background: theme.backgroundCard}">
                        <view class="card-title" :style="{ color: theme.textPrimary }">{{ $t('invest.amount_title') }}</view>

                        <view class="input-section">
                            <view class="input-container">
                                <input
                                        class="amount-input"
                                        type="number"
                                        v-model="money"
                                        :placeholder="$t('invest.enter_amount')"
                                        :style="getInputStyle()"
                                        @input="validateAmount"
                                />
                            </view>

                            <!-- Investment Summary -->
                            <view class="investment-summary" v-if="money" :style="{background: theme.backgroundTertiary}">
                                <view class="summary-row">
                                    <text class="summary-label" :style="{ color: theme.textTertiary }">{{ $t('invest.amount') }}</text>
                                    <text class="summary-value" :style="{ color: theme.textPrimary }">{{ money }}</text>
                                </view>
                                <view class="summary-row">
                                    <text class="summary-label" :style="{ color: theme.textTertiary }">{{ $t('invest.daily_interest') }} ({{ obj.rixi }})</text>
                                    <text class="summary-value" :style="{ color: theme.textPrimary }">{{ calculateDailyInterest() }}</text>
                                </view>
                                <view class="summary-row total" :style="{ borderTopColor: theme.neutral__200 }">
                                    <text class="summary-label" :style="{ color: theme.textTertiary }">{{ $t('invest.total_return') }} ({{ obj.day }} {{ $t('invest.days') }})</text>
                                    <text class="summary-value" :style="{ color: theme.textPrimary }">{{ calculateTotalReturn() }}</text>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- Invest Button -->
                    <view class="invest-button-container">
                        <button
                                class="invest-button"
                                :class="{ 'disabled': !isValidAmount }"
                                :disabled="!isValidAmount"
                                :style="getButtonStyle()"
                                @click="touzi"
                        >
                            <text :style="getButtonTextStyle()">{{ $t('invest.now') }}</text>
                        </button>
                    </view>

                    <!-- Product Description -->
                    <view class="description-card" v-if="obj.description" :style="{background: theme.backgroundCard}">
                        <view class="card-title" :style="{ color: theme.textPrimary }">{{ $t('invest.product_description') }}</view>
                        <view class="description-content" :style="{ color: theme.textTertiary }">
                            <text>{{ obj.description }}</text>
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
				id: '',
				obj: {},
				money: '',
				flag: true,
				isValidAmount: false,
				list: [],
			};
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		onLoad(e) {
			this.id = e.id
			this.product_con()
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.$refs.paging.complete([]);
			},

			validateAmount() {
				const amount = parseFloat(this.money)
				this.isValidAmount = amount > 0 && amount >= this.obj.min_num && amount <= this.obj.max_num
			},

			calculateDailyInterest2() {
				if (!this.money) return '0.00'
				const dailyInterest = (parseFloat(this.money) * parseFloat(this.obj.fast_rixi)) / 100
				return dailyInterest.toFixed(3)
			},
            calculateTotalReturn2() {
                // Total return = daily interest * period
                if (!this.money || !this.obj.day) return '0.00'
                const dailyInterest = parseFloat(this.calculateDailyInterest())
                const totalReturn = dailyInterest * parseFloat(this.obj.day)
                return totalReturn.toFixed(3)
            },
            calculateDailyInterest() {
                if (!this.money) return '0.00'
                const investAmount = parseFloat(this.obj.price) * parseFloat(this.money)
                const dailyInterest = (investAmount * parseFloat(this.obj.fast_rixi)) / 100
                return dailyInterest.toFixed(2)
            },

            calculateTotalReturn() {
                if (!this.money || !this.obj.day) return '0.00'
                const dailyInterest = parseFloat(this.calculateDailyInterest())
                const totalReturn = dailyInterest * parseFloat(this.obj.day)
                return totalReturn.toFixed(2)
            },

			touzi() {
				if (!this.flag) return
				if (!this.isValidAmount) {
					uni.showToast({
						title: this.$t('invest.enter_valid_amount'),
						icon: 'none'
					})
					return
				}

				uni.showLoading({
					title: this.$t('invest.processing')
				})

				this.post('/invest/buy', {
					num: this.money,
					id: this.id
				}, true).then(res => {
					uni.hideLoading()
					if (res.code == 1) {
						uni.showToast({
							title: res.msg || this.$t('invest.success'),
							icon: 'success'
						})
						setTimeout(() => {
							uni.redirectTo({
								url: '/pages/invest/my_record'
							})
						}, 1500)
					} else {
						uni.showToast({
							title: res.msg || this.$t('invest.failed'),
							icon: 'none'
						})
					}
				}).catch(() => {
					uni.hideLoading()
					uni.showToast({
						title: this.$t('invest.network_error'),
						icon: 'none'
					})
				})
			},

			product_con() {
				uni.showLoading({
					title: this.$t('invest.loading')
				})

				this.post('/invest/detail', {
					id: this.id
				}).then(res => {
					uni.hideLoading()
					if (res.code == 1) {
						this.obj = res.data[0]
					} else {
						uni.showToast({
							title: this.$t('invest.load_failed'),
							icon: 'none'
						})
					}
				}).catch(() => {
					uni.hideLoading()
					uni.showToast({
						title: this.$t('invest.network_error'),
						icon: 'none'
					})
				})
			},
			getBadgeStyle() {
				return {
					background: `linear-gradient(135deg, ${this.theme.primary__light} 0%, ${this.theme.success__500} 100%)`
				}
			},
			getInputStyle() {
				return {
					background: this.theme.backgroundTertiary,
					borderColor: this.theme.neutral__200,
					color: this.theme.textPrimary
				}
			},
			getButtonStyle() {
				if (!this.isValidAmount) {
					return {
						background: this.theme.neutral__400
					}
				}
				return {
					background: `linear-gradient(135deg, ${this.theme.primary__light} 0%, ${this.theme.success__500} 100%)`
				}
			},
			getButtonTextStyle() {
				if (!this.isValidAmount) {
					return {
						color: this.theme.textSecondary
					}
				}
				return {
					color: this.theme.white
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.investing-container {
	padding: 30rpx 0;
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

/* Product Header Card */
.product-header-card {
	border-radius: 20rpx;
	overflow: hidden;
}

.product-image-container {
	width: 100%;
	height: 300rpx;
	position: relative;
	overflow: hidden;
}

.product-image {
	width: 100% !important;
	height: 100% !important;
}

.product-info {
	padding: 30rpx;
	text-align: center;
}

.product-title-row {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	margin-bottom: 15rpx;
	flex-wrap: wrap;
}

.product-title {
	font-size: 32rpx;
	font-weight: bold;
	line-height: 1.4;
}

.type-badge {
	padding: 4rpx 12rpx;
	border-radius: 4rpx;
	font-size: 20rpx;
	font-weight: 500;
	white-space: nowrap;
}

.product-price {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.interest-rate-badge {
	display: inline-block;
	padding: 12rpx 24rpx;
	border-radius: 20rpx;
}

.rate-text {
	font-size: 24rpx;
	font-weight: 600;
}

/* Details Card */
.details-card {
	border-radius: 20rpx;
	padding: 30rpx;
}

.card-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 30rpx;
}

.detail-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 2rpx solid;

	&:last-child {
		border-bottom: none;
	}
}

.detail-label {
	font-size: 28rpx;
	font-weight: 500;
}

.detail-value {
	font-size: 28rpx;
	font-weight: 600;
}

/* Investment Input Card */
.investment-input-card {
	border-radius: 20rpx;
	padding: 30rpx;
}

.input-section {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.input-container {
	position: relative;
}

.amount-input {
	width: 100%;
	height: 80rpx;
	border: 2rpx solid;
	border-radius: 16rpx;
	padding: 0 24rpx;
	font-size: 32rpx;
	box-sizing: border-box;
	outline: none;
}

.amount-input::placeholder {
	color: inherit;
	opacity: 0.6;
	font-size: 28rpx;
}

.investment-summary {
	border-radius: 16rpx;
	padding: 20rpx;
}

.summary-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 0;

	&.total {
		border-top: 2rpx solid;
		margin-top: 10rpx;
		padding-top: 20rpx;
		font-weight: bold;
	}
}

.summary-label {
	font-size: 26rpx;
}

.summary-value {
	font-size: 26rpx;
	font-weight: 600;
}

/* Invest Button */
.invest-button-container {
	margin-top: 20rpx;
}

.invest-button {
	width: 100%;
	height: 90rpx;
	border: none;
	border-radius: 24rpx;
	font-size: 32rpx;
	font-weight: 600;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;

	&:active {
		transform: translateY(2rpx);
	}

	&.disabled {
		opacity: 0.6;

		&:active {
			transform: none;
		}
	}
}

/* Description Card */
.description-card {
	border-radius: 20rpx;
	padding: 30rpx;
}

.description-content {
	font-size: 28rpx;
	line-height: 1.6;
}
</style>
