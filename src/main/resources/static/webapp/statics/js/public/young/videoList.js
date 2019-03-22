var main={

    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        var _this=this;
        layui.use('table', function(){
            var table = layui.table;
            table.render({
                elem: '#test'
                ,url:'../../statics/json/demo1.json'
                ,toolbar: '#toolbarDemo'
                ,title: '用户数据表'
                ,cols: [[
                    {type:'numbers', title:'编号', fixed: 'left', unresize: true, sort: true}
                    ,{field:'username', title:'活动名称',  edit: 'text'}
                    ,{field:'email', title:'活动状态', edit: 'text', templet: function(res){
                            return '<em>'+ res.email +'</em>'
                        }}
                    ,{field:'city', title:'活动地点'}
                    ,{field:'sign', title:'报名截止时间'}
                    ,{field:'experience', title:'开始时间', sort: true}
                    ,{field:'ip', title:'结束时间'}
                    ,{field:'logins', title:'需求人数', sort: true}
                    ,{field:'joinTime', title:'申请人数', width:120}
                    ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:150}
                ]]
                ,page: true
            });
            //头工具栏事件
            table.on('toolbar(test)', function(obj){
                var checkStatus = table.checkStatus(obj.config.id);
                switch(obj.event){
                    case 'getCheckData':
                        var data = checkStatus.data;
                        layer.alert(JSON.stringify(data));
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
                        obj.del();
                        layer.close(index);
                    });
                } else if(obj.event === 'edit'){
                    parent.$t.goToPage(this,"page/public/young/list.html");
                }else if(obj.event === 'detail'){
                    parent.$t.goToPage(this,"page/public/young/list.html");
                }
            });
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

            //监听查询
            form.on('submit(formDemo)', function(data){
                layer.msg(JSON.stringify(data.field));
                return false;
            });
            //添加
            $(".upload").click(function () {
                parent.$t.goToPage(this,"page/public/young/list.html");
            });
            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("input").val("");
                $(this).prev().click();
            });
        });
        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });
    }
}
main.init();

