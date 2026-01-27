<template>
    <view
        class="min-height-screen"
        :style="{
            background: theme.backgroundSecondary,
            color: theme.textPrimary,
        }"
    >
        <z-paging
            :language="$t('locale')"
            ref="paging"
            v-model="dataList"
            @query="queryList"
            :pageSize="20"
        >
            <app-nav
                slot="top"
                :title="$t('ai_subscribe.title')"
                blur
                showRightImage
                rightImageUrl="/static/imgs/fund/record.png"
                @right-action="router.push('/pages/AISubscribe/record')"
            ></app-nav>

            <!-- list all  -->
            <v-container size="md">
                <view class="ai-stock-container">
                    <view class="section-header">
                        <text
                            class="section-title"
                            :style="{ color: theme.textPrimary }"
                            >{{ $t("ai_subscribe.recommendations") }}</text
                        >
                        <text
                            class="section-subtitle"
                            :style="{ color: theme.textPrimary }"
                            >{{ $t("ai_subscribe.powered_by") }}</text
                        >
                    </view>

                    <view class="ai-stock-grid">
                        <!-- Skeleton Cards -->
                        <template v-if="isLoading && dataList.length === 0">
                            <view
                                class="ai-stock-card skeleton"
                                v-for="n in 3"
                                :key="'skeleton-' + n"
                                :style="{ background: theme.backgroundCard }"
                            >
                                <view
                                    class="card-image-container skeleton-image"
                                    :style="{
                                        background: theme.backgroundTertiary,
                                    }"
                                >
                                    <view
                                        class="sk-line sk-image"
                                        :style="getSkeletonStyle()"
                                    ></view>
                                    <view
                                        class="sk-line sk-status-badge"
                                        :style="getSkeletonStyle()"
                                    ></view>
                                </view>

                                <view class="card-content">
                                    <view class="stock-info">
                                        <view class="stock-name-row">
                                            <view
                                                class="sk-line sk-stock-name"
                                                :style="getSkeletonStyle()"
                                            ></view>
                                            <view
                                                class="sk-line sk-type-badge"
                                                :style="getSkeletonStyle()"
                                            ></view>
                                        </view>
                                        <view class="profit-rate-container">
                                            <view
                                                class="sk-line sk-profit-label"
                                                :style="getSkeletonStyle()"
                                            ></view>
                                            <view
                                                class="sk-line sk-profit-value"
                                                :style="getSkeletonStyle()"
                                            ></view>
                                        </view>
                                    </view>

                                    <view class="card-footer">
                                        <view
                                            class="sk-line sk-update-time"
                                            :style="getSkeletonStyle()"
                                        ></view>
                                        <view
                                            class="sk-line sk-subscribe-btn"
                                            :style="getSkeletonStyle()"
                                        ></view>
                                    </view>
                                </view>
                            </view>
                        </template>

                        <!-- Actual Cards -->
                        <template v-else>
                            <view
                                class="ai-stock-card"
                                v-for="(item, index) in dataList"
                                :key="item.id"
                                @click="showSubscribeModal(item)"
                                :style="{ background: theme.backgroundCard }"
                            >
                                <view
                                    class="card-image-container"
                                    :style="{
                                        background:
                                            'linear-gradient(135deg, ' +
                                            theme.primary +
                                            ' 0%, ' +
                                            theme.secondary +
                                            ' 100%)',
                                    }"
                                >
                                    <u--image
                                        class="card-image"
                                        :src="item.image"
                                        width="100%"
                                        height="100%"
                                        mode="aspectFill"
                                        @error="handleImageError"
                                    >
                                        <template v-slot:loading>
                                            <u-loading-icon
                                                :color="theme.primary"
                                                size="40"
                                            ></u-loading-icon>
                                        </template>
                                    </u--image>
                                    <view
                                        class="status-badge"
                                        :class="
                                            item.status === '1'
                                                ? 'active'
                                                : 'inactive'
                                        "
                                    >
                                        <text class="status-text">{{
                                            item.status === "1"
                                                ? $t("ai_subscribe.active")
                                                : $t("ai_subscribe.inactive")
                                        }}</text>
                                    </view>
                                </view>

                                <view class="card-content">
                                    <view class="stock-info">
                                        <view class="stock-name-row">
                                            <text
                                                class="stock-name"
                                                :style="{
                                                    color: theme.textPrimary,
                                                }"
                                                >{{ item.name }}</text
                                            >
                                            <view
                                                v-if="item.type"
                                                class="type-badge"
                                                :style="{
                                                    background:
                                                        theme.primary__light,
                                                    color: theme.white,
                                                }"
                                                >{{ item.type }}</view
                                            >
                                        </view>
                                        <view class="profit-rate-container">
                                            <!-- <text
                                                class="profit-label"
                                                :style="{
                                                    color: theme.textPrimary,
                                                }"
                                                >{{
                                                    $t(
                                                        "ai_subscribe.profit_rate",
                                                    )
                                                }}</text
                                            > -->
                                            <text class="profit-value"
                                                >{{ item.profit_rate }}%</text
                                            >
                                        </view>
                                    </view>

                                    <view class="card-footer">
                                        <text
                                            class="update-time"
                                            :style="{
                                                color: theme.textPrimary,
                                            }"
                                            >{{ item.updatetime }}</text
                                        >
                                        <view
                                            class="subscribe-btn"
                                            :style="{
                                                background: theme.primary,
                                            }"
                                        >
                                            <text class="btn-text">{{
                                                $t("ai_subscribe.subscribe")
                                            }}</text>
                                            <u-icon
                                                name="arrow-right"
                                                size="14"
                                                color="#fff"
                                            ></u-icon>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </template>
                    </view>
                </view>
            </v-container>
        </z-paging>

        <!-- subscribe Popup -->
        <u-popup
            :show="subscribeShow"
            :round="20"
            mode="center"
            bgColor="transparent"
            @close="handleModalClose"
        >
            <view
                class="subscribe-modal"
                :style="{ background: theme.backgroundCard }"
            >
                <view
                    class="modal-header"
                    :style="{
                        borderBottom: '1rpx solid ' + theme.neutral__200,
                    }"
                >
                    <text
                        class="modal-title"
                        :style="{ color: theme.textPrimary }"
                        >{{ $t("ai_subscribe.subscribe_to") }}</text
                    >
                    <view class="close-btn" @click="handleModalClose">
                        <u-icon
                            name="close"
                            size="20"
                            :color="theme.textPrimary"
                        ></u-icon>
                    </view>
                </view>

                <view class="modal-content" v-if="selectedStock">
                    <view class="stock-preview">
                        <image
                            class="preview-image"
                            :src="selectedStock.image"
                            mode="aspectFill"
                        ></image>
                        <view class="preview-info">
                            <view class="preview-name-row">
                                <text
                                    class="preview-name"
                                    :style="{ color: theme.textPrimary }"
                                    >{{ selectedStock.name }}</text
                                >
                                <view
                                    v-if="selectedStock.type"
                                    class="type-badge"
                                    :style="{
                                        background: theme.primary__light,
                                        color: theme.white,
                                    }"
                                    >{{ selectedStock.type }}</view
                                >
                            </view>
                            <text class="preview-profit"
                                >{{ selectedStock.profit_rate }}%
                            </text>
                        </view>
                    </view>

                    <view class="subscription-details">
                        <view
                            class="detail-item"
                            :style="{
                                borderBottom:
                                    '1rpx solid ' + theme.neutral__200,
                            }"
                        >
                            <text
                                class="detail-label"
                                :style="{ color: theme.textPrimary }"
                                >{{
                                    $t("ai_subscribe.subscription_type")
                                }}</text
                            >
                            <text
                                class="detail-value"
                                :style="{ color: theme.textPrimary }"
                                >{{ $t("ai_subscribe.ai_analysis") }}</text
                            >
                        </view>
                        <view
                            class="detail-item"
                            :style="{
                                borderBottom:
                                    '1rpx solid ' + theme.neutral__200,
                            }"
                        >
                            <text
                                class="detail-label"
                                :style="{ color: theme.textPrimary }"
                                >{{ $t("ai_subscribe.updates") }}</text
                            >
                            <text
                                class="detail-value"
                                :style="{ color: theme.textPrimary }"
                                >{{
                                    $t("ai_subscribe.daily_recommendations")
                                }}</text
                            >
                        </view>
                        <view
                            class="detail-item"
                            :style="{
                                borderBottom:
                                    '1rpx solid ' + theme.neutral__200,
                            }"
                        >
                            <text
                                class="detail-label"
                                :style="{ color: theme.textPrimary }"
                                >{{ $t("ai_subscribe.status") }}</text
                            >
                            <text
                                class="detail-value"
                                :class="
                                    selectedStock.status === '1'
                                        ? 'active'
                                        : 'inactive'
                                "
                                :style="{
                                    color:
                                        selectedStock.status === '1'
                                            ? '#22c55e'
                                            : '#6b7280',
                                }"
                            >
                                {{
                                    selectedStock.status === "1"
                                        ? $t("ai_subscribe.active")
                                        : $t("ai_subscribe.inactive")
                                }}
                            </text>
                        </view>
                    </view>

                    <!-- Password Input (only show when is_pass = 1) -->
                    <view
                        v-if="selectedStock.is_pass == 1"
                        class="password-input-group"
                    >
                        <view
                            class="input-container"
                            :style="{ background: theme.backgroundTertiary }"
                        >
                            <view class="input-icon">
                                <u-icon
                                    name="lock"
                                    size="20"
                                    :color="theme.textPrimary"
                                ></u-icon>
                            </view>
                            <input
                                class="input-field"
                                type="text"
                                v-model="subscriptionPassword"
                                :placeholder="$t('ai_subscribe.enter_password')"
                                :password="showSubscriptionPassword"
                                placeholder-class="input-placeholder"
                                :style="{ color: theme.textPrimary }"
                            />
                            <view
                                class="password-toggle"
                                @click="
                                    showSubscriptionPassword =
                                        !showSubscriptionPassword
                                "
                            >
                                <u-icon
                                    :name="
                                        showSubscriptionPassword
                                            ? 'eye-off'
                                            : 'eye-fill'
                                    "
                                    size="20"
                                    :color="theme.neutral__400"
                                ></u-icon>
                            </view>
                        </view>
                    </view>

                    <view class="modal-actions">
                        <view
                            class="action-btn cancel-btn"
                            @click="handleModalClose"
                            :style="{ color: theme.textPrimary }"
                        >
                            <text class="btn-text">{{
                                $t("ai_subscribe.cancel")
                            }}</text>
                        </view>
                        <view
                            class="action-btn confirm-btn"
                            @click="confirmSubscription"
                            :style="{ background: theme.primary }"
                        >
                            <text class="btn-text">{{
                                $t("ai_subscribe.confirm_subscribe")
                            }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </u-popup>

        <home-return />
    </view>
</template>

<script>
export default {
    data() {
        return {
            statusBar: uni.getSystemInfoSync().statusBarHeight,
            subscribeShow: false,
            dataList: [],
            selectedStock: null,
            isLoading: false,
            flag: true,
            subscriptionPassword: "",
            showSubscriptionPassword: true,
        };
    },
    computed: {
        theme() {
            return this.$store.getters.theme;
        },
    },
    methods: {
        getSkeletonStyle() {
            return {
                background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 50%, ${this.theme.neutral__200} 75%)`,
            };
        },
        queryList(pageNo, pageSize) {
            // Show skeleton only on first page load
            if (pageNo === 1) {
                this.isLoading = true;
            }

            this.post("/stock_ai/index", {
                page: pageNo,
            })
                .then((res) => {
                    if (res.code === 1) {
                        this.$refs.paging.complete(res.data.data);
                    } else {
                        this.$refs.paging.complete([]);
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch AI stocks:", error);
                    this.$refs.paging.complete([]);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        showSubscribeModal(stock) {
            this.selectedStock = stock;
            this.subscriptionPassword = ""; // Reset password when opening modal
            this.subscribeShow = true;
        },
        confirmSubscription() {
            if (!this.flag) return;
            if (!this.selectedStock) return;

            // Validate password if is_pass = 1
            if (this.selectedStock.is_pass == 1) {
                if (
                    !this.subscriptionPassword ||
                    this.subscriptionPassword.trim() === ""
                ) {
                    uni.showToast({
                        title: this.$t("ai_subscribe.password_required"),
                        icon: "none",
                    });
                    return;
                }
            }

            // Call the AI subscription API
            this.flag = false;
            const requestData = {
                id: this.selectedStock.id,
            };

            // Include password if is_pass = 1
            if (this.selectedStock.is_pass == 1) {
                requestData.password = this.subscriptionPassword;
            }

            this.post("/stock_ai/ai_sub", requestData)
                .then((res) => {
                    this.flag = true;
                    if (res.code === 1) {
                        uni.showToast({
                            title: this.$t(
                                "ai_subscribe.subscription_successful",
                            ),
                            icon: "success",
                        });
                        this.subscribeShow = false;
                        this.subscriptionPassword = ""; // Clear password after success
                        // Navigate to subscribe page after successful subscription
                        setTimeout(() => {
                            this.router.push("/pages/AISubscribe/record");
                        }, 1500);
                    } else {
                        uni.showToast({
                            title:
                                res.msg ||
                                this.$t("ai_subscribe.subscription_failed"),
                            icon: "none",
                        });
                    }
                })
                .catch((err) => {
                    this.flag = true;
                    uni.showToast({
                        title: this.$t("ai_subscribe.network_error"),
                        icon: "none",
                    });
                });
        },
        handleImageError(e) {
            console.log("Image load error:", e);
        },
        handleModalClose() {
            this.subscribeShow = false;
            this.subscriptionPassword = ""; // Clear password when modal closes
        },
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.ai-stock-container {
    padding: 20rpx 0;

    .section-header {
        text-align: center;
        margin-bottom: 30rpx;

        .section-title {
            display: block;
            font-size: 36rpx;
            font-weight: bold;
            margin-bottom: 8rpx;
        }

        .section-subtitle {
            display: block;
            font-size: 24rpx;
            opacity: 0.7;
        }
    }

    .ai-stock-grid {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
    }

    .ai-stock-card {
        border-radius: 20rpx;
        overflow: hidden;
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;

        &:active {
            transform: scale(0.98);
        }

        .card-image-container {
            position: relative;
            height: 280rpx;
            overflow: hidden;

            .card-image {
                width: 100%;
                height: 100%;
            }

            .status-badge {
                position: absolute;
                top: 16rpx;
                right: 16rpx;
                padding: 8rpx 16rpx;
                border-radius: 20rpx;
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;

                &.active {
                    background: rgba(34, 197, 94, 0.9);
                    color: #fff;
                }

                &.inactive {
                    background: rgba(107, 114, 128, 0.9);
                    color: #fff;
                }

                .status-text {
                    font-size: 20rpx;
                    font-weight: 600;
                }
            }
        }

        .card-content {
            padding: 24rpx;

            .stock-info {
                margin-bottom: 20rpx;

                .stock-name-row {
                    display: flex;
                    align-items: center;
                    gap: 12rpx;
                    margin-bottom: 12rpx;
                    flex-wrap: wrap;
                }

                .stock-name {
                    font-size: 32rpx;
                    font-weight: bold;
                }

                .type-badge {
                    padding: 4rpx 12rpx;
                    border-radius: 4rpx;
                    font-size: 20rpx;
                    font-weight: 500;
                    white-space: nowrap;
                }

                .profit-rate-container {
                    display: flex;
                    align-items: center;
                    gap: 12rpx;

                    .profit-label {
                        font-size: 24rpx;
                        opacity: 0.7;
                    }

                    .profit-value {
                        font-size: 28rpx;
                        font-weight: bold;
                        color: #22c55e;
                        background: rgba(34, 197, 94, 0.1);
                        padding: 4rpx 12rpx;
                        border-radius: 12rpx;
                    }
                }
            }

            .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;

                .update-time {
                    font-size: 22rpx;
                    opacity: 0.6;
                }

                .subscribe-btn {
                    display: flex;
                    align-items: center;
                    gap: 8rpx;
                    color: #fff;
                    padding: 12rpx 20rpx;
                    border-radius: 20rpx;
                    transition: all 0.3s ease;

                    .btn-text {
                        font-size: 24rpx;
                        font-weight: 600;
                    }

                    &:active {
                        transform: scale(0.95);
                    }
                }
            }
        }
    }
}

.subscribe-modal {
    width: 600rpx;
    border-radius: 20rpx;
    backdrop-filter: blur(20px);
    overflow: hidden;

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24rpx;

        .modal-title {
            font-size: 32rpx;
            font-weight: bold;
        }

        .close-btn {
            width: 40rpx;
            height: 40rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;

            &:active {
                transform: scale(0.9);
            }
        }
    }

    .modal-content {
        padding: 24rpx;

        .stock-preview {
            display: flex;
            align-items: center;
            gap: 16rpx;
            margin-bottom: 24rpx;
            padding: 16rpx;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12rpx;

            .preview-image {
                width: 80rpx;
                height: 80rpx;
                border-radius: 12rpx;
            }

            .preview-info {
                flex: 1;

                .preview-name-row {
                    display: flex;
                    align-items: center;
                    gap: 12rpx;
                    margin-bottom: 4rpx;
                    flex-wrap: wrap;
                }

                .preview-name {
                    font-size: 28rpx;
                    font-weight: bold;
                }

                .preview-profit {
                    font-size: 22rpx;
                    color: #22c55e;
                }
            }
        }

        .subscription-details {
            margin-bottom: 24rpx;

            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12rpx 0;

                &:last-child {
                    border-bottom: none;
                }

                .detail-label {
                    font-size: 24rpx;
                    opacity: 0.7;
                }

                .detail-value {
                    font-size: 24rpx;
                    font-weight: 600;

                    &.active {
                        color: #22c55e;
                    }

                    &.inactive {
                        color: #6b7280;
                    }
                }
            }
        }

        .password-input-group {
            margin-bottom: 24rpx;

            .input-container {
                display: flex;
                align-items: center;
                padding: 16rpx 20rpx;
                border-radius: 12rpx;
                gap: 12rpx;

                .input-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .input-field {
                    flex: 1;
                    font-size: 28rpx;
                    line-height: 1.5;
                }

                .password-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rpx;
                    cursor: pointer;
                }
            }
        }

        .modal-actions {
            display: flex;
            gap: 16rpx;

            .action-btn {
                flex: 1;
                padding: 16rpx;
                border-radius: 12rpx;
                text-align: center;
                transition: all 0.3s ease;

                .btn-text {
                    font-size: 26rpx;
                    font-weight: 600;
                }

                &.cancel-btn {
                    background: rgba(255, 255, 255, 0.1);

                    &:active {
                        transform: scale(0.95);
                    }
                }

                &.confirm-btn {
                    color: #fff;

                    &:active {
                        transform: scale(0.95);
                    }
                }
            }
        }
    }
}

/* Skeleton Loading Styles */
.skeleton {
    position: relative;
    overflow: hidden;
    pointer-events: none;

    .sk-line {
        background-size: 200% 100%;
        animation: sk-shimmer 1.5s ease-in-out infinite;
        border-radius: 8rpx;
        display: block;
    }

    .skeleton-image {
        position: relative;
        height: 280rpx;

        .sk-image {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .sk-status-badge {
            position: absolute;
            top: 16rpx;
            right: 16rpx;
            width: 100rpx;
            height: 32rpx;
            border-radius: 20rpx;
        }
    }

    .sk-stock-name {
        width: 200rpx;
        height: 32rpx;
        margin-bottom: 12rpx;
    }

    .sk-type-badge {
        width: 80rpx;
        height: 24rpx;
        border-radius: 4rpx;
    }

    .sk-profit-label {
        width: 120rpx;
        height: 24rpx;
    }

    .sk-profit-value {
        width: 100rpx;
        height: 28rpx;
        border-radius: 12rpx;
    }

    .sk-update-time {
        width: 140rpx;
        height: 22rpx;
    }

    .sk-subscribe-btn {
        width: 120rpx;
        height: 44rpx;
        border-radius: 20rpx;
    }
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
