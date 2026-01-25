<template>
	<view :style="{background:theme.light__gray, color:theme.dark}">
		<myNav :title="$t('my9')"></myNav>

		<!-- <view class="padding-w-32 padding-c-20">
			<view class="radiu-20 padding-30 line-height-50 flex direction-column align-start justify-center"
				:style="{background: theme.light}">
				<view class="font-30 color-949494 ">To ensure the reasonable distribution of trading chips, please click
					on the customer service window in the app or contact your dedicated assistant to make an online
					appointment for recharge.</view>
				<view @click="open(recharge_kefu)"
					class="height-96 width-100b  radiu-10  flex align-center justify-center" style="margin-top: 0rpx;"
					:style="{background: theme.bgPrimary, color: theme.white}">
					<text class="font-28 ">{{$t('my58')}}</text>
				</view>
				<view class="font-30 color-949494 line-height-50">Click the button to contact customer service</view>
			</view>
		</view> -->
		<view class="padding-w-32 padding-c-20">

	  	<view class="height-220  radiu-20  flex direction-column align-center justify-center" :style="{background:theme.light, color:theme.dark}">
	  			<text class="font-24 color-949494">{{$t('my53')}}</text>
	  		<text class="font-56 weight-bold "><span class="font-28 margin-r-20">RM</span>{{money}}</text>
	  		
	  	</view>
	  </view>

		<view class="padding-w-32">
			<view class="padding-w-32 radiu-20 padding-t-40" :style="{background:theme.light, color:theme.dark}">
				<view class="margin-b-20 flex align-center">
					<text class="font-28 color-000000  margin-r-12">{{$t('my54')}} <span class="margin-l-10 font-35 color-FF4E4F">*</span></text>
				</view>
				<view class="radiu-8 height-86 padding-w-20 flex align-center justify-between margin-b-24" :style="{background:theme.light__gray, color:theme.dark}">
					<input class="height-76 line-height-76 flex-1 font-28 " type="text" v-model="re_num"
						:placeholder="$t('my55')" placeholder-class="color-a29ea4" />
				</view>
			
				<view class="margin-b-20 flex align-center">
					<text class="font-28  margin-r-12">{{$t('my56')}}<span class="margin-l-10 font-35 color-FF4E4F">*</span></text>
				</view>
				<view class="radiu-8 height-86 padding-w-20 flex align-center justify-between margin-b-24" :style="{background:theme.light__gray, color:theme.dark}">
					<input class="height-76 line-height-76 flex-1 font-28 " type="text" v-model="username"
						:placeholder="$t('my57')" placeholder-class="color-a29ea4" />
				</view>
				<!-- <view class="flex align-center justify-between margin-b-30">
					<view @click="re_num=item" :class="item==re_num?'bj-bians color-white':'bj-F7F7F7 color-949494'" class="width-163 flex align-center justify-center height-72 radiu-8 font-28"
						v-for="(item,index) in price_arr" :key="index">
						{{item}}
					</view>
				</view -->
				<!-- <view class="margin-b-20">
					<text class="font-28 color-white">Payment channel</text>
				</view> -->
				<!-- <view class="height-90 flex align-center justify-between">
					<view @click="pay_type = index" class="flex-1 flex direction-column align-center justify-center" v-for="(item,index) in bank" :key="index">
						<text :class="pay_type==index?'color-FEFEFE':'color-949494'" class="font-24">Bank{{index+1}}</text>
						<view :style="pay_type==index?'':'visibility: hidden;'" class="width-34 height-4  margin-t-8"></view>
					</view>
				</view> -->
			
				<!-- <view v-if="bank[pay_type]" class="bj-bianss radiu-16 padding-24" style="border: #2D2D2E solid 1rpx;">
					<view class="font-24">
						<text class="color-C3F53C">Account Opening Bank：</text>
						<view class="flex align-center">
							<text class="color-FEFEFE">{{bank[pay_type].bank_name}}</text>
							<image @click="copy(bank[pay_type].bank_name)" class="width-28 height-28 margin-l-20" src="/static/imgs/my/copy.png" mode=""></image>
						</view>
					</view>
					<view class="font-24 margin-c-20">
						<text class="color-C3F53C">Account Opening Branch：</text>
						<view class="flex align-center">
							<text class="color-FEFEFE">{{bank[pay_type].bank_branch}}</text>
							<image @click="copy(bank[pay_type].bank_branch)" class="width-28 height-28 margin-l-20" src="/static/imgs/my/copy.png" mode=""></image>
						</view>
					</view>
					<view class="font-24 margin-c-20">
						<text class="color-C3F53C">Account name：</text>
						<view class="flex align-center">
							<text class="color-FEFEFE">{{bank[pay_type].bank_user}}</text>
							<image @click="copy(bank[pay_type].bank_user)" class="width-28 height-28 margin-l-20" src="/static/imgs/my/copy.png" mode=""></image>
						</view>
						
					</view>
					<view class="font-24 flex align-center">
						<text class="color-C3F53C">Account：</text>
						<view class="flex align-center">
							<text class="color-FEFEFE">{{bank[pay_type].card_num}}</text>
							<image @click="copy(bank[pay_type].card_num)" class="width-28 height-28 margin-l-20" src="/static/imgs/my/copy.png" mode=""></image>
						</view>
					</view>
				</view> -->
			
				<!-- <view class="padding-c-10">
					<text class="font-28 color-white">Payment voucher</text>
					<view @click="updataImg()" class="bj-bianss radiu-16 margin-t-20 width-200 height-200 flex align-center justify-center" style="border: #2D2D2E solid 1rpx;">
						<image v-if="image_s" class="width-200 height-200" :src="image_s" mode=""></image>
						<view v-else class="width-200 height-200 flex align-center justify-center">
							<i class="cuIcon-add color-949494 font-70"></i>
						</view>
					</view>
				</view> -->
			
			
			
				<!-- <view @click="chongzhi" class="height-96 radiu-8 bj-bians flex align-center justify-center" style="margin-top: 160rpx;">
					<text class="font-28 color-white">充值</text>
				</view> -->
			
				<view @click="chongzhi()" class="height-96 radiu-8 bj-bians  flex align-center justify-center" >
					<text class="font-28 color-white">{{$t('my9')}}</text>
				</view>
				<view class="height-26" >
					
				</view>
				
				<!-- <view @click="Cshow=true" class="height-96 radiu-45 bj-bians flex align-center justify-center"
					style="margin-top: 130rpx;">
					<text class="font-28 color-000000 bold-font">{{$t('my9')}}</text>
				</view> -->
				<!-- <view @click="open(recharge_kefu)" class="height-96 radiu-20  flex align-center justify-center"
					style="margin-top: 50rpx;" :style="{background: theme.bgPrimary, color: theme.white}">
					<text class="font-28 ">{{$t('my58')}}</text>
				</view> -->
				<u-modal :show="Cshow" :showConfirmBotton='true' :confirmText="$t('login24')" :cancelText="$t('login23')"
					:showCancelButton="true" @cancel="Cshow=false" @confirm="chongzhi();Cshow=false">
					<view class="slot-content">
						<rich-text :nodes="content"></rich-text>
					</view>
				</u-modal>
			
			</view>
		</view>
	</view>
