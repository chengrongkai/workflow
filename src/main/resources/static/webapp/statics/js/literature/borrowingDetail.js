var informationSourceList = null;
var id = null;
var info = null;
var tableId = "";
var attachmentsList = null;
var attCount = 0;
var main={

    init:function () {
        this.initTable();
        this.tabBind();
    },
    initTable:function(){
        layui.use('laydate', function(){
            var laydate = layui.laydate;

            //执行一个laydate实例
            laydate.render({
                elem: '#planReturnDate' //指定元素
            });
        });
        layui.use('form', function(){
            var form = layui.form;

            //监听提交
            form.on('submit(formDemo)', function(data){
                layer.msg(JSON.stringify(data.field));
                return false;
            });
        });
        setSelect();
        id = localStorage.id;
        loadData(id);

    },

    tabBind:function () {
        //导出函数
        $(".layui-btn-green").on({
            'click':function () {
                return false
            }
        })
        //时间切换
        $(".searchBtn").on({
            'click':function () {
                var index=$(this).index();
                if($(this).hasClass('active'))return false
                if(index==1){
                    $(".searchBtn").removeClass("active");
                    $(".searchBtn").eq(0).addClass("active");
                }else{
                    $(".searchBtn").removeClass("active");
                    $(".searchBtn").eq(1).addClass("active");
                }

                return false;
            }
        })
        //借阅
        $("#borrow").click(function () {
            var inventoryState = localStorage.inventoryState;
            if (inventoryState > 0) {
                top.layer.confirm('您确定要借出吗？', {
                    title: '借出确认',
                    area: ['450px', '218px'],
                    skin: 'demo-class',
                    btn: ['取消', '确认']
                }, function (index, layero) {
                    top.layer.close(index);
                }, function (index) {
                    $.ajax({
                        url: property.getProjectPath() + '/postLiteratureProcess/modifyState.do',
                        type: 'post',
                        data: {"id": id, "status": "2"},
                        success: function (result) {
                            if (result.success == "1") {
                                successMsg("借出成功！");
                            } else if (result.success == 0){
                            var resultMsg = result.error.message;
                            errorMsg(resultMsg);
                            }
                            tableIns.reload();
                            top.layer.close(index);
                        }
                    })
                });
                return false;
            } else {
                alertMsg("库存数量不足！")
            }
        });
        //归还
        $("#back").click(function () {
          top.layer.confirm('您确定要归还吗？', {
                title: '归还确认',
                area: ['450px', '218px'],
                skin: 'demo-class',
                btn: ['取消', '确认']
            }, function (index, layero) {
            top.layer.close(index);
            }, function (index) {
                $.ajax({
                    url: property.getProjectPath() + '/postLiteratureProcess/modifyState.do',
                    type: 'post',
                    data: {"id": id, "status": "3"},
                    success: function (result) {
                        if (result.success == "1") {
                            successMsg("归还成功！");
                        } else if (result.success == 0){
                            var resultMsg = result.error.message;
                            errorMsg(resultMsg);
                        }
                        tableIns.reload();
                      top.layer.close(index);
                    }
                })
            });
        });
        //打印
        $("#print").click(function () {
                // $("#content").print({
                //     globalStyles: false,
                //     mediaPrint: false,
                //     stylesheet: null,
                //     noPrintSelector: ".no-print",
                //     iframe: false,
                //     append: null,
                //     prepend: null,
                //     deferred: $.Deferred()
                // })
            window.print();
        });
    }
}
main.init();
//日历切换
function cDayFunc() {
    main.initTable()
}
function xhrOnProgress(fun) {
    xhrOnProgress.onprogress = fun;
    return function() {
        var xhr = $.ajaxSettings.xhr();
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }                return xhr;
    }     }

function loadData(id) {
    layui.use('form', function(){
        var form = layui.form;
        var index = parent.layer.getFrameIndex(window.name);
        var json = {"id":id};
        //加载数据
        $.ajax({
            type:"get",
            data:json,
            async:false,
            url:property.getProjectPath()+"postLiteratureProcess/getLiteratureProcessById.do",
            success:function(result) {
                if (result.success == 1) {
                    info = result.data;
                    setFormData(result.data);
                  form.render('select');
                } else if (result.success == 0){
                    errorMsg(result.error.message);
                }
            },
            error:function(result) {
                errorMsg("系统异常");
            }
        });
    });
}

