import App from './App'
import messages from './static/locale/index'

import _env from './env.js'
const env = _env()

import store from './store'

// #ifndef VUE3

import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { router } from './router/index.js'
import './api/multi_api.js'
import { req,api,clearRequestCache } from './api/index.js'
import  utils  from './api/utils.js'
import {toast} from './api/tos.js'
import * as filters from './helper/filters.js'
import uView from "uview-ui";
Vue.use(uView);

import myNav from "@/components/my-navbar/index.vue"
import TabBar from '@/components/tabBar/tabBar.vue'

uni.setStorageSync("current_version", uni.getAppBaseInfo().appWgtVersion);
Vue.component('myNav', myNav)
Vue.component('TabBar', TabBar)

// Register global filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.use(VueI18n)
const i18n = new VueI18n({
	locale: env.VUE_APP_LANG,
	messages
})


Vue.prototype.upload = env.VUE_APP_DEFAULT_API_URL
Vue.prototype.bapi = api
Vue.prototype.$store = store
Vue.config.productionTip = false
Vue.prototype.router = router
Vue.prototype.post = req
Vue.prototype.tos = toast
Vue.prototype.$utils = utils
Vue.prototype.clearRequestCache = clearRequestCache

Vue.prototype.checktype =(type)=> {
	if(type=='sh'){
		return '沪'
	}
	if(type=='sz'){
		return '深'
	}
	if(type=='bj'){
		return '京'
	}
	if(type=='kc'){
		return '科创'
	}
	if(type=='cy'){
		return '创业'
	}
	return type
}

App.mpType = 'app'
const app = new Vue({
  i18n,
  ...App,
  store
})
app.$mount()
// #endif

const translate = (localeKey) => {
    const locale = uni.getStorageSync('language') || env.VUE_APP_LANG
    const hasKey = i18n.te(localeKey, locale) // Check if the key exists
    const translatedStr = i18n.t(localeKey)
    if (hasKey) {
        return translatedStr
    }
    return localeKey
}
export { translate }
