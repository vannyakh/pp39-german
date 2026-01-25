<template>
	<view class="login-page">
		<!-- Background with abstract elements -->
		<view class="background-section" :style="{ background: backgroundGradient }">
			<view class="abstract-elements">
				<view class="candlestick-pattern" :style="{ background: backgroundGradient }"></view>
				<view class="glow-circle circle-1"></view>
				<view class="glow-circle circle-2"></view>
				<view class="glow-circle circle-3"></view>
			</view>

			<!-- Logo Section -->
			<view class="logo-container">
				<view class="logo-circle" :style="{ background: theme.backgroundCard || 'rgba(255, 255, 255, 0.5)', boxShadow: '0 8rpx 16rpx rgba(0, 0, 0, 0.1)' }">
					<image class="logo-image" :src="appLogo" mode="aspectFill"></image>
				</view>
			</view>
		</view>
        <app-nav :showBackButton="false" blur>
            <template #right>
                <view class="language" @click="router.push('/pages/my/lang')">
                    <image :src="$t('logo')" class="lang-logo"></image>
                    <text class="lang-text" :style="{ color: theme.textPrimary }">{{ $t('language') }}</text>
                </view>
            </template>
        </app-nav>


		<!-- Login Form Card -->
		<view class="login-card" :style="{ background: theme.backgroundPrimary }">
			<view class="card-header">
				<text class="card-title" :style="{ color: theme.textPrimary }">{{ $t('login22') }}</text>
			</view>

			<!-- Phone Number Input -->
			<view class="input-group">
				<view class="input-container" :style="{ background: theme.backgroundTertiary }">
					<view class="input-icon">
						<u-icon name="account" size="20"></u-icon>
					</view>
					<input
						class="input-field"
						type="text"
						v-model="account"
						@input="clearInput"
						:placeholder="$t('login2')"
						placeholder-class="input-placeholder"
						:style="{ color: theme.textPrimary }"
					/>
					<view v-if="showClearIcon" class="clear-icon" @click="clearIcon">
						<u-icon name="close" size="16"></u-icon>
					</view>
				</view>
			</view>

			<!-- Password Input -->
			<view class="input-group">
				<view class="input-container" :style="{ background: theme.backgroundTertiary }">
					<view class="input-icon">
						<u-icon name="lock" size="20"></u-icon>
					</view>
					<input
						@confirm="login()"
						class="input-field"
						type="text"
						v-model="password"
						:placeholder="$t('login4')"
						:password="showPassword"
						placeholder-class="input-placeholder"
						:style="{ color: theme.textPrimary }"
					/>
					<view class="password-toggle" @click="showPassword=!showPassword">
						<u-icon :name="showPassword?'eye-off':'eye-fill'" size="20" :color="theme.neutral__400"></u-icon>
					</view>
				</view>
			</view>

			<!-- Remember Password and Register -->
			<view class="form-options">
				<view class="remember-password">
					<text class="option-text" :style="{ color: theme.textSecondary }">{{ $t('login7') }}?</text>
                    <view class="register-link" @click="router.push('/pages/login/register')">
                        <text class="register-text" :style="{ color: theme.primary__light }">{{ $t('login21') }}</text>
                    </view>
				</view>
				<view class="forget-link" @click="router.push('/pages/login/forget')">
					<text class="forget-text" :style="{ color: theme.primary__light }">{{ $t('login5') }}</text>
				</view>
			</view>

			<!-- Login Button -->
			<view class="login-button-container">
				<button
					@click="login"
					:disabled="isDisabled"
					:class="['login-button', {'disabled': isDisabled}]"
					:style="getButtonStyle()"
				>
					<text class="button-text" :style="{ color: theme.white }">{{$t('login6')}}</text>
				</button>
			</view>
		</view>

		<!-- Service Button -->
        <kefu-float bottom="140rpx" right="24rpx" />

	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: '',
				password: '',
				flag: true,
				showClearIcon: false,
				showPassword: true
			}
		},
		onLoad() {
			// Clear any remaining intervals when entering login page
			getApp().globalData.clearAllIntervals()
		},
		computed: {
			theme(){
				return this.$store.getters.theme
			},
			isDisabled(){
				return this.account==''||this.password==''
			},
			appLogo() {
				return this.$store.getters.logo
			},
			backgroundGradient() {
				const primaryColor = this.theme.primary__light
				const secondaryColor = this.theme.secondary
				if (this.theme.primary && this.theme.primary.includes('gradient')) {
					return this.theme.primary.replace('137deg', '90deg')
				}
				return `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
			}
		},
		methods: {
			getButtonStyle() {
				if (this.isDisabled) {
					return {
						background: this.theme.neutral__400,
						boxShadow: 'none'
					}
				}
				const primaryColor = this.theme.primary__light
				const secondaryColor = this.theme.secondary
				if (this.theme.primary && this.theme.primary.includes('gradient')) {
					return {
						background: this.theme.primary.replace('137deg', '90deg'),
						boxShadow: '0 4rpx 20rpx rgba(244, 118, 86, 0.3)'
					}
				}
				return {
					background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
					boxShadow: '0 4rpx 20rpx rgba(244, 118, 86, 0.3)'
				}
			},
			clearInput: function (event) {
				this.account = event.detail.value
				this.showClearIcon = event.detail.value.length > 0
			},
			clearIcon: function () {
				this.account = ''
				this.showClearIcon = false
			},
			login(){
				if (!this.flag) return
				if (this.account=='') return this.tos(this.$t('login2'))
				if (this.password == '') return this.tos(this.$t('login4'))

				this.flag = false
				this.post('/user/login',{
					account: this.account,
					password: this.password,
				},true).then(res => {
					this.flag = true
					if (res.code == 1) {
						this.$store.commit('setUserInfo',res.data.userinfo)
						uni.reLaunch({
							url:'/pages/index/index'
						})
					}
				}).catch(() => {
					this.flag = true
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login-page {
		min-height: 100vh;
		position: relative;
		overflow: hidden;
	}

	.background-section {
		height: 40vh;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.abstract-elements {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
	}

	.candlestick-pattern {
		position: absolute;
		top: 20%;
		right: 10%;
		width: 60rpx;
		height: 80rpx;
		border-radius: 4rpx;
		opacity: 0.3;
		transform: rotate(15deg);
	}

	.glow-circle {
		position: absolute;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
		animation: float 6s ease-in-out infinite;
	}

	.circle-1 {
		width: 120rpx;
		height: 120rpx;
		top: 15%;
		left: 15%;
		animation-delay: 0s;
	}

	.circle-2 {
		width: 80rpx;
		height: 80rpx;
		top: 60%;
		right: 20%;
		animation-delay: 2s;
	}

	.circle-3 {
		width: 100rpx;
		height: 100rpx;
		bottom: 20%;
		left: 25%;
		animation-delay: 4s;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
	}

	.logo-container {
		position: relative;
		z-index: 2;
	}

	.logo-circle {
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.logo-image {
		width: 100%;
		height: 100%;
		//border-radius: 50%;
	}

	.login-card {
		position: absolute;
		top: 35vh;
		left: 0;
		right: 0;
		border-radius: 48rpx 48rpx 0 0;
		padding: 40rpx 30rpx;
		z-index: 3;
		height: 100%;
	}

	.card-header {
		margin-bottom: 40rpx;
	}

	.card-title {
		font-size: 40rpx;
		font-weight: 600;
	}

	.input-group {
		margin-bottom: 32rpx;
	}

	.input-container {
		display: flex;
		align-items: center;
		border-radius: 24rpx;
		padding: 24rpx 30rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
	}

	.input-icon {
		margin-right: 24rpx;
		display: flex;
		align-items: center;
	}

	.input-field {
		flex: 1;
		font-size: 32rpx;
		background: transparent;
		border: none;
		outline: none;
	}

	.input-placeholder {
		color: #999;
	}

	.clear-icon, .password-toggle {
		padding: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.form-options {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 40rpx;
	}

	.remember-password {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.option-text {
		font-size: 28rpx;
	}

	.register-link {
		padding: 8rpx 0;
	}

	.register-text {
		font-size: 28rpx;
		font-weight: 500;
	}

	.forget-link {
		padding: 8rpx 0;
	}
	.forget-text {
		font-size: 28rpx;
		font-weight: 500;
	}

	.login-button-container {
		margin-top: 20rpx;
	}

	.login-button {
		width: 100%;
		height: 88rpx;
		border: none;
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.login-button:active {
		transform: translateY(2rpx);
		box-shadow: 0 2rpx 10rpx rgba(244, 118, 86, 0.3);
	}

	.login-button.disabled {
		box-shadow: none;
	}

	.button-text {
		font-size: 32rpx;
		font-weight: 600;
	}
    .language{
        display: flex;
        align-items: center;
        gap: 8rpx;
      .lang-logo {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
      }
      .lang-text {
        font-size: 28rpx;
      }
    }

</style>
