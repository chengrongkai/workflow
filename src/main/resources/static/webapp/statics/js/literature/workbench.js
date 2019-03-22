var Tcount = 0;
var Scount = 0;
var Ycount = 0;
var openVideoCount = 0;
var applyCount = 0;
var approvalCount = 0;
var pageStatus = 1;
//待办
var undoTask;
//已办
var doneTask;
//已完结
var finishTask;

//未读通知
var unReadNotice;

//快捷入口列表
var shortcutEntranceList = new Array();
var main={
    option:{
        useEasing : true,
        useGrouping : true,
        separator : ',',
        decimal : '.',
        prefix : '',
        suffix : ''
    },
    init:function () {
        loadCount();
        this.countUp();
        if (null != localStorage.userInfo){
            userInfo = JSON.parse(localStorage.userInfo);
        }
        loadTask();
        loacTaskList();
        loadNotice();
        getShortcutEntrance();

        this.tabBind();
    },
    countUp:function () {
        var demo = new CountUp("pic", 0, Tcount, 0, 2.5, this.options);
        var demo1 = new CountUp("video", 0, Scount, 0, 2.5, this.options);
        var demo2 = new CountUp("audio", 0, Ycount, 0, 2.5, this.options);
        var demo3 = new CountUp("datum", 0, openVideoCount, 0, 2.5, this.options);
        var demo4 = new CountUp("apply", 0, applyCount, 0, 2.5, this.options);
        var demo5 = new CountUp("downLoad", 0, approvalCount, 0, 2.5, this.options);

        setTimeout(function () {
            demo.start();
            demo1.start();
            demo2.start();
            demo3.start();
            demo4.start();
            demo5.start();
        },500)
    },
    tabBind:function () {
        $(".layui-tab-pic li").click(function () {
            var index=$(this).index();
            $(".layui-tab-pic li").eq(index).addClass("active").siblings().removeClass('active');
            $(".layui-tab-item").eq(index).addClass("layui-show").siblings().removeClass('layui-show');
            loadTask();
            loacTaskList();
        })
    }
}
main.init();

