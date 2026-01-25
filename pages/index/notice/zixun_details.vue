<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<app-nav blur :title="$t('index32')"></app-nav>

		<view class="padding-32">
			<view class="font-36 weight-bold" :style="{color: theme.textPrimary}">{{obj.title}}</view>
			<view class="font-24 margin-c-24" :style="{color: theme.textTertiary}">{{obj.createtime}}</view>
			<view class="flex align-center justify-center">
				<image class="width-100b" :src="obj.cover_image" mode=""></image>
			</view>
			<view class="content-wrapper" v-html="obj.content" :style="{color: theme.textPrimary}"></view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				obj:'',
			};
		},
		onLoad(e) {
			this.id = e.id
			this.get_agreement()
		},
        computed: {
            theme() {
                return this.$store.getters.theme
            },
        },
		methods:{
			get_agreement(){
				this.post('/index/news_con',{
					id:this.id
				}).then((res) => {
					//console.log('',res)
					if (res.code == 1) {
						this.obj = res.data
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.content-wrapper {
	:deep(p) {
		color: inherit;
	}
	:deep(span) {
		color: inherit;
	}
	:deep(div) {
		color: inherit;
	}
	:deep(img) {
		max-width: 100%;
		height: auto;
	}
}
</style>
