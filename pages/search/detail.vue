<template>
	<view class="wrapper">
		<view class="detail">
			<view class="detail-item">
				<view class="detail-item-name">
					资源名称
				</view>
				<view class="detail-item-value">
					<text selectable user-select space decode>{{detail.name}}</text>
				</view>
			</view>
			<view class="detail-item">
				<view class="detail-item-name">
					资源链接
				</view>
				<view class="detail-item-value url">
					<text selectable user-select space decode>{{detail.data.link}}</text>
				</view>
			</view>
			<view class="detail-item">
				<view class="detail-item-name">
					更新日期
				</view>
				<view class="detail-item-value">
					<text selectable user-select space decode>{{detail.data.date}}</text>
				</view>
			</view>
			<view class="detail-info">
				<view class="detail-info-from">
					<image :src="detail.from.logo" mode="" class="detail-info-from-logo"></image>
					{{detail.from.name}}
				</view>
			</view>
		</view>
		<view class="copyright">
			<copyright></copyright>
		</view>
		<view class="func">
			<button plain class="func-share" open-type="share">
				分享给好友
			</button>
		</view>
	</view>
</template>

<script>
	import {search as searchApi} from '@/common/search/index.js'
	export default {
		data() {
			return {
				apiId: '',
				sid: '',
				detail: {},
			};
		},
		onLoad(e) {
			this.apiId = e.apiId
			this.sid = e.sid
			this.getDetail()
		},
		methods:{
			async getDetail(){
				this.detail = await searchApi[this.apiId].detail(this.sid)
			}
		},
		onShareAppMessage(){
			return this.$store.dispatch('getSettingShare', this.detail)
		},
		onShareTimeline(){
			return this.$store.dispatch('getSettingShare', this.detail)
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f7f7;
	}
	.wrapper{
		.detail{
			margin: 30rpx;
			padding: 20rpx;
			background-color: #ffffff;
			border-radius: 18rpx;
			position: relative;
			&-item{
				margin-bottom: 30rpx;
				&-name{
					font-size: 30rpx;
					color: rgba(43, 63, 104, 0.75);
				}
				&-value{
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					padding: 30rpx;
					border-radius: 18rpx;
					background-color: #F5F6F5;
					word-break: break-all;
					&.url{
						color: #1e80ff;
					}
				}
			}
			&-info{
				margin-top: 20rpx;
				&-from{
					display: flex;
					align-items: center;
					color: #95969c;
					font-size: 30rpx;
					&-logo{
						width: 30rpx;
						height: 30rpx;
						border-radius: 100%;
						margin-right: 10rpx;
						display: block;
					}
				}
			}
		}
		.func{
			&-share{
				color: #ffffff;
				background-color: #07c160;
				width: 300rpx;
				height: 100rpx;
				border-radius: 100rpx;
				margin: 30rpx auto;
				padding: 0;
				border: none;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 700;
				&::after{
					content:none;
				}
			}
		}
	}
</style>
