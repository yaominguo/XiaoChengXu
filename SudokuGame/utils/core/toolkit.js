let toolkit={
  matrix:{
    makeRow(v=0){
      const array = new Array(9);
      array.fill(v);
      return array;
    },
    makeMatrix(v=0){
      return Array.from({length:9},()=>this.makeRow(v));
    }
  }
};
export default toolkit;