// 不含icon提示框
const toast = str => {
	return new Promise((resolve, reject) => {
		uni.showToast({
			title: str,
			icon: "none",
			duration: 2000,
			position: "bottom",
			mask: true,
			success: () => {
				setTimeout(() => {
					resolve
				}, 2000)
			}
		})
	})
};
// 成功提示框
const successToast = str => {
	return new Promise((resolve, reject) => {
		uni.showToast({
			title: str,
			icon: "success",
			duration: 2000,
			success: () => {
				setTimeout(() => {
					resolve()
				}, 2000)
			}
		})
	})
};
// loading
const showLoading = () => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			mask: true,
			success: () => {
				resolve()
			}
		})
	})
};
// tipLoading ==>提示loading
const tipLoading = str => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: str,
			mask: true,
			success: () => {
				resolve()
			}
		})
	})
};
// 隐藏loading
const hideLoading = () => {
	return new Promise((resolve, reject) => {
		uni.hideLoading({
			success: () => {
				resolve()
			}
		})
	})
};
export {
	toast,
	successToast,
	showLoading,
	tipLoading,
	hideLoading,
}