var timer = true
let router = {
	push: function(obj) {
		let url
		if (!timer) {
			return
		}
		timer = false
		if (typeof obj == 'string') {
			url = obj
		} else if(obj.query) {
			url = obj.path + '?'
		}else {
			url = obj.path
		}
		let arr = []
		if (obj.query) {
			for (let key in obj.query) {
				arr.push(`${key}=${obj.query[key]}`)
			}
			url += arr.join('&')
		}
		uni.navigateTo({
			url: url
		})
		setTimeout(() => {
			timer = true
		}, 500)
	},
	redirectTo: function(obj) {
		let url
		if (!timer) {
			return
		}
		timer = false
		if (typeof obj == 'string') {
			url = obj
		} else if(obj.query) {
			url = obj.path + '?'
		}else {
			url = obj.path
		}
		let arr = []
		if (obj.query) {
			for (let key in obj.query) {
				arr.push(`${key}=${obj.query[key]}`)
			}
			url += arr.join('&')
		}
		uni.redirectTo({
			url: url
		})
		setTimeout(() => {
			timer = true
		}, 500)
	},
	reLaunch: function(obj) {
		let url
		if (!timer) {
			return
		}
		timer = false
		if (typeof obj == 'string') {
			url = obj
		} else if(obj.query) {
			url = obj.path + '?'
		}else {
			url = obj.path
		}
		let arr = []
		if (obj.query) {
			for (let key in obj.query) {
				arr.push(`${key}=${obj.query[key]}`)
			}
			url += arr.join('&')
		}
		uni.reLaunch({
			url: url
		})
		setTimeout(() => {
			timer = true
		}, 500)
	},
	goBack: function(delta) {
		if(getCurrentPages().length > 1){
			uni.navigateBack({
				delta: delta
			})
		}else {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
		
	},
	goTabBar: function(url) {
		uni.switchTab({
			url: url
		})
	}
}
//获取当前页面    路由守卫
// let page = getCurrentPages()
// return page[0].$router.currentRoute.query

export {
	router
}
