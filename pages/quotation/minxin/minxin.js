import {
	init
} from 'klinecharts'
import {
	req
} from '@/api/index.js'

var chart = '';
export const mixin = {
	data() {
		return {
			period: 'D',
			zhezhaoceng: true,

			pricescale: 2,

			tentimer: null
		}
	},
	beforeDestroy() {
		this.zhezhaoceng = true
		clearTimeout(this.tentimer)
	},
	onUnload() {
		this.zhezhaoceng = true
		clearTimeout(this.tentimer)
	},
	methods: {
		// iframe向vue传递信息
		iframeSendMsg(close) {
			window.parent.postMessage({
				cmd: 'newprice',
				params: {
					// info: 'iframe向Vue传递的消息:',
					num: close
				}
			}, '*');
		},
		changeTime(thisData) {
			//console.log(thisData)
			var date = new Date(thisData);
			
			var YY = date.getFullYear() + '-';
			var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
			var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
			var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
			var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + "";
			// var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
			return MM + DD + " " + hh + mm;
		},
		changePeriod(times) {
			if (this.period != times) {
				this.zhezhaoceng = true
				this.period = times
				clearTimeout(this.tentimer)
				chart.clearData()
				if(this.period=='1'){
					//console.log('面积图')
					chart.setStyleOptions({
						candle: {
							tooltip: {
								showRule: 'none',
							},
							type: 'area',
						}
					})
					chart.removeTechnicalIndicator('VOL_id')
				}else{
					chart.setStyleOptions({
						candle: {
							tooltip: {
								showRule: 'follow_cross',
							},
							type: 'candle_solid',
						}
					})
					chart.createTechnicalIndicator('VOL', false, {
						id:'VOL_id',
						height: 60,
						dragEnabled: true
					})
				}
				this.getKline_zhilian(0)
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
			//console.log('拿到的数据',Kdata)
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
			//console.log("?处理数据?", datas)
			chart.applyNewData(datas)
			setTimeout(() => {
				this.zhezhaoceng = false
			}, 100)

		},
		//直接拿k线
		getKline_zhilian(startTime) {
			req('/shares/get_kline', {
				interval: this.period,
				id: this.sharesID,
				startTime:startTime
			}).then(res => {

				console.log('获取K线', res)
				this.zhezhaoceng = false

				const {
					code:resCode = 1,
					data:resData = [],
					msg:resMsg = '',
					time:resTime = '',
				} = res

				if (resCode == 1){

					/* 如果有返回K线值，取最后一条的时间点 */
					let lastItem = {}
					if(resData.length){
						lastItem = resData[resData.length - 1]
					}

					/* 第一次请求且有返回K线值 */
					if (startTime == 0 && resData.length) {
						/* 初始化数据 */
						this.getALLKline(resData)
					/* 第N次请求，有返回K线值 */
					}else if(resData.length){
						/* 处理数据 */
						for (let i = 0; i < resData.length; i++) {
							//console.log('获取' + this.period + '最新数据', res.data[i].time)
							this.getLastKline(resData[i])
							//console.log('最新的价格', Number(res.data[i].close).toFixed(this.pricescale))
							// this.iframeSendMsg(Number(res.data[i].close))
							this.new_price = Number(resData[i].close).toFixed(this.pricescale)
						}
					}

					/* 执行轮询 */
					const {time:lastItemTime=0} = lastItem
					this.tentimer = setTimeout(() => {
						if(this.zhezhaoceng) return
						this.getKline_zhilian(lastItemTime)
					}, 10000)

				}

			})
		},
	},
	mounted: function() {
		// #ifdef H5
		//console.log('页面加载完成')
		var that = this
		chart = init('k-line-chart')
		chart.setStyleOptions({
			candle: {
				tooltip: {
					// 'always' | 'follow_cross' | 'none'
					showRule: that.period=='1'?'none':'follow_cross',
					// showRule: 'follow_cross',
					// 'standard' | 'rect'
					showType: 'rect',
					// labels: ['开 ', '收 ', '高 ', '低 ', '时间 '],
					labels: this.$t('hangqing34'),
					values: function(kLineData) {
						//console.log(kLineData)
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
						backgroundColor: 'rgba(17, 17, 17, .5)',
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
				type: that.period=='1'?'area':'candle_solid',
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
						color: '#D9D9D9',
						textMargin: 5,
						textSize: 10,
						textFamily: 'Helvetica Neue',
						textWeight: 'normal'
					},
					// 最低价标记
					low: {
						show: true,
						color: '#D9D9D9',
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
		chart.overrideTechnicalIndicator({
			name: 'MA',
			calcParams: [5, 10]
		})
		chart.createTechnicalIndicator('MA', false, {
			id: 'candle_pane'
		})
		// chart.createTechnicalIndicator('VOL', false, {
		// 	height: 70,
		// 	dragEnabled: false
		// })
		if(this.period!='1'){
			chart.createTechnicalIndicator('VOL', false, {
				id:'VOL_id',
				height: 60,
				dragEnabled: true
			})
		}
		//创建logo
		// chart.createHtml(
		//   {
		//     id: 'html_1',
		//     position: 'content',
		//     style: { zIndex: 12,left:'20px',bottom:'0px',opacity: 0.3},
		//     content: "<img style='width:150px;height:50px;' src='/static/klineLogo.png'>",
		//   },
		//   'candle_pane',
		// );
		chart.setPriceVolumePrecision(2, 2) //设置价格精度 深度精度（小数点后几位）
		chart.setTimezone('Asia/Shanghai') //设置时区
		chart.setZoomEnabled(true) //设置是否缩放
		chart.setScrollEnabled(true) //设置是否可以拖拽滚动。
		chart.setDataSpace(12) //设置是否可以拖拽滚动。
		//设置加载更多回调函数
		chart.loadMore((cd) => {
			//console.log('加载更早的数据', this.changeTime(cd))
		})
		// #endif
	},
}