function loadCount() {
    var module = localStorage.functinId;
    $.ajax({
        type:"get",
        async:false,
        url:property.getProjectPath()+"postLiterature/getVideoCjCount.do?module="+module,
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                Tcount = parseInt(data.Tcount);
                Scount = parseInt(data.Scount);
                Ycount = parseInt(data.Ycount);
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });

    $.ajax({
        type:"get",
        async:false,
        url:property.getProjectPath()+"postLiterature/getVideoCxCount.do?module="+module,
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                openVideoCount = parseInt(data.videoOpenCount);
                applyCount = parseInt(data.videoCxApply);
                approvalCount = parseInt(data.videoCxApproval);
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function loadTask() {
    var json = {"currentUserId":userInfo.userId};
    $.ajax({
        data:json,
        type:"post",
        async:false,
        url:property.getProjectPath()+"postLiterature/getUndoTask.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                undoTask = data;
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
    $.ajax({
        data:json,
        type:"post",
        async:false,
        url:property.getProjectPath()+"postLiterature/getDoneTask.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                doneTask = data;
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
    $.ajax({
        data:json,
        type:"post",
        async:false,
        url:property.getProjectPath()+"postLiterature/getFinishTask.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                finishTask = data;
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function loadNotice() {
    var json = {"userId":userInfo.userId,"status":0,"type":"2"};
    $.ajax({
        data:json,
        type:"post",
        async:false,
        url:property.getProjectPath()+"sys/notice/getNoticeListPlus.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                unReadNotice = data;
                var liList = '';
                for (var i=0;i<unReadNotice.length;i++){
                    var tempLi = '<li><span class="tongzhi">'+unReadNotice[i].content+'</span>'
                        + '<a href="javascript:void (0);" data-id="'+unReadNotice[i].id+'" class="tongzhiRight showNotice"><span>点击查看详情</span></a></li>';
                    liList = liList+tempLi;
                }
                $("#tongzhiList").empty();
                $("#tongzhiList").append(liList);
                $(".showNotice").click(function () {
                    var id = $(this).attr("data-id");
                    showNotice(id);
                })
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function showTask(processInstId,pageStatus) {
    var json = {"id":processInstId};
    $.ajax({
        data:json,
        type:"post",
        async:false,
        url:property.getProjectPath()+"postLiteratureProcess/getLiteratureProcessById.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;

                goPage(1,JSON.stringify(data),data.id,pageStatus);
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}
function goPage(type,data,processInstId,pageStatus) {

    sessionStorage.applyData = data;
    sessionStorage.pageStatus = pageStatus;
    //上传审批
    if (type == '1'){
        parent.$t.goToPageSimple("page/literature/literatureApplyApproval.html","查看","page/literature/workbench.html");
    }
    //查询审批
    else if(type == '2'){
        localStorage.processInstId = processInstId;
        parent.$t.goToPageSimple("page/video/videoQueryShow.html","查看","page/main/main.html");
    }else{
        errorMsg("未找到对应的任务信息!");
    }
}


function getShortcutEntrance() {
    var currentId = localStorage.currentId;
    var json = {"currentUserId":userInfo.userId,"currentId":currentId,"type":"2"};
    $.ajax({
        data:json,
        type:"post",
        async:false,
        url:property.getProjectPath()+"PostVideo/getShortcutEntrance.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                shortcutEntranceList = data;
                var liList = '';
                for (var i=0;i<shortcutEntranceList.length;i++){
                    if (shortcutEntranceList[i].checked=="0"){
                        continue;
                    }
                    var tempLi = '<li class="layui-nav-item"><a class="cy-page shortcut" href="javascript:;" data-name="'
                        +shortcutEntranceList[i].name+'" data="'+shortcutEntranceList[i].id+'" data-url="'+shortcutEntranceList[i].url+'"><img'
                        +' src="'+shortcutEntranceList[i].icon+'" alt=""><span>'+shortcutEntranceList[i].name+'</span></a></li>';
                    liList = liList+tempLi;
                }
                $("#shortcutEntrance").empty();
                $("#shortcutEntrance").append(liList);
                $(".shortcut").click(function () {
                    var dataUrl = $(this).attr("data-url");
                    var name = $(this).attr("data-name");
                    localStorage.functinId = $(this).attr("data");
                    parent.$t.goToPageSimple(dataUrl,name,"page/literature/workbench.html");
                })
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function setShortcutEntrance() {
    layui.use('form', function() {
        var form = layui.form;
        var hasSetting = new Array();
        for(var i=0;i<shortcutEntranceList.length;i++){
            if (shortcutEntranceList[i]["checked"]=="1"){
                hasSetting.push(shortcutEntranceList[i]["id"]);
            }
        }
        layer.confirm('', {
                title: "设置",
                area: ['450px', '218px'],
                skin: 'demo-class',
                success: function (layero, index) {
                    form.render();
                },
                content: "<form class='layui-form' id='batchSetForm'>"
                + "<div class='layui-form-item'>"
                + "<div class='layui-input-block' style='margin-left: 0px' id='batchSetting'>"
                + component.getCheckBoxPlus(shortcutEntranceList,hasSetting,"setting","id","name")
                + "</div>"
                + "</div>"
                + "</form>", btn: ['取消', '确认']
            }, function (index, layero) {
                layer.close(index);
            }, function (index) {
                var authSetting = new Array();
                $("input:checkbox[name='setting']:checked").each(function(i){
                    authSetting[i] = $(this).val();
                });
                var json = {"currentUserId": userInfo.userId, "shortcutEntrance": authSetting,"type":"2"};
                $.ajax({
                    data: JSON.stringify(json),
                    type: "post",
                    contentType:'application/json',
                    async: false,
                    url: property.getProjectPath() + "PostVideo/setShortcutEntrance.do",
                    success: function (result) {
                        if (result.success == 1) {
                            var data = result.data;
                            successMsg("设置成功!");
                            getShortcutEntrance();
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error: function (result) {
                        errorMsg("系统异常");
                    }
                });
            }
        );
    });
}

function showNotice(id,pageStatus) {
    var json = {"id":id};
    $.ajax({
        data:json,
        type:"post",
        async:false,
        url:property.getProjectPath()+"postLiteratureProcess/getWfActionByNotice.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                updateNotice(id);
                goPage("1",JSON.stringify(data),data.id,pageStatus);
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}
//更新为已阅
function updateNotice(id) {
    var json = {"id":id,"userId":userInfo.userId};
    $.ajax({
        data:json,
        type:"post",
        async:false,
        url:property.getProjectPath()+"sys/notice/updateNoticePlus.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function loacTaskList() {
    //加载待办
    layui.use(['element','table'], function(){
        var table = layui.table;
        var element = layui.element;
        var cols = [
            {field:'actionType', title:'类型'}
            ,{field:'actionName', title:'事项名称'}
            ,{field:'actionTime', title:'创建时间',templet: function(res){
                    return formatDate(res.actionTime);
                }}
            ,{fixed: 'right', title:'操作', width:200,templet: function(res){
                    return '</span><a href="#" data-id="'+res.processInstId+'" class="tongzhiRight showTask"><span>查看</span>';
                }}
        ]
        var noticeCols = [
            {field:'actionType', title:'类型'}
            ,{field:'actionName', title:'事项名称'}
            ,{field:'actionTime', title:'创建时间',templet: function(res){
                    return formatDate(res.actionTime);
                }}
            ,{fixed: 'right', title:'操作', width:200,templet: function(res){
                    return '</span><a href="#" data-id="'+res.processInstId+'" class="tongzhiRight showNotice"><span>查看</span>';
                }}
        ]
        table.render({
            elem: '#undoTable'
            ,data:undoTask
            ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
            ,cols: [cols]
        });
        table.render({
            elem: '#doneTable'
            ,data:doneTask
            ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
            ,cols: [cols]
        });
        table.render({
            elem: '#finishTable'
            ,data:finishTask
            ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
            ,cols: [cols]
        });
        $("#daiban").click(function() {
            pageStatus = 1;
        });
        $("#yiban").click(function() {
            pageStatus = 2;
        });
        $("#yiwanjie").click(function() {
            pageStatus = 3;
        });

        $(".showTask").click(function () {
            showTask($(this).attr("data-id"),pageStatus);
        });
        $(".showNotice").click(function () {
            showNotice($(this).attr("data-id"),pageStatus);
        });
        $("#setShortcutEntrance").click(function () {
            setShortcutEntrance();
        });
    });
}



