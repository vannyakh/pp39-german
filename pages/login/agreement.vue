<template>
	<view class="min-height-screen" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
        <bg-animate-shape/>
		<app-nav blur :title="title"></app-nav>

		<view class="padding-30 font-30 content-wrapper" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}" v-html="content">

		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'',
				content:'',
				title:'',

			};
		},
		onLoad(e) {
			this.type = e.type
			this.get_agreement()
			if(this.type == 'agreement'){
				this.title = this.$t('login28')
			}
			if(this.type == 'privacy'){
				this.title = this.$t('login29')
			}
			if(this.type == 'mianze_text'){
				this.title = this.$t('login30')
			}
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
						if(this.type == 'agreement'){
							this.content = res.data.agreement
						}
						if(this.type == 'privacy'){
							this.content = res.data.privacy
						}
						if(this.type == 'mianze_text'){
							this.content = res.data.mianze_text
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.min-height-screen {
	min-height: 100vh;
}

.content-wrapper {
	::deep(text),
	::deep(p),
	::deep(div),
	::deep(span),
	::deep(h1),
	::deep(h2),
	::deep(h3),
	::deep(h4),
	::deep(h5),
	::deep(h6),
	::deep(li),
	::deep(ul),
	::deep(ol) {
		color: inherit;
	}
	::deep(img) {
		max-width: 100%;
		height: auto;
	}
}
</style>
