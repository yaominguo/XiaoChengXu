import Generator from './generator.js';

let sudoku = {
  solutionMatrix(){
    Generator.generate();
    return Generator.internalGenerate().solutionMatrix;
  },
  make(level = 5) {
    console.log('sudoku', sudoku.solutionMatrix());
    this.puzzleMatrix = sudoku.solutionMatrix().map((row) => {
      return row.map((cell) => {
        return Math.random() * 9 < level ? 0 : cell;
      })
    })
  }
}

export default sudoku;