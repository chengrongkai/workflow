/**
 * author: zhangwei
 * 存储备份列表
 */
var main = {

    init: function() {
        this.initTable();
        // this.tabBind();
    },
    initTable: function() {
        var _this=this;
        layui.use('table', function() {
            var table = layui.table;
            table.render({
                elem: '#test'
                ,url:'../../statics/json/demo1.json'
                ,toolbar: '#toolbarDemo'
                ,title: '用户数据表'
                ,cols: [[
                    {field:'username', title:'备份文件名'}
                    ,{field:'username', title:'版本号'}
                    ,{field:'email', title:'大小(字节)'}
                    ,{field:'city', title:'备份时间'}
                    ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
                ]]
                ,page: true
            });

            //头工具栏事件
            table.on('toolbar(test)', function(obj) {
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
            table.on('tool(test)', function(obj) {
                var data = obj.data;

                if(obj.event === 'del') {
                    layer.confirm('真的删除行么', function(index){
                        obj.del();
                        layer.close(index);
                    });
                } else {
                    layer.msg('恢复');
                }
            });
        });
    },
    tabBind: function() {
        
    }
}
main.init();