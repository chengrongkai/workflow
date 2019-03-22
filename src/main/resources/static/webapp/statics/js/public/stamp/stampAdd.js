/**
 * author: zhangwei
 * 集邮之家新增、编辑
 */
var pageType = "add";
var editIndex;
var main = {

    init: function() {
        pageType = localStorage.HomeType;

        if(pageType == 'edit') {
            $('#submit').text('保存');
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'detail'){
            this.id = localStorage.id;
            loadData(this.id);

        }else if(pageType == 'add'){
            //getSelectData(null);
        }

        this.initTable();
    },
    initTable: function() {


        layui.use(['form','layedit','upload'], function() {

            var form = layui.form,
                layedit = layui.layedit,
                upload = layui.upload;


            form.verify({
                'edit-required': function () {
                    layedit.sync(editIndex);
                    /*var json = $("#storyForm").serialize();
                    console.dir(json);*/
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
                    type:"post",
                    xhr:function () {
                    }
                }
            });
            //监听提交
            form.on('submit(formDemo)', function(data) {
                layedit.sync(editIndex);
                var url = "collecthome/saveCollectHome.do";
                if (pageType == "edit"){
                    url = "collecthome/updateCollectHome.do";
                }
                var json = $("#homeForm").serialize();
                console.dir(json);
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改集邮之家成功");
                            }else{
                                successMsg("添加集邮之家成功");
                            }
                            parent.$t.goback("page/public/stamp/list.html");
                        } else if (result.success == 0){
                            //top.layer.msg(result.error.message);
                            errorMsg("操作集邮之家数据异常");
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
                parent.$t.goback("page/public/stamp/list.html");
            })


            layui.use('laydate', function(){
                var laydate = layui.laydate;
                //执行一个laydate实例
                laydate.render({
                    elem: '#startDate' //指定元素
                });
            });

            $(".uploadBtn").click(function() {
                //最大只能上传10张图片
                var len =  $("#picUpload").find('img').length;
                if(len==10){
                    layer.msg("可上传图片数量已达最大限度",{icon:2});
                    return false;
                }
                var projectName = 'informationManager';
                uploadPicture(projectName);
            })


            //监听取消
            $("#cancel").click(function () {
                layer.confirm('确认取消吗?', function(index){
                    parent.$(".myRefresh").click();
                    layer.close(index);
                });
                return false;
            });


        });
    },

}
main.init();


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
/*function getSelectData(data){

    layui.use('form', function() {
        var form = layui.form;
        typeList = property.getDictData('stamp_story');
        if (data == null){
            var storyTypeSelect = component.getSelectPlus(typeList, null, 'storyType', 'dictCode', 'dictName');
            $("#storyType").html(storyTypeSelect);
        } else{
            var storyTypeSelect = component.getSelectPlus(typeList, data.storyType , 'storyType', 'dictCode', 'dictName');
            $("#storyType").html(storyTypeSelect);
        }

        form.render('select');

    });
}*/



/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {
    layui.use('layedit', function(){
        var  layedit = layui.layedit;
        layedit.setContent(editIndex, data.informationContent, false);
    });
    //$("#storyContent").text(data.storyContent);

    //getSelectData(data);
    property.setForm($("#homeForm"),data);
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
