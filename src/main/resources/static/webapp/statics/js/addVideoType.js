/**
 * author: zhangwei
 * 角色新增、编辑
 */
var pageType = "add";
var pidData = null;
var main = {

    init: function() {

        pageType = localStorage.roleType;
        property.setUserInfo();

        // setSelect();
        if(pageType == 'edit') {
            $('#submit').text('保存');
            // this.getDetailData();
            this.id = localStorage.roleId;
            getDictData(this.id);
            loadData(this.id);
            $("#name").attr("disabled","disabled");
        }else{
            getDictData(null);
            $("#typeCodeBefore").hide();
        }

        this.initTable();
    },
    initTable: function() {
        layui.use('form', function() {
            var form = layui.form;
            if(pageType == 'addChildren') {
                $('#submit').text('保存');
                // this.getDetailData();
                var pid = localStorage.pid;
                pidData = pid;
                setSelect()
                form.render('select');
                setVideoCode(pid);
            }
            //监听提交
            form.on('submit(formSubmit)', function(data) {
                var typeCode = $("#typeCode").val();
                var typeCodeDe = $("#typeCodeDe").val();
                if (typeCodeDe != ""){
                    typeCode = $("#typeCodeDe").val()+"-"+typeCode;
                }
                $("#typeCodeDe").val(typeCode);
                var json = $("#roleForm").serialize();
                var url = "PostVideo/addPostVideoType.do";
                if (pageType == "edit"){
                    url = "PostVideo/updatePostVideoType.do";
                    // delete json.pid;
                    // json.pid = $("#pid").attr("data-id");
                }
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改分类成功");
                            }else{
                                successMsg("添加分类成功");
                            }
                            parent.$t.goback("page/video/videoTypeList.html");
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
                return false;
            });

            //监听重置
            $("#cancel").click(function () {
                // layer.confirm('确认取消吗?', function(index){
                    parent.$(".myRefresh").click();
                    // layer.close(index);
                // });
                return false;
            });

            form.on('select(pid)', function(data){
                var pid = data.value;
                setVideoCode(pid);
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
 * @param id 角色id
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
            url:property.getProjectPath()+"PostVideo/queryPostVideoTypeById.do",
            success:function(result) {
                if (result.success == 1) {
                    setFormData(result.data);
                    // form.render('select');
                } else if (result.success == 0){
                    errorMsg(result.error.message);
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
    property.setForm($("#roleForm"),data);
    // $("#type").val(data.type);
    // $("#parentid").val("aaaa").attr("data-id",data.parentid);
    pidData = data.pid;
    setSelect();
    var typeCode = data.typeCode;
    var typeCodeStr = typeCode.split("-");
    var typeCodeDe = "";
    for (var i=0;i<typeCodeStr.length;i++){
        var code = typeCodeStr[i];
        if (i == typeCodeStr.length-1){
            // temp = "<input type='text' value="+code+" class='layui-input'>";
            $("#typeCode").val(code);
        }else{
            var temp = "<div class='layui-input-inline'>" +
                "<input type='text' value="+code+" disabled='disabled' class='layui-input'></div>";
            $("#typeCodeBefore").show();
            $("#typeCodeBefore").append(temp);
            typeCodeDe = typeCodeDe+code;
        }
    }
    $("#typeCodeDe").val(typeCodeDe);

}

/**
 * 获取全部业务字典数据
 */
function getDictData(currentId) {
    var json = {"currentId":currentId};
    $.ajax({
        data:json,
        type:"get",
        async:false,
        url:property.getProjectPath()+"PostVideo/queryPostVideoTypeListDist.do",
        success:function(result) {
            if (result.success == 1) {
                videoTypeList = result.data;
                setSelect();
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}


/**
 * 设置下拉框
 */
function setSelect() {
    layui.use('form', function() {
        var form = layui.form;
        var pidSelect = component.getSelectSimplePlus(videoTypeList, pidData, "pid", "id", "name");
        $("#pid").empty();
        $("#pid").append(pidSelect);
        form.render('select');
    })
}

function setVideoCode(pid) {
    var typeCode = $("#typeCode").val();
    pid = getCodeType(pid);
    var pidArray = pid.split('-');
    var htmlStr = "";
    var typeDe = "";
    for (var i=0;i<pidArray.length;i++){
        var code = pidArray[i];
        var temp = "<div class='layui-input-inline'>" +
            "<input type='text' value="+code+" disabled='disabled' class='layui-input'></div>";
        htmlStr = htmlStr+temp;
        if (i == 0){
            typeDe = code;
        }else{
            typeDe = typeDe+"-"+code;
        }
    }
    $("#typeCodeBefore").show();
    $("#typeCodeBefore").empty();
    $("#typeCodeBefore").append(htmlStr);
    $("#typeCodeDe").val(typeDe);
}

function getCodeType(id) {
    var typeCode = null;
    var json = {"id":id};
    //加载数据
    $.ajax({
        type:"get",
        data:json,
        async:false,
        url:property.getProjectPath()+"PostVideo/queryPostVideoTypeById.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                typeCode = data.typeCode;
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
    return typeCode;
}



