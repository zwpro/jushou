/*
 * @Last Modified time: 2021-04-26 17:14:15
 */
import api from '@/common/api/base'

const ttime = datetime => {
	if (datetime == undefined || datetime == '') {
		return new Date().getTime()
	}

	return new Date(datetime.replace(/-/g, '/')).getTime()
}

export default {
	namespaced: true,
    state: {
		// 会话列表
		items: [],
	},
	getters: {
		// 对话列表
		talkItems: state => {
			return state.items.sort((a, b) => {
				return ttime(b.lastChat.updated_at) - ttime(a.lastChat.updated_at)
			})
		},
	},
	mutations: {
		addItem (state, data) {
			state.items.push(data.params)
		},
	}, 
	actions: {
		addItem ({ commit }, data) {
			commit('addItem', data)
		},
	}
}