<template>
	<view class="search-view" :style="{background: theme.backgroundPrimary}">
        <bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList">
			<!-- Search Header -->
			<view slot="top" class="search-header" :style="{background: theme.backgroundCard}">
				<view class="search-container">
					<text class="cuIcon cuIcon-back back-button" @click="router.goBack()" :style="{color: theme.textTertiary}"></text>
					<view class="search-input-container" :style="getSearchInputContainerStyle()">
						<text class="cuIcon cuIcon-search search-icon" :style="{color: theme.textTertiary}"></text>
						<input
							@confirm="direct()"
							@input="onSearchInput"
							:focus="true"
							class="search-input"
							type="text"
							v-model="keyword"
							:placeholder="$t('index1')"
							placeholder-class="search-placeholder"
							:style="{color: theme.textPrimary}"
						/>
						<view @click="direct" class="search-button" :style="getSearchButtonStyle()">
							<text class="search-button-text" :style="{color: theme.primary__500}">{{$t('index8')}}</text>
						</view>
					</view>
				</view>
			</view>


			<v-container slot="top" size="md">
                <!-- Table Headers -->
                <view class="table-headers" :style="{background: theme.backgroundCard, borderColor: theme.neutral__200}">
                    <view class="header-cell header-name" :style="{color: theme.textTertiary}">
                        {{$t('index10')}}
                    </view>
                    <view class="header-cell header-price" :style="{color: theme.textTertiary}">
                        {{$t('index11')}}
                    </view>
                    <view class="header-cell header-change" :style="{color: theme.textTertiary}">
                        {{$t('index12')}}
                    </view>
                    <view class="header-cell header-rise-fall" :style="{color: theme.textTertiary}">
                        {{$t('index13')}}
                    </view>
                </view>
            </v-container>

			<v-container size="md">
                <!-- Loading State -->
                <view v-if="isSearching && list.length === 0" class="loading-container">
                    <view class="loading-spinner" :style="getLoadingSpinnerStyle()"></view>
                    <text class="loading-text" :style="{color: theme.textTertiary}">
                        {{keyword.trim() ? ($t('common.searching') || 'Searching...') : ($t('common.loading') || 'Loading stocks...')}}
                    </text>
                </view>

                <!-- Empty State (only show when searching with keyword but no results) -->
                <view v-else-if="!isSearching && list.length === 0 && keyword.trim()" class="empty-container">
                    <text class="cuIcon cuIcon-search empty-icon" :style="{color: theme.textTertiary}"></text>
                    <text class="empty-text" :style="{color: theme.textTertiary}">{{$t('common.no_results') || 'No results found'}}</text>
                    <text class="empty-subtext" :style="{color: theme.textTertiary}">{{$t('common.try_different_keywords') || 'Try different keywords'}}</text>
                </view>

                <!-- Search Results -->
                <template v-else>
                    <search-list-item
                            v-for="(item, index) in list"
                            :key="index"
                            :item="item"
                            @item-click="handleItemClick"
                    />
                </template>
            </v-container>

		</z-paging>
	</view>
</template>

