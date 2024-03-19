<script>
	import 'env.js'
	import store from "@/store";
	export default {
		onLaunch: function(e) {
			console.log('App Launch')
			store.dispatch("init");
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	page{
		font-size: 32rpx;
	}
</style>
