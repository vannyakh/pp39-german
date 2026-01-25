import _env from '../env.js';
const { VUE_APP_VERSION_API_URL } = _env();
console.log('UPDATE API:', VUE_APP_VERSION_API_URL)
// return
uni.request({
    url: VUE_APP_VERSION_API_URL,
	sslVerify: false,
    success: (res) => {
        if (res.statusCode === 200) {
            res = res.data;
            if (res.data.code == 1) {
                let dowloadUrl = res.data.url;
                let version = res.data.version;
                if (uni.getStorageSync("current_version") != version) {
                    uni.navigateTo({
                        url: '/pages/AppUpdate/index'
                    })
                }
            }
        }
    }
})
