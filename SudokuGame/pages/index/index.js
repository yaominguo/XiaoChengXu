import Grid from '../../utils/ui/grid.js'
import Toolkit from '../../utils/core/toolkit.js'
//获取应用实例
let app = getApp()

let handler = {
  data: {
    dataSource: '',
    rowGroupClasses: ['row_g_top', 'row_g_middle', 'row_g_bottom'],
    colGroupClasses: ['col_g_left', 'col_g_center', 'col_g_right']
  },
  onLoad() {
    let matrix = Grid.build();
    // let matrix = Toolkit.matrixToolkit.makeMatrix().map(row => row.map((v, i) => i))
    //   .map(row => Toolkit.matrixToolkit.shuffle(row));
    console.log(matrix);
    this.setData({
      dataSource: matrix
    })
  }
}

Page(handler)
