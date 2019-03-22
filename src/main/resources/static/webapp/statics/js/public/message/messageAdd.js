/**
 * author: zhangwei
 * 资讯管理新增、编辑
 */
var pageType = "add";
var editIndex;
var main = {

    init: function() {

        pageType = localStorage.InfoType;

        if(pageType == 'edit') {
            $('#submit').text('保存');
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'detail'){
            this.id = localStorage.id;
            loadData(this.id);

        }else if(pageType == 'add'){
            getSelectData(null);
            /*this.id = localStorage.id;
            loadData(this.id);*/
        }

        this.initTable();
    },
    initTable: function() {

        layui.use(['form','layedit','upload'], function() {

            var form = layui.form;
            layedit = layui.layedit;
            upload = layui.upload;



            form.verify({
                'img-required': function () {
                    var nodes = $('.picDiv');
                    if(!nodes[0].id) {
                        return '图片不能为空';
                    }
                },
                'edit-required': function () {
                    layedit.sync(editIndex);
                    if(!$("#informationContent").val()){
                        return  '文本内容不能为空';
                    }
                }
            })



            //创建一个编辑器
             editIndex = layedit.build('informationContent',{
                height: 214,
                uploadImage: {
                    url: property.getProjectPath()+"/attach/uploadEditPic.do?projectName=informationEditPic",
                    type:"post"
                }
            });
            //监听提交
            form.on('submit(formDemo)', function(data) {
                layedit.sync(editIndex);
                var url = "informationmanager/saveInfoManager.do";
                if (pageType == "edit"){
                    url = "informationmanager/updateInfoManager.do";
                }
                var json = $("#infoForm").serialize();
                console.dir(json);
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改资讯管理成功");
                            }else{
                                successMsg("添加资讯管理成功");
                            }
                            parent.$t.goback("page/public/message/list.html");
                        } else if (result.success == 0){
                            //top.layer.msg(result.error.message);
                            errorMsg("操作资讯管理数据异常");
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
                return false;
            });


            //更换图片
            $('.picture').on("click",".img3",function(){
                $('.uploadBtn').click();

            })
            //删除图片
            $('.picture').on("click",".img4",function(){

                $("#picids").val("");
                $(".picDiv").remove();
                $(".uploadBtn").before("<div class='picDiv'></div>");
                $(".uploadBtn").show();
            })


            //取消
            $("button[type='reset']").click(function () {
                parent.$t.goback("page/public/message/list.html");
            })


            layui.use('laydate', function(){
                var laydate = layui.laydate;
                //执行一个laydate实例
                laydate.render({
                    elem: '#startDate' //指定元素
                });
            });


            // $(".uploadBtn").click(function() {
            //     //最大只能上传10张图片
            //     var len =  $("#picUpload").find('img').length;
            //     if(len==10){
            //         layer.msg("可上传图片数量已达最大限度",{icon:2});
            //         return false;
            //     }
            //     var projectName = 'informationManager';
            //     uploadPicture(projectName);
            // })



            //监听取消
            $("#cancel").click(function () {
                layer.confirm('确认取消吗?', function(index){
                    parent.$(".myRefresh").click();
                    layer.close(index);
                });
                return false;
            });

            layui.use(['upload','element'], function(){
                var $ = layui.jquery
                    ,upload = layui.upload,element = layui.element;
                var demoListView = $('#demoList')
                    ,uploadListIns = upload.render({
                    elem: '#test10'
                    ,url: '/statics/upload'
                    ,accept: 'file'
                    ,multiple: true
                    ,auto: false
                   ,xhr:xhrOnProgress
                    ,progress:function(index,value){//上传进度回调 value进度值
                        element.progress('progressBar'+index, value+'%')//设置页面进度条
                    }
                    ,bindAction: '#testListAction'
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
                                "<div class=\"upLeft\">\n" +
                                "    <span class=\"fileName\">"+file.name+"</span>" +
                                "    <span class=\"fileState\">准备上传</span>" +
                                "</div>" +
                                "<div class=\"upRight\">" +
                                "    <div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"+index+"'>" +
                                "        <div class=\"layui-progress-bar layui-bg-red\" lay-percent=\"30%\"></div>" +
                                "    </div>" +
                                "    <span class=\"layui-col-md2 layui-col-sm2\">0%</span>" +
                                "    <a href=\"javascript:void (0);\" class=\"layui-col-md1 layui-col-sm1 demo-reload\">重传</a>" +
                                "    <a href=\"javascript:void (0);\" class=\"layui-col-md1 layui-col-sm1 demo-delete\">取消</a>" +
                                "</div>" +
                             "</li>"].join(''));
                            //单个重传
                            tr.find('.demo-reload').on('click', function(){
                                obj.upload(index, file);
                            });
    
                            //删除
                            tr.find('.demo-delete').on('click', function(){
                                delete files[index]; //删除对应的文件
                                tr.remove();
                                uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                            });
    
                            demoListView.append(tr);
                        });
                    }
                    ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                        layer.load(); //上传loading
                    }
                    ,done: function(res, index, upload){
                        if(res.code == 0){ //上传成功
                            var tr = demoListView.find('tr#upload-'+ index)
                                ,tds = tr.children();
                            tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                            tds.eq(3).html(''); //清空操作
                            return delete this.files[index]; //删除文件队列已经上传成功的文件
                        }
                        this.error(index, upload);
                    }
                    ,error: function(index, upload){
                        var tr = demoListView.find('tr#upload-'+ index)
                            ,tds = tr.children();
                        tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                        tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
                    }
                });
    
            });
        });
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
                    getSelectData(result.data);
                    setFormData(result.data);
                } else if (result.success == 0) {
                    //top.layer.msg(result.error.message);
                    errorMsg("操作数据异常");
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
        var dictData = property.getDictData('info_manager');
        if(data == null){
            var infoTypeSelect = component.getSelectSimplePlus(dictData, null, 'informationType', 'dictCode', 'dictName');
            //  先清空在append
            $("#informationType").children('option').remove(); //清除子元素
            $("#informationType").append(infoTypeSelect);
        }else{
            var infoTypeSelect = component.getSelectSimplePlus(dictData, data.informationType, 'informationType', 'dictCode', 'dictName');
            $("#informationType").children('option').remove();
            $("#informationType").append(infoTypeSelect);
        }
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
    layui.use('layedit', function(){
        var $ = layedit = layui.layedit;
        layedit.build('informationContent');
        //getSelectData(data);
    });


    var picList = data.picList;
    $("#picids").val(picList);
    if(!isEmpty(picList)){
        $("#picids").val(data.datumIds);
        for (var i = 0;i < picList.length;i++) {
            var picStr1;
            picStr1 = '<div class="img picDiv" id="img'+ picList[i].attId +'">'
                +'<div class="img1"><img src="'+ picList[i].attPath +'" alt="" ></div>'
                +'<div class="img2"><span class="img3" id="span'+ picList[i].attId +'" mark='+ picList[i].attId +'>更换图片</span><span class="img4" mark='+ picList[i].attId +'>删除图片</span></div>'
                +'</div>'

            $(".picDiv").replaceWith(picStr1);
        }
        $(".uploadBtn").hide();
    }


    property.setForm($("#infoForm"),data);


}




function xhrOnProgress(fun) {
    xhrOnProgress.onprogress = fun;
    return function() {
        var xhr = $.ajaxSettings.xhr();
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }                
        return xhr;
    }     
}

uploadImgNoCut('informationManager','uploadBtn','picids');