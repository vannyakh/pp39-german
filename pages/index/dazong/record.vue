<template>
	<view class="min-height-screen" :style="{color: theme.textPrimary, background: theme.backgroundSecondary}">
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20"
			:loading-more-enabled="false">
			<app-nav slot="top" :title="$t('index17')"></app-nav>

			<view slot="top" class="padding-32" :style="{background: theme.backgroundCard}">
				<view class="flex align-center justify-between width-100b radiu-10"
					:style="{background: theme.backgroundTertiary}">
					<view class="width-100b radiu-15 padding-15" @click="changeType(item.type)"
						:style="getTabStyle(item.type)"
						v-for="(item,index) in categoryList" :key="index">
						<view class="text-center font-28"
                              :style="{color: getTabStyle(item.type).color}">{{item.name}}</view>
					</view>
				</view>

			</view>

			<v-container size="md">
				<view class="listBox radiu-22" v-for="(item,index) in list" :key="index"
					:style="{background: theme.backgroundCard}">
					<view class="padding-w-0">
						<view class="height-100 flex padding-c-30 align-start justify-between"
							:style="{borderBottom: '1px solid ' + theme.neutral__200}">
							<view class="flex align-center">
								<view class="hidden-1 font-28 width-180" :style="{ color: theme.textPrimary }">
									{{item.name}}
								</view>
								<view class="radiu-4 flex align-center" :style="{background: theme.primary__500}">
									<view class="padding-6 radiu-4 font-24" :style="{background: theme.backgroundCard, color: theme.textPrimary}">
										{{checktype(item.type)}}
									</view>
									<text class="font-24 padding-w-10" :style="{color: theme.white}">{{item.code}}</text>
								</view>
							</view>
							<view class="flex direction-column align-center justify-end">
								<view class="font-24" :style="{ color: theme.textTertiary }">{{$t('index33')}}：<span class="">{{item.createtime}}</span></view>
								<view v-if="type==2" class="font-24" :style="{ color: theme.textTertiary }">{{$t('index51')}}：<span class="">{{item.updatetime}}</span></view>
							</view>
						</view>
					</view>

					<view class="flex align-center justify-between padding-t-10 margin-t-20">
						<view class="flex-1 flex direction-column justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220"
								:style="{background: theme.neutral__200,width: '2rpx'}" />
							<text class="font-32" :style="{ color: theme.textPrimary }">{{item.price}}/{{$t('index26')}}</text>
							<text class="font-20 margin-t-8" :style="{ color: theme.textTertiary }">{{$t('index27')}}</text>
						</view>
						<view v-if="item.status==4" class="flex-1 flex direction-column align-center justify-center">
							<text class="font-32" :style="{ color: theme.textPrimary }">{{item.pc_price}}</text>
							<text class="font-20 margin-t-8" :style="{ color: theme.textTertiary }">{{$t('index55')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-center justify-center">
							<view class="height-90  padding-c-20  absolute margin-l-220"
								:style="{background: theme.neutral__200,width: '2rpx'}" />
							<text class="font-32" :style="{ color: theme.textPrimary }">{{item.sg_num}}</text>
							<text class="font-20 margin-t-8" :style="{ color: theme.textTertiary }">{{$t('index41')}}</text>
						</view>
						<view class="flex-1 flex direction-column align-end justify-center">
							<text class="font-32" :style="{ color: theme.textPrimary }">{{item.num}}</text>
							<text class="font-20 margin-t-8" :style="{ color: theme.textTertiary }">{{$t('index56')}}</text>
						</view>
					</view>
					<view class="flex direction-column align-start justify-center padding-c-10 margin-t-20"
						:style="{borderTop: '1px solid ' + theme.neutral__200}">
						<view class="width-100b flex align-center justify-center">

							<text v-if="item.status==1" class="font-24" :style="{ color: theme.textTertiary }">{{$t('index49')}}</text>
							<view v-if="item.status==2" class="flex align-center">
								<text class="font-24 margin-r-20" :style="{ color: theme.success }">{{$t('index50')}}</text>
								<!-- <view @click="pingcang(item.id)" class="padding-c-6 width-100 text-center bj-bians radiu-4 font-24 color-white">
									{{$t('index53')}}
								</view> -->
							</view>
							<!-- <text v-if="item.status==3" class="font-24 color-949494">{{$t('index54')}}</text> -->
						</view>
					</view>
				</view>
			</v-container>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1,
				list: [],
				flag: true,
				categoryList: [{
						name: this.$t('index49'),
						type: 1
					},
					{
						name: this.$t('index50'),
						type: 2
					},
				]
			};
		},
		computed: {
			theme() {
				return this.$store.getters.theme
			}
		},
    methods: {
        changeType(index) {
            if (this.type != index) {
                this.type = index
                this.$refs.paging.reload()
            }
        },
        getTabStyle(tabType) {
            if (this.type === tabType) {
                return {
                    background: this.theme.primary__500,
                    color: this.theme.white
                }
            }
            return {
                background: 'transparent',
                color: this.theme.textSecondary
            }
        },
			pingcang(id) {
				if (!this.flag) return
				this.flag = false
				this.post('/product/max_ping', {
					id: id
				}, true).then((res) => {
					//console.log('平仓',res)
					this.flag = true
					if (res.code == 1) {
						this.tos(res.msg)
						this.$refs.paging.reload()
					}
				})
			},
			queryList(pageNo, pageSize) {
				this.post('/product/max_log', {
					page: pageNo,
					status: this.type
				}).then(res => {
					if (res.code == 1) {
						//console.log('数据', res)
						this.$refs.paging.complete(res.data);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.btnsbox {
		width: 160rpx;
		height: 64rpx;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}

	.btnsbox1 {
		width: 160rpx;
		height: 64rpx;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}

	.listBox {
		width: 100%;
		// height: 233rpx;
		margin-bottom: 12rpx;
		margin-top: 12rpx;
		padding: 20rpx 32rpx;
	}
</style>
