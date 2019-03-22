/**
 * author: zhangwei
 * 角色管理列表
 */
var main = {

    init: function() {
        this.initTable();
        this.tabBind();
    },
    initTable: function() {
        var _this=this;
        loadTable();
        // 添加
        $('#btnAdd').click(function() {
            localStorage.roleType = "add";
            parent.$t.goToPage(this, "page/systemSetting/roleManage/list.html");
        });
    },
    tabBind: function() {
        layui.use(['form'], function () {
            var form = layui.form;

            //监听性别操作
            form.on('switch(sexDemo)', function(obj){
                var flag = obj.elem.checked;
                var status = 0;
                if (flag){
                    status = 1;
                }else {
                    status = 0;
                }
                var roleId = $(obj.elem).attr("data-id");
                var json = {"status":status,"roleId":roleId};
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+"Role/changeStatus.do",
                    success:function(result) {
                        if (result.success == 1) {
                            // loadTable();
                            successMsg("操作成功");
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
    }
}
main.init();

function loadTable() {
    layui.use('table', function(){
        var table = layui.table;
        var form = layui.form;
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"Role/queryRoleList.do"
            ,title: '用户数据表'
            ,cols: [[
                {type:'numbers', title:'序号', width:80, fixed: 'left', unresize: true, sort: true}
                ,{field:'roleCode', title:'角色编码'}
                ,{field:'name', title:'角色名称'}
                ,{field:'sort', title:'排序值'}
                ,{field:'userNumber', title:'用户数'}
                ,{field:'createTime', title:'添加时间', templet: function (res) {
                    return formatDate(res.createTime);
                }}
                ,{field:'status', title:'是否启用', templet: '#switchTpl'}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'del') {
                layer.confirm('您确定要删除么', function(index){
                    var json = {"roleId":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"Role/deleteRole.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除角色成功");
                                loadTable();
                            } else if (result.success == 0){
                                errorMsg(result.error.message);
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    layer.close(index);
                });
            } else if (obj.event === 'edit'){
                localStorage.roleType = "edit";
                localStorage.roleId = data.id;
                parent.$t.goToPage(this, "page/systemSetting/roleManage/list.html");
            }else if (obj.event === "authSetting"){
                localStorage.roleId = data.id;
                parent.$t.goToPage(this, "page/systemSetting/roleManage/list.html");
            }
        });
    });
}

