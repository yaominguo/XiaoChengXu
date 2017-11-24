import Toolkit from './toolkit.js';

let generator = {
  generate() {
    while (!this.internalGenerate()) {
      // console.log('try again');
    }
  },
  internalGenerate() {
    this.matrix = Toolkit.matrixToolkit.makeMatrix();
    this.orders = Toolkit.matrixToolkit.makeMatrix()
      .map(row => row.map((v, i) => i))
      .map(row => Toolkit.matrixToolkit.shuffle(row));
    for (let n = 1; n <= 9; n++) {
      if (!this.fillNumber(n)) {
        return false;
      }
    }
    return true;
  },
  fillNumber(n) {
    return this.fillRow(n, 0);
  },
  fillRow(n, rowIndex) {
    if (rowIndex > 8) {
      return true;
    }
    const row = this.matrix[rowIndex];
    const orders = this.orders[rowIndex];
    for (let i = 0; i < 9; i++) {
      const colIndex = orders[i];
      if (row[colIndex]) {
        continue;
      }

      if (!Toolkit.matrixToolkit.checkFillable(this.matrix, n, rowIndex, colIndex)) {
        continue;
      }

      row[colIndex] = n;

      if (!this.fillRow(n, rowIndex + 1)) {
        row[colIndex] = 0;
        continue;
      }
      return true;
    }
    return false;
  }

}
export default generator;