import Vue from 'vue'
import Vuex from 'vuex'
import themeGroup from '@/components/theme/theme.js'
import { req as $post } from '@/api/index.js';
import app from "./modules/app";
Vue.use(Vuex)
const store = new Vuex.Store({
	modules: {
		app
	},
	state: {
		themeGroup,
		themeKey: uni.getStorageSync('themeKey') || 'light',
		logo: uni.getStorageSync('LOGO_IMG'),
		userinfo: uni.getStorageSync('userinfo') || {},
		token: uni.getStorageSync('token') || '',
		appName: uni.getSystemInfoSync().appName,
		kefuList: [],
        currencyConfig: {
            1: { code: 'USD', symbol: '$', name: 'U.S. Dollar' },
            2: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' }
        },

    },
	getters: {
		theme(state){
			let result = {}
			if(state.themeGroup && state.themeKey && state.themeGroup[state.themeKey]){
				result = state.themeGroup[state.themeKey]
			}
			return result
		},
		logo(state){
			return state.logo
		},
        currencyConfig(state) {
            return state.currencyConfig
        },
        getCurrencyByType: (state) => (type) => {
            return state.currencyConfig[type] || { code: 'USD', symbol: '$', name: 'US Dollar' }
        },
        userinfo(state) {
            return state.userinfo || {}
        },
        userAvatar(state) {
            return state.userinfo?.avatar || ''
        },
        username(state) {
            return state.userinfo?.username || state.userinfo?.mobile || ''
        }
	},

	mutations: {
		setUserInfo(state,info){
		    state.userinfo = info
			uni.setStorageSync('userinfo',info)
			state.token = info.token
			uni.setStorageSync('token',info.token)
		},
		setavatar(state,avatar){
		    state.userinfo.avatar = avatar
			uni.setStorageSync('userinfo', state.userinfo)
		},
		setLogo(state,logo){
		    state.logo = logo
			uni.setStorageSync('LOGO_IMG',logo)
		},
		logout(state){
			state.userinfo = {}
			uni.removeStorageSync('userinfo')
			state.token = {}
			uni.removeStorageSync('token')
		},
		SET_THEME(state, themeKey) {
			state.themeKey = themeKey;
			uni.setStorageSync('themeKey', themeKey);
			uni.setStorageSync('theme', themeKey);
		},
        // Update specific user field
        UPDATE_USER_FIELD(state, { field, value }) {
            if (state.userinfo) {
                Vue.set(state.userinfo, field, value)
                uni.setStorageSync('userinfo', state.userinfo)
            }
        }
	},
	actions: {
		updateUserAvatar(context, avatar) {
		    context.commit('setavatar', avatar)
		},
		updateUserField(context, { field, value }) {
		    context.commit('UPDATE_USER_FIELD', { field, value })
		},
		// Get app logo
		getAppLogo({ commit }) {
			const defaultLogo = uni.getStorageSync('LOGO_IMG') || '/static/logo.png'
			const tryGet = (attempt = 1) => {
				const baseApi = uni.getStorageSync('api_url') || ''
				if (!baseApi) {
					if (attempt < 4) {
						return new Promise(resolve => {
							setTimeout(() => resolve(tryGet(attempt + 1)), 300 * attempt)
						})
					}
					return Promise.resolve(defaultLogo)
				}
				return $post('/publics/logo')
					.then(res => (res && res.data && res.data.logo) ? res.data.logo : defaultLogo)
					.catch(() => defaultLogo)
			}
			return tryGet().then(logo => {
				commit('setLogo', logo)
				return logo
			})
		},

		// Initialize app - can be called when app starts
		initApp({ dispatch }) {
			// Get app logo
			dispatch('getAppLogo')

		},

		toggleTheme({ commit, state }) {
			const newThemeKey = state.themeKey === 'dark' ? 'light' : 'dark';
			commit('SET_THEME', newThemeKey);
		},
		initialTheme({ commit, state }) {
			// Only set theme if not already initialized
			// if (!state.themeKey || state.themeKey === 'light') {
			// 	const themeKey = uni.getStorageSync('themeKey') || uni.getStorageSync('theme') || 'light';
			// 	commit('SET_THEME', themeKey);
			// }

			try {
				let theme = uni.getStorageSync('themeKey') || uni.getStorageSync('theme') || 'light';
				if (!theme) {
					// Try system preference when available
					try {
						// #ifdef H5
						const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
						if (prefersDark) theme = 'dark'
						// #endif
						// #ifndef H5
						const sys = uni.getSystemInfoSync && uni.getSystemInfoSync()
						if (!theme && sys && sys.theme) theme = sys.theme
						// #endif
					} catch(e) {}
				}
				commit('SET_THEME', theme || state.themeKey || 'light')
			} catch(e) {
				commit('SET_THEME', state.themeKey || 'light')
			}
		},
	}
})
export default store
