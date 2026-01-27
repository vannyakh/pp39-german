<template>
    <view class="forget-page min-height-screen-teb">
        <!-- Background with abstract elements -->
        <view
            class="background-section"
            :style="{ background: backgroundGradient }"
        >
            <view class="abstract-elements">
                <view
                    class="candlestick-pattern"
                    :style="{ background: backgroundGradient }"
                ></view>
                <view class="glow-circle circle-1"></view>
                <view class="glow-circle circle-2"></view>
                <view class="glow-circle circle-3"></view>
            </view>
            <app-nav blur>
                <template #right>
                    <view
                        class="language"
                        @click="router.push('/pages/my/lang')"
                    >
                        <image :src="$t('logo')" class="lang-logo"></image>
                        <text
                            class="lang-text"
                            :style="{ color: theme.textPrimary }"
                            >{{ $t("language") }}</text
                        >
                    </view>
                </template>
            </app-nav>

            <!-- Logo Section -->
            <view class="logo-container">
                <view
                    class="logo-circle"
                    :style="{
                        background:
                            theme.backgroundCard || 'rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 8rpx 16rpx rgba(0, 0, 0, 0.1)',
                    }"
                >
                    <image
                        class="logo-image"
                        :src="$store.state.logo"
                        mode="aspectFill"
                    ></image>
                </view>
            </view>
        </view>

        <!-- Forget Password Form Card -->
        <view
            class="forget-card"
            :style="{ background: theme.backgroundPrimary }"
        >
            <view class="card-header">
                <text
                    class="card-title"
                    :style="{ color: theme.textPrimary }"
                    >{{ $t("login5") }}</text
                >
            </view>

            <!-- Tab Switcher -->
            <view
                class="tab-switcher"
                :style="{ background: theme.backgroundTertiary }"
            >
                <view
                    class="tab-item"
                    :class="{ 'tab-active': resetType === 'phone' }"
                    :style="resetType === 'phone' ? tabActiveStyle : {}"
                    @click="switchResetType('phone')"
                >
                    <u-icon
                        name="phone"
                        size="20"
                        :color="
                            resetType === 'phone'
                                ? theme.primary__light
                                : theme.textTertiary
                        "
                    ></u-icon>
                    <text
                        class="tab-text"
                        :style="{
                            color:
                                resetType === 'phone'
                                    ? theme.primary__light
                                    : theme.textTertiary,
                        }"
                    >
                        {{ $t("register.phone") }}
                    </text>
                </view>
                <view
                    class="tab-item"
                    :class="{ 'tab-active': resetType === 'email' }"
                    :style="resetType === 'email' ? tabActiveStyle : {}"
                    @click="switchResetType('email')"
                >
                    <u-icon
                        name="email"
                        size="20"
                        :color="
                            resetType === 'email'
                                ? theme.primary__light
                                : theme.textTertiary
                        "
                    ></u-icon>
                    <text
                        class="tab-text"
                        :style="{
                            color:
                                resetType === 'email'
                                    ? theme.primary__light
                                    : theme.textTertiary,
                        }"
                    >
                        {{ $t("register.email") }}
                    </text>
                </view>
            </view>

            <!-- Mobile Number Input (Phone Tab) -->
            <view v-if="resetType === 'phone'" class="input-group">
                <view
                    class="input-container"
                    :style="{ background: theme.backgroundTertiary }"
                >
                    <view class="input-icon">
                        <u-icon
                            name="phone"
                            size="20"
                            :color="theme.neutral__400"
                        ></u-icon>
                    </view>
                    <view
                        class="country-selector"
                        @click="countryType = true"
                        :style="{ background: theme.primary__50 }"
                    >
                        <text
                            class="country-code"
                            :style="{ color: theme.primary__light }"
                            >+{{ seleCountry.value }}</text
                        >
                        <u-icon
                            name="arrow-down"
                            size="12"
                            :color="theme.neutral__400"
                        ></u-icon>
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
                    <view
                        v-if="showClearIcon"
                        class="clear-icon"
                        @click="clearIcon"
                    >
                        <u-icon name="close" size="16"></u-icon>
                    </view>
                </view>
            </view>

            <!-- Email Input (Email Tab) -->
            <view v-if="resetType === 'email'" class="input-group">
                <view
                    class="input-container"
                    :style="{ background: theme.backgroundTertiary }"
                >
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
                    <view
                        v-if="showClearIconEmail"
                        class="clear-icon"
                        @click="clearIconEmail"
                    >
                        <u-icon name="close" size="16"></u-icon>
                    </view>
                </view>
            </view>

            <!-- Verification Code Input (Email only) -->
            <view class="input-group">
                <view
                    class="input-container"
                    :style="{ background: theme.backgroundTertiary }"
                >
                    <view class="input-icon">
                        <u-icon
                            name="coupon"
                            size="20"
                            :color="theme.neutral__400"
                        ></u-icon>
                    </view>
                    <input
                        class="input-field"
                        type="number"
                        v-model="code"
                        :placeholder="$t('login12')"
                        placeholder-class="input-placeholder"
                        :style="{ color: theme.textPrimary }"
                    />
                    <view
                        @click="cutTime()"
                        class="code-button"
                        :class="{ disabled: !timeFlag }"
                        :style="getCodeButtonStyle()"
                    >
                        <text
                            class="code-text"
                            :style="{ color: theme.white }"
                            >{{ codeText }}</text
                        >
                    </view>
                </view>
            </view>

            <!-- New Password Input -->
            <view class="input-group">
                <view
                    class="input-container"
                    :style="{ background: theme.backgroundTertiary }"
                >
                    <view class="input-icon">
                        <u-icon
                            name="lock"
                            size="20"
                            :color="theme.neutral__400"
                        ></u-icon>
                    </view>
                    <input
                        class="input-field"
                        type="text"
                        v-model="pwd1"
                        :placeholder="$t('login14')"
                        placeholder-class="input-placeholder"
                        :style="{ color: theme.textPrimary }"
                    />
                </view>
            </view>

            <!-- Confirm Password Input -->
            <view class="input-group">
                <view
                    class="input-container"
                    :style="{ background: theme.backgroundTertiary }"
                >
                    <view class="input-icon">
                        <u-icon
                            name="lock"
                            size="20"
                            :color="theme.neutral__400"
                        ></u-icon>
                    </view>
                    <input
                        class="input-field"
                        type="text"
                        v-model="pwd2"
                        :placeholder="$t('login16')"
                        placeholder-class="input-placeholder"
                        :style="{ color: theme.textPrimary }"
                    />
                </view>
            </view>

            <!-- Reset Password Button -->
            <view class="reset-button-container">
                <button
                    @click="getRegister"
                    :disabled="!flag"
                    :class="['reset-button', { disabled: !flag }]"
                    :style="getButtonStyle()"
                >
                    <text class="button-text" :style="{ color: theme.white }">{{
                        $t("login27")
                    }}</text>
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
                    :class="{
                        'country-item--active':
                            seleCountry &&
                            seleCountry.country_code === country.country_code,
                    }"
                    @click="selectCountry(country)"
                    :style="{
                        background:
                            seleCountry &&
                            seleCountry.country_code === country.country_code
                                ? theme.primary__50
                                : 'transparent',
                    }"
                >
                    <image
                        v-if="country.image"
                        class="country-flag"
                        :src="country.image"
                        mode="aspectFit"
                    ></image>
                    <text
                        class="country-name"
                        :style="{ color: theme.textPrimary }"
                        >{{ country.name }}</text
                    >
                    <text
                        class="country-code-text"
                        :style="{ color: theme.textSecondary }"
                        >+{{ country.country_code }}</text
                    >
                    <view
                        v-if="
                            seleCountry &&
                            seleCountry.country_code === country.country_code
                        "
                        class="country-check"
                    >
                        <u-icon
                            name="checkmark"
                            size="20"
                            :color="theme.primary__light"
                        ></u-icon>
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
            resetType: "phone", // 'phone' or 'email'
            countryType: false,
            rangelist: [],
            seleCountry: "",

            mobile: "",
            email: "",
            code: "",
            pwd1: "",
            pwd2: "",

            flag: true,
            time: "",
            timeFlag: true,
            showClearIcon: false,
            showClearIconEmail: false,
        };
    },
    computed: {
        codeText() {
            if (this.time > 0) {
                return this.time + " s";
            } else {
                return this.$t("login25");
            }
        },
        theme() {
            return this.$store.getters.theme;
        },
        backgroundGradient() {
            const primaryColor = this.theme.primary__light;
            const secondaryColor = this.theme.secondary;
            if (this.theme.primary && this.theme.primary.includes("gradient")) {
                return this.theme.primary.replace("137deg", "90deg");
            }
            return `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
        },
        tabActiveStyle() {
            return {
                background: this.theme.backgroundPrimary,
                boxShadow: "0 2rpx 8rpx rgba(0, 0, 0, 0.1)",
            };
        },
    },
    onLoad() {
        getApp().globalData.clearAllIntervals();
        this.loadCountries();
    },
    methods: {
        async loadCountries() {
            try {
                const res = await this.post("/index/country");
                if (
                    res &&
                    res.code === 1 &&
                    res.data &&
                    Array.isArray(res.data)
                ) {
                    // Map API response to expected format: add 'value' property from 'country_code'
                    this.rangelist = res.data.map((country) => ({
                        ...country,
                        value: country.country_code,
                    }));

                    this.rangelist.map((e, i) => {
                        if (e.country_code == "49") {
                            const activeCountry = e;
                            this.seleCountry =
                                activeCountry || this.rangelist[i];
                        }
                    });
                    // if (this.rangelist.length > 0) {
                    // 	// Find country with active = 1, otherwise use first country
                    // 	const activeCountry = this.rangelist.find(country => country.active === 1)
                    // 	this.seleCountry = activeCountry || this.rangelist[0]
                    // }
                } else {
                    console.error("Failed to load countries:", res);
                }
            } catch (err) {
                console.error("Error loading countries:", err);
            }
        },
        switchResetType(type) {
            this.resetType = type;
            // Clear inputs when switching
            if (type === "phone") {
                this.email = "";
                this.code = "";
                this.showClearIconEmail = false;
            } else {
                this.mobile = "";
                this.showClearIcon = false;
            }
        },
        clearInput: function (event) {
            this.mobile = event.detail.value;
            this.showClearIcon = event.detail.value.length > 0;
        },
        clearIcon: function () {
            this.mobile = "";
            this.showClearIcon = false;
        },
        clearInputEmail: function (event) {
            this.email = event.detail.value;
            this.showClearIconEmail = event.detail.value.length > 0;
        },
        clearIconEmail: function () {
            this.email = "";
            this.showClearIconEmail = false;
        },
        getCodeButtonStyle() {
            if (!this.timeFlag) {
                return {
                    background: this.theme.neutral__400,
                };
            }
            const primaryColor = this.theme.primary__light;
            const secondaryColor = this.theme.secondary;
            if (this.theme.primary && this.theme.primary.includes("gradient")) {
                return {
                    background: this.theme.primary,
                };
            }
            return {
                background: `linear-gradient(137deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
            };
        },
        getButtonStyle() {
            if (!this.flag) {
                return {
                    background: this.theme.neutral__400,
                    boxShadow: "none",
                };
            }
            const primaryColor = this.theme.primary__light;
            const secondaryColor = this.theme.secondary;
            if (this.theme.primary && this.theme.primary.includes("gradient")) {
                return {
                    background: this.theme.primary.replace("137deg", "90deg"),
                    boxShadow: "0 4rpx 20rpx rgba(244, 118, 86, 0.3)",
                };
            }
            return {
                background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                boxShadow: "0 4rpx 20rpx rgba(244, 118, 86, 0.3)",
            };
        },
        selectCountry(country) {
            this.seleCountry = country;
            this.countryType = false;
        },
        getRegister() {
            if (!this.flag) return;
            if (this.resetType === "phone") {
                if (this.mobile == "") return this.tos(this.$t("login10"));
            } else {
                if (this.email == "")
                    return this.tos(this.$t("register.email_required"));
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.email)) {
                    return this.tos(this.$t("register.email_invalid"));
                }
                if (this.code == "") return this.tos(this.$t("login12"));
            }
            if (this.pwd1 == "") return this.tos(this.$t("login14"));
            if (this.pwd1 != this.pwd2) return this.tos(this.$t("login26"));
            this.flag = false;
            const resetData = {
                newpassword: this.pwd2,
            };
            if (this.resetType === "phone") {
                resetData.mobile = this.mobile;
            } else {
                resetData.email = this.email;
                resetData.captcha = this.code;
            }
            this.post("/user/resetpwd", resetData, true).then((res) => {
                this.flag = true;
                if (res.code == 1) {
                    this.tos(res.code);
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 500);
                }
            });
        },
        // 发送验证码
        cutTime() {
            if (!this.timeFlag) return;
            if (this.resetType === "phone") {
                if (this.mobile == "") return this.tos(this.$t("login10"));
                this.timeFlag = false;
                this.post(
                    "/sms/send",
                    {
                        m_prefix: this.seleCountry.value,
                        mobile: this.mobile,
                        event: "resetpwd",
                    },
                    true,
                ).then((res) => {
                    if (res.code == 1) {
                        this.tos(res.msg);
                        this.time = 60;
                        var that = this;
                        let timeName = setInterval(() => {
                            if (that.time > 0) {
                                that.time--;
                            } else {
                                that.time = 0;
                                that.timeFlag = true;
                                clearInterval(timeName);
                            }
                        }, 1000);
                    } else {
                        this.timeFlag = true;
                    }
                });
            } else {
                // Email reset - send OTP to email
                if (this.email == "")
                    return this.tos(this.$t("register.email_required"));
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(this.email)) {
                    return this.tos(this.$t("register.email_invalid"));
                }
                this.timeFlag = false;
                this.post(
                    "/ems/send",
                    {
                        email: this.email,
                        event: "resetpwd",
                    },
                    true,
                ).then((res) => {
                    if (res.code == 1) {
                        this.tos(res.msg);
                        this.time = 60;
                        var that = this;
                        let timeName = setInterval(() => {
                            if (that.time > 0) {
                                that.time--;
                            } else {
                                that.time = 0;
                                that.timeFlag = true;
                                clearInterval(timeName);
                            }
                        }, 1000);
                    } else {
                        this.timeFlag = true;
                    }
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.forget-page {
    min-height: 100vh;
    position: relative;
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
    background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 70%
    );
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
    0%,
    100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
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
}

.forget-card {
    position: absolute;
    top: 35vh;
    left: 0;
    right: 0;
    border-radius: 48rpx 48rpx 0 0;
    padding: 40rpx 30rpx;
    z-index: 3;
    min-height: 65vh;
}

.card-header {
    margin-bottom: 40rpx;
    text-align: center;
}

.card-title {
    font-size: 48rpx;
    font-weight: 700;
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

.code-button {
    padding: 8rpx 16rpx;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
}

.code-button.disabled {
    cursor: not-allowed;
}

.code-text {
    font-size: 28rpx;
    font-weight: 500;
}

.clear-icon {
    padding: 8rpx;
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

.reset-button-container {
    margin-top: 40rpx;
}

.reset-button {
    width: 100%;
    height: 88rpx;
    border: none;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.reset-button:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 10rpx rgba(244, 118, 86, 0.3);
}

.reset-button.disabled {
    box-shadow: none;
}

.button-text {
    font-size: 32rpx;
    font-weight: 600;
}

.language {
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
</style>
