import {log as $log,error as $error} from './index'
import decodeFunc from '../api/decode'

export default env => {

    /* API默认嗅探时间 */
    const {VUE_APP_API_SNIFFERS_TIME} = env
    //console.log(`API默认嗅探时间${VUE_APP_API_SNIFFERS_TIME}S`)
    uni.setStorageSync('api_sniffers_time',VUE_APP_API_SNIFFERS_TIME)
    
    /* 通过访问指定接口嗅探API是否正常 */
    const sniffers_func = async api => {

        /* 准备计算时间差 */
        const timestamp1 = new Date().getTime()

        /* 语言版本 */
        var lang = uni.getStorageSync('language')
		if (lang == '') lang = 'zh-cn'

        /* 嗅探时间设置 */
        let timeout = VUE_APP_API_SNIFFERS_TIME * 1000
        let temporyTime = uni.getStorageSync('api_sniffers_time')
        if (temporyTime){
            temporyTime = parseInt(temporyTime)
            timeout = temporyTime * 1000
        }
        //console.log(`当前请求最大链接时间为：${timeout}`)

        /* 嗅探请求 */
        const request_func = () => {
            return new Promise((resolve,reject) => {
                const url = `${api}/api/index/get_curr?lang=${lang}`

                uni.request({
                    url,
                    method:'post',
                    timeout,
                    header: {
                        // "Content-Type": "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    success(){
                        resolve()
                    },
                    fail(){
                        reject()
                    }
                })

            })
        }

        /* 队列请求，计算时间差，决定是否递归 */
        const request_todo = async (log=``,count=0) => {

            /* 记录日志 & 失败次数 */
            try {
                await request_func()
                log += `${api} 嗅探成功 \n`
                return log

            } catch (error) {

                /* 嗅探失败，判断时间差，决定是否递归 */
                const timestamp2 = new Date().getTime()
                const timestamp3 = timeout - (timestamp2 - timestamp1)
                //console.log(`距离超限还有${timestamp3}ms`)

                count += 1
                log = `${api} 嗅探失败 ${count} 次 \n`

                /* 递归 */
                if(timestamp3 > 0){
                    await request_todo(log,count)
                /* 回调 */
                }else{
                    /* 在最大连接时间内未得到响应 */
                    /* 单次失败应该在这里提交日志 */
                    throw log
                }
            }
        }

        return await request_todo()
    }

    /* 循环解密，嗅探备用API */
    const loop_sniffers_func = async checkList => {
        
        /* 嗅探提示 */
	    uni.showToast({title:'数据请求中',duration:1000 * 60,icon:'loading'})

        /* 请求文件并解密，之后请求(闭包) */
        const sniffers_func2 = async url => {
            return new Promise(resolve => {
                uni.request({
                    url,
                    dataType:'text',
                    success(response){
                        // 解密响应哈希
                        const result = decodeFunc(response.data || '')
                        if (result) {
                            resolve(result)
                        }else{
                            resolve(false)
                        }
                    },
                    fail(){
                        resolve(false)
                    }
                })
            })
        }

        /* 记录日志 */
        let logs = ''

        /* 开始循环 */
        const loop_func2 = async (urlIndex) => {
            const urlStr = checkList[urlIndex]
            /* 解密API地址 */
            const urlResult = await sniffers_func2(urlStr)
            if (urlResult){

                /* 继续嗅探接口 */
                try {
                    logs += await sniffers_func(urlResult)

                    return {url:urlResult,logs}

                } catch (logs2) {
                    // 不是最后一次嗅探
                    if(urlIndex != checkList.length){
                        logs += logs2
                        return await loop_func2(urlIndex+1)
                    }else{
                        // 已经是最后一次嗅探

                        /* 提交日志... */
                        uni.hideToast()
                        $error(400)
                        return false
                    }
                }

            }else{
                if(urlIndex != checkList.length-1){
                    await loop_func2(urlIndex+1)
                }else{
                    return false
                }
            }
        }
        const result = await loop_func2(0)
        return result
    }

    return new Promise(resolve => {

        /* 是否执行嗅探 */
        const {VUE_APP_API_SNIFFERS = false,VUE_APP_DEFAULT_API_URL=''} = env
        if (VUE_APP_API_SNIFFERS){
            /* 使用默认API地址 */
            $log(`API域名检测:${VUE_APP_DEFAULT_API_URL}`)
            sniffers_func(VUE_APP_DEFAULT_API_URL)
            .then(() => {
                $log({message:`检测通过:${VUE_APP_DEFAULT_API_URL}`,vuex:true})
                resolve(VUE_APP_DEFAULT_API_URL)
            })
            .catch(logs => {

                /* 默认嗅探失败的日志 */
                $log(`开始循环嗅探`)
                logs += '开始循环嗅探'

                /* 取出备用嗅探列表 */
                const {VUE_APP_API_SNIFFERS_LIST = []} = env
                loop_sniffers_func(VUE_APP_API_SNIFFERS_LIST).then(result => {
                    
                    const {url,logs:logs2} = result

                    /* 提交日志... */
                    //console.log(logs + logs2)


                    resolve(url)

                }).catch(() => {
                    resolve(false)
                })
                
            })
        /* 强行使用默认域名访问 */
        }else{
            resolve(VUE_APP_DEFAULT_API_URL)
        }

    })
}