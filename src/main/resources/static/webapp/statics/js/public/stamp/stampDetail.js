var main={

    init:function () {


        pageType = localStorage.HomeType;
        if(pageType == 'detail') {
            this.id = localStorage.id;
            loadData(this.id);
        }
    },



}
main.init();


/**
 * 加载表单数据
 * @param id  集邮之家id
 */
function loadData(id) {
    this.type = "edit";
    layui.use('form', function(){
        var form = layui.form;
        var index = parent.layer.getFrameIndex(window.name);
        var json = {"id":id};
        //加载数据
        $.ajax({
            type:"get",
            data:json,
            async:false,
            url:property.getProjectPath()+"collecthome/getHomeById.do",
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



//获取页面下拉数据
/*
function getSelectData(data){

    layui.use('form', function() {
        var form = layui.form;
        var dictData = property.getDictData('stamp_story')

        var storyTypeSelect = component.getSelectPlus(dictData, data.storyType, 'storyType', 'dictCode', 'dictName');
        $("#storyType").html(storyTypeSelect);
        $("#storyType").attr("disabled","disabled");
        form.render('select');

    });

}
*/




/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {

    $("#informationContent").text(data.informationContent);
    //赋值后,重新初始化
    layui.use(['form','layedit'], function(){
        var form = layui.form;
        layedit = layui.layedit;
        layedit.build('informationContent',{
            disabled:"false"
        });
        $('input,select,textarea').attr("disabled","disabled");
        $("iframe[textarea='informationContent']").contents().find('body').attr("contenteditable",false);

        $(".layedit-tool-face").off();
        $(".layedit-tool-link").off();
        form.render();
    });
    property.setForm($("#homeForm"),data);



}




//日历切换
function cDayFunc() {
    main.initTable()
}
function xhrOnProgress(fun) {
    xhrOnProgress.onprogress = fun;
    return function() {
        var xhr = $.ajaxSettings.xhr();
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }                return xhr;
    }     }

