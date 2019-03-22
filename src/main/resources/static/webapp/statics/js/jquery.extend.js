//添加ajax全局变量
$.ajaxSetup({
  //ajax完成时检查返回数据中是否有页面跳转的命令，如果存在则跳转页面
  complete: function (XMLHttpRequest, textStatus) {
    var result = XMLHttpRequest.responseText;
    if (result.indexOf("url") != -1 && result.indexOf("Redirect") != -1) {
      var url = result.substring(4,result.indexOf("&Redirect"));
      // var login = property.getProjectPath() + url;
      top.location = url;
    }
  }
});