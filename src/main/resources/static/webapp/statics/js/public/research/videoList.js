var main={

    init:function () {
        layui.use('laydate', function(){
            var laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#endTime' //指定元素
            });
            laydate.render({
                elem: '#startTime', //指定元素
                type: 'datetime'
            });
        });
        $('#btnAdd').click(function() {
            // localStorage.clear();
            localStorage.removeItem('userType');
            localStorage.userType = "add";
            parent.$t.goToPage(this, "page/public/research/list.html");
        });
        this.initTable(null);
        this.tabBind()
    },
    initTable:function(where){
        getSelect();
        var _this=this;
        reloadTable();
    },
    tabBind:function () {
        var _this=this;

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

            //监听查询
            form.on('submit(formDemo)', function(data){
              /*  layer.msg(JSON.stringify(data.field));
                var data = data.field;
                var startTime = data.startTime;
                var endTime = data.endTime;
                var json = {startTime: startTime, endTime: endTime};
                // _this.initTable(JSON.stringify(json))
                _this.initTable(json);*/
                reloadTable();
                return false;
            });
            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("select").val("");
                $(this).parents(".layui-form").find("input").val("");
                $(this).prev().click();
            });

            //排序方式
            form.on('select(orderBy)',function(){
                reloadTable();
                return false;
            })


        });
        //查询事件
        layui.use('form', function(){
            var form = layui.form;


        });
    }
}


function  getSelect(){
    //获取排序方式下拉框
    orderType = property.getDictData('order_by');
    var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');
    $("#orderBy").append(orderTypeSelect);
}


main.init();



/**
 * 加载表格数据
 */
function reloadTable(){

    layui.use('table', function(){
        var table = layui.table;
        var util = layui.util;
        var  startTime = $("#startTime").val();
        //var  endTime = $("#endTime").val();
        var  orderBy = $("#orderBy").val();

        table.render({
            elem: '#test'
            ,url: property.getProjectPath() + "research/getListResearch.do?startTime="+startTime+"&orderBy="+orderBy
            //,where: where || {}
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '用户数据表'
            ,cols: [[
                {type:'numbers', title:'编号'}
                // ,{field:'createTime', title:'创建时间'}
                ,{field:'createTime', title:'创建时间',templet: function (res) {
                        // return util.toDateString(res.planTime, 'yyyy-MM-dd HH:mm');
                        return util.toDateString(res.createTime, 'yyyy-MM-dd HH:mm');
                    }
                }
                ,{field:'title', title:'学术研究主题'}
                ,{title:'操作', toolbar: '#barDemo', }
            ]]
            ,page: true
        });
        //头工具栏事件
        table.on('toolbar(test)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'getCheckData':
                    var data = checkStatus.data;
                    //var ids = data.map(obj => obj.id);
                    var  ids = data.map(function (obj) {
                        return  obj.id;
                    });
                    var length = ids.length;
                    if (length <= 0) {
                        errorMsg('请勾选要删除的藏品信息');
                        return ;
                    } else {
                        var idStr = ids.join(',');
                        let datas = yc.ajaxGetByParams('research/updateResearchByIds', {ids: idStr}, null);
                        if (datas.success == 1) {
                            successMsg('批量删除成功');
                            reloadTable();
                        } else {
                            errorMsg('批量删除失败');
                        }
                    }
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
                var id = obj.data.id;
                layer.confirm('确定要删除么',{icon:3, title:'删除确认'}, function(index){
                        obj.del();
                        let delId = obj.data.id;
                        var datas = yc.ajaxGetByParams('research/deleteResearchById', {id: delId}, '删除成功');
                        if (datas.success == 1) {
                            successMsg('删除成功');
                        } else {
                            errorMsg('删除失败');
                        }
                        layer.close(index);
                        reloadTable();
                    });
            }else if(obj.event === 'edit'){
                localStorage.userType = "edit";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/research/list.html");
            }else if(obj.event === 'detail'){
                localStorage.userType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/research/list.html");
                layer.prompt({
                    formType: 2
                    ,value: data.email
                }, function(value, index){
                    obj.update({
                        email: value
                    });
                    layer.close(index);
                });
            }
        });
    });




}