import Grid from '../../utils/ui/grid.js';
import Toolkit from '../../utils/core/toolkit.js';
import Checker from '../../utils/core/checker.js';
//获取应用实例
let app = getApp();

let handler = {
  data: {
    left: 0,
    top: 0,
    showPopupNumber: false,
    dataSource: '',
    modelDataSource: '',
    errDataSource: [],
    rowGroupClasses: ['row_g_top', 'row_g_middle', 'row_g_bottom'],
    colGroupClasses: ['col_g_left', 'col_g_center', 'col_g_right']
  },
  onLoad() {
    this.buildGame();
  },
  buildGame() {
    let matrix = Grid.build();
    console.log(matrix);
    this.setData({
      dataSource: matrix,
      modelDataSource: matrix,
      errDataSource: matrix
    })
  },
  bindPopup(e) {
    let rowIndex = e.currentTarget.dataset.rowindex,
      colIndex = e.currentTarget.dataset.colindex;

    let left = e.target.offsetLeft, top = e.target.offsetTop;
    console.log(e.target);
    this.setData({
      top: top >= 200 ? top - 140 + 'px' : top + 'px',
      left: left >= 200 ? left - 110 + 'px' : left + 'px',
      showPopupNumber: true,
      rowIndex: rowIndex,
      colIndex: colIndex
    })
  },
  selectNumber(e) {
    let number = e.target.dataset.number;
    let data = this.data.dataSource;
    data[this.data.rowIndex][this.data.colIndex] = number;
    this.setData({
      dataSource: data,
      showPopupNumber: false
    })
  },

  getMatrixMarks() {
    Checker.check(this.data.dataSource);
    return Checker._matrixMarks;
  },
  check() {
    this.hidePopupNumBorad();
    this.setData({
      errDataSource: this.data.dataSource
    })
    Checker.reset();
    const marks = this.getMatrixMarks();
    let checkResult = marks.every(row => row.every(mark => mark));
    if (checkResult) {
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
      content: '确定重置游戏吗？',
      success: function (res) {
        if (res.confirm) {
          Checker.reset();
          self.setData({
            dataSource: self.data.modelDataSource
          })
        } else {
          return;
        }
      }
    })
  },
  rebuild() {
    let self = this;
    this.hidePopupNumBorad();
    wx.showModal({
      title: '提示',
      content: '确定重新开始游戏吗？',
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
