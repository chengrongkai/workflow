/**
 * author: zhangwei
 * 邮政故事新增、编辑
 */
var pageType = "add";
var editIndex;
var main = {

    init: function() {

        pageType = localStorage.storyType;

        if(pageType == 'edit') {
            $('#submit').text('保存');
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'detail'){
            this.id = localStorage.id;
            loadData(this.id);

        }else if(pageType == 'add'){
            getSelectData(null);
            // this.id = localStorage.id;
            // loadData(this.id);
        }

        this.initTable();
    },
    initTable: function() {


        layui.use(['form','layedit','upload'], function() {



            var form = layui.form,
            layedit = layui.layedit,
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
                    /*var json = $("#storyForm").serialize();
                    console.dir(json);*/
                     if(!$("#storyContent").val()){
                         return  '文本内容不能为空';
                    }
                }
            })

            //创建一个编辑器
             editIndex = layedit.build('storyContent',{
                height: 300,
                uploadImage: {
                    url: property.getProjectPath() + "/attach/uploadEditPic.do?projectName=informationEditPic",
                    type: "post",
                }
            });
            //监听提交
            form.on('submit(formDemo)', function(data) {
                layedit.sync(editIndex);
                var url = "stampstory/saveStampStory.do";
                if (pageType == "edit"){
                    url = "stampstory/updateStampStory.do";
                }
                var json = $("#storyForm").serialize();
                console.dir(json);
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改邮政故事成功");
                            }else{
                                successMsg("添加邮政故事成功");
                            }
                            parent.$t.goback("page/public/story/list.html");
                        } else if (result.success == 0){
                            //top.layer.msg(result.error.message);
                            errorMsg("操作邮政故事数据异常");
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



            //取消
            $("button[type='reset']").click(function () {
                parent.$t.goback("page/public/story/list.html");
            })

           /* //监听取消
            $("#cancel").click(function () {
                layer.confirm('确认取消吗?', function(index){
                    parent.$(".myRefresh").click();
                    layer.close(index);
                });
                return false;
            });*/


        });





    },

}
main.init();


/**
 * 加载表单数据
 * @param id  邮政id
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
                    getSelectData(result.data);
                    setFormData(result.data);
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



//获取页面下拉数据
function getSelectData(data){

    layui.use('form', function() {
        var form = layui.form;
        typeList = property.getDictData('stamp_story');
        if (data == null){
            var storyTypeSelect = component.getSelectSimplePlus(typeList, null, 'storyType', 'dictCode', 'dictName');
            $("#storyType").append(storyTypeSelect);
        } else{
            var storyTypeSelect = component.getSelectSimplePlus(typeList, data.storyType , 'storyType', 'dictCode', 'dictName');
            $("#storyType").append(storyTypeSelect);
        }

        form.render('select');

    });
}



/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {
    layui.use('layedit', function(){
        var  layedit = layui.layedit;
        layedit.setContent(editIndex, data.storyContent, false);
    });
    //$("#storyContent").text(data.storyContent);

        getSelectData(data);
        console.dir(data)
        var picList = data.picList;
        if(!isEmpty(picList)){
            $("#picids").val(data.datumIds);
            for (var i = 0;i < picList.length;i++) {
                var picStr1;
                picStr1 = '<div class="img picDiv" id="img'+ picList[i].attId +'">'
                    +'<div class="img1"><img src='+ picList[i].attPath +' alt="" ></div>'
                    +'<div class="img2"><span class="img3" id="span'+ picList[i].attId +'" mark='+ picList[i].attId +'>更换图片</span><span class="img4" mark='+ picList[i].attId +'>删除图片</span></div>'
                    +'</div>'

                $(".picDiv").replaceWith(picStr1);
            }
            $(".uploadBtn").hide();
        }

        property.setForm($("#storyForm"),data);
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
