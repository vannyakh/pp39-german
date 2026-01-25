<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
		<bg-animate-shape/>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
			<app-nav slot="top" title="Record"></app-nav>

			<view class="listBox" v-for="(item,index) in list" :key="index" :style="getListBoxStyle()">

			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading:true,
				list: []
			};
		},
        computed: {
            theme() {
                return this.$store.getters.theme
            }
        },
		methods: {
			queryList(pageNo, pageSize) {
				//console.log('刷新数据')
				setTimeout(()=>{
					this.loading = false
					this.$refs.paging.complete([{},{},{},{},{}]);
				},500)
				// this.post('index/all_store', {
				// 	page: pageNo,
				// }).then(res => {
				// 	if (res.code == 1) {
				// 		//console.log('数据', res)
				// 		this.$refs.paging.complete(res.data.data);
				// 	}
				// })
			},
			getListBoxStyle() {
				return {
					background: this.theme.backgroundCard,
					boxShadow: `0rpx 32rpx 64rpx 1rpx ${this.getColorWithOpacity('#8C8896', 0.13)}`
				}
			},
			getColorWithOpacity(color, opacity) {
				if (!color) return 'transparent'
				if (color.startsWith('#')) {
					const r = parseInt(color.slice(1, 3), 16)
					const g = parseInt(color.slice(3, 5), 16)
					const b = parseInt(color.slice(5, 7), 16)
					return `rgba(${r}, ${g}, ${b}, ${opacity})`
				}
				if (color.startsWith('rgb')) {
					return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)
				}
				return color
			},
		}
	}
</script>

<style lang="scss" scoped>
	.min-height-screen {
		min-height: 100vh;
	}

	.listBox {
		width: 670rpx;
		height: 233rpx;
		margin: 18rpx auto;
		padding: 0 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
