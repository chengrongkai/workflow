var pageType = "detail";
var main = {

    init: function () {
        property.setUserInfo();
        pageType = localStorage.voType;
        if(pageType == 'detail') {
            this.id = localStorage.id;
            loadTable(this.id);
        }
        this.initTable();

    },
    initTable: function () {

        var id = parent.$t.getQueryStringFrame('id');

        layui.use('table', function () {
            var table = layui.table;
            table.render({
                elem: '#applyList'
                , url: property.getProjectPath() + "volunteer/getVolunteerApplyList.do"
                , method: 'post'
                , where: {
                    id: id
                }
                ,request:{
                    pageName: 'currentPage',
                    limitName: 'size'
                }
                ,title: '志愿者申请数据表'
                , cols: [[
                    {type:'numbers', title:'编号'}
                    , {field: 'applyName', title: '姓名'}
                    , {field: 'applyPhone', title: '电话'}
                    , {field: 'applyAge', title: '年龄'}
                    , {field: 'applyJob', title: '职业'}
                    , {field: 'applyReason', title: '申请原因'}
                ]]
                ,page: true
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

        });
    },

}
main.init();




/**
 * 加载表格数据
 */
function loadTable(id){
    layui.use('table', function(){
        var table = layui.table;

        var json = {"id":id};
        //加载数据
        $.ajax({
            type:"get",
            data:json,
            async:false,
            url:property.getProjectPath()+"volunteer/getActivitiesById.do",
            success:function(result) {
                if (result.success == 1) {
                    setFormData(result.data);
                } else if (result.success == 0){
                    //top.layer.msg(result.error.message);
                    errorMsg("系统异常");
                }
            },
            error:function(result) {
                errorMsg("系统异常");
            }
        });

    });
}




/**
 * 设置表单数据
 * @param data
 */
function setFormData(data){

    property.setForm($("#volForm"),data);


    var endTime = new Date(data.endTime);
    var today = new Date();
    $("#activitiesStatus").html((today.getTime() > endTime.getTime()) ? "已结束":"进行中");
    $("#cover").attr('src',data.coverUrl);
    $('input,select,textarea').attr("disabled","disabled");

    var endSignTime = $("#endSignTime").text();
    var startTime = $("#startTime").text();
    var endTime = $("#endTime").text();
    $("#endSignTime").text(formatDate(endSignTime));
    $("#startTime").text(formatDate(startTime));
    $("#endTime").text(formatDate(endTime));

}





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




