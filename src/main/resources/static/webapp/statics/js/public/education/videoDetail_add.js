var pageType = "add";

var editIndex;

var main = {

    init: function () {
        this.initTable();
        this.tabBind();
    },
    initTable: function () {
        pageType = localStorage.userType;

        if (pageType == 'edit') {
            $('.uploadBtn').css('display','none');
            var picList = [];
            this.id = parent.$t.getQueryStringFrame('id');
            var datas = yc.ajaxGetByParams('education/getOneEducation.do', {id: this.id}, null, null);
            picList = datas.data.attachmentList;
            $("#picids").val(datas.data.picId);
            for (var i = 0;i < picList.length;i++) {
                var picStr1;
                if (picList[i].isMain === "1") {
                    picStr1 = '<div class="img" id="img'+ picList[i].attId +'">'
                        +'<div class="img1"><img src="'+ picList[i].attPath +'" alt="" ></div>'
                        +'<div class="img2"><span class="img3" type-isMain = ' + 1 + ' id="span'+ picList[i].attId +'" mark='+ picList[i].attId +' style="color:red">主图</span><span class="img4" mark='+ picList[i].attId +'>删除图片</span></div>'
                        +'</div>'
                    $("#isMain").val(picList[i].attId);
                } else {
                    picStr1 = '<div class="img picDiv" id="img'+ picList[i].attId +'">'
                        +'<div class="img1"><img src="'+ picList[i].attPath +'" alt="" ></div>'
                        +'<div class="img2"><span class="img3" type-isMain = ' + 0 + ' id="span'+ picList[i].attId +'" mark='+ picList[i].attId +'>更换主图</span><span class="img4" mark='+ picList[i].attId +'>删除图片</span></div>'
                        +'</div>'
                }
                $(".uploadBtn").before(picStr1);
                $(".showStatus").hide();
            }
            var success = datas.success || ''
            var success = datas.success || ''
            if (success == 1) {
                var data = datas.data;
                setFormData(data)
                // property.setForm($("#educationForm"), data);
            } else {
                errorMsg('查询详情错误，请联系管理员');
            }
        }

        layui.use(['form','layedit','upload'], function () {

            var layedit = layui.layedit;
            this.id = parent.$t.getQueryStringFrame('id');
            var that = this;
            var form = layui.form;


            form.verify({
                'img-required': function () {
                    var nodes = $('.picDiv');
                    if(!nodes[0].id) {
                        return '图片不能为空';
                    }
                },
                'edit-required': function () {
                    layedit.sync(editIndex);
                    if(!$("#msg").val()){
                        return  '文本内容不能为空';
                    }
                   /* if($("#msg").val().length > 2048) {
                        return  '文本长度超出限制';// 但是编辑器一般有配置的
                    }*/
                }
            })



            editIndex = layedit.build('msg',{
                height: 214,
                uploadImage: {
                    url: property.getProjectPath()+"/attach/uploadEditPic.do?projectName=educationManager",
                    type:"post"
                }
            });

            //监听提交
            form.on('submit(formDemo)', function (data) {
                layedit.sync(editIndex);
                // layer.msg(JSON.stringify(data.field));
                let datas = data.field;
                var url = 'education/addEducation.do';
                var msg = '新增成功';
                var arrays = $("#educationForm").serializeArray();

                /*datas.msg = arrays.filter(obj => obj.name === 'msg').map(obj => obj.value)[0];*/
                datas.msg = arrays.filter(function (obj) {
                    return obj.name === 'msg';
                }).map(function (obj) {
                    return obj.value;
                })[0];
                if (pageType == 'edit') {
                    datas.id = that.id;
                    url = 'education/updateEducation.do';
                    msg = '修改成功';
                } else {

                }
                var picId = $("#picids").val();
                if (picId == null) {
                    errorMsg("请选择上传的图片");
                    return;
                }
                datas.picId =  picId;
                var info = yc.ajaxPostByJson(url, datas, null, msg);
                if (info != null && info.success == 1) {
                    // goto 离开，goback 回到
                    parent.$t.goback("page/public/education/list.html");
                }
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
        });

        //取消
        $("button[type='reset']").click(function () {
            parent.$t.goback("page/public/education/list.html");
        })


        layui.use('layedit', function () {
            var layedit = layui.layedit;
            layedit.build('demo'); //建立编辑器
        });
        layui.use('upload', function () {
            var upload = layui.upload;
            // 执行实例
            var uploadInst = upload.render({
                elem: '#test1' //绑定元素
                // , url: '/upload/' //上传接口
                , url: property.getProjectPath() + 'attach/cutPicture.do'
                , done: function (res) {
                    //上传完毕回调
                }
                , error: function () {
                    //请求异常回调
                }
            });

        });
        layui.use('table', function () {
            var table = layui.table;

            table.render({
                elem: '#test'
                , url: '../../statics/json/demo1.json'
                , cols: [[
                    {type: 'numbers'}
                    , {field: 'logins', title: '登入次数'}
                    , {field: 'joinTime', title: '加入时间'}
                    , {title: '操作', toolbar: '#barDemo'}
                ]]
            });

            //头工具栏事件
            table.on('toolbar(test)', function (obj) {
                var checkStatus = table.checkStatus(obj.config.id);
                switch (obj.event) {
                    case 'getCheckData':
                        var data = checkStatus.data;
                        layer.alert(JSON.stringify(data));
                        break;
                    case 'getCheckLength':
                        var data = checkStatus.data;
                        layer.msg('选中了：' + data.length + ' 个');
                        break;
                    case 'isAll':
                        layer.msg(checkStatus.isAll ? '全选' : '未全选');
                        break;
                }
                ;
            });

            //监听行工具事件
            table.on('tool(test)', function (obj) {
                var data = obj.data;
                if (obj.event === 'del') {
                    layer.confirm('真的删除行么', function (index) {
                        obj.del();
                        layer.close(index);
                    });
                } else if (obj.event === 'edit') {
                    layer.prompt({
                        formType: 2
                        , value: data.email
                    }, function (value, index) {
                        obj.update({
                            email: value
                        });
                        layer.close(index);
                    });
                }
            });
        });
    },

    tabBind: function () {
        //导出函数
        $(".layui-btn-green").on({
            'click': function () {
                return false
            }
        })
        //时间切换
        $(".searchBtn").on({
            'click': function () {
                var index = $(this).index();
                if ($(this).hasClass('active'))return false
                if (index == 1) {
                    $(".searchBtn").removeClass("active");
                    $(".searchBtn").eq(0).addClass("active");
                } else {
                    $(".searchBtn").removeClass("active");
                    $(".searchBtn").eq(1).addClass("active");
                }

                return false
            }
        })
    }
}
main.init();
//日历切换
function cDayFunc() {
    main.initTable()
}
function xhrOnProgress(fun) {
    xhrOnProgress.onprogress = fun;
    return function () {
        var xhr = $.ajaxSettings.xhr();
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }
        return xhr;
    }
}

// $(".uploadBtn").click(function() {
//     //最大只能上传10张图片
//     var len =  $("#picUpload").find('img').length;
//     if(len==10){
//         layer.msg("可上传图片数量已达最大限度",{icon:2});
//         return false;
//     }
//     var projectName = 'collectionManager';
//     uploadPicture(projectName,"1");
// })

function setFormData(data) {
    $("#msg").text(data.msg);
    //赋值后,重新初始化
    layui.use('layedit', function(){
        var $ = layedit = layui.layedit;
        layedit.build('msg');
    });
    property.setForm($("#educationForm"),data);
}

uploadImgNoCut('collectionManager','uploadBtn','picids');

