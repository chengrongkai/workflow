/**
 * author: zhangwei
 * 用户管理列表
 */
var projectName = property.getProjectPath();
var main = {

    init: function() {
        this.initTable();
        this.tabBind()
    },
    initTable: function() {
        getSelectData();
        loadTable();



        $('#btnAdd').click(function() {
            localStorage.userType = "add";
            parent.$t.goToPage(this, "page/systemSetting/userManage/list.html");
        });
    },
    tabBind: function() {
        var that = this;

        layui.use(['form', 'table'], function () {
          var table = layui.table,
              form = layui.form;
            //监听查询
            form.on('submit(formDemo)', function(data){
                // layer.msg(JSON.stringify(data.field))
                var name = $("#userOrName").val();
                var dept = $("#department").val();
                var datas = {"name": name, "departmentName": dept};
                loadTable(datas);
                return false;
            });
            //监听收起
            form.on('submit(moreSearch)', function (data) {
                if($(this).children().hasClass("fa-chevron-down")){
                    //显示更多条件
                    $(this).parents(".layui-form").find(".more-search").show();
                    //修改更多按钮图标
                    $(this).html('<i class="fa fa-chevron-up">&nbsp;</i>收起筛选');
                }else{
                    //显示更多条件
                    $(this).parents(".layui-form").find(".more-search").hide();
                    //修改更多按钮图标
                    $(this).html('<i class="fa fa-chevron-down">&nbsp;</i>展开筛选');
                }
                return false;
            });

            //监听性别操作
            form.on('switch(sexDemo)', function(obj){
                var flag = obj.elem.checked;
                var status = 0;
                if (flag){
                    status = 1;
                }else {
                    status = 0;
                }
                var userId = obj.elem.dataset.id;

                var json = {"status":status,"id":userId};
                var datas = yc.ajaxPostByJson("sysUser/updateSysUserType", json, null, "操作成功");

            });
            

            //监听重置
            $("[type='reset']").click(function () {

              $(this).parents(".layui-form").find("input").val("");
              $(this).parents(".layui-form").find("select").val("");
              form.render();
              loadTable();
              return false;
            });


            //排序方式
            form.on('select(orderBy)',function(){
                loadTable();
                return false;
            })

        });


        //回车触发查询
        $("#userOrName").keypress(function(e){
            if (e.which == 13){
                loadTable();
            }
        });



    }
}



//获取页面下拉数据
function  getSelectData(data){
    layui.use('form', function() {
        var form = layui.form;
        //获取排序方式下拉框
        orderType = property.getDictData('order_by');
        var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');
        $("#orderBy").append(orderTypeSelect);

      $.ajax({
        type:'post',
        url:projectName + '/sysdepartment/getDeptOptions.do',
        contentType:"application/json; charset=utf-8",
        success:function(res) {
          if (res.code == 0) {
            var list = res.data;
            var departmentStr = "";
            for(var j = 0;j < list.length;j++) {
              departmentStr +="<option value='"+list[j].departmentId+"' >"+list[j].departmentName+"</option>"
            }
            $("#department").append(departmentStr);
            form.render();
          }
        }
      });

        form.render('select');
    });
}




main.init();

function loadTable(){
     // var datas = yc.ajaxPostByJson("sysUser/getSysUserList.do", where, null, null);
    layui.use('table', function(){
        var table = layui.table;
        var form = layui.form;
        var util = layui.util;
        var  name  =  $("#userOrName").val();
        var  departmentName  =  $("#department").val();
        var  orderBy  =  $("#orderBy").val();
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"sysUser/getSysUserList.do?name="+name+"&departmentName="+departmentName+"&orderBy="+orderBy
            // ,data: datas
            //,where: where || {}
            ,title: '用户数据表'
                ,request:{
                    pageName: 'currentPage',
                    limitName: 'size'
                }
            ,cols: [[
                {type:'numbers', title:'序号'}
                ,{field:'userName', title:'用户名'}
                ,{field:'name', title:'姓名'}
                ,{field:'email', title:'邮箱地址'}
                ,{field:'phone', title:'联系电话'}
                ,{field:'deptName', title:'部门'}
                ,{field:'roleName', title:'角色'}
                ,{field:'createTime', title:'添加时间',
                    templet: function (res) {
                        return util.toDateString(res.createTime);
                    }
                }
                ,{field:'status', title:'是否启用', templet: '#switchTpl'}
                ,{title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
            ,id : "userListTable"
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'del') {
                layer.confirm('确定要删除么',{icon:3, title:'删除确认'}, function(index){
                    var objs = {'id': data.id};
                    var msg = "删除用户成功";
                    var datas = yc.ajaxGetByParams('sysUser/deleteSysUserById', objs, null, msg);
                    if (datas.success == 1) {
                        loadTable();
                        layer.close(index);
                    }
                });
            } else if (obj.event === 'edit'){
                localStorage.userType = "edit";
                localStorage.userId = data.id;
                parent.$t.goToPage(this, "page/systemSetting/userManage/list.html");
            }else if (obj.event === "detail"){
                localStorage.userType = "detail";
                localStorage.userId = data.id;
                parent.$t.goToPage(this, "page/systemSetting/userManage/list.html");
            }
        });
    });
}

