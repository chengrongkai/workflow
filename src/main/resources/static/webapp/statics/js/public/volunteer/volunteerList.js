var sourceList = [];
var main={

    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){

        getSelectData();
        var _this=this;
        loadTable();


        // 添加
        $('#btnAdd').click(function() {
            localStorage.curatorType = "add";
            parent.$t.goToPage(this, "page/public/volunteer/list.html");
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

            //监听推荐操作
            form.on('switch(recommend)', function(data){

                var recommendName = data.elem.name;
                var recommendId = data.elem.value;
                var dataState = $(data.elem).attr("dataState");
                var recommendStatus;
                if (data.elem.checked) {
                    recommendStatus = "1";
                } else {
                    recommendStatus = "0";
                }
                $.ajax({
                    type:"get",
                    dataType:'json',
                    //contentType:'application/json',
                    contentType:'application/x-www-form-urlencoded',
                    url:property.getProjectPath()+"themeshow/modifyRecommend.do",
                    data:{"recommendStatus":recommendStatus,"recommendId":recommendId,"recommendName":recommendName},
                    success:function(result) {
                        if (result.success == 1) {
                            loadTable();
                            form.render();
                            return false;
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


function getThemeShowOptions2(){
    $.ajax({
        type:"get",
        data:{},
        async:false,
        url:property.getProjectPath()+"themeshow/getSourceOptions.do",
        success:function(result) {
            if (result.code == 0) {
                sourceList = result.data;
            } else {
                errorMsg("数据异常");
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}



//获取页面下拉数据
function getSelectData(){
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
function loadTable(){
    layui.use('table', function(){
        var table = layui.table;
        var activitiesStatus = $("#activitiesStatus").val();
        // var themeSource = $("#themeSource").find("option:selected").text();
        var activitiesName = $("#activitiesName").val();
        var orderBy = $("#orderBy").val();

        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"volunteer/getActivitiesList.do"
            ,method: 'post'
            ,where: {
                activitiesStatus: activitiesStatus,
                activitiesName: activitiesName,
                orderBy: orderBy
            }
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '志愿者活动数据表'
            ,id : "themeShowTable"
            ,cols: [[
                {type:"numbers", title:'编号'}
                ,{field:'activitiesName', title: '活动名称', align:'center'}
                ,{field:'activitiesStatus', title:'活动状态', width: 90, templet: function (row) {
                        var endTime = new Date(row.endTime);
                        var today = new Date();
                        if (today.getTime() > endTime.getTime()) {
                            return "已结束";
                        } else {
                            return "进行中";
                        }
                    }}
                ,{field:'activitiesPlace', title:'活动地点'}
                ,{field:'endSignTime', title:'报名截止时间', width: 140,templet: function (row) {
                        return formatDate(row.endSignTime);
                    }}
                ,{field:'startTime', title:'开始时间', width: 140,templet: function (row) {
                        return formatDate(row.startTime);
                    }}
                ,{field:'endTime', title:'结束时间', width: 140,templet: function (row) {
                        return formatDate(row.endTime);
                    }}
                ,{field:'needNumber', title:'需求人数', width: 90}
                ,{field:'applyCount', title:'申请人数', width: 90}
                ,{title:'操作', width: 190, toolbar: '#barDemo'}
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
                parent.layer.confirm('确定要删除么',{icon:3, title:'删除确认'}, function(index){
                    var json = {"id":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"volunteer/deleteVolunteerById.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除志愿者活动成功");
                                loadTable();
                            } else if (result.success == 0){
                                //top.layer.msg(result.error.message);
                                errorMsg("删除志愿者活动失败");
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    parent.layer.close(index);
                });
            } else if(obj.event === 'edit'){
                localStorage.voType = "edit";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/volunteer/list.html");
            }else if(obj.event === 'detail'){
                localStorage.voType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/volunteer/list.html");
            }
        });
    });
}