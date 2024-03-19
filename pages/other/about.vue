<template>
	<view class="wrapper">
		<image src="/static/icon/logo.png" mode="" class="logo"></image>
		<view class="name">
			{{name}}
		</view>
		<view class="contact">
			联系我 {{contact}}
		</view>
	</view>
</template>

<script>
	import env from '@/env.js'
	export default {
		data() {
			return {
				name: '',
				contact: '',
			};
		},
		onLoad() {
			this.name =  env[process.env.NODE_ENV].name
			this.contact =  env[process.env.NODE_ENV].contact
		}
	}
</script>

<style lang="scss">
	.wrapper{
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.logo{
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;
		}
		.name{
			margin-top: 20rpx;
		}
		.contact{
			margin-top: 40rpx;
		}
	}
</style>
