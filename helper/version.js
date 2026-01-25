import _env from '../env'
const env = _env()

/* 去除版本号上的'.'，转为整型 */
const banben_func1 = banben => {
    banben = banben.replace(/\./g,'')
    return parseInt(banben)
}

/**
 * 版本侦测
 * 
 * 通过在阿里云的文本文件返回，版本号（x.x.x), 包地址, API嗅探最大链接时间
 */

const NODE_ENV = process.env.NODE_ENV

// 下载更新包，强制更新
const downloadWgt = (appDownUrl,appVersion,save=true) => {

    uni.showLoading({title:"updating...",mask:true})

    // 下载wgt文件
    uni.downloadFile({
        url:appDownUrl,
        success: (downloadResult) => { 
            if (downloadResult.statusCode === 200) {
                plus.runtime.install(
                    downloadResult.tempFilePath,
                    // 强制更新
                    {force: true},
                    // 成功回调
                    function(){
                        uni.hideLoading()
                        
                        // 覆盖缓存版本
                        if (save){
                            uni.setStorageSync('appVersion',appVersion)
                        }else{
                            // 从 API 强制覆盖版本
                            const version_strike = uni.getStorageSync('appVersionStrike')
                            uni.setStorageSync('appVersion',version_strike)
                            uni.removeStorageSync('appVersionStrike')
                        }

                        // 重启应用
                        plus.runtime.restart()

                        return Promise.resolve()
                    },
                    // 失败回调
                    function(){
                        uni.showToast({
                            title: '更新失败',
                            duration:2000
                        })
                        uni.hideLoading()

                        return Promise.resolve()
                    },
                )
                
            }
        }
    })

}

// 下载更新包，测试方法
const downloadWgt2 = () => {
    //console.log('下载更新包....')
    return Promise.resolve()
}

// 侦测方法 （APP启动）
/**
 * 
 * @param save 如果从外部设置为false，则停止缓存阿里云上的版本号
 * 这是为了避免API端版本和阿里云版本不一致时，发生重复更新的可能
 * 所以这个被设置为false的场景，也应该是接口响应判断出版本更新时
 */

const checkFunc = (url='',localVersion=0,save=true) => {
    //console.log(`开始检测版本(本地版本：${localVersion})`)
    return new Promise(resolve => {
        // 阿里云版本文件
        uni.request({
            url,
            success(response){
                const decodeResult = response.data.split(';')
                if(decodeResult.length){
                    
                    // 版本号
                    let _cloudVersion = decodeResult[0]
                    // 包地址
                    const appDownUrl = decodeResult[1]
                    // API嗅探最大链接时间
                    const appApiMaxTime = decodeResult[2] || 0
                    if(appApiMaxTime){
                        uni.setStorageSync('api_sniffers_time',appApiMaxTime)
                    }
                    
                    /* 版本号比对 */
                    const cloudVersion = banben_func1(_cloudVersion)
                    //console.log(`开始比对版本 ${cloudVersion} >>> ${localVersion}`)
                    if (cloudVersion > localVersion || !save){
                        //console.log('执行版本更新')
                        
                        /* 下载更新包 */
                        if (save){
                            downloadWgt(appDownUrl,_cloudVersion)
                        }else{
                            downloadWgt(appDownUrl,_cloudVersion,false)
                        }

                        resolve()
                    }else{
                        //console.log('跳过版本更新')
                        resolve()
                    }
                    //console.log(`接口嗅探时间变更为${appApiMaxTime}s`)
                }else{
                    resolve()
                }
                
            }
        })

    })
}

// 侦测方法 （接口响应）
export const checkFunc2 = res => {
    const {header} = res
    if(header){

        // 更新包正在安装（防抖）
        if (uni.getStorageSync('appInstall')){
            return 
        }

        let {VERSION:version2 = '',version = ''} = header
        let _appVersion = version || version2

        /* 如果拿到版本跟本地版本比对 */
        if (_appVersion) {
            let appVersion = parseInt(_appVersion)
            //console.log(`服务端返回版本：${appVersion}`)

            // 取得本地缓存
            const {VUE_APP_VERSION} = env
            let appVersion2 = uni.getStorageSync('appVersion') || VUE_APP_VERSION
            appVersion2 = banben_func1(appVersion2)

            // 执行版本更新
            if (appVersion > appVersion2){
                const {VUE_APP_VERSION_URL} = env

                // 打开防抖
                uni.setStorageSync('appInstall',true)

                /**
                 * 注意，如果API端返回更新版本，则已API端版本为主，在这里强制覆盖
                 * 并且 save 设为 false，防止阿里云版本重复覆盖，死结
                 */
                uni.setStorageSync('appVersionStrike',_appVersion)
                checkFunc(VUE_APP_VERSION_URL,appVersion,false)
            }

        }
    }
}

// 默认侦测
export const appVersionDefaultCheck = (appVersion = '') => {
    if (NODE_ENV != 'development'){

        const {VUE_APP_VERSION,VUE_APP_VERSION_URL} = env
        if (appVersion == ''){
            // 取得本地缓存
            appVersion = uni.getStorageSync('appVersion') || VUE_APP_VERSION
            appVersion = banben_func1(appVersion)
        }

        checkFunc(VUE_APP_VERSION_URL,appVersion)
    }
}