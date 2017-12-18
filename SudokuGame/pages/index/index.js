import Grid from '../../utils/ui/grid.js'
import Toolkit from '../../utils/core/toolkit.js'
//获取应用实例
let app = getApp()

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
    let matrix = Grid.build();
    // let matrix = Toolkit.matrixToolkit.makeMatrix().map(row => row.map((v, i) => i))
    //   .map(row => Toolkit.matrixToolkit.shuffle(row));
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
      dataSource:data,
      showPopupNumber:false
    })
  }
}

Page(handler)
