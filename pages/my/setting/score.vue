<template>
	<view class="min-height-screen flex flex-direction height-100b" :style="{background: theme.backgroundPrimary, color: theme.textPrimary}">
		<bg-animate-shape/>
		<app-nav :title="$t('my48')"></app-nav>
		<view class="padding-c-30 flex flex-direction flex-1">
			<view class="flex-1">
                <view v-if="show" class="width-686 height-86 margin-0-auto radiu-8 text-center flex align-center justify-center font-28" :style="{background: theme.backgroundCard, color: theme.textPrimary}">
                    {{$t('my49')}}
                </view>
                <view class="padding-w-32">
                    <view class="height-220 radiu-20 flex direction-column align-center justify-center" :style="{background: theme.primary__500, color: theme.white}">
                        <text class="font-28 margin-t-16" :style="{color: theme.white}">{{$t('my50')}}</text>
                        <text class="bold-font" :style="{fontSize: '96rpx', color: theme.white}">{{score}}</text>
                    </view>
                </view>
            </view>
			<view class="padding-w-52 flex align-center justify-center">
				<view @click="show=true" class="width-650 height-72 flex align-center justify-center font-28 bold-font radiu-8" :style="{background: theme.primary__500, color: theme.white}">
					<text :style="{color: theme.white}">{{$t('my51')}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				score:0
			};
		},
		onShow() {
			this.getInfo()
		},
        computed: {
            theme() {
                return this.$store.getters.theme
            }
        },
		methods:{
			getInfo(){
				this.post('/my/userinfo').then(res => {
					//console.log('用户资料',res)
					if (res.code == 1) {
						this.score = res.data.xinyu
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
</style>
