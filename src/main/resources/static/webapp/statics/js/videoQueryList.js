var videoMarkList = null;
var statusDictList = null;
var authSettingDictList = null;
var sourceDictList = null;
var saveTypeDictList = null;
var orgList = null;
var userType = "0";
var form1;
var main={
    init:function () {
        getDictData();
        setSelect();
        property.setUserInfo();
        if (checkOrg(userInfo.userId)){
            userType = '1';
        }
        this.initTable();
        this.tabBind();
    },
    initTable:function(){
        var _this=this;
        loadTable();
    },
    tabBind:function () {
        layui.use(['form'], function () {
            var form = layui.form;
            form1 = form;
            //监听查询
            form.on('submit(formDemo)', function(data){
                loadTable();
                return false;
            });

            //监听收起
            form.on('submit(moreSearch)', function (data) {
                if($(this).children().hasClass("fa-chevron-down")){
                    //显示更多条件
                    $(this).parents(".layui-form").find(".more-search").show();
                    //修改更多按钮图标
                    $(this).html('<i class="fa fa-chevron-up">&nbsp;</i>收起筛选');
                }else{
                    //显示更多条件
                    $(this).parents(".layui-form").find(".more-search").hide();
                    //修改更多按钮图标
                    $(this).html('<i class="fa fa-chevron-down">&nbsp;</i>展开筛选');
                }
                return false;
            });

            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("input").val("");
                $(this).prev().click();
            });
        });

        $('#btnAdd').click(function() {
            localStorage.pageType = "add";
            parent.$t.goToPage(this, "page/video/videoList.html");
        });

        $('#download').click(function () {
            var id = $(this).attr("data-id");
        })

        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });

        $('#keywords').keypress(function(e){
            if(e.keyCode==13){
                loadTable();
            }
        });

        $('#videoMark').keypress(function(e){
            if(e.keyCode==13){
                loadTable();
            }
        });

        $('#status').keypress(function(e){
            if(e.keyCode==13){
                loadTable();
            }
        });
    }
}
main.init();

/**
 * 加载表格数据
 */
