import querystring from 'querystring'
import api from '@/common/api/base'
import store from '@/store'

var t = function(t) {
		return t < 10 ? "0" + t.toString() : t;
	},
	e = function(t) {
		return (t = t.toString())[1] ? t : "0".concat(t);
	};

export default {

	lessThenVersion(lesVersion) {
		try {
			const version = uni.getSystemInfoSync().SDKVersion;

			if (this.compareVersion(version, lesVersion) < 0) {
				return true;
			}
		} catch (e) {
			console.info(e);
		}

		return false;
	},

	compareVersion(v1, v2) {
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)

		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}

		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])

			if (num1 > num2) {
				return 1
			} else if (num1 < num2) {
				return -1
			}
		}

		return 0
	},

	async getShareMessage(page = null, title = null, image = null) {
		let path = page;
		if (!path) {
			path = this.getCurrentPageUrlWithArgs();
		}

		const res = await api.getShareInfo({
			path: path
		});
		if (res?.code !== 200) {
			return;
		}
		const share = res.data.share;

		return {
			title: share.title,
			imageUrl: share.imageUrl || '',
			path: share.path || '/pages/index/index'
		};
	},

	async getShareTimeline(page = null, title = null, image = null) {
		let path = page;
		if (!path) {
			path = this.getCurrentArgsOfPage();
		}

		const data = await api.getShareInfo({
			path: path
		});
		const share = data.data.share;

		return {
			title: share.title,
			imageUrl: share.imageUrl || '',
			path: path || '',
		};
	},

	navTo(data) {
		switch (data.target) {
			case "page":
				uni.navigateTo({
					url: data.package.path
				});
				break;

			case "tab":
				uni.switchTab({
					url: data.package.path,
				});
				break;

			case "minapp":
				uni.navigateToMiniProgram({
					appId: data.package.appid,
					path: data.package.path,
				});
				break;

			case "url":
				if (!data.package.url || data.package.url === '#') {
					break;
				}

				uni.navigateTo({
					url: `/pages/webview/webview?url=${encodeURIComponent(
            data.package.url
          )}`,
				});
				break;
			case "plugin":
				uni.navigateTo({
				   url: data.package.url,
				})
				break;
		}
	},

	getExtAppid() {
		try {
			// #ifdef APP-PLUS
			if (process.env.NODE_ENV === 'development') {
				return 'wx704881440329069a';
			}
			// #endif

			// #ifdef H5
			if (process.env.NODE_ENV === 'development') {
				return 'wx704881440329069a';
			}
			// #endif

			if (uni.getExtConfigSync) {
				const config = uni.getExtConfigSync();

				return config?.appid ?? null;
			}

			return null;
		} catch (err) {
			console.error(err)
		}
	},

	getExtPid() {
		try {
			// #ifdef APP-PLUS
			if (process.env.NODE_ENV === 'development') {
				return '27349231358578688';
			}
			// #endif

			// #ifdef H5
			if (process.env.NODE_ENV === 'development') {
				return '27349231358578688';
			}
			// #endif

			if (uni.getExtConfigSync) {
				const config = uni.getExtConfigSync();
				console.info('getExtConfigSync', config);

				return config?.pid ?? null;
			}

			return null;
		} catch (err) {
			console.error(err)
		}
	},

	redirectTo(path, query) {
		const url = this.buildPath(path, query);

		uni.redirectTo({
			url: url,
			success(res) {
				console.log(res);
			},
			fail(err) {
				uni.switchTab({
					url: url,
					success(res) {
						console.log(res);
					},
					fail(err) {
						console.log(err);
					}
				});
			}
		});
	},

	navigateTo(path, query) {
		const url = this.buildPath(path, query);

		uni.navigateTo({
			url: url,
			fail(err) {
				console.info(err);

				uni.switchTab({
					url: url,
					fail(err) {
						console.log(err);
					}
				});
			}
		});
	},

	switchTab(path, query) {
		const url = this.buildPath(path, query);

		uni.switchTab({
			url: url,
			success(res) {
				console.log(res);
			},
			fail(err) {
				console.log(err);
			}
		});
	},

	toHome() {
		uni.switchTab({
			url: '/pages/index/index',
			success(res) {
				console.log(res);
			},
			fail(err) {
				console.log(err);
			}
		});
	},

	buildPath(path, query) {
		let queryStr = query;
		if (!(typeof query === 'string' || query instanceof String)) {
			queryStr = querystring.stringify(query);
		}

		if (queryStr != '') {
			if (path.indexOf('?') < 0) {
				return `${path}?${queryStr}`;
			} else {
				return `${path}&${queryStr}`;
			}
		}

		return path;
	},

	getCurrentPageUrlWithArgs() {
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const url = currentPage.route;
		const options = currentPage.options;
		const urlWithArgs =
			`/${url}?` +
			Object.keys(options)
			.map((key) => `${key}=${options[key]}`)
			.join("&");
		return urlWithArgs;
	},

	getCurrentArgsOfPage() {
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const options = currentPage.options;
		const urlWithArgs =
			Object.keys(options)
			.map((key) => `${key}=${options[key]}`)
			.join("&");
		return urlWithArgs;
	},

	navigateBackThen() {
		uni.navigateBack({
			fail: function() {
				uni.switchTab({
					url: '/pages/index/index',
					success(res) {
						console.log(res);
					},
					fail(err) {
						console.log(err);
					}
				});
			}
		})
	},
	formatNowTime() {
		var t = new Date()
		var i = t.getHours(),
			s = t.getMinutes(),
			u = t.getSeconds();
		return "".concat([i, s, u].map(e).join(":"));
	},
	formatDateStr(date){
		if(!date){
			return ''
		}
		date = uni.$u.timeFormat(date, 'yyyy/mm/dd hh:MM:ss')
		var dayTs = new Date(date).setHours(0, 0, 0, 0);
		let todayTs = new Date().setHours(0, 0, 0, 0);
		var diffTs = dayTs - todayTs
		var dateStr
		switch (diffTs){
			case 0:
				dateStr = '今天'
				break;
			case 86400000:
				dateStr = '明天'
				break;
			case 172800000:
				dateStr = '后天'
				break;
			case -86400000:
				dateStr = '昨天'
				break;
			case -172800000:
				dateStr = '前天'
				break;
			default:
				dateStr = uni.$u.timeFormat(date, 'mm-dd')
				break;
		}
		return dateStr + ' ' + uni.$u.timeFormat(date, 'hh:MM')
	},
	//判断广告时候存在
	hasAd(name){
		var adId = store.state.ad
		var nameArr = name.split('.')
		for (let s of nameArr) {
			if(adId[s]){
				adId = adId[s]
			}
			else{
				adId = null
				break
			}
		}
		return adId
	}
}