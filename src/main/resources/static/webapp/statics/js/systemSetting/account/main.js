/**
 * author: zhangwei
 * 账户设置
 */
var main = {
    init: function () {
        this.getData();
        this.initTable();
    },
    initTable: function() {
        layui.use('form', function() {
            var form = layui.form;

            //监听提交
            form.on('submit(formSubmit)', function(data) {
                layer.msg(JSON.stringify(data.field));
                return false;
            });

            //监听取消
            $("#cancel").click(function () {
                layer.confirm('确认取消吗?', function(index){
                    // parent.$(".myRefresh").click();
                    layer.close(index);
                });
                return false;
            });
        });
    },
    getData: function() {

    }
}
main.init();
