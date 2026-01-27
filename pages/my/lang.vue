<template>
	<view class="lang-page" :style="{background: theme.backgroundPrimary}">
        <bg-animate-shape/>

		<app-nav blur :title="$t('changelang')"></app-nav>

		<v-container size="md">
			<!-- Language List -->
			<view class="lang-list">
				<view
					@click="radioChange(item.language)"
					v-for="(item, index) in dataList"
					:key="index"
					class="lang-item"
					:class="{ 'lang-item--active': currentLanguage === item.language }"
					:style="getLangItemStyle(item.language)"
				>
					<view class="lang-content">
						<image class="lang-flag" :src="item.imgUrl" mode="aspectFit"></image>
						<text class="lang-name" :style="getLangNameStyle(item.language)">{{ item.value }}</text>
					</view>
					<view class="lang-check">
						<text class="check-icon" v-if="currentLanguage === item.language" :style="getCheckIconStyle()">✓</text>
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
				currentLanguage: '',
				dataList: [
					{
						imgUrl: '/static/locale/logo/en.png',
						value: 'English',
						language: 'en',
						description: 'English (United States)'
					},
					// {
					// 	imgUrl: '/static/locale/logo/zh.png',
					// 	value: '中文简体',
					// 	language: 'zh-Hans',
					// 	description: '简体中文'
					// },
					// {
					// 	imgUrl: '/static/locale/logo/india.png',
					// 	value: 'भारत',
					// 	language: 'ind',
					// 	description: 'हिन्दी'
					// },
					// {
					// 	imgUrl: '/static/locale/logo/Malay.png',
					// 	value: 'Malaysia',
					// 	language: 'ms',
					// 	description: 'Bahasa Melayu'
					// },
					{
						imgUrl: '/static/locale/logo/fr.png',
						value: 'Français',
						language: 'fr',
						description: 'Français (France)'
					},
					{
						imgUrl: '/static/locale/logo/de.png',
						value: 'Deutschland',
						language: 'de-DE',
						description: 'Deutschland (Germany)'
					}
				],
			};
		},
		onShow() {
			// Get current language from storage or default to en
			const savedLanguage = uni.getStorageSync('language');
			this.currentLanguage = savedLanguage;
			this.$i18n.locale = savedLanguage;
            uni.setLocale(savedLanguage)
		},
        computed: {
            theme() {
                return this.$store.getters.theme
            }
        },
		methods: {
			radioChange(language) {
				// Don't change if it's the same language
				if (this.currentLanguage === language) {
					return;
				}

				// Update current language
				this.currentLanguage = language;

				// Update i18n locale
				this.$i18n.locale = language;

				// Save to storage
				uni.setStorageSync('language', language);
                uni.setStorageSync('UNI_LOCALE', language);
                uni.setLocale(language)
                //uni.getLocale(language)


				// Show success feedback
				uni.showToast({
					title: this.$t('languageChanged') || 'Language changed successfully',
					icon: 'success',
					duration: 1500
				});

				// Navigate back after a short delay
				setTimeout(() => {
					uni.navigateBack();
				}, 500);
			},
			getLangItemStyle(language) {
				const isActive = this.currentLanguage === language
				const style = {
					borderBottom: isActive
						? `2rpx dashed ${this.theme.primary__500}`
						: `2rpx dashed ${this.theme.neutral__200}`
				}
				return style
			},
			getLangNameStyle(language) {
				const isActive = this.currentLanguage === language
				return {
					color: isActive ? this.theme.primary__500 : this.theme.textPrimary
				}
			},
			getCheckIconStyle() {
				return {
					color: this.theme.primary__500
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.lang-page {
		min-height: 100vh;
	}

	// Language List
	.lang-list {
		margin-top: 32rpx;
	}

	.lang-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 0;
		transition: all 0.2s ease;

		&:last-child {
			border-bottom: none !important;
		}

		&:active {
			background-color: transparent;
			opacity: 0.7;
		}
	}

	.lang-content {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.lang-flag {
		width: 60rpx;
		height: 60rpx;
		border-radius: 8rpx;
		margin-right: 32rpx;
	}

	.lang-name {
		font-size: 28rpx;
		line-height: 1.5;
	}

	.lang-check {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.check-icon {
		font-size: 32rpx;
		font-weight: bold;
	}
</style>
