<template>
    <view class="min-height-screen" :style="{background: theme.backgroundSecondary}">
        <z-paging :language="$t('locale')" ref="paging" v-model="dataList" @query="queryList" :pageSize="20">
            <app-nav slot="top" :title="$t('loan.record_title')" blur></app-nav>

            <v-container size="md">
                <!-- Loading Skeleton -->
                <template v-if="loading">
                    <view class="loan-record-card" :style="{background: theme.backgroundCard}"
                          v-for="n in 3" :key="'skeleton-loan-' + n">
                        <view class="record-header" :style="{ borderBottomColor: theme.neutral__200 }">
                            <view class="skeleton-line skeleton-amount" :style="getSkeletonStyle()"></view>
                            <view class="skeleton-line skeleton-status" :style="getSkeletonStyle()"></view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
                                <view class="skeleton-line skeleton-value" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="detail-row">
                                <view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
                                <view class="skeleton-line skeleton-value" :style="getSkeletonStyle()"></view>
                            </view>
                            <view class="detail-row">
                                <view class="skeleton-line skeleton-label" :style="getSkeletonStyle()"></view>
                                <view class="skeleton-line skeleton-value" :style="getSkeletonStyle()"></view>
                            </view>
                        </view>
                    </view>
                </template>

                <!-- Actual Data -->
                <template v-else>
                    <view class="loan-record-card" :style="{background: theme.backgroundCard}"
                          v-for="(item, index) in dataList" :key="'loan-record-' + (item.id || index)">

                        <!-- Record Header -->
                        <view class="record-header" :style="{ borderBottomColor: theme.neutral__200 }">
                            <view class="amount-section">
                                <text class="amount-label" :style="{ color: theme.textTertiary }">{{ $t('loan.loan_amount') }}</text>
                                <text class="amount-value" :style="{ color: theme.textPrimary }">${{ item.num }}</text>
                            </view>
                            <view class="status-section">
                                <view class="status-badge" :class="getStatusClass(item.status)" :style="getStatusStyle(item.status)">
                                    {{ getStatusText(item.status) }}
                                </view>
                            </view>
                        </view>

                        <!-- Record Details -->
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('loan.loan_id') }}</text>
                                <text class="detail-value" :style="{ color: theme.textPrimary }">#{{ item.id }}</text>
                            </view>

                            <view class="detail-row">
                                <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('loan.period') }}</text>
                                <text class="detail-value" :style="{ color: theme.textPrimary }">{{ item.period }} {{ $t('loan.days') }}</text>
                            </view>

                            <view class="detail-row">
                                <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('loan.daily_interest_rate') }}</text>
                                <text class="detail-value" :style="{ color: theme.primary }">{{ formatPercentage(item.daily_rate) }}</text>
                            </view>

                            <view class="detail-row">
                                <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('loan.daily_interest_amount') }}</text>
                                <text class="detail-value" :style="{ color: theme.textPrimary }">${{ formatAmount(item.daily_rate_num) }}</text>
                            </view>

                            <view v-if="item.re_pay && parseFloat(item.re_pay) > 0" class="detail-row">
                                <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('loan.remaining_payment') }}</text>
                                <text class="detail-value" :style="{ color: theme.danger }">${{ formatAmount(item.re_pay) }}</text>
                            </view>

                            <view class="detail-row">
                                <text class="detail-label" :style="{ color: theme.textTertiary }">{{ $t('loan.application_date') }}</text>
                                <text class="detail-value" :style="{ color: theme.textPrimary }">{{ item.createtime }}</text>
                            </view>
                        </view>

                        <!-- Action Buttons -->
                        <view class="record-actions" :style="{ borderTopColor: theme.neutral__200 }">
                            <button class="action-button primary" :style="getButtonStyle()" @click="contactService(item)">
                                {{ $t('loan.contact_service') }}
                            </button>
                        </view>
                    </view>
                </template>
            </v-container>
        </z-paging>
    </view>
</template>

