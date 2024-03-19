<template>
	<view class="wrapper">
		<view class="head">
			<view class="head-search">
				<input type="text" v-model="keyword" :class="['head-search-input', 'focus']" placeholder="输入剧名~" confirm-type="search" @confirm="search" />
				<view class="head-search-btn" @click="search">
					搜一下
				</view>
			</view>
			<view class="head-tab">
				<view :class="['head-tab-item', tabId == item.id ? 'active' : '']" v-for="(item,index) in tab" :key="index" @click="tabSel(item.id)">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="result">
			<view class="result-list">
				<view class="result-list-item" v-for="(item, index) in tabList" :key="index" @click="goDetail(item)">
					<view class="result-list-item-title">
						{{item.result.name}}
					</view>
					<view class="result-list-item-content">
						<view class="result-list-item-content-left">
							<view class="result-list-item-content-left-name">
								资源链接
							</view>
							<view class="result-list-item-content-left-value">
								{{item.result.data.link}}
							</view>
						</view>
						<view class="result-list-item-content-right">
							<view class="result-list-item-content-right-name">
								更新时间
							</view>
							<view class="result-list-item-content-right-value">
								{{item.result.data.date}}
							</view>
						</view>
					</view>
					<view class="result-list-item-info">
						<view class="result-list-item-info-from">
							<image :src="item.result.from.logo" mode="" class="result-list-item-info-from-logo"></image>
							{{item.result.from.name}}
						</view>
					</view>
					<image src="/static/icon/more.png" mode="" class="result-list-item-more"></image>
				</view>
			</view>
			<view class="result-empty" v-if="tabList.length == 0">
				<view class="result-empty-null">
					暂无资源
				</view>
				<view class="result-empty-comment">
					请
					<view class="result-empty-comment-con" @click="gowxcomment">
						点此提交
					</view>
					，会尽快补充该资源
				</view>
			</view>
		</view>
		<bottomPlace></bottomPlace>
	</view>
</template>

<script>
	var plugin = requirePlugin("wxacommentplugin");
	import {search as searchApi} from '@/common/search/index.js'
	export default {
		data() {
			return {
				keyword: '',
				results: [],
				tabId: -2,
				tabList: [],
			};
		},
		onLoad(e) {
			if(e.keyword){
				this.keyword = decodeURIComponent(e.keyword)
				this.search()
			}
			console.log(searchApi, '搜索源')
		},
		watch:{
			tabId(newVal, oldVal){
				this.tabList = []
				if(newVal == -1){
					for (let s of this.results) {
						for (let r of s.result) {
							this.tabList.push({
								api: s.api,
								result: r
							})
						}
					}
				}else{
					for (let s of this.results) {
						if(s.api.id == newVal){
							for (let r of s.result) {
								this.tabList.push({
									api: s.api,
									result: r
								})
							}
						}
					}
				}
			},
		},
		computed: {
			tab() {
				var tab = [
					{
						name: '全部',
						id: -1,
					}
				]
				for (let s of this.results) {
					tab.push({
						name: s.api.name,
						id: s.api.id
					})
				}
				return tab
			},
		},
		methods: {
			goDetail(detail){
				uni.navigateTo({
					url: `/pages/search/detail?apiId=${detail.api.id}&sid=${detail.result.sid}` 
				})
			},
			async search(){
				this.results = []
				this.tabId = -2
				this.tabList = []
				uni.showLoading({
					title:"搜索中"
				})
				var searchApiResult = []
				var searchApiReq = []
				Object.keys(searchApi).map(key => {
					let func = searchApi[key].search(this.keyword)
				    searchApiReq.push(func)
					searchApiResult.push({
						api: searchApi[key],
						result: [],
					})
				})
				// results的结果是一个数组，分别代表接口的数据
				let result = await Promise.all(searchApiReq)
				uni.hideLoading()
				
				Object.keys(searchApiResult).map(key => {
				    searchApiResult[key].result = result[key]
				})
				this.results = searchApiResult
				this.tabId = -1
			},
			gowxcomment(){
				plugin.openComment({
				  // wx_pay_id: '4200001729202306024807578', // 交易评价类账号选填
				  success: (res)=>{
				    console.log('plugin.openComment success', res)
				  },
				  fail: (res) =>{
				    console.log('plugin.openComment fail', res)
				  }
				})
			},
			tabSel(id){
				this.tabId = id
			}
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
	.wrapper{
		.head{
			background-color: #ffffff;
			padding-top: 30rpx;
			&-search{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 690rpx;
				height: 80rpx;
				margin: 0 auto;
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
			&-tab{
				margin: 0 30rpx;
				margin-top: 10rpx;
				display: flex;
				&-item{
					height: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					font-size: 32rpx;
					margin-right: 30rpx;
					&.active{
						font-weight: 700;
						&::after{
							border-bottom: 2px solid #38f;
							content: "";
							width: 100%;
							position: absolute;
							bottom: -1px;
							left: 0;
							width: 100%;
						}
					}
				}
			}
		}
		.result{
			&-list{
				margin: 30rpx;
				&-item{
					padding: 20rpx;
					background-color: #ffffff;
					margin-bottom: 30rpx;
					border-radius: 18rpx;
					position: relative;
					&-content{
						display: flex;
						margin-top: 20rpx;
						&-left{
							width: calc(50% - 5px);
							margin-right: 10px;
							&-name{
								font-size: 30rpx;
								color: #646a73;
							}
							&-value{
								width: 100%;
								overflow:hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								margin-top: 10rpx;
								font-size: 30rpx;
								color: #1e80ff;
							}
						}
						&-right{
							width: calc(50% - 5px);
							&-name{
								font-size: 30rpx;
								color: #646a73;
							}
							&-value{
								width: 100%;
								overflow:hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								margin-top: 10rpx;
								font-size: 30rpx;
								color: #1f2329;
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
					&-more{
						position: absolute;
						right: 30rpx;
						top: 50%;
						transform: translateY(-50%);
						width: 30rpx;
						height: 30rpx;
						display: block;
					}
				}
			}
			&-empty{
				margin: 30rpx;
				height: 400rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				&-comment{
					margin-top: 30rpx;
					display: flex;
					align-items: center;
					&-con{
						color: #42b983;
					}
				}
			}
		}
	}
</style>
