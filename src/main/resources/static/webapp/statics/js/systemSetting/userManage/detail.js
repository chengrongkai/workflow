/**
 * author: zhangwei
 * 用户管理详情
 */

var pageType = 'detail';
var main = {

    init: function() {
        this.id = parent.$t.getQueryStringFrame('id');
        var dataObj = yc.arrayToJsonObject(['id'], [this.id]);
        var datas = yc.ajaxGetByParams("sysUser/getSysUserById.do", dataObj, null).data;
        var keyArrays = ['userName', 'name', 'email', 'phone', 'deptName', 'roleName', 'password', 'surePassword', 'remark'];
        var valueArrays = keyArrays.map(obj => datas[obj]);
        this.getDetailData(yc.arrayToJsonObject(keyArrays, valueArrays));
        // this.initTable();
    },
    initTable: function() {
        layui.use('form', function() {
            var form = layui.form;

            //监听提交
            form.on('submit(back)', function(data) {
                parent.$(".myRefresh").click();
                return false;
            });
        });
    },
    getDetailData: function(datas) {
        layui.use('form', function() {
            var form = layui.form;
            // datas.password = yc.info;
            // datas.surePassword = yc.info;
            form.val("myform", datas);
        });
    }
}
main.init();


