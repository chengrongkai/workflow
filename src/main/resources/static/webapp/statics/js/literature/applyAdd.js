var projectName = property.getProjectPath();
var main = {

  init: function () {
    this.initTable();
    this.tabBind();
    this.getPageData();
    $(".quxiao").click(function () {
      $('.myRefresh', window.parent.document).click();
    })

  },
  getPageData: function () {

  },

  initTable: function () {

    layui.use(['upload', 'element', 'laydate', 'form'], function () {
      var $ = layui.jquery,
          laydate = layui.laydate,
          form = layui.form,
          upload = layui.upload, element = layui.element;

      //执行一个laydate实例
      laydate.render({
        elem: '#planReturnDate' //指定元素
        ,type: 'datetime'
        ,min: 0
      });

      form.on('select(dataName)',function(data) {
        var value = data.value;

        for(var i=0;i<$('#literatureId option').length;i++){
          var dataValue = $('#literatureId option').eq(i).attr("value");
          if (value == dataValue) {
            var dataType = $('#literatureId option').eq(i).attr("dataType");
            if (dataType == 2) {
              $("#planReturnDateDiv").hide();
              $("#planReturnDate").removeAttr("lay-verify");
              $("#applyType").val("2");
            } else {
              $("#planReturnDateDiv").show();
              $("#planReturnDate").attr("lay-verify","required");
              $("#applyType").val("1");
            }
            break;
          }
        }
      });

      form.on('select(approveId)', function(data){
        var value = data.value;

        for(var i=0;i<$('#approveId option').length;i++){
          var dataValue = $('#approveId option').eq(i).attr("value");
          if (value == dataValue) {
            var dataName = $('#approveId option').eq(i).text();
            $("#approveName").val(dataName);
            break;
          }
        }
      });


      //监听提交
      form.on('submit(save)', function (data) {
        data.field.informationSources = "1";
        var data = JSON.stringify(data.field);
        $.ajax({
          url:projectName + '/postLiteratureProcess/postLiteratureProcessSave.do',
          type:"post",
          contentType:"application/json",
          data:data,
          success:function (res) {
            if (res.success == 1) {
              successMsg("申请成功！");
              setTimeout(function () {
                $('.myRefresh', window.parent.document).click();
              },800)
            } else if (res.success == 0){
              errorMsg();
            }
          }
        });
        return false;
      });
      initData();

      function initData() {

        if (!isEmpty(localStorage.userInfo)) {
          var userInfo = JSON.parse(localStorage.userInfo);
          $("#applicant").val(userInfo.userId);
          $("#applicantName").val(userInfo.userName);
          $("#department").val(userInfo.orgId);
          $("#departmentName").val(userInfo.orgName);
          $("#headUserName").text(userInfo.userName);
          $("#headRole").text(userInfo.orgName);
          var nowdate = getNowFormatDate();
          $("#headDate").text(nowdate);
          $("#applyDate").val(nowdate);
        }

        getSelectData();

      }
      function getSelectData() {
        $.ajax({
          url:projectName + '/postLiteratureProcess/getApproveList.do',
          type:'post',
          contentType:"application/json; charset=utf-8",
          success:function(res) {
            if (res.success == 1) {
              var list = res.data;
              var approveStr = "";
              for (var i = 0;i < list.length;i++) {
                approveStr +="<option value='"+list[i].id+"' >"+list[i].name+"</option>"
              }
              $("#approveId").append(approveStr);
              form.render();
            }
          }
        });
        $.ajax({
          url:projectName + '/postLiteratureProcess/getLiteratureName.do',
          type:'post',
          contentType:"application/json; charset=utf-8",
          success:function(res) {
            if (res.success == 1) {
              var list = res.data;
              var nameStr = "";
              for (var i = 0;i < list.length;i++) {
                nameStr +="<option value='"+list[i].id+"' dataType='" +list[i].dataType+ "' >"+list[i].dataName+"</option>"
              }
              $("#literatureId").append(nameStr);
              form.render();
            }
          }
        })
      }
    });
  },

  tabBind: function () {
    //导出函数
    $(".layui-btn-green").on({
      'click': function () {
        return false
      }
    })
    //时间切换
    $(".searchBtn").on({
      'click': function () {
        var index = $(this).index();
        if ($(this).hasClass('active')) {
          return false
        }
        if (index == 1) {
          $(".searchBtn").removeClass("active");
          $(".searchBtn").eq(0).addClass("active");
        } else {
          $(".searchBtn").removeClass("active");
          $(".searchBtn").eq(1).addClass("active");
        }

        return false
      }
    })
  }
}
main.init();
//日历切换
function cDayFunc() {
  main.initTable()
}
function xhrOnProgress(fun) {
  xhrOnProgress.onprogress = fun;
  return function () {
    var xhr = $.ajaxSettings.xhr();
    if (typeof xhrOnProgress.onprogress !== 'function') {
      return xhr;
    }
    if (xhrOnProgress.onprogress && xhr.upload) {
      xhr.upload.onprogress = xhrOnProgress.onprogress;
    }
    return xhr;
  }
}