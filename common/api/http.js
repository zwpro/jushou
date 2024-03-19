/**
 * 通用uni-app网络请求
 * 基于 Promise 对象实现更简单的 request 使用方式，支持请求和响应拦截
 */
import store from '@/store'
import env from '@/env.js'
/*
// 开放的接口
import http from './interface'

http.config.baseUrl = "http://localhost:8080/api/"

http.request(url:'user/list',method:'GET').then((res)=>{
	console.log(JSON.stringify(res))
})
http.get('user/list').then((res)=>{
	console.log(JSON.stringify(res))
})
http.get('user/list', {status: 1}).then((res)=>{
	console.log(JSON.stringify(res))
})
http.post('user', {id:1, status: 1}).then((res)=>{
	console.log(JSON.stringify(res))
})
http.put('user/1', {status: 2}).then((res)=>{
	console.log(JSON.stringify(res))
})
http.delete('user/1').then((res)=>{
	console.log(JSON.stringify(res))
}) 

*/
var baseUrl = env[process.env.NODE_ENV].baseUrl


export default {
	config: {
		baseUrl: baseUrl, 
		header: {
			'Content-Type':'application/json;charset=UTF-8',
		},  
		data: {},
		method: "GET",
		dataType: "json",  /* 如设为json，会对返回的数据做一次 JSON.parse */
		responseType: "text",
		timeout: 10000,
		success() {},
		fail() {},
		complete() {}
	},
	interceptor: {
		request: null,
		response: null
	},
	request(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.dataType = options.dataType || this.config.dataType
		options.url = options.baseUrl + options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method
		//TODO 加密数据
		
		//TODO 数据签名
		/* 
		_token = {'token': getStorage(STOREKEY_LOGIN).token || 'undefined'},
		_sign = {'sign': sign(JSON.stringify(options.data))}
		options.header = Object.assign({}, options.header, _token,_sign) 
		*/
		let version = store.state.version
		options.header = Object.assign({}, options.header, {'Version': version})
		
	    let token = store.state.token
	    if(token){
	    	options.header = Object.assign({}, options.header, {'Authorization': 'Bearer ' + token})
	    }
		let uniPlatform = store.state.uniPlatform
		options.header = Object.assign({}, options.header, {'UniPlatform': uniPlatform})
		let fromUserId = store.state.fromUserId
		options.header = Object.assign({}, options.header, {'FromUserId': fromUserId})
		
		return new Promise((resolve, reject) => {
			let _config = null
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				// 统一的响应日志记录
				_reslog(response)
				console.log(response)
				if (statusCode === 200) { //成功
					// if(response.data.code == 200){
						resolve(response.data);
					// }else{
					// 	reject(response.data)
					// }
				} else {
					reject(response.data)
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			if (this.interceptor.request) {
				this.interceptor.request(_config)
			}
			
			// 统一的请求日志记录
			//_reqlog(_config)

			uni.request(_config);
		});
	},
	get(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'GET'  
		return this.request(options)
	},
	post(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	put(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	delete(url, data, options) {
		if (!options) {
			options = {}
		}
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
	//文件上传
	uploadFile(options) {
		if (!options) {
			options = {}
		}
		options.baseUrl = options.baseUrl || this.config.baseUrl
		options.url = options.baseUrl + options.url
		return new Promise((resolve, reject) => {
			let _config = null
			
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				// 统一的响应日志记录
				_reslog(response)
				if (statusCode === 200) { //成功
					response.data = JSON.parse(response.data)
					if(response.data.code == 200){
						resolve(response.data);
					}else{
						reject(response.data)
					}
				} else {
					reject(response.data)
				}
			}

			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			uni.uploadFile(_config);
		});
	},
	requests(options) {
		if (!options) {
			options = {}
		}
		options.dataType = options.dataType || this.config.dataType
		options.url = options.url
		options.data = options.data || {}
		options.method = options.method || this.config.method
		//TODO 加密数据
		
		//TODO 数据签名
		/* 
		_token = {'token': getStorage(STOREKEY_LOGIN).token || 'undefined'},
		_sign = {'sign': sign(JSON.stringify(options.data))}
		options.header = Object.assign({}, options.header, _token,_sign) 
		*/

		return new Promise((resolve, reject) => {
			let _config = null
			options.complete = (response) => {
				let statusCode = response.statusCode
				response.config = _config
				if (this.interceptor.response) {
					let newResponse = this.interceptor.response(response)
					if (newResponse) {
						response = newResponse
					}
				}
				console.log(response)
				if (statusCode === 200) { //成功
					// if(response.data.code == 200){
						resolve(response.data);
					// }else{
					// 	reject(response.data)
					// }
				} else {
					reject(response.data)
				}
			}
	
			_config = Object.assign({}, this.config, options)
			_config.requestId = new Date().getTime()

			
			// 统一的请求日志记录
			//_reqlog(_config)
	
			uni.request(_config);
		});
	},
}


/**
 * 请求接口日志记录
 */
function _reqlog(req) {
	if (process.env.NODE_ENV === 'development') {
		console.log("【" + req.requestId + "】 地址：" + req.url)
		if (req.data) {
			console.log("【" + req.requestId + "】 请求参数：" + JSON.stringify(req.data))
		}
	}
	//TODO 调接口异步写入日志数据库
}

/**
 * 响应接口日志记录
 */
function _reslog(res) {
	let code = res.data.code;
	if (process.env.NODE_ENV === 'development') {
		// console.log("【" + res.config.requestId + "】 响应结果：" + JSON.stringify(res))
	}
//TODO 除了接口服务错误外，其他错误码特殊处理
	switch(code){
		case 200:
			break;
		case 403:
			store.dispatch('checkLogin', true)
			break;
		case 405: // 开通会员页
			break;
		case 503:
			break;
		default:
			break;
	}

}

