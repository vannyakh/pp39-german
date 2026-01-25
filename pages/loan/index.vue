<template>
    <view
        class="min-height-screen"
        :style="{ background: theme.backgroundSecondary }"
    >
        <app-nav
            :title="$t('loan.title')"
            blur
            show-right-image
            right-image-url="/static/imgs/fund/record.png"
            @right-action="router.push('/pages/loan/record')"
        ></app-nav>

        <v-container size="md">
            <view class="loan-container">
                <!-- Maximum Loan Amount Display -->
                <view class="flex flex-direction">
                    <view class="max-loan-card" :style="getMaxLoanCardStyle()">
                        <view class="max-loan-amount">
                            <text
                                class="amount-main"
                                :style="{ color: theme.white }"
                                >${{ formatAmount(maxLoanAmount) }}</text
                            >
                            <text
                                class="amount-decimal"
                                :style="{ color: theme.white }"
                                >.{{ formatDecimal(maxLoanAmount) }}</text
                            >
                        </view>
                        <text
                            class="max-loan-label"
                            :style="{ color: theme.white }"
                            >{{ $t("loan.maximum_amount") }}</text
                        >
                    </view>
                    <view class="flex align-center justify-between">
                        <text
                            class="input-label"
                            :style="{ color: theme.textPrimary }"
                            >{{ $t("loan.amount") }}</text
                        >
                        <view
                            class="loan-before"
                            :style="{ color: theme.textTertiary }"
                            >{{ `Loan amount: ${loanBefore}` }}</view
                        >
                    </view>
                </view>

                <!-- Loan Options List -->
                <view class="loan-options-container">
                    <text
                        class="options-title"
                        :style="{ color: theme.textPrimary }"
                        >{{ $t("loan.select_loan_option") }}</text
                    >

                    <!-- Loading State -->
                    <view v-if="loading" class="loading-container">
                        <u-loading-icon
                            :color="theme.primary"
                            size="40"
                        ></u-loading-icon>
                        <text
                            class="loading-text"
                            :style="{ color: theme.textTertiary }"
                            >{{ $t("loan.loading") }}</text
                        >
                    </view>

                    <!-- Empty State -->
                    <view
                        v-else-if="loanOptions.length === 0"
                        class="empty-state"
                    >
                        <text
                            class="empty-text"
                            :style="{ color: theme.textTertiary }"
                            >{{ $t("loan.no_options_available") }}</text
                        >
                    </view>

                    <!-- Loan Options Cards -->
                    <view v-else class="loan-options-list">
                        <view
                            v-for="(option, index) in loanOptions"
                            :key="option.id"
                            class="loan-option-card"
                            :class="{ selected: selectedLoanId === option.id }"
                            :style="getLoanOptionCardStyle(option.id)"
                            @click="selectLoanOption(option)"
                        >
                            <view class="option-header">
                                <view class="option-amount">
                                    <text
                                        class="amount-symbol"
                                        :style="{ color: theme.textPrimary }"
                                        >$</text
                                    >
                                    <text
                                        class="amount-value"
                                        :style="{ color: theme.textPrimary }"
                                        >{{ formatNumber(option.amount) }}</text
                                    >
                                </view>
                                <view
                                    v-if="selectedLoanId === option.id"
                                    class="selected-badge"
                                    :style="{
                                        background: `linear-gradient(135deg, ${theme.primary__300} 0%, ${theme.primary__500} 100%)`,
                                    }"
                                >
                                    <u-icon
                                        name="checkmark"
                                        size="20"
                                        color="#fff"
                                    ></u-icon>
                                </view>
                            </view>

                            <view class="option-details">
                                <view class="detail-row">
                                    <text
                                        class="detail-label"
                                        :style="{ color: theme.textTertiary }"
                                        >{{ $t("loan.period") }}</text
                                    >
                                    <text
                                        class="detail-value"
                                        :style="{ color: theme.textPrimary }"
                                        >{{ option.period }}
                                        {{ $t("loan.days") }}</text
                                    >
                                </view>
                                <view class="detail-row">
                                    <text
                                        class="detail-label"
                                        :style="{ color: theme.textTertiary }"
                                        >{{
                                            $t("loan.daily_interest_rate")
                                        }}</text
                                    >
                                    <text
                                        class="detail-value interest-rate"
                                        :style="{ color: theme.primary }"
                                        >{{
                                            formatPercentage(
                                                option.daily_interest_rate
                                            )
                                        }}</text
                                    >
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- Apply Loan Button -->
                <view class="apply-button-container">
                    <button
                        class="apply-button"
                        :class="{ disabled: !selectedLoanId }"
                        :disabled="!selectedLoanId"
                        :style="getButtonStyle()"
                        @click="applyLoan"
                    >
                        {{ $t("loan.apply") }}
                    </button>
                </view>
            </view>
        </v-container>

        <home-return />
    </view>
