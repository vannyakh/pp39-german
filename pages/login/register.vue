<template>
    <view class="register-page min-height-screen-teb">
        <!-- Background with abstract elements -->
        <view class="background-section" :style="{ background: backgroundGradient }">
            <view class="abstract-elements">
                <view class="candlestick-pattern" :style="{ background: backgroundGradient }"></view>
                <view class="glow-circle circle-1"></view>
                <view class="glow-circle circle-2"></view>
                <view class="glow-circle circle-3"></view>
            </view>
            <app-nav blur>
                <template #right>
                    <view class="language" @click="router.push('/pages/my/lang')">
                        <image :src="$t('logo')" class="lang-logo"></image>
                        <text class="lang-text">{{ $t('language') }}</text>
                    </view>
                </template>
            </app-nav>


            <!-- Logo Section -->
            <view class="logo-container">
                <view class="logo-circle" :style="{ background: theme.backgroundCard, boxShadow: '0 8rpx 16rpx rgba(0, 0, 0, 0.1)' }">
                    <image class="logo-image" :src="$store.state.logo" mode="aspectFill"></image>
                </view>
            </view>
        </view>

        <!-- Register Form Card -->
        <view class="register-card" :style="{ background: theme.backgroundPrimary }">
            <view class="card-header">
                <text class="card-title" :style="{ color: theme.textPrimary }">{{$t('login9')}}</text>
            </view>

            <!-- Tab Switcher -->
            <view class="tab-switcher" :style="{ background: theme.backgroundTertiary }">
                <view
                    class="tab-item"
                    :class="{ 'tab-active': registerType === 'phone' }"
                    :style="registerType === 'phone' ? tabActiveStyle : {}"
                    @click="switchRegisterType('phone')"
                >
                    <u-icon name="phone" size="20" :color="registerType === 'phone' ? theme.primary__light : theme.textTertiary"></u-icon>
                    <text class="tab-text" :style="{ color: registerType === 'phone' ? theme.primary__light : theme.textTertiary }">
                        {{ $t('register.phone') }}
                    </text>
                </view>
                <view
                    class="tab-item"
                    :class="{ 'tab-active': registerType === 'email' }"
                    :style="registerType === 'email' ? tabActiveStyle : {}"
                    @click="switchRegisterType('email')"
                >
                    <u-icon name="email" size="20" :color="registerType === 'email' ? theme.primary__light : theme.textTertiary"></u-icon>
                    <text class="tab-text" :style="{ color: registerType === 'email' ? theme.primary__light : theme.textTertiary }">
                        {{ $t('register.email') }}
                    </text>
                </view>
            </view>

            <!-- Mobile Number Input (Phone Tab) -->
            <view v-if="registerType === 'phone'" class="input-group">
                <view class="input-container" :style="{ background: theme.backgroundTertiary }">
                    <view class="input-icon">
                        <u-icon name="phone" size="20"></u-icon>
                    </view>
                    <view class="country-selector" @click="countryType=true" :style="{ background: theme.primary__50 }">
                        <text class="country-code" :style="{ color: theme.primary__light }">+{{seleCountry.value}}</text>
                        <u-icon name="arrow-down" size="12"></u-icon>
                    </view>
                    <input
                        class="input-field"
                        type="number"
                        v-model="mobile"
                        @input="clearInput"
                        :placeholder="$t('login10')"
                        placeholder-class="input-placeholder"
                        :style="{ color: theme.textPrimary }"
                    />
                    <view v-if="showClearIcon" class="clear-icon" @click="clearIcon">
                        <u-icon name="close" size="16"></u-icon>
                    </view>
                </view>
            </view>

            <!-- Email Input (Email Tab) -->
            <view v-if="registerType === 'email'" class="input-group">
                <view class="input-container" :style="{ background: theme.backgroundTertiary }">
                    <view class="input-icon">
                        <u-icon name="email" size="20"></u-icon>
                    </view>
                    <input
                        class="input-field"
                        type="text"
                        v-model="email"
                        @input="clearInputEmail"
                        :placeholder="$t('register.email_placeholder')"
                        placeholder-class="input-placeholder"
                        :style="{ color: theme.textPrimary }"
                    />
                    <view v-if="showClearIconEmail" class="clear-icon" @click="clearIconEmail">
                        <u-icon name="close" size="16"></u-icon>
                    </view>
                </view>
            </view>

            <!-- OTP Code Input (Email only) -->
            <view v-if="registerType === 'email'" class="input-group">
                <view class="input-container" :style="{ background: theme.backgroundTertiary }">
                    <view class="input-icon">
                        <u-icon name="scan" size="20"></u-icon>
                    </view>
                    <input
                        class="input-field"
                        type="number"
                        v-model="code"
                        maxlength="6"
                        :placeholder="$t('login11')"
                        placeholder-class="input-placeholder"
                        :style="{ color: theme.textPrimary }"
                    />
                    <view class="otp-button" @click="cutTime" :style="{ background: timeFlag ? theme.primary__light : theme.neutral__400 }">
                        <text class="otp-text" :style="{ color: theme.white }">{{ codeText }}</text>
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
                        class="input-field"
                        type="text"
                        v-model="password"
                        :placeholder="$t('login14')"
                        :password="showPassword"
                        placeholder-class="input-placeholder"
                        :style="{ color: theme.textPrimary }"
                    />
                    <view class="password-toggle" @click="showPassword=!showPassword">
                        <u-icon :name="showPassword?'eye-off':'eye-fill'" size="20"></u-icon>
                    </view>
                </view>
            </view>

            <!-- Confirm Password Input -->
            <view class="input-group">
                <view class="input-container" :style="{ background: theme.backgroundTertiary }">
                    <view class="input-icon">
                        <u-icon name="lock" size="20"></u-icon>
                    </view>
                    <input
                        class="input-field"
                        type="text"
                        v-model="password2"
                        :placeholder="$t('login16')"
                        :password="showPassword1"
                        placeholder-class="input-placeholder"
                        :style="{ color: theme.textPrimary }"
                    />
                    <view class="password-toggle" @click="showPassword1=!showPassword1">
                        <u-icon :name="showPassword1?'eye-off':'eye-fill'" size="20"></u-icon>
                    </view>
                </view>
            </view>

            <!-- Referral Code Input -->
            <view class="input-group">
                <view class="input-container" :style="{ background: theme.backgroundTertiary }">
                    <view class="input-icon">
                        <u-icon name="gift" size="20"></u-icon>
                    </view>
                    <input
                        class="input-field"
                        type="text"
                        v-model="referral_code"
                        @input="clearInput1"
                        :placeholder="$t('login20')"
                        placeholder-class="input-placeholder"
                        :style="{ color: theme.textPrimary }"
                    />
                    <view v-if="showClearIcon1" class="clear-icon" @click="clearIcon1">
                        <u-icon name="close" size="16"></u-icon>
                    </view>
                </view>
            </view>

            <!-- Register Button -->
            <view class="register-button-container">
                <button
                    @click="getRegister"
                    :disabled="isDisabled"
                    :class="['register-button', {'disabled': isDisabled}]"
                    :style="getButtonStyle()"
                >
                    <text class="button-text" :style="{ color: theme.white }">{{$t('login21')}}</text>
                </button>
            </view>
        </view>

        <!-- Country Picker -->
        <v-bottom-sheet
            :value="countryType"
            @input="countryType = $event"
            :title="$t('login23') || 'Select Country'"
            :backgroundColor="theme.backgroundPrimary"
            :textColor="theme.textPrimary"
        >
            <view class="country-list">
                <view
                    v-for="(country, index) in rangelist"
                    :key="index"
                    class="country-item"
                    :class="{ 'country-item--active': seleCountry && seleCountry.country_code === country.country_code }"
                    @click="selectCountry(country)"
                    :style="{
						background: seleCountry && seleCountry.country_code === country.country_code ? theme.primary__50 : 'transparent'
					}"
                >
                    <image v-if="country.image" class="country-flag" :src="country.image" mode="aspectFit"></image>
                    <text class="country-name" :style="{ color: theme.textPrimary }">{{ country.name }}</text>
                    <text class="country-code-text" :style="{ color: theme.textSecondary }">+{{ country.country_code }}</text>
                    <view v-if="seleCountry && seleCountry.country_code === country.country_code" class="country-check">
                        <u-icon name="checkmark" size="20" :color="theme.primary__light"></u-icon>
                    </view>
                </view>
            </view>
        </v-bottom-sheet>
    </view>
