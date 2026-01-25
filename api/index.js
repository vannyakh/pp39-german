import Vue from 'vue'
Vue.prototype.httpLoading = false


const apiBackups = uni.getStorageSync('backup_url')
const api = apiBackups[Math.floor(Math.random() * apiBackups.length)] + '/api'
// console.log(api)
// console.log('apiBackups',apiBackups)

const req = (url, data, isloading = false) => {
	return new Promise((resolve, reject) => {
		isloading && uni.showLoading({
			mask: true
		})

		var lang = uni.getStorageSync('language')

		if (uni.getStorageSync('token')) {
			data = {
				...data,
				token: uni.getStorageSync('token')
			}
		}

		/* 从全局属性中取出api地址 */
		const apiUrl = uni.getStorageSync('api_url') || api
		// const apiUrl = ''
		if (!apiUrl || apiUrl == '/api') {
			// show modal and confirm to restart
			uni.showModal({
				title: 'Hint',
				content: 'Network abnormality, please restart the application',
				showCancel: false,
				success: function (res) {
					if (res.confirm) {

						// check if h5 or app
						//#ifdef APP-PLUS
						plus.runtime.restart()
						//#endif
						//#ifndef H5
						window.location.reload()
						//#endif
					}
				}
			})
		}

		// 下载更新包，强制更新
		const downloadWgt = (appDownUrl, appVersion) => {

			Vue.prototype.httpLoading = true
			//console.log(`开始热更（${appDownUrl})`)

			// 下载wgt文件
			uni.downloadFile({
				url: appDownUrl,
				success: (downloadResult) => {
					//console.log(downloadResult)
					if (downloadResult.statusCode === 200) {
						plus.runtime.install(
							downloadResult.tempFilePath,
							// 强制更新
							{ force: true },
							// 成功回调
							function () {
								uni.hideLoading()

								// 覆盖缓存版本
								uni.setStorageSync('appVersion', appVersion)

								// 重启应用
								plus.runtime.restart()

								return Promise.resolve()
							},
							// 失败回调
							function () {
								uni.showToast({
									title: 'Update failed',
									duration: 2000
								})
								uni.hideLoading()
								return Promise.resolve()
							},
						)

					}
				}
			})

		}

		uni.request({
			url: apiUrl + url + "?lang=" + lang,
			data: data,
			header: {
				// "Content-Type": "application/json",
				"Content-Type": "application/x-www-form-urlencoded"
			},
			// sslVerify: false,
			method: 'POST',
			success: function (res) {
				// return;
				resolve(res.data)
			},
			fail: function (e) {
				console.log('error')
				reject(e)
			},
			complete(res) {
				// console.log('completed')
				isloading && uni.hideLoading()
				// console.log(api+url)
				// console.log('completed',res)
				// return;
				if (res.data.code == 0) {
					if (res.data.msg != '') {
						uni.showToast({
							title: res.data.msg,
							icon: "none",
							duration: 2000,
						})
					}
				}
				if (res.data.code == 401) {
					// Clear all global intervals before logout
					getApp().globalData.clearAllIntervals()
					// uni.clearStorageSync()
					uni.removeStorageSync('token');
					uni.removeStorageSync('userinfo');
					uni.reLaunch({
						url: "/pages/login/index"
					})
				}
			}
		})
	})
}

/**
 * Clear the request cache
 * @param {string} [urlPattern] Optional substring or regex (as string) to filter which cache keys to remove
 *
 * Keys considered as request cache:
 * - Starts with 'api_cache_'
 * - Starts with 'REQ_CACHE_'
 * - Starts with 'HTTP_CACHE_'
 */
const clearRequestCache = (urlPattern) => {
    try {
        const info = uni.getStorageInfoSync && uni.getStorageInfoSync()
        const keys = (info && info.keys) || []

        let regex = null
        if (urlPattern) {
            try {
                // If caller passes a regex string like ".*publics/version", support it
                regex = new RegExp(urlPattern)
            } catch (e) {
                // Fallback to simple substring match if invalid regex
                regex = null
            }
        }

        const isReqCacheKey = (key) => (
            key.startsWith('api_cache_') ||
            key.startsWith('REQ_CACHE_') ||
            key.startsWith('HTTP_CACHE_')
        )

        keys.forEach((k) => {
            if (!isReqCacheKey(k)) return
            if (regex) {
                if (!regex.test(k)) return
            } else if (urlPattern) {
                if (!k.includes(urlPattern)) return
            }
            try { uni.removeStorageSync(k) } catch (e) {}
        })

        // #ifdef APP-PLUS
        try { plus.cache.clear && plus.cache.clear(() => {}, () => {}) } catch (e) {}
        // #endif
    } catch (e) {
        console.warn('clearRequestCache failed:', e)
    }
}
export {
	req,api,clearRequestCache
}