</template>

<script>
export default {
    data() {
        return {
            maxLoanAmount: 0,
            loanBefore: 0,
            loanOptions: [],
            selectedLoanId: null,
            selectedLoan: null,
            loading: false,
        };
    },

    computed: {
        theme() {
            return this.$store.getters.theme;
        },
    },
    onLoad() {
        this.getWallet();
        this.getLoanOptions();
    },

    methods: {
        formatAmount(amount) {
            // Format the main amount part (e.g., 95450 -> 95k,45)
            const mainAmount = Math.floor(amount);
            const thousands = Math.floor(mainAmount / 1000);
            const remainder = mainAmount % 1000;

            if (thousands > 0) {
                return `${thousands},${remainder.toString().padStart(3, "0")}`;
            }
            return mainAmount.toString();
        },

        formatDecimal(amount) {
            // Format the decimal part (e.g., 0.07 -> 07)
            const decimal = (amount % 1).toFixed(2);
            return decimal.substring(2); // Remove "0."
        },

        selectLoanOption(option) {
            this.selectedLoanId = option.id;
            this.selectedLoan = option;
        },

        applyLoan() {
            if (!this.selectedLoanId || !this.selectedLoan) {
                uni.showToast({
                    title: this.$t("loan.select_loan_first"),
                    icon: "none",
                });
                return;
            }

            // Show loading
            uni.showLoading({
                title: this.$t("loan.processing"),
            });
            const params = {
                id: this.selectedLoan.id,
            };
            this.post("/my/sub_loan", params)
                .then((res) => {
                    if (res.code === 1) {
                        uni.hideLoading();
                        uni.showToast({
                            title:
                                res.msg ||
                                this.$t("loan.application_submitted"),
                            icon: "success",
                        });

                        // Navigate to service chat if service URL is provided
                        if (res.data && res.data.includes("crisp.chat")) {
                            // Navigate to service chat with the provided URL
                            uni.navigateTo({
                                url: `/pages/index/service/index?service_url=${encodeURIComponent(
                                    res.data
                                )}`,
                            });
                        } else {
                            // Navigate to loan details or confirmation page as fallback
                            this.router.push("/pages/loan/record");
                        }
                    } else {
                        uni.hideLoading();
                        uni.showToast({
                            title: res.msg,
                            icon: "error",
                        });
                    }
                })
                .catch((error) => {
                    uni.hideLoading();
                    console.error("Loan application error:", error);
                    uni.showToast({
                        title: this.$t("loan.application_failed"),
                        icon: "error",
                    });
                });
        },

        getLoanOptions() {
            this.loading = true;
            this.post("/my/list_loan")
                .then((res) => {
                    if (res.code === 1) {
                        this.loanOptions = res.data || [];
                    } else {
                        this.loanOptions = [];
                        uni.showToast({
                            title: res.msg || this.$t("loan.load_failed"),
                            icon: "none",
                        });
                    }
                })
                .catch((error) => {
                    console.error("Failed to load loan options:", error);
                    this.loanOptions = [];
                    uni.showToast({
                        title: this.$t("loan.load_failed"),
                        icon: "none",
                    });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        getWallet() {
            this.post("/my/wallet").then((res) => {
                if (res.code == 1) {
                    this.maxLoanAmount = res.data.userAssets.max_loan;
                    this.exchange_rate = res.data.data.exchange_rate;
                    this.loanBefore = res.data.data.loan_us;
                }
            });
        },
        getMaxLoanCardStyle() {
            return {
                background: `linear-gradient(135deg, ${this.theme.primary__200} 0%, ${this.theme.primary__500} 100%)`,
            };
        },
        getInputStyle() {
            return {
                background: this.theme.backgroundTertiary,
                borderColor: this.theme.neutral__200,
                color: this.theme.textPrimary,
            };
        },
        getButtonStyle() {
            if (!this.selectedLoanId) {
                return {
                    background: this.theme.neutral__400,
                    color: this.theme.white,
                };
            }
            return {
                background: `linear-gradient(135deg, ${this.theme.primary__300} 0%, ${this.theme.primary__500} 100%)`,
                color: this.theme.white,
            };
        },

        getLoanOptionCardStyle(optionId) {
            const baseStyle = {
                background: this.theme.backgroundCard,
                borderColor: this.theme.neutral__200,
            };

            if (this.selectedLoanId === optionId) {
                baseStyle.borderColor = this.theme.primary__500;
                baseStyle.backgroundColor = this.getColorWithOpacity(
                    this.theme.primary__500,
                    0.05
                );
            }

            return baseStyle;
        },

        formatNumber(num) {
            return parseFloat(num || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },

        formatPercentage(rate) {
            const percentage = parseFloat(rate || 0) * 100;
            return percentage.toFixed(2) + "%";
        },

        getColorWithOpacity(color, opacity) {
            if (!color) return `rgba(0, 0, 0, ${opacity})`;
            if (color.startsWith("#")) {
                const hex = color.replace("#", "");
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
            return color;
        },
    },
};
</script>

<style lang="scss" scoped>
.loan-container {
    padding: 40rpx 0;
    display: flex;
    flex-direction: column;
    gap: 40rpx;
}

/* Maximum Loan Amount Card */
.max-loan-card {
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}

.max-loan-amount {
    display: flex;
    align-items: baseline;
    margin-bottom: 20rpx;
}

.amount-main {
    font-size: 60rpx;
    font-weight: bold;
    line-height: 1;
}

.amount-decimal {
    font-size: 48rpx;
    font-weight: bold;
    line-height: 1;
    opacity: 0.9;
}

.max-loan-label {
    font-size: 28rpx;
    opacity: 0.9;
    text-align: center;
}
.loan-before {
    font-size: 22rpx;
}

/* Loan Options Container */
.loan-options-container {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

.options-title {
    font-size: 32rpx;
    font-weight: 600;
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60rpx 0;
    gap: 20rpx;
}

.loading-text {
    font-size: 28rpx;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60rpx 0;
}

.empty-text {
    font-size: 28rpx;
}

.loan-options-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.loan-option-card {
    border-radius: 20rpx;
    padding: 32rpx;
    border: 2rpx solid;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:active {
        transform: scale(0.98);
    }

    &.selected {
        border-width: 2rpx;
    }

    .option-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24rpx;
    }

    .option-amount {
        display: flex;
        align-items: baseline;
        gap: 4rpx;
    }

    .amount-symbol {
        font-size: 28rpx;
        font-weight: 600;
    }

    .amount-value {
        font-size: 48rpx;
        font-weight: bold;
    }

    .selected-badge {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .option-details {
        display: flex;
        flex-direction: column;
        gap: 16rpx;
    }

    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .detail-label {
        font-size: 24rpx;
    }

    .detail-value {
        font-size: 28rpx;
        font-weight: 600;

        &.interest-rate {
            font-weight: bold;
        }
    }
}

/* Apply Button */
.apply-button-container {
    margin-top: 20rpx;
}

.apply-button {
    width: 100%;
    height: 90rpx;
    border: none;
    border-radius: 24rpx;
    font-size: 28rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:active {
        transform: translateY(2rpx);
    }

    &.disabled {
        opacity: 0.6;

        &:active {
            transform: none;
        }
    }
}
</style>
