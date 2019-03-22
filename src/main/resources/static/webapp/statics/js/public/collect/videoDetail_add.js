var pageType = "add";
var hasChild = false;
console.log(11111);
var main = {

    init: function () {
        property.setUserInfo();
        this.initTable();
        this.tabBind();
    },
    initTable: function () {
        var selectType = null;
        var selectSonType = null;
        pageType = localStorage.userType;


        layui.use('form', function() {

            var form = layui.form;

            form.verify({
                'img-required': function () {
                    var nodes = $('.picDiv');
                    if(!nodes[0].id) {
                        return '图片不能为空';
                    }
                },
                'second-required': function () {
                    // 如果有二级子菜单则验证
                    if(hasChild) {
                        var sonTypeId = $("#sonTypeId").val();
                        if(!sonTypeId){
                            return '二级菜单不能为空';
                        }
                    }
                }
            })



            /*

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

*/
            if (pageType == 'edit') {

                $('.uploadBtn').css('display','none');
                var picList = [];
                this.id = parent.$t.getQueryStringFrame('id');
                var datas = yc.ajaxGetByParams('collect/getOneCollect', {id: this.id}, null, null);
                picList = datas.data.attachmentList;
                $("#picids").val(datas.data.collect.pictureids);
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
                if (success == 1) {
                    let data = datas.data;
                    let collect = data.collect;
                    collect.type = data.type;
                    collect.sonType = data.sonType;
                    selectType = collect.typeId;
                    selectSonType = collect.sonTypeId || null;
                    property.setForm($("#collectForm"), collect);
                } else {
                    errorMsg('页面加载错误，请联系管理员');
                }

                var typeDatas = property.getDictData('post_collect');
                /* var typeData = typeDatas.data.map((obj) => {
                     return {value: obj.id, text: obj.dictName}
                 });*/
                // var typeData = typeDatas.data.map(function (obj) {
                //     return { value: obj.id, text: obj.dictName };
                // });

                // $.each(typeDatas, function(i, item) {
                //     console.log(item)
                // })

                var typeData = $.map(typeDatas, function(obj) {
                    console.log(obj)
                    return { value: obj.id, text: obj.dictName };
                })

                var selects_types = component.getSelect(typeData, selectType, "typeId");
                console.log('----', selects_types)
                $("#typeId").html(selects_types);
                var typeCheck = $("#typeId").val();
                if (!yc.isNull(typeCheck)) {
                    var sonTypeId = datas.data.sonTypeId;
                    var sonTypeData = [];
                    var sonTypeDatas = yc.ajaxGetByParams('collect/getSysDictListByPid.do', {pid: typeCheck}, null).data || [];
                    // let sonTypeDatas = yc.ajaxGetByParams('sysDict/getSelectDataByKey.do', {key: 'post_collect_two'}, null);
                    if (sonTypeDatas.length > 0) {
                        /* sonTypeData = sonTypeDatas.map((obj) => {
                             return {value: obj.id, text: obj.dictName}
                         });*/
                        sonTypeData = sonTypeDatas.map(function (obj) {
                            return { value: obj.id, text: obj.dictName };
                        });
                    }
                    var selects_sonTypes = component.getSelect(sonTypeData, sonTypeId, "sonTypeId");
                    $("#sonTypeId").html(selects_sonTypes);
                    form.render();
                }

            } else {
                // 给type 下拉框赋值
                var typeDatas = yc.ajaxGetByParams('sysDict/getSelectDataByKey.do', {key: 'post_collect'}, null);
                /* var typeData = typeDatas.data.map((obj) => {
                     return {value: obj.id, text: obj.dictName}
                 });*/
                var typeData = typeDatas.data.map(function (obj){
                    return {value: obj.id, text: obj.dictName}
                });
                var selects_types = component.getSelect(typeData, selectType, "typeId");
                $("#typeId").html(selects_types);
                console.log(selects_types);
                var typeCheck = $("#typeId").val();
                if (!yc.isNull(typeCheck)) {
                    var sonTypeData = [];
                    var sonTypeDatas = yc.ajaxGetByParams('collect/getSysDictListByPid.do', {pid: typeCheck}, null).data || [];
                    // let sonTypeDatas = yc.ajaxGetByParams('sysDict/getSelectDataByKey.do', {key: 'post_collect_two'}, null);
                    if (sonTypeDatas.length > 0) {
                        /*sonTypeData = sonTypeDatas.map((obj) => {
                            return {value: obj.id, text: obj.dictName}
                        });*/
                        sonTypeData = sonTypeDatas.map(function (obj){
                            return {value: obj.id, text: obj.dictName}
                        });
                    }
                    var selects_sonTypes = component.getSelect(sonTypeData, null, "sonTypeId");
                    console.log(selects_sonTypes);
                    $("#sonTypeId").html(selects_sonTypes);
                }
                form.render();
            }


        });






        layui.use('form', function () {
            var form = layui.form;
            // 监听下拉框
            form.on('select(type)', function(data){
                var typeId = $("#typeId").val() || '';
                if (!yc.isNull(typeId)) {
                    var sonTypeDatas = yc.ajaxGetByParams('collect/getSysDictListByPid.do', {pid: typeId}, null).data || [];
                    if(sonTypeDatas.length >0) {
                        hasChild = true;
                        /*sonTypeDatas = sonTypeDatas.map((obj) => {
                            return {value: obj.id, text: obj.dictName}
                        });*/
                        sonTypeDatas = sonTypeDatas.map(function(obj){
                            return {value: obj.id, text: obj.dictName}
                        });
                        var selects_sonTypes = component.getSelect(sonTypeDatas, null, "sonTypeId");
                    } else {
                        hasChild = false
                        var selects_sonTypes = component.getSelect(null, selectSonType, "sonTypeId");
                    }

                } else {
                    var selects_sonTypes = component.getSelect(null, selectSonType, "sonTypeId");
                }
                $("#sonTypeId").html(selects_sonTypes);
                form.render('select');
            });


            //监听提交
            form.on('submit(formDemo)', function (data) {
                this.id = parent.$t.getQueryStringFrame('id');
                var url = 'collect/addCollect';
                var msg = '新增成功';
                if (pageType == 'edit') {
                    url = 'collect/updateCollect';
                    msg = '修改成功';
                }
                // var type = $("#typeId option:selected").text() || '';
                // var sonType = $("#sonTypeId option:selected").text() || '';
                var collect = data.field || {};
                if (!yc.isNull(this.id )) {
                    collect.id = this.id;
                }

                collect.pictureids = $("#picids").val();

                // collect.type = type;
                // collect.sonType = sonType;
                var datas = yc.ajaxPostByJson(url, collect, null, msg);
                if (datas != null && datas.success == 1) {
                    parent.$t.goback("page/public/collect/list.html");
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
            parent.$t.goback("page/public/collect/list.html");
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
// }
//
// )

uploadImgNoCut('collectionManager','picUpload','picids');