function loadTable() {
    layui.use('table', function(){
        var table = layui.table;
        var keywords = $("#keywords").val();
        var videoMark = $("#videoMark").val();
        var status = $("#status").val();
        var currentId = localStorage.functinId;
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"PostVideo/queryPostVideoQueryList.do?keywords="+keywords+"&videoMark="+videoMark+"&status="+status
            +"&currentUserId="+userInfo.userId+"&uploadOrg="+userInfo.orgId+'&userType='+userType+'&module='+currentId
            ,toolbar: '#toolbarDemo'
            ,title: '影视资料数据表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'saveType', title:'类型',templet: function(res){
                    if (res.saveType == 'T'){
                        return '<i class="layui-icon">&#xe64a;</i> ';
                    }else if (res.saveType == 'S'){
                        return '<i class="layui-icon">&#xe6ed;</i>';
                    }else if (res.saveType == 'Y'){
                        return '<i class="layui-icon">&#xe6fc;</i>';
                    }
                }}
                ,{field:'videoCode', title:'编号', sort: true}
                ,{field:'videoName', title:'资料名称'}
                ,{field:'videoMark', title:'资料分类',templet: function(res){
                    // return res.videoMark;
                    if (null == res.videoMark || '' == res.videoMark) {
                        return ''
                    } else {
                        var videoMark = property.getTextByValuePlus(videoMarkList,res.videoMark,"id","name");
                        return videoMark;
                    }
                }}
                ,{field:'keywords', title:'关键词'}
                ,{field:'relativeObject', title:'关联主题'}
                ,{field:'relativeCollection', title:'关联藏品', templet: function (res) {
                        var cul = eval(res.relativeCollection);
                        var name = [];
                        if (null != cul) {
                            for (var i = 0; i < cul.length; i++) {
                                name.push(cul[i].culName);
                            }
                        }
                        return name.join("，");
                    }}
                ,{field:'source', title:'来源',templet: function(res){
                    return property.getTextByValuePlus(sourceDictList,res.source,"dictCode","dictName");
                }}
                ,{field:'uploadOrg', title:'上传部门',templet: function(res){
                    return property.getTextByValuePlus(orgList,res.uploadOrg,"departmentId","departmentName");
                }}
                ,{field:'status', title:'资料状态',templet: function(res){
                    return property.getTextByValuePlus(statusDictList,res.status,"dictCode","dictName");
                }}
                ,{field:'authSetting', title:'下载设置',templet: function(res){
                    return property.getTextByValuePlus(authSettingDictList,res.authSetting,"dictCode","dictName");
                }}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });
        //头工具栏事件
        table.on('toolbar(test)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'batchApply':
                    //选中的值
                    var data = checkStatus.data;
                    if (data.length<=0){
                        alertMsg("未选中有效项！");
                    }else
                    {
                        var newData = new Array();
                        var count = 0;
                        for (var i=0;i<data.length;i++){
                            if (data[i].authSetting == "3"){
                                count = count+1;
                            }else {
                                newData.push(data[i]);
                            }
                        }
                        if (count>0){
                            alertMsg("已自动剔除无效选项！");
                        }
                        if (newData.length>0){
                            localStorage.videoData = JSON.stringify(newData);
                            parent.$t.goToPage(this,"page/video/videoQueryList.html");
                        } else {
                            alertMsg("所选项无可申请项！");
                        }

                    }
                    break;
                case 'batchDownload':
                    var data = checkStatus.data;
                    if (data.length<=0){
                        alertMsg("未选中有效项！");
                    }else
                    {
                        var postVideoId = '';
                        var count = 0;
                        var sum = 0;
                        for (var i=0;i<data.length;i++){
                            if (data[i].other3 != "0"){
                                count = count+1;
                            }else{
                                sum = sum + 1;
                                if (i==0){
                                    postVideoId = postVideoId+data[i].id;
                                }else {
                                    postVideoId = postVideoId+','+data[i].id;
                                }
                            }

                        }
                        if (count>0){
                            alertMsg("已自动剔除无效选项！");
                        }
                        if (sum == 0){
                            alertMsg("所选项无可下载选项！");
                        } else {
                            window.location.href = property.getProjectPath()+'PostVideo/batchDownloadVideoFile.do?postVideoId='+postVideoId;
                        }
                    }
            };
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'del'){
                var index = layer.confirm('真的删除行么', function(index){
                    // obj.del();
                   deletePostVideo(data.id);
                    layer.close(index);
                    loadTable();
                });
            } else if(obj.event === 'apply'){
                localStorage.videoId = data.id;
                localStorage.pageType = "edit";
                parent.$t.goToPage(this,"page/video/videoQueryList.html");
            }else if(obj.event === 'detail'){
                localStorage.videoId = data.id;
                localStorage.pageType = "query";
                parent.$t.goToPage(this,"page/video/videoQueryList.html");
            }else if(obj.event === 'download'){
                window.location.href = property.getProjectPath()+'PostVideo/downloadVideoFile.do?postVideoId='+data.id;
            }
            // else if(obj.event == "commit"){
            //     var json = {"postVideoId":data.id,"apply":userInfo.userId};
            //     $.ajax({
            //         type:"post",
            //         data:json,
            //         async:false,
            //         url:property.getProjectPath()+"PostVideo/submitQueryApply.do",
            //         success:function(result) {
            //             if (result.success == 1) {
            //                 successMsg("提交成功");
            //                 loadTable();
            //             } else {
            //                 errorMsg(result.error.message);
            //             }
            //         },
            //         error:function(result) {
            //             errorMsg("系统异常");
            //         }
            //     });
            // }
            // //撤回
            // else if(obj.event == "revoke"){
            //     var json = {"postVideoId":data.id,"apply":userInfo.userId};
            //     $.ajax({
            //         type:"post",
            //         data:json,
            //         async:false,
            //         url:property.getProjectPath()+"PostVideo/revokeQueryApply.do",
            //         success:function(result) {
            //             if (result.success == 1) {
            //                 successMsg("撤回成功");
            //                 loadTable();
            //             } else {
            //                 errorMsg(result.error.message);
            //             }
            //         },
            //         error:function(result) {
            //             errorMsg("系统异常");
            //         }
            //     });
            // }
        });
    });
}

function setSelect() {
    // var videoTypeSelect  = component.getSelectPlus(videoTypeDictList,null,"videoType","dictCode","dictName");
    // $("#videoType").html(videoTypeSelect);
    var statusSelect  = component.getSelectSimplePlus(statusDictList,null,"status","dictCode","dictName");
    $("#status").append(statusSelect);
    var videoMarkSelect  = component.getSelectSimplePlus(videoMarkList,null,"videoMark","id","name");
    $("#videoMark").append(videoMarkSelect);
}

function getDictData() {
    var keys = ['video_type','video_status','permissions_settings','video_source','video_save_type']
    var dictDataMulti = property.getDictDataMulti(keys);
    statusDictList = dictDataMulti.video_status;
    videoSourceList = dictDataMulti.video_source;
    videoTypeList = dictDataMulti.video_type;
    authSettingDictList = dictDataMulti.permissions_settings;
    sourceDictList = dictDataMulti.video_source;
    saveTypeDictList = dictDataMulti.video_save_type;
    orgList = property.getAllOrgList();
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






