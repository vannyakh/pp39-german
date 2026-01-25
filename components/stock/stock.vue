<template>
	<view :style="{color:theme.dark}">
		<view class="flex flex-direction padding-20 gap-20 radiu-10 width-100b">
		    <view class="flex align-center gap-10">
		        <view class="flex-1">{{item.Name}}</view>
		        <view class="bg-white width-50 height-50 radiu-20 flex align-center justify-center">
		            <u-icon name="arrow-upward" size="15" color="green"></u-icon>
		        </view>
		    </view>
		    <view class="flex align-center gap-10">
		        <view class="font-30">{{item.PrevClose}}</view>
		        <view class="font-20" :class="item.ChgPct>=0?'color-41BD64':'color-657EFA'">{{item.ChgPct}}</view>
		        <view class="font-20" :class="item.Chg>=0?'color-41BD64':'color-657EFA'">{{item.Chg}}%</view>
		    </view>
		    <view class="flex align-center">
		        <view class="margin-r-10 font-23" :style="{color: theme.gray40}">Up</view>
		        <view class="flex-1">
		            <u-line-progress :percentage="item.up" :inactiveColor="theme.green__light" :activeColor="theme.green__dark"></u-line-progress>
		        </view>
		        <!-- <view class="margin-l-10 font-23" :style="{color: theme.gray40}">{{item.up?item.up:0.00}}</view> -->
		    </view>
		    <view class="flex align-center">
		        <view class="margin-r-10 font-23" :style="{color: theme.gray40}">Down</view>
		        <view class="flex-1">
		            <u-line-progress :percentage="item.down" :inactiveColor="theme.red__light" :activeColor="theme.red__dark"></u-line-progress>
		        </view>
		        <!-- <view class="margin-l-10 font-23" :style="{color: theme.gray40}">{{item.down?item.down:0.00}}</view> -->
		    </view>
		    <view class="flex align-center">
		        <view class="margin-r-10 font-23" :style="{color: theme.gray40}">Flat</view>
		        <view class="flex-1">
		            <u-line-progress :percentage="item.flat" :inactiveColor="theme.blue__light" :activeColor="theme.blue__dark"></u-line-progress>
		        </view>
		        <!-- <view class="margin-l-10 font-23" :style="{color: theme.gray40}">{{item.flat?item.flat:0.00}}</view> -->
		    </view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"stock",
		props: {
		    items: {
		        type: Object,
		        default: {}
		    },
		},
		watch: {
		    items: {
		        handler(val) {
		            this.item = val
		        },
		        immediate: true
		    }
		},
		data() {
		    return {
		        item: {}
		    }
		},
		computed: {
		    theme() {
		        return this.$store.getters.theme
		    }
		}
	}
</script>

<style>

</style>