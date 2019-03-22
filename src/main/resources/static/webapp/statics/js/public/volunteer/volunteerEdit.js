var pageType = "add";
var main = {

    init: function () {
        property.setUserInfo();
        pageType = localStorage.voType;
        if(pageType == 'edit'){
            $('#submit').text('保存');
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'detail'){
            this.id = localStorage.id;
            loadData(this.id);

        }else if(pageType == 'add'){

        }



        this.initTable();
        this.tabBind();
    },
    initTable: function () {
        // 添加
        $('#btnAdd').click(function() {
            // localStorage.clear();
            localStorage.removeItem('id');
            localStorage.curatorType = 'add';
            parent.$t.goToPage(this, "page/public/volunteer/list.html");
        })

        var selectType = null;
        var selectSonType = null;
        pageType = localStorage.userType;

            //$('.uploadBtn').css('display','none');
            var picList = [];
            this.id = parent.$t.getQueryStringFrame('id');
            var data = yc.ajaxGetByParams('volunteer/getActivitiesById', {id: this.id}, null, null);
            $("#picids").val(data.data.coverUrl);



       /* var picList = data.picList;
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
            //$(".uploadBtn").hide();
        }*/


          /*  var picStr1;
            picStr1 = '<div class="img" id="uploadedImg">'
                +'<div class="img1"><img src='+ data.data.coverUrl +' alt="" ></div>'
                +'<div class="img2"><span class="img3" id="span'+ picList[i].attId +'" mark='+ picList[i].attId +'>更换图片</span><span class="img4" mark='+ datas.data.coverId +'>删除图片</span></div>'
                +'</div>';
            $("#picids").val(data.data.coverId);

            $(".uploadBtn").before(picStr1);
            $(".showStatus").hide();*/

            var success = data.success || '';
            if (success == 1) {
                data.data.startTime = formatDate(data.data.startTime);
                data.data.endTime = formatDate(data.data.endTime);
                data.data.endSignTime = formatDate(data.data.endSignTime);
                property.setForm($($(".myTable")[0]), data.data);
            } else {
                errorMsg('页面加载错误，请联系管理员');
            }



        //日历切换
        layui.use('laydate', function(){
            var laydate = layui.laydate;

            //执行一个laydate实例
            laydate.render({
                elem: '#startTime' //指定元素
                ,type: 'datetime'
            });
            laydate.render({
                elem: '#endTime' //指定元素
                ,type: 'datetime'
            });
            laydate.render({
                elem: '#endSignTime' //指定元素
                ,type: 'datetime'
            });
        });

        layui.use('form', function () {
            var form = layui.form;


            form.verify({
                needNumber: function(value, item){ //value：表单的值、item：表单的DOM对象
                    var re = /^[0-9]+$/ ;
                    if (!re.test(value) || re <= 1) {
                        return "只能输入正整数";
                    }
                }/*,
                'img-required': function () {
                    var nodes = $('.picDiv');
                    if(!nodes[0].id) {
                        return '图片不能为空';
                    }
                }*/
            });

            //监听提交
            form.on('submit(formDemo)', function (data) {
                this.id = parent.$t.getQueryStringFrame('id');
                var url = 'volunteer/updateActivities';
                var msg = '修改成功';
                // var type = $("#typeId option:selected").text() || '';
                // var sonType = $("#sonTypeId option:selected").text() || '';
                var collect = data.field || {};
                if (!yc.isNull(this.id )) {
                    collect.id = this.id;
                }
                var picId = $('#picids').val();
                if (null == picId || picId == '') {
                    layer.msg('请上传封面图片', {icon: 5, anim: 6});
                    return false;
                }
                collect.coverId = picId;
                // collect.type = type;
                // collect.sonType = sonType;
                var datas = yc.ajaxPostByJson(url, collect, null, msg);
                if (datas != null && datas.success == 1) {
                    parent.$t.goback("page/public/volunteer/list.html");
                } else {
                    errorMsg('操作失败，请联系管理员')
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

        layui.use('table', function () {
            var table = layui.table;
            table.render({
                elem: '#test'
                , url: '../../../statics/json/demo1.json'
                , cols: [[
                    {type: 'numbers'}
                    , {field: 'logins', title: '登入次数'}
                    , {field: 'joinTime', title: '加入时间'}
                    , {fixed: 'right', title: '操作', toolbar: '#barDemo'}
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

        });
    },

    tabBind: function () {
        //导出函数
        $(".layui-btn-green").on({
            'click': function () {
                return false
            }
        })
        //取消
        $("button[type='reset']").click(function () {
            parent.$t.goback("page/public/volunteer/list.html");
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
            url:property.getProjectPath()+"volunteer/getActivitiesById.do",
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






main.init();



/**
 * 设置表单数据
 * @param data
 */
function setFormData(data){
    var picList = data.coverId;
    if(!isEmpty(picList)){
        $("#picids").val(data.coverId);

            var picStr1;
            picStr1 = '<div class="img picDiv" id="img'+ picList +'">'
                +'<div class="img1"><img src='+ data.coverUrl +' alt="" ></div>'
                +'<div class="img2"><span class="img3" id="span'+ picList +'" mark='+ picList +'>更换图片</span><span class="img4" mark='+ picList +'>删除图片</span></div>'
                +'</div>'

            $(".picDiv").html(picStr1);
            $(".uploadBtn").hide();






    }

    property.setForm($("#volForm"),data);
    $("#startTime").val(formatDate(data.startTime));
    $("#endTime").val(formatDate(data.endTime));
    $("#endSignTime").val(formatDate(data.endSignTime));
}


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

$(".uploadBtn").click(function() {
    //最大只能上传10张图片
    var len =  $("#picUpload").find('img').length;
    if(len==10){
        layer.msg("可上传图片数量已达最大限度",{icon:2});
        return false;
    }
    var projectName = 'collectionManager';
    uploadPicture(projectName,"1");
})



