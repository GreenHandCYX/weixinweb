
function currentStarsCounts(stars) {
  //用于返回星星评分队列
  var num = stars.substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
};
function douban_limit() {
  //豆瓣api访问限制
  var timestamp = Date.parse(new Date());//当前时间
  var requestDoubanTime = wx.getStorageSync('requestDoubanTime');
  var requestDoubanNum = wx.getStorageSync('requestDoubanNum');
  if (requestDoubanTime && timestamp - requestDoubanTime < 60000) {
    //一秒内
    wx.setStorageSync('requestDoubanNum', requestDoubanNum += 1);
    if (requestDoubanNum < 35) {
      //Lower than 35/m,pass            
      return;
    }
    else {
      wx.showToast({
        title: '豆瓣api请求频率超35次/m，小心',
        icon: 'loading',
        duration: 5000
      })
      //提示或者去别的地方
      // wx.redirectTo({
      //      url:"pages/welcome/welcome"
      // });
    }
  }
  else {
    wx.setStorageSync('requestDoubanTime', timestamp);
    wx.setStorageSync('requestDoubanNum', 1);
  }
}
function http(url, callback,key="",urlTitle="") {
  douban_limit();
  var self = this;
  wx.request({
    url: url,
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: { "Content-Type": "json" }, // 设置请求的 header,以及请求格式
    success: function (res) {
      // success
      console.log(url);
      callback(res.data,key,urlTitle);
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
};
function convertToCastString(data) {
  var castjoin = "";
  for (var ind in data) {
    castjoin = castjoin + data[ind].name + "/";
  }
  return castjoin.substring(0, castjoin.length - 2);
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
  http: http,
  currentStarsCounts: currentStarsCounts,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
};
