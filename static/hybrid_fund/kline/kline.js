// let baseUrl = 'https://api.genialinvestiment.com/api';
// const VUE_APP_DEFAULT_API_URL = 'https://mgr.cinterinv.com/api'
const urlParams = new URLSearchParams(window.location.search);
const VUE_APP_DEFAULT_API_URL = urlParams.get('url');

var chart = '';
var ws = '';

function http1(url, data) {
	// console.log(JSON.stringify(data))
	return new Promise((resolve, reject) => {
		axios({
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: 'POST',
			url: VUE_APP_DEFAULT_API_URL + url,
			data: Qs.stringify(data)
		})
			.then(res => {
				// console.log(JSON.stringify(res))
				if (res.status == 200) {
					resolve(res.data)
				} else {
					reject()
					// alertError('请求超时')
				}
			})
			.catch(err => {
				// alertError('请求超时')
			})
	})
}
// 请求封装
var app = new Vue({
	el: '#app',
	data: {
		symbol: "",
		is_fund:"",
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
			chart.setStyleOptions({
				candle: {
					tooltip: {
						// 'always' | 'follow_cross' | 'none'
						showRule: that.period == '1' ? 'none' : 'follow_cross',
						// showRule: 'follow_cross',
						// 'standard' | 'rect'
						showType: 'rect',
						labels: ['Open ', 'Close ', 'High ', 'Low ', 'Time '],
						values: function (kLineData) {
							return [
								Number(kLineData.open).toFixed(that.pricescale),
								Number(kLineData.close).toFixed(that.pricescale),
								Number(kLineData.high).toFixed(that.pricescale),
								Number(kLineData.low).toFixed(that.pricescale),
								that.changeTime(kLineData.timestamp),
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
			
							borderColor: '#3f4254',
							backgroundColor: 'rgba(17, 17, 17, .3)',
			
						},
						text: {
							size: 12,
							family: 'Helvetica Neue',
							weight: 'normal',
							color: '#D9D9D9',
							marginLeft: 8,
							marginTop: 6,
							marginRight: 8,
							marginBottom: 0
						}
					},
					// 蜡烛图上下间距，大于1为绝对值，大于0小余1则为比例
					margin: {
						top: 0.2,
						bottom: 0.1
					},
					// 蜡烛图类型 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
					// type: 'candle_solid',
					type: that.period == '1' ? 'area' : 'candle_solid',
					// 蜡烛柱
					bar: {
						upColor: '#33C759',
						downColor: '#CC3131',
						noChangeColor: '#888888'
					},
					priceMark: {
						show: true,
						// 最高价标记
						high: {
							show: true,
							color: '#33C759',
							textMargin: 5,
							textSize: 10,
							textFamily: 'Helvetica Neue',
							textWeight: 'normal'
						},
						// 最低价标记
						low: {
							show: true,
							color: '#CC3131',
							textMargin: 5,
							textSize: 10,
							textFamily: 'Helvetica Neue',
							textWeight: 'normal',
						},
						// 最新价标记
						last: {
							show: true,
							upColor: '#33C759',
							downColor: '#CC3131',
							noChangeColor: '#888888',
							line: {
								show: true,
								// 'solid'|'dash'
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
								color: '#FFFFFF',
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
				// x轴
				xAxis: {
					show: false,
					height: null,
					// x轴线
					axisLine: {
						show: true,
						color: '#888888',
						size: 1
					},
					// x轴分割线
					tickLine: {
						show: false,
						size: 1,
						length: 3,
						color: '#888888'
					},
					// x轴分割文字
					tickText: {
						show: true,
						// color: '#D9D9D9',
						family: 'Helvetica Neue',
						weight: 'normal',
						size: 12,
						paddingLeft: 3,
						paddingRight: 6
					},
				},
				yAxis: {
					show: true,
					// 'left' | 'right'
					position: 'right',
					// 'normal' | 'percentage' | 'log'
					type: 'log',
					inside: true,
					reverse: false,
					axisLine: {
						show: false,
						color: '#fff',
					},
					// y轴分割线
					tickLine: {
						show: false,
						size: 1,
						length: 3,
						color: '#888888'
					},
					// y轴分割文字
					tickText: {
						show: true,
						// color: '#D9D9D9',
						family: 'Helvetica Neue',
						weight: 'normal',
						size: 12,
						paddingLeft: 3,
						paddingRight: 6
					},
				},
				// 图表之间的分割线
				separator: {
					size: 1,
					color: '#fff',
					fill: true,
					activeBackgroundColor: 'rgba(230, 230, 230, .15)'
				},
				grid: {
					show: true,
					// 网格水平线
					horizontal: {
						show: true,
						size: 1,
						color: '#fff',
						// 'solid'|'dash'
						style: 'solid',
						dashValue: [2, 2]
					},
					// 网格垂直线
					vertical: {
						show: true,
						size: 1,
						color: '#fff',
						// 'solid'|'dash'
						style: 'solid',
						dashValue: [2, 2] //dash时  虚线的长度间隔
					}
				},
			})
		}
		// Moving average
		chart.overrideTechnicalIndicator({
			name: 'MA',
			calcParams: [5, 10]
		})
		chart.createTechnicalIndicator('MA', false, {
			id: 'candle_pane'
		})
		chart.createTechnicalIndicator('VOL', false, {
			height: 60,
			dragEnabled: false
		})
		// if(this.period!='1'){
		// 	chart.createTechnicalIndicator('VOL', false, {
		// 		id:'VOL_id',
		// 		height: 60,
		// 		dragEnabled: true
		// 	})
		// }
		// //创建logo
		// chart.createHtml(
		//   {
		//     id: 'html_1',
		//     position: 'content',
		//     style: { zIndex: 12,left:'20px',bottom:'0px',opacity: 0.3},
		// 	content: "<img style='width:150px;height:50px;' src='./klineLogo.png'>",
		//   },
		//   'candle_pane',
		// );
		chart.setPriceVolumePrecision(2, 2) //设置价格精度 深度精度（小数点后几位）
		chart.setTimezone('Asia/Kuala_Lumpur') //设置时区
		chart.setZoomEnabled(true) //设置是否缩放
		chart.setScrollEnabled(true) //设置是否可以拖拽滚动。
		chart.setDataSpace(12) //设置是否可以拖拽滚动。
		//设置加载更多回调函数
		chart.loadMore((cd) => {
			//console.log('加载更早的数据',this.changeTime(cd))
		})
		this.startTime = 0
		// this.getKline_zhilian(0)
	},
	destroyed() {
		this.zhezhaoceng = true
		clearTimeout(this.tentimer)
	},
	methods: {
		socket($message='') {
			var socket = 'wss://mgr.malayinv11.com:6688';
			
			if(!ws){
				ws = new WebSocket(socket);
			}
			var that = this;
			if ($message) {
				var send = {
					cmd: 'subscribe',
					id: that.symbol,
					interval: that.period,
					timestamp: that.startTime,
					is_fund: that.is_fund,
					
				}
				console.log('changed period ...');
				ws.send(JSON.stringify(send));
			}
			

			ws.onopen = function (event) {
				var send = {
					cmd: 'subscribe',
					id: that.symbol,
					interval: that.period,
					timestamp: that.startTime,
					is_fund: that.is_fund,
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
			this.is_fund = obj.is_fund
			console.log('symbol', this.symbol);
			this.lang = obj.lang
			//console.log('lang', this.lang);
		},
		changeTime(thisData, customTimezone = 'Asia/Kuala_Lumpur') {
			const timzone = 'Asia/Kuala_Lumpur';
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
		// 切换
		changePeriod(times) {


			if (this.period != times) {
				this.zhezhaoceng = true
				this.period = times
				clearTimeout(this.tentimer)
				chart.clearData()
				// ws.close()
				if (this.period == '1') {
					chart.setStyleOptions({
						candle: {
							tooltip: {
								showRule: 'follow_cross',
							},
							type: 'candle_solid',
						}
					})
					chart.createTechnicalIndicator('VOL', false, {
						id: 'VOL_id',
						height: 60,
						dragEnabled: true
					})
					//console.log('面积图')
					// chart.setStyleOptions({
					// 	candle: {
					// 		tooltip: {
					// 			showRule: 'none',
					// 		},
					// 		type: 'area',
					// 	}
					// })
					// chart.removeTechnicalIndicator('VOL_id')
				}
				// else {
				// 	chart.setStyleOptions({
				// 		candle: {
				// 			tooltip: {
				// 				showRule: 'follow_cross',
				// 			},
				// 			type: 'candle_solid',
				// 		}
				// 	})
				// 	chart.createTechnicalIndicator('VOL', false, {
				// 		id: 'VOL_id',
				// 		height: 60,
				// 		dragEnabled: true
				// 	})
				// }

				// this.getKline_zhilian(0)
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
		//直接拿k线
		// getKline_zhilian(startTime) {
		// 	// console.log('Get K line', this.symbol, this.period, startTime)
		// 	// send a message to the server
		// 	// alert('Get K line', this.symbol, this.period, startTime)

		// 	let id = this.symbol;
		// 	let interval = this.period;
		// 	// let startTime = 0;
		// 	let that = this;
		// 	ws.onmessage = function (event) {
		// 		let data = JSON.parse(event.data);
		// 		if (data && data.code == 1 && data.msg == 'success') {
		// 			let timestamp = data.timestamp;
		// 			console.log('timestamp', timestamp)
		// 			data = data.data;
		// 			let last = data[data.length - 1];
		// 			if (timestamp == 0 || !timestamp) {
		// 				that.getALLKline(data);
		// 				console.log('getALLKline', data)
		// 			}
		// 			else {
		// 				console.log('update', last)
		// 				that.getLastKline(last);
		// 				that.iframeSendMsg(Number(last.close).toFixed(that.pricescale), Number(last.high).toFixed(that.pricescale), Number(last.open).toFixed(that.pricescale), Number(last.low).toFixed(that.pricescale))
		// 			}
		// 			// that.startTime= last.time;

		// 		}
		// 		let send =
		// 		{
		// 			cmd: 'get_kline',
		// 			id: id,
		// 			interval: interval,
		// 			timestamp: that.startTime
		// 		}
		// 		ws.onclose = function (event) {
		// 			// reconnect
		// 			ws = new WebSocket(socket);
		// 		}
		// 		setTimeout(() => {
		// 			ws.send(JSON.stringify(send));
		// 		}, 200)

		// 		// check if close the connection to the server


		// 		that.tentimer = that.getKline_zhilian(that.startTime)

		// 	}



		// 	// http1('/shares/get_kline', {
		// 	// 	interval: this.period,
		// 	// 	id: this.symbol,
		// 	// 	startTime: startTime
		// 	// }).then(res => {
		// 	// 	console.log('Get K line', res)
		// 	// 	this.zhezhaoceng = false
		// 	// 	if (res.code == 1) {
		// 	// 		let msg = res.data[res.data.length - 1]

		// 	// 		if (startTime == 0) {
		// 	// 			this.getALLKline(res.data)
		// 	// 		} else {
		// 	// 			for (let i = 0; i < res.data.length; i++) {
		// 	// 				console.log('Obtain' + this.period + 'the last data', res.data[i].time)
		// 	// 				this.getLastKline(res.data[i])
		// 	// 				// //console.log('最新的价格', Number(res.data[i].close).toFixed(this.pricescale))
		// 	// 				this.iframeSendMsg(Number(res.data[i].close).toFixed(this.pricescale),Number(res.data[i].high).toFixed(this.pricescale),Number(res.data[i].open).toFixed(this.pricescale),Number(res.data[i].low).toFixed(this.pricescale))


		// 	// 			}
		// 	// 		}
		// 	// 		// this.tentimer = this.getKline_zhilian(msg.time)

		// 	// 	}
		// 	// })
		// },
	}
})