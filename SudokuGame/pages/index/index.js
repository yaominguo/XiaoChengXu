import Grid from '../../utils/ui/grid.js'
//获取应用实例
let app = getApp()

let handler = {
  data: {
    dataSource: '',
    rowGroupClasses: ['row_g_top', 'row_g_middle', 'row_g_bottom'],
    colGroupClasses: ['col_g_left', 'col_g_center', 'col_g_right']
  },
  onLoad() {
    console.log('onload');
    let matrix = Grid.build();
    conosle.log(matrix);
    this.setData({
      dataSource: matrix
    })
  }
}

Page(handler)
