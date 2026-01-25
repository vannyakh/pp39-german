<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
		<bg-animate-shape/>
		<app-nav :title="$t('my16')"></app-nav>

		<!-- Skeleton Loading -->
		<view v-if="isLoading" class="padding-32 margin-t-20">
			<view class="sk-line sk-title" :style="getSkeletonStyle()"></view>
			<view class="margin-c-20">
				<view class="width-600s margin-20-auto height-346 sk-line sk-image" :style="getSkeletonStyle()"></view>
				<view class="width-600s margin-20-auto height-346 sk-line sk-image" :style="getSkeletonStyle()"></view>
			</view>
			<view class="margin-b-24">
				<view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
				<view class="height-86 radiu-10 margin-t-20 sk-line sk-input" :style="getSkeletonStyle()"></view>
			</view>
			<view class="margin-b-24">
				<view class="sk-line sk-label" :style="getSkeletonStyle()"></view>
				<view class="height-86 radiu-10 margin-t-20 sk-line sk-input" :style="getSkeletonStyle()"></view>
			</view>
		</view>

		<!-- Actual Content -->
		<view v-else class="padding-32 margin-t-20">
			<view v-if="description" class="font-24 padding-20 radiu-10 margin-b-20" :style="{background: theme.backgroundTertiary, color: theme.danger}">
				{{description}}
			</view>
			<p class="font-32 weight-bold" :style="{color: theme.textPrimary}">{{$t('my75')}}</p>
			<view class="margin-c-20">
				<view class="width-600s margin-20-auto height-346 image-upload-container" :class="{'disabled': status!=0}">
					<view v-if="card_image_s" class="image-wrapper">
						<image class="width-100b height-100b radiu-10" :src="card_image_s" mode="aspectFill"></image>
						<view v-if="status==0" class="image-actions">
							<view @click.stop="removeImage('zheng')" class="action-btn remove-btn" :style="{background: theme.danger__500}">
								<u-icon name="trash" size="20" color="#fff"></u-icon>
							</view>
							<view @click.stop="fncClickShowPopup('zheng')" class="action-btn upload-btn" :style="{background: theme.primary__500}">
								<u-icon name="camera" size="20" color="#fff"></u-icon>
							</view>
						</view>
					</view>
					<view v-else @click="fncClickShowPopup('zheng')" class="zhengmianbox" :style="{borderColor: theme.primary__500}">
						<text class="font-24" :style="{color: theme.textSecondary}">{{$t('my77')}}</text>
					</view>
				</view>
				<view class="width-600s margin-20-auto height-346 image-upload-container" :class="{'disabled': status!=0}">
					<view v-if="cardbm_image_s" class="image-wrapper">
						<image class="width-100b height-100b radiu-10" :src="cardbm_image_s" mode="aspectFill"></image>
						<view v-if="status==0" class="image-actions">
							<view @click.stop="removeImage('fan')" class="action-btn remove-btn" :style="{background: theme.danger__500}">
								<u-icon name="trash" size="20" color="#fff"></u-icon>
							</view>
							<view @click.stop="fncClickShowPopup('fan')" class="action-btn upload-btn" :style="{background: theme.primary__500}">
								<u-icon name="camera" size="20" color="#fff"></u-icon>
							</view>
						</view>
					</view>
					<view v-else @click="fncClickShowPopup('fan')" class="fanmianbox" :style="{borderColor: theme.primary__500}">
						<text class="font-24" :style="{color: theme.textSecondary}">{{$t('my78')}}</text>
					</view>
				</view>
			</view>

			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('my79')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 radiu-10 padding-w-20 margin-t-20" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="text" v-model="name" :disabled="status!=0" :placeholder="$t('my80')" placeholder-class="input-placeholder" maxlength="50"/>
				</view>
			</view>
			<view class="margin-b-24">
				<p class="font-28" :style="{color: theme.textPrimary}">{{$t('Realname2')}}<span class="margin-l-10 font-35" :style="{color: theme.danger}">*</span></p>
				<view class="height-86 radiu-10 padding-w-20 margin-t-20" :style="{background: theme.backgroundTertiary}">
					<input class="flex-1 height-76 line-height-76 font-28" :style="{color: theme.textPrimary}" type="text" v-model="card_num" :disabled="status!=0" :placeholder="$t('Realname3')" placeholder-class="input-placeholder" maxlength="20"/>
				</view>
			</view>
			<view v-if="status!=1" class="margin-t-60">
				<view v-if="status==0" @click="renzheng" :class="['width-686 margin-30-auto height-96 radiu-10 flex align-center justify-center', {'disabled': !flag || isSubmitting || !isFormValid}]" :style="{background: (!flag || isSubmitting || !isFormValid) ? theme.neutral__300 : theme.primary__500, color: theme.white}">
					<text class="font-28" :style="{color: theme.white}">{{isSubmitting ? $t('submitting') : $t('my83')}}</text>
				</view>
				<view v-if="status==2" class="width-686 margin-30-auto height-96 radiu-10 margin-t-58 flex align-center justify-center" :style="{background: theme.primary__500, color: theme.white, opacity: 0.6}">
					<text class="font-28" :style="{color: theme.white}">{{$t('my84')}}</text>
				</view>
			</view>
		</view>
		<u-popup :show="Mshow" mode="bottom" round="16" @close="Mshow=false" @open="Mshow=true">
			<view class="padding-b-70 padding-w-20 radiu-16" :style="{background: theme.backgroundCard}">
				<view class="height-100 flex align-center justify-center" :style="{borderBottom: `1rpx solid ${theme.neutral__200}`}">
					<text class="font-32" :style="{color: theme.textTertiary}">{{$t('my37')}}</text>
				</view>
				<view @click="updataImg('album',type)"
					class="height-96 flex align-center justify-center font-30" :style="{color: theme.textPrimary, borderBottom: `1rpx solid ${theme.neutral__200}`}">
					{{$t('my38')}}
				</view>
				<view @click="updataImg('camera',type)"
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
				name:'',
				card_num:'',
				status:0,//审核状态:1=审核成功,2=审核中,0=审核失败
				description:'',//失败原因
				card_image:'',
				card_image_s:'',
				cardbm_image:'',
				cardbm_image_s:'',
				flag:true,
				isSubmitting: false,
				isLoading: false,
				Mshow: false,
				type:'',
			};
		},
		onLoad() {
			this.getauth_con()
		},
        computed: {
            theme(){
                return this.$store.getters.theme
            },
            isFormValid() {
                return this.name && this.name.trim() !== '' &&
                       this.card_num && this.card_num.trim() !== '' &&
                       this.card_image && this.card_image !== '' &&
                       this.cardbm_image && this.cardbm_image !== ''
            }
        },
		methods:{
			getSkeletonStyle() {
				return {
					background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 50%, ${this.theme.neutral__200} 75%)`
				}
			},
			getauth_con(){
				this.isLoading = true
				this.post('/my/auth_con',{},true).then(res => {
					if (res.code == 1) {
						if(res.data.auth != null){
							this.name = res.data.auth.name
							this.card_num = res.data.auth.card_num
							this.card_image = res.data.auth.card_image
							this.card_image_s = res.data.auth.card_images
							this.cardbm_image = res.data.auth.cardbm_image
							this.cardbm_image_s = res.data.auth.cardbm_images
							this.status = res.data.auth.status || 0
							this.description = res.data.auth.description
						}
					}
				}).catch((error) => {
					console.error('Failed to fetch auth data:', error)
					this.tos(this.$t('network_error'))
				}).finally(() => {
					this.isLoading = false
				})
			},
			validateForm() {
				if(!this.name || this.name.trim() === '') {
					return this.$t('my80')
				}
				if(!this.card_num || this.card_num.trim() === '') {
					return this.$t('Realname3')
				}
				if(!this.card_image) {
					return this.$t('my85')
				}
				if(!this.cardbm_image) {
					return this.$t('my86')
				}
				return null
			},
			renzheng(){
				if(!this.flag || this.isSubmitting || !this.isFormValid) return

				const validationError = this.validateForm()
				if(validationError) {
					return this.tos(validationError)
				}

				this.flag = false
				this.isSubmitting = true
				this.post('/my/auth_sub',{
					name: this.name.trim(),
					card_num: this.card_num.trim(),
					card_image: this.card_image,
					cardbm_image: this.cardbm_image,
				},true).then(res => {
					if (res.code == 1) {
						this.tos(res.msg)
						setTimeout(()=>{
							uni.navigateBack()
						},1500)
					} else {
						this.tos(res.msg)
					}
				}).catch((error) => {
					console.error('Submit error:', error)
					this.tos(this.$t('network_error'))
				}).finally(() => {
					this.flag = true
					this.isSubmitting = false
				})
			},
			// click popup show select image
			fncClickShowPopup(type){
				if(this.status != 0) {
					this.tos(this.$t('cannot_modify'))
					return
				}
				this.Mshow = true;
				this.type=type
			},
			removeImage(type){
				if(this.status != 0) {
					this.tos(this.$t('cannot_modify'))
					return
				}

				const imageMap = {
					'zheng': { preview: 'card_image_s', url: 'card_image' },
					'fan': { preview: 'cardbm_image_s', url: 'cardbm_image' }
				}

				if(imageMap[type]) {
					this[imageMap[type].preview] = ''
					this[imageMap[type].url] = ''
				}
			},
			updataImg(option,type) {
				if(this.status != 0) {
					this.tos(this.$t('cannot_modify'))
					return
				}

				this.Mshow = false
				const self = this

				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourceType: [option],
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths
						if(!tempFilePaths || tempFilePaths.length === 0) {
							return
						}

						// Set preview image immediately
						const imageMap = {
							'zheng': 'card_image_s',
							'fan': 'cardbm_image_s'
						}
						if(imageMap[type]) {
							self[imageMap[type]] = tempFilePaths[0]
						}

						uni.showLoading({ title: this.$t('uploading') })

						uni.uploadFile({
							url: self.upload + '/publics/image_upload',
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								token: uni.getStorageSync('token')
							},
							success: (res) => {
								try {
									const data = JSON.parse(res.data)
									if (data.code == 1 && data.data) {
										// Handle both url and iamge_url (API typo)
										const imageUrl = data.data.url || data.data.iamge_url || data.data.image_url

										if(imageUrl) {
											const urlMap = {
												'zheng': 'card_image',
												'fan': 'cardbm_image'
											}
											if(urlMap[type]) {
												self[urlMap[type]] = imageUrl
											}
											self.tos(data.msg)
										} else {
											self.tos(data.msg)
											// Reset preview on failure
											if(imageMap[type]) {
												self[imageMap[type]] = ''
											}
										}
									} else {
										self.tos(data.msg)
										// Reset preview on failure
										if(imageMap[type]) {
											self[imageMap[type]] = ''
										}
									}
								} catch (error) {
									console.error('Parse upload response error:', error)
									self.tos(error.msg)
									if(imageMap[type]) {
										self[imageMap[type]] = ''
									}
								}
							},
							fail: (error) => {
								console.error('Upload error:', error)
								self.tos(error.errMsg)
								if(imageMap[type]) {
									self[imageMap[type]] = ''
								}
							},
							complete() {
								uni.hideLoading()
							}
						})
					},
					fail: (error) => {
						console.error('Choose image error:', error)
						if(error.errMsg && error.errMsg.includes('cancel')) {
							// User cancelled, no need to show error
							return
						}
						this.tos(error.errMsg)
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

.zhengmianbox {
	width: 100%;
	height: 100%;
	background-image: url('/static/imgs/my/Group96014.png');
	background-repeat: repeat;
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	padding: 118rpx 0 21rpx;
	border-radius: 15px;
	border: 1.5px dotted;
}

.fanmianbox {
	width: 100%;
	height: 100%;
	background-image: url('/static/imgs/my/Group96015.png');
	background-repeat: repeat;
	background-size: 100% 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	padding: 118rpx 0 21rpx;
	border-radius: 15px;
	border: 1.5px dotted;
}

.input-placeholder {
	color: inherit;
	opacity: 0.6;
}

.image-upload-container {
	position: relative;

	.image-wrapper {
		position: relative;
		width: 100%;
		height: 100%;

		.image-actions {
			position: absolute;
			top: 12rpx;
			right: 12rpx;
			display: flex;
			gap: 12rpx;
			z-index: 10;

			.action-btn {
				width: 56rpx;
				height: 56rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
				transition: all 0.3s ease;

				&:active {
					transform: scale(0.9);
					opacity: 0.8;
				}
			}
		}
	}
}

/* Skeleton Loading Styles */
.sk-line {
	background-size: 200% 100%;
	animation: sk-shimmer 1.5s ease-in-out infinite;
	border-radius: 8rpx;
	display: block;
}

.sk-title {
	width: 200rpx;
	height: 32rpx;
	margin-bottom: 30rpx;
}

.sk-image {
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
	margin-bottom: 20rpx;
}

.sk-label {
	width: 150rpx;
	height: 28rpx;
	margin-bottom: 20rpx;
}

.sk-input {
	width: 100%;
	height: 100%;
}

.disabled {
	opacity: 0.6;
	pointer-events: none;
}

@keyframes sk-shimmer {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}
</style>
