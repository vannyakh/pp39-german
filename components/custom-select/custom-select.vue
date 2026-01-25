<template>
    <view class="select-container">
        <!-- Main select box -->
        <view
                @tap="toggleDropdown"
                class="select-box"
                :style="{
                'z-index': isOpen ? 999 : 1,
                'background-color': backgroundColor || theme.backgroundCard,
                'border-color': theme.neutral__200
            }"
        >
            <!-- Selected value display -->
            <view class="select-header">
                <text class="font-24" :class="{'placeholder': !selectedLabel}"
                      :style="{ color: !selectedLabel ? theme.textTertiary : theme.textPrimary }">
                    {{ selectedLabel || placeholder }}
                </text>
                <view :class="['arrow-icon', {'arrow-rotate': isOpen}]">
                    <u-icon name="arrow-down" :color="txtcolor || theme.textTertiary" size="24"></u-icon>
                </view>
            </view>

            <!-- Options dropdown -->
            <view
                    v-if="isOpen"
                    class="dropdown-list"
                    :style="{
                        'background-color': backgroundColor || theme.backgroundCard,
                        'border-color': theme.neutral__200
                    }"
            >
                <!-- Empty state -->
                <view v-if="!processedOptions.length" class="empty-state">
                    <text class="empty-text" :style="{ color: theme.textTertiary }">{{ emptyText }}</text>
                </view>

                <!-- Options list -->
                <view
                        v-for="(option, index) in processedOptions"
                        :key="index"
                        @tap.stop="selectOption(option)"
                        :class="[
                        'option-item',
                        {'option-selected': isOptionSelected(option)}
                    ]"
                        :style="getOptionStyle(option)"
                >
                    <text :style="{ color: isOptionSelected(option) ? theme.primary__500 : theme.textPrimary }">
                        {{ getDisplayValue(option) }}
                    </text>
                </view>
            </view>
        </view>

        <!-- Backdrop -->
        <view
                v-if="isOpen"
                @tap="toggleDropdown"
                class="select-backdrop"
        ></view>
    </view>
</template>

<script>
export default {
    name: 'CustomSelect',

    props: {
        options: {
            type: [Array, Object],
            required: true,
            default: () => []
        },
        value: {
            type: [String, Number],
            required: true
        },
        backgroundColor: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Please select'
        },
        emptyText: {
            type: String,
            default: 'No data available'
        },
        id: {
            type: String,
            required: true
        },
        // Dynamic key props
        labelKey: {
            type: String,
            default: 'label'
        },
        valueKey: {
            type: String,
            default: 'value'
        },
        // For nested object keys
        objectLabelKey: {
            type: String,
            default: ''
        },
        objectValueKey: {
            type: String,
            default: ''
        },
        txtcolor: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            isOpen: false
        }
    },

    computed: {
        theme() {
            return this.$store.getters.theme
        },
        processedOptions() {
            if (!this.options) return []

            // Handle array of objects
            if (Array.isArray(this.options)) {
                return this.options.map(opt => {
                    if (typeof opt !== 'object') {
                        return {
                            [this.labelKey]: opt,
                            [this.valueKey]: opt
                        }
                    }
                    return opt
                })
            }

            // Handle object format
            return Object.entries(this.options).map(([key, value]) => {
                // Handle nested objects
                if (typeof value === 'object' && this.objectLabelKey) {
                    return {
                        [this.labelKey]: this.objectLabelKey.split('.').reduce((obj, key) => obj?.[key], value),
                        [this.valueKey]: this.objectValueKey ?
                            this.objectValueKey.split('.').reduce((obj, key) => obj?.[key], value) :
                            key
                    }
                }

                // Handle simple key-value pairs
                return {
                    [this.labelKey]: value,
                    [this.valueKey]: key
                }
            })
        },

        selectedLabel() {
            if (!this.value) return ''

            const selected = this.processedOptions.find(opt =>
                String(this.getOptionValue(opt)) === String(this.value)
            )
            return selected ? this.getDisplayValue(selected) : ''
        }
    },

    created() {
        uni.$on('select-opened', (openedId) => {
            if (openedId !== this.id && this.isOpen) {
                this.isOpen = false
            }
        })
    },

    beforeDestroy() {
        uni.$off('select-opened')
    },

    methods: {
        toggleDropdown() {
            if (!this.processedOptions.length) {
                uni.showToast({
                    title: this.emptyText,
                    icon: 'none'
                })
                return
            }

            if (!this.isOpen) {
                uni.$emit('select-opened', this.id)
            }
            this.isOpen = !this.isOpen
        },

        selectOption(option) {
            const value = this.getOptionValue(option)
            this.$emit('input', value)
            this.$emit('change', option)
            this.isOpen = false
        },

        getDisplayValue(option) {
            if (!option) return ''
            if (typeof option !== 'object') return option

            // Handle dynamic label key
            const value = this.getNestedValue(option, this.labelKey)
            return value ?? String(this.getOptionValue(option)) ?? ''
        },

        getOptionValue(option) {
            if (typeof option !== 'object') return option

            // Handle dynamic value key
            return this.getNestedValue(option, this.valueKey) ?? option
        },

        // Helper method to get nested object values
        getNestedValue(obj, path) {
            return path.split('.').reduce((value, key) => value?.[key], obj)
        },

        isOptionSelected(option) {
            return String(this.getOptionValue(option)) === String(this.value)
        },
        getOptionStyle(option) {
            if (this.isOptionSelected(option)) {
                return {
                    backgroundColor: this.getColorWithOpacity(this.theme.primary__500, 0.05)
                }
            }
            return {}
        },
        getOptionActiveStyle() {
            return {
                backgroundColor: this.getColorWithOpacity(this.theme.primary__500, 0.1)
            }
        },
        getColorWithOpacity(color, opacity) {
            if (color && color.startsWith('#')) {
                const hex = color.substring(1);
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
            return color;
        }
    }
}
</script>

<style lang="scss" scoped>
.select-container {
  position: relative;
  width: 100%;
  height: 80rpx;
}

.select-box {
  position: relative;
  width: 100%;
  height: 80rpx;
  border: 1px solid;
  border-radius: 4rpx;
}

.select-header {
  height: 100%;
  padding: 0 15rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.arrow-icon {
  transition: transform 0.3s;
}

.arrow-rotate {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  top: 80rpx;
  left: 0;
  width: 100%;
  max-height: 400rpx;
  overflow-y: auto;
  border: 1px solid;
  border-radius: 4rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.empty-state {
  padding: 30rpx;
  text-align: center;
}

.option-item {
  padding: 20rpx 15rpx;
  font-size: 24rpx;
  transition: background-color 0.2s;

  &:active {
    opacity: 0.8;
  }
}

.select-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  z-index: 998;
}
</style>
