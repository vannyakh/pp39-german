// z-paging国际化(支持中文、中文繁体和英文)
const i18nUpdateKey = 'z-paging-i18n-update';

const t = {
	refresherDefaultText: {
		'en': 'Pull down to refresh',
		'zh-cn': '继续下拉刷新',
		'zh-hant-cn': '繼續下拉重繪',
		'ind':'ताज़ा करने के लिए नीचे खींचना जारी रखें',
	},
	refresherPullingText: {
		'en': 'Release to refresh',
		'zh-cn': 'Release to refresh',
		'zh-hant-cn': '鬆開立即重繪',
		'ind':'तुरंत ताज़ा करने के लिए रिलीज़ करें',
	},
	refresherRefreshingText: {
		'en': 'Refreshing...',
		'zh-cn': 'Refreshing...',
		'zh-hant-cn': '正在重繪...',
		'ind':'ताज़ा करें सफल',
	},
	refresherCompleteText: {
		'en': 'Refresh succeeded',
		'zh-cn': '刷新成功',
		'zh-hant-cn': '重繪成功',
		'ind':'ताज़ा करें सफल',
	},
	loadingMoreDefaultText: {
		'en': 'Click to load more',
		'zh-cn': '点击加载更多',
		'zh-hant-cn': '點擊加載更多',
		'ind':'अधिक लोड करने के लिए क्लिक करें',
	},
	loadingMoreLoadingText: {
		'en': 'Loading...',
		'zh-cn': '正在加载...',
		'zh-hant-cn': '正在加載...',
		'ind':'लोड हो रहा है...',
	},
	loadingMoreNoMoreText: {
		'en': 'No more data',
		'zh-cn': 'No more data',
		'zh-hant-cn': '沒有更多了',
		'ind':'अब और नहीं',
	},
	loadingMoreFailText: {
		'en': 'Load failed,click to reload',
		'zh-cn': '加载失败，点击重新加载',
		'zh-hant-cn': '加載失敗，點擊重新加載',
		'ind':'लोडिंग विफल, पुनः लोड करने के लिए क्लिक करें',
	},
	emptyViewText: {
		'en': 'No data',
		'zh-cn': '暂无数据~',
		'zh-hant-cn': '暂无数据~',
		'ind':'अभी तक कोई डेटा नहीं~',
	},
	emptyViewReloadText: {
		'en': 'Reload',
		'zh-cn': '重新加载',
		'zh-hant-cn': '重新加載',
		'ind':'पुनः लोड करें',
	},
	emptyViewErrorText: {
		'en': 'Sorry,load failed',
		'zh-cn': '很抱歉，加载失败',
		'zh-hant-cn': '很抱歉，加載失敗',
		'ind':'क्षमा करें, लोडिंग विफल रही',
	},
	refresherUpdateTimeText: {
		'en': 'Last update: ',
		'zh-cn': '最后更新：',
		'zh-hant-cn': '最後更新：',
		'ind':'नवीनतम अद्यतन:',
	},
	refresherUpdateTimeNoneText: {
		'en': 'None',
		'zh-cn': '无',
		'zh-hant-cn': '無',
		'ind':'कोई नहीं',
	},
	refresherUpdateTimeTodayText: {
		'en': 'Today',
		'zh-cn': '今天',
		'zh-hant-cn': '今天',
		'ind':'आज',
	},
	refresherUpdateTimeYesterdayText: {
		'en': 'Yesterday',
		'zh-cn': '昨天',
		'zh-hant-cn': '昨天',
		'ind':'कल',
	}
}


// 获取当前语言，格式为:zh-cn、zh-hant-cn、en。followSystemLanguage:获取的结果是否是在不跟随系统语言下获取到的
function getLanguage(followSystemLanguage = true) {
	return _getPrivateLanguage(false, followSystemLanguage);
}

// 获取当前语言，格式为:简体中文、繁體中文、English。followSystemLanguage:获取的结果是否是在不跟随系统语言下获取到的
function getLanguageName(followSystemLanguage = true) {
	const language = getLanguage(followSystemLanguage);
	const languageNameMap = {
		'zh-cn': '简体中文',
		'zh-hant-cn': '繁體中文',
		'en': 'English',
		'ind': 'हिंदी'
	};
	return languageNameMap[language];
}

//设置当前语言，格式为:zh-cn、zh-hant-cn、en
function setLanguage(myLanguage) {
	uni.setStorageSync(i18nUpdateKey, myLanguage);
	uni.$emit(i18nUpdateKey, myLanguage);
}

// 插件内部使用，请勿直接调用
function _getPrivateLanguage(myLanguage, followSystemLanguage = true) {
	let systemLanguage = '';
	if (followSystemLanguage) {
		systemLanguage = uni.getSystemInfoSync().language;
	}
	let language = myLanguage || uni.getStorageSync(i18nUpdateKey) || systemLanguage;
	language = language.toLowerCase();
	const reg = new RegExp('_', '');
	language = language.replace(reg, '-');
	if (language.indexOf('zh') !== -1) {
		if (language === 'zh' || language === 'zh-cn' || language.indexOf('zh-hans') !== -1) {
			return 'zh-cn';
		}
		return 'zh-hant-cn';
	}
	if (language.indexOf('en') !== -1) {
		return 'en';
	}
	if (language.indexOf('ind') !== -1) {
		return 'ind';
	}
	return 'en';
}

export default {
	t,
	getLanguage,
	getLanguageName,
	setLanguage,
	_getPrivateLanguage,
}
