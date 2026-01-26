<template>
	<view :style="{ background: theme.light, minHeight: '100vh', color: theme.white }">
		<z-paging :language="$t('locale')" ref="paging" v-model="list" @query="queryList" :pageSize="20" :auto="false">
			<myNav slot="top" :title="$t('tabBar3')" :black="false" isRight righturl="/static/imgs/index/soushuo.png" @Jump="router.push('/pages/index/searchView')"></myNav>

			<view slot="top" class="padding-w-30">
				<view class="padding-w-20 padding-c-20 radiu-30" :style="{ background: theme.light__gray }">
					<view class="padding-w-10 padding-c-10 radiu-20 border-05-BCC7BF">
						<view class="radiu-10 text-center flex align-center justify-between" :style="{ background: theme.light__gray }">
							<view
								class="width-100b radiu-15 flex align-center justify-center height-80 bold-font"
								@click="changeType(1, 42)"
								:style="{ color: type == 1 ? theme.white : theme.C_4D4D4D, background: type == 1 ? theme.primary : '' }"
							>
								<view class="text-center font-28">{{ $t('Span_Stock_position') }}</view>
							</view>
							<view
								class="width-100b radiu-15 flex align-center justify-center height-80 bold-font"
								@click="changeType(2, 39)"
								:style="{ color: type == 2 ? theme.white : theme.C_4D4D4D, background: type == 2 ? theme.primary : '' }"
							>
								<view class="text-center font-28">{{ $t('US_Stock_position') }}</view>
							</view>
						</view>
					</view>
					<view class="padding-w-2 padding-c-10">
						<view class="text-center flex align-center justify-between">
							<view
								class="width-100b flex direction-column align-center justify-center height-150 radiu-20 border-05-BCC7BF"
								:style="{ background: theme.BC_BCC7BF }"
							>
								<view class="height-50 text-center font-28" :style="{ color: theme.gray10 }">{{ $t('Total_Balance') }} (MYR)</view>
								<view class="height-50 text-center font-28 bold-font" :style="{ color: theme.green__light }">RM {{ Number(money ? money : 0).toFixed(3) }}</view>
							</view>
							<view class="width-30"></view>
							<view
								class="width-100b flex direction-column align-center justify-center height-150 radiu-20 border-05-BCC7BF"
								:style="{ background: theme.BC_BCC7BF }"
							>
								<view class="height-50 text-center font-28" :style="{ color: theme.gray10 }">{{ $t('Total_Balance') }} (CNY)</view>
								<view class="height-50 text-center font-28 bold-font" :style="{ color: theme.green__light }">
									¥ {{ Number(money_cn ? money_cn : 0).toFixed(3) }}
								</view>
							</view>
						</view>
					</view>
					<view class="flex align-center radiu-30 justify-between width-100b border-05-BCC7BF" :style="{ background: theme.BC_BCC7BF }">
						<view class="width-100b" v-for="(item, index) in categoryList" :key="index">
							<view
								@click="set(item.type)"
								class="text-center font-25 radiu-15 padding-20"
								:style="{ color: status == item.type ? theme.white : theme.C_4D4D4D, background: status == item.type ? theme.primary : '' }"
							>
								{{ item.name }}
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- <view class="padding-w-32 margin-t-10" :style="{background: theme.light__gray}">
				<view  class="flex align-center justify-between padding-c-20">
					<view class="flex flex-direction justify-between height-100">
						<view :style="{color: theme.gray60}">{{$t('position1')}}</view>
						<view class="font-23 weight-bold text-center" :style="{color:theme.danger}"> ৳ {{Number(total_markets).toFixed(3)}}</view>
					</view>
					<view class="flex flex-direction justify-between height-100">
						<view :style="{color: theme.gray60}">{{$t('position2')}}</view>
						<view class="font-23 weight-bold text-center" :style="{color:theme.danger}"> ৳ {{Number(total_floating_profit).toFixed(3)}}</view>
					</view>
					<view class="flex flex-direction justify-between height-100">
						<view :style="{color: theme.gray60}">{{$t('position3')}}</view>
						<view class="font-23 weight-bold text-center" :style="{color:theme.danger}"> ৳ {{Number(total_asset).toFixed(3)}}</view>
					</view>
				</view>
			</view> -->

			<view class="padding-w-32 margin-t-20">
				<view class="listBox" :style="{ background: theme.light__gray }" v-for="(item, index) in list" :key="index">
					<view class="flex align-center justify-between">
						<view class="font-22 flex-1 text-left" :style="{ color: theme.gray10 }">{{ $t('optional4') }}</view>
						<view class="font-22 flex-1 text-center" :style="{ color: theme.gray10 }">
							{{ $t('optional5') }}
						</view>
						<view class="font-22 flex-1 text-right" :style="{ color: theme.gray10 }">
							{{ $t('optional6') }}
						</view>
					</view>
					<view class="flex align-center justify-between">
						<view class="flex flex-direction flex-1">
							<view class="font-25" :style="{ color: theme.gray10 }">{{ item.name }}</view>
							<view class="font-23" :style="{ color: theme.gray10 }">{{ item.code }}</view>
						</view>
						<view class="flex flex-direction text-center flex-1 gap-15">
							<view class="font-25" :style="{ color: theme.gray10 }">{{ item.close }}</view>
							<view class="font-20" :style="{ color: item.rise_all_fall >= 0 ? theme.green__dark : theme.danger }">
								<text class="padding-8" :style="{ color: theme.red__dark }">{{ item.num }}</text>
								<!-- <text class="padding-8 radiu-8"
									:style="{background:item.num >= 0 ?theme.green__light:theme.red60}">{{item.num}}</text> -->
							</view>
						</view>
						<view class="flex flex-direction text-center flex-1 gap-15">
							<view class="font-25" :style="{ color: theme.gray10 }">{{ item.price }}</view>
							<view class="font-20" :style="{ color: theme.danger }">
								<text class="padding-8 radiu-8" :style="{ background: theme.red60 }">{{ Number(item.close * item.num).toFixed(3) }}</text>
							</view>
						</view>
					</view>
					<view class="flex align-center justify-between">
						<view class="flex flex-direction">
							<view class="font-25" :style="{ color: theme.gray10 }">{{ item.createtime }}</view>
						</view>
						<view class="flex flex-direction text-center flex-1 gap-15">
							<view class="font-25" :style="{ color: theme.gray10 }">{{ $t('Total_purchase') }}</view>
							<view class="" :style="{ color: theme.gray10 }">
								<text class="font-22 bold-font">{{ Number(item.num * 100 * item.price).toFixed(3) }}</text>
							</view>
						</view>
						<view class="flex flex-direction text-center flex-1 gap-15">
							<!-- <view class="font-25" :style="{color:theme.gray10}">{{item.price}}</view> -->
							<!-- <view class="font-20" :style="{color:theme.danger}">
								<text class="padding-8 radiu-8" :style="{background:theme.red60}">{{Number(item.close * item.num).toFixed(3)}}</text>
							</view> -->
						</view>
					</view>

					<view class="">
						<view v-if="status == 2" @click="showPopup(item)" class="flex align-center justify-between relative margin-t-20 custom">
							<view
								class="padding-10 font-25 width-100b"
								:style="{
									borderRadius: '20rpx 0 0 20rpx',
									background: Number(((item.close - item.price) / item.price) * 100).toFixed(3) >= 0 ? theme.green__dark : theme.danger,
									color: theme.white
								}"
							>
								{{ $t('optional7') }}
								<span class="margin-l-10">{{ Number(((item.close - item.price) / item.price) * 100).toFixed(3) }}%</span>
							</view>
							<view
								class="padding-10 font-25 width-100b text-center border-05-BCC7BF"
								:style="{ borderRadius: '0 20rpx 20rpx 0', background: theme.light__gray, color: theme.dark }"
							>
								<text>{{ $t('chicang11') }}</text>
							</view>
						</view>
						<view v-if="status == 3" @click="showDetail(item.id)" class="flex align-center justify-between relative margin-t-20 custom">
							<view
								class="padding-15 font-20 width-100b"
								:style="{
									borderRadius: '20rpx 0 0 20rpx',
									background: Number(((item.pc_price - item.price) / item.price) * 100).toFixed(3) >= 0 ? theme.green__dark : theme.danger,
									color: theme.white
								}"
							>
								{{ $t('optional7') }}
								<span class="margin-l-10">{{ Number(((item.pc_price - item.price) / item.price) * 100).toFixed(3) }}%</span>
							</view>

							<view
								class="padding-15 font-20 width-100b text-right"
								style="border: solid #353e4b 1px"
								:style="{ borderRadius: '0 20rpx 20rpx 0', background: theme.light__gray, color: theme.dark }"
							>
								<text>{{ $t('chicang11') }}</text>
							</view>
						</view>
					</view>

					<strong></strong>

					<!-- <view class="flex align-center justify-between">
						<view class="width-10"> </view>
						<view v-if="status == 2" @click="pingcang(item.id)"
							:style="{background:theme.bgPrimary, color:theme.white}"
							class="height-76 width-700 margin-0-auto radiu-10 flex align-center justify-center font-28">
							{{ $t("chicang11") }}
						</view>

						<view v-if="status == 1" @click="chedan(item.id)"
							:style="{background:theme.bgPrimary, color:theme.white}"
							class="height-76 width-700 margin-0-auto radiu-10 flex align-center justify-center font-28">
							{{ $t("chicang12") }}
							</view>
					</view> -->
				</view>
				<view class="height-100"></view>
			</view>
		</z-paging>
		<u-popup :show="show" :round="20" mode="center" bgColor="transparent" @close="show = false" @open="open">
			<view class="height-370 width-690 radiu-40" :style="{ background: theme.light__gray, color: theme.dark }">
				<view class="height-220 flex direction-column align-center justify-center">
					<view class="font-30">{{ $t('position4') }}</view>
					<view v-if="country == 6" class="font-48 margin-t-30">Euro {{ Number(win_or_lost).toFixed(3) }}</view>
					<view v-if="country == 5" class="font-48 margin-t-60">US {{ Number(win_or_lost).toFixed(3) }}</view>
					<view class="font-28 margin-t-30">{{ $t('optional7') }}</view>
				</view>
				<view class="height-150 flex align-center justify-around">
					<view @click="showDetail(id, status)" class="padding-20 radiu-10" :style="{ background: theme.primary, color: theme.white }">
						{{ $t('position5') }}
					</view>
					<view @click="pingcang(id)" class="padding-20 radiu-10" :style="{ background: theme.danger, color: theme.white }">
						{{ $t('position6') }}
					</view>
				</view>
			</view>
		</u-popup>
		<!-- <TabBar :tab-index="2"></TabBar> -->
	</view>
