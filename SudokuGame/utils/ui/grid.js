import Sudoku from '../core/sudoku.js';

let grid = {
  build() {
    const matrix = Sudoku.make();
    return matrix;
  }
};
export default grid;