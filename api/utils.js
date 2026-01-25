export default {
	
	// 解析URL中的参数
	parseQuery(url) {
		let q = {}
		url.replace(
			/([^?&=]+)=([^&]+)/g,
			(_, k, v) => (q[k] = v)
		);
		return q
	},
	
	// 复制文本到剪切板
	copyToClipboard(text) {
		navigator.clipboard.writeText(text);
	},
	
	// 将rgb颜色灰度化
	gray(r,g,b) {
		let color = 0.2126 * r + 0.7152 * g + 0.0722 * b;
		return 'rgb('+color+','+color+','+color+');' 
	},
	
	// 筛选对象属性
	pick(obj, ...props) {
		return Object.fromEntries(
			Object.entries(obj).filter(([k]) => props.includes(k))
		)
	},
	
	// 富文本转字符串（去掉字符串中的元素标记）
	removeTag(fragment) {
		return new DOMParser().parseFromString(fragment,'text/html').body.textContent || '';
	},
	
	//随机HEX颜色值
	randomColor() {
		return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6,'0');
	}
	
}

