<template>
	<view>
		<view class="relative" :style="{ height: `calc(${statusBar}px + ${height}px)` }">
			<view class="width-100b fixed1"
				:style="{ height: `calc(${statusBar}px + ${height}px)`, background: background }">
				<view class="width-100b flex align-center fixed1 justify-center padding-w-88 text-center"
					:style="{ paddingTop: statusBar + 'px', height: `calc(${statusBar}px + 50px)` }">
					<text class="midetitle" :style="{ color: color }">{{ title }}</text>
					<i @click="goBack" v-if="black" class="cuIcon-back font-36" style="position: absolute;left: 30rpx;"
						:style="{ color: blackColor }"></i>
					<image @tap="Jump" v-if="isRight" style="position: absolute;right: 30rpx;"
						:style="'width:' + rightWidth + 'rpx;height:' + rightHeight + 'rpx'" :src="righturl" />
					<text @tap='Jump' v-if="isRightext" class="font-30 weight-bold" :style="{ color: rightextColor }"
						style="position: absolute;right: 30rpx;">{{ rightText }}</text>
					<text @tap='tolang()' v-if="showLang" class="font-30 weight-bold" :style="{ color: langColor }"
						style="position: absolute;right: 30rpx;">{{ $t('language') }}</text>
					<slot name="left"></slot>
					<slot name="right"></slot>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
export default {
	props: {
		//标题
		title: {
			type: String
		},
		height: {
			type: String,
			default: '50'
		},
		// 标题字体颜色
		color: {
			type: String,
			default: '#000'
		},
		// 返回图标颜色
		blackColor: {
			type: String,
			default: '#000'
		},
		// 右侧文字颜色
		rightextColor: {
			type: String,
			default: '#333333'
		},
		// 是否有右侧图片
		isRight: {
			type: Boolean,
			default: false
		},
		// 是否有右侧文字
		isRightext: {
			type: Boolean,
			default: false
		},
		// 右侧文字内容
		rightText: {
			type: String,
			default: '设置'
		},
		// 右侧图片路径
		righturl: {
			type: String,
			default: '/static/logo.png'
		},
		// 宽度
		rightWidth: {
			type: String,
			default: '38'
		},
		// 高度
		rightHeight: {
			type: String,
			default: '38'
		},
		// 导航背景色
		background: {
			type: String,
			default: '#fff'
		},
		isGoback: {
			type: Boolean,
			default: true
		},
		black: {
			type: Boolean,
			default: true
		},
		langColor: {
			type: String,
			default: '#fff'
		},
		showLang: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			statusBar: uni.getSystemInfoSync().statusBarHeight,
		}
	},
	methods: {
		Jump() {
			this.$emit('Jump')
		},
		tolang() {
			uni.navigateTo({
				url: '/pages/my/lang'
			})
		},
		goBack() {
			if (!this.isGoback) {
				uni.switchTab({
					url: '/pages/index/index'
				})
			} else {
				this.router.goBack()
			}
		}
	}
}
</script>

<style scoped>
.fixed1 {
	position: fixed;
	top: 0;
	z-index: 900;
}

.relative {
	position: relative;
}

.midetitle {
	font-size: 16px;
	font-weight: 700;
}
</style>
