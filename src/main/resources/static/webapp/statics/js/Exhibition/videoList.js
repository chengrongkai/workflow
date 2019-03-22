var main={

    init:function () {
        layui.use('laydate', function(){
            var laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#planTime' //指定元素
            });
        });
        this.initTable(null);
        this.tabBind();


    },
    // initTable:function(params){
    initTable:function(where){
        var that = this;
        getSelectData();
        loadTable(that);
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
                // layer.msg(JSON.stringify(data.field));
                var datas = data.field;
                var json = {'name': datas.nameVague || '', 'planTime': datas.planTime || ''};
                // _this.initTable(JSON.stringify(json))
                _this.initTable(json);
                return false;
            });
            //添加展陈
            $(".upload").click(function () {
                parent.$t.goToPage(this,"page/Exhibition/videoList.html");
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
        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });
    }
}



//获取页面下拉数据
function getSelectData(){
    layui.use('form', function() {
        var form = layui.form;
        //获取排序方式下拉框
        orderType = property.getDictData('order_by');
        var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');
        $("#orderBy").empty();
        $("#orderBy").append(orderTypeSelect);
        form.render('select');
    });
}



main.init();





function loadTable(that){

    layui.use('table', function(){
        var table = layui.table;
        var util = layui.util;
        var name  = $("#nameVague").val();
        var orderBy  = $("#orderBy").val();
        var planTime = $('#planTime').val();
        var module = localStorage.functinId;
        // var data = returnDatas(null, "exhib/getListExhibition.do");
        table.render({
            elem: '#test',
            //where: where || {},
            url: property.getProjectPath() + "exhib/getListExhibition.do?name="+name+"&orderBy="+orderBy+"&planTime="+planTime+"&module="+module,
            request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '用户数据表'
            ,cols: [[
                {type: 'checkbox'}
                ,{type:'numbers', title:'编号'}
                ,{field:'exhibName', title:'展陈名称', align:"center"}
                ,{field:'inportWord', title:'关键词', align:"center"}
                ,{field:'roomNum', title:'展厅数量', align:"center"}
                ,{field:'colleNum', title:'关联藏品', align:"center"}
                ,{field:'videoNum', title:'关联影视资料', align:"center"}
                ,{field:'planTime', title:'策划时间', align:"center",
                    templet: function (res) {
                        // return util.toDateString(res.planTime, 'yyyy-MM-dd HH:mm');
                        return util.toDateString(res.planTime, 'yyyy-MM-dd');
                    }
                }
                ,{field:'startTime', title:'开始时间', align:"center",
                    templet: function (res) {
                        return util.toDateString(res.startTime, 'yyyy-MM-dd');
                    }
                }
                ,{field:'endTime', title:'结束时间', align:"center",
                    templet: function (res) {
                        return util.toDateString(res.endTime, 'yyyy-MM-dd');
                    }}
                ,{field:'remark', title:'备注', align:"center"}
                ,{title:'操作', align:"center", toolbar: '#barDemo',fixed: 'right',width: 170}
            ]]
            ,page: true
        });
        //头工具栏事件
        table.on('toolbar(test)', function(obj){

            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){

                case 'getCheckData':
                    var data = checkStatus.data;
                    // layer.alert(JSON.stringify(data));
                    //var idsArray = data.map(obj => obj.id) || [];
                    var  idsArray = data.map(function (obj){
                        return obj.id;
                    }) || [];
                    if (idsArray.length == 0) {
                        errorMsg('请选择多选框');
                        return ;
                    } else {
                        // reduce
                        parent.layer.confirm('确定要删除么',{icon:3, title:'删除确认'}, function(index){
                            var ids = idsArray.join(',');
                            yc.ajaxGetByParams('exhib/updateExhibByIds.do', {'ids': ids}, null);
                            successMsg("批量删除展陈成功");
                            loadTable();
                            //top.layer.msg("删除展陈成功");
                            //that.initTable(null);
                            parent.layer.close(index);
                        });

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
                parent.layer.confirm('确定要删除么',{icon:3, title:'删除确认'}, function(index){
                    var delId = obj.data.id;
                    yc.ajaxGetByParams('exhib/updateExhibByIds.do', {'ids': delId}, null);
                    successMsg("删除展陈成功");
                    loadTable();
                    //top.layer.msg("删除展陈成功");
                    //layer.close(index);
                    // _this.initTable(JSON.stringify(json))
                    //that.initTable(null);
                    parent.layer.close(index);
                });

            } else if(obj.event === 'edit'){
                localStorage.ExhibType = "edit";
                localStorage.ExhibId = data.id;
                parent.$t.goToPage(this,"page/Exhibition/videoList.html");
            }else if(obj.event === 'detail'){
                localStorage.ExhibType = "detail";
                localStorage.ExhibId = data.id;
                parent.$t.goToPage(this,"page/Exhibition/videoList.html");
            }
        });
    });




}