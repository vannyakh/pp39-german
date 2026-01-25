<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<app-nav blur :title="$t('my24')"></app-nav>

		<view class="padding-30 content-wrapper" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}" v-html="content"></view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
			};
		},
		onLoad() {
			this.get_agreement()
		},
		computed: {
		    theme(){
		        return this.$store.getters.theme
		    }
		},
		methods:{
			get_agreement(){
				this.post('/publics/agreement').then((res) => {
					//console.log('',res)
					if (res.code == 1) {
						this.content = res.data.about_us
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>
