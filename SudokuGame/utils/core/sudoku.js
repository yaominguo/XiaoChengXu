import Generator from './generator.js';

let sudoku={
  
  make(level=5){
    this.puzzleMatrix=Generator.matrix.map((row)=>{
      return row.map((cell)=>{
        return Math.random()*9<level?0:cell;
      })
    })
    console.log(this.puzzleMatrix);
    return this.puzzleMatrix;
  }
}

export default sudoku;