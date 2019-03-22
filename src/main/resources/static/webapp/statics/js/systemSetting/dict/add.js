/**
 * author: zhangwei
 * 角色新增、编辑
 */
var pageType = "add";
var main = {

    init: function() {
        property.setUserInfo();
        pageType = localStorage.dictType;
        if(pageType == 'edit') {
            $('#submit').text('保存');
            // this.getDetailData();
            this.id = localStorage.dictId;
            loadData(this.id);
        }
        this.initTable();
    },
    initTable: function() {
        var cyProps = "url:'"+property.getProjectPath()+"sysDict/queryDictListTree.do',name:'pid'";
        $("#pid").attr("cyProps",cyProps);
        layui.use('element', function () {
        });
        function submitCode() {
            var code = $("textarea").val();
            $("#result").html(code);
            $("#result").find("#pid").treeTool();

        }
        $(document).ready(function () {
            $('#result').on('click','#pid', function(){
                var obj=$(this);
                openZtree(obj);
            });
        });
        layui.use('form', function() {
            var form = layui.form;

            //监听提交
            form.on('submit(formSubmit)', function(data) {
                var url = "sysDict/addSysDict.do";
                var json = $("#roleForm").serialize();
                if (pageType == "edit"){
                    url = "sysDict/updateSysDict.do";
                    delete json.pid;
                    json.pid = $("#pid").attr("data-id");
                }
                $.ajax({
                    type:"get",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改业务字典成功");
                            }else{
                                successMsg("添加业务字典成功");
                            }
                            parent.$t.goback("page/systemSetting/dict/list.html");
                        } else if (result.success == 0){
                            errorMsg(result.data);
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
                layer.confirm('确认取消吗?', function(index){
                    parent.$(".myRefresh").click();
                    layer.close(index);
                });
                return false;
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
        var json = {"dictId":id};
        //加载数据
        $.ajax({
            type:"post",
            data:json,
            async:false,
            url:property.getProjectPath()+"sysDict/getDictById.do",
            success:function(result) {
                if (result.success == 1) {
                    setFormData(result.data);
                    // form.render('select');
                } else if (result.success == 0){
                    errorMsg(result.data);
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
    if (data.pid == -1){
        $("#pid").val("根目录").attr("data-id",data.id);
        return;
    }
    var json = {"dictId":data.pid};
    $.ajax({
        type:"get",
        data:json,
        async:false,
        url:property.getProjectPath()+"sysDict/getDictById.do",
        success:function(result) {

            if (result.success == 1) {
                var data = result.data;
                $("#pid").val(data.dictName).attr("data-id",data.id);
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}



