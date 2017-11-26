import Grid from '../../utils/ui/grid.js'
import Toolkit from '../../utils/core/toolkit.js'
//获取应用实例
let app = getApp()

let handler = {
  data: {
    left:0,
    top:0,
    showPopupNumber:false,
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
  },
  bindPopup(e){
    console.log(e);
    let data="dataSource["+0+"]["+0+"]";
    this.setData({
      [data]:6
    })
    // console.log(e);
    // e.target.dataset.item='6';
    // let left=e.target.offsetLeft,top=e.target.offsetTop;
    // this.setData({
    //   top:top+'px',
    //   left:left+'px',
    //   showPopupNumber:true
    // })
  },
  selectNumber(e){
    console.log(e);
    let id=e.target.id;
    console.log(id);
  }
}

Page(handler)
