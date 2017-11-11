Page({
  data:{
    
  },
  onTap:function(){
    //bindtap会触发冒泡事件,catchtap可以阻止冒泡

  /*  wx.navigateTo({
      url: '../posts/post'
    })*/
  /*  wx.redirectTo({
      url: '../posts/post'
    })*/
    wx.switchTab({
      url: '../posts/post'
    })
  }
})