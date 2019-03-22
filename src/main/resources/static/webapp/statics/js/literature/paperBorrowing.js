var projectName = property.getProjectPath();
var tableId = property.getTimeJson();
var attachmentsList = null;
var attCount = 0;
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
        $("#attachmentId").val(tableId);
        getSelectData();
        getUpload();
        if (!isEmpty(localStorage.userInfo)) {
          var userInfo = JSON.parse(localStorage.userInfo);
          $("#approveId").val(userInfo.userId);
          // $("#applicantName").val(userInfo.userName);
          // $("#applicant").val(userInfo.userId);
          // $("#department").val(userInfo.orgId);
          // var nowdate = getNowFormatDate();
          // $("#applyDate").val(nowdate);
        }
      }

      function getSelectData() {
        $.ajax({
          url:projectName + '/sysUser/getSysUserList.do',
          data:{"currentPage":"1","size":"99999"},
          type:'get',
          contentType:"application/json; charset=utf-8",
          success:function(res) {
            if (res.success == 1) {
              var list = res.data;
              var applicantStr = "";
              for (var i = 0;i < list.length;i++) {
                applicantStr +="<option value='"+list[i].id+"' >"+list[i].name+"</option>"
              }
              $("#applicant").append(applicantStr);
              form.render();
            }
          }
        })
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

      function getUpload() {
        layui.use(['upload', 'element','laydate','form'],function() {
          var $ = layui.jquery
              ,upload = layui.upload,element = layui.element;
          var demoListView = $('#demoList')
              ,uploadListIns = upload.render({
            elem: '#test10'
            ,url: property.getProjectPath()+"attach/upload.do?tableName="+"post_literature"+"&tableId="+tableId
            ,accept: 'file'
            ,multiple: true
            ,auto: false
            ,xhr:xhrOnProgress
            ,progress:function(index,value){//上传进度回调 value进度值
              var tr = demoListView.find('#upload-'+ index)
                  ,tds = tr.children();
              tds.eq(1).html('<span style="color: red;">正在上传</span>');
              element.progress('progressBar'+index, value+'%')//设置页面进度条
            }
            ,bindAction: '#testListAction'
            ,choose: function(obj){
              var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
              //读取本地文件
              obj.preview(function(index, file, result){
                var tr=$(["<li>" +
                "<div class='upLeft' id='upload-"+index+"'>" +
                "<span class=\"fileName\">"+file.name+"</span>" +
                "<span class=\"fileState\">准备上传</span>" +
                "</div>" +
                "<div class=\"upRight\">" +
                "<div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"+index+"'>" +
                "<div class=\"layui-progress-bar layui-progress-big layui-bg-red\" lay-percent=\"30%\">" +
                '<span class="layui-progress-text">'+'0%'+'</span>'+'</div>' +
                "</div>" +
                "<a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 layui-hide demo-reload\">重传</a>" +
                "<a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 demo-cancel\">取消</a>" +
                "</div>" +
                "</li>"].join(''));
                //单个重传
                tr.find('.demo-reload').on('click', function(){
                  obj.upload(index, file);
                });
                demoListView.append(tr);
                //删除

              });
            }
            ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
              //layer.load(); //上传loading
            }
            ,done: function(res, index, upload){
              if(res.code == 1){ //上传成功
                attCount = attCount+1;
                var tr = demoListView.find('#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(1).html('<span style="color: #5FB878;">上传成功</span>');
                //tds.eq(2).html(''); //清空操作
                tr.siblings(".upRight").find(".demo-reload").remove();
                tr.siblings(".upRight").find(".demo-cancel").addClass("demo-delete");
                tr.siblings(".upRight").find(".demo-cancel").text("删除");
                tr.siblings(".upRight").find(".demo-cancel").attr("data-id",res.data.id);
                tr.siblings(".upRight").find(".demo-delete").removeClass("demo-cancel");

                tr.siblings(".upRight").find(".layui-bg-red").addClass("layui-bg-green");
                tr.siblings(".upRight").find(".layui-bg-green").removeClass("layui-bg-red");
                return delete this.files[index]; //删除文件队列已经上传成功的文件
              }else {
                var tr = demoListView.find('#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(1).html('<span style="color: #5FB878;">'+res.msg+'</span>');
                //tds.eq(2).html(''); //清空操作
                //tr.siblings(".upRight").find(".demo-reload").remove();
                //tr.siblings(".upRight").find(".demo-delete").remove();
                // return delete this.files[index]; //删除文件队列已经上传成功的文件
              }
              this.error(index, upload);
            }
            ,error: function(index, upload){
              var tr = demoListView.find('#upload-'+ index)
              //     ,tds = tr.children();
              // tds.eq(1).html('<span style="color: #FF5722;">上传失败</span>');
              tr.siblings(".upRight").find('.demo-reload').removeClass('layui-hide'); //显示重传
            }
          });
          //删除附件
          $('#demoList').on('click','.demo-delete',function(){
            var attId = $(this).attr("data-id");
            // delete files[index]; //删除对应的文件
            $(this).parent().parent().remove();
            deleteAttachment(attId);
            attachmentsList = loadAttachments(tableId);
            attCount = attCount-1;
            // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
          });
          //取消上传
          $('#demoList').on('click','.demo-cancel',function(){
            var attId = $(this).attr("data-id");
            // delete files[index]; //删除对应的文件
            $(this).parent().parent().remove();
            // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
          });
        })
      }
      //删除附件
      $('#demoList').on('click','.demo-delete',function(){
        var attId = $(this).attr("data-id");
        // delete files[index]; //删除对应的文件
        $(this).parent().parent().remove();
        deleteAttachment(attId);
        attachmentsList = loadAttachments(tableId);
        attCount = attCount-1;
        // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
      });
      //取消上传
      $('#demoList').on('click','.demo-cancel',function(){
        var attId = $(this).attr("data-id");
        // delete files[index]; //删除对应的文件
        $(this).parent().parent().remove();
        // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
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
      form.on('submit(formDemo)', function (data) {
        data.field.applyType = "1";
        data.field.informationSources = "1";

        var data = JSON.stringify(data.field);
        $.ajax({
          url:projectName + '/postLiteratureProcess/savePaperBorrowing.do',
          type:"post",
          contentType:"application/json",
          data:data,
          success:function (res) {
            if (res.success == 1) {
              successMsg("申请成功！");
              setTimeout(function () {
                $('.myRefresh', window.parent.document).click();
              },500)
            } else if (res.success == 0){
              errorMsg();
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

//删除附件

function deleteAttachment(attId) {
  var json = {"attId":attId};
  $.ajax({
    type:"post",
    data:json,
    async:false,
    url:property.getProjectPath()+"attach/deleteAttachment.do",
    success:function(result) {
      if (result.success == 1) {
        successMsg("删除成功");
        attachmentsList = loadAttachments(tableId);
      } else if (result.success == 0){
        errorMsg(result.data);
      }
    },
    error:function(result) {
      errorMsg("系统异常");
    }
  });
}
function loadAttachments(fkId) {
  var datas = null;
  var json = {"fkId":fkId};
  $.ajax({
    type:"get",
    data:json,
    async:false,
    url:property.getProjectPath()+"attach/getAttachmentsByFkId.do",
    success:function(result) {
      if (result.success == 1) {
        datas = result.data;
      } else if (result.success == 0){
        errorMsg(result.data);
      }
    },
    error:function(result) {
      errorMsg("系统异常");
    }
  });
  return datas;
}

