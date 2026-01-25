import _env from '../env.js';
const { VUE_APP_OSS_API_URL } = _env();
var oss_api_list = [];
var requestApi = '';
let showingOfflineModal = false;

uni.getNetworkType({
    success: function(res) {
        console.log('network type first: ' + res.networkType);
        if (res.networkType === 'none') {
            setTimeout(() => {
                if (showingOfflineModal) return;
                showingOfflineModal = true;
                uni.showModal({
                    title: 'Network Error',
                    content: 'Please check your network connection',
                    showCancel: false,
                    confirmText: 'Confirm',
                    success: function(res) {
                        //#ifdef APP-PLUS
                        plus.runtime.restart();
                        //#endif
                        //#ifdef H5
                        location.reload();
                        //#endif
                        showingOfflineModal = false;
                    },
                    fail: function() {
                        showingOfflineModal = false;
                    }
                });
            }, 3000);
        }
    }
})

uni.onNetworkStatusChange(function(res) {
    const offline = res && res.isConnected === false;
    console.log('network change:', res);
    if (offline) {
        if (showingOfflineModal) return;
        showingOfflineModal = true;
        uni.showModal({
            title: 'Network Error',
            content: 'Please check your network connection',
            showCancel: false,
            confirmText: 'Confirm',
            success: function(res) {
                //#ifdef APP-PLUS
                plus.runtime.restart();
                //#endif
                //#ifdef H5
                location.reload();
                //#endif
                showingOfflineModal = false;
            },
            fail: function() {
                showingOfflineModal = false;
            }
        });
    }
})
uni.request({
    url: VUE_APP_OSS_API_URL,
    success: (res) => {
        const list = String(res.data || '')
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean)
        oss_api_list = list;
        uni.setStorageSync('backup_url', oss_api_list)
        randomApiUrl(oss_api_list);
    },
    fail: (e) => {
        const cached = uni.getStorageSync('backup_url') || []
        oss_api_list = (cached || []).filter(Boolean)
        randomApiUrl(oss_api_list);
    }
});

function randomApiUrl(oss_list) {
	const pool = (oss_list && oss_list.length ? oss_list : oss_api_list).filter(Boolean)
	if (!pool.length) return null
	let api = pool[Math.floor(Math.random() * pool.length)];
	console.log(api,'api')
	uni.setStorageSync('api_url',api+'/api')
	return api
}