</template>

<script>
	import clipboard from "@/components/copy/clipboard.js"
	export default {
		data() {
			return {
				statusBar: uni.getSystemInfoSync().statusBarHeight,
				Cshow: false,
				content: '',
				re_num: '',
				username: '',

				pay_type: 0,
				price_arr: [],
				bank: [],
				min_recharge: 0,
				money: 0,

				recharge_kefu: '',

				flag: true,

				image_s: '',
				image: '',
			};
		},
		onLoad() {
			this.init()
			this.getContent()
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			},
		},
		methods: {

			open(url) {
				if (url) {
					// #ifdef APP-PLUS
					plus.runtime.openURL(url)
					// #endif
					// #ifdef H5
					window.location.href = url
					// #endif
				}
			},
			chongzhi() {
				if (!this.flag) return
				if (this.re_num == '') return this.tos(this.$t('my55'))
				if (this.username == '') return this.tos(this.$t('my57'))
				// if(this.image == '') return this.tos('请上传支付凭证')
				this.flag = false
				this.post('/my/recharge_sub', {
					price: this.re_num,
					username: this.username,
					// bank_id:this.bank[this.pay_type].id,
					// image:this.image
				}, true).then(res => {
					//console.log('充值', res)
					this.flag = true
					if (res.code == 1) {
						this.tos(res.msg)
						this.re_num = ''
						this.username = ''
						// this.image = ''
						// this.image_s = ''
						this.open(this.recharge_kefu)
					}
				})
			},
			getContent() {
				this.post('/publics/get_text_info').then(res => {
					//console.log('get_text_info', res)
					if (res.code == 1) {
						this.content = res.data.message
					}
				})
			},
			init() {
				this.post('/my/recharge_con').then(res => {
					// //console.log('充值内容', res)
					if (res.code == 1) {
						this.bank = res.data.bank
						this.min_recharge = res.data.min_recharge
						this.money = res.data.money
						this.price_arr = res.data.price_arr
						this.recharge_kefu = res.data.recharge_kefu
					}
				})
			},

			updataImg() {
				let self = this
				uni.chooseImage({
					count: 1,
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						self.image_s = tempFilePaths[0]
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
									self.image = data.data.url
								}
							},
							complete() {
								uni.hideLoading()
							}
						})
					}
				})
			},
			// 复制地址
			copy(data) {
				// #ifndef H5
				clipboard.setText(data);
				// #endif
				// #ifdef H5 
				let result
				let textarea = document.createElement("textarea")
				textarea.value = data
				textarea.readOnly = "readOnly"
				document.body.appendChild(textarea)
				textarea.select() // 选中文本内容
				textarea.setSelectionRange(0, data.length)
				result = document.execCommand("copy")
				textarea.remove()
				// #endif
				this.tos(this.$t('my25'))
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f6f6f7;
	}
</style>