var pageType = "detail";
var collectList = new Array();
var collectCols = [{type:"numbers",title: '序号', width:70, align:"center"},
    {field:'typeFullName', title: '藏品类型', width:200,align:'center',templet:"#mumeumImg"},
    {field: 'name', title: '藏品名称',  align:'center'},
    {field: 'msg', title: '藏品简介',  align:'center'}];
var main={

    init:function () {
        property.setUserInfoPlus('userName','orgName','nowDate');
        property.setUserInfoPlus('userName1','orgName1','nowDate1');
        pageType = localStorage.curatorType;
        if(pageType == 'detail') {
            this.id = localStorage.id;
            loadData(this.id);
        }
    },

}
main.init();




/**
 * 加载表单数据
 * @param id   公众策展id
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
            url:property.getProjectPath()+"curator/getCuratorById.do",
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
function setFormData(data) {

   /* var picList = data.picList;
    $("#picids").val(picList);
    for (var i = 0;i < picList.length;i++) {
        var picStr1;
        picStr1 = '<div class="img picDiv" id="img'+ picList[i].attId +'">'
            +'<div class="img1"><img src='+ picList[i].attPath +' alt="" ></div>'
            +'<div class="img2"><span class="img3" id="span'+ picList[i].attId +'" mark='+ picList[i].attId +'>更换图片</span><span class="img4" mark='+ picList[i].attId +'>删除图片</span></div>'
            +'</div>'

        //$(".picDiv").replaceWith(picStr1);
        $("#picUpload").html(picStr1);
        $(".img2").hide();
    }
    $(".uploadBtn").hide();*/
    var picList = data.picList;
    if(picList){
        $("#picids").val(data.picList);
        for (var i = 0;i < picList.length;i++) {
            var picStr1;
            picStr1 = '<div class="img picDiv" id="img'+ picList[i].attId +'">'
                +'<div class="img1"><img src="'+ picList[i].attPath +'" alt="" ></div>'
                +'<div class="img2"><span class="img3" id="span'+ picList[i].attId +'" mark='+ picList[i].attId +'>更换图片</span><span class="img4" mark='+ picList[i].attId +'>删除图片</span></div>'
                +'</div>'

            $(".picDiv1").replaceWith(picStr1);
        }
    }

    $(".uploadBtn").hide();




    collectList = data.collectDtoList;
    if(null != collectList && collectList.length>0){
        layui.use('table', function() {
            var table = layui.table;
            //渲染关联藏品信息列表
            table.render({
                elem: '#collectInfo',
                page: false,
                id: "collectInfoTable",
                cols: [collectCols],
                data: collectList
            });
        })
    }

    var result = data.processResult;
    if(result == 0){
        $('input:radio[name=processResult]')[1].checked = true;
    }else if(result == 1){
        $('input:radio[name=processResult]')[0].checked = true;
    }
    layui.use('form', function(){
        form = layui.form;
    });
    form.render('radio');

    $('input,select,textarea').attr("disabled","disabled");
    property.setForm($("#curatorForm"),data);
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

