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

    layui.use(['upload', 'element','laydate','form', 'table'], function () {
      var $ = layui.jquery,
          laydate = layui.laydate,
          form = layui.form,
          table = layui.table,
          upload = layui.upload, element = layui.element;

      //执行一个laydate实例
      laydate.render({
        elem: '#publishingTime' //指定元素
      });
      laydate.render({
        elem: '#warehousingTime' //指定元素
      });
      userId = "";
      userName = "";
      initData();
      function initData() {
        if (!isEmpty(localStorage.userInfo)) {
          var userInfo = JSON.parse(localStorage.userInfo);
          $("#headUserName").text(userInfo.userName);
          userId = userInfo.userId;
          userName = userInfo.userName;
          $("#approveId").val(userId);
          $("#preApproveId").val(userId);
          $("#approveName").val(userName);
          $("#headRole").text(userInfo.orgName);
          var nowdate = getNowFormatDate();
          $("#headDate").text(nowdate);
        }
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
              $("#approve").append(approveStr);
              form.render();
            }
          }
        });
      }

      form.on('select(approveId)', function(data){
        var value = data.value;
        for(var i=0;i<$('#approve option').length;i++){
          var dataValue = $('#approve option').eq(i).attr("value");
          if (value == dataValue) {
            var dataName = $('#approve option').eq(i).text();
            $("#approveName").val(dataName);
            $("#approveId").val(value);
            break;
          }
        }
      });

      form.on('radio(approveOperation)', function(data){
        var approveOperationVal =  data.value;
        if (approveOperationVal == "3") {
          $("#approveDiv").removeClass("layui-hide");
          $("#approveDiv").show();
          $("#approveId").attr("lay-verify","required");
        } else {
          $("#approveDiv").hide();
          $("#approveId").removeAttr("lay-verify");
          $("#approveName").val("");
          $("#approveId").val(userId);
        }

      });

      var applyData = sessionStorage.getItem('applyData');
      var dataObject = JSON.parse(applyData);
      var pageStatus = sessionStorage.getItem('pageStatus');
      setData();
      function setData() {

        $("#literatureName").val(dataObject.literatureName);
        $("#applicantName").val(dataObject.applicantName);
        $("#applicant").val(dataObject.applicant);
        $("#callNo").val(dataObject.callNo);
        $("#planReturnDate").val(dataObject.planReturnDate);
        $("#applyReasons").val(dataObject.applyReasons);
        $("#applyRemark").val(dataObject.applyRemark);
        $("#literatureId").val(dataObject.literatureId);
        $("#id").val(dataObject.id);
        if (dataObject.applyType == "2") {
          $("#planReturnDateLi").hide();
        }
        if (pageStatus != "1") {
          $('.approveBox').hide();
        }
        form.render();
      }
      var tableIns = table.render({
        elem: '#applyApprovalList'
        , url: projectName + '/postLiteratureProcessDetail/processDetailList.do'
        , request:{
          pageName: 'currentPage',
          limitName: 'size'
        }
        , where:{
          id:dataObject.id
        }
        , cols: [[
            {field: 'createTimeStr', title: '时间',width:"20%"}
          , {field: 'processOperationName', title: '操作',width:"20%"}
          , {field: 'processUserName', title: '操作人',width:"20%"}
          , {field: 'processOrgName', title: '所属部门',width:"20%"}
          , {field: 'processRemark', title: '备注',width:"20%"}
        ]]
        , page: true
        ,limits : [10,15,20,25]
        , limit : 10
        , id : "applyApprovalListTable"
      });

      form.on('submit(saveAndSubmit)', function (data) {
        saveInfo(data);
        return false;
      });

      function saveInfo(data) {
        var data = JSON.stringify(data.field);
        $.ajax({
          url:projectName + '/postLiteratureProcess/approveSave.do',
          type:"post",
          contentType:"application/json",
          data:data,
          success:function (res) {
            if (res.success == 1) {
              successMsg("提交成功！");
              $('.msg').css("top","300px");
              setTimeout(function () {
                $('.myRefresh', window.parent.document).click();
              },800)
            } else if (res.success == 0){
              errorMsg();
              $('.msg').css("top","300px");
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
