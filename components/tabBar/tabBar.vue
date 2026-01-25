<template>
	<view class="tab-block">
		<ul class='tab-list flex flex-center' :class="showMiddleButton === true?'tab-list-middle': 'tab-list-default'">
			<li v-for="(item, index) in tabList" :class="'list-item flex flex-column flex-middle ' + item.middleClass"
				@click="handlePush(item, index)" :key="index">
				<view class="item-img-box">
					<image class="item-img" :src="tabIndex == index ? item. selectedIconPath : item.iconPath" />
				</view>
				<view :class="tabIndex == index ? 'color-036a5' : 'color-a29ea4'" class="item-text font-20 color-black">
					{{item.text}}
				</view>
			</li>
		</ul>
		<view class="tab-bar" v-show="showTabBar === true"></view>
	</view>
</template>
<script>
	export default {
		props: {
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				showMiddleButton: false,
				showTabBar: true,
				tabList: [{ 
						iconPath: '/static/tabs/home.png',
						selectedIconPath: '/static/tabs/home_active.png',
						text: 'Home',
						pagePath: '/pages/index/index',
						middleClass: ''
					},
					{
						iconPath: '/static/tabs/quotation.png',
						selectedIconPath: '/static/tabs/quotation_active.png',
						text: 'Quotation',
						pagePath: '/pages/quotation/index',
						middleClass: ''
					},
					{
						iconPath: '/static/tabs/position.png',
						selectedIconPath: '/static/tabs/position_active.png',
						pagePath: '/pages/chicang/index',
						middleClass: ''
					},
					{
						iconPath: '/static/tabs/news.png',
						selectedIconPath: '/static/tabs/news_active.png',
						text: 'News',
						pagePath: '/pages/news/index',
						middleClass: ''
					},
					{
						iconPath: '/static/tabs/mine.png',
						selectedIconPath: '/static/tabs/mine_active.png',
						text: 'Me',
						pagePath: '/pages/my/index',
						middleClass: ''
					}
				]
			}
		},
		computed: {
			getHeight() {
				return Number(this.height);
			}
		},
		mounted() {
			this.getSystemInfo();
			this.setTabBar();
		},
		methods: {
			setTabBar() {
				let tabLength = this.tabList.length
				if (tabLength % 2) {
					this.showMiddleButton = true
					let middleIndex = Math.floor(tabLength / 2)
					this.tabList[middleIndex].middleClass = 'mid-button'
				}
			},
			handlePush(item, index) {
				if (this.tabIndex !== index) {
					uni.reLaunch({
						url: `${item.pagePath}? tabIndex =${index}`,
					})
				}
			},
			getSystemInfo() {
				uni.getSystemInfo({
					success: (res) => {
						if (res.safeArea.top > 20) {
							this.showTabBar = true
						}
					}
				})
			}
		}
	}
</script>
<style lang="scss">
	.flex {
		display: flex;
		flex-flow: row wrap;
	}

	.flex-center {
		align-items: center;
		justify-content: center;
	}

	.flex-column {
		flex-direction: column;
	}

	.flex-middle {
		align-items: center;
	}

	.font-20 {
		font-size: 20rpx;
	}

	.tab-block {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 999;
		background-size: contain;
		width: 100vw;

		.tab-list {
			height: 100rpx;
			padding: 0; //解决偏移
		}

		.tab-list-default {
			background-color: #FFFFFF;
			border-top: 1px #dddddd solid;
		}

		.tab-list-middle {
			position: relative;
			background-color: #f7f7f9;
		
		}

		.list-item {
			flex: 1;

			.item-img-box {
				width: 44rpx;
				height: 42rpx;
				margin-bottom: 9rpx;
				position: relative;
			}

			.item-img {
				width: 44rpx;
				height: 42rpx;
			}
		}

		.mid-button {
			position: relative;

			.item-img-box {
				width: 136rpx;
				height: 136rpx;
				margin-bottom: 9rpx;
				position: absolute;
				z-index: 1002;
				top: -104rpx;
			}

			.item-img {
				width: 136rpx;
				height: 136rpx;
			}

			.item-text {
				font-size: 20rpx;
				position: absolute;
				Z-index: 1002;
				bottom: -40rpx;
			}

		}

		.tab-bar {
			height: 25rpx;
			// background-color: red;
			background-color: #f7f7f9;
		}


	}
</style>