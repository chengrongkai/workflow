var videoSaveTypeList = null;
var videoSourceList = null;
var videoTypeList = null;
var videoMarkList = null;
var authSettingList = null;
var tableId = '';
var attachmentsList = null;
var commentsList = new Array();
var statusDictList = property.getDictData("video_status");
var form1;
var videoId = null;
//所有用户列表
var userList = property.getAllUserList();
//所有部门列表
var orgList = property.getAllOrgList();
//页面属性
var pageType = "detail";
//当前用户的流程状态
var currentStatus = null;
var main={
    init:function () {

        //设置用户信息
        property.setUserInfo();
        pageType = localStorage.pageType;
        videoId = localStorage.videoId;
        localStorage.removeItem('videoId');
        currentStatus = property.getProcessStatus(userInfo.userId,videoId,"1");
        //加载业务字典
        getDictData();
        //设置下拉框
        setSelect();

        //设置日期选择框
        layui.use('laydate', function(){
            var laydate = layui.laydate;

            //执行一个laydate实例
            laydate.render({
                elem: '#makeTime' //指定元素
            });
        });
            // loadData(id);
            layui.use('form', function(){
                var form = layui.form;
                form1 = form;
                var index = parent.layer.getFrameIndex(window.name);
                var json = {"id":videoId};
                //加载数据
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+"PostVideo/queryPostVideoDtoById.do",
                    success:function(result) {
                        if (result.success == 1) {
                            var status = result.data.status;

                            setFormData(result.data);
                            //设置按钮的显示与隐藏

                            if (currentStatus != null){
                                if (status == "4"){
                                    $("#setAuthSetting").show();
                                    $("#editVideo").show();
                                    $("#approval").hide();
                                }else if (status == "3"){
                                    $("#editVideo").hide();
                                    $("#setAuthSetting").hide();
                                    if (currentStatus == "1"){
                                        $("#approval").show();
                                    }else {
                                        $("#approval").hide();
                                    }
                                }else {
                                    $("#editVideo").hide();
                                    $("#setAuthSetting").hide();
                                    $("#approval").hide();
                                }
                            }else{
                                $("#editVideo").hide();
                                $("#setAuthSetting").hide();
                                $("#approval").hide();
                            }
                            if (pageType == "query"){
                                $("#editVideo").hide();
                                $("#setAuthSetting").hide();
                                $("#approval").hide();
                            }
                            attachmentsList = loadAttachments(tableId);
                            var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
                            $("#attachmentsList").append(attachmentsListSelect);
                            var htmlStr = component.getRadio(authSettingList,result.data.authSetting,"authSetting","dictCode","dictName");
                            $("#authSettingRadio").append(htmlStr);
                            form.render();
                            //显示附件
                            if (null != attachmentsList){
                                var attList = '';
                               for (var i=0;i<attachmentsList.length;i++){
                                   var attachment = attachmentsList[i];
                                   var type = 'img'
                                   var srcStr = attachment.attPath;
                                   var data = attachment.attPath;
                                   if (attachment.attFileType == 1){
                                       type = 'img';
                                   }else if (attachment.attFileType == 4){
                                       type = 'video';
                                       srcStr = "../../statics/img/分组 2.svg";
                                   }else if (attachment.attFileType == 3){
                                       type = 'audio'
                                       srcStr = "../../statics/img/分组 3.svg";
                                   }
                                   var liStr = "<li class=\"imgItem\" data-type="+type+">\n" +
                                       "                                <img src='"+srcStr+"' alt='' data='"+data+"'>\n" +
                                       "                                <p class='myfont'>"+attachment.attName+"</p>\n" +

                                       "                            </li>";
                                   attList = attList+liStr;

                               }
                                $(".imgList").append(attList);
                            }
                            main.initTable();
                            main.tabBind();
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
            });



    },
    initTable:function(){
        layui.use('form', function(){
            var form = layui.form;
            form1 =layui.form;
            //监听提交
            form.on('submit(formDemo)', function(data){

            });
        });
        //删除附件
        $('#demoList').on('click','.demo-delete',function(){
            var attId = $(this).attr("data-id");
            // delete files[index]; //删除对应的文件
            $(this).parent().parent().remove();
            deleteAttachment(attId);
            // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
        });
        commentsList = queryPostVideoComments(videoId);
        loadTable();
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

                return false
            }
        });
        //设置权限
        $("#setAuthSetting").click(function () {
            setAuthSetting(videoId);
        })
        //编辑资料
        $("#editVideo").click(function () {
            localStorage.videoId = videoId;
            localStorage.pageType = "edit";
            parent.$t.goToPage(this,"page/video/videoList.html");
        })
        //审批
        $("#approval").click(function () {
            localStorage.videoId = videoId;
            localStorage.pageType = "approval";
            parent.$t.goToPage(this,"page/video/videoShow.html");
        })

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
                }else{
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
   }
}

