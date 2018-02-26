function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1); //获取数据的评分做已调整
  var array = []; //按照[1,1,1,1,1]的形式来进行评分，这是5分 把循环好的数据推进数组
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}
module.exports = {
  convertToStarsArray: convertToStarsArray
}