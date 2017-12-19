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
    this.setData({
      top: top + 'px',
      left: left + 'px',
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
    Checker.reset();
    const marks = this.getMatrixMarks();
    let checkResult = marks.every(row => row.every(mark => mark));
    if (checkResult) {
      return true;
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
    }

  },
  reset() {
    Checker.reset();
    this.setData({
      dataSource: this.data.modelDataSource
    })
  },
  rebuild() {
    Checker.reset();
    this.buildGame();
  }
}

Page(handler)
