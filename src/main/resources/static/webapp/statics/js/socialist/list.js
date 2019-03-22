/**
 * author: zhangwei
 * 社教管理列表
 */
var userList = property.getAllUserList();
var main = {

    init: function() {
        // this.initDate();
        this.initTable();
        this.tabBind();
    },
    // initDate: function() {
    //     layui.use('laydate', function(){
    //         var laydate = layui.laydate;
    //         laydate.render({
    //             elem: '#oprateDate'
    //         });
              
    //     });
    // },
    initTable: function() {
        var _this = this;
        getSelect();
        loadTable();

        // 添加
        $('#btnAdd').click(function() {
            localStorage.removeItem('id');
            localStorage.socialType = "add";
            parent.$t.goToPage(this, "page/socialist/list.html");
        });
    },
    tabBind: function() {
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

            //监听查询
            form.on('submit(formDemo)', function(data){
                //layer.msg(JSON.stringify(data.field));
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





function loadTable(){
    layui.use('table', function(){
        var table = layui.table;
        var socialName = $("#socialName").val();
        var  orderBy = $("#orderBy").val();
        var module = localStorage.functinId;
        var tableObj = table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"postsocial/getSocialList.do?keywords="+socialName+"&orderBy="+orderBy+"&module="+module
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '社教管理表'
            ,id : "showSocialTable"
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{type:'numbers', title:'编号', width:80, fixed: 'left', unresize: true}
                ,{field:'socialName', title:'社教名称'}
                ,{field:'keyWord', title:'关键词'}
                ,{field:'cooperationMode', title:'合作方式'}
                ,{field:'cooperationUnit', title:'合作单位'}
                ,{field:'holdTime', title:'举办时间',templet:function(data){
                        return  formatSimpleDate(data.holdTime);}}
                ,{field:'creator', title:'提交人',templet: function(res){
                    return property.getTextByValuePlus(userList,res.creator,"id","name");
                }}
                ,{field:'remark', title:'备注'}
                ,{title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });



        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;

            if(obj.event === 'del') {
                layer.confirm('真的删除行么', function(index){
                    var json = {"id":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"postsocial/deleteSocial.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除社教成功");
                                loadTable();
                            } else if (result.success == 0){
                                //top.layer.msg(result.error.message);
                                errorMsg("删除社教失败");
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    layer.close(index);
                });
            } else if (obj.event === 'edit'){
                localStorage.socialType = "edit";
                localStorage.id = data.id;
                parent.$t.goToPage(this, "page/socialist/list.html");
            } else if(obj.event === 'detail'){
                localStorage.socialType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this, "page/socialist/list.html");
            }
        });




        //头工具栏事件
        table.on('toolbar(test)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'getCheckData':
                    var data = checkStatus.data;
                    if(data == ""){
                        layer.msg("至少也得选一个吧",{icon: 2});
                        return;
                    }

                    var  ids = "";
                    if(data.length>0){
                        for(i=0;i<data.length;i++){
                            ids += data[i].id+","
                        }
                    }
                    layer.confirm("确认要批量删除吗",function(index){
                        $.ajax({
                            type:"get",
                            data:{"ids":ids},
                            async:false,
                            url:property.getProjectPath()+"postsocial/batchRemoves.do",
                            success:function(result) {
                                if (result.success == 1) {
                                    successMsg("批量删除社教成功");
                                    loadTable();
                                } else if (result.success == 0){
                                    //top.layer.msg(result.error.message);
                                    errorMsg("批量删除操作失败");
                                }
                            },
                            error:function(result) {
                                errorMsg("系统异常");
                            }
                        });
                        layer.close(index);
                    });
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
    });
}

