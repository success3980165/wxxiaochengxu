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

function http(url, callback) { //访问api的公共方法  因为是异步的方法所以要有个回调函数  回调函数就是一个参数，将这个函数作为参数传到另一个函数里面，当那个函数执行完之后，再执行传进去的这个函数。这个过程就叫做回调。
  wx.request({
    url: url,
    method: 'GET',
    header: { //必须要是设置header
      "Content-Type": "json"
    },
    success: function(res) {
      callback(res.data)
    },
    fail: function(error) {
      console.log(error)
    },
  })
}

function convertToCastString(casts) { //演员的名字用斜杠拼起来的函数
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos

}