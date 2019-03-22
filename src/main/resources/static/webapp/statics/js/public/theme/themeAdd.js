/**
 * author: zhangwei
 * 主题展新增、编辑
 */
var pageType = "add";
var dataObject = null;
var formInfo = {}
var collectList = new Array();
var collectTypeList = new Array();
var collectCols = [{type:"numbers",title: '序号', width:70, align:"center"},
    {field:'typeFullName', title: '藏品类型', width:200,align:'center',templet:"#mumeumImg"},
    {field: 'name', title: '藏品名称',  align:'center'},
    {field: 'msg', title: '藏品简介',  align:'center'},
    {title: '操作',width:200,  toolbar:'#collectBar',align:"center"}];


var main = {

    init: function() {
        property.setUserInfo();
        pageType = localStorage.themeType;

        if(pageType == 'edit') {
            $('#submit').text('保存');
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'detail'){
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'add'){
            // localStorage.clear();
            localStorage.removeItem('id');
        }

        this.initTable();
    },
    initTable: function(){

        // 查询下拉框数据
        getCollectList('collectId', 'post_collect');


        layui.use(['form','table'], function(){
            var form = layui.form;
            var table = layui.table;


            form.verify({
                'img-required': function () {
                    var nodes = $('.picDiv');
                    if(!nodes[0].id) {
                        return '图片不能为空';
                    }
                }
            })


            //var typeId = $("#collectId").val();

         /*   var table = layui.table;
            //渲染关联藏品信息列表
            table.render({
                elem: '#collectInfo',
                page: false,
                id: "collectInfoTable",
                cols: [collectCols],
                data: []
            });
*/

            //监听提交
            form.on('submit(formDemo)', function(data){
                var id = $("#id").val();
                var themeName = $("#themeName").val();
                var themeDescribe = $("#themeDescribe").val();
                //var picUpload = $("#picUpload").val();
                var collectLists = collectList.map((obj) => {return {collectId: obj.id}});
                var objectListStr = JSON.stringify(collectLists);
                console.dir("藏品集合 :" +objectListStr);
                var datumIds = $('#picids').val();
                if (null == datumIds || datumIds == '') {
                    layer.msg('请上传主题展图片！', {icon: 5, anim: 6});
                    return false;
                }
                if (pageType == 'add' && (null == objectListStr || objectListStr == '' || objectListStr == '[]')) {
                    layer.msg('请添加关联藏品！', {icon: 5, anim: 6});
                    return false;
                }
                var url = "themeshow/saveThemeShow.do";
                if (pageType == "edit"){
                    url = "themeshow/updateThemeShow.do";
                }
                var json = $("#themeshowForm").serialize();
                console.dir(json);
                $.ajax({
                    type:"post",
                    data:{"themeName":themeName,"id":id,"themeDescribe":themeDescribe,"objectListStr":objectListStr, "datumIds": datumIds},
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改主题展成功");
                            }else{
                                successMsg("添加主题展成功");
                            }
                            parent.$t.goback("page/public/theme/list.html");
                        } else if (result.success == 0){
                            //top.layer.msg(result.error.message);
                            errorMsg("操作主题展数据异常");
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
                if (null != data.value && data.value != ''){
                    getDictListByPid(data.value);
                }
            })

            //二级菜单下拉框监听
            form.on('select(city)', function(data){
                // if (null != data.value && data.value != ''){
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
                // }
            })


            layui.use('laydate', function(){
                var laydate = layui.laydate;
                //执行一个laydate实例
                laydate.render({
                    elem: '#startDate' //指定元素
                });
            });


            //监听取消
            $("#reset").click(function () {
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
                        if(!isEmpty(dataObject) && dataObject.operationStatus ==2){
                            return false;
                        }
                        parent.layer.confirm('是否确定删除该藏品？',{icon:3, title:'提示信息'},function(index){
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
                            parent.layer.close(index);
                        });
                    }else if(layEvent === 'detail'){
                         data = obj.data;
                         localStorage.id = data.id;
                         parent.$t.goToPage(this, "page/public/theme/list.html");

                    }
                });
            });




            layui.use(['upload','element'], function(){
                var $ = layui.jquery
                    ,upload = layui.upload,
                    element = layui.element;


                // $(".uploadBtn").click(function() {
                //
                //     //最大只能上传10张图片
                //     var len =  $("#picUpload").find('img').length;
                //     if(len==10){
                //         layer.msg("可上传图片数量已达最大限度",{icon:2});
                //         return false;
                //     }
                //     var projectName = 'themeManager';
                //     uploadPicture(projectName);
                // })
            });
        });
    },

}




