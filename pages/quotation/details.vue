<template>
	<view class="page-container">
        <bg-animate-shape/>

        <!-- Header Section -->
        <view class="header-section" :style="{paddingTop: statusBar + 'px', background: theme.backgroundSecondary}">
            <view class="relative padding-c-20 padding-w-40">
                <view class="width-100b flex align-center justify-between gap-10">
                    <view class="flex-1 flex align-center hidden-1">
                        <u-icon @click="router.goBack()" name="arrow-left" size="22" :color="theme.textPrimary"></u-icon>
                        <text class="padding-l-20" :style="{color: theme.textPrimary}">{{sharesInfo.name}}</text>
                        <text class="padding-l-10 font-22" :style="{color: theme.textTertiary}">{{sharesInfo.code}}</text>
                    </view>
                    <view class="flex align-center gap-15">
                        <u-icon @click="router.push('/pages/index/searchView')" name="search" size="28" :color="theme.textTertiary"></u-icon>
                        <u-icon @click="shoucang()" :name="sharesInfo.is_cs?'star-fill':'star'" size="25" :color="sharesInfo.is_cs ? theme.warning__500 : theme.textTertiary"></u-icon>
                    </view>
                </view>
            </view>
        </view>

        <!-- Price Section -->
		<view class="price-section" :style="{background: theme.backgroundCard}">
            <view class="flex align-center justify-between">
                <view class="flex-1 flex align-center gap-20">
                    <text class="font-64 weight-bold" :style="{ color: getPriceColor() }">{{ new_price ? new_price : sharesInfo.close }}</text>
                    <text class="font-28" :style="{ color: getPriceColor() }">{{ rise_or_fall }}</text>
                    <text class="font-28" :style="{ color: getPriceColor() }">{{ increase }}%</text>
                </view>
            </view>

			<view class="flex align-center justify-between margin-t-16">
				<view class="flex-1 flex align-center font-24">
					<text class="margin-r-24" :style="{color: theme.textTertiary}">{{$t('hangqing9')}}</text>
					<text :style="{color: theme.textPrimary}">{{ new_price_open ? new_price_open : sharesInfo.open}}</text>
				</view>
				<view class="flex-1 flex align-center justify-center font-24">
					<text class="margin-r-24" :style="{color: theme.textTertiary}">{{$t('hangqing10')}}</text>
					<text :style="{color: theme.textPrimary}">{{ new_price_high ? new_price_high : sharesInfo.high}}</text>
				</view>
				<view class="flex-1 flex align-center justify-end font-24">
					<text class="margin-r-24" :style="{color: theme.textTertiary}">{{$t('hangqing11')}}</text>
					<text :style="{color: theme.textPrimary}">{{sharesInfo.volume}}</text>
				</view>
			</view>
			<view class="flex align-center justify-between margin-t-16">
				<view class="flex-1 flex align-center font-24">
					<text class="margin-r-24" :style="{color: theme.textTertiary}">{{$t('hangqing12')}}</text>
					<text :style="{color: theme.textPrimary}">{{ new_price_close ? new_price_close : sharesInfo.close}}</text>
				</view>
				<view class="flex-1 flex align-center justify-center font-24">
					<text class="margin-r-24" :style="{color: theme.textTertiary}">{{$t('hangqing13')}}</text>
					<text :style="{color: theme.textPrimary}">{{ new_price_low ? new_price_low : sharesInfo.low}}</text>
				</view>
				<view class="flex-1 flex align-center justify-end font-24">
				</view>
			</view>
		</view>

		<!-- Chart Section -->
		<view class="chart-section" :style="{background: theme.backgroundCard}">
			<iframe
				class="chart-iframe"
				:src="htmlSrc"
				frameborder="0"
				scrolling="no"
				allowfullscreen
				loading="lazy"
				@load="onIframeLoad"
				@error="onIframeError">
			</iframe>
		</view>

		<!-- Modern Trading Button -->
		<view class="trading-button-container" :style="{background: theme.backgroundCard}">
			<view class="trading-button-wrapper">
				<view class="favorite-button" @click.stop="shoucang()" :style="getFavoriteButtonStyle()">
					<u-icon :name="sharesInfo.is_cs?'star-fill':'star'" size="26" :color="sharesInfo.is_cs ? theme.warning__500 : theme.white"></u-icon>
				</view>
                <view class="trading-button" @click="Cshow=true,k_or_d='d'" :style="getTradingButtonStyle()">
                    <view class="button-content">
                        <text class="main-text" :style="{color: theme.white}">{{$t('index64')}}</text>
                    </view>
                </view>
			</view>
		</view>

		<!-- Trading Bottom Sheet -->
		<v-bottom-sheet
			:value="Cshow"
			@input="Cshow = $event"
			:title="k_or_d=='k'? $t('Sell'): $t('index64')"
			:backgroundColor="theme.backgroundCard"
			:closeOnBackdrop="true">

			<!-- Account Balance Section -->
			<view class="balance-card" :style="{background: theme.backgroundTertiary}">
				<view class="balance-info">
					<text class="balance-label" :style="{color: theme.textTertiary}">{{$t('AccountBalance')}}</text>
					<text class="balance-amount" :style="{color: theme.textPrimary}">{{Number(sharesInfo.money).toFixed(3)}}</text>
				</view>
			</view>

			<!-- Quantity Input Section -->
			<view class="input-section">
				<text class="section-label" :style="{color: theme.textPrimary}">{{$t('hangqing22')}}</text>
				<view class="input-container" :style="{background: theme.backgroundTertiary}">
					<input class="quantity-input" type="number" v-model="num"
						:placeholder="$t('hangqing23')" placeholder-class="input-placeholder"
						:style="{color: theme.textPrimary}" />
				</view>
				<text class="input-hint" :style="{color: theme.textTertiary}">{{$t('hangqing24')}} {{max_num}} {{$t('hangqing25')}}</text>
			</view>

			<!-- Quick Select Buttons -->
			<view class="quick-select-section">
				<view class="quick-select-buttons">
					<view @click="num=parseInt(max_num/2)" class="quick-btn" :style="getQuickBtnStyle()">
						<text :style="{color: theme.textTertiary}">{{$t('hangqing27')}}</text>
					</view>
					<view @click="num=max_num" class="quick-btn" :style="getQuickBtnStyle()">
						<text :style="{color: theme.textTertiary}">{{$t('hangqing26')}}</text>
					</view>
				</view>
			</view>

			<!-- Order Type Selection -->
			<view class="order-type-section">
				<text class="section-label" :style="{color: theme.textPrimary}">{{$t('PositionDetails18')}}</text>
				<view class="type-buttons">
					<view @click="buyTepy=1" :class="['type-btn', {active: buyTepy==1}]"
						  :style="getTypeBtnStyle(buyTepy==1)">
						<text :style="getTypeBtnTextStyle(buyTepy==1)">{{$t('hangqing28')}}</text>
					</view>
					<view @click="buyTepy=2" :class="['type-btn', {active: buyTepy==2}]"
						  :style="getTypeBtnStyle(buyTepy==2)">
						<text :style="getTypeBtnTextStyle(buyTepy==2)">{{$t('hangqing32')}}</text>
					</view>
				</view>
			</view>

			<!-- Leverage Selection -->
			<!-- <view v-show="lianList" class="leverage-section">
				<text class="section-label" :style="{color: theme.textPrimary}">{{$t('my89')}}</text>
				<view class="leverage-options">
					<view @click="changelian(item,index)" v-for="(item,index) in lianList"
						:class="['leverage-btn', {active: index==lian}]"
						:style="getLeverageBtnStyle(index==lian)">
						<text :style="getLeverageBtnTextStyle(index==lian)">{{item}}</text>
					</view>
				</view>
			</view> -->

			<!-- Fee Information -->
			<view class="fee-section" :style="{borderTop: `1rpx solid ${theme.neutral__200}`, borderBottom: `1rpx solid ${theme.neutral__200}`}">
				<view class="fee-item">
					<text class="fee-label" :style="{color: theme.textTertiary}">{{$t('hangqing30')}}</text>
					<text class="fee-value" :style="{color: theme.textPrimary}">{{sharesInfo.share_fee}}%</text>
				</view>
				<view class="fee-item">
					<text class="fee-label" :style="{color: theme.textTertiary}">{{$t('hangqing31')}}</text>
					<text class="fee-value" :style="{color: theme.textPrimary}">{{sharesInfo.stamp_duty}}%</text>
				</view>
			</view>

			<!-- Limit Price Input -->
			<view v-if="buyTepy==2" class="limit-price-section">
				<text class="section-label" :style="{color: theme.textPrimary}">{{$t('hangqing32')}}</text>
				<view class="input-container" :style="{background: theme.backgroundTertiary}">
					<input class="quantity-input" type="number" v-model="price"
						:placeholder="$t('hangqing33')" placeholder-class="input-placeholder"
						:style="{color: theme.textPrimary}" />
				</view>
			</view>

			<!-- Submit Button -->
			<template #footer>
				<view class="submit-section">
					<view @click="goumai" :class="['submit-button', k_or_d=='k' ? 'sell-button' : 'buy-button', {disabled: !canSubmit}]"
						  :style="getSubmitButtonStyle()">
						<text class="submit-text" :style="getSubmitTextStyle()">{{k_or_d=='k'?$t('Sell'): $t('index64')}}</text>
					</view>
				</view>
			</template>
		</v-bottom-sheet>

	</view>
