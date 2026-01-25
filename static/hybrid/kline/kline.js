const urlParams = new URLSearchParams(window.location.search);
const VUE_APP_DEFAULT_API_URL = urlParams.get('url');
var chart = '';
var ws = '';
// Keep track of created sub-indicator panes so we can remove/restore them
let volPaneId = null;
let macdPaneId = null;

// Theme palettes inspired by kline copy.js
const THEME_COLORS = {
	light: {
		upColor: '#33C759',
		downColor: '#CC3131',
		noChangeColor: '#888888',
		axisColor: '#888888',
		axisTextColor: '#76808F',
		textColor: '#333333',
		priceTextColor: '#FFFFFF',
		separatorColor: '#E6E6E6',
		gridColor: 'rgba(230, 230, 230, 0.08)',
		tooltipBorder: '#3f4254',
		tooltipBg: 'rgba(17, 17, 17, .3)',
		areaFillColor: [{ offset: 0, color: 'rgba(51,199,89,0.15)' }, { offset: 1, color: 'rgba(51,199,89,0.02)' }],
		areaLineColor: '#33C759'
	},
	dark: {
		upColor: '#00D4AA',
		downColor: '#FF6B6B',
		noChangeColor: '#888888',
		axisColor: 'rgba(255,255,255,0.3)',
		axisTextColor: '#B0B7C3',
		textColor: '#D9D9D9',
		priceTextColor: '#FFFFFF',
		separatorColor: 'rgba(255,255,255,0.25)',
		gridColor: 'rgba(230, 230, 230, 0.08)',
		tooltipBorder: 'rgba(255,255,255,0.15)',
		tooltipBg: 'rgba(17, 17, 17, .35)',
		areaFillColor: [{ offset: 0, color: 'rgba(0, 212, 170, 0.15)' }, { offset: 1, color: 'rgba(0, 212, 170, 0.02)' }],
		areaLineColor: '#00D4AA'
	}
};

function detectTheme() {
	try {
		const params = new URLSearchParams(window.location.search);
		const fromParam = params.get('theme') || params.get('mode');
		if (fromParam === 'light' || fromParam === 'dark') return fromParam;
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
		return 'light';
	} catch (e) { return 'light'; }
}

function getThemeColors() {
	const theme = detectTheme();
	return THEME_COLORS[theme] || THEME_COLORS.light;
}

