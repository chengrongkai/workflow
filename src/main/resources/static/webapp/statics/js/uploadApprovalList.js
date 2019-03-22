var videoTypeDictList = null;
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


        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });

        $('#keywords').keypress(function(e){
            if(e.keyCode==13){
                loadTable();
            }
        });

        $('#source').keypress(function(e){
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
        var source = $("#source").val();
        var status = $("#status").val();
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"PostVideo/getUploadApprovalList.do?keywords="+keywords+"&source="+source+"&status="+status
            +"&currentUserId="+userInfo.userId
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
                ,{field:'source', title:'来源',templet: function(res){
                    return property.getTextByValuePlus(sourceDictList,res.source,"dictCode","dictName");
                }}
                ,{field:'uploadOrg', title:'上传部门',templet: function(res){
                    return property.getTextByValuePlus(orgList,res.uploadOrg,"departmentId","departmentName");
                }}
                ,{field:'status', title:'资料状态',templet: function(res){
                    return property.getTextByValuePlus(statusDictList,res.status,"dictCode","dictName");
                }}
                ,{field:'remarks', title:'备注'}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });

        //头工具栏事件
        table.on('toolbar(test)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'batchAuthSetting':
                    //选中的值
                    var data = checkStatus.data;
                    if (data.length<=0){
                        alertMsg("未选中有效项！");
                    }else
                    {
                        localStorage.videoData = JSON.stringify(data);
                        parent.$t.goToPage(this,"page/video/uploadApprovalList.html");
                    }
            };
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){
                localStorage.videoId = data.partyId;
                localStorage.pageType = "detail";
                parent.$t.goToPage(this,"page/video/uploadApprovalList.html");
            }
            //审批
            else if(obj.event === 'approval'){
                localStorage.videoId = data.partyId;
                localStorage.pageType = "approval";
                parent.$t.goToPage(this,"page/video/uploadApprovalList.html");
            }

        });
    });
}

function setSelect() {
    var sourceSelect  = component.getSelectSimplePlus(sourceDictList,null,"source","dictCode","dictName");
    $("#source").append(sourceSelect);
    var statusSelect  = component.getSelectSimplePlus(statusDictList,null,"status","dictCode","dictName");
    $("#status").append(statusSelect);
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
}




