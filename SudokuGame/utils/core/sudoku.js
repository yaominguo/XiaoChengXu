import Generator from './generator.js';

let sudoku = {
  puzzleMatrix: [],
  solutionMatrix() {
    Generator.generate();
    return Generator.matrix;
  },
  make(level = 5) {
    // console.log('sudoku', this.solutionMatrix());
    this.puzzleMatrix = this.solutionMatrix().map((row) => {
      return row.map((cell) => {
        //随机生成一些空白格
        return Math.random() * 9 < level ? 0 : cell;
      })
    })
    return this.puzzleMatrix;
  }
}

export default sudoku;