<script>
    import { mapActions, mapState } from 'vuex';
	import pageAnimation from './components/page-animation'
    import _env from './env';
    const env = _env();
    const { VUE_APP_LANG } = env;
	export default {
		mixins: [pageAnimation],
		onLaunch: function() {
            var language = uni.getStorageSync('language')
            if (language) {
                this.$i18n.locale = language
            } else {
                uni.setStorageSync('language', VUE_APP_LANG)
                uni.setStorageSync('UNI_LOCALE', VUE_APP_LANG)
                this.$i18n.locale = VUE_APP_LANG
            }

            // Initialize theme - let initialTheme handle the logic
            this.$store.dispatch('initialTheme');

			// #ifdef H5
			if (uni.getStorageSync('token') == '') {
				uni.reLaunch({
					url: '/pages/login/index'
				})
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
            this.initApp()

		},
		onHide: function() {
			//console.log('App Hide')
		},
		globalData: {
			data: "",
			// Global interval cleanup mechanism
			globalIntervals: new Set(),
			// Register interval for cleanup
			registerInterval: function(intervalId) {
				this.globalIntervals.add(intervalId)
			},
			// Unregister interval
			unregisterInterval: function(intervalId) {
				this.globalIntervals.delete(intervalId)
			},
			// Clear all registered intervals
			clearAllIntervals: function() {
				this.globalIntervals.forEach(intervalId => {
					clearInterval(intervalId)
				})
				this.globalIntervals.clear()
			}
		},
        methods: {
            ...mapActions(['setInitialTheme', 'initApp']),
        }
    }
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";

	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "/colorui/animation.css";
	@import '/static/css/main.css';
    @import '/static/css/themes.css';

	// 引入字体
	@font-face {
		font-family: 'Bold';
		src: url('~@/static/fonts/DIN-Bold.otf');
	}

	@font-face {
		font-family: 'Medium';
		src: url('~@/static/fonts/DIN-Medium.otf');
	}

	.bold-font {
		font-family: "Bold" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.medium-font {
		font-family: "Medium" !important;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
