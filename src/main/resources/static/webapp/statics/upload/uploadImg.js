layui.use(['form','layer'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
    //设为主图
    $('.pad').on("click",".img3",function(){
        var mainText = $(this).text();
        var picId = $(this).attr("mark");
        var isMain = $("#isMain").val();
        if (isEmpty(isMain)) {
            $("#isMain").val(picId);
            $(this).text("主图");
            $(this).css("color","red");
        } else {
            if (mainText != "主图") {
                $(".img3").each(function() {
                    if ($(this).text() == "主图") {
                        $(this).text("设为主图");
                        $(this).css("color","rgba(87,89,98,1)");
                    }
                })
                $("#isMain").val(picId);
                $(this).text("主图");
                $(this).css("color","red");
            }
        }
    })
    //删除图片
    $('.pad').on("click",".img4",function(){
        var picId = $(this).attr("mark");
        var delpicids = $("#delpicids").val();
        delpicids += picId + ",";
        $("#delpicids").val(delpicids);
        var spanText = $('#span'+ picId).text();
        if(spanText == "主图") {
            $("#isMain").val("");
        }
        var picids = $("#picids").val();
        picids=picids.replace(picId + ",","");
        $("#picids").val(picids);
        $('#img'+ picId).remove();
    })

})

function uploadPicture(projectName,imgSize){
    // var content =  "../libs/cropHead.html";

    var content =  "../../../statics/libs/picture/cropHead.html";
    if (!isEmpty(imgSize)) {
      content = "../../../statics/libs/picture/cropHead1.html";
    }
    var indexUpload = layui.layer.open({
        title : "裁剪图片",
        type : 2,
        area: ['80%', '700px'],
        content : content,
        success : function(layero, indexUpload){
            localStorage.removeItem('map');
            var body = layui.layer.getChildFrame('body', indexUpload);
            body.find("#projectName").val(projectName);
            setTimeout(function(){
                layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
                    tips: 3
                });
            },500)
        },
        end :function() {
            var map = JSON.parse(localStorage["map"]);
            //插入图片
            var picStr = '<div class="img picDiv" id="img'+ map.id +'">'
                +'<div class="img1"><img src='+ map.absolutePath +' alt="" ></div>'
                +'<div class="img2"><span class="img3" id="span'+ map.id +'" mark='+ map.id +'>设为主图</span><span class="img4" mark='+ map.id +'>删除图片</span></div>'
                +'</div>'
            $(".uploadBtn").before(picStr);
            var picids = $("#picids").val();
            picids += map.id + ",";
            $("#picids").val(picids);
        }
    })
    layui.layer.full(indexUpload);
    window.sessionStorage.setItem("index",indexUpload);
    //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
/*    $(window).on("resize",function(){
        layui.layer.full(window.sessionStorage.getItem("index"));
    })*/
}

function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == "")	{
        return true;
    }else{
        return false;
    }
}