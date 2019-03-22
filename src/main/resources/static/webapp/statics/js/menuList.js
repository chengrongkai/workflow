var typeList = [{"value":0,"text":"菜单"},{"value":1,"text":"按钮"},{"value":2,"text":"其他"}];
var parentidList = [{"value":0,"text":"菜单"},{"value":1,"text":"按钮"},{"value":2,"text":"其他"}];
var main={

    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        var _this=this;
        loadTable();
    },
    tabBind:function () {
        layui.use(['form','layer'], function () {
            var form = layui.form;
            var layer = parent.layer === undefined ? layui.layer : top.layer,
                $ = layui.jquery;
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

        $("#addFunction").click(function () {
            localStorage.menuType=0;
            parent.$t.goToPage(this,"page/menu/menuList.html");
        })
    }
}

/**
 * 加载表格数据
 */
function loadTable() {
    //获取业务字典
    // getDictData();
    //设置下拉框
    setSelect();
    layui.config({
        base: '../../statics/module/'
    }).extend({
        treetable: 'treetable-lay/treetable'
    }).use(['layer', 'table', 'treetable'], function () {
        var $ = layui.jquery;
        var table = layui.table;
        var layer = layui.layer;
        var treetable = layui.treetable;
        var type = $("#typeSelect").val();
        var functionName = $("#functionName").val();
        // 渲染表格
        var renderTable = function () {
            layer.load(2);
            treetable.render({
                treeColIndex: 1,
                treeSpid: -1,
                treeIdName: 'id',
                treePidName: 'pid',
                treeDefaultClose: true,
                treeLinkage: false,
                elem: '#test',
                url: property.getProjectPath()+"Function/queryFunctionList?functionName="+functionName+"&type="+type,
                page: false,
                cols: [[
                    {type: 'numbers'},
                    {field: 'functionname', title: '功能名称'},
                    {field: 'type', title: '类别',templet: function(res){
                        var myId = res.id+res.type;
                        return component.getSelect(typeList,res.type,myId);
                    }},
                    {field: 'sort', title: '排序'},
                    {field: 'iconremark', title: '图标'},
                    {field: 'functionurl', title: '链接地址'},
                    {templet: '#oper-col', title: '操作',fixed: 'right'}
                ]],
                done: function () {
                    layer.closeAll('loading');
                }
            });
        };

        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'del'){
                layer.confirm('您确定要删除么', function(index){
                    // obj.del();
                    layer.close(index);
                    deleteMenu(data.id);
                });
            } else if(obj.event === 'edit'){
               // editMenu(data.id);
                localStorage.menuId=data.id;
                localStorage.menuType=1;
                parent.$t.goToPage(this,"page/menu/menuList.html");
            }else if(obj.event === 'detail'){

            }
        });

        renderTable();

        $('#btn-expand').click(function () {
            treetable.expandAll('#test');
        });

        $('#btn-fold').click(function () {
            treetable.foldAll('#test');
        });

        $('#btn-refresh').click(function () {
            renderTable();
        });

    });
}

/**
 * 删除菜单
 */
function deleteMenu(id) {
    var json = {"functionId":id};
    $.ajax({
        type:"get",
        data:json,
        async:false,
        url:property.getProjectPath()+"Function/deleteFunction",
        success:function(result) {
            if (result.success == 1) {
                successMsg("删除功能成功");
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


function getDictData() {
    $.ajax({
        type:"get",
        data:json,
        async:false,
        url:property.getProjectPath()+"Dict/getDictData",
        success:function(result) {
            if (result.success == 1) {
               typeList = result.data.typeList;
               parentidList = result.data.typeList;
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function setSelect() {
    var typeSelect = component.getSelect(typeList,null,"type");
    $("#typeSelect").html(typeSelect);
}
main.init();

