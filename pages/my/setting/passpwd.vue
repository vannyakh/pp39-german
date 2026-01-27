<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<app-nav blur :title="$t('my13')"></app-nav>

		<view class="padding-32 margin-t-20" :style="{background: theme.backgroundCard}">
			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('login2')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 flex align-center padding-w-20 radiu-10 margin-t-20" :style="{background: theme.backgroundTertiary}">
					<!-- <view @click="countryType=true" class="padding-r-20 flex align-center justify-center">
						<image  class="width-50 height-55" src="/static/imgs/login/phone.png" mode=""></image>
						<text class="font-30  margin-w-10" :style="{color: theme.textPrimary}">+{{m_prefix}}</text>
						<i class="cuIcon-unfold"></i>
					</view> -->
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" disabled="true" type="number" v-model="mobile" @input="clearInput"  :placeholder="$t('login10')" placeholder-class="input-placeholder"/>
			        <u-icon v-if="showClearIcon" name="close" size="18" @click="clearIcon" :color="theme.primary__500"></u-icon>
				</view>
			</view>
			<view class="margin-b-24">
				<!-- <p class="font-28" :style="{color: theme.textPrimary}">{{$t('login11')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p> -->
				<!-- <p class="font-28" :style="{color: theme.textSecondary}">{{$t('login11')}}</p> -->
				<!-- <view class="height-86  margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
					<image  class="width-50 height-55" src="/static/imgs/login/invit-code.png" mode=""></image>
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="number" v-model="code" :placeholder="$t('login12')" placeholder-class="input-placeholder"/>
					<view @click="cutTime()" class="codeBox" :style="getCodeBoxStyle()">{{codeText}}</view>
				</view> -->
			</view>
			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('my65')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 radiu-10 margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="text" :password="showPwd" v-model="oldpwd" :placeholder="$t('my66')" placeholder-class="input-placeholder"/>
                    <u-icon :name="showPwd?'eye-off':'eye-fill'" size="20" @click="showPwd=!showPwd" :color="theme.primary__500"></u-icon>
				</view>
			</view>
			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('my67')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 radiu-10 padding-w-20 flex align-center justify-between margin-t-20" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="text" :password="showPwd1" v-model="pwd1" :placeholder="$t('my68')" placeholder-class="input-placeholder"/>
                    <u-icon :name="showPwd1?'eye-off':'eye-fill'" size="20" @click="showPwd1=!showPwd1" :color="theme.primary__500"></u-icon>
				</view>
			</view>
			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('my69')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 radiu-10 padding-w-20 flex align-center justify-between margin-t-20" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="text" :password="showPwd2" v-model="pwd2" :placeholder="$t('my70')" placeholder-class="input-placeholder"/>
                    <u-icon :name="showPwd2?'eye-off':'eye-fill'" size="20" @click="showPwd2=!showPwd2" :color="theme.primary__500"></u-icon>
				</view>
			</view>
		</view>

		<view class="padding-w-32" style="margin-top: 300rpx;">
			<view @click="changePWD" class="loginBtn margin-b-28" :style="{background: theme.primary__500, color: theme.white}">{{$t('login27')}}</view>
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
				flag: true,
				time: '',
				timeFlag: true,
				m_prefix:'',
				seleCountry:'',
				mobile:'',
                showPwd: true,
                showPwd1: true,
                showPwd2: true,
                showClearIcon: false,
                code: '',
                userinfo: {},
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
		onLoad() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				this.post('/my/userinfo').then(res => {
					console.log('user information', res)
					if (res.code == 1) {
						this.userinfo = res.data
						this.mobile = res.data.mobile
						this.m_prefix = res.data.m_prefix
						this.$store.commit('setavatar', res.data.avatar)
					}
				})

			},
            clearIcon(){
                this.mobile = ''
                this.showClearIcon = false
            },
            clearInput(){
                this.showClearIcon = this.mobile.length > 0
            },
			changePWD() {
				if (!this.flag) return
				if (this.mobile=='') return this.tos(this.$t('login10'))
				// if (this.code == '') return this.tos(this.$t('login12'))
				if (this.oldpwd=='') return this.tos(this.$t('my66'))
				if (this.pwd1 == '') return this.tos(this.$t('my68'))
				if (this.pwd1 != this.pwd2) return this.tos(this.$t('login26'))
				this.flag = false
				this.post('/user/passwordupd', {
					m_prefix: this.m_prefix,
					mobile: this.mobile,
					// code: this.code,
					oldpassword: this.oldpwd,
					newpassword: this.pwd2,
					types: 'password',
				},true).then(res => {
					this.flag = true
					if (res.code == 1) {
						this.$store.commit('logout')
						this.tos(res.msg)
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login/index'
							})
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
						m_prefix:this.m_prefix,
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
			getCodeBoxStyle() {
				return {
					background: `linear-gradient(133deg, ${this.theme.primary__500}, ${this.theme.primary__600 || this.theme.primary__500})`,
					color: this.theme.white
				}
			}
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