main.init();

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
    // var name = $("#name").val();
    // var msg = $("#msg").val();

    // if(collectId == null || collectId == ""){
    //     layer.msg("请选择藏品",{icon:2});
    //     return false;
    // }
    // for(var i=0;i<collectList.length;i++){
    //     if(collectId  == collectList[i].collectId ){
    //         layer.msg("已添加过该藏品",{icon:2});
    //         return false;
    //     }else{
    //         continue;
    //     }
    // }
    //
    // var addItem = null;
    // for(var i = 0; i<list.length; i++){
    //     // if(list[i].type == collectName){
    //     //     addItem = list[i];
    //     //     break;
    //     // }
    //     collectList.push(list[i]);
    // }
    // collectList.push(list);
    if(collectList.length>0){
        //渲染关联藏品信息列表
        table.render({
            elem: '#collectInfo',
            page : false,
            id : "collectInfoTable",
            cols : [collectCols],
            data:collectList
        });
    }
    if (null != collectNameArr && collectNameArr.length != 0) {
        layer.msg(collectNameArr.join("，") + "已添加过，本次跳过", {icon: 3});
    }
}
/**
 * 加载表单数据
 * @param id  主题展id
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
            url:property.getProjectPath()+"themeshow/getShowById.do",
            success:function(result) {
                if (result.success == 1) {
                    formInfo = result.data
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



/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {

    var picList = data.picList;
    if (picList) {
        $("#picids").val(data.datumIds);
        for (var i = 0;i < picList.length;i++) {
            var picStr1;
            picStr1 = '<div class="img picDiv" id="img'+ picList[i].attId +'">'
                +'<div class="img1"><img src="'+ picList[i].attPath +'" alt="" ></div>'
                +'<div class="img2"><span class="img3" id="span'+ picList[i].attId +'" mark='+ picList[i].attId +'>更换图片</span><span class="img4" mark='+ picList[i].attId +'>删除图片</span></div>'
                +'</div>'

            $(".picDiv").replaceWith(picStr1);
        }
    }
    $(".uploadBtn").hide();

    collectList = data.collectDtoList;  //这里
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
        })
    }
    property.setForm($("#themeshowForm"),data);
}



//获取页面下拉数据(关联藏品类别)
function getCollectList(id, type){
    layui.use(['form'], function (){
        var form = layui.form;
        collectTypeList = property.getDictData(type);
        // yc
        var selDatas = collectTypeList.map((obj) => {return {value: obj.id, text: obj.dictName}});
        var collectTyleSelect = ''
        if(formInfo && formInfo) {
            if(formInfo.collectDtoList) {
                collectTyleSelect = component.getSelect(selDatas,formInfo.collectDtoList[0].typeId, id);

                getDictListByPid(formInfo.collectDtoList[0].typeId)
            } else {
                collectTyleSelect = component.getSelect(selDatas,null, id);

            }

        } else {
            var selectData = selDatas.find(function (obj) {
                return obj.text = '邮政文物'
            })
            getDictListByPid(selectData.value)
            collectTyleSelect = component.getSelect(selDatas, selectData.value, id);
        }
        $("#"+id).html(collectTyleSelect);
        //添加默认赋值邮政文物
        $("#collectId").val(selDatas[0].value);
        getDictListByPid(selDatas[0].value);
        $("#city").val("all");   //二级菜单赋值
        form.render('select');




    })
}

function getDictListByPid(id) {

     layui.use(['form'], function (){
        var form = layui.form;

        collectTypeList = property.getSysDictListByPid(id);
        var formSelects = layui.formSelects;
        //formSelects.value('select1', 'valStr');
        form.render('select');
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
        }
        return xhr;
    }
}

uploadImgNoCut('themeManager','uploadBtn','picids');