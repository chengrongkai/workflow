var pageType = "detail";
var main={

    init:function () {

        pageType = localStorage.InfoType;
        if(pageType == 'detail') {
            this.id = localStorage.id;
            loadData(this.id);
        }
    },



}
main.init();


/**
 * 加载表单数据
 * @param id  资讯id
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
            url:property.getProjectPath()+"informationmanager/getInfoManagerById.do",
            success:function(result) {
                if (result.success == 1) {
                    setFormData(result.data);
                } else if (result.success == 0) {
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
function getSelectData(data){

    layui.use('form', function() {
        var form = layui.form;
        var dictData = property.getDictData('info_manager')

        var infoTypeSelect = component.getSelectSimplePlus(dictData, data.informationType, 'storyType', 'dictCode', 'dictName');
        $("#informationType").append(infoTypeSelect);
        $("#informationType").attr("disabled","disabled");
        form.render('select');


    });

}




/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {

    $("#informationContent").text(data.informationContent);
    //赋值后,重新初始化
    layui.use(['form','layedit'], function(){
        var form = layui.form;
        var layedit = layui.layedit;
        var editIndex = layedit.build('informationContent');
        // layedit.setContent(editIndex, data.informationContent, false);
        getSelectData(data);

      //创建一个编辑器
        $('.uploadBtn').css('display','none');
        picList = data.picList;
        if (!isEmpty(picList)){
            for (var i = 0;i < picList.length;i++) {
                var picStr1;
                if (picList[i].isMain === "1") {
                    picStr1 = '<div class="img" id="img'+ picList[i].attId +'">'
                        +'<div class="img1"><img src="'+ picList[i].attPath +'" alt="" ></div>'
                        +'<div class="img2"><span class="img3" id="span'+ picList[i].attId +'" mark='+ picList[i].attId +' style="color:red">主图</span><span class="img4" mark='+ picList[i].attId +'>删除图片</span></div>'
                        +'</div>'
                    $("#isMain").val(picList[i].attId);
                } else {
                    picStr1 = '<div class="img picDiv" id="img'+ picList[i].attId +'">'
                        +'<div class="img1"><img src="'+ picList[i].attPath +'" alt="" ></div>'
                        +'<div class="img2"><span class="img3" id="span'+ picList[i].attId +'" mark='+ picList[i].attId +'></span><span class="img4" mark='+ picList[i].attId +'></span></div>'
                        +'</div>'
                }
                $("#picUpload").html(picStr1);
                $('.img2').css('display','none');
                $(".showStatus").hide();
            }
        }

        property.setForm($("#infoForm"),data);
        $('input,select,textarea').attr("disabled","disabled");
        $("iframe[textarea='informationContent']").contents().find('body').attr("contenteditable",false);
        $(".layedit-tool-face").off();
        $(".layedit-tool-link").off();
        form.render();
    });





}



//日历切换
/*
function cDayFunc() {

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

*/
