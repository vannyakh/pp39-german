<template>
	<view class="min-height-screen flex flex-direction height-100b" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<app-nav blur :title="$t('my18')"></app-nav>

		<v-container size="md">
			<view class="margin-t-20 flex-1">
                <view class="flex flex-direction height-100b">
                    <view class="flex-1">
                        <!-- Bank Type Selector -->
                        <!-- <view class="margin-b-24">
                            <p class="font-28" :style="{color: theme.textPrimary}">{{$t('bank_type')}}</p>
                            <view class="flex align-center margin-t-20" style="gap: 20rpx;">
                                <view
                                    @click="bank_type = 1"
                                    class="flex-1 height-86 radiu-10 flex align-center justify-center"
                                    :style="bank_type == 1 ? {background: theme.primary__500, color: theme.white} : {background: theme.backgroundTertiary, border: `1rpx solid ${theme.neutral__200}`}"
                                >
                                    <text class="font-28" :style="{color: bank_type == 1 ? theme.white : theme.textPrimary}">{{$t('bank_address') }}</text>
                                </view>
                                <view
                                    @click="bank_type = 2"
                                    class="flex-1 height-86 radiu-10 flex align-center justify-center"
                                    :style="bank_type == 2 ? {background: theme.primary__500, color: theme.white} : {background: theme.backgroundTertiary, border: `1rpx solid ${theme.neutral__200}`}"
                                >
                                    <text class="font-28" :style="{color: bank_type == 2 ? theme.white : theme.textPrimary}">{{$t('usdt_address')}}</text>
                                </view>
                            </view>
                        </view> -->

                        <!-- Traditional Bank Fields -->
                        <template v-if="bank_type == 1">
                            <view class="margin-b-24">
                                <p class="font-28" :style="{color: theme.textPrimary}">{{$t('my94')}}</p>
                                <view class="height-86 padding-w-20 flex align-center justify-between radiu-10 margin-t-20" :style="{background: theme.backgroundTertiary}">
                                    <input class="flex-1 height-76 line-height-76 font-28" type="text" v-model="username" :placeholder="$t('my95')" placeholder-class="input-placeholder" :style="{color: theme.textPrimary}"/>
                                </view>
                            </view>
                            <view class="margin-b-24">
                                <p class="font-28" :style="{color: theme.textPrimary}">{{$t('my27')}}</p>
                                <view class="height-86 radiu-10 margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
                                    <input class="flex-1 height-76 line-height-76 font-28" type="text" v-model="bank_name" :placeholder="$t('my28')" placeholder-class="input-placeholder" :style="{color: theme.textPrimary}"/>
                                </view>
                            </view>
                            <view class="margin-b-24">
                                <p class="font-28" :style="{color: theme.textPrimary}">{{$t('my31')}}</p>
                                <view class="height-86 radiu-10 margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
                                    <input class="flex-1 height-76 line-height-76 font-28" type="text" v-model="card_num" :placeholder="$t('my32')" placeholder-class="input-placeholder" :style="{color: theme.textPrimary}"/>
                                </view>
                            </view>
                            <view class="margin-b-24">
                                <p class="font-28" :style="{color: theme.textPrimary}">{{$t('mobile')}}</p>
                                <view class="height-86 radiu-10 margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
                                    <input class="flex-1 height-76 line-height-76 font-28" type="number" v-model="mobile" :placeholder="$t('mobile1')" placeholder-class="input-placeholder" :style="{color: theme.textPrimary}"/>
                                </view>
                            </view>
                        </template>

                        <!-- USDT Address Fields - Chain Selector and Address Field -->
                        <template v-else>
                            <view class="margin-b-24">
                                <p class="font-28" :style="{color: theme.textPrimary}">{{$t('chain')}}</p>
                                <view class="flex align-center margin-t-20" style="gap: 20rpx; flex-wrap: wrap;">
                                    <view
                                        v-for="(chainOption, index) in chainOptions"
                                        :key="index"
                                        @click="chain = chainOption.value"
                                        class="chain-option"
                                        :class="{ 'chain-selected': chain == chainOption.value }"
                                        :style="getChainOptionStyle(chainOption.value)"
                                    >
                                        <text class="font-28" :style="getChainOptionTextStyle(chainOption.value)">{{ chainOption.label }}</text>
                                    </view>
                                </view>
                            </view>
                            <view class="margin-b-24">
                                <p class="font-28" :style="{color: theme.textPrimary}">{{$t('usdt_address_label')}}</p>
                                <view class="height-86 radiu-10 margin-t-20 padding-w-20 flex align-center justify-between" :style="{background: theme.backgroundTertiary}">
                                    <input class="flex-1 height-76 line-height-76 font-28" type="text" v-model="usdt_address" :placeholder="$t('usdt_address_placeholder')" placeholder-class="input-placeholder" :style="{color: theme.textPrimary}"/>
                                </view>
                            </view>
                        </template>
                    </view>
                    <view class="">
                        <view @click="queding" class="loginBtn margin-b-28" :style="{background: theme.primary__500, color: theme.white}">
                            <text :style="{color: theme.white}">{{$t('login27')}}</text>
                        </view>
                    </view>
                </view>
            </view>
		</v-container>


	</view>
</template>

