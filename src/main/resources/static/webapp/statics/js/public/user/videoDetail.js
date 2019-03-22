var pageType = "detail";
var main={
    init:function () {

        pageType = localStorage.pubUserType;
        if(pageType == 'detail') {
            this.id = localStorage.id;
            loadData(this.id);
        }
    },



}
main.init();




/**
 * 加载表单数据
 * @param id  公众用户id
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
            url:property.getProjectPath()+"pubUser/getOnePubUser.do",
            success:function(result) {
                if (result.success == 1) {
                    setFormData(result.data);
                } else if (result.success == 0){
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
    $("#singleName").text(data.singleName);

    //赋值后,重新初始化
    /*layui.use(['form','layedit'], function(){
        var form = layui.form;
        layedit = layui.layedit;
        layedit.build('singleName',{
            height: 300,
            disabled:"false"
        });
        $('input,select,textarea').attr("disabled","disabled");
        $("iframe[textarea='singleName']").contents().find('body').attr("contenteditable",false);

        $(".layedit-tool-face").off();
        $(".layedit-tool-link").off();

    });
*/




    var picList = data.picList;
    //$(".picUpload").val(picList);
    if (!isEmpty(picList)){
        for (var i = 0;i < picList.length;i++) {
            var picStr1;
            picStr1 = '<div class="img picDiv"  style="margin-top: 30px" id="img'+ picList[i].attId +'">'
                +'<div class="img1"><img src="'+ picList[i].attPath +'" alt=""  style="border-radius:50px;"></div>'+'<p' +
                ' class="myfont"' +
                ' id="nickName1"></p>'+'</div>';
            $("#picUpload").append(picStr1);
        }
    }



    $("#nickName1").html(data.nickName);
    property.setForm($("#pubUserForm"),data);
    $("#birthday").text(data.birthdayStr);
    $("#sex").html(data.sex == '1' ? "男":"女");
    $("#cityId").html(data.city);

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

