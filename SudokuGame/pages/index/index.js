import Grid from '../../utils/ui/grid.js';
import Toolkit from '../../utils/core/toolkit.js';
import Checker from '../../utils/core/checker.js';
//获取应用实例
let app = getApp();

let timer;
let handler = {
  data: {
    left: 0,
    top: 0,
    showPopupNumber: false,
    dataSource: '',//用来作为生成的源数据
    modelDataSource: '',//用来判断是fixed还是空白格
    errDataSource: [],//用来判断哪些格子是填错的背景样式要变成红色
    rowGroupClasses: ['row_g_top', 'row_g_middle', 'row_g_bottom'],
    colGroupClasses: ['col_g_left', 'col_g_center', 'col_g_right'],
    showIndexMask: true,
    point: '.',
    seconds: 0,
    clock: '000'
  },
  // onLoad() {
  //   this.buildGame();
  // },
  startSudoku() {
    this.setData({
      showIndexMask: false
    });
    this.buildGame();
  },
  buildGame() {
    let matrix = Grid.build();
    this.setData({
      dataSource: matrix,
      modelDataSource: matrix,
      errDataSource: matrix,
      seconds: 0,
    });
    clearInterval(timer);
    this.changePoint();
  },
  // 弹出数字操作盘
  bindPopup(e) {
    let rowIndex = e.currentTarget.dataset.rowindex,
      colIndex = e.currentTarget.dataset.colindex;

    let left = e.target.offsetLeft, top = e.target.offsetTop;//数字操作盘的方位
    console.log(e.target);
    this.setData({
      top: top >= 200 ? top - 140 + 'px' : top + 'px',
      left: left >= 200 ? left - 110 + 'px' : left + 'px',
      showPopupNumber: true,
      rowIndex: rowIndex,
      colIndex: colIndex
    })
  },
  // 点击选择数字
  selectNumber(e) {
    let number = e.target.dataset.number;
    let data = this.data.dataSource;
    data[this.data.rowIndex][this.data.colIndex] = number;
    this.setData({
      dataSource: data,
      showPopupNumber: false
    })
  },
  // 返回的是true和false构成的9*9数组
  getMatrixMarks() {
    Checker.check(this.data.dataSource);
    return Checker._matrixMarks;
  },
  // 点击完成进行检查
  check() {
    this.hidePopupNumBorad();
    this.setData({
      errDataSource: this.data.dataSource
    })
    Checker.reset();//重置检查器，否则会出错
    const marks = this.getMatrixMarks();
    let checkResult = marks.every(row => row.every(mark => mark));
    if (checkResult) { //如果都为true则成功
      let self = this;
      wx.showModal({
        title: '恭喜你！完成了！',
        content: '再来一局吗？',
        success: function (res) {
          if (res.confirm) {
            self.rebuild();
          } else {
            return;
          }
        }
      })
    } else {
      //检查不成功，进行标记
      this.data.dataSource.map((row, rowIndex) => {
        row.map((col, colIndex) => {
          if (this.data.modelDataSource[rowIndex][colIndex] == 0 && marks[rowIndex][colIndex] == false) {
            let data = this.data.errDataSource;
            data[rowIndex][colIndex] = 'error';
            this.setData({
              errDataSource: data
            })
          }
        })
      })
      wx.showToast({
        title: '再检查一下吧~',
        icon: 'loading',
        duration: 2000,
        mask: true
      })
    }

  },

  reset() {
    this.hidePopupNumBorad();
    let self = this;
    wx.showModal({
      title: '提示',
      content: '确定重置吗？',
      success: function (res) {
        if (res.confirm) {
          Checker.reset();
          self.setData({
            dataSource: self.data.modelDataSource,
            seconds: 0,
          })
        } else {
          return;
        }
      }
    })
  },
  //计时器
  changePoint() {
    let self = this;
    timer = setInterval(function () {
      let seconds = self.data.seconds + 1;
      let clock;
      if (seconds < 10) {
        clock = '00' + seconds;
      } else if (seconds < 100) {
        clock = '0' + seconds;
      } else if (seconds >= 999) {
        clearInterval(timer);
        wx.showModal({
          title: '提醒！',
          content: '您花费了太多时间啦，不如重新开始一局吧？',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              Checker.reset();
              self.buildGame();
            } else {
              return;
            }
          }
        })
      } else {
        clock = '' + seconds;
      }
      self.setData({
        seconds: seconds,
        clock: clock,
      });
      if (self.data.point === '...') {
        self.setData({
          point: '.'
        });
      } else {
        self.setData({
          point: self.data.point + '.'
        });
      }
    }, 1000)
  },
  rebuild() {
    let self = this;
    this.hidePopupNumBorad();
    wx.showModal({
      title: '提示',
      content: '确定重新开始吗？',
      success: function (res) {
        if (res.confirm) {
          Checker.reset();
          self.buildGame();
        } else {
          return;
        }
      }
    })
  },
  hidePopupNumBorad() {
    this.setData({
      showPopupNumber: false
    })
  }
}

Page(handler)
