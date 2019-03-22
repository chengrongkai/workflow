var pageType = "add";
var collectList = new Array();
var editIndex;
var collectCols = [{type:"numbers",title: '序号', width:70, align:"center"},
    {field:'typeFullName', title: '藏品类型', width:200,align:'center',templet:"#mumeumImg"},
    {field: 'name', title: '藏品名称',  align:'center'},
    {field: 'msg', title: '藏品简介',  align:'center'},
    {title: '操作',width:200,  toolbar:'#collectBar',align:"center"}];
var main={

    init:function(){
        property.setUserInfo();
        pageType = localStorage.curatorType;
        property.setUserInfoPlus('userName','orgName','nowDate');
        property.setUserInfoPlus('userName1','orgName1','nowDate1');
        if(pageType == 'edit') {
            $('#submit').text('保存');
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'detail'){
            this.id = localStorage.id;
            loadData(this.id);

        }else if(pageType == 'add'){

        }



        this.initTable();

    },
    initTable:function(){

        // 查询下拉框数据
        getCollectList('collectId', 'post_collect');

        layui.use(['form','layedit','upload'], function() {

            var form = layui.form,
                layedit = layui.layedit,
                upload = layui.upload;
            var table = layui.table;

            //创建一个编辑器
          /*  editIndex = layedit.build('themeContent',{
                height: 214,
                uploadImage: {
                    url: property.getProjectPath()+"/attach/uploadEditPic.do?projectName=informationEditPic",
                    type:"post"
                }
            });*/
            //监听提交
            form.on('submit(formDemo)', function(data) {
                layedit.sync(editIndex);
                var themeName = $("#themeName").val();
                var themeDescribe = $("#themeDescribe").val();
                var processResult = $('input[name="processResult"]:checked').val();
                var collectLists = collectList.map((obj) => {return {collectId: obj.id}});
                var objectListStr = JSON.stringify(collectLists);
                var datumIds = $('#picids').val();
                // if (null == datumIds || datumIds == '') {
                //     layer.msg('请上传主题展图片！', {icon: 5, anim: 6});
                //     return false;
                // }
                // if (null == objectListStr || objectListStr == '' || objectListStr == '[]') {
                //     layer.msg('请添加关联藏品！', {icon: 5, anim: 6});
                //     return false;
                // }
                if (null == processResult || processResult == '') {
                    layer.msg('请选择操作！', {icon: 5, anim: 6});
                    return false;
                }
                var url = "curator/saveCurator.do";
                if (pageType == "edit"){
                    url = "curator/updateCurator.do";
                }
                var json = $("#curatorForm").serialize();
                console.dir(json);
                $.ajax({
                    type:"get",
                    data:{
                        themeName: themeName,
                        themeDescribe: themeDescribe,
                        processResult: processResult,
                        objectListStr: objectListStr,
                        datumIds: datumIds,
                        id: localStorage.id,
                        remark: $('#remark').val()
                    },
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            successMsg("审核成功");
                            parent.$t.goback("page/public/cezhan/list.html");
                        } else if (result.success == 0){
                            //top.layer.msg(result.error.message);
                            errorMsg("审核失败");
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

            //一级菜单下拉框监听
            form.on('select(collect)', function(data){
                if(null != data.value){
                    getDictListByPid(data.value);
                }
            })

            //二级菜单下拉框监听
            form.on('select(city)', function(data){
                var formSelects = layui.formSelects;
                var sonTypeId = data.value;
                var typeId = $('#collectId').val();
                // 先清空
                formSelects.data('select1', 'local',{
                    arr:[]
                });
                if (null == sonTypeId || sonTypeId == '') {
                    return false;
                }
                // 查询二级
                formSelects.data('select1', 'server',{
                    url:property.getProjectPath()+"collect/selectListByTypeAndSonType.do?sonTypeId="+data.value+"&typeId="+typeId
                });

            })

            $("button[type='reset']").click(function () {
                parent.$t.goback("page/public/cezhan/list.html");
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
            //     var projectName = 'curatorManager';
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

            //添加博物馆
            $(".addBtn").click(function(){
                var formSelects = layui.formSelects;
                var ids = formSelects.value('select1', 'valStr');
                var type = $("#collectId").val();
                var sonTypeId = $('#city').val();
                if (null == type || type == '' || null == sonTypeId || sonTypeId == '') {
                    errorMsg("请选择藏品类别！");
                    return false;
                }
                if (null == ids || ids == '') {
                    ids = "all";
                }
                //加载数据
                $.ajax({
                    type:"post",
                    url:property.getProjectPath()+" collect/selectListByIds.do",
                    data: {
                        ids: ids,
                        typeId: type,
                        sonTypeId: sonTypeId
                    },
                    success:function(result) {
                        if (result.success == 1){
                            var data = result.data;
                            addCollect(table, data);
                            //执行清空
                            $("#collectId").val("请选择");
                            $("#city").val("请选择");
                            var formSelects = layui.formSelects;
                            formSelects.data('select1', 'local',{
                                arr:[]
                            });
                            form.render("select");
                        } else if (result.success == 0){
                            //top.layer.msg(result.error.message);
                            console.dir(result)
                            errorMsg("系统异常");
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
                return false;
            })

            layui.use('table', function(){
                var table = layui.table;
                //列表操作
                table.on('tool(collectInfo)', function(obj){
                    var layEvent = obj.event,
                        data = obj.data;
                    if(layEvent === 'del'){ //删除
                        layer.confirm('是否确定删除该藏品？',{icon:3, title:'提示信息'},function(index){
                            for(var i=0;i<collectList.length;i++){
                                if(data.id == collectList[i].id){
                                    collectList.splice(i,1);
                                    break;
                                }
                            }

                            //渲染关联藏品信息列表
                            table.render({
                                elem: '#collectInfo',
                                page : false,
                                id : "collectInfoTable",
                                cols : [collectCols],
                                data:collectList
                            });
                            layer.close(index);
                        });
                    }else if(layEvent === 'detail'){
                        data = obj.data;
                        console.dir(data);
                        localStorage.id = data.id;
                        parent.$t.goToPage(this, "page/public/collect/add.html");

                    }
                });
            });
        });

    },

}
main.init();

//获取页面下拉数据(关联藏品类别)
function getCollectList(id, type){
    layui.use(['form'], function (){
        var form = layui.form;
        collectTypeList = property.getDictData(type);

        // yc
        var selDatas = collectTypeList.map((obj) => {return {value: obj.id, text: obj.dictName}});

        var collectTyleSelect = component.getSelect(selDatas, null, id);
        $("#"+id).html(collectTyleSelect);
        form.render('select');

    })
}


/**
 * 加载表单数据
 * @param id   公众策展id
 */
function loadData(id){
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
            url:property.getProjectPath()+"curator/getCuratorById.do",
            success:function(result) {
                if (result.success == 1) {
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




/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {
   /* layui.use('layedit', function(){
        var  layedit = layui.layedit;
        layedit.setContent(editIndex, data.themeContent, false);
    });*/
    //$("#storyContent").text(data.storyContent);


    var picList = data.picList;
    if(picList){
        $("#picids").val(data.datumIds);
        for (var i = 0;i < picList.length;i++) {
            var picStr1;
            picStr1 = '<div class="img picDiv" id="img'+ picList[i].attId +'">'
                +'<div class="img1"><img src='+ picList[i].attPath +' alt="" ></div>'
                +'<div class="img2"><span class="img3" id="span'+ picList[i].attId +'" mark='+ picList[i].attId +'>更换图片</span><span class="img4" mark='+ picList[i].attId +'>删除图片</span></div>'
                +'</div>'

            $(".picDiv1").replaceWith(picStr1);
        }
    }

    $(".uploadBtn").hide();

    collectList = data.collectDtoList;
    if(null != collectList && collectList.length>0){
        layui.use('table', function() {
            var table = layui.table;
            //渲染关联藏品信息列表
            table.render({
                elem: '#collectInfo',
                page: false,
                id: "collectInfoTable",
                cols: [collectCols],
                data: collectList
            });
        })
    }

    property.setForm($("#curatorForm"),data);
}




//日历切换
function cDayFunc() {
    main.initTable()
}

function addCollect(table, list){
    // var collectId = $("#collectId").val();
    var collectName = $("#org option:checked").text();
    var formSelects = layui.formSelects;
    var ids = formSelects.value('select1', 'val');
    var collectNameArr = [];
    var collectListTemp = new Array();

    for(var i = 0; i<list.length; i++) {
        var id = list[i].id;
        var flag = true;
        for (let j = 0, length = collectList.length; j < length; j++) {
            if (id == collectList[j].id) {
                collectNameArr.push(list[i].name);
                list.splice(i, 1);
                flag = false;
                i --;
                break;
            }
        }
        if (flag) {
            collectListTemp.push(list[i]);
        }
    }
    collectList = collectList.concat(collectListTemp);
    if(collectList.length>0){
        layui.use('table', function() {
            var table = layui.table;
            //渲染关联藏品信息列表
            table.render({
                elem: '#collectInfo',
                page: false,
                id: "collectInfoTable",
                cols: [collectCols],
                data: collectList
            });
        });
    }
    if (null != collectNameArr && collectNameArr.length != 0) {
        layer.msg(collectNameArr.join("，") + "已添加过，本次跳过", {icon: 3});
    }
}

function getDictListByPid(id) {
    layui.use(['form'], function (){
        var form = layui.form;
        collectTypeList = property.getSysDictListByPid(id);
        var formSelects = layui.formSelects;
        formSelects.data('select1', 'local',{
            //url: "http://yapi.demo.qunar.com/mock/9813/layui/data"
            arr:[]
        });

        // yc
        var selDatas = collectTypeList.map((obj) => {return {value: obj.id, text: obj.dictName}})

        if (null == selDatas || selDatas.length == 0) {
            selDatas.push({
                text: '全部',
                value: 'all'
            })
        }

        var collectTyleSelect = component.getSelect(selDatas, null, 'city');
        $("#city").html(collectTyleSelect);
        form.render('select');
    })
}

function xhrOnProgress(fun) {
    xhrOnProgress.onprogress = fun;
    return function() {
        var xhr = $.ajaxSettings.xhr();
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }                return xhr;
    }     }

uploadImgNoCut('curatorManager','uploadBtn','picids');