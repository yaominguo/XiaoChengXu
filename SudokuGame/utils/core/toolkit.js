
/*矩阵和数组相关工具*/
let matrixToolkit = {
  makeRow(v = 0) {
    const array = new Array(9);
    array.fill(v);
    return array;
  },
  makeMatrix(v = 0) {
    return Array.from({ length: 9 }, () => this.makeRow(v));
  },

  /*Fisher-Yates 洗牌法，对传入数组进行随机排序，最后返回排序后的数组*/
  shuffle(array) {
    const length = array.length;
    const endIndex = length - 2;
    for (let i = 0; i < endIndex; i++) {
      const j = i + Math.floor((length - i) * Math.random());
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  /*检查指定位置可以填写数字n*/
  checkFillable(matrix, n, rowIndex, colIndex) {
    const row = matrix[rowIndex];
    const column = this.makeRow().map((v, i) => matrix[i][colIndex]);
    const boxIndex = boxToolkit.converToBoxIndex(rowIndex, colIndex).boxIndex;
    const box = boxToolkit.getBoxCells(matrix, boxIndex);
    for (let i = 0; i < 9; i++) {
      if (row[i] === n || column[i] === n || box[i] === n) {
        return false;
      }
    }
    return true;
  }
};

/*宫坐标系工具*/
let boxToolkit = {
  getBoxCells(matrix, boxIndex) {
    const startRowIndex = Math.floor(boxIndex / 3) * 3;
    const startColIndex = boxIndex % 3 * 3;
    const result = [];
    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      const rowIndex = startRowIndex + Math.floor(cellIndex / 3);
      const colIndex = startColIndex + cellIndex % 3;
      result.push(matrix[rowIndex][colIndex]);
    }
    return result;
  },
  converToBoxIndex(rowIndex, colIndex) {
    return {
      boxIndex: Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3),
      cellIndex: rowIndex % 3 * 3 + colIndex % 3
    }
  },
  converFromBoxIndex(boxIndex, cellIndex) {
    return {
      rowIndex: Math.floor(boxIndex / 3) * 3 + Math.floor(cellIndex / 3),
      colIndex: boxIndex % 3 * 3 + cellIndex % 3
    }
  }
}

let toolkit = {
  matrixToolkit: matrixToolkit,
  boxToolkit: boxToolkit
}
export default toolkit;