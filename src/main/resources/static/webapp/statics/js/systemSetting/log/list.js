/**
 * author: zhangwei
 * 系统日志
 */
var typeList = [];
var main = {

    init: function() {
        // this.initDate();
        this.initTable();
        this.tabBind();
    },

    initTable: function() {
        //getUserOptions();
        //setSelect();
        var _this = this;
        loadTable();


        $(".search-btn").on("click",function(){
            //显示条数
        });
    },
    tabBind: function(){
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


            layui.use('laydate', function(){
                var laydate = layui.laydate;
                //执行一个laydate实例
                laydate.render({
                    elem: '#loginTime' //指定元素
                    ,type: 'datetime'
                    ,range: true
                });
            });



            //监听查询
            form.on('submit(formDemo)', function(data){
                //layer.msg(JSON.stringify(data.field));
                loadTable();
                return false;
                // reloadTable();

            });

            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("select").val("");
                $(this).parents(".layui-form").find("input").val("");
                $(this).prev().click();
            });
        });
        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });
    },

}







function getUserOptions(){
    $.ajax({
        type:"get",
        data:{},
        async:false,
        url:property.getProjectPath()+"syslog/getUserOptions.do",
        success:function(result) {
            if (result.code == 0) {
                typeList = result.data;
            } else {
                errorMsg("数据异常");
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function setSelect() {
    var typeSelect = component.getSelectSimplePlus(typeList,null,"userName");
    $("#userName").append(typeSelect);
}




main.init();

function loadTable(){
    layui.use('table', function(){
        var table = layui.table;
        var userName = $("#userName").val();
        var loginTime = $("#loginTime").val();
        var endTime = null;
        if (null != loginTime && loginTime != ''){
            endTime = loginTime.split(" - ")[1];
            loginTime = loginTime.split(" - ")[0];
        }
        var tableObj = table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"syslog/getSyslogList.do?username="+userName+"&logintime="+loginTime+"&endTime="+endTime
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '系统日志表'
            ,id : "showLogTable"
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{type:'numbers', title:'序号', width:80, fixed: 'left', unresize: true}
                ,{field:'userName', title:'操作者'}
                ,{field:'loginTime', title:'操作日期',templet:function(data){
                        return  formatDate(data.loginTime);}}
                ,{field:'loginIp', title:'IP地址'}
                ,{field:'action', title:'操作记录'}
            ]]
            ,page: true
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
                            ids += data[i].signId+","
                        }
                    }
                    layer.confirm("确认要批量删除吗",function(index){
                        $.ajax({
                            type:"get",
                            data:{"ids":ids},
                            async:false,
                            url:property.getProjectPath()+"syslog/batchRemove.do",
                            success:function(result) {
                                if (result.success == 1) {
                                    successMsg("删除日志成功");
                                    loadTable();
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





