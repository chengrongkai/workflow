var videoSaveTypeList = null;
var videoSourceList = null;
var videoTypeList = null;
var authSettingList = null;
var tableId = '';
var attachmentsList = null;
var commentsList = new Array();
var videoMarkList = null;
var flag = "0";
var form1;
var userId;
var attCount = 0;
//页面属性
var pageType = "add";
var projectName = property.getProjectPath();
var collectArray = [];
var choseCollect = [];
var main={

    init:function () {
        //设置用户信息
        property.setUserInfo();
        if (null != localStorage.pageType){
            pageType = localStorage.pageType;
            localStorage.removeItem('pageType');
        }
        videoId = localStorage.videoId;
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
                ,max:getNowFormatDate()
            });
        });
        if (null != localStorage.userInfo){
            var userInfo = JSON.parse(localStorage.userInfo);
            userId = userInfo.userId;
            //设置上传部门
            $("#uploadOrg").val(userInfo.orgId);
            //设置上传人
            $("#other1").val(userInfo.userId);
            var orgId = userInfo.orgId;
            //设置标题
            if(checkOrg(userInfo.userId)){
                $("#pageTitle").text("上传资料-影视部");
            }else
            {
                $("#pageTitle").text("上传资料-非影视部");
            }
            if (checkOrg(userInfo.userId)){
                flag = "1";
                $("#approvalLi").hide();
                $("#authSettingLi").show();
                $("#saveAndSubmit").hide();
                $("#saveAndPublish").show();
            }else{
                $("#approvalLi").show();
                $("#authSettingLi").hide();
                $("#saveAndSubmit").show();
                $("#saveAndPublish").hide();
                var approvalList = property.getApprovalList("videoManager");
                var approvalSelect = component.getSelectSimplePlus(approvalList,null,"approval","id","name");
                $("#approval").append(approvalSelect);
            }
        }else
        {
            alert("用户未登陆，请先登录!");
            window.location.href='/admin/login.html';
        }
        if (pageType == "add"){
            var ls = property.getLs("videoList","video");
            $("#videoCode").val(ls);
            $("#videoCode").attr("readonly",true);
            //设置文件批号
            tableId = property.getTimeJson();
            $("#attachment").val(tableId);
            attachmentsList = loadAttachments(tableId);
            var htmlStr = component.getRadio(authSettingList,"1","authSetting","dictCode","dictName");
            $("#authSettingRadio").append(htmlStr);
            this.initTable();
            this.tabBind();
        }else
        {
            $("#saveAndSubmit").hide();
            $("#saveAndPublish").hide();
            localStorage.removeItem('videoId');
            // loadData(id);
            layui.use('form', function(){
                var form = layui.form;
                var index = parent.layer.getFrameIndex(window.name);
                var json = {"id":videoId};
                //加载数据
                $.ajax({
                    type:"get",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+"PostVideo/queryPostVideoDtoById.do",
                    success:function(result) {
                        if (result.success == 1) {
                            setFormData(result.data);
                            attachmentsList = loadAttachments(tableId);
                            var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
                            $("#attachmentsList").append(attachmentsListSelect);
                            var htmlStr = component.getRadio(authSettingList,result.data.authSetting,"authSetting","dictCode","dictName");
                            $("#authSettingRadio").append(htmlStr);
                            form.render();
                            if (null != attachmentsList){
                                attCount = attachmentsList.length;
                                $("#demoList").append(component.getAttachmentList(attachmentsList));
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

        }



    },
    initTable:function(){
        layui.config({
            base: '../../common/js/formSelects-v4.js' //此处路径请自行处理, 可以使用绝对路径
        }).extend({
            formSelects: 'formSelects-v4'
        });

        // $('#searchCollect').click(function () {
        //     var formSelects = layui.formSelects;
        //     formSelects.config('select1', {
        //         keyName: 'culName',            //自定义返回数据中name的key, 默认 name
        //         keyVal: 'culId',            //自定义返回数据中value的key, 默认 value
        //         success: function(id, url, searchVal, result){      //使用远程方式的success回调
        //             collectArray = result.data;
        //         },
        //     }, true);
        //     var culName = $($($('.xm-select-label')[0]).children()[0]).val();
        //     formSelects.data('select1', 'server', {
        //         url:property.getProjectPath()+"interfaceCollect/getCollectByTypeAndName.do?culCategory="+$('#culCategory').val()
        //     });
        // });



        layui.use('form', function(){
            var form = layui.form;
            form1 =layui.form;

            $.get(projectName + 'interfaceCollect/getCollctTypeList.do', function (res) {
                if (res.success == 1) {
                    var data = res.data;
                    for (var i = 0, length = data.length; i < length; i++) {
                        var option = $('<option value="'+ data[i].typeCode +'">'+ data[i].typename +'</option>');
                        $('#culCategory').append(option);
                    }
                    form.render("select");
                } else {
                    layer.msg(res.message, {icon:5, })
                }
            });
            var formSelects = layui.formSelects;
            formSelects.config('select1', {
                keyName: 'culName',            //自定义返回数据中name的key, 默认 name
                keyVal: 'culId',            //自定义返回数据中value的key, 默认 value
                success: function(id, url, searchVal, result){      //使用远程方式的success回调
                    collectArray = result.data;
                },
            }, true);
            var culName = $($($('.xm-select-label')[0]).children()[0]).val();
            formSelects.data('select1', 'server', {
                url:property.getProjectPath()+"interfaceCollect/getCollectByTypeAndName.do"
            });

            form.on('select(culCategory)', function(data){
                var formSelects = layui.formSelects;
                formSelects.config('select1', {
                    keyName: 'culName',            //自定义返回数据中name的key, 默认 name
                    keyVal: 'culId',            //自定义返回数据中value的key, 默认 value
                    success: function(id, url, searchVal, result){      //使用远程方式的success回调
                        collectArray = result.data;
                    },
                }, true);
                var culName = $($($('.xm-select-label')[0]).children()[0]).val();
                formSelects.data('select1', 'server', {
                    url:property.getProjectPath()+"interfaceCollect/getCollectByTypeAndName.do?culCategory="+data.value
                });
            });

            //添加藏品
            $("#addCollect").click(function(){
                var formSelects = layui.formSelects;
                var ids = formSelects.value('select1', 'val');
                var hasAddName = [];
                for (var i = 0, length = ids.length; i < length; i++) {
                    var id = ids[i];
                    var flg = false;
                    for (var j = 0, size = choseCollect.length; j < size; j++) {
                        var collect = choseCollect[j];
                        if (id == collect.culId) {
                            hasAddName.push(collect.culName);
                            flg = true;
                            break;
                        }
                    }
                    if (flg) {
                        continue;
                    }
                    for (var j = 0, size = collectArray.length; j < size; j++) {
                        var collect = collectArray[j];
                        if (id == collect.culId) {
                            choseCollect.push(collect);
                            $('#choseCollectList').append($('<div style="width: auto" class="layui-btn layui-btn-sm" id="'+collect.culId+'">'+collect.culName+'&nbsp;<i class="layui-icon" onclick="deleteCollect(\''+collect.culId+'\')">&#x1006;</i></div>'));
                            break;
                        }
                    }
                }
            });

            //监听提交
            form.on('submit(save)', function(data){
                var postVideo = property.getFormJson("#videoForm");
                var culId = [];
                for (var i = 0; i < choseCollect.length; i++) {
                    culId.push({
                        culId: choseCollect[i].culId,
                        culName: choseCollect[i].culName
                    })
                }
                postVideo.relativeCollection = JSON.stringify(culId);
                var url = "PostVideo/addPostVideo.do";
                var actionType = "1";
                if (pageType == "edit"){
                    url = "PostVideo/updatePostVideo.do";
                }else {
                    if (attCount <= 0){
                        errorMsg("请上传附件");
                        return false;
                    }
                }
                var json = {"postVideo":postVideo,"postVideoComments":commentsList,"actionType":actionType,"currentUserId":userId};
                $.ajax({
                    url:property.getProjectPath()+url,
                    data:JSON.stringify(json),
                    contentType:"application/json",
                    type:'post',
                    async:false,
                    success:function(result) {
                        if (result.success == 1) {
                            successMsg("保存成功");
                            parent.$t.goback("page/video/videoList.html");
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
                return false;
            });

            form.on('submit(saveAndSubmit)', function(data){
                var postVideo = property.getFormJson("#videoForm");
                var culId = [];
                for (var i = 0; i < choseCollect.length; i++) {
                    culId.push({
                        culId: choseCollect[i].culId,
                        culName: choseCollect[i].culName
                    })
                }
                postVideo.relativeCollection = JSON.stringify(culId);
                var url = "PostVideo/addPostVideo.do";
                var actionType = "2";
                if (attCount <= 0){
                    errorMsg("请上传附件");
                    return;
                }
                var json = {"postVideo":postVideo,"postVideoComments":commentsList,"actionType":actionType,"currentUserId":userInfo.userId};
                $.ajax({
                    url:property.getProjectPath()+url,
                    data:JSON.stringify(json),
                    contentType:"application/json",
                    type:'post',
                    async:false,
                    success:function(result) {
                        if (result.success == 1) {
                            successMsg("保存成功");
                            parent.$t.goback("page/video/videoList.html");
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
                return false;
            });

            form.on('submit(saveAndPublish)', function(data){
                var postVideo = property.getFormJson("#videoForm");
                var culId = [];
                for (var i = 0; i < choseCollect.length; i++) {
                    culId.push({
                        culId: choseCollect[i].culId,
                        culName: choseCollect[i].culName
                    })
                }
                postVideo.relativeCollection = JSON.stringify(culId);
                var url = "PostVideo/addPostVideo.do";
                var actionType = "3";
                if (attCount <= 0){
                    errorMsg("请上传附件");
                    return false;
                }
                var json = {"postVideo":postVideo,"postVideoComments":commentsList,"actionType":actionType,"currentUserId":userInfo.userId};
                $.ajax({
                    url:property.getProjectPath()+url,
                    data:JSON.stringify(json),
                    contentType:"application/json",
                    type:'post',
                    async:false,
                    success:function(result) {
                        if (result.success == 1) {
                            successMsg("发布成功");
                            parent.$t.goback("page/video/videoList.html");
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
                return false;
            });
        });
        layui.use(['upload','element'], function(){
            var $ = layui.jquery
                ,upload = layui.upload,element = layui.element;
            var demoListView = $('#demoList')
                ,uploadListIns = upload.render({
                elem: '#test10'
                ,url: property.getProjectPath()+"attach/upload.do?tableName="+"post_video"+"&tableId="+tableId
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
                       /* var tr = $(['<tr id="upload-'+ index +'">'
                            ,'<td>'+ file.name +'</td>'
                            ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                            ,'<td>等待上传</td>'
                            ,'<td>'
                            ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                            ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                            ,'</td>'
                            ,'</tr>'].join(''));*/
                         var tr=$(["<li>" +
                         "                                    <div class='upLeft' id='upload-"+index+"'>" +
                         "                                        <span class=\"fileName\">"+file.name+"</span>" +
                         "                                        <span class=\"fileState\">准备上传</span>" +
                         "                                    </div>" +
                         "                                    <div class=\"upRight\">" +
                         "                                        <div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"+index+"'>" +
                         "                                            <div class=\"layui-progress-bar layui-progress-big layui-bg-blue\" lay-percent=\"30%\">" +
                         '<span class="layui-progress-text">'+'0%'+'</span>'+'</div>' +
                         "                                        </div>" +
                         "                                        <a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 layui-hide demo-reload\">重传</a>" +
                         "                                        <a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 demo-cancel\">取消</a>" +
                         "                                    </div>" +
                         "                                </li>"].join(''));
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

                        tr.siblings(".upRight").find(".layui-bg-blue").addClass("layui-bg-green");
                        tr.siblings(".upRight").find(".layui-bg-green").removeClass("layui-bg-blue");
                        //重新设置下拉框
                        attachmentsList = loadAttachments(tableId);
                        var attachmentsList1 = attachmentsList;
                        for(var i=0;i<attachmentsList1.length;i++){
                            for(var j=0;j<commentsList.length;j++){
                                if (commentsList[j].attachment == attachmentsList1[i].attId){
                                    attachmentsList1.splice(i,1);
                                    break;
                                }
                            }
                        }
                        var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList1,null,"attachmentList","attId","attName");
                        $("#attachmentsList").empty();
                        $("#attachmentsList").append(attachmentsListSelect);
                        form1.render('select');
                        // var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
                        // $("#attachmentsList").empty();
                        // $("#attachmentsList").append(attachmentsListSelect);
                        // form1.render('select');
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
                    tr.siblings(".upRight").find(".layui-bg-blue").addClass("layui-bg-red");
                    tr.siblings(".upRight").find(".layui-bg-red").removeClass("layui-bg-blue");
                }
            });

        });
        //删除附件
        $('#demoList').on('click','.demo-delete',function(){
            var attId = $(this).attr("data-id");
            // delete files[index]; //删除对应的文件
            $(this).parent().parent().remove();
            deleteAttachment(attId);
            attachmentsList = loadAttachments(tableId);
            var attachmentsList1 = attachmentsList;
            for(var i=0;i<attachmentsList1.length;i++){
                for(var j=0;j<commentsList.length;j++){
                    if (commentsList[j].attachment == attachmentsList1[i].attId){
                        attachmentsList1.splice(i,1);
                        break;
                    }
                }
            }
            var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList1,null,"attachmentList","attId","attName");
            $("#attachmentsList").empty();
            $("#attachmentsList").append(attachmentsListSelect);
            form1.render('select');
            // var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
            // $("#attachmentsList").empty();
            // $("#attachmentsList").append(attachmentsListSelect);
            // form1.render('select');
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
        if (pageType == "edit"){
            commentsList = queryPostVideoComments(localStorage.videoId);
            loadTable();
        }
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

        $("#addCooments").click(function () {
            var attId = $("#attachmentsList").val();
            layui.use('form', function(){
                var json = {"attId":attId};
                $.ajax({
                    type:"get",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+"attach/getAttachmentsById.do",
                    success:function(result) {
                        if (result.success == 1) {
                            var commentName = result.data.attName;
                            var commentType = result.data.attFileType;
                            var comments = $("#comment").val();
                            var json = {"attachment":attId,"commentName":commentName,"commentType":commentType,"comments":comments};
                            commentsList.push(json);
                            attachmentsList = loadAttachments(tableId);
                            var attachmentsList1 = attachmentsList;
                            for(var i=0;i<attachmentsList1.length;i++){
                                if(attachmentsList1[i].attId == attId){
                                    attachmentsList1.splice(i,1);
                                    break;
                                }
                            }
                            var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList1,null,"attachmentList","attId","attName");
                            $("#attachmentsList").empty();
                            $("#attachmentsList").append(attachmentsListSelect);
                            form1.render('select');
                            loadTable();
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
            });
        });

        $("#cancel").click(function () {
            parent.$(".myRefresh").click();
            return false;
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
    var collects = eval(data.relativeCollection);
    for (var i = 0; i < collects.length; i++) {
        var collect = collects[i];
        choseCollect.push(collect);
        $('#choseCollectList').append($('<div style="width: auto" class="layui-btn layui-btn-sm" id="'+collect.culId+'">'+collect.culName+'&nbsp;<i class="layui-icon" onclick="deleteCollect(\''+collect.culId+'\')">&#x1006;</i></div>'));
    }
    $("#makeTime").val(formatSimpleDate(data.makeTime))
    $("#videoType").val(data.videoType);
    $("#saveType").val(data.saveType);
    $("#source").val(data.source);
    $("#videoMark").val(data.videoMark);
    tableId = data.attachment;
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
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo'}
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
                for (var i=0;i<commentsList.length;i++){
                    if (commentsList[i].attachment == data.attachment){
                        commentsList.splice(i,1);
                        break;
                    }
                }
                attachmentsList = loadAttachments(tableId);
                var attachmentsList1 = attachmentsList;
                for(var i=0;i<attachmentsList1.length;i++){
                   for(var j=0;j<commentsList.length;j++){
                       if (commentsList[j].attachment == attachmentsList1[i].attId){
                           attachmentsList1.splice(i,1);
                           break;
                       }
                   }
                }
                var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList1,null,"attachmentList","attId","attName");
                $("#attachmentsList").empty();
                $("#attachmentsList").append(attachmentsListSelect);
                form1.render('select');
                // commentsList.splice(commentsList.indexOf(data),1);
                loadTable();
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

function deleteCollect(id) {
    for (var i = 0, length = choseCollect.length; i < length; i++) {
        var culId = choseCollect[i].culId;
        if (id == culId) {
            choseCollect.splice(i,1);
            $('#'+id).remove();
            break;
        }
    }
}
