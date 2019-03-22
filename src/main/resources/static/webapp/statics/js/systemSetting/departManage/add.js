/**
 * author: zhangwei
 * 部门管理新增、编辑
 */
var pageType = "add";
var main = {

    init: function() {
        property.setUserInfo();
        var cyProps = "url:'"+property.getProjectPath()+"sysdepartment/getParentDeptTreeData.do',name:'parentId'";
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

        pageType = localStorage.deptType;
        if(pageType == 'edit') {
            $('#submit').text('保存');
            this.id = localStorage.departmentId;
            loadData(this.id);
        }else if(pageType == 'detail'){
            this.id = localStorage.departmentId;
            loadData(this.id);
        }else if(pageType == 'add'){
            this.id = localStorage.departmentId;
            // loadData(this.id);
        }
        this.initTable();



    },
    initTable: function() {
        layui.use('form', function() {
            var form = layui.form;

            form.verify({
                'dept-name': function(){
                    var pattern = /^[\u4E00-\u9FA5]/;    //中文校验
                    if(!pattern.test($("#departmentName").val())){
                   // replace(/[^\u4E00-\u9FA5]/g,'')
                        return  '请输入中文';
                    }
                }
            })


            //监听提交
            form.on('submit(formSubmit)', function(data) {
                var url = "sysdepartment/saveDept.do";
                var json = $("#deptForm").serialize();
                $.ajax({
                    type:"get",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改部门成功");
                            }else{
                                successMsg("添加部门成功");
                            }
                            parent.$t.goback("page/systemSetting/departManage/list.html");
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

}
main.init();



/**
 * 加载表单数据
 * @param id 部门id
 */
function loadData(id) {
    this.type = "edit";
    layui.use('form', function(){
        var form = layui.form;
        var index = parent.layer.getFrameIndex(window.name);
        var json = {"departmentId":id};
        //加载数据
        $.ajax({
            type:"get",
            data:json,
            async:false,
            url:property.getProjectPath()+"sysdepartment/getDeptByDeptId.do",
            success:function(result) {
                if (result.success == 1) {
                    setFormData(result.data);
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
    property.setForm($("#deptForm"),data);
    $("#departmentId").val(data.departmentId);

    if (data.parentId == -1){
        $("#parentid").val("根目录").attr("data-id",data.departmentId);
        return;
    }
    var json = {"departmentId":data.parentId};
    $.ajax({
        type:"get",
        data:json,
        async:false,
        url:property.getProjectPath()+"sysdepartment/getDeptByDeptId.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                $("#parentid").val(data.departmentName).attr("data-id",data.departmentId);
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}