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
      modelDataSource: matrix
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
  check() {
    // const $rows = this._$container.children();
    // const data = this.data.dataSource.map((row, rowIndex) => {
    //   return row.map((col, colIndex) => {
    //     console.log('value:',col);
    //     return parseInt(col) || 0;
    //   })
    // }).toArray().map($data => $data.toArray());
    const checkResult = Checker.check(this.data.dataSource);
    if (checkResult) {
      return true;
    }
    //检查不成功，进行标记
    const marks = Checker._matrixMarks;
    console.log(marks);
    this.data.dataSource.map((row, rowIndex) => {
      row.map((col, colIndex) => {
        if (this.data.modelDataSource[rowIndex][colIndex] != 0 || marks[rowIndex][colIndex]) {
          // $span.removeClass('error');
          return;
        } else {
          // $span.addClass('error');
          let data = this.data.dataSource;
          data[rowIndex][colIndex] = 'error';
          this.setData({
            dataSource: data
          })
        }
      })
    })
  },
  reset() {
    this.setData({
      dataSource: this.data.modelDataSource
    })
  },
  rebuild() {
    this.buildGame();
  }
}

Page(handler)