</template>

<script>
	// import {
	// 	mixin
	// } from "./minxin/minxin.js"
	export default {
		// mixins: [mixin], //混入文件
		data() {
			return {
                statusBar: uni.getSystemInfoSync().statusBarHeight,
				buyTepy: 1,
				k_or_d: '',
				num: '',
				price: '',
				Cshow: false,
				zhezhaoceng: false,
				tentimer: null,
				sharesID: '',
				sharesInfo: {
					close: 0,
					increase: 0,
					rise_or_fall: 0,
				},
				htmlSrc: '',
				new_price: 0,
				lianList: [],
				leverage: 1,
				lian: 0,
				new_price_close: 0,
				new_price_high: 0,
				new_price_low: 0,
				new_price_open: 0,

				flag: true
			};
		},
		watch: {
			Cshow(state) {
				if (state == false) {
					this.num = ''
					this.price = ''
				}
			}
		},
		computed: {
            theme() {
                return this.$store.getters.theme
            },
			themeKey() {
                return this.$store.state.themeKey || 'light'
            },
			increase() {
                const base = Number(this.sharesInfo.previous_close) || 0
                const current = Number(this.new_price || this.sharesInfo.close) || 0
                if (!base) return '0.000'
                return Number(((current - base) / base) * 100).toFixed(3)
            },
			rise_or_fall() {
                const base = Number(this.sharesInfo.previous_close) || 0
                const current = Number(this.new_price || this.sharesInfo.close) || 0
                return Number(current - base).toFixed(3)
            },
			max_num() {
				let money = this.sharesInfo.money * (1 - this.sharesInfo.share_fee / 100 - this.sharesInfo.stamp_duty /
					100)
				let new_price = this.new_price ? this.new_price : this.sharesInfo.close
				return parseInt(money/(new_price))
			},
			canSubmit() {
				// Check if quantity is valid
				const quantity = parseInt(this.num, 10);
				if (!quantity || quantity <= 0) {
					return false;
				}

				// Check if quantity exceeds maximum
				if (quantity > this.max_num) {
					return false;
				}

				// If limit order, check if price is valid
				if (this.buyTepy == 2) {
					const orderPrice = Number(this.price);
					if (!orderPrice || orderPrice <= 0) {
						return false;
					}
				}

				// Check if flag is true (not already processing)
				if (!this.flag) {
					return false;
				}

				return true;
			}
		},
		onUnload() {
			this.zhezhaoceng = true
			clearTimeout(this.tentimer)
		},
		onLoad(e) {
			this.sharesID = e.id
			this.getDetails(true)
		},
		onShow() {
			this.getDetails(true)
			this.htmlSrc = `static/hybrid/kline/index.html?symbol=${encodeURIComponent(this.sharesID || '')}&theme=${this.themeKey}&lang=${encodeURIComponent(this.$t('locale'))}`
		},
		methods: {
			getPriceColor() {
                const base = Number(this.sharesInfo.previous_close) || 0
                const current = Number(this.new_price || this.sharesInfo.close) || 0
                const diff = current - base
                return diff >= 0 ? this.theme.primary__500 : this.theme.success
            },
			onIframeLoad() {
				console.log('Chart iframe loaded successfully');
			},
			onIframeError() {
				console.error('Chart iframe failed to load');
				// You can add fallback content or retry logic here
			},
			changelian(item, index) {
				this.lian = index
				this.leverage = item
			},
			goumai() {
				// Check if form is valid before proceeding
				if (!this.canSubmit) {
					// Show appropriate error message
					const quantity = parseInt(this.num, 10);
					if (!quantity || quantity <= 0) {
						return this.tos(this.$t('hangqing23'));
					}
					if (quantity > this.max_num) {
						return this.tos(`${this.$t('hangqing24')} ${this.max_num}`);
					}
					if (this.buyTepy == 2) {
						const orderPrice = Number(this.price);
						if (!orderPrice || orderPrice <= 0) {
							return this.tos(this.$t('hangqing33'));
						}
					}
					return;
				}

				const quantity = parseInt(this.num, 10);
				let orderPrice = 0;
				if (this.buyTepy == 2) {
					orderPrice = Number(this.price);
				}
				this.flag = false
				this.post('/shares/shares_buy', {
					id: this.sharesID,
					num: quantity,
					type: this.buyTepy,
					price: orderPrice,
					k_or_d: this.k_or_d,
					leverage: this.leverage,
				}, true)
				.then((res) => {
					if (res.code == 1) {
						this.tos(res.msg)
						this.Cshow = false
						this.k_or_d = ''
						this.getDetails(false)
					} else if (res.msg) {
						this.tos(res.msg)
					}
				})
				.catch(() => {
					this.tos(this.$t('networkError') || 'Network error')
				})
				.finally(() => {
					this.flag = true
				})
			},
			getDetails(type) {
				this.post('/shares/shares_con', {
					id: this.sharesID
				}, type)
				.then((res) => {
					if (res.code == 1) {
						this.sharesInfo = res.data
						if (res.data.lever_status === true) {
							this.lianList = res.data.leverage || []
							if (this.lianList && this.lianList.length > 0) this.leverage = this.lianList[0]
						}
					} else if (res.msg) {
						this.tos(res.msg)
					}
				})
				.catch(() => {
					this.tos(this.$t('networkError') || 'Network error')
				})
			},
			shoucang() {
				if (!this.flag) return
				this.flag = false
				this.post('/shares/shoucang', {
					id: this.sharesID
				}, true)
				.then((res) => {
					if (res.code == 1) {
						this.tos(res.msg)
						this.sharesInfo.is_cs = !this.sharesInfo.is_cs
					} else if (res.msg) {
						this.tos(res.msg)
					}
				})
				.catch(() => {
					this.tos(this.$t('networkError') || 'Network error')
				})
				.finally(() => {
					this.flag = true
				})
			},
			app_getiframeMsg(params) {
				if (params && (params.num || params.open || params.low || params.high)) {
					this.new_price = params.num || this.new_price
					this.new_price_close = params.num || this.new_price_close
					this.new_price_open = params.open || this.new_price_open
					this.new_price_low = params.low || this.new_price_low
					this.new_price_high = params.high || this.new_price_high
				}
			},
			getTradingButtonStyle() {
				return {
					background: `linear-gradient(135deg, ${this.theme.primary__500} 0%, ${this.theme.primary__600 || this.theme.primary__500} 100%)`
				}
			},
			getFavoriteButtonStyle() {
				return {
					background: `linear-gradient(135deg, ${this.theme.primary__500} 0%, ${this.theme.primary__600 || this.theme.primary__500} 100%)`
				}
			},
			getQuickBtnStyle() {
				return {
					background: this.theme.backgroundTertiary
				}
			},
			getTypeBtnStyle(isActive) {
				if (isActive) {
					return {
						background: this.theme.primary__500
					}
				}
				return {
					background: this.theme.backgroundTertiary
				}
			},
			getTypeBtnTextStyle(isActive) {
				if (isActive) {
					return {
						color: this.theme.white
					}
				}
				return {
					color: this.theme.textTertiary
				}
			},
			getLeverageBtnStyle(isActive) {
				if (isActive) {
					return {
						background: this.theme.primary__500
					}
				}
				return {
					background: this.theme.backgroundTertiary
				}
			},
			getLeverageBtnTextStyle(isActive) {
				if (isActive) {
					return {
						color: this.theme.white
					}
				}
				return {
					color: this.theme.textTertiary
				}
			},
			getSubmitButtonStyle() {
				if (!this.canSubmit) {
					return {
						background: this.theme.neutral__400,
						boxShadow: 'none'
					}
				}
				if (this.k_or_d === 'k') {
					return {
						background: `linear-gradient(135deg, ${this.theme.danger} 0%, ${this.theme.danger__dark || this.theme.danger} 100%)`
					}
				}
				return {
					background: `linear-gradient(135deg, ${this.theme.success} 0%, ${this.theme.success__500 || this.theme.success} 100%)`
				}
			},
			getSubmitTextStyle() {
				if (!this.canSubmit) {
					return {
						color: this.theme.textTertiary
					}
				}
				return {
					color: this.theme.white
				}
			}
		}
	}