/**
 * 获取全部业务字典数据
 */
function getDictData() {
    var keys = ['video_save_type','video_source','video_type','permissions_settings']
    var dictDataMulti = property.getDictDataMulti(keys);
    videoSaveTypeList = dictDataMulti.video_save_type;
    videoSourceList = dictDataMulti.video_source;
    videoTypeList = dictDataMulti.video_type;
    authSettingList = dictDataMulti.permissions_settings;
    $.ajax({
        type:"get",
        async:false,
        url:property.getProjectPath()+"PostVideo/queryPostVideoTypeListTree.do",
        success:function(result) {
            if (result.code == 0) {
                videoMarkList = result.data;
            } else {
                errorMsg();
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

/**
 * 设置下拉框
 */
function setSelect() {
    var videoTypeSelect  = component.getSelectSimplePlus(videoTypeList,null,"videoType","dictCode","dictName");
    $("#videoType").append(videoTypeSelect);
    var sourceSelect  = component.getSelectSimplePlus(videoSourceList,null,"source","dictCode","dictName");
    $("#source").append(sourceSelect);
    var saveTypeSelect  = component.getSelectSimplePlus(videoSaveTypeList,null,"saveType","dictCode","dictName");
    $("#saveType").append(saveTypeSelect);

    var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
    $("#attachmentsList").append(attachmentsListSelect);


    var videoMarkSelect  = component.getSelectSimplePlus(videoMarkList,null,"videoMark","id","name");
    $("#videoMark").append(videoMarkSelect);

}

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
            url:property.getProjectPath()+"PostVideo/queryPostVideoDtoById.do",
            success:function(result) {
                if (result.success == 1) {
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
    property.setForm($("#videoForm"),data);
    var relativeCollection = eval(data.relativeCollection);
    var culName = [];
    if (null != relativeCollection) {
        for (var i = 0; i < relativeCollection.length; i++) {
            culName.push(relativeCollection[i].culName);
        }
        $("#relativeCollection").val(culName.join("，"));
    } else {
        $('#relativeCollection').val("");
    }
    $("#makeTime").val(formatSimpleDate(data.makeTime))
    $("#videoType").val(data.videoType);
    $("#videoType").attr("disabled","disabled");
    $("#saveType").val(data.saveType);
    $("#saveType").attr("disabled","disabled");
    $("#source").val(data.source);
    $("#source").attr("disabled","disabled");
    $("#videoMark").val(data.videoMark);
    $("#videoMark").attr("disabled","disabled");
    tableId = data.attachment;
    checkStatus(data.status,data.authSetting);
}
//检测状态
function checkStatus(status,authSetting) {
   status =  property.getTextByValuePlus(statusDictList,status,"dictCode","dictName");
   status = status+"（"+property.getTextByValue(authSettingList,authSetting)+"）";
   $("#currentStatus").text(status);
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

function queryPostVideoComments(postVideoId) {
    var datas = null;
    var json = {"postVideoId":postVideoId};
    $.ajax({
        type:"post",
        data:json,
        async:false,
        url:property.getProjectPath()+"PostVideoComments/queryPostVideoComments.do",
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

function loadTable() {
    layui.use('table', function(){
        var table = layui.table;

        table.render({
            elem: '#comments'
            ,data:commentsList
            ,cols: [[
                {type:'numbers',title:'序号'}
                ,{field:'commentName', title:'资料名称'}
                ,{field:'commentType', title:'资料类型',templet: function(res){
                    if (res.commentType == 1){
                        return '图片';
                    }else if (res.commentType == 4){
                        return '视频'
                    }else if (res.commentType == 3){
                        return '音频'
                    }else
                    {
                        return res.commentType;
                    }
                }}
                ,{field:'comments', title:'资料标注'}
            ]]
        });

        table.render({
            elem: '#approvalInfo'
            ,url:property.getProjectPath()+'PostVideo/getUploadVideoInfo.do?id='+videoId
            ,cols: [[
                {type:'numbers',title:'序号'}
                ,{field:'actionTime', title:'时间',templet: function(res){
                    return formatDate(res.actionTime);
                }}
                ,{field:'actionName', title:'操作'}
                ,{field:'apply', title:'操作人',templet: function(res){
                    return property.getTextByValuePlus(userList,res.apply,"id",'name');
                }}
                ,{field:'applyOrg', title:'所属部门',templet: function(res){
                    return property.getTextByValuePlus(orgList,res.applyOrg,"departmentId",'departmentName');
                }}
                ,{field:'actionResult', title:'资料状态',templet: function(res){
                    return property.getTextByValuePlus(statusDictList,res.actionResult,"dictCode",'dictName');
                }}
                ,{field:'remark', title:'备注'}
            ]]
        });

        //头工具栏事件
        table.on('toolbar(comments)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'getCheckData':
                    var data = checkStatus.data;
                    layer.alert(JSON.stringify(data));
                    break;
                case 'getCheckLength':
                    var data = checkStatus.data;
                    layer.msg('选中了：'+ data.length + ' 个');
                    break;
                case 'isAll':
                    layer.msg(checkStatus.isAll ? '全选': '未全选');
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(comments)', function(obj){
            var data = obj.data;
            if(obj.event === 'del'){
                var index = top.layer.confirm('真的删除行么', function(index){
                    commentsList.splice(commentsList.indexOf(data),1);
                    loadTable();
                    top.layer.close(index);
                });
            } else if(obj.event === 'edit'){
                layer.prompt({
                    formType: 2
                    ,value: data.email
                }, function(value, index){
                    obj.update({
                        email: value
                    });
                    layer.close(index);
                });
            }
        });
    });
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
                var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
                $("#attachmentsList").append(attachmentsListSelect);
                form1.render('select');
            } else if (result.success == 0){
                errorMsg(result.data);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function setAuthSetting(id){
    layui.use('form', function() {
        var form1 = layui.form;
        top.layer.confirm('', {
            title: "设置确认",
            area: ['450px', '218px'],
            skin: 'demo-class',
            success: function (layero, index) {
                form1.render();
            },
            content: "<form class='layui-form' id='batchSetForm'>"
                + "<div class='layui-form-item'>"
                + "<div class='layui-input-block' style='margin-left: 0px' id='batchSetting'>"
                + "<input type='radio' name='setting' value='1' title='不公开' checked>"
                + "<input type='radio' name='setting' value='2' title='公开可查询'>"
                + "<input type='radio' name='setting' value='3' title='公开可下载'>"
                + "</div>"
                + "</div>"
                + "</form>", btn: ['取消', '确认']
        }, function (index, layero) {
            layer.close(index);
        }, function (index) {
            var authSetting = $('#batchSetting input[name="setting"]:checked ').val()
            var data = {id: id, authSetting: authSetting};
            $.ajax({
                url: property.getProjectPath() + 'PostVideo/setAuthSetting.do',
                type: 'post',
                data: data,
                success: function (result) {
                    if (result.success == "1") {
                        successMsg("权限设置成功！");
                    } else if (result.success == 0){
                        var resultMsg = result.error.message;
                        errorMsg(resultMsg);
                    }
                    layer.close(index);
                }
            })
        });
    });
}




