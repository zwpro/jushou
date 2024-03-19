<template>
	<view class="component">
		<view :class="['component-content', needSafeArea ? 'safeAera' : '']" :style="{height: bottomHight+'px'}">
			
		</view>
	</view>
</template>

<script>
	export default {
		name:"bottomPlace",
		data() {
			return {
				bottomHight: 0,
			};
		},
		props:{
			needSafeArea: {
				type: Boolean,
				required: false, 
				default: true
			}
		},
		mounted() {
			let app = uni.getSystemInfoSync();
			this.bottomHight = app.safeAreaInsets.bottom
		}
	}
</script>

<style lang="scss" scoped>
	.component{
		&-content{
			min-height: 1px;
			&.safeAera{
				
			}
		}
	}
	
</style>