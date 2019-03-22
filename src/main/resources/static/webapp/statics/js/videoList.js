var videoTypeDictList = null;
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
        property.setButtonAuth();
        if (checkMyOrg()){
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
            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("input").val("");
                $(this).prev().click();
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
        });

        $('#btnAdd').click(function() {
            localStorage.pageType = "add";
            parent.$t.goToPage(this, "page/video/videoList.html");
        });

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
            ,url:property.getProjectPath()+"PostVideo/queryPostVideoList.do?keywords="+keywords+"&videoMark="+videoMark+"&status="+status
            +"&userId="+userInfo.userId+"&uploadOrg="+userInfo.orgId+'&userType='+userType+'&module='+currentId
            // ,toolbar: '#toolbarDemo'
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
                ,{field:'videoCode', title:'编号'}
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
                ,{field:'relativeObject', title:'关联主体'}
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
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo',width:300}
            ]]
            ,page: true
        });
        //头工具栏事件
        table.on('toolbar(test)', function(obj){
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
                case 'batchAuthSetting':
                    var data = checkStatus.data;

                    var length = data.length;
                    if (length<=0){
                        alertMsg("未选中有效项！");
                    }else {
                        var ids = new Array();
                        for (var i=0;i<length;i++){
                            ids.push(data[i].id);
                        }
                        layer.confirm('', {
                            title:"设置确认",
                            area: ['450px', '218px'],
                            skin: 'demo-class',
                            success: function(layero, index){
                                form1.render();
                            },
                            content:"<form class='layui-form' id='batchSetForm'>"
                            + "<div class='layui-form-item'>"
                            + "<div><span>当前已选择"
                            + length
                            + "项有效数据，确认设置吗？</span></div>"
                            + "<div class='layui-input-block' style='margin-left: 0px' id='batchSetting'>"
                            + "<input type='radio' name='setting' value='1' title='不公开' checked>"
                            + "<input type='radio' name='setting' value='2' title='公开可查询'>"
                            + "<input type='radio' name='setting' value='3' title='公开可下载'>"
                            + "</div>"
                            + "</div>"
                            + "</form>",
                            btn: ['取消', '确认']
                        }, function(index, layero){
                            layer.close(index);
                        }, function(index){
                            var authSetting = $('#batchSetting input[name="setting"]:checked ').val()
                            var data = {"ids":ids,"map":authSetting};
                            $.ajax({
                                url:property.getProjectPath() + 'PostVideo/batchSetAuthSetting.do',
                                type:'post',
                                contentType:"application/json",
                                data:JSON.stringify(data),
                                success:function(result) {
                                    if (result.success == "1") {
                                        successMsg("批量权限设置成功！");
                                    } else if (result.success == 0){
                                        var resultMsg = result.error.message;
                                        errorMsg(resultMsg);
                                    }
                                    loadTable();
                                    layer.close(index);
                                }
                            })
                        });
                        return false;
                    }
                    batchAuthSetting();
            };
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'del'){
                var index = layer.confirm('确定删除?', function(index){
                    // obj.del();
                   deletePostVideo(data.id);
                    layer.close(index);
                    loadTable();
                });
            } else if(obj.event === 'edit'){
                localStorage.videoId = data.id;
                localStorage.pageType = "edit";
                parent.$t.goToPage(this,"page/video/videoList.html");
            }else if(obj.event === 'detail'){
                localStorage.videoId = data.id;
                localStorage.pageType = "detail";
                parent.$t.goToPage(this,"page/video/videoList.html");
            }
            //审批
            else if(obj.event === 'approval'){
                localStorage.videoId = data.id;
                localStorage.pageType = "approval";
                parent.$t.goToPage(this,"page/video/videoList.html");
            }
            //权限设置
            else if (obj.event == "authSetting") {
                setAuthSetting(data.id);
            }
            //提交
            else if(obj.event == "commit"){
                var json = {"id":data.id,"currentUserId":userInfo.userId};
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+"PostVideo/commitProcess.do",
                    success:function(result) {
                        if (result.success == 1) {
                            successMsg("提交成功");
                            loadTable();
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
            }

            else if(obj.event == "publish"){
                var json = {"id":data.id,"currentUserId":userInfo.userId};
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+"PostVideo/publishProcess.do",
                    success:function(result) {
                        if (result.success == 1) {
                            successMsg("发布成功");
                            loadTable();
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
            }
            //撤回
            else if(obj.event == "revoke"){
                var json = {"id":data.id,"currentUserId":userInfo.userId};
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+"PostVideo/revokeProcess.do",
                    success:function(result) {
                        if (result.success == 1) {
                            successMsg("撤回成功");
                            loadTable();
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
            }
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
//删除
function deletePostVideo(id) {
    var json = {"id":id};
    $.ajax({
        type:"post",
        data:json,
        async:false,
        url:property.getProjectPath()+"PostVideo/deletePostVideo.do",
        success:function(result) {
            if (result.success == 1) {
                successMsg("删除成功");
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function setAuthSetting(id){
        layer.confirm('', {
            title:"设置确认",
            area: ['450px', '218px'],
            skin: 'demo-class',
            success: function(layero, index){
                console.log($('.demo-class').length);
                form1.render();
            },
            content:"<form class='layui-form' id='batchSetForm'>"
            + "<div class='layui-form-item'>"
            + "<div class='layui-input-block' style='margin-left: 0px' id='batchSetting'>"
            + "<input type='radio' name='setting' value='1' title='不公开' checked>"
            + "<input type='radio' name='setting' value='2' title='公开可查询'>"
            + "<input type='radio' name='setting' value='3' title='公开可下载'>"
            + "</div>"
            + "</div>"
            + "</form>",            btn: ['取消', '确认']
        }, function(index, layero){
            layer.close(index);
        }, function(index){
            var authSetting = $('#batchSetting input[name="setting"]:checked ').val()
            var data = {id:id,authSetting:authSetting};
            $.ajax({
                url:property.getProjectPath() + 'PostVideo/setAuthSetting.do',
                type:'post',
                data:data,
                success:function(result) {
                    if (result.success == "1") {
                        successMsg("权限设置成功！");
                        loadTable();
                    } else if (result.success == 0){
                        var resultMsg = result.error.message;
                        errorMsg(resultMsg);
                    }
                    loadTable();
                    layer.close(index);
                }
            })
        });
        return false;
}

function checkMyOrg() {
    return checkOrg(userInfo.userId);
}




