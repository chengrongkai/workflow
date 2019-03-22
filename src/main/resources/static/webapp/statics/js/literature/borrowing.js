var projectName = property.getProjectPath();
var main = {

  init: function () {
    this.initTable();
    this.tabBind();
    $(".quxiao").click(function () {
      $('.myRefresh', window.parent.document).click();
    })
  },
  initTable: function () {
    layui.use(['form', 'table', 'laydate'], function () {
      var laydate = layui.laydate,
          form = layui.form;
      //执行一个laydate实例
      laydate.render({
        elem: '#planReturnDate' //指定元素
        ,type: 'datetime'
        ,min: 0
      });

      initData();
      function initData() {
        getSelectData();
        if (!isEmpty(localStorage.userInfo)) {
          var userInfo = JSON.parse(localStorage.userInfo);
          var dataObject = JSON.parse(localStorage.dataObject);
          $("#applicantName").val(userInfo.userName);
          $("#applicant").val(userInfo.userId);
          $("#departmentName").val(userInfo.orgName);
          $("#department").val(userInfo.orgId);
          var nowdate = getNowFormatDate();
          $("#applyDate").val(nowdate);
          $("#literatureName").val(dataObject.dataName);
          $("#literatureId").val(dataObject.id);
        }
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
        })
      }
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
      form.on('submit(formDemo)', function (data) {
        data.field.applyType = "1";
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
              var msg = res.msg;
              errorMsg(msg);
            }
          }
        });
        return false;
      });
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