function getStyleOptions(period, priceScale) {
	const isTime = period === '1';
	const C = getThemeColors();
	return {
		candle: {
			tooltip: {
				showRule: isTime ? 'none' : 'follow_cross',
				showType: 'rect',
				labels: ['Open ', 'Close ', 'High ', 'Low ', 'Time '],
				values: function (kLineData) {
					return [
						Number(kLineData.open).toFixed(priceScale),
						Number(kLineData.close).toFixed(priceScale),
						Number(kLineData.high).toFixed(priceScale),
						Number(kLineData.low).toFixed(priceScale),
						app.changeTime(kLineData.timestamp),
					]
				},
				defaultValue: 'n/a',
				rect: {
					paddingLeft: 0,
					paddingRight: 0,
					paddingTop: 4,
					paddingBottom: 4,
					offsetLeft: 8,
					offsetTop: 8,
					offsetRight: 8,
					borderRadius: 4,
					borderSize: 1,
					borderColor: C.tooltipBorder,
					backgroundColor: C.tooltipBg,
				},
				text: {
					size: 12,
					family: 'Helvetica Neue',
					weight: 'normal',
					color: C.textColor,
					marginLeft: 8,
					marginTop: 6,
					marginRight: 8,
					marginBottom: 0
				}
			},
			margin: {
				top: 0.2,
				bottom: 0.1
			},
			type: isTime ? 'area' : 'candle_solid',
			bar: {
				upColor: C.upColor,
				downColor: C.downColor,
				noChangeColor: C.noChangeColor,
				...(isTime ? {
					areaFillColor: C.areaFillColor,
					areaLineColor: C.areaLineColor,
					areaLineSize: 2
				} : {})
			},
			priceMark: {
				show: true,
				high: {
					show: true,
					color: C.upColor,
					textMargin: 5,
					textSize: 10,
					textFamily: 'Helvetica Neue',
					textWeight: 'normal'
				},
				low: {
					show: true,
					color: C.downColor,
					textMargin: 5,
					textSize: 10,
					textFamily: 'Helvetica Neue',
					textWeight: 'normal',
				},
				last: {
					show: true,
					upColor: C.upColor,
					downColor: C.downColor,
					noChangeColor: C.noChangeColor,
					line: {
						show: true,
						style: 'dash',
						dashValue: [4, 4],
						size: 1
					},
					text: {
						show: true,
						size: 12,
						paddingLeft: 2,
						paddingTop: 2,
						paddingRight: 2,
						paddingBottom: 2,
						color: C.priceTextColor,
						family: 'Helvetica Neue',
						weight: 'normal',
						borderRadius: 2
					}
				}
			},
		},
		technicalIndicator: {
			tooltip: {
				showName: false,
				showParams: false
			}
		},
		xAxis: {
			show: false,
			axisLine: {
				show: true,
				color: C.axisColor,
				size: 1
			},
			tickLine: {
				show: false,
				size: 1,
				length: 3,
				color: C.axisColor
			},
			tickText: {
				show: true,
				family: 'Helvetica Neue',
				weight: 'normal',
				size: 12,
				paddingLeft: 3,
				paddingRight: 6,
				color: C.axisTextColor
			},
		},
		yAxis: {
			show: true,
			position: 'right',
			type: 'log',
			inside: true,
			reverse: false,
			axisLine: {
				show: false,
				color: '#fff',
			},
			tickLine: {
				show: false,
				size: 1,
				length: 3,
				color: C.axisColor
			},
			tickText: {
				show: true,
				family: 'Helvetica Neue',
				weight: 'normal',
				size: 12,
				paddingLeft: 3,
				paddingRight: 6,
				color: C.axisTextColor
			},
		},
		separator: {
			size: 1,
			color: C.separatorColor,
			fill: true,
			activeBackgroundColor: 'rgba(230, 230, 230, .15)'
		},
		grid: {
			show: true,
			horizontal: {
				show: true,
				size: 1,
				color: C.gridColor,
				style: 'solid',
				dashValue: [2, 2]
			},
			vertical: {
				show: true,
				size: 1,
				color: C.gridColor,
				style: 'solid',
				dashValue: [2, 2]
			}
		},
		crosshair: {
			show: true,
			horizontal: {
				show: true,
				line: { show: true, style: 'dash', dashValue: [4, 2], size: 1, color: 'rgba(101, 126, 250, 0.6)' },
				text: { show: true, color: '#FFFFFF', size: 11, backgroundColor: 'rgba(101, 126, 250, 0.9)', padding: 6, borderRadius: 4, borderSize: 0 }
			},
			vertical: {
				show: true,
				line: { show: true, style: 'dash', dashValue: [4, 2], size: 1, color: 'rgba(101, 126, 250, 0.6)' },
				text: { show: true, color: '#FFFFFF', size: 11, backgroundColor: 'rgba(101, 126, 250, 0.9)', padding: 6, borderRadius: 4, borderSize: 0 }
			}
		}
	};
}

