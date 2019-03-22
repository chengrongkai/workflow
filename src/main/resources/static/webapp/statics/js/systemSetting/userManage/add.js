/**
 * author: zhangwei
 * 用户管理新增、编辑
 */
var pageType = "add";
var main = {

    init: function () {
        var cyProps = "url:'" + property.getProjectPath() + "sysdepartment/getParentDeptTreeData.do',name:'deptId'";
        $("#deptId").attr("cyProps", cyProps);
        layui.use('element', function () {
        });
        function submitCode() {
            var code = $("textarea").val();
            $("#result").html(code);
            $("#result").find("#deptId").treeTool();

        }

        $(document).ready(function () {
            $('#result').on('click', '#deptId', function () {
                var obj = $(this);
                openZtree(obj);
            });
        });

        pageType = localStorage.userType;
        if (pageType == 'edit') {
            $('#submit').text('保存');
            // this.getDetailData();
            this.id = localStorage.userId;
            loadData(this.id);
        } else {
            //保存
            var roles = yc.ajaxGetByParams('sysUser/getRoleName', null, null, null).data;
            var data_roles = roles.map((obj) => {
                return {'value': obj.id, 'text': obj.name}
            });
            var selects_roles = component.getSelect(data_roles, null, "role");
            $("#role").html(selects_roles);

            var depts = yc.ajaxGetByParams('sysUser/getDeptName', null, null, null).data.data;
            var data_depts = depts.map((obj) => {
                return {'value': obj.departmentId, 'text': obj.departmentName}
            });
            var selects_depts = component.getSelect(data_depts, null, "dept");
            $("#dept").html(selects_depts);
        }
        this.initTable();
    },
    initTable: function () {
        var _this = this;
        layui.use('form', function () {
            var form = layui.form;

            form.verify({
                pwd:[/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/,'6-20位字符；数字、字母、特殊字符（除空格），起码其中两种组合']
            });

            //监听提交
            form.on('submit(formSubmit)', function (data) {
                var arrays = $("#userForm").serializeArray();
                var url = null;
                var deptId = null;
                var roleId = null;
                var keyArrays = arrays.map(obj => obj.name);
                var valueArrays = arrays.map(obj => obj.value);
                var jsons = yc.arrayToJsonObject(keyArrays, valueArrays);

                if (pageType == 'add') {
                    url = "sysUser/addSysUser.do";
                    // 新增查询的密码
                    var password = jsons['password'];
                    var surePassword = jsons['surePassword'];
                    if (checkMima(password, surePassword)) {
                        password = hex_md5(property.md5Str+password);
                        surePassword = hex_md5(property.md5Str+surePassword);
                    } else {
                        return false;
                    }

                } else if (pageType == "edit") {
                    url = "sysUser/updateSysUser.do";
                    var password = jsons['password'];
                    var surePassword = jsons['surePassword'];
                    if (password != yc.info) {
                        if (checkMima(password, surePassword)) {
                            password = hex_md5(property.md5Str+password);
                            surePassword = hex_md5(property.md5Str+surePassword);
                        } else {
                            return false;
                        }
                    } else {
                        // 修改所用的是假密码，所以需要从隐藏域里获取真实密码
                        password = jsons['passwordId'];
                        surePassword = jsons['surePasswordId'];
                    }

                    // deptId = $("#deptId").attr("data-id");
                }
                jsons['surePassword'] = surePassword;
                jsons['password'] = password;
                roleId = jsons.role;
                deptId = jsons.deptId;
                var userArray = ['id', 'userName', 'name', 'email', 'phone', 'password', 'surePassword', 'remark'];
                var sysUserJson = yc.getUseJson(userArray, jsons);
                var deptJson = {'deptId': deptId};
                var roleJson = {'roleId': roleId}
                var dtoKeys = ['sysUser', 'sysUserDept', 'sysRoleAuth'];
                var dtoValues = [sysUserJson, deptJson, roleJson]
                var sysUserDto = yc.arrayToJsonObject(dtoKeys, dtoValues);
                $.ajax({
                    url: property.getProjectPath() + yc.checkDo(url),
                    // 是否异步， false 就是同步
                    async: false,
                    data: JSON.stringify(sysUserDto || {}),
                    type: 'post',
                    dataType: 'json',
                    contentType: "application/json",
                    success: function (result) {
                        if (result.success == 1) {
                            if (pageType == "edit") {
                                successMsg("修改用户成功");
                            } else {
                                successMsg("添加用户成功");
                            }
                            parent.$t.goback("page/systemSetting/userManage/list.html");
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error: function (result) {
                        errorMsg("系统异常");
                    }
                });
                return false;
            })
        });
        //监听重置
        $("#cancel").click(function () {
            layer.confirm('确认取消吗?', function (index) {
                parent.$(".myRefresh").click();
                layer.close(index);
            });
            return false;
        });

        // 监听密码是否修改
        $("#password").click(function () {
            $("#password").val('');
            $("#surePassword").val('');
        })


    },
}
main.init();


/**
 * 加载表单数据
 * @param id 角色id
 */
function loadData(id) {
    this.type = "edit";
    layui.use('form', function () {
        var form = layui.form;
        var index = parent.layer.getFrameIndex(window.name);
        var data = {"id": id};
        //加载数据
        var datas = yc.ajaxGetByParams('sysUser/getSysUserById.do', data, null, null);
        var jsonData = datas.data;
        jsonData.passwordId = jsonData.password;
        jsonData.surePasswordId = jsonData.surePassword;
        var show = yc.info; //10
        jsonData.password = show;
        jsonData.surePassword = show;
        var roles = yc.ajaxGetByParams('sysUser/getRoleName', null, null, null).data;
        var data_roles = roles.map((obj) => {
            return {'value': obj.id, 'text': obj.name}
        });
        var editRoleId = jsonData.roleId;
        var selects_roles = component.getSelect(data_roles, editRoleId, "role");
        $("#role").html(selects_roles);
        form.render();
        setFormData(jsonData);
    });
}

/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {
    property.setForm($("#userForm"), data);
    if (data.deptId == -1) {
        $("#deptId").val("根目录").attr("data-id", data.departmentId);
        return;
    }
    var json = {"departmentId": data.deptId};
    $.ajax({
        type: "get",
        data: json,
        async: false,
        url: property.getProjectPath() + "sysdepartment/getDeptByDeptId.do",
        success: function (result) {
            if (result.success == 1) {
                var data = result.data;
                $("#deptId").val(data.departmentName).attr("data-id", data.departmentId);
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error: function (result) {
            errorMsg("系统异常");
        }
    });

}

function checkMima(content1, content2) {
    if (yc.isNull(content1)) {
        successMsg("密码不能为空！");
        return false;
    } else {
        if (content1 != content2) {
            errorMsg("前后密码不一致!");
            return false;
        } else {
            return true;
        }
    }
}



