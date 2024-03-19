import http from './http'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */

const rankList = () => {
	return http.requests({
		url: 'https://duanju.abya.cn/api.php',
		method: 'get',
		data: {
			
		},
	})
}

// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	rankList,
}