</template>

<script>
import store from '@/store';
export default {
	data() {
		return {
			statusBar: uni.getSystemInfoSync().statusBarHeight,
			show: false,
			value: [],
			range: [],
			status: 2,
			country: 6,
			type: 1,
			list: [],

			flag: true,
			total_asset: 0.0,
			total_floating_profit: 0.0,
			total_markets: 0.0,
			win_or_lost: 0,
			money: 0.0,
			money_cn: 0.0,
			id: '',
			timer: null,

			categoryList: [
				{
					name: this.$t('chicang1'),
					type: 2
				},
				{
					name: this.$t('chicang2'),
					type: 3
				},
				{
					name: this.$t('chicang3'),
					type: 1
				}
			]
		};
	},
	onShow() {
		uni.setTabBarItem({
			index: 0,
			text: this.$t('tabBar1')
		});
		uni.setTabBarItem({
			index: 1,
			text: this.$t('tabBar2')
		});
		uni.setTabBarItem({
			index: 2,
			text: this.$t('tabBar3')
		});
		uni.setTabBarItem({
			index: 3,
			text: this.$t('tabBar4')
		});
		uni.setTabBarItem({
			index: 4,
			text: this.$t('tabBar5')
		});
		uni.showTabBar(true);

		// uni.showTabBar();
		// store.commit('setTabBarVisible', true);
		this.queryList(1, 20);
		// this.timer = setInterval(() => {
		// 	this.queryList(1, 20);
		// }, 500)
	},
	onHide: function () {
		clearInterval(this.timer);
	},
	computed: {
		mpother() {
			return mpother;
		},
		theme() {
			return this.$store.getters.theme;
		}
	},
	methods: {
		changeType(index, valCountry) {
			if (this.type != index) {
				this.type = index;
				this.country = valCountry;
				this.$refs.paging.reload();
			}
		},
		change(e) {
			console.log('e:', e);
		},
		showPopup(item) {
			this.id = item.id;
			this.win_or_lost = (((item.count_price * (item.close - item.price)) / item.price) * 100) / 100;
			this.show = true;
		},
		showDetail(ids, status) {
			this.router.push('/pages/chicang/position_details?id=' + ids + '&status=' + this.status);
		},

		set(index) {
			if (this.status != index) {
				this.status = index;
				// this.country = valCountry
				this.$refs.paging.reload();
			}
		},
		pingcang(id, leverage) {
			if (!this.flag) return;
			// if (!leverage || leverage == undefined) return this.tos(this.$t('my89'))
			this.flag = false;
			this.post(
				'/shares/pingcang',
				{
					id: id
					// lever: leverage,
				},
				true
			).then((res) => {
				this.flag = true;
				if (res.code == 1) {
					this.tos(res.msg);
					this.$refs.paging.reload();
					this.show = false;
				}
			});
		},
		chedan(id) {
			if (!this.flag) return;
			this.flag = false;
			this.post('/shares/order_che', {
				id: id
			}).then((res) => {
				// console.log('撤单', res)
				this.flag = true;
				if (res.code == 1) {
					this.tos(res.msg);
					this.$refs.paging.reload();
				}
			});
		},
		queryList(pageNo, pageSize) {
			this.post('/shares/order_list', {
				status: this.status,
				country: this.country,
				page: pageNo
			}).then((res) => {
				// console.log("vbnm,", res);
				if (res.code == 1) {
					total_markets: 0.0, (this.total_floating_profit = res.data.total_floating_profit);
					this.total_markets = res.data.total_markets;
					this.total_asset = res.data.total_asset;
					this.money_cn = res.data.money_cn;
					this.money = res.data.money;
					this.$refs.paging.complete(res.data.list.data);
					let order = res.data.list.data;

					order.forEach((value, index) => {
						let leverage = value.leverage;
						let temp = [];
						leverage.forEach((le, i) => {
							let tempPush = {
								value: le,
								text: le
							};
							temp.push(tempPush);
						});
						this.range[index] = temp;
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.text {
	font-size: 12px;
	color: #666;
	margin-top: 5px;
}

.uni-px-5 {
	padding-left: 10px;
	padding-right: 10px;
}

.uni-pb-5 {
	padding-bottom: 10px;
}

.dropdown {
	position: relative;
}

.dropdown-list {
	list-style: none;
	padding: 0;
	margin: 0;
	position: absolute;
	top: 100%;
	left: 0;
	background-color: #fff;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

.dropdown-list li {
	padding: 10px;
	cursor: pointer;
}

.listBox {
	width: 100%;
	margin: 20rpx auto;
	border-radius: 20rpx;
	padding: 20rpx 32rpx 20rpx;
}

.boxs {
	width: 100rpx;
	height: 48rpx;
	border-radius: 4rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #ffffff;
}

.custom::after {
	content: '';
	width: 5px;
	height: 110%;
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%) rotate(10deg);
	transform: translate(-50%, -50%) rotate(10deg);
	// background-color: #fff;
}
</style>