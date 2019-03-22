var main={

    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        getSelect();
        var _this=this;
        loadTable();



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
                    elem: '#orderTime' //指定元素
                });
            });




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
function loadTable(){
    layui.use('table', function(){
        var table = layui.table;
        var bookingType = $("#bookingType").val();
        var contacts = $("#contacts").val();
        var orderTime = $("#orderTime").val();
        //var  userId = JSON.parse(localStorage.userInfo).userId;

        var  orderBy = $("#orderBy").val();

        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"booking/getBookingList.do?bookingType="+bookingType+"&contacts="+contacts+"&orderTime="+orderTime+"&orderBy="+orderBy
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '预约管理数据表'
            ,id : "themeShowTable"
            ,cols: [[
                {type:"numbers", title:'编号', unresize: true, sort: true}
                ,{field:'bookingType', title:'预约类型',templet:function(data){
                    if(data.bookingType == '1') {
                        return "个人预约";
                    }
                    else if(data.bookingType == '2'){
                        return "团体预约";
                    }
                    else{
                        return "";
                    }
                }}
                ,{field:'amount', title:'参观人数'}
                ,{field:'unitName', title:'单位名称'}
                ,{field:'contacts', title:'联系人'}
                ,{field:'contactsPhone', title:'联系电话'}
                ,{field:'orderTime', title:'预约时间',templet:function(data){
                    return  formatSimpleDate(data.orderTime);}}
                ,{field:'createTime', title:'创建时间',templet:function(data){
                    return  formatDate(data.createTime);}}
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
                layer.confirm('真的删除行么', function(index){
                    var json = {"id":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"booking/deleteById.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除预约成功");
                                loadTable();
                            } else if (result.success == 0){
                                //top.layer.msg(result.error.message);
                                errorMsg("删除预约失败");
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    layer.close(index);
                });
            } else if(obj.event === 'edit'){
                localStorage.BookType = "edit";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/preDeal/list.html");
            }else if(obj.event === 'detail'){
                localStorage.BookType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/preDeal/list.html");
            }
        });
    });
}