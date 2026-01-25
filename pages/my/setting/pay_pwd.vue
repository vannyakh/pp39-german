<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<app-nav blur :title="$t('my14')"></app-nav>

		<view v-if="if_pay_pwd" class="padding-32 margin-t-20" :style="{background: theme.backgroundCard}">
			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('my65')}} <span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 radiu-10 margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="text" :password="showOldPwd" v-model="oldpwd" :placeholder="$t('my66')" placeholder-class="input-placeholder"/>
                    <u-icon :name="showOldPwd?'eye-off':'eye-fill'" size="20" @click="showOldPwd=!showOldPwd" :color="theme.primary__500"></u-icon>
				</view>
			</view>
			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('my67')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 radiu-10 margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="text" :password="showPwd1" v-model="pwd1" :placeholder="$t('my68')" placeholder-class="input-placeholder"/>
                    <u-icon :name="showPwd1?'eye-off':'eye-fill'" size="20" @click="showPwd1=!showPwd1" :color="theme.primary__500"></u-icon>
				</view>
			</view>
			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('my69')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 radiu-10 margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="text" :password="showPwd2" v-model="pwd2" :placeholder="$t('my70')" placeholder-class="input-placeholder"/>
                    <u-icon :name="showPwd2?'eye-off':'eye-fill'" size="20" @click="showPwd2=!showPwd2" :color="theme.primary__500"></u-icon>
				</view>
			</view>
		</view>
		<view v-else class="padding-w-32 padding-t-50">
			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('my71')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 radiu-10 margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="text" :password="showPayPwd" v-model="pay_pwd" :placeholder="$t('my72')" placeholder-class="input-placeholder"/>
                    <u-icon :name="showPayPwd?'eye-off':'eye-fill'" size="20" @click="showPayPwd=!showPayPwd" :color="theme.primary__500"></u-icon>
				</view>
			</view>
		</view>


		<view v-if="if_pay_pwd" class="padding-w-32" style="margin-top: 300rpx;">
			<view @click="changePWD" class="loginBtn margin-b-28" :style="{background: theme.primary__500, color: theme.white}">{{$t('my73')}}</view>
		</view>
		<view v-else class="padding-w-32" style="margin-top: 300rpx;">
			<view @click="setpay_pwd" class="loginBtn margin-b-28" :style="{background: theme.primary__500, color: theme.white}">{{$t('my74')}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldpwd:'',
				pwd1:'',
				pwd2:'',
				if_pay_pwd:'',
				pay_pwd:'',
				flag: true,
				time: '',
				timeFlag: true,
				seleCountry:'',
				mobile:'',
                showPwd1: true,
                showPwd2: true,
                showOldPwd: true,
                showPayPwd: true,
			}
		},
		computed: {
			codeText() {
				if (this.time > 0) {
					return this.time + " s"
				} else {
					return this.$t('login25')
				}
			},
            theme(){
                return this.$store.getters.theme
            }
		},
		onShow() {
			this.getInfo()
		},
		methods: {
			getInfo(){
				this.post('/my/userinfo').then(res => {
					//console.log('是否设置交易密码',res)
					if (res.code == 1) {
						this.if_pay_pwd = res.data.pay_pwd
					}
				})
			},
			setpay_pwd(){
				if (!this.flag) return
				if (this.pay_pwd=='') return this.tos(this.$t('my72'))
				this.flag = false
				this.post('/user/set_pay_pwd', {
					pay_pwd: this.pay_pwd,
				},true).then(res => {
					this.flag = true
					if (res.code == 1) {
						this.tos(res.msg)
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
					}
				})
			},
			changePWD() {
				if (!this.flag) return
				if (this.oldpwd=='') return this.tos(this.$t('my66'))
				if (this.pwd1 == '') return this.tos(this.$t('my68'))
				if (this.pwd1 != this.pwd2) return this.tos(this.$t('login26'))
				this.flag = false
				this.post('/user/passwordupd', {
					oldpassword: this.oldpwd,
					newpassword: this.pwd2,
					types: 'pay_pwd',
				},true).then(res => {
					this.flag = true
					if (res.code == 1) {
						this.tos(res.msg)
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
					}
				})
			},
			// 发送验证码
			cutTime() {
				if (!this.timeFlag) return
				if (this.mobile=='') return this.tos(this.$t('login10'))
					this.timeFlag = false
					this.post('/sms/send', {
						m_prefix:this.seleCountry.value,
						mobile: this.mobile,
						event: "resetpwd",
					},true).then(res => {
						if (res.code == 1) {
							this.tos(res.msg)
							this.time = 60
							var that = this
							let timeName = setInterval(() => {
								if (that.time > 0) {
									that.time--
								} else {
									that.time = 0
									that.timeFlag = true
									clearInterval(timeName)
								}
							}, 1000)
						} else {
							this.timeFlag = true
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

	.codeBox {
		padding: 0 18rpx;
		height: 60rpx;
		border-radius: 8rpx;
		line-height: 60rpx;
		font-size: 26rpx;
	}

	.loginBtn {
		width: 686rpx;
		height: 86rpx;
		border-radius: 8rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.input-placeholder {
		color: inherit;
		opacity: 0.6;
	}
</style>
