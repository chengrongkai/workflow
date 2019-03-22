layui.use(['form','layer'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
    //更换图片
    $('.pad').on("click",".img3",function(){
      $('.uploadBtn').click();

    })
    //删除图片
    $('.pad').on("click",".img4",function(){

        $("#picids").val("");
        $(".picDiv").remove();
        $(".uploadBtn").before("<div class='picDiv'></div>");
        $(".uploadBtn").show();
    })

})
//上传单图片
function uploadPicture(projectName){
    var indexUpload = layui.layer.open({
        title : "裁剪图片",
        type : 2,
        area: ['80%', '700px'],
        content : "../../../statics/libs/picture/cropHead.html",
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
            // console.log(map);
            //插入图片
            var picStr = '<div class="img picDiv" id="img'+ map.id +'">'
                +'<div class="img1"><img src='+ map.absolutePath +' alt="" ></div>'
                +'<div class="img2"><span class="img3" id="span'+ map.id +'" mark='+ map.id +'>更换图片</span><span class="img4" mark='+ map.id +'>删除图片</span></div>'
                +'</div>'
            if($('.picDiv').length > 0) {
                $('.picDiv').remove();
            }
            $(".uploadBtn").before(picStr);
            var picids = map.id;
            $("#picids").val(picids);
            $(".uploadBtn").hide();
        }
    })
    layui.layer.full(indexUpload);
    window.sessionStorage.setItem("index",indexUpload);
    //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
    // $(window).on("resize",function(){
    //     layui.layer.full(window.sessionStorage.getItem("index"));
    // })
}

function uploadImgNoCut(projectName,picUpload,tableId) {
    var fileId = '';
    if ($("#tableId").val() == null || $("#tableId").val() == ''){
        fileId = property.getTimeJson();
    }
    layui.use(['upload','element'], function(){
        var $ = layui.jquery
            ,upload = layui.upload,element = layui.element;
        var demoListView = $('#demoList')
            ,uploadListIns = upload.render({
            elem: '#'+picUpload
            ,url: property.getProjectPath()+"attach/upload.do?tableName="+projectName+"&tableId="+fileId
            ,accept: 'file'
            ,multiple: true
            ,auto: true
            ,xhr:xhrOnProgress
            ,progress:function(index,value){//上传进度回调 value进度值
                var tr = demoListView.find('#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(1).html('<span style="color: red;">正在上传</span>');
                element.progress('progressBar'+index, value+'%')//设置页面进度条
            }
            ,choose: function(obj){
                var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                //读取本地文件
                obj.preview(function(index, file, result){
                    /* var tr = $(['<tr id="upload-'+ index +'">'
                     ,'<td>'+ file.name +'</td>'
                     ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                     ,'<td>等待上传</td>'
                     ,'<td>'
                     ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                     ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                     ,'</td>'
                     ,'</tr>'].join(''));*/
                    var tr=$(["<li>" +
                    "                                    <div class='upLeft' id='upload-"+index+"'>" +
                    "                                        <span class=\"fileName\">"+file.name+"</span>" +
                    "                                        <span class=\"fileState\">准备上传</span>" +
                    "                                    </div>" +
                    "                                    <div class=\"upRight\">" +
                    "                                        <div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"+index+"'>" +
                    "                                            <div class=\"layui-progress-bar layui-progress-big layui-bg-blue\" lay-percent=\"30%\">" +
                    '<span class="layui-progress-text">'+'0%'+'</span>'+'</div>' +
                    "                                        </div>" +
                    "                                        <a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 layui-hide demo-reload\">重传</a>" +
                    "                                        <a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 demo-cancel\">取消</a>" +
                    "                                    </div>" +
                    "                                </li>"].join(''));
                    //单个重传
                    tr.find('.demo-reload').on('click', function(){
                        obj.upload(index, file);
                    });
                    demoListView.append(tr);
                    //删除

                });
            }
            ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                //layer.load(); //上传loading
            }
            ,done: function(res, index, upload){
                if(res.code == 1){ //上传成功
                    var attId = res.data.id;
                    var path = res.data.absolutePath;
                    debugger;
                    $("#"+tableId).val(attId);
                    var picStr = '<div class="img picDiv" id="img'+ attId +'">'
                        +'<div class="img1"><img src='+ path +' alt="" ></div>'
                        +'<div class="img2"><span class="img3" id="span'+ attId +'" mark='+ attId +'>更换图片</span><span class="img4" mark='+ attId +'>删除图片</span></div>'
                        +'</div>'
                    if($('.picDiv').length > 0) {
                        $('.picDiv').remove();
                    }
                    $(".uploadBtn").before(picStr);
                    $(".uploadBtn").hide();

                    return delete this.files[index]; //删除文件队列已经上传成功的文件
                }else {
                    var tr = demoListView.find('#upload-'+ index)
                        ,tds = tr.children();
                    tds.eq(1).html('<span style="color: #5FB878;">'+res.msg+'</span>');
                    //tds.eq(2).html(''); //清空操作
                    //tr.siblings(".upRight").find(".demo-reload").remove();
                    //tr.siblings(".upRight").find(".demo-delete").remove();
                    // return delete this.files[index]; //删除文件队列已经上传成功的文件
                }
                this.error(index, upload);
            }
            ,error: function(index, upload){
                var tr = demoListView.find('#upload-'+ index)
                //     ,tds = tr.children();
                // tds.eq(1).html('<span style="color: #FF5722;">上传失败</span>');
                tr.siblings(".upRight").find('.demo-reload').removeClass('layui-hide'); //显示重传
                tr.siblings(".upRight").find(".layui-bg-blue").addClass("layui-bg-red");
                tr.siblings(".upRight").find(".layui-bg-red").removeClass("layui-bg-blue");
            }
        });

    });
}

function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == "")	{
        return true;
    }else{
        return false;
    }
}