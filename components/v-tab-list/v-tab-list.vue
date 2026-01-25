<template>
	<view class="tab-list" :style="containerStyle">
		<scroll-view
            scroll-x
            class="scroll-view"
            :scroll-left="scrollLeft"
            :show-scrollbar="false"
            enhanced
            :scroll-with-animation="true"
        >
			<view class="tab-container">
				<view
					v-for="(item, index) in list"
					:key="item.key"
					class="tab-item"
					:class="{ active: activeKey === item.key }"
					:style="activeKey === item.key ? activeTabStyle : tabItemStyle"
					@click="handleTabClick(item, index)"
                    :id="`tab-${item.key}`"
				>
					<text class="tab-text" :style="{ color: activeKey === item.key ? activeTextColor : inactiveTextColor }">{{ item.name }}</text>
					<view class="tab-line" v-if="activeKey === item.key" :style="lineStyle"></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"tab-list",
		props: {
			list: {
				type: Array,
				default: () => []
			},
			defaultActiveKey: {
				type: String,
				default: ''
			},
			activeColor: {
				type: String,
				default: 'var(--primary-500)'
			},
			backgroundColor: {
				type: String,
				default: 'var(--neutral-900)'
			},
			textColor: {
				type: String,
				default: 'var(--neutral-600)'
			},
			activeTextColor: {
				type: String,
				default: 'var(--light-color)'
			},
			hoverBackgroundColor: {
				type: String,
				default: 'rgba(255, 255, 255, 0.05)'
			},
			inactiveTextColor: {
				type: String,
				default: 'var(--neutral-400)'
			},
			lineColor: {
				type: String,
				default: 'var(--primary-500)'
			},
			borderColor: {
				type: String,
				default: 'var(--neutral-800)'
			},
			shadowColor: {
				type: String,
				default: 'rgba(0, 0, 0, 0.1)'
			},
			activeBackgroundColor: {
				type: String,
				default: 'rgba(229, 194, 132, 0.1)'
			},
			scrollbarColor: {
				type: String,
				default: 'var(--neutral-700)'
			},
			tabItemWidth: {
				type: String,
				default: 'full'
			},
			rounded: {
				type: String,
				default: 'normal'
			},
			fullWidth: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				activeKey: '',
				scrollLeft: 0
			};
		},
		created() {
			// Set default active key if provided, otherwise use first tab
			this.activeKey = this.defaultActiveKey || (this.list[0] && this.list[0].key)
		},
        mounted() {
            // Initial scroll to active tab
            this.$nextTick(() => {
                this.scrollToActiveTab()
            })
        },
		methods: {
			handleTabClick(item, index) {
				this.activeKey = item.key
				this.$emit('change', item)
				this.scrollToActiveTab(index)
			},
            scrollToActiveTab(index) {
                this.$nextTick(() => {
                    const query = uni.createSelectorQuery().in(this)
                    query.select(`#tab-${this.activeKey}`).boundingClientRect()
                    query.select('.scroll-view').boundingClientRect()
                    query.exec(([tab, scrollView]) => {
                        if (!tab || !scrollView) return

                        // Calculate center position for smooth centering
                        const centerPosition = tab.left - scrollView.left - (scrollView.width / 2) + (tab.width / 2)
                        const targetScrollLeft = Math.max(0, centerPosition)

                        // Smooth scroll with animation
                        this.scrollLeft = targetScrollLeft
                    })
                })
            },
            getBorderRadius() {
                switch(this.rounded) {
                    case 'none':
                        return '0'
                    case 'small':
                        return 'var(--radius-sm)'
                    case 'normal':
                        return 'var(--radius-md)'
                    case 'large':
                        return 'var(--radius-lg)'
                    case 'full':
                        return 'var(--radius-full)'
                    default:
                        return 'var(--radius-md)'
                }
            }
		},
		computed: {
			containerStyle() {
				const borderRadius = this.getBorderRadius()
				return {
					backgroundColor: this.backgroundColor,
					borderColor: this.borderColor,
					borderRadius: borderRadius,
					width: this.fullWidth ? '100%' : 'auto'
				}
			},
			tabItemStyle() {
				return {
					color: this.inactiveTextColor,
					backgroundColor: 'transparent',
					width: this.tabItemWidth !== 'full' ? this.tabItemWidth : undefined,
					flex: this.tabItemWidth === 'full' ? '1' : undefined
				}
			},
			activeTabStyle() {
				return {
					color: this.activeTextColor,
					backgroundColor: this.activeBackgroundColor,
					width: this.tabItemWidth !== 'full' ? this.tabItemWidth : undefined,
					flex: this.tabItemWidth === 'full' ? '1' : undefined
				}
			},
			lineStyle() {
				return {
					backgroundColor: this.lineColor,
					boxShadow: `0 0 8rpx ${this.shadowColor}`
				}
			},
			hoverStyle() {
				return {
					backgroundColor: this.hoverBackgroundColor
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.tab-list {
	position: relative;
	transition: all 0.3s ease;
    overflow: hidden;

	.scroll-view {
		width: 100%;
		white-space: nowrap;
        padding: 0 var(--spacing-sm);
        box-sizing: border-box;
        scroll-behavior: smooth;
        transition: scroll-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &::-webkit-scrollbar {
            display: none;
        }
	}

	.tab-container {
		display: inline-flex;
		position: relative;
		padding: var(--spacing-xs) 0;
        gap: var(--spacing-xs);
        justify-content: space-between;
        align-items: center;
        width: 100%;
	}

	.tab-item {
		position: relative;
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 var(--spacing-md);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: var(--radius-full);
		cursor: pointer;

		.tab-text {
			font-size: var(--font-size-sm);
			transition: all 0.3s ease;
            font-weight: 500;
            white-space: nowrap;
		}

		.tab-line {
			position: absolute;
			bottom: 6rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 24rpx;
			height: 4rpx;
			border-radius: var(--radius-full);
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		}

		&.active {
			.tab-text {
				font-weight: 600;
				transform: scale(1.02);
			}

            .tab-line {
                width: 32rpx;
            }
		}

		&:hover {
			transform: scale(1.02);
		}

        &:active {
            transform: scale(0.96);
        }
	}
}
</style>
