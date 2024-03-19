<template>
	<view class="wrapper">
		<web-view :src="weburl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				weburl: '',
			};
		},
		onLoad(e){
			if(e.url){
				this.weburl = decodeURIComponent(e.url)
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
	}
	.wrapper{
		
	}
</style>
