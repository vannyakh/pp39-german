/* vuex */
import store from '../store/index'

/**
 * 插入系统日志
 */
export const log = info => {
    
    let message = ''
    
    /* 以字符形式提交 */
    if (typeof info == 'string'){
        message = info
    }else{
        const {message:message2=''} = info
        message = message2
    }

    /* 开始处理 */
    if (message) {
        /**
         * vuex: 是否记录到日志页面
         */
        const {vuex=true} = info

        if(vuex){
            store.commit('setLogs',{
                message
            })
        }

        /* 输出到宿主控制台 */
        //console.log(message)
    }
}

/**
 * 报错弹窗
 */
export const error = () => {}





export const downloadAPP = () => {
    
    const platform = uni.getSystemInfoSync().platform

    // #ifdef WEB
    if (platform == 'android'){
        window.open(store.getters['appDownload1'])
    }
    if (platform == 'ios'){
        window.open(store.getters['appDownload2'])
    }
    // #endif

    // #ifdef APP-PLUS
    if (platform == 'android'){
        plus.runtime.openURL(store.getters['appDownload1'])
    }
    if (platform == 'ios'){
        plus.runtime.openURL(store.getters['appDownload2'])
    }
    // #endif
}


export const downloadAPP2 = list => {
    
    const platform = uni.getSystemInfoSync().platform

    const appDownload1 = list[0] || ''
    const appDownload2 = list[1] || ''

    // #ifdef WEB
    if (platform == 'android'){
        window.open(appDownload1)
    }
    if (platform == 'ios'){
        window.open(appDownload2)
    }
    // #endif

    // #ifdef APP-PLUS
    if (platform == 'android'){
        plus.runtime.openURL(appDownload1)
    }
    if (platform == 'ios'){
        plus.runtime.openURL(appDownload2)
    }
    // #endif
}