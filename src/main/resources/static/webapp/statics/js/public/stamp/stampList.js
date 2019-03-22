var typeList = [];
var main={

    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        setSelect();
        var _this=this;
       /* _this.getHomeOptions();
        _this.setSelect();*/

        loadTable();

        // 添加
        $('#btnAdd').click(function() {
            // localStorage.clear();
            localStorage.removeItem('HomeType');
            localStorage.HomeType = 'add';
            parent.$t.goToPage(this, "page/public/stamp/list.html");
        });


    },
    tabBind:function () {
        layui.use(['form'], function () {
            var form = layui.form;
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
            //监听性别操作
            form.on('switch(sexDemo)', function(obj){
                layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
            });


            layui.use('laydate', function(){
                var laydate = layui.laydate;
                //执行一个laydate实例
                laydate.render({
                    elem: '#createTime' //指定元素
                });
            });


            //监听查询
            form.on('submit(formDemo)', function(data){
                loadTable();
                return false;
            });
            //添加
            $(".upload").click(function () {
                parent.$t.goToPage(this,"page/public/stamp/list.html");
            });
            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("input").val("");
                $(this).prev().click();
            });


            //排序方式
            form.on('select(orderBy)',function(){
                loadTable();
                return false;
            })


        });


        //回车触发查询
        $("#collectHomeTheme").keypress(function (e) {
            if (e.which == 13) {
                loadTable();
            }
        });


        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });


    },


   /* getHomeOptions:function(){

        $.ajax({
            type:"get",
            data:{},
            async:false,
            url:property.getProjectPath()+"collecthome/getHomeOptions.do",
            success:function(result) {
                if (result.code == 0) {
                    typeList = result.data;
                } else {
                    top.layer.msg("数据异常");
                }
            },
            error:function(result) {
                top.layer.msg("系统异常");
            }
        });
    },

    setSelect:function(){
        layui.use('form', function() {
            var form = layui.form;
            var typeSelect = component.getSelect(typeList, null, "collectHomeTheme");
            $("#collectHomeTheme").html(typeSelect);
            form.render('select');
        });
    }*/


}





main.init();




/**
 * 加载表格数据
 */
function loadTable(){
    layui.use('table', function(){
        var table = layui.table;
        var createTime = $("#createTime").val();
        var collectHomeTheme = $("#collectHomeTheme").val();
        var orderBy = $("#orderBy").val();
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"collecthome/getCollectHomeList.do?createTime="+createTime+"&collectHomeTheme="+collectHomeTheme+"&orderBy="+orderBy
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '集邮之家数据表'
            ,id : "themeShowTable"
            ,cols: [[
                //{type: 'checkbox'}
                {type:"numbers", title:'编号'}
                ,{field:'createTime', title:'创建时间',templet:function(data){
                        return  formatDate(data.createTime);}}
                ,{field:'collectHomeTheme', title:'集邮资讯主题'}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo'}
            ]]
            ,page: true
        });
        //头工具栏事件
        table.on('toolbar(test)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'getCheckData':
                    var data = checkStatus.data;
                    break;
                case 'getCheckLength':
                    var data = checkStatus.data;
                    layer.msg('选中了：'+ data.length + ' 个');
                    break;
                case 'isAll':
                    layer.msg(checkStatus.isAll ? '全选': '未全选');
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'del'){
                parent.layer.confirm('真的删除行么',{icon:3, title:'删除确认'}, function(index){
                    var json = {"id":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"collecthome/deleteById.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除集邮资讯成功");
                                loadTable();
                            } else if (result.success == 0){
                                //top.layer.msg(result.error.message);
                                errorMsg("删除集邮资讯失败");
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    parent.layer.close(index);
                });
            } else if(obj.event === 'edit'){
                localStorage.HomeType = "edit";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/stamp/list.html");
            }else if(obj.event === 'detail'){
                localStorage.HomeType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/stamp/list.html");
            }
        });
    });
}



function setSelect(data){
    //获取排序方式下拉框
    orderType = property.getDictData('order_by');
    var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');
    $("#orderBy").append(orderTypeSelect);
}



