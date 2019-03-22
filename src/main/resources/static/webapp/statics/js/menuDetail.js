var pageType="add";
var form1;
var main={
    init:function () {
        property.setUserInfo();
        this.initTable();
        this.tabBind();
        this.loadForm();
    },
    initTable:function(){
        var cyProps = "url:'"+property.getProjectPath()+"Function/queryFunctionListTree',name:'parentId'";
        $("#parentid").attr("cyProps",cyProps);
        layui.use('element', function () {
        });
        function submitCode() {
            var code = $("textarea").val();
            $("#result").html(code);
            $("#result").find("#parentid").treeTool();

        }
        $(document).ready(function () {
            $('#result').on('click','#parentid', function(){
                var obj=$(this);
                openZtree(obj);
            });
        });


        layui.use('form', function(){
            var form = layui.form;
            var index = parent.layer.getFrameIndex(window.name);
            //监听提交
            form.on('submit(formDemo)', function(data){
                var json = $("#functionForm").serialize();
                var url = "Function/saveFunction";
                if (pageType == "edit"){
                    // url = "Function/updateFunction.do";
                    delete json.parentId;
                    json.parentId = $("#parentid").attr("data-id");
                }
                $.ajax({
                    type:"get",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改功能成功");
                            }else{
                                successMsg("添加功能成功");
                            }
                            parent.$t.goback("page/menu/menuList.html");
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                }
                },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });

            });
        });

    },

    tabBind:function () {
        //监听重置
        $("#cancel").click(function () {
            parent.$(".myRefresh").click();
            return false;
        });
    },
    loadForm:function () {
        var menuType = localStorage.menuType;
        if (menuType == 1){
            var menuId = localStorage.menuId;
            loadData(menuId);
            // $("#title").text("编辑功能");
        }else {
            var ext1List = [{"id":"0","text":"否"},{"id":"1","text":"是"}];
            var ext1RadioStr = component.getRadio(ext1List,"0","ext1","id","text");
            $("#ext1Radio").append(ext1RadioStr);
        }
    }
}

function loadData(id) {
    pageType = "edit";
    layui.use('form', function(){
        var form = layui.form;
        form1 = form;
        var index = parent.layer.getFrameIndex(window.name);
        var json = {"functionId":id};
        //加载数据
        $.ajax({
            type:"get",
            data:json,
            async:false,
            url:property.getProjectPath()+"Function/queryFunctionById",
            success:function(result) {
                if (result.success == 1) {

                    setFormData(result.data);
                    form.render('select');
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

function setFormData(data) {
    property.setForm($("#functionForm"),data);
    $("#type").val(data.functionType);
    var ext1List = [{"id":"0","text":"否"},{"id":"1","text":"是"}];
    var ext1RadioStr = component.getRadio(ext1List,data.ext1,"ext1","id","text");
    $("#ext1Radio").append(ext1RadioStr);
    form1.render();
    if (data.parentId == -1){
        $("#parentid").val("根目录").attr("data-id",data.id);
        return;
    }
    var json = {"functionId":data.parentId};
    $.ajax({
        type:"get",
        data:json,
        async:false,
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                $("#parentid").val(data.functionName).attr("data-id",data.id);
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });

}

main.init();





