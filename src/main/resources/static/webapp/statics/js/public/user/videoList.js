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

            //监听冻结操作
            form.on('switch(freeze)', function(data){
                var id = data.elem.value;
                var userStatus;
                if (data.elem.checked) {
                    userStatus = "0";
                } else {
                    userStatus = "1";
                }

                $.ajax({
                    type:"post",
                    url:property.getProjectPath() + '/pubUser/modifyUserStatus.do',
                    data:{"userStatus":userStatus,"id":id},
                    success:function(result) {
                        if (result.success == 1) {
                            loadTable();
                            form.render();
                        } else if (result.success == 0){
                            if(recommendStatus == "1"){
                                $(data.elem).attr("checked",false);
                            }else{
                                $(data.elem).attr("checked",true);
                            }
                            form.render();
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {

                    }
                })
            });





           /* form.on('switch(freeze)', function(data){
                var title = ''
                var id = data.elem.value;
                var userStatus;
                if (data.elem.checked) {
                    title = '确认冻结吗'
                    userStatus = "0";
                } else {
                    title = '确认取消冻结吗'
                    userStatus = "1";
                }

                layer.confirm(title,{icon:3, title:'冻结确认'}, function(index){
                    $.ajax({
                        type:"post",
                        url:property.getProjectPath() + '/pubUser/modifyUserStatus.do',
                        data:{"userStatus":userStatus,"id":id},
                        success:function(result) {
                            if (result.success == 1) {
                                if(userStatus == 0) {
                                    top.layer.msg("冻结成功");
                                } else {
                                    top.layer.msg("取消冻结成功");
                                }
                            }
                            loadTable();
                            form.render();
                            layer.close(index)
                        },
                        error:function(result) {

                        }
                    })


                    form.render();
                });



            });*/



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

            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("select").val("");
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
        var  name  =  $("#nameVague").val();
        var  phone  =  $("#phone").val();
        var  createTime  =  $("#createTime").val();
        var  orderBy = $("#orderBy").val();

        table.render({
            elem: '#test'
            ,url: property.getProjectPath() + "pubUser/getListPubUser.do?name="+name+"&phone="+phone+"&createTime="+createTime+"&orderBy="+orderBy
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '用户数据表'
            ,cols: [[
                {type:"numbers", title:'编号'}
                ,{field:'userName', title:'用户名', width:120}
                ,{field:'phone', title:'手机', width:150}
                ,{field:'sex', title:'性别', width:85, templet: function(data){
                        if (data.sex == "0"){
                            return "女";
                        }else if(data.sex == "1"){
                            return "男";
                        }
                    }}
                ,{field:'city', title:'城市', width:100}
                ,{field:'job', title:'职业'}
                ,{field:'createTime', title:'注册时间', width:120,templet:function(data){
                        return  formatDate(data.createTime);}}
                ,{field:' ', title:'冻结',width:200, templet: '#switchTp2'}
                ,{title:'操作', toolbar: '#barDemo', width:150}
            ]]
            ,page: true
        });
        //头工具栏事件
        table.on('toolbar(test)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'getCheckData':
                    var data = checkStatus.data;
                    //layer.alert(JSON.stringify(data));
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
                layer.confirm('确定要删除么',{icon:3, title:'删除确认'}, function(index){
                    var json = {"id":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"pubUser/deletePubUserById.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除公众用户成功");
                                loadTable();
                            } else if (result.success == 0){
                                errorMsg("删除公众用户失败");
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    layer.close(index);
                });
            } else if(obj.event === 'edit'){
                localStorage.pubUserType = "edit";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/user/list.html");
            }else if(obj.event === 'detail'){
                localStorage.pubUserType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/user/list.html");
            }
        });
    });



}