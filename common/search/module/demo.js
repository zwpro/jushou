export default {
	id: 'demo',
	name: '示例搜索源1',
	search(keyword){
		return new Promise((resolve,reject)=>{
			uni.request({
				url: 'https://baidu.com', //http://demo.com
				method: 'GET',
				data: {
					keyword
				},
				success(res){
					//mock
					var result = []
					if(res.statusCode == 200){
						for (let s of [1, 2]) {
							result.push({
								sid: 'sid',
								name: `测试资源${s}`,
								data: {
									date: '2024/03/18',
									link: 'https://pan.quark.cn/s/',
								},
								from: {
									logo: 'https://pan.quark.cn/favicon.ico',
									name: '夸克',
								}
							})
						}
					}
					resolve(result)
				},
				fail(error){
					reject(error)
				},
				complete(){
					
				}
			})
		})
	},
	detail(sid){
		return new Promise((resolve,reject)=>{
			uni.request({
				url: 'https://baidu.com', //http://demo.com
				method: 'GET',
				data: {
					sid
				},
				success(res){
					//格式
					var result = {}
					if(res.statusCode == 200){
						result = {
							sid: 'sid',
							name: '测试资源',
							data: {
								date: '2024/03/18',
								link: 'https://pan.quark.cn/s/',
							},
							from: {
								logo: 'https://pan.quark.cn/favicon.ico',
								name: '夸克',
							}
						}
					}
					resolve(result)
				},
				fail(error){
					reject(error)
				},
				complete(){
					
				}
			})
		})
	}
}