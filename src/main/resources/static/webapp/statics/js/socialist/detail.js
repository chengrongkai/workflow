/**
 * author: zhangwei
 * 社教管理详情
 */
var pageType = "detail";
var main = {

    init: function() {
        property.setUserInfo();
        // this.id = parent.$t.getQueryStringFrame('id');
        pageType = localStorage.socialType;
        if(pageType == 'detail') {
            this.id = localStorage.id;
            loadData(this.id);
        }

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

        // 资料图片列表渲染
        layui.use('laytpl', function(){
            var laytpl = layui.laytpl;

            var data = { //数据
                "list":[
                    {"modname": "开心的托马斯1"},
                    {"modname": "开心的托马斯2"},
                    {"modname": "开心的托马斯2"},
                    {"modname": "开心的托马斯2"},
                    {"modname": "开心的托马斯2"},
                    {"modname": "开心的托马斯2"},
                    {"modname": "开心的托马斯2"}
                ]
            };
            var getTpl = imgList.innerHTML,
                view = document.getElementById('view');
            laytpl(getTpl).render(data, function(html){
                view.innerHTML = html;
            });
            
        });
    },
    tabBind:function () {
        $(".imgList li").on({
            'click':function () {
                if($(this).attr("data-type")=="img"){
                    parent.layer.open({
                        type: 1,
                        title:false,
                        closeBtn: 0, //不显示关闭按钮
                        //area: ['420px', '240px'], //宽高
                        shadeClose: true, //开启遮罩关闭
                        content: "<div style='position: relative;height: 450px'><img style='max-width:" +
                        " 600px;position:" +
                        " absolute;max-height:100%;margin: auto;left: 0;right: 0;top:0;bottom:0'" +
                        " src='"+$(this).find("img").attr("src")+"'/></div> "
                      /*  content: "<img src='"+$(this).find("img").attr("src")+"'/> "*/
                    })
                }else if($(this).attr("data-type")=="video"){
                    parent.layer.open({
                        type: 1,
                        title:false,
                        closeBtn: 0, //不显示关闭按钮
                        shadeClose: true, //开启遮罩关闭
                        content: "<video src='"+$(this).find("img").attr("src")+ "' controls='controls' width='400px' height='220px'>" +
                        "您的浏览器不支持 video 标签。" +
                        "'</video> "
                    })
                }else{
                    parent.layer.open({
                        type: 1,
                        title:false,
                        closeBtn: 0, //不显示关闭按钮
                        shadeClose: true, //开启遮罩关闭
                        content: "<audio src='"+$(this).find("img").attr("src")+"' controls='controls'>" +
                        "</audio> "
                    })
                }
            }
        })
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
                    console.dir(result)
                    setFormData(result.data);
                    attachmentsList = loadAttachments(result.data.attachment);
                    form.render();
                    //显示附件
                    if (null != attachmentsList){
                        var attList = '';
                        for (var i=0;i<attachmentsList.length;i++){
                            var attachment = attachmentsList[i];
                            var type = 'img'
                            if (attachment.attFileType == 1){
                                type = 'img';
                            }else if (attachment.attFileType == 2){
                                type = 'video';
                            }else if (attachment.attFileType == 3){
                                type = 'audio'
                            }
                            var liStr = "<li class=\"imgItem\" data-type="+type+">\n" +
                                "                                <img src='"+attachment.attPath+"' alt=''>\n" +
                                "                                <p class='myfont'>"+attachment.attName+"</p>\n" +

                                "                            </li>";
                            attList = attList+liStr;

                        }
                        $(".imgList").append(attList);
                        main.tabBind();
                    }
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
    return datas;
}