</script>

<!-- #ifdef APP-PLUS -->
<script module="renderModal" lang="renderjs">
	export default {
		mounted() {
			window.addEventListener('message', (event) => {
				const res = event.data;
				if (res.cmd == 'newprice') {
					this.$ownerInstance.callMethod('app_getiframeMsg', res.params)
					// this.$ownerInstance.callMethod('app_getiframeMsg', res.params.num)
				}
			});
		},
	}
</script>
<!-- #ifdef -->

<style lang="scss" scoped>
/* Responsive Page Layout */
.page-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 100rpx; /* Space for fixed trading button */
    background-color: inherit;
}

.header-section {
    flex-shrink: 0;
    z-index: 10;
}

.price-section {
    flex-shrink: 0;
    padding: 22rpx 32rpx;
}

.chart-section {
    flex: 1;
    height: calc(100vh - 200rpx);
    position: relative;
    overflow: hidden;
}

.chart-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

/* Modern Trading Button Styles */
.trading-button-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: 130rpx;
    display: flex;
    align-items: center;
    padding: 0 20rpx 20rpx;
}

.trading-button-wrapper {
    display: flex;
    align-items: center;
    gap: 20rpx;
    width: 100%;
}

.trading-button {
    flex: 1;
    border-radius: 50rpx;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    position: relative;
    border: 1rpx solid rgba(255, 255, 255, 0.1);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
        transition: left 0.6s ease;
    }

    &:active {
        transform: translateY(2rpx) scale(0.98);

        &::before {
            left: 100%;
        }
    }
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 25rpx 35rpx;
    position: relative;
    z-index: 1;
}

