/**
 * author: zhangwei
 * 角色新增、编辑
 */
var pageType = "add";
var main = {

    init: function() {
        property.setUserInfo();
        pageType = localStorage.roleType;
        if(pageType == 'edit') {
            $('#submit').text('保存');
            // this.getDetailData();
            this.id = localStorage.roleId;
            loadData(this.id);
        }
        this.initTable();
    },
    initTable: function() {
        layui.use('form', function() {
            var form = layui.form;

            //监听提交
            form.on('submit(formSubmit)', function(data) {
                var url = "Role/addRole.do";
                if (pageType == "edit"){
                    url = "Role/updateRole.do";
                    // $("input[name='parentid']").val($("#parentid").attr("data-id")) ;
                }
                var json = $("#roleForm").serialize();
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改角色成功");
                            }else{
                                successMsg("添加角色成功");
                            }
                            parent.$t.goback("page/systemSetting/roleManage/list.html");
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
                    parent.$(".myRefresh").click();
                    layer.close(index);
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
        var json = {"roleId":id};
        //加载数据
        $.ajax({
            type:"get",
            data:json,
            async:false,
            url:property.getProjectPath()+"Role/queryRoleById.do",
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

}



