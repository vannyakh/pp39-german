<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
		<bg-animate-shape/>
		<app-nav blur :title="$t('index32')"></app-nav>

		<v-container size="md">
			<view class="font-36 weight-bold" :style="{color: theme.textPrimary}">{{obj.title}}</view>
			<view class="font-24 margin-c-24" :style="{color: theme.textTertiary}">{{obj.createtime}}</view>
			<view class="content-wrapper" :style="{color: theme.textPrimary}" v-html="obj.content"></view>
		</v-container>

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
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
		onLoad(e) {
			this.id = e.id
			this.get_agreement()
		},
		methods:{
			get_agreement(){
				this.post('/index/message_con',{
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
</style>
