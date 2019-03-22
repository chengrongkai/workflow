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
        // $('#btnAdd').click(function() {
        //     localStorage.roleType = "add";
        //     parent.$t.goToPage(this, "page/systemSetting/roleManage/list.html");
        // });
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
            ,url:property.getProjectPath()+"PostVideo/queryKeywordsList.do"
            ,title: '用户数据表'
            ,cols: [[
                {type:'numbers', title:'序号', width:80, fixed: 'left', unresize: true, sort: true}
                ,{field:'keywords', title:'关键词'}
                ,{field:'videoCount', title:'资料数量'}
                ,{field:'remark', title:'备注'}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if (obj.event === 'show'){
                localStorage.pageType = "show";
                localStorage.keyId = data.keywords;
                parent.$t.goToPage(this, "page/video/keywordsList.html");
            }
        });
    });
}

