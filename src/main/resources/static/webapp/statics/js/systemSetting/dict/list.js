/**
 * author: zhangwei
 * 业务字典理列表
 */
var pidData = [];
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
            localStorage.dictType = "add";
            parent.$t.goToPage(this, "page/systemSetting/dict/list.html");
        });
    },
    tabBind: function() {
        layui.use(['form'], function () {
            var form = layui.form;
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
    }
}
main.init();

function loadTable() {
    pidData = getDictList();
    layui.use('table', function(){
        var table = layui.table;
        var form = layui.form;
        var dictType = $("#dictType").val();
        var dictName = $("#dictName").val();
        var dictCode = $("#dictCode").val();
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"sysDict/getSysDictList.do?dictType="+dictType+"&dictCode="+dictCode+"&dictName="+dictName
            ,title: '业务字典表'
            ,cols: [[
                {type:'numbers', title:'序号'}
                ,{field:'dictCode', title:'字典编码'}
                ,{field:'dictName', title:'字典名称'}
                ,{field:'dictType', title:'字典类型'}
                ,{field:'description', title:'字典描述'}
                ,{field:'dictOrder', title:'字典排序'}
                ,{field:'pid', title:'上级字典',templet: function(res){
                    if (res.pid == '-1'){
                        return '根目录';
                    }else{
                        return property.getTextByValuePlus(pidData,res.pid,"id","dictName");
                    }

                }}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'del') {
                layer.confirm('确定要删除么',{icon:3, title:'删除确认'}, function(index){
                    var json = {"dictId":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"sysDict/deleteSysDict.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除字典成功");
                                loadTable();
                            } else if (result.success == 0){
                                errorMsg(result.data);
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    layer.close(index);
                });
            } else if (obj.event === 'edit'){
                localStorage.dictType = "edit";
                localStorage.dictId = data.id;
                parent.$t.goToPage(this, "page/systemSetting/dict/list.html");
            }else if (obj.event === "authSetting"){
                localStorage.dictId = data.id;
                parent.$t.goToPage(this, "page/systemSetting/dict/list.html");
            }
        });
    });
}

function getDictList() {
    var datas = null;
    $.ajax({
        type:"get",
        data:null,
        async:false,
        url:property.getProjectPath()+"sysDict/getSysDictListAll.do",
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

