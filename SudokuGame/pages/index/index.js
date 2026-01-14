import Grid from '../../utils/ui/grid.js'
import Toolkit from '../../utils/core/toolkit.js'
import Checker from '../../utils/core/checker.js'
import {
    Confetti,
	ConfettiEjector,
	CanvasRender,
	CustomShape
} from 'confetti-ts-canvas';

//获取应用实例
let app = getApp()
let videoAd = null
let interstitialAd = null
let timer
let handler = {
  data: {
    left: 0,
    top: 0,
    showPopupNumber: false,
    dataSource: '', //用来作为生成的源数据
    modelDataSource: '', //用来判断是fixed还是空白格
    errDataSource: [], //用来判断哪些格子是填错的背景样式要变成红色
    rowGroupClasses: ['row_g_top', 'row_g_middle', 'row_g_bottom'],
    colGroupClasses: ['col_g_left', 'col_g_center', 'col_g_right'],
    showIndexMask: true,
    point: '.',
    seconds: 0,
    clock: '000',
    freeEmptyCounter: 0,
  },
  onLoad() {
    // this.buildGame();
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-73f326ae09d28a31',
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-3695a69332689129',
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {
        if (res?.isEnded === true) {
          this.setData({
            freeEmptyCounter: 5,
          })
        }
      })
    }
  },
  startSudoku() {
    this.setData({
      showIndexMask: false,
    })
    this.buildGame()
  },
  doConfetti() {
    const query = wx.createSelectorQuery();
    // 1. 使用新 API 获取设备像素比 (DPR)
    // 这是解决 Canvas 模糊的关键
    const { pixelRatio } = wx.getWindowInfo(); 
    query.select('#confettiCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        // 如果节点还没准备好，res[0] 可能是 null，做个保护
        if (!res || !res[0]) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        // res[0].width 是 CSS 逻辑宽度 (例如 iPhone 6 是 375px)
        const width = res[0].width;
        const height = res[0].height;

        // 2. 设置物理像素尺寸 (高清适配)
        // 必须将 canvas 的内部分辨率设置为 逻辑尺寸 * DPR
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        
        // 3. 缩放绘图上下文
        // 这样你在后续绘图时，依然可以使用逻辑坐标 (0-375)，系统会自动映射到高清像素上
        ctx.scale(pixelRatio, pixelRatio);

        // 4. 启动彩带
        new Confetti({
          paint: ctx, 
          canvasWidth: width,  // 传入逻辑宽度
          canvasHeight: height // 传入逻辑高度
        }).run();
        wx.vibrateShort({ type: 'medium' }); // 手机轻轻震动一下，模拟礼炮炸开的感觉
      });
      // const canvas= document.querySelector("#canvas");
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // const g= canvas.getContext("2d");
    
    // new Confetti({
    //      paint:g,
    //      canvasWidth:canvas.width,
    //      canvasHeight:canvas.height,
    //   }).run();
      
    // const canvas= document.querySelector("canvas");
    // const pao = new ConfettiEjector(canvas, {
    //     limitAngle: [225, 315],//喷发角度区间[-∞,+∞]
    //     count: 100,//喷发纸片数量
    // });
    // const boom = pao.create({
    //     x: Math.random()*(this.canvasSize.width*.5),
    //     y:Math.random()*(this.canvasSize.height*.5),//喷发位置
    //     clampforce: [20, 60],//喷发力度
    //     radius: 10,//纸片大小
    // });
    // pao.fire(boom);
  },
  back() {
    let self = this
    wx.showModal({
      title: '提示',
      content: '返回会重置游戏，确定返回吗？',
      success: function (res) {
        if (res.confirm) {
          if (interstitialAd) {
            interstitialAd.show().catch((err) => {
              console.error(err)
            })
          }
          Checker.reset()
          self.setData({
            showIndexMask: true,
          })
        }
      },
    })
  },
  buildGame() {
    let matrix = Grid.build()
    this.setData({
      dataSource: JSON.parse(JSON.stringify(matrix)),
      modelDataSource: JSON.parse(JSON.stringify(matrix)),
      errDataSource: JSON.parse(JSON.stringify(matrix)),
      seconds: 0,
      freeEmptyCounter: 5,
    })
    clearInterval(timer)
    this.changePoint()
  },
  // 弹出数字操作盘
  bindPopup(e) {
    let rowIndex = e.currentTarget.dataset.rowindex,
      colIndex = e.currentTarget.dataset.colindex
    let left = e.target.offsetLeft,
      top = e.target.offsetTop //数字操作盘的方位
    this.setData({
      top: top >= 200 ? top - 140 + 'px' : top + 'px',
      left: left >= 200 ? left - 110 + 'px' : left + 'px',
      showPopupNumber: true,
      rowIndex: rowIndex,
      colIndex: colIndex,
    })
  },
  // 点击选择数字
  selectNumber(e) {
    const { errDataSource, dataSource, rowIndex, colIndex, freeEmptyCounter } = this.data
    const data = JSON.parse(JSON.stringify(dataSource))
    if (errDataSource.length > 0) {
      this.setData({
        errDataSource: [],
      })
    }
    const { number } = e.target.dataset
    if (e.target?.id === 'empty') {
      if (freeEmptyCounter <= 0 && videoAd) {
        videoAd.show().catch(() => {
          // 失败重试
          videoAd
            .load()
            .then(() => videoAd.show())
            .catch((err) => {
              console.log('激励视频 广告显示失败')
            })
        })
        this.setData({
          showPopupNumber: false,
        })
        return
      } else {
        this.setData({
          freeEmptyCounter: freeEmptyCounter - 1,
        })
      }
    }
    data[rowIndex][colIndex] = number
    this.setData({
      dataSource: data,
      showPopupNumber: false,
    })
  },
  // 返回的是true和false构成的9*9数组
  getMatrixMarks() {
    Checker.check(this.data.dataSource)
    return Checker._matrixMarks
  },
  // 点击完成进行检查
  check() {
    const { dataSource, modelDataSource } = this.data
    this.hidePopupNumBorad()
    Checker.reset() //重置检查器，否则会出错
    const marks = this.getMatrixMarks()
    let checkResult = marks.every((row) => row.every((mark) => mark))
    if (checkResult) {
      //如果都为true则成功
      let self = this
      self.doConfetti()
      setTimeout(() => {
          wx.showModal({
            title: '恭喜你！太棒了！成功过关！',
            content: '一共花了' + self.data.seconds + '秒，再来一局吗？（点击右上角按钮分享给小伙伴吧！）',
            success: function (res) {
              if (res.confirm) {
                self.rebuild()
              } else {
                return
              }
            },
          })
      }, 1500);
    } else {
      //检查不成功，进行标记
      let data = JSON.parse(JSON.stringify(dataSource))
      dataSource.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (modelDataSource[rowIndex][colIndex] == 0 && marks[rowIndex][colIndex] == false) {
            data[rowIndex][colIndex] = 'error'
            this.setData({
              errDataSource: data,
            })
          }
        })
      })
      wx.showToast({
        title: '再检查一下吧~',
        icon: 'loading',
        duration: 2000,
        mask: true,
      })
    }
    console.log(this.data.modelDataSource)
  },

  reset() {
    this.hidePopupNumBorad()
    let self = this
    wx.showModal({
      title: '提示',
      content: '确定重置吗？',
      success: function (res) {
        if (res.confirm) {
          const { errDataSource, dataSource, modelDataSource } = self.data
          let data = [...dataSource]
          if (errDataSource.length > 0) {
            data.forEach((row, rowIndex) => {
              row.forEach((col, colIndex) => {
                if (data[rowIndex][colIndex] == 'error') {
                  data[rowIndex][colIndex] = 0
                }
              })
            })
            self.setData({
              errDataSource: [],
            })
          }
          console.log(modelDataSource)
          Checker.reset()
          self.setData({
            dataSource: modelDataSource,
            seconds: 0,
          })
        } else {
          return
        }
      },
    })
  },
  //计时器
  changePoint() {
    let self = this
    timer = setInterval(function () {
      let seconds = self.data.seconds + 1
      let clock
      if (seconds < 10) {
        clock = '00' + seconds
      } else if (seconds < 100) {
        clock = '0' + seconds
      } else if (seconds >= 999) {
        clearInterval(timer)
        wx.showModal({
          title: '提醒！',
          content: '您花费了太多时间啦，不如重新开始一局吧？',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              Checker.reset()
              self.buildGame()
            } else {
              return
            }
          },
        })
      } else {
        clock = '' + seconds
      }
      self.setData({
        seconds: seconds,
        clock: clock,
      })
      if (self.data.point === '...') {
        self.setData({
          point: '.',
        })
      } else {
        self.setData({
          point: self.data.point + '.',
        })
      }
    }, 1000)
  },
  rebuild() {
    let self = this
    this.hidePopupNumBorad()
    wx.showModal({
      title: '提示',
      content: '确定重新开始吗？',
      success: function (res) {
        if (res.confirm) {
          if (interstitialAd) {
            interstitialAd.show().catch((err) => {
              console.error(err)
            })
          }
          Checker.reset()
          self.buildGame()
        } else {
          return
        }
      },
    })
  },
  hidePopupNumBorad() {
    this.setData({
      showPopupNumber: false,
    })
  },
  //分享功能
  onShareAppMessage: function (res) {
    let self = this
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    return {
      title: '来挑战下SUDOKU数独吧！',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
        wx.showModal({
          title: '分享成功！',
          content: '再挑战一次吗？',
          success: function (res) {
            if (res.confirm) {
              Checker.reset()
              self.buildGame()
            } else {
              // return;
            }
          },
        })
      },
      fail: function (err) {
        // 转发失败
        return
      },
    }
  },
}

Page(handler)
