
const state = {
  appName: uni.getSystemInfoSync().appName || 'AI',
  isLoading: false,
  API_URL: '',
  appVersion: '1.0.0',
  networkStatus: 'online',
  deviceInfo: null
}

const getters = {
  getAppName: state => state.appName,
  getApiUrl: state => state.API_URL,
  isAppLoading: state => state.isLoading,
  getNetworkStatus: state => state.networkStatus,
  getDeviceInfo: state => state.deviceInfo
}

const mutations = {
  SET_LOADING(state, status) {
    state.isLoading = status
  },
  SET_API_URL(state, url) {
    state.API_URL = url
  },
  SET_NETWORK_STATUS(state, status) {
    state.networkStatus = status
  },
  SET_DEVICE_INFO(state, info) {
    state.deviceInfo = info
  }
}

const actions = {
  // Set app loading state
  setLoading({ commit }, status) {
    commit('SET_LOADING', status)
  },

  // Set API URL
  setApiUrl({ commit }, url) {
    commit('SET_API_URL', url)
  },

  // Check and update network status
  checkNetworkStatus({ commit }) {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => {
          const networkStatus = res.networkType !== 'none' ? 'online' : 'offline'
          commit('SET_NETWORK_STATUS', networkStatus)
          resolve(networkStatus)
        },
        fail: () => {
          commit('SET_NETWORK_STATUS', 'unknown')
          resolve('unknown')
        }
      })
    })
  },

  // Get device information
  getDeviceInfo({ commit }) {
    return new Promise((resolve) => {
      try {
        const info = uni.getSystemInfoSync()
        commit('SET_DEVICE_INFO', info)
        resolve(info)
      } catch (e) {
        console.error('Failed to get system info:', e)
        resolve(null)
      }
    })
  },

  // Initialize app - can be called when app starts
  initApp({ dispatch }) {
    dispatch('getDeviceInfo')
    dispatch('checkNetworkStatus')

  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
