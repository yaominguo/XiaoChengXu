import Generator from './generator.js';

let sudoku = {
  puzzleMatrix:[],
  solutionMatrix(){
    Generator.generate();
    return Generator.orders;
  },
  make(level = 5) {
    console.log('sudoku', this.solutionMatrix());
    // this.puzzleMatrix = this.solutionMatrix().map((row) => {
    //   return row.map((cell) => {
    //     return Math.random() * 9 < level ? 0 : cell;
    //   })
    // })
    // return this.puzzleMatrix;
    return this.solutionMatrix();
  }
}

export default sudoku;