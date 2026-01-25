<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary}">
        <bg-animate-shape/>
		<app-nav :title="$t('my33')" blur></app-nav>

		<v-container size="md">
            <view @click="Mshow=true"
                  class="radiu-15 margin-c-20 padding-20 flex align-center justify-between padding-w-32" :style="getCardGlassStyle()">
                <text class="font-28" :style="{color: theme.textPrimary}">{{$t('my34')}}</text>
                <view class="flex align-center justify-center relative radiu-50b overflow-hidden" :style="{border: `5rpx solid ${theme.neutral__200}`}">
                    <image class="width-120 height-120 radiu-50b" :src="avatar" mode=""></image>
                    <text class="cuIcon-camera absolute font-24 cuIcon" :style="getIconStyle()"></text>
                </view>
            </view>
            <view class="height-150 margin-c-20 radiu-15 flex align-center justify-between padding-w-32" :style="getCardGlassStyle()">
                <text class="font-28" :style="{color: theme.textPrimary}">{{$t('my35')}}</text>
                <text class="font-28" :style="{color: theme.textPrimary}">{{mobile}}</text>
            </view>
            <view @click="logout"
                  :style="{background: theme.danger, color: theme.white}"
                  class="height-86 radiu-45 flex align-center justify-center margin-t-50">
                <text class="font-30 bold-font" :style="{color: theme.white}">{{$t('my36')}}</text>
            </view>
        </v-container>

		<u-popup :show="Mshow" mode="bottom" round="16" @close="Mshow=false" @open="Mshow=true">
			<view class="padding-b-70 padding-w-20 radiu-16" :style="{background: theme.backgroundCard}">
				<view class="height-100 flex align-center justify-center">
					<text class="font-32" :style="{color: theme.textTertiary}">{{$t('my37')}}</text>
				</view>
				<view @click="updataImg('album')"
					class="height-96 flex align-center justify-center font-30" :style="{color: theme.textPrimary}">
					{{$t('my38')}}
				</view>
				<view @click="updataImg('camera')"
					class="height-96 flex align-center justify-center font-30" :style="{color: theme.textPrimary}">
					{{$t('my39')}}
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>

    export default {
		data() {
			return {
				Mshow: false,
				avatar: '',
				mobile: '',
			}
		},
		onLoad() {
			this.getInfo()
		},
        computed: {
            theme() {
                return this.$store.getters.theme
            },
        },
		methods: {
			getInfo() {
				this.post('/my/userinfo').then(res => {
					// console.log('用户资料',res)
					if (res.code == 1) {
						this.avatar = res.data.avatar
						this.mobile = res.data.mobile
					}
				})
			},
			getCardGlassStyle() {
				return {
					background: this.getColorWithOpacity(this.theme.backgroundCard, 0.5),
					backdropFilter: 'blur(10rpx)',
					border: `1rpx solid ${this.getColorWithOpacity(this.theme.white, 0.18)}`
				}
			},
			getIconStyle() {
				return {
					color: this.theme.primary__500,
					background: this.getColorWithOpacity(this.theme.white, 0.3)
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
			},
			// 更换头像
			updataImg(type) {
				let self = this
				uni.chooseImage({
					count: 1,
					sourceType: [type],
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						this.avatar = tempFilePaths[0]
						uni.showLoading()
						uni.uploadFile({
							url: self.upload + '/publics/image_upload', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								token: uni.getStorageSync('token')
							},
							success: (res) => {
								let data = JSON.parse(res.data)
								if (data.code == 1) {
									var avatarUrl = {
										avatar: data.data.url
									}
									this.post('/my/profile', avatarUrl).then(res1 => {
										uni.hideLoading()
										this.Mshow = false
										if (res1.code == 1) {
											// this.tos(res1.msg)
											this.$store.commit('setavatar', this.avatar)
											this.getInfo()
										}
									})
								}
							}
						})
					}
				})
			},
			logout() {
				var that = this
				uni.showModal({
					title: that.$t('my40'),
					content: that.$t('my41'),
					cancelText: that.$t('login23'),
					confirmText: that.$t('login24'),
					success(res) {
						if (res.confirm) {
							that.post('/user/logout', {}, true).then((res) => {
								if (res.code == 1) {
									// Clear all global intervals before logout
									getApp().globalData.clearAllIntervals()
									that.$store.commit('logout')
									that.tos(res.msg)
									setTimeout(() => {
										uni.reLaunch({
											url: '/pages/login/index'
										})
									}, 500)
								}
							})
						}
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

.cuIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
