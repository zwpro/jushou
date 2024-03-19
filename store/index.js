import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/common/api/base'

import test from '@/store/test/test'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: '',
		user: {},
		statusbar: {},
		uniPlatform: '',
		settingShare: {},
		version: '1.2.0',
		logining: false,
	},
	getters: {
		//是否登录
		isLogin: state => {
			return state.token != ''
		}	
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token;
			uni.setStorageSync('token', token)
		},
		SET_USER(state, payload) {
			state.user = payload
			uni.setStorageSync('user', payload)
		},
		SET_SETTINGSHARE(state, payload) {
		    state.settingShare = payload
		},
		SET_STATUSBAR(state, payload) {
		    state.statusbar = payload
		},
		SET_UNIPLATFORM(state, payload) {
		    state.uniPlatform = payload
		},
		SET_LOGINING(state, payload){
			state.logining = payload
		}
	},
	actions: {
		init({ dispatch, commit }) {
			let token = uni.getStorageSync('token');
			if (token) {
				commit('SET_TOKEN', token);
				dispatch('userInfo')
			}
			let user = uni.getStorageSync('user');
			if (user) {
				commit('SET_USER', user);
			}
			dispatch('getSystemInfo')
			dispatch('statusbar')
		},
		statusbar({ commit }, payload) {
			var height = {
				statusBarHeight: 0, // 状态导航栏高度
				navHeight: 0, // 总体高度
				navigationBarHeight: 0, // 导航栏高度(标题栏高度)
				customHeight: 0,
				customTop: 0,
			}
			// 状态栏高度
			height.statusBarHeight = uni.getSystemInfoSync().statusBarHeight
			if(!uni.canIUse('getMenuButtonBoundingClientRect')){
				return
			}
			// 获取微信胶囊的位置信息 width,height,top,right,left,bottom
			const custom = uni.getMenuButtonBoundingClientRect()
			// console.log(custom)
			//胶囊top
			height.customTop = custom.top
			//胶囊高度
			height.customHeight = custom.height
			// 导航栏高度(标题栏高度) = 胶囊高度 + (顶部距离 - 状态栏高度) * 2
			height.navigationBarHeight = custom.height + (custom.top - height.statusBarHeight) * 2
			// console.log("导航栏高度："+this.globalData.navigationBarHeight)
		 
			// 总体高度 = 状态栏高度 + 导航栏高度
			height.navHeight = height.navigationBarHeight + height.statusBarHeight
		    commit('SET_STATUSBAR', height);
		},
		/**
		 * 系统信息
		 */
		async getSystemInfo({dispatch, commit }){
			var uniPlatform  = uni.getSystemInfoSync().uniPlatform
			commit('SET_UNIPLATFORM', uniPlatform);
		},
		/**
		 * 设置
		 */
		async getSettingShare({ dispatch, commit }, payload) {
			
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			var share = {
				title: '搜一下，全都有',
				path:  '/pages/index/index'
			}
			switch (page.route){
				case 'pages/search/detail':
					share.title = `「${payload.name}」`
					share.path = "/pages/index/index?path=" + encodeURIComponent(`/pages/search/detail?apiId=${page.options.apiId}&sid=${page.options.sid}`)
					break;
				default:
					break;
			}
			return share
		},
		async setUserData({ dispatch, commit }, payload) {
			const { token, user } = payload;
			commit('SET_TOKEN', token);
			commit('SET_USER', user);
		},
		async checkLogin({ dispatch, commit, state}, force) {
			if(force || !state.token){
				commit('SET_TOKEN', '');
				commit('SET_USER', {});
				dispatch('goLogin')
				return false
			}
			return true
		},
		goLogin({ state, commit }) {
			if(!state.logining){
				uni.navigateTo({
					url: '/pages/user/login'
				})
			}
			commit('SET_LOGINING', true)
			return
		},
		/**
		 * 用户信息
		 */
		async userInfo({ dispatch, commit }) {
			const res = await api.userInfo();
			if (res.code === 200) {
				commit('SET_USER', res.data);
				return res.data
			}
		    return {};
		},
	},
	modules: {
	    test
	}
})

export default store