<script>
	export default {
		data() {
			return {
				username:'',
				card_num:'', // For traditional bank account number
				usdt_address:'', // For USDT address
				chain: '', // Chain for USDT (TRX, ERC, USDT, etc.)
				bank_name:'',
				mobile:'',
				bank_type: 1, // 1 = Bank Address, 2 = USDT Address
				flag: true,
				accountId: null, // For editing existing account
				chainOptions: [] // Will be loaded from API
			}
		},
		onLoad(options) {
			// Load data from URL parameters if editing
			if (options) {
				if (options.id) {
					this.accountId = options.id
				}

				// Load account data from parameters
				if (options.bank_type) {
					this.bank_type = parseInt(options.bank_type) || 1
					this.bank_name = options.bank_name ? decodeURIComponent(options.bank_name) : ''

					if (this.bank_type == 2) {
						this.usdt_address = options.usdt_address ? decodeURIComponent(options.usdt_address) : ''
						this.chain = options.chain ? decodeURIComponent(options.chain) : ''
					} else {
						this.username = options.username ? decodeURIComponent(options.username) : ''
						this.card_num = options.card_num ? decodeURIComponent(options.card_num) : ''
						this.mobile = options.mobile ? decodeURIComponent(options.mobile) : ''
					}
				}
			}
            this.fetchChainOptions()
		},
		filters:{
			addressFilter(address){
				var temp = address.replace(address.substring(4, address.length - 4), "****")
				return temp
			},
		},
        computed: {
            theme(){
                return this.$store.getters.theme
            }
        },
        watch: {
            bank_type(newType, oldType) {
                // Clear fields when switching bank types
                if (oldType && newType != oldType) {
                    if (newType == 1) {
                        this.usdt_address = ''
                        this.chain = ''
                    } else {
                        this.card_num = ''
                        this.username = ''
                        this.mobile = ''
                    }
                }
            }
        },
		methods: {
			queding(){
				if (!this.flag) return

				// Validation based on bank type
				if (this.bank_type == 1) {
					if (this.username=='') return this.tos(this.$t('my95'))
					if (this.bank_name == '') return this.tos(this.$t('my28'))
					if (this.card_num == '') return this.tos(this.$t('my32'))
					if (this.mobile == '') return this.tos(this.$t('mobile1'))
				} else {
					// USDT Address validation - address required, chain optional (API might support later)
					if (this.usdt_address == '') {
						return this.tos(this.$t('usdt_address_required'))
					}
					// Chain validation is optional for now since API might support it later
				}

				this.flag = false
				const postData = {
					bank_type: this.bank_type
				}

				if (this.bank_type == 1) {
					postData.username = this.username
					postData.bank_name = this.bank_name
					postData.card_num = this.card_num
					postData.mobile = this.mobile
				} else {
					postData.usdt_address = this.usdt_address
					if (this.chain) {
						postData.chain = this.chain
					}
				}

				this.post('/my/add_collection', postData, true).then(res => {
					this.flag = true
					if (res.code == 1) {
						this.tos(res.msg || this.$t('bank_account_saved'))
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
					}
				})
			},
			getChainOptionStyle(value) {
				if (this.chain == value) {
					return {
						background: this.theme.primary__500,
						borderColor: this.theme.primary__500
					}
				}
				return {
					background: this.theme.backgroundTertiary,
					borderColor: this.theme.neutral__200
				}
			},
			getChainOptionTextStyle(value) {
				if (this.chain == value) {
					return {
						color: this.theme.white
					}
				}
				return {
					color: this.theme.textPrimary
				}
			},
            fetchChainOptions() {
                this.post('/my/chain').then(res => {
                    if (res.code == 1 && res.data && Array.isArray(res.data)) {
                        // Map API response to chainOptions format
                        this.chainOptions = res.data.map(item => ({
                            label: item.chain,
                            value: item.chain
                        }))
                    } else {
                        // Fallback to default options if API fails
                        this.chainOptions = [
                            { label: 'TRX', value: 'TRX' },
                            { label: 'ERC', value: 'ERC' },
                            { label: 'USDT', value: 'USDT' }
                        ]
                    }
                }).catch(err => {
                    console.error('Failed to fetch chain options:', err)
                    // Fallback to default options on error
                    this.chainOptions = [
                        { label: 'TRX', value: 'TRX' },
                        { label: 'ERC', value: 'ERC' },
                        { label: 'USDT', value: 'USDT' }
                    ]
                })
            }
		}
	}
</script>

<style lang="scss" scoped>
	.min-height-screen {
		min-height: 100vh;
	}

	.codeBox{
		padding: 0 18rpx;
		height: 60rpx;
		border-radius: 8rpx;
		line-height: 60rpx;
		font-size: 26rpx;
	}

	.loginBtn{
		width: 100%;
		height: 86rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.input-placeholder {
		color: inherit;
		opacity: 0.6;
	}

    .bank-info {
        border-radius: 24rpx;
        padding: 60rpx 40rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 20rpx;
    }

    .chain-option {
        min-width: 140rpx;
        height: 70rpx;
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1rpx solid;
        transition: all 0.3s ease;
        padding: 0 24rpx;
    }

    .chain-option.chain-selected {
        transform: scale(1.02);
    }
</style>
