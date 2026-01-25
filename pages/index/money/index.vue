<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary}">
        <bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" @query="queryList" :pageSize="20">
			<app-nav slot="top" :title="$t('Fund')" showRightImage
					rightImageUrl="/static/imgs/fund/record.png" @right-action="router.push('/pages/index/money/fund_record')"></app-nav>
			<view class="padding-30">
				<view class="investment-card" :style="getCardStyle()"
					v-for="(item, index) in list" :key="index">
					<view class="flex justify-between align-center" :style="getCardHeaderBorderStyle()">
						<view class="card-header width-100b">
							<view class="font-30 bold-font" :style="{color: theme.textPrimary}">{{ item.name }}</view>
							<view class="flex align-center gap-20">
								<view class="font-30 bold-font margin-t-10" :style="{color: theme.textPrimary}">{{$t('Price')}}:</view>
								<view class="font-30 bold-font margin-t-10" :style="{color: theme.textPrimary}">{{ item.price }}</view>
								<!-- <view v-if="item.country==42" class="font-30 margin-t-10" :style="{color: theme.textPrimary}">{{$t('Symbol_ms')}}</view> -->
								<!-- <view v-if="item.country==39" class="font-30 margin-t-10" :style="{color: theme.textPrimary}">{{$t('Symbol_cn')}}</view> -->
							</view>

							<view class="font-30 margin-t-10" :style="{color: theme.textSecondary}">{{$t('Income') }}: <span class="font-30 bold-font margin-l-10" :style="{color: theme.textPrimary}">{{ item.fast_rixi }} %</span></view>
							<!-- <view class="range weight-bold font-32" :style="{color: theme.textPrimary}">
								{{ item.min_num }}-{{ item.max_num }}</view>
							<view class="range font-26" :style="{color: theme.textTertiary}">
								{{ $t('Single Limit') }}</view> -->
						</view>
						<view class="width-100b">
							<image class="card-image"
								:src="item.increase<=0?'/static/imgs/fund/green-line.png':'/static/imgs/fund/invest_line_up.png'"
								mode=""></image>
						</view>
					</view>
					<view class="card-footer" :style="{borderTop: `1rpx solid ${theme.neutral__200}`}">
						<view class="yield-info flex justify-between align-center">
							<view class="flex justify-between align-center gap-20">
								<view class="yield-label weight-bold" :style="{color: theme.primary__500}">{{ $t('Cycle') }}</view>
								<view class="duration weight-bold" :style="getDurationStyle()">{{ item.day }}{{ $t('day') }}</view>
							</view>
							<!-- <view class="yield-value" :style="{color: theme.textPrimary}">
								{{ item.rixi }}/{{ $t('day') }}</view> -->
							<view @click="router.push('/pages/index/money/buy_details?share_id=' + item.share_id + '&id=' + item.id)"
								class="invest-button" :style="getInvestButtonStyle()">
								<view class="button-text font-22 weight-bold" :style="{color: theme.white}">{{ $t('Buy now') }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				searchVal: '',
				statusBar: uni.getSystemInfoSync().statusBarHeight,
				list: [

				],
				list_all: [],
				tabe_fil: 1,
			};
		},
		computed: {
			i18n() {
				return this.$t('message');
			},
			theme() {
				return this.$store.getters.theme;
			}
		},
		onShow() {

			this.timer = this.searchVal = '';
		},
		methods: {
			queryList(pageNo, pageSize) {
				this.post('/stock_fund/index').then((res) => {
					if (res.code == 1) {
						this.list = res.data.data
						this.$refs.paging.complete();
					}
				});
			},
			searchCion() {
				if (this.searchVal == '') {
					this.list = this.list_all;
					return;
				}
				let arrtemp = [];
				this.list_all.forEach((item) => {
					if (item.name.indexOf(this.searchVal.toUpperCase()) != '-1') {
						arrtemp.push(item);
					}
				});
				this.list = arrtemp;
			},
			getCardStyle() {
				return {
					background: this.theme.backgroundCard,
					border: `1rpx solid ${this.theme.neutral__200}`
				}
			},
			getCardHeaderBorderStyle() {
				return {
					borderBottom: `1rpx solid ${this.theme.neutral__200}`
				}
			},
			getDurationStyle() {
				return {
					color: this.theme.primary__500,
					background: this.getColorWithOpacity(this.theme.primary__500, 0.1)
				}
			},
			getInvestButtonStyle() {
				return {
					background: this.theme.primary__500
				}
			},
			getColorWithOpacity(color, opacity) {
				if (!color) return 'transparent'
				if (color.startsWith('#')) {
					const r = parseInt(color.slice(1, 3), 16)
					const g = parseInt(color.slice(3, 5), 16)
					const b = parseInt(color.slice(5, 7), 16)
					return `rgba(${r}, ${g}, ${b}, ${opacity})`
				}
				if (color.startsWith('rgb')) {
					return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
				}
				return color
			}
		}
	};
</script>

<style lang="scss" scoped>
	.min-height-screen {
		min-height: 100vh;
		// background: linear-gradient(135deg, #13151a 0%, #1a1d24 100%);
	}

	.fixed1 {
		position: fixed;
		top: 0;
		z-index: 1010;
		backdrop-filter: blur(10px);
	}

	.listBox {
		width: 100%;
		padding: 24rpx;
		border-radius: 28rpx;
		margin: 24rpx auto;
		backdrop-filter: blur(10px);
	}

	.filter {
		width: 100%;
		display: flex;
		margin: 16rpx auto;
		padding: 16rpx 24rpx;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
		position: relative;
		border-radius: 20rpx;
		backdrop-filter: blur(5px);
	}

	.investment-card {
		border-radius: 20rpx;
		backdrop-filter: blur(10px);
		overflow: hidden;
		transition: all 0.3s ease;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

		&:hover {
			transform: translateY(-2rpx);
		}

		.card-header {
			padding: 30rpx;

			.title {
				font-size: 28rpx;
				font-weight: 600;
			}

			.range {
				margin-top: 10rpx;
			}
		}

		.card-image {
			width: 100%;
			height: 150rpx;
			object-fit: cover;
		}

		.card-footer {
			padding: 30rpx;

			.yield-info {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 20rpx;

				.yield-label {
					font-size: 22rpx;
					font-weight: bold;
				}

				.duration {
					padding: 5rpx 30rpx;
					border-radius: 10rpx;
					font-size: 24rpx;
				}
			}

			.yield-value {
				font-size: 24rpx;
				font-weight: 600;
			}

			.invest-button {
				border-radius: 22rpx;
				padding: 10px 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				transition: all 0.3s ease;

				&:active {
					transform: scale(0.98);
					opacity: 0.9;
				}

				.button-text {
					margin-left: 10rpx;
				}
			}
		}
	}

	.topBox {
		background-size: cover;
		background-position: center;
		height: 300rpx;
		width: 100%;
		display: flex;
		padding: 40rpx;
		position: relative;
	}

	.heng {
		height: 3px;
	}
</style>
