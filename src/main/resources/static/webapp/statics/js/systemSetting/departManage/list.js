/**
 * author: zhangwei
 * 部门管理列表
 */
var main = {

    init:function() {
        this.initTable();
        this.tabBind();
    },
    initTable:function(){
        getSelectData();
        var _this=this;
        reloadTable();

        // 添加
        $('#btnAdd').click(function() {
            localStorage.removeItem('id');
            localStorage.deptType = 'add';
            parent.$t.goToPage(this, "page/systemSetting/departManage/list.html");
        });
    },
    tabBind:function() {
        layui.use(['form'], function () {
            var form = layui.form;


            //改变状态操作操作
            form.on('switch(statusDemo)', function(obj){
                var flag = obj.elem.checked;
                var status = 0;
                if (flag){
                    status = 1;
                }else {
                    status = 0;
                }
                var departmentId = $(obj.elem).attr("data-id");
                var json = {"status":status,"departmentId":departmentId};
                $.ajax({
                    type:"get",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+"sysdepartment/modifyDeptStatus.do",
                    success:function(result) {
                        if (result.success == 1) {
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


            //排序方式
            form.on('select(orderBy)',function(){
                reloadTable();
                return false;
            })

            
        });
    }
}



//获取页面下拉数据
function  getSelectData(data){
    layui.use('form', function() {
        var form = layui.form;
        //获取排序方式下拉框
        orderType = property.getDictData('order_by');
        var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');
        $("#orderBy").append(orderTypeSelect);
        form.render('select');
    });
}



main.init();



/**
 * 加载表格数据
 */
function reloadTable(){
    layui.use('table', function() {
        var table = layui.table;
        var  orderBy  = $("#orderBy").val();
        var tableObj = table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"sysdepartment/getDepartList.do?orderBy="+orderBy
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,title: '部门数据表'
            ,cols: [[
                {type:'numbers', title:'序号'}
                ,{field:'departmentName', title:'部门名称'}
                ,{field:'other1', title:'部门编码'}
                ,{field:'departmentLevel', title:'级别',templet:function(data){
                    if (data.departmentLevel == 1){
                        return "一级";
                    }else if(data.departmentLevel == 2){
                        return "二级";
                    }else if(data.departmentLevel == 3){
                        return "三级";
                    }else if(data.departmentLevel == 4){
                        return "四级";
                    }else {
                        return "未知级别";
                    }
                }
                }
                ,{field:'jobDescription', title:'职能描述'}
                ,{field:'userAmount', title:'用户数量'}
                ,{field:'sequence', title:'排序值'}
                ,{field:'createTime', title:'添加时间',templet:function(data){
                        return  formatDate(data.createTime);
                    }}
                ,{field:'status', title:'是否启用', templet: '#switchTpl'}
                ,{title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });




        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;

            if(obj.event === 'del') {
                layer.confirm('确定要删除部门数据吗？', function(index){
                    var json = {"departmentId":data.departmentId};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"sysdepartment/deleteDepartment.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除部门成功");
                                tableObj.reload();
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
                localStorage.deptType = "edit";
                localStorage.departmentId = data.departmentId;
                parent.$t.goToPage(this, "page/systemSetting/departManage/list.html");
            } else if(obj.event === 'detail'){
                localStorage.deptType = "detail";
                localStorage.departmentId = data.departmentId;
                parent.$t.goToPage(this, "page/systemSetting/departManage/list.html");
            }
        });
    });





}