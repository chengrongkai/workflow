
var main = {

    init: function () {
        this.initTable();
        this.tabBind();
    },
    initTable: function () {

        this.id = parent.$t.getQueryStringFrame('id');
        var datas = yc.ajaxGetByParams("research/getOneResearch.do", {id: this.id}, null, null);


        var success = datas.success || ''
        if (success == 1) {
            var data = datas.data;
            setFormData(data);

            // property.setForm($("#researchForm"), data);
        } else {
            errorMsg('查询详情错误，请联系管理员');
        }

        layui.use('form', function () {
            var form = layui.form;
            //监听提交
            form.on('submit(formDemo)', function (data) {
                layer.msg(JSON.stringify(data.field));
                return false;
            });
        });
        layui.use('layedit', function () {
            var layedit = layui.layedit;
            layedit.build('demo'); //建立编辑器
        });
        layui.use('upload', function () {
            var upload = layui.upload;

            //执行实例
            var uploadInst = upload.render({
                elem: '#test1' //绑定元素
                , url: '/upload/' //上传接口
                , done: function (res) {
                    //上传完毕回调
                }
                , error: function () {
                    //请求异常回调
                }
            });
        });
        layui.use('table', function () {
            var table = layui.table;

            table.render({
                elem: '#test'
                , url: '../../statics/json/demo1.json'
                , cols: [[
                    {type: 'numbers'}
                    , {field: 'logins', title: '登入次数'}
                    , {field: 'joinTime', title: '加入时间'}
                    , {fixed: 'right', title: '操作', toolbar: '#barDemo'}
                ]]
            });

            //头工具栏事件
            table.on('toolbar(test)', function (obj) {
                var checkStatus = table.checkStatus(obj.config.id);
                switch (obj.event) {
                    case 'getCheckData':
                        var data = checkStatus.data;
                        layer.alert(JSON.stringify(data));
                        break;
                    case 'getCheckLength':
                        var data = checkStatus.data;
                        layer.msg('选中了：' + data.length + ' 个');
                        break;
                    case 'isAll':
                        layer.msg(checkStatus.isAll ? '全选' : '未全选');
                        break;
                }
                ;
            });

            //监听行工具事件
            table.on('tool(test)', function (obj) {
                var data = obj.data;
                if (obj.event === 'del') {
                    layer.confirm('真的删除行么', function (index) {
                        obj.del();
                        layer.close(index);
                    });
                } else if (obj.event === 'edit') {
                    layer.prompt({
                        formType: 2
                        , value: data.email
                    }, function (value, index) {
                        obj.update({
                            email: value
                        });
                        layer.close(index);
                    });
                }
            });
        });
    },

    tabBind: function () {
        //导出函数
        $(".layui-btn-green").on({
            'click': function () {
                return false
            }
        })
        //时间切换
        $(".searchBtn").on({
            'click': function () {
                var index = $(this).index();
                if ($(this).hasClass('active'))return false
                if (index == 1) {
                    $(".searchBtn").removeClass("active");
                    $(".searchBtn").eq(0).addClass("active");
                } else {
                    $(".searchBtn").removeClass("active");
                    $(".searchBtn").eq(1).addClass("active");
                }

                return false
            }
        })
    }
}
main.init();
//日历切换
function cDayFunc() {
    main.initTable()
}
function xhrOnProgress(fun) {
    xhrOnProgress.onprogress = fun;
    return function () {
        var xhr = $.ajaxSettings.xhr();
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }
        return xhr;
    }
}


function setFormData(data) {

    //$("#msg").text(data.msg);

    //赋值后,重新初始化
    layui.use(['form','layedit'], function(){
        var form = layui.form;
        layedit = layui.layedit;
        layedit.build('msg',{
            height: 300,
            disabled:"false"
        });
        $('input,select,textarea').attr("disabled","disabled");
        $("iframe[textarea='msg']").contents().find('body').attr("contenteditable",false);

        $(".layedit-tool-face").off();
        $(".layedit-tool-link").off();
        form.render();
    });


    $('input,select,textarea').attr("disabled","disabled");
    property.setForm($("#researchForm"),data);


}
