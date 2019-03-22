var pageType = "detail";
var main={

    init:function () {

        pageType = localStorage.storyType;
        if(pageType == 'detail') {
            this.id = localStorage.id;
            loadData(this.id);
        }
    },



}
main.init();


/**
 * 加载表单数据
 * @param id  主题展id
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
            url:property.getProjectPath()+"stampstory/getStoryById.do",
            success:function(result) {
                if (result.success == 1) {
                    //console.dir(result)
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
function getSelectData(data){

    layui.use('form', function() {
        var form = layui.form;
        var dictData = property.getDictData('stamp_story');

        var storyTypeSelect = component.getSelectSimplePlus(dictData, data.storyType, 'storyType', 'dictCode', 'dictName');
        $("#storyType").append(storyTypeSelect);
        $("#storyType").attr("disabled","disabled");
        form.render('select');

    });

}




/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {

    $("#demo").text(data.storyContent);
    $("#storyType").val(data.storyType);
    //赋值后,重新初始化
 /*   layui.use('layedit', function(){
        var $ = layedit = layui.layedit;
        layedit.build('demo');
        getSelectData(data);
    });
*/

    //赋值后,重新初始化
    layui.use(['form','layedit'], function(){
        var form = layui.form;
        layedit = layui.layedit;
        layedit.build('storyContent',{
            height: 300,
            disabled:"false"
        });
        $('input,select,textarea').attr("disabled","disabled");
        $("iframe[textarea='storyContent']").contents().find('body').attr("contenteditable",false);

        $(".layedit-tool-face").off();
        $(".layedit-tool-link").off();
        getSelectData(data);
        form.render();
    });




    $('.uploadBtn').css('display','none');
    picList = data.picList;
    if (!isEmpty(picList)){
        for (var i = 0;i < picList.length;i++) {
            var picStr1;
            // 把div拼接写到html里面去  变量用{{}}表示  这样代码结构很清楚
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


    $('input,select,textarea').attr("disabled","disabled");
    property.setForm($("#storyForm"),data);


}



//日历切换
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

