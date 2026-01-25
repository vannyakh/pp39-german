<template>
	<view>
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20">
			<myNav slot="top" title="Earnings List"></myNav>
			
			<view slot="top" class="height-180 padding-w-48 bj-dbdbeb flex align-center justify-between">
				<view class="height-100 flex direction-column align-start justify-between">
					<text class="font-36">240.00000000USDT</text>
					<text class="font-24">Accumulated income</text>
				</view>
				<view class="height-100 flex direction-column align-end justify-between">
					<text class="font-36">15 day</text>
					<text class="font-24">Accumulated earnings days</text>
				</view>
			</view>
			
			<view slot="top" class="height-70 padding-w-60 flex align-center justify-between">
				<text class="font-26 color-C3C3C3">Quantity</text>
				<text class="font-26 color-C3C3C3">Time</text>
			</view>
			
			<view class="listBox" v-for="(item,index) in " :key="index">
				<text class="font-28 color-00C481">+16.00000000 USDT</text>
				<text class="font-24">2023-12-23 10:53</text>
			</view>
			
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				id:'',
				alr_day:0,
				alr_num:0,
				curr_name:'',
				
				theme: '',
			};
		},
		computed: {
			// i18n() {
			// 	return this.$t('message');
			// },
		},
		onLoad(e) {
			this.id = e.id
			this.getInfo()
		},
		onShow() {
			
		},
		methods: {
			getInfo(){
				this.post('/product/product_user_con', {
					id: this.id,
				}).then(res => {
					if (res.code == 1) {
						this.alr_day = res.data.alr_day
						this.alr_num = res.data.alr_num
						this.curr_name = res.data.curr_name
					}
				})
			},
			queryList(pageNo, pageSize) {
				this.post('/product/product_user_log', {
					page: pageNo,
					id: this.id,
				}).then(res => {
					if (res.code == 1) {
						console.log('数据', res)
						this.$refs.paging.complete(res.data.data);
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.listBox {
		width: 100%;
		height: 96rpx;
		// background: #FFFFFF;
		border-radius: 24rpx;
		margin-bottom: 1px;
		padding: 0 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
