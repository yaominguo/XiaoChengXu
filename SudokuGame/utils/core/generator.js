import Toolkit from './toolkit.js';


//生成数独解决方案
let generator = {
  matrix: [],
  ord: [],
  generate() {
    while (!this.internalGenerate()) {
      // console.log('try again');
    }

  },
  internalGenerate() {
    let self = this;
    // 先生成数字1~9的9行9列的数组，然后用洗牌算法打乱数字排列
    this.matrix = Toolkit.matrixToolkit.makeMatrix();
    this.orders = Toolkit.matrixToolkit.makeMatrix()
      .map(row => row.map((v, i) => i))
      .map(row => Toolkit.matrixToolkit.shuffle(row));
    for (let n = 1; n <= 9; n++) {
      if (!self.fillNumber(n)) {
        return false;
      }
    }
    return true;
  },
  fillNumber(n) {
    return this.fillRow(n, 0);
  },
  fillRow(n, rowIndex) {
    let self = this;
    if (rowIndex > 8) {
      return true;
    }
    const row = this.matrix[rowIndex];
    const orders = this.orders[rowIndex];
    for (let i = 0; i < 9; i++) {
      const colIndex = orders[i];

      //如果这个位置有值则跳过
      if (row[colIndex]) {
        continue;
      }

      // 检查这个位置是否可以填入n
      if (!Toolkit.matrixToolkit.checkFillable(self.matrix, n, rowIndex, colIndex)) {
        continue;
      }

      row[colIndex] = n;

      // 去下一行填写n，如果没有填进去则继续寻找当前行的下一行
      if (!self.fillRow(n, rowIndex + 1)) {
        row[colIndex] = 0;
        continue;
      }
      return true;
    }
    return false;
  }

}
export default generator;