// 请求封装
var app = new Vue({
	el: '#app',
	data: {
		symbol: "",
		lang: 'en-us',

		period: 'D',
		zhezhaoceng: true,

		pricescale: 2,
		startTime: 0,
		tentimer: null
	},
	created() {
		this.socket()
	},
	mounted() {
		this.getLanguage()
		var that = this
		// 初始化图表
		chart = klinecharts.init('k-line-chart')
		if(chart){
			chart.setStyleOptions(getStyleOptions(that.period, that.pricescale))
		}
		// Moving average
		chart.overrideTechnicalIndicator({
			name: 'MA',
			calcParams: [5, 10]
		})
		chart.createTechnicalIndicator('MA', false, {
			id: 'candle_pane'
		})
		volPaneId = chart.createTechnicalIndicator('VOL', false, {
			height: 60,
			dragEnabled: false
		})
		// Add MACD indicator on a separate pane
		macdPaneId = chart.createTechnicalIndicator('MACD', false, {
			height: 80,
			dragEnabled: true
		})
		chart.setPriceVolumePrecision(2, 2) //设置价格精度 深度精度（小数点后几位）
		chart.setTimezone('America/Toronto') //设置时区
		chart.setZoomEnabled(true) //设置是否缩放
		chart.setScrollEnabled(true) //设置是否可以拖拽滚动。
		chart.setDataSpace(12) //设置是否可以拖拽滚动。
		//设置加载更多回调函数
		chart.loadMore((cd) => {
			//console.log('加载更早的数据',this.changeTime(cd))
		})
        this.startTime = 0
	},
	destroyed() {
		this.zhezhaoceng = true
		clearTimeout(this.tentimer)
	},
	methods: {
		socket($message='') {
			var socket =   'wss://wss.bvbkwil.com:6688';

			if(!ws){
				ws = new WebSocket(socket);
			}
			var that = this;
			if ($message) {
				var send = {
					cmd: 'subscribe',
					id: that.symbol,
					interval: that.period,
					timestamp: that.startTime
				}
				console.log('changed period ...');
				ws.send(JSON.stringify(send));
			}


			ws.onopen = function (event) {
				var send = {
					cmd: 'subscribe',
					id: that.symbol,
					interval: that.period,
					timestamp: that.startTime
				}
				console.log('Connection open ...');
				ws.send(JSON.stringify(send));
			};
			ws.onmessage = function (event) {
				let data = JSON.parse(event.data);
				if (data && data.code == 1 && data.msg == 'success') {
					let timestamp = data.timestamp;
					console.log('timestamp', timestamp)
					data = data.data;
					let last = data[data.length - 1];
					console.log('last', last)
					if (timestamp == 0 || !timestamp) {
						that.getALLKline(data);
						// console.log('getALLKline', data)s
					}
					else {
						// console.log('update', last)
						that.getLastKline(last);
					}
					that.iframeSendMsg(Number(last.close).toFixed(that.pricescale), Number(last.high).toFixed(that.pricescale), Number(last.open).toFixed(that.pricescale), Number(last.low).toFixed(that.pricescale))

					// that.startTime= last.time;
				}

			};
			ws.onclose = function (event) {
				// reconnect
				ws = new WebSocket(socket);
			};
		},
		// iframe向vue传递信息
		iframeSendMsg(close, high, open, low) {
			window.parent.postMessage({
				cmd: 'newprice',
				params: {
					// info: 'iframe向Vue传递的消息:',
					num: close,
					high: high,
					open: open,
					low: low
				}
			}, '*');
		},
		getLanguage() {
			var args = window.location.href.split('?');
			if (args[0] == window.location.href) {
				return "";
			};
			var arr = args[1].split('&');
			var obj = {};
			for (var i = 0; i < arr.length; i++) {
				var arg = arr[i].split('=');
				obj[arg[0]] = arg[1];
			}
			// //console.log(obj)
			this.symbol = obj.symbol
			//console.log('symbol', this.symbol);
			this.lang = obj.lang
			//console.log('lang', this.lang);
		},
		changeTime2(thisData, customTimezone = 'America/Toronto') {
			const timzone = 'America/Toronto';
			var date = new Date(thisData);
			const options = {
				timeZone: timzone,
				hour12: false,
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric'
			};
			// get year
			date = date.toLocaleDateString('en-US', {
				timeZone: timzone,
				// year: 'numeric',
				month: 'numeric',
				day: 'numeric'
			});
			// get year
			date = date + ' ' + new Date(thisData).toLocaleTimeString('en-US', options);
			return date;
		},
        changeTime(thisData, customTimezone = 'America/Toronto') {
            const timezone = customTimezone;
            const date = new Date(thisData);

            // Check if current period is D, W, or M
            const hidePeriods = ['D', 'W', 'M'];
            const shouldHideTime = hidePeriods.includes(this.period);

            // Get date string
            const dateString = date.toLocaleDateString('en-US', {
                timeZone: timezone,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            });

            // If period is D/W/M, return only date without time
            if (shouldHideTime) {
                console.log('timeZone:', dateString);
                return dateString;
            }

            // Otherwise, return date + time
            const timeString = date.toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour12: false,
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            });

            const result = dateString + ' ' + timeString;
            console.log('timeZone:', result);

            return result;
        },
        // Usage examples based on period:
        // If period = 'D', 'W', or 'M': → "11/13/2025"
        // If period = '1', '5', '15', etc.: → "11/13/2025 12:30:45"
		// change kline period
		changePeriod(times) {


			if (this.period != times) {
				this.zhezhaoceng = true
				this.period = times
				clearTimeout(this.tentimer)
				chart.clearData()
				// ws.close()
				// update styles consistently on period change
				chart.setStyleOptions(getStyleOptions(this.period, this.pricescale))
				// When switching to time period ('1'), show only main chart
				if (this.period === '1') {
					if (volPaneId) {
						chart.removeTechnicalIndicator(volPaneId)
						volPaneId = null
					}
					if (macdPaneId) {
						chart.removeTechnicalIndicator(macdPaneId)
						macdPaneId = null
					}
				} else {
					// Restore sub panes when leaving time period
					if (!volPaneId) {
						volPaneId = chart.createTechnicalIndicator('VOL', false, {
							height: 60,
							dragEnabled: false
						})
					}
					if (!macdPaneId) {
						macdPaneId = chart.createTechnicalIndicator('MACD', false, {
							height: 80,
							dragEnabled: true
						})
					}
				}
               // close connection and reconnect

				this.startTime = 0
				this.socket('changePeriod')
				console.log('startTime', this.startTime)

			}
		},
		getLastKline(newKdata) {
			if (newKdata) {
				let max = Math.max(newKdata.close, newKdata.high, newKdata.low, newKdata.open); //找到最高
				let min = Math.min(newKdata.close, newKdata.high, newKdata.low, newKdata.open); //找到最低
				// //console.log('拿到的最新数据',newKdata)
				chart.updateData({
					open: Number(newKdata.open),
					close: Number(newKdata.close),
					high: Number(max),
					low: Number(min),
					volume: Number(newKdata.volume),
					timestamp: newKdata.time * 1000
				})
			}
		},
		getALLKline(Kdata) {
			if (Kdata && Kdata.length != 0) {
				// //console.log('拿到的数据',Kdata)
				const datas = []
				for (let i of Kdata) {
					let max = Math.max(i.close, i.high, i.low, i.open); //找到最高
					let min = Math.min(i.close, i.high, i.low, i.open); //找到最低
					let temp = {
						open: Number(i.open),
						close: Number(i.close),
						high: Number(max),
						low: Number(min),
						volume: Number(i.volume),
						timestamp: i.time * 1000
					}
					datas.push(temp)
				}
				// {
				// //console.log("?处理数据?",datas)
				chart.applyNewData(datas)
				this.startTime = Kdata[Kdata.length - 1].time
				setTimeout(() => {
					this.zhezhaoceng = false

				}, 100)
			} else {
				//console.log('没有数据,重新加载')
				// this.getKline_zhilian(this.startTime)
			}
		},
        //直接拿k线（not used）
	}
})