<script>
	import SearchListItem from './components/search-list/search-list.vue'

	export default {
		components: {
			SearchListItem
		},
		data() {
			return {
				statusBar: uni.getSystemInfoSync().statusBarHeight,
				list: [],
				keyword: '',
				isSearching: false,
				searchTimer: null,
			};
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		onLoad() {
			// Page loaded, but components not ready yet
		},

		onReady() {
			// Components are ready, now we can load initial data
			this.loadInitialData();
		},
		methods: {
			// Load initial data when page first loads
			loadInitialData() {
				// Check if paging component is ready
				if (this.$refs.paging) {
					this.isSearching = true;
					this.$refs.paging.reload();
				} else {
					// If not ready, try again after a short delay
					setTimeout(() => {
						this.loadInitialData();
					}, 100);
				}
			},

			// Debounced search input handler
			onSearchInput() {
				// Clear existing timer
				if (this.searchTimer) {
					clearTimeout(this.searchTimer);
				}

				// Set new timer for debounced search
				this.searchTimer = setTimeout(() => {
					this.direct();
				}, 500); // 500ms delay
			},

			direct() {
				this.isSearching = true;
				this.$refs.paging.reload();
			},

			queryList(pageNo, pageSize) {
				// If no keyword, load initial/popular stocks
				if (!this.keyword.trim()) {
					console.log('Loading initial data, Page:', pageNo);

					this.post('/shares/search_list', {
						search: '', // Empty search to get initial data
						page: pageNo,
					}, true).then(res => {
						this.isSearching = false;
						console.log('Initial data response:', res);
						if (res.code == 1) {
							this.$refs.paging.complete(res.data.data);
						} else {
							this.$refs.paging.complete([]);
						}
					}).catch(err => {
						this.isSearching = false;
						this.$refs.paging.complete([]);
						console.error('Initial data error:', err);
					});
					return;
				}

				// Search with keyword
				console.log('Searching for:', this.keyword.trim(), 'Page:', pageNo);

				this.post('/shares/search_list', {
					search: this.keyword.trim(),
					page: pageNo,
				}, true).then(res => {
					this.isSearching = false;
					console.log('Search response:', res);
					if (res.code == 1) {
						this.$refs.paging.complete(res.data.data);
					} else {
						this.$refs.paging.complete([]);
					}
				}).catch(err => {
					this.isSearching = false;
					this.$refs.paging.complete([]);
					console.error('Search error:', err);
				});
			},

			handleItemClick(item) {
				this.router.push('/pages/quotation/details?id=' + item.id);
			},
			getSearchInputContainerStyle() {
				return {
					background: this.theme.backgroundTertiary,
					borderColor: 'transparent'
				}
			},
			getSearchButtonStyle() {
				return {
					borderLeftColor: this.theme.primary__500
				}
			},
			getLoadingSpinnerStyle() {
				return {
					borderColor: this.theme.neutral__200,
					borderLeftColor: this.theme.primary__500
				}
			}
		},

		// Cleanup timer on component destroy
		beforeDestroy() {
			if (this.searchTimer) {
				clearTimeout(this.searchTimer);
			}
		}
	}
</script>

<style lang="scss" scoped>
.search-view {
	min-height: 100vh;
}

/* Search Header */
.search-header {
	width: 100%;
	padding: 0 32rpx;
	position: sticky;
	top: 0;
	z-index: 100;
}

.search-container {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 16rpx 0;
	gap: 24rpx;
}

.back-button {
	padding: 8rpx;
	border-radius: 8rpx;
	transition: all 0.3s ease;
	font-size: 44rpx;

	&:active {
		opacity: 0.8;
	}
}

.search-input-container {
	flex: 1;
	height: 72rpx;
	border-radius: 36rpx;
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	gap: 16rpx;
    border: 1rpx solid transparent;
	transition: all 0.3s ease;
}

.search-icon {
	font-size: 36rpx;
}

.search-input {
	flex: 1;
	height: 100%;
	font-size: 28rpx;
	background: transparent;
	border: none;
	outline: none;
}

.search-input::placeholder {
	color: inherit;
	opacity: 0.6;
}

.search-button {
	height: 48rpx;
	padding: 0 20rpx;
	border-left: 1rpx solid;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.3s ease;

	&:active {
		opacity: 0.8;
	}
}

.search-button-text {
	font-size: 24rpx;
	font-weight: 500;
}

.search-placeholder {
	color: inherit;
	opacity: 0.6;
	font-size: 24rpx;
}

/* Table Headers */
.table-headers {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 80rpx;
	margin: 16rpx 0;
	padding: 0 32rpx;
	border-radius: 16rpx;
	border: 1rpx solid;
}

.header-cell {
	flex: 1;
	font-size: 24rpx;
	font-weight: 600;
	text-align: center;

	&.header-name {
		text-align: left;
	}

	&.header-rise-fall {
		text-align: right;
	}
}

/* Loading State */
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 32rpx;
	gap: 24rpx;
}

.loading-spinner {
	width: 60rpx;
	height: 60rpx;
	border: 4rpx solid;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

.loading-text {
	font-size: 28rpx;
	font-weight: 500;
}

/* Empty State */
.empty-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 32rpx;
	gap: 16rpx;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 16rpx;
}

.empty-text {
	font-size: 32rpx;
	font-weight: 600;
	text-align: center;
}

.empty-subtext {
	font-size: 24rpx;
	text-align: center;
	line-height: 1.5;
}

</style>


