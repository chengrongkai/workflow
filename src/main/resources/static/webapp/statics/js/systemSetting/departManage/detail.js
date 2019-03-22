/**
 * author: zhangwei
 * 部门管理查看详情页
 */
var pageType = "detail";
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
        if(pageType == 'detail') {
            this.id = localStorage.departmentId;
            loadData(this.id);
        }



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
    $('input,select,textarea').attr("disabled","disabled");
    property.setForm($("#deptForm"),data);

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