</template>

<script>
export default {
    data() {
        return {
            registerType: 'phone', // 'phone' or 'email'
            countryType:false,
            rangelist:[],
            seleCountry:'',
            mobile:'',
            email:'',
            password:'',
            password2:'',
            pay_pwd:'',
            code:'',
            referral_code:'',
            flag: true,
            time: '',
            timeFlag: true,
            showClearIcon: false,
            showClearIcon1: false,
            showClearIconEmail: false,
            showPassword: true,
            showPassword1: true
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
        },
        isDisabled(){
            if (this.registerType === 'phone') {
                return this.mobile==''||this.password==''||this.password2==''
            } else {
                return this.email==''||this.code==''||this.password==''||this.password2==''
            }
        },
        tabActiveStyle() {
            return {
                background: this.theme.backgroundPrimary,
                boxShadow: '0 2rpx 8rpx rgba(0, 0, 0, 0.1)'
            }
        },
        backgroundGradient() {
            // Handle gradient - primary might be a gradient, so extract solid color
            const primaryColor = this.theme.primary__light
            const secondaryColor = this.theme.secondary
            // If primary is a gradient, use it directly, otherwise create gradient
            if (this.theme.primary && this.theme.primary.includes('gradient')) {
                return this.theme.primary.replace('137deg', '90deg')
            }
            return `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
        }
    },
    onLoad() {
        getApp().globalData.clearAllIntervals()
        this.loadCountries()
    },
    methods: {
        async loadCountries() {
            try {
                const res = await this.post('/index/country')
                if (res && res.code === 1 && res.data && Array.isArray(res.data)) {
                    // Map API response to expected format: add 'value' property from 'country_code'
                    this.rangelist = res.data.map(country => ({
                        ...country,
                        value: country.country_code
                    }))
                    if (this.rangelist.length > 0) {
                        // Find country with active = 1, otherwise use first country
                        const activeCountry = this.rangelist.find(country => country.active === 1)
                        this.seleCountry = activeCountry || this.rangelist[0]
                    }
                } else {
                    console.error('Failed to load countries:', res)
                }
            } catch (err) {
                console.error('Error loading countries:', err)
            }
        },
        switchRegisterType(type) {
            this.registerType = type
            // Clear inputs when switching
            if (type === 'phone') {
                this.email = ''
                this.code = ''
                this.showClearIconEmail = false
            } else {
                this.mobile = ''
                this.showClearIcon = false
            }
        },
        getButtonStyle() {
            if (this.isDisabled) {
                return {
                    background: this.theme.neutral__400,
                    boxShadow: 'none'
                }
            }
            const primaryColor = this.theme.primary__light
            const secondaryColor = this.theme.secondary
            // If primary is a gradient, use it directly, otherwise create gradient
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
            this.mobile = event.detail.value
            if (event.detail.value.length > 0) {
                this.showClearIcon = true
            } else {
                this.showClearIcon = false
            }
        },
        clearIcon: function () {
            this.mobile = ''
            this.showClearIcon = false
        },
        clearInputEmail: function (event) {
            this.email = event.detail.value
            if (event.detail.value.length > 0) {
                this.showClearIconEmail = true
            } else {
                this.showClearIconEmail = false
            }
        },
        clearIconEmail: function () {
            this.email = ''
            this.showClearIconEmail = false
        },
        clearInput1: function (event) {
            this.referral_code = event.detail.value
            if (event.detail.value.length > 0) {
                this.showClearIcon1 = true
            } else {
                this.showClearIcon1 = false
            }
        },
        clearIcon1: function () {
            this.referral_code = ''
            this.showClearIcon1 = false
        },
        selectCountry(country){
            this.seleCountry = country
            this.countryType = false
        },
        getRegister() {
            if (!this.flag) return

            // Validate based on register type
            if (this.registerType === 'phone') {
                if (this.mobile=='') return this.tos(this.$t('login10'))
            } else {
                if (this.email=='') return this.tos(this.$t('register.email_required'))
                if (this.code=='') return this.tos(this.$t('login12'))
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(this.email)) {
                    return this.tos(this.$t('register.email_invalid'))
                }
            }

            if (this.password == '') return this.tos(this.$t('login14'))
            if (this.password != this.password2) return this.tos(this.$t('login26'))

            this.flag = false

            // Prepare register data based on type
            const registerData = {
                password: this.password2,
                referral_code: this.referral_code
            }

            if (this.registerType === 'phone') {
                registerData.m_prefix = this.seleCountry.value
                registerData.mobile = this.mobile
            } else {
                registerData.email = this.email
                registerData.code = this.code
            }

            this.post('/user/register', registerData, true).then(res => {
                this.flag = true
                if (res.code == 1) {
                    this.tos(res.msg)
                    setTimeout(()=>{
                        uni.navigateBack()
                    },500)
                }
            })
        },
        // 发送验证码
        cutTime() {
            if (!this.timeFlag) return
            if (this.registerType === 'phone') {
                if (this.mobile=='') return this.tos(this.$t('login10'))
                this.timeFlag = false
                this.post('/sms/send', {
                    m_prefix:this.seleCountry.value,
                    mobile: this.mobile,
                    event: "register",
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
            } else {
                // Email registration - send OTP to email
                if (this.email=='') return this.tos(this.$t('register.email_required'))
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(this.email)) {
                    return this.tos(this.$t('register.email_invalid'))
                }
                this.timeFlag = false
                this.post('/ems/send', {
                    email: this.email,
                    event: "register",
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
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.register-page {
    min-height: 100vh;
    position: relative;
    //overflow-x: hidden;
}

.background-section {
    height: 38vh;
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

.register-card {
    position: absolute;
    top: 28vh;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 48rpx 48rpx 0 0;
    padding: 40rpx 30rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
    z-index: 3;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.card-header {
    margin-bottom: 40rpx;
    text-align: center;
}

.card-title {
    font-size: 48rpx;
    font-weight: bold;
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

.country-selector {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-right: 24rpx;
    padding: 8rpx 16rpx;
    border-radius: 12rpx;
}

.country-code {
    font-size: 28rpx;
    font-weight: 500;
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

.otp-button {
    padding: 12rpx 24rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 16rpx;
    cursor: pointer;
    transition: all 0.3s ease;
}

.otp-button:active {
    opacity: 0.8;
}

.otp-text {
    font-size: 28rpx;
    font-weight: 500;
    white-space: nowrap;
}

.register-button-container {
    margin-top: 40rpx;
    margin-bottom: 20rpx;
    position: relative;
}

.register-button {
    width: 100%;
    height: 88rpx;
    border: none;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.register-button:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 10rpx rgba(244, 118, 86, 0.3);
}

.register-button.disabled {
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

.country-list {
    display: flex;
    flex-direction: column;
    gap: 2rpx;
}

.country-item {
    display: flex;
    align-items: center;
    padding: 24rpx 32rpx;
    border-radius: 12rpx;
    gap: 24rpx;
    cursor: pointer;
    transition: background 0.3s ease;
    position: relative;
}

.country-item--active {
    font-weight: 500;
}

.country-flag {
    width: 48rpx;
    height: 36rpx;
    border-radius: 4rpx;
    flex-shrink: 0;
}

.country-name {
    flex: 1;
    font-size: 32rpx;
    font-weight: 400;
}

.country-code-text {
    font-size: 28rpx;
    font-weight: 500;
    margin-right: 16rpx;
}

.country-check {
    display: flex;
    align-items: center;
    justify-content: center;
}

.tab-switcher {
    width: 60%;
    display: flex;
    border-radius: 9999rpx;
    padding: 6rpx;
    margin: 0 0 40rpx 0;
    position: relative;
}

.tab-item {
    width: 50%;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    border-radius: 9999rpx;
    transition: all 0.3s ease;
    cursor: pointer;
}

.tab-active {
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.tab-text {
    font-size: 32rpx;
    font-weight: 500;
    transition: color 0.3s ease;
}
</style>
