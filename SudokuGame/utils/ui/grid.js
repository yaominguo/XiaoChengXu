import Sudoku from '../core/sudoku.js';

let grid = {
  build() {
    Sudoku.make();
    const matrix = Sudoku.make().puzzleMatrix;
    console.log(matrix);
    return matrix;
  }
};
export default grid;