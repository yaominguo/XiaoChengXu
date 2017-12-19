import Toolkit from './toolkit.js';
//检查数独的解决方案
let checker = {
  _matrixMarks: Toolkit.matrixToolkit.makeMatrix(true),
  check(matrix) {
    this.checkRows(matrix);
    this.checkCols(matrix);
    this.checkBoxes(matrix);
  },

  //重置检查方案
  reset() {
    this._matrixMarks = Toolkit.matrixToolkit.makeMatrix(true);
  },
  checkArray(array) {
    const length = array.length;
    const marks = new Array(length);
    marks.fill(true);
    for (let i = 0; i < length; i++) {
      if (!marks[i]) { //如果检查之前就已经为false的就不再检查了
        continue;
      }
      const v = array[i];
      //是否有效 0为无效 1-9有效
      if (v == 0) {
        marks[i] = false;
        continue;
      }

      //是否有重复 i+1 到 9 中是否和 i 位置的数据重复
      for (let j = i + 1; j < length; j++) {
        if (v == array[j]) {
          marks[i] = false;
          marks[j] = false;
        }
      }
    }
    return marks;
  },
  //检查行
  checkRows(matrix) {
    for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
      const row = matrix[rowIndex];
      const marks = this.checkArray(row);
      for (let colIndex = 0; colIndex < marks.length; colIndex++) {
        if (!marks[colIndex]) {
          this._matrixMarks[rowIndex][colIndex] = false;
        }
      }
    }
  },
  //检查列
  checkCols(matrix) {
    for (let colIndex = 0; colIndex < 9; colIndex++) {
      const cols = [];
      for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
        cols[rowIndex] = matrix[rowIndex][colIndex];
      }
      const marks = this.checkArray(cols);
      for (let rowIndex = 0; rowIndex < marks.length; rowIndex++) {
        if (!marks[rowIndex]) {
          this._matrixMarks[rowIndex][colIndex] = false;
        }
      }
    }
  },
  // 检查宫
  checkBoxes(matrix) {
    for (let boxIndex = 0; boxIndex < 9; boxIndex++) {
      const boxes = Toolkit.boxToolkit.getBoxCells(matrix, boxIndex);
      const marks = this.checkArray(boxes);
      for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
        if (!marks[cellIndex]) {
          const { rowIndex, colIndex } = Toolkit.boxToolkit.converFromBoxIndex(boxIndex, cellIndex);
          this._matrixMarks[rowIndex][colIndex] = false;
        }
      }
    }
  }
}
export default checker;