<script>
export default {
    data() {
        return {
            dataList: [],
            loading: false
        }
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        }
    },

    methods: {
        queryList(pageNo, pageSize) {
            this.loading = true;

            this.post('/my/record_loan', {
                page: pageNo,
                pageSize: pageSize
            }).then(res => {
                if (res.code === 1) {
                    this.$refs.paging.complete(res.data.data);
                } else {
                    this.$refs.paging.complete([]);
                    uni.showToast({
                        title: res.msg || this.$t('loan.load_failed'),
                        icon: 'none'
                    });
                }
            }).catch(error => {
                console.error('Loan record error:', error);
                this.$refs.paging.complete([]);
                uni.showToast({
                    title: this.$t('loan.load_failed'),
                    icon: 'none'
                });
            }).finally(() => {
                this.loading = false;
            });
        },

        getStatusClass(status) {
            const statusClasses = {
                "0": 'status-pending',    // Pending
                "1": 'status-approved',   // Approved
                "2": 'status-active',     // Active/Repaying
                "3": 'status-completed',  // Completed
                "4": 'status-paid',      // Already Paid
                "5": 'status-overdue'     // Overdue
            };
            return statusClasses[status] || 'status-pending';
        },

        getStatusText(status) {
            const statusTexts = {
                "0": this.$t('loan.status.pending'),
                "1": this.$t('loan.status.approved'),
                "2": this.$t('loan.status.active'),
                "3": this.$t('loan.status.completed'),
                "4": this.$t('loan.status.already_paid'),
                "5": this.$t('loan.status.overdue')
            };
            return statusTexts[status] || this.$t('loan.status.pending');
        },

        contactService(item) {
            // Navigate to service chat
            uni.navigateTo({
                url: `/pages/index/service/index?loan_id=${item.id}`
            });
        },
        getSkeletonStyle() {
            return {
                background: `linear-gradient(90deg, ${this.theme.neutral__200} 25%, ${this.theme.neutral__300} 50%, ${this.theme.neutral__200} 75%)`
            }
        },
        getStatusStyle(status) {
            const statusStyles = {
                "0": { background: this.theme.warning__50, color: this.theme.warning__700 },    // Pending
                "1": { background: this.theme.success__50, color: this.theme.success__700 },   // Approved
                "2": { background: this.theme.info__50, color: this.theme.info__700 },     // Active/Repaying
                "3": { background: this.theme.info__100, color: this.theme.info__800 },  // Completed
                "4": { background: this.theme.success__50, color: this.theme.success__700 },   // Already Paid
                "5": { background: this.theme.danger__100, color: this.theme.danger__800 }     // Overdue
            };
            return statusStyles[status] || statusStyles["0"];
        },
        getButtonStyle() {
            return {
                background: `linear-gradient(135deg, ${this.theme.primary__300} 0%, ${this.theme.primary__500} 100%)`,
                color: this.theme.white
            }
        },

        formatAmount(amount) {
            if (!amount && amount !== 0) return '0.00'
            const num = parseFloat(amount)
            return isNaN(num) ? '0.00' : num.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        },

        formatPercentage(rate) {
            if (!rate && rate !== 0) return '0.00%'
            const num = parseFloat(rate)
            return isNaN(num) ? '0.00%' : (num * 100).toFixed(2) + '%'
        }
    }
}
</script>

<style lang="scss" scoped>
.loan-record-card {
  margin-bottom: 24rpx;
  border-radius: 24rpx;
  padding: 32rpx;
  transition: all 0.3s ease;

  &:active {
    transform: translateY(2rpx);
  }
}

/* Record Header */
.record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid;
}

.amount-section {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.amount-label {
  font-size: 24rpx;
  font-weight: 500;
}

.amount-value {
  font-size: 36rpx;
  font-weight: bold;
}

.status-section {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 600;
  text-align: center;
  min-width: 120rpx;
}

/* Record Details */
.record-details {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 26rpx;
  font-weight: 500;
}

.detail-value {
  font-size: 26rpx;
  font-weight: 600;
}

/* Action Buttons */
.record-actions {
  display: flex;
  gap: 16rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid;
}

.action-button {
  flex: 1;
  height: 72rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:active {
    transform: translateY(2rpx);
  }
}



/* Skeleton Loading Styles */
.skeleton-line {
  border-radius: 4rpx;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  background-size: 200% 100%;
}

.skeleton-amount {
  width: 120rpx;
  height: 36rpx;
  margin-bottom: 8rpx;
}

.skeleton-status {
  width: 100rpx;
  height: 32rpx;
}

.skeleton-label {
  width: 80rpx;
  height: 26rpx;
}

.skeleton-value {
  width: 100rpx;
  height: 26rpx;
}

@keyframes skeleton-pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 750rpx) {
  .record-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}
</style>