.main-text {
    font-size: 30rpx;
    font-weight: 700;
    letter-spacing: 0.5rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.favorite-button {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
    border: 1rpx solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        transform: translate(-50%, -50%);
        transition: width 0.4s ease, height 0.4s ease;
    }

    &:active {
        transform: translateY(2rpx) scale(0.95);

        &::before {
            width: 100%;
            height: 100%;
        }
    }
}

/* Modern Trading Bottom Sheet Styles */
.balance-card {
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 32rpx;
}

.balance-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* Input Section */
.input-section {
    margin-bottom: 32rpx;
}

.section-label {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    margin-bottom: 16rpx;
}

.input-container {
    border-radius: 16rpx;
    padding: 0 24rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
}

.quantity-input {
    flex: 1;
    height: 100%;
    font-size: 32rpx;
    font-weight: 600;
}

.input-placeholder {
    color: inherit;
    opacity: 0.6;
    font-weight: 400;
}

.input-hint {
    display: block;
    font-size: 24rpx;
    text-align: right;
}

/* Quick Select Section */
.quick-select-section {
    margin-bottom: 32rpx;
}

.quick-select-buttons {
    display: flex;
    gap: 16rpx;
}

.quick-btn {
    flex: 1;
    height: 72rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: 500;
    transition: all 0.3s ease;

    &:active {
        transform: scale(0.98);
        opacity: 0.8;
    }
}

