/**
 * author: zhangwei
 * 社教新增、编辑
 */
var pageType = "add";
var tableId = '';
var attCount = 0;
var main = {

    init: function() {
       /* this.id = parent.$t.getQueryStringFrame('id');
        this.type = this.id ? 'edit' : 'add';

        if(this.type == 'edit') {
            $('#submit').text('保存');
            this.getDetailData();
        }*/
        property.setUserInfo();
        pageType = localStorage.socialType;

        if(pageType == 'edit') {
            $('#submit').text('保存');
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'detail'){
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'add'){
            // this.id = localStorage.id;
            // loadData(this.id);

            tableId = property.getTimeJson();
            $("#attachment").val(tableId);
        } /*else{
            var data = {
                'holdTime': (new Date()).getTime()
            }
            setFormData(data);
        }*/
        this.initTable();
    },
    initTable: function() {
        layui.use('form', function() {
            var form = layui.form;


            form.verify({
                'socialName': function () {
                    if($("#socialName").val().length>32){
                        return  '文本数字过长';
                    }
                },
                'holdTime': function () {
                    if(!$("#startDate").val()){
                        return  '举办时间不能为空';
                    }
                }
            })


            //监听提交
            form.on('submit(formSubmit)', function(data) {
                var url = "postsocial/saveSocial.do";
                if (pageType == "edit"){
                    url = "postsocial/updateSocial.do";
                }
                if (attCount <= 0){
                    errorMsg("请上传附件");
                    return false;
                }
                var json = $("#socialForm").serialize();
                $.ajax({
                    type:"get",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改社教成功");
                            }else{
                                successMsg("添加社教成功");
                            }
                            parent.$t.goback("page/socialist/list.html");
                        } else if (result.success == 0){
                            //top.layer.msg(result.error.message);
                            errorMsg("操作社教数据异常");
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
                return false;
            });


            layui.use('laydate', function(){
                var laydate = layui.laydate;
                //执行一个laydate实例
                laydate.render({
                    elem: '#startDate' //指定元素
                    ,min: 0
                });
            });


            //监听取消
            $("#cancel").click(function () {
               parent.$(".myRefresh").click();

            });

            layui.use(['upload','element'], function(){
                var $ = layui.jquery
                    ,upload = layui.upload,element = layui.element;
                var demoListView = $('#demoList')
                    ,uploadListIns = upload.render({
                    elem: '#test10'
                    ,url: property.getProjectPath()+"attach/upload.do?tableName="+"post_video"+"&tableId="+tableId
                    ,accept: 'file'
                    ,multiple: true
                    ,auto: false
                    ,xhr:xhrOnProgress
                    ,progress:function(index,value){//上传进度回调 value进度值
                        var tr = demoListView.find('#upload-'+ index)
                            ,tds = tr.children();
                        tds.eq(1).html('<span style="color: red;">正在上传</span>');
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
                         /*   var tr=$(["<li>" +
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
                            "                                </li>"].join(''));*/
                            var tr=$(["<li>" +
                            "<div class='upLeft' id='upload-"+index+"'>" +
                            "<span class=\"fileName\">"+file.name+"</span>" +
                            "<span class=\"fileState\">准备上传</span>" +
                            "</div>" +
                            "<div class=\"upRight\">" +
                            "<div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"+index+"'>" +
                            "<div class=\"layui-progress-bar layui-progress-big layui-bg-blue\" lay-percent=\"30%\">" +
                            '<span class="layui-progress-text">'+'0%'+'</span>'+'</div>' +
                            "</div>" +
                            "<a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 layui-hide demo-reload\">重传</a>" +
                            "<a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 demo-cancel\">取消</a>" +
                            "</div>" +
                            "</li>"].join(''));
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
                            attCount ++;
                            var tr = demoListView.find('#upload-'+ index)
                                ,tds = tr.children();
                            tds.eq(1).html('<span style="color: #5FB878;">上传成功</span>');
                            //tds.eq(2).html(''); //清空操作
                            tr.siblings(".upRight").find(".demo-reload").remove();
                            tr.siblings(".upRight").find(".demo-cancel").addClass("demo-delete");
                            tr.siblings(".upRight").find(".demo-cancel").text("删除");
                            tr.siblings(".upRight").find(".demo-cancel").attr("data-id",res.data.id);
                            tr.siblings(".upRight").find(".demo-delete").removeClass("demo-cancel");

                            tr.siblings(".upRight").find(".layui-bg-blue").addClass("layui-bg-green");
                            tr.siblings(".upRight").find(".layui-bg-green").removeClass("layui-bg-blue");
                            //重新设置下拉框
                            attachmentsList = loadAttachments(tableId);
                            var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
                            $("#attachmentsList").empty();
                            $("#attachmentsList").append(attachmentsListSelect);
                            //form1.render('select');
                            form.render('select');
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
            //删除附件
            $('#demoList').on('click','.demo-delete',function(){
                attCount --;
                var attId = $(this).attr("data-id");
                // delete files[index]; //删除对应的文件
                $(this).parent().parent().remove();
                deleteAttachment(attId);
                attachmentsList = loadAttachments(tableId);
                var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
                $("#attachmentsList").empty();
                $("#attachmentsList").append(attachmentsListSelect);
                //form1.render('select');
                form.render('select');
                // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
            });
            //取消上传
            $('#demoList').on('click','.demo-cancel',function(){
                var attId = $(this).attr("data-id");
                // delete files[index]; //删除对应的文件
                $(this).parent().parent().remove();
                // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
            });
        });
    },
    getDetailData: function() {
        layui.use('form', function() {
            var form = layui.form;
            form.val("myform", {
                "title": "贤心"
                ,"name": "vvvvv"
                ,"city": "1"  // 下拉框初始赋值
                ,"desc": "我爱layui"
            });
        });
    }
}
main.init();


/**
 * 加载表单数据
 * @param id 社教id
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
            url:property.getProjectPath()+"postsocial/getSocialById.do",
            success:function(result) {
                if (result.success == 1) {
                    setFormData(result.data);
                    tableId = result.data.attachment;
                    attachmentsList = loadAttachments(tableId);
                    form.render();
                    if (null != attachmentsList){
                        $("#demoList").append(component.getAttachmentList(attachmentsList));
                    }
                } else if (result.success == 0){
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



/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {
    property.setForm($("#socialForm"),data);

    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#startDate' //指定元素
            ,value: formatSimpleDate(data.holdTime)
        });
    });
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

function loadAttachments(fkId) {
    var datas = null;
    var json = {"fkId":fkId};
    $.ajax({
        type:"get",
        data:json,
        async:false,
        url:property.getProjectPath()+"attach/getAttachmentsByFkId.do",
        success:function(result) {
            if (result.success == 1) {
                datas = result.data;
            } else if (result.success == 0){
                errorMsg(result.data);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });

    attCount = datas.length;
    return datas;
}




//删除附件
function deleteAttachment(attId) {
    var json = {"attId":attId};
    $.ajax({
        type:"post",
        data:json,
        async:false,
        url:property.getProjectPath()+"attach/deleteAttachment.do",
        success:function(result) {
            if (result.success == 1) {
                successMsg("删除成功");
                attachmentsList = loadAttachments(tableId);
                var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
                $("#attachmentsList").append(attachmentsListSelect);
                //form.render('select');
                //form1.render('select');
            } else if (result.success == 0){
                errorMsg(result.data);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}