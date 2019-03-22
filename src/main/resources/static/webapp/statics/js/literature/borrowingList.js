var projectName = property.getProjectPath();
var main = {
    init: function () {
        this.initTable();
        $('#addNew').click(function () {
            parent.$t.goToPage(this, "page/literature/borrowingList.html");
        })
    },
    initTable: function () {
        var _this = this;
        var  module = localStorage.functinId;
        layui.use(['form', 'table'], function () {
            var table = layui.table,
                form = layui.form;
            var tableIns = table.render({
                elem: '#borroringList'
                , url: projectName + '/postLiteratureProcess/borrowingList.do?module='+module
                , request: {
                    pageName: 'currentPage',
                    limitName: 'size'
                }
                , title: '借阅管理列表'
                , cols: [[
                    {type: 'numbers', title: '序号'}
                    , {field: 'literatureName', title: '文献名称'}
                    , {field: 'inventoryState', title: '库存数量', width: 120}
                    , {field: 'callNo', title: '分类索书号'}
                    , {field: 'applicantName', title: '借阅人'}
                    , {field: 'departmentName', title: '所属部门'}
                    , {field: 'borrowingDateStr', title: '借阅时间'}
                    , {field: 'planReturnDate', title: '计划归还时间'}
                    , {field: 'realReturnDateStr', title: '实际归还时间'}
                    , {field: 'applyStatusName', title: '状态'}
                    , {field: 'informationSourcesName', title: '信息来源'}
                    , {fixed: 'right', title: '操作', toolbar: '#barDemo'}
                ]]
                , page: true
                , limits: [10, 15, 20, 25]
                , limit: 10
                , id: "borroringListTable"
            });

            getSelectData();

            function getSelectData() {

                $.ajax({
                    type: 'post',
                    url: projectName + '/sysdepartment/getDeptOptions.do',
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {
                        if (res.code == 0) {
                            var list = res.data;
                            var departmentStr = "";
                            for (var j = 0; j < list.length; j++) {
                                departmentStr += "<option value='" + list[j].departmentId + "' >" + list[j].departmentName + "</option>"
                            }
                            $("#department").append(departmentStr);
                            form.render();
                        }
                    }
                });

                var data = ['borrow_status', 'order_by'];
                var map = property.getDictDataMulti(data);

                var borrow_status = map.borrow_status;
                var borrowStatusStr = "";
                for (var i = 0; i < borrow_status.length; i++) {
                    borrowStatusStr += "<option value='" + borrow_status[i].dictCode + "' >" + borrow_status[i].dictName + "</option>"
                }
                $("#borrowStatus").append(borrowStatusStr);

                var order_by = map.order_by;
                var orderStr = "";
                for (var k = 0; k < order_by.length; k++) {
                    orderStr += "<option value='" + order_by[k].dictCode + "' >" + order_by[k].dictName + "</option>"
                }
                $("#orderBy").append(orderStr);

                form.render();
            }

            //头工具栏事件
            table.on('toolbar(borroringList)', function (obj) {
                var checkStatus = table.checkStatus(obj.config.id);
                switch (obj.event) {
                    case 'getCheckData':
                        var data = checkStatus.data;
                        layer.alert(JSON.stringify(data));
                        break;
                    case 'getCheckLength':
                        var data = checkStatus.data;
                        layer.msg('选中了：' + data.length + ' 个');
                        break;
                    case 'isAll':
                        layer.msg(checkStatus.isAll ? '全选' : '未全选');
                        break;
                }
                ;
            });

            //监听行工具事件
            table.on('tool(borroringList)', function (obj) {
                var data = obj.data;

                if (obj.event === 'detail') {
                    localStorage.id = data.id;
                    localStorage.inventoryState = data.inventoryState;
                    parent.$t.goToPage(this,"page/literature/borrowingList.html");
                } else if (obj.event === 'loan') {
                    if (data.inventoryState > 0) {
                      layer.confirm('您确定要借出吗？', {
                        title: '借出确认',
                        area: ['450px', '218px'],
                        skin: 'demo-class',
                        btn: ['取消', '确认']
                      }, function (index, layero) {
                        layer.close(index);
                      }, function (index) {
                        $.ajax({
                          url: projectName + '/postLiteratureProcess/modifyState.do',
                          type: 'post',
                          data: {"id": data.id, "status": "2"},
                          success: function (result) {
                            if (result.success == "1") {
                              successMsg("借出成功！");
                            } else if (result.success == 0){
                              var resultMsg = result.error.message;
                              errorMsg(resultMsg);
                            }
                            tableIns.reload();
                            layer.close(index);
                          }
                        })
                      });
                      return false;
                    } else {
                      alertMsg("库存数量不足！")
                    }

                } else if (obj.event === 'revert') {
                    layer.confirm('您确定要归还吗？', {
                        title: '归还确认',
                        area: ['450px', '218px'],
                        skin: 'demo-class',
                        btn: ['取消', '确认']
                    }, function (index, layero) {
                        layer.close(index);
                    }, function (index) {
                        $.ajax({
                            url: projectName + '/postLiteratureProcess/modifyState.do',
                            type: 'post',
                            data: {"id": data.id, "status": "3"},
                            success: function (result) {
                                if (result.success == "1") {
                                    successMsg("归还成功！");
                                } else if (result.success == 0){
                                    var resultMsg = result.error.message;
                                    errorMsg(resultMsg);
                                }
                                tableIns.reload();
                                layer.close(index);
                            }
                        })
                    });
                    return false;
                }
            });

          //监听收起
          form.on('submit(moreSearch)', function (data) {
            if ($(this).children().hasClass("fa-chevron-down")) {
              //显示更多条件
              $(this).parents(".layui-form").find(".aa").show();
              //修改更多按钮图标
              $(this).html('<i class="fa fa-chevron-up">&nbsp;</i>收起筛选');
            } else {
              //显示更多条件
              $(this).parents(".layui-form").find(".aa").hide();
              //修改更多按钮图标
              $(this).html('<i class="fa fa-chevron-down">&nbsp;</i>展开筛选');
            }
            return false;
          });
              form.on('select(orderBy)', function(data){
                reloadTable();
                return false;

              });

          $("#key").keypress(function(e){
            if (e.which == 13){
              reloadTable();
              return false;
            }
          });

          function reloadTable() {
            table.reload("borroringListTable", {
              page: {
                curr: 1 //重新从第 1 页开始
              },
              where: {
                key: $("#key").val(),
                department: $("#department").val(),
                borrowStatus: $("#borrowStatus").val(),
                orderBy: $("#orderBy").val()
              }
            });
          }

            //监听查询
            form.on('submit(formDemo)', function (data) {
              reloadTable();
                return false;
            });
            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("input").val("");
                $(this).parents(".layui-form").find("select").val("");
                form.render();
                table.reload("borroringListTable", {
                    page: {
                        curr: 1 //重新从第 1 页开始
                    },
                    where: {
                        key: "",
                        department: "",
                        borrowStatus: "",
                        orderBy: ""
                    }
                });
                return false;
            });


        });
    }
}
main.init();

