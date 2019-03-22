var videoTypeDictList = null;
var statusDictList = null;
var authSettingDictList = null;
var sourceDictList = null;
var saveTypeDictList = null;
var userList = null;
var orgList = null;
var applyReasonList = null;
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
        });


        //查询事件
        layui.use('form', function(){
            var form = layui.form;

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
        var applyOrg = $("#applyOrg").val();
        var applyStatus = $("#applyStatus").val();
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"PostVideo/getQueryApprovalVideoList.do?keywords="+keywords+
            "&applyOrg="+applyOrg+"&applyStatus="+applyStatus
            +"&currentUserId="+userInfo.userId
            // ,toolbar: '#toolbarDemo'
            ,title: '影视资料数据表'
            , request:{
                pageName: 'page',
                limitName: 'limit'
            }
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{field:'videoCode', title:'编号', sort: true}
                ,{field:'videoName', title:'资料名称'}
                ,{field:'apply', title:'申请人',templet: function(res){
                    return property.getTextByValuePlus(userList,res.apply,"id","name");
                }}
                ,{field:'applyOrg', title:'所属部门',templet: function(res){
                    return property.getTextByValuePlus(orgList,res.applyOrg,"departmentId","departmentName");
                }}
                ,{field:'applyReason', title:'申请原因',templet: function(res){
                    return property.getTextByValuePlus(applyReasonList,res.applyReason,"dictCode","dictName");
                }}
                ,{field:'applyTime', title:'申请日期',templet: function(res){
                    return formatSimpleDate(res.applyTime);
                }}
                ,{field:'remarks', title:'备注'}
                ,{field:'applyStatus', title:'审批状态',templet: function(res){
                    // return res.applyStatus;
                    return property.getTextByValuePlus(statusDictList,res.applyStatus,"dictCode","dictName");
                }}
                ,{field:'approval', title:'当前审批人',templet: function(res){
                    if (null == res.approval || '' == res.approval){
                        return '';
                    }else
                    {
                        return property.getTextByValuePlus(userList,res.approval,"id","name");
                    }
                }}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });


        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'detail'){
                localStorage.videoId = data.partyId;
                localStorage.pageType = "detail";
                localStorage.processInstId = data.id;
                parent.$t.goToPage(this,"page/video/approvalMangerList.html");
            }
            //审批
            else if(obj.event === 'approval'){
                localStorage.videoId = data.partyId;
                localStorage.pageType = "edit";
                localStorage.processInstId = data.id;
                parent.$t.goToPage(this,"page/video/approvalMangerList.html");
            }

        });
    });
}

function setSelect() {
    var applyOrgSelect  = component.getSelectSimplePlus(orgList,null,"applyOrg","departmentId","departmentName");
    $("#applyOrg").append(applyOrgSelect);
    var applyStatusSelect  = component.getSelectSimplePlus(statusDictList,null,"applyStatus","dictCode","dictName");
    $("#applyStatus").append(applyStatusSelect);

    // var applyReasonSelect = component.getSelectPlus(applyReasonList,null,"applyReason","dictCode","dictName");
    // $("#applyReason").html(applyReasonSelect);
}

function getDictData() {
    var keys = ['video_type','approval_status','permissions_settings','video_source','video_save_type','apply_reason']
    var dictDataMulti = property.getDictDataMulti(keys);
    statusDictList = dictDataMulti.approval_status;
    videoSourceList = dictDataMulti.video_source;
    videoTypeList = dictDataMulti.video_type;
    authSettingDictList = dictDataMulti.permissions_settings;
    sourceDictList = dictDataMulti.video_source;
    saveTypeDictList = dictDataMulti.video_save_type;
    applyReasonList = dictDataMulti.apply_reason;
    orgList = property.getAllOrgList();
    userList = property.getAllUserList();
}

function checkUser(id) {
    if (id == userInfo.userId){
        return true;
    } else {
        return false;
    }
}