function setFormData(data) {
    property.setForm($("#borrowingForm"),data);
    $("#informationSources").val(data.informationSources);

    $("#planReturnDate").val(formatSimpleDate(data.planReturnDate));
    var applicant = getUserName(data.applicant);
    $("#applicant").val(applicant);
    if (!isEmpty(data.approveId)) {
        var approveId = getUserName(data.approveId);
        $("#approveId").val(approveId);
    }

    var text = "当前订单状态：";
    var status = property.getDictData("apply_status");
    text = text+property.getTextByValuePlus(status,data.applyStatus,"dictCode","dictName");
    $("#status").text(text);
    //已申请
    if (data.applyStatus == "0" || data.applyStatus == "1"){
        $("#apply").text(applicant);
        $("#applyTime").text(formatDate(data.createTime));
        $("#borrow").removeClass("layui-hide");
    }
    //已借阅
    else if (data.applyStatus == "2"){
        $("#apply").text(applicant);
        $("#applyTime").text(formatDate(data.createTime));
        $("#approval").text(approveId);
        $("#approvalTime").text(formatDate(data.borrowingDate));
        $("#back").removeClass("layui-hide");
    }
    //已归还
    else if (data.applyStatus == "3"){
        $("#apply").text(applicant);
        $("#applyTime").text(formatDate(data.createTime));
        $("#approval").text(approveId);
        $("#approvalTime").text(formatDate(data.borrowingDate));
        $("#return").text(applicant);
        $("#returnTime").text(formatDate(data.realReturnDate));

    }

  tableId = data.attachmentId;
  attachmentsList = loadAttachments(tableId);
  var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
  $("#attachmentsList").append(attachmentsListSelect);
  if (null != attachmentsList){
    if (true) {
      //显示附件
      if (null != attachmentsList){
        var attList = '';
        for (var i=0;i<attachmentsList.length;i++){
          var attachment = attachmentsList[i];
          var type = 'img'
          var srcStr = attachment.attPath;
          var data = attachment.attPath;
          debugger;
          if (attachment.attFileType == 1){
            type = 'img';
          }else if (attachment.attFileType == 4){
            type = 'video';
            srcStr = "../../statics/img/分组 2.svg";
          }else if (attachment.attFileType == 3){
            type = 'audio'
            srcStr = "../../statics/img/分组 3.svg";
          }else{
              type = '';
              srcStr = "../../statics/img/分组 2.svg";
          }
          var liStr = "<li class=\"imgItem\" data-type="+type+">\n" +
              "                                <img  style='max-width: 200px;' src='"+srcStr+"' alt='' data='"+data+"'>\n" +
              "                                <p class='myfont'>"+attachment.attName+"</p>\n" +

              "                            </li>";
          attList = attList+liStr;

        }
        $(".imgList").append(attList);
        $(".imgList li").on({
          'click':function () {
            if($(this).attr("data-type")=="img"){
              parent.layer.open({
                type: 1,
                title:false,
                closeBtn: 0, //不显示关闭按钮
                // area: ['420px', '240px'], //宽高
                shadeClose: true, //开启遮罩关闭
                content: "<div style='position: relative;height: 450px'><img style='max-width:" +
                " 600px;position:" +
                " absolute;max-height:100%;margin: auto;left: 0;right: 0;top:0;bottom:0'" +
                " src='"+$(this).find("img").attr("data")+"'/></div> "
                  /*  content: "<div style='position: relative;height: 800px'><img style='max-width: 800px;position:" +
                   " absolute;margin: auto;left: 0;right: 0;top:0;bottom:0'" +
                   " src='"+$(this).find("img").attr("data")+"'/></div> "*/
              })
            }else if($(this).attr("data-type")=="video"){
              parent.layer.open({
                type: 1,
                title:false,
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true, //开启遮罩关闭
                content: "<video src='"+$(this).find("img").attr("data")+ "' controls='controls'" +
                " height='300'>" +
                "您的浏览器不支持 video 标签。" +
                "'</video> "
              })
            }else if($(this).attr("data-type")=="img"){
              parent.layer.open({
                type: 1,
                title:false,
                closeBtn: 0, //不显示关闭按钮
                shadeClose: true, //开启遮罩关闭
                content: "<audio src='"+$(this).find("img").attr("data")+"' controls='controls'>" +
                "</audio> "
              })
            }
          }
        })
      }
    } else {
      attCount = attachmentsList.length;
      $("#demoList").append(component.getAttachmentList(attachmentsList));
    }
  }

}

function setSelect() {
    // informationSourceList = property.getDictDataMulti(['']);
}

function getUserName(id) {
    var data = null;
    var json = {"id":id};
    $.ajax({
        type:"get",
        data:json,
        async:false,
        url:property.getProjectPath()+"RoleAuth/getUserById.do",
        success:function(result) {
            if (result.success == 1) {
                data = result.data.name;
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
    return data;
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

// function getDetail(id) {
//     var json = {"processId":id};
//     $.ajax({
//         type:"get",
//         data:json,
//         async:false,
//         url:property.getProjectPath()+"postLiteratureProcessDetail/getProcessDetailByProcess.do",
//         success:function(result) {
//             if (result.success == 1) {
//                 data = result.data;
//                 if (data.length>0){
//                     for (var i=0;i<data.length;i++){
//                         var temp = data[i];
//                         if (temp.processOperation == "-1"){
//                             $("#apply").text(getUserName(temp.processUserId));
//                             $("#applyTime").text(formatDate(temp.createTime));
//                         }else if(temp.processOperation == "1"){
//                             $("#approval").text(getUserName(temp.processUserId));
//                             $("#approvalTime").text(formatDate(temp.createTime));
//                         }else if(temp.processOperation == "1"){
//                             $("#approval").text(getUserName(temp.processUserId));
//                             $("#approvalTime").text(formatDate(temp.createTime));
//                         }
//                     }
//                 }
//             } else {
//                 top.layer.msg(result.error.message);
//             }
//         },
//         error:function(result) {
//             top.layer.msg("系统异常");
//         }
//     });
//
// }