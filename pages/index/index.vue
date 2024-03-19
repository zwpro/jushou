<template>
	<view class="wrapper">
		<view class="logo">
			<image src="/static/icon/logo.png" mode="" class="logo-img"></image>
			剧搜
		</view>
		<view class="search">
			<input type="text" v-model="keyword" :class="['search-input', focus ? 'focus' : '']" placeholder="输入剧名~" confirm-type="search" @click="searchFocus" @focus="searchFocus" @blur="searchBlur" @confirm="search" />
			<view class="search-btn" @click="search">
				搜一下
			</view>
		</view>
		<view class="rank">
			<view class="rank-header">
				<view class="rank-header-num">
					排名
				</view>
				<view class="rank-header-name">
					剧名
				</view>
				<view class="rank-header-score">
					热度
				</view>
				<view class="rank-header-op">
					操作
				</view>
			</view>
			<view class="rank-list">
				<view class="rank-list-item" v-for="(item,index) in ranks" :key="index">
					<view class="rank-list-item-num">
						{{item.ranking}}
					</view>
					<view class="rank-list-item-name">
						{{item.playletName}}
					</view>
					<view class="rank-list-item-score">
						{{scoreFormat(item.consumeNum)}}
					</view>
					<view class="rank-list-item-op" @click="rankSearch(item)">
						搜
					</view>
				</view>
			</view>
		</view>
		<bottomPlace></bottomPlace>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				focus: false,
				keyword: '',
				ranks: [],
			}
		},
		watch: {
			token(newVal, oldVal) {
				
			},
		},
		computed:{
			scoreFormat() {
				return (value) => {
					return (value / 10000).toFixed(1) + 'w';
				}
			},
		},
		onLoad(e) {
			if (e.path) {
				this.jumpTo(e.path);
			}
			this.getRankList()
		},
		onReady() {
			
		},
		methods: {
			searchFocus(){
				this.focus = true
			},
			searchBlur(){
				this.focus = false
			},
			search(){
				if(this.keyword == ''){
					uni.showToast({
						title: '请输入搜索词~',
						icon: 'none',
					})
					return
				}
				uni.navigateTo({
					url: "/pages/search/search?keyword=" + encodeURIComponent(this.keyword)
				})
				this.keyword = ''
			},
			async jumpTo(payload) {
				console.log(payload)
				try {
					const path = decodeURIComponent(payload);
					uni.navigateTo({
						url: path
					});
				} catch (e) {}
			},
			async getRankList(){
				var resp = await this.$api.rankList();
				if(resp && resp.statusCode == 200){
					this.ranks = resp.content
				}
			},
			rankSearch(rank){
				uni.navigateTo({
					url: "/pages/search/search?keyword=" + encodeURIComponent(rank.playletName)
				})
			},
		},
		async onShareAppMessage(){
			return await this.$store.dispatch('getSettingShare')
		},
		async onShareTimeline(){
			return await this.$store.dispatch('getSettingShare')
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}
	.wrapper {
		.logo{
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 36rpx;
			font-weight: 700;
			color: #333333;
			margin-top: 60rpx;
			&-img{
				width: 45rpx;
				height: 45rpx;
				display: block;
				border-radius: 100%;
				margin-right: 10rpx;
			}
		}
		.search{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 630rpx;
			height: 100rpx;
			margin: 30rpx auto;
			margin-bottom: 60rpx;
			box-sizing: border-box;
			&-input{
				flex: 1;
				box-sizing: border-box;
				padding: 20rpx;
				height: 100%;
				background-color: #ffffff;
				border-radius: 18rpx 0 0 18rpx;
				border: 1px solid #ffffff;
				font-size: 36rpx;
				&.focus{
					border-color: #4e6ef2;
				}
			}
			&-btn{
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				width: 150rpx;
				background-color: #4e6ef2;
				color: #ffffff;
				font-size: 32rpx;
				font-weight: 700;
				border-radius: 0 18rpx 18rpx 0;
			}
		}
		.rank{
			margin: 30rpx;
			margin-top: 80rpx;
			background-color: #ffffff;
			border-radius: 18rpx;
			&-header{
				display: flex;
				align-items: center;
				height: 100rpx;
				font-weight: 700;
				font-size: 30rpx;
				&-num{
					height: 100%;
					width: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&-name{
					height: 100%;
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&-score{
					height: 100%;
					width: 150rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&-op{
					height: 100%;
					width: 100rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			&-list{
				&-item{
					display: flex;
					align-items: center;
					height: 100rpx;
					border-top: 1px solid #f5f5f5;
					&-num{
						height: 100%;
						width: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					&-name{
						height: 100%;
						flex: 1;
						display: flex;
						align-items: center;
					}
					&-score{
						height: 100%;
						width: 150rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #E44D26;
					}
					&-op{
						height: 100%;
						width: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #0969da;
					}
				}
			}
		}
	}
</style>
