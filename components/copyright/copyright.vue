<template>
	<view class="component">
		本信息来源于网络，如有侵权请
		<view class="component-con" @click="contact">
			联系我
		</view>
	</view>
</template>

<script>
	export default {
		name:"copyright",
		data() {
			return {
				
			};
		},
		methods: {
			contact(){
				uni.navigateTo({
					url: "/pages/other/about"
				})
			}
		}
	}
</script>

<style lang="less">
	.component{
		color: #a1a3a5;
		font-size: 28rpx;
		text-align: center;
		display: flex;
		align-items: center;
		justify-content: center;
		&-con{
			color: #42b983;
		}
	}
</style>