/* Order Type Section */
.order-type-section {
    margin-bottom: 32rpx;
}

.type-buttons {
    display: flex;
    gap: 16rpx;
}

.type-btn {
    flex: 1;
    height: 72rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: 500;
    transition: all 0.3s ease;

    &:active {
        transform: scale(0.98);
    }
}

/* Leverage Section */
.leverage-section {
    margin-bottom: 32rpx;
}

.leverage-options {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.leverage-btn {
    padding: 16rpx 24rpx;
    border-radius: 16rpx;
    font-size: 28rpx;
    font-weight: 500;
    transition: all 0.3s ease;

    &:active {
        transform: scale(0.98);
    }
}

/* Fee Section */
.fee-section {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 0;
    margin-bottom: 32rpx;
}

.fee-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
}

/* Limit Price Section */
.limit-price-section {
    margin-bottom: 32rpx;
}

/* Submit Section */
.submit-section {
    padding: 0;
}

.submit-button {
    width: 100%;
    height: 88rpx;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 600;
    transition: all 0.3s ease;

    &:active {
        transform: translateY(2rpx);
    }

    &.disabled {
        cursor: not-allowed;
        opacity: 0.6;

        &:active {
            transform: none;
        }
    }
}

.submit-text {
    font-size: 32rpx;
    font-weight: 600;
}

	.onbox {
		height: 66rpx;
		padding: 0 24rpx;
		border-radius: 10rpx;
		text-align: center;
		line-height: 66rpx;
		font-size: 30rpx;
		font-weight: 600;
		white-space: nowrap;
	}

	.offbox {
		height: 66rpx;
		padding: 0 24rpx;
		border-radius: 10rpx;
		text-align: center;
		line-height: 66rpx;
		font-size: 30rpx;
		font-weight: 600;
		white-space: nowrap;
	}

	.tuikuan-showModal {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0rpx;
		z-index: 100100;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.donut {
		display: inline-block;
		border: 4px solid rgba(32, 32, 34, 0.1);
		border-radius: 50%;
		width: 30px;
		height: 30px;
		animation: donut-spin 1.0s linear infinite;
	}

	@keyframes donut-spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Time period tabs */
	.times {
		flex: 1;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 24rpx;
		text-align: center;
	}

	.active {
		position: relative;
		font-weight: 600;
	}

	.selectbox,
	.selectbox1 {
		width: 100%;
		height: 86rpx;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
	}
	.selectbox:active,
	.selectbox1:active {
		transform: scale(0.98);
	}
</style>

