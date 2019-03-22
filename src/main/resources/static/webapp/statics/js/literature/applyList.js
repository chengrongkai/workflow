var projectName = property.getProjectPath();
var main = {
  init: function () {
    userId = "";
    userName = "";
    initData();
    function initData() {
      if (!isEmpty(localStorage.userInfo)) {
        var userInfo = JSON.parse(localStorage.userInfo);
        userId = userInfo.userId;
        userName = userInfo.userName;
        roles = userInfo.roles;
      }
    }
    this.initTable();
    $('#addNew').click(function () {
      parent.$t.goToPage(this, "page/literature/applyList.html");
    })
  },
  initTable: function () {
      var  module = localStorage.functinId;
    var _this = this;
    layui.use(['form', 'table'], function () {
      var table = layui.table,
          form = layui.form;
      var tableIns = table.render({
        elem: '#applyList'
        , url: projectName + '/postLiteratureProcess/postLiteratureProcessList.do?module='+module
        , request:{
          pageName: 'currentPage',
          limitName: 'size'
        }
        , toolbar: '#toolbarDemo'
        , title: '申请审批列表'
        , cols: [[
            {type: 'checkbox', fixed: 'left'}
          , {type: 'numbers', title: '序号'}
          , {field: 'literatureName', title: '文献名称', width: 100}
          , {field: 'inventoryState', title: '库存数量', width: 120}
          , {field: 'literatureTypeName', title: '文献类型', width: 100}
          , {field: 'applyTypeName', title: '申请事项', width: 100}
          , {field: 'applicantName', title: '申请人', width: 130}
          , {field: 'departmentName', title: '所属部门'}
          , {field: 'applyReasons', title: '申请原因', width: 120, sort: true}
          , {field: 'applyDate', title: '申请日期', width: 120}
          , {field: 'approveStatusName', title: '申请状态', width: 120}
          , {field: 'applyRemark', title: '备注', width: 120}
          , {fixed: 'right', title: '操作', width: 180, templet:function(d) {
            if (d.approveStatus == 1) {
              //审批人是自己
              if (d.approveId == userId ) {
                return '<a class="layui-btn layui-btn-xs" lay-event="show" data-url="page/literature/literatureApplyApproval.html" title="文献资料-查看">查看</a>'
                    + '<a class="layui-btn layui-btn-xs cy-page" lay-event="edit" data-url="page/literature/literatureApplyApproval.html" title="文献资料-审批">审批</a>'
              //申请人是自己
              } else {
                return '<a class="layui-btn layui-btn-xs" lay-event="show" data-url="page/literature/literatureApplyApproval.html" title="文献资料-查看">查看</a>'
              }
              //审批通过并且是电子版可下载
            } else if (d.approveStatus == 2 && d.applyType == 2) {
              return '<a class="layui-btn layui-btn-xs" lay-event="show" data-url="page/literature/literatureApplyApproval.html" title="文献资料-查看">查看</a>'
                  + '<a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="down" title="文献资料-下载">下载</a>'
            } else {
              return '<a class="layui-btn layui-btn-xs" lay-event="show" data-url="page/literature/literatureApplyApproval.html" title="文献资料-查看">查看</a>'
            }
          }}
        ]]
        , done: function(res, curr, count){
          for (var i = 0;i < roles.length;i++) {
            if (roles[i].roleCode == "literatureManager") {
              break;
            }
            if (i == roles.length-1) {
              if (roles[i].roleCode != "literatureManager") {
                $("#batchApprove").hide();
              }
            }
          }
        }
        , page: true
        ,limits : [10,15,20,25]
        , limit : 10
        , id : "applyListTable"
      });
      getSelectData();
      function getSelectData() {

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

        var data = ['approve_status','order_by'];
        var map = property.getDictDataMulti(data);

        var approve_status = map.approve_status;
        var approveStatusStr = "";
        for(var i = 0;i < approve_status.length;i++) {
          approveStatusStr +="<option value='"+approve_status[i].dictCode+"' >"+approve_status[i].dictName+"</option>"
        }
        $("#approveStatus").append(approveStatusStr);

        var order_by = map.order_by;
        var orderStr = "";
        for(var k = 0;k < order_by.length;k++) {
          orderStr +="<option value='"+order_by[k].dictCode+"' >"+order_by[k].dictName+"</option>"
        }
        $("#orderBy").append(orderStr);

        form.render();
      }

      //头工具栏事件
      table.on('toolbar(applyList)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);

        switch (obj.event) {
          case 'getCheckData':
            var data = checkStatus.data;
            var arr=[];
            //待审批数据可以批量审批
            for(var i=0;i<data.length;i++){
              if (data[i].approveStatus === "1") {
                arr.push(data[i].id);
              }
            }
            var len = arr.length;
            if (len > 0) {
              layer.confirm('', {
                title:"批量审批确认",
                area: ['500px', '350px'],
                skin: 'demo-class',
                content:"<form class='layui-form' id='batchSetForm'>"
                + "<div class='layui-form-item'>"
                + "<div><span>当前已选择"
                + len
                + "项有效数据，确认批量审批吗？</span></div>"
                + "<div class='layui-input-block' style='margin-left: 0px' id='batchSetting'>"
                + "<input type='radio' name='approveOperation' value='1' title='通过' checked lay-filter='approveOperation'>"
                + "<input type='radio' name='approveOperation' value='2' title='驳回'  lay-filter='approveOperation'>"
                + "<input type='radio' name='approveOperation' value='3' title='通过并提交审批'  lay-filter='approveOperation'>"
                + "</div>"
                + "<div class='layui-input-block layui-hide' style='margin-left: 0px' id='approveDiv'>"
                + "<input type='text' class='layui-hide' name='approveName' id='approveName'>"
                + "<input type='text' class='layui-hide' name='preApproveId' id='preApproveId'>"
                + "<input type='text' class='layui-hide' name='approveId' id='approveId'>"
                + "<select name='approve' id='approve'  lay-filter='approveId' lay-search>"
                + "<option value=''>请选择</option>"
                + "</select>"
                + "</div>"
                + "<div class='layui-inline layui-col-md2 layui-col-sm2 ' style='margin-left: 0px'>备注</div>"
                + "<div class='layui-form-item m0 layui-col-md6 layui-col-sm6'>"
                + "<input type='text' name='approveRemark' id='approveRemark' placeholder='请输入' autocomplete='off' class='layui-input'>"
                + "</div>"
                + "</div>"
                + "</form>",
                success: function(layero, index){
                  if (!isEmpty(localStorage.userInfo)) {
                    var userInfo = JSON.parse(localStorage.userInfo);
                    $("#preApproveId").val(userInfo.userId);
                  }
                  $.ajax({
                    url:projectName + '/postLiteratureProcess/getApproveList.do',
                    type:'post',
                    contentType:"application/json; charset=utf-8",
                    success:function(res) {
                      if (res.success == 1) {
                        var list = res.data;
                        var approveStr = "";
                        for (var i = 0;i < list.length;i++) {
                          approveStr +="<option value='"+list[i].id+"' >"+list[i].name+"</option>"
                        }
                        $("#approve").append(approveStr);
                        form.render();
                      }
                    }
                  });
                },
                btn: ['取消', '确认']
              }, function(index, layero){
                layer.close(index);
              }, function(index){
                var batchSetting = $('#batchSetting input[name="approveOperation"]:checked ').val();
                var approveName = $("#approveName").val();
                var preApproveId = $("#preApproveId").val();
                var approveId = $("#approveId").val();
                var approveRemark = $("#approveRemark").val();
                var data = {"arr":arr,"setting":batchSetting,"approveName":approveName,"preApproveId":preApproveId,"approveId":approveId,"approveRemark":approveRemark};
                $.ajax({
                  url:projectName + 'postLiteratureProcess/batchApprove.do',
                  type:'post',
                  data:data,
                  success:function(result) {
                    if (result.success == "1") {
                      successMsg("批量审批成功！");
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
              alertMsg("未选中有效项！");
            }
            break;
        }
        ;
      });
      form.on('radio(approveOperation)', function(data){
        var approveOperationVal =  data.value;
        if (approveOperationVal == "3") {
          $("#approveDiv").removeClass("layui-hide");
          $("#approveDiv").show();
          $("#approveId").attr("lay-verify","required");
        } else {
          $("#approveDiv").hide();
          $("#approveId").removeAttr("lay-verify");
          $("#approveName").val("");
          $("#approveId").val(userId);
        }
      });
      form.on('select(approveId)', function(data){
        var value = data.value;
        for(var i=0;i<$('#approve option').length;i++){
          var dataValue = $('#approve option').eq(i).attr("value");
          if (value == dataValue) {
            var dataName = $('#approve option').eq(i).text();
            $("#approveName").val(dataName);
            $("#approveId").val(value);
            break;
          }
        }
      });

      form.on('select(orderBy)', function(data){
        reloadTable();
        return false;
      });

      //监听行工具事件
      table.on('tool(applyList)', function (obj) {
        var data = obj.data;

        if (obj.event === 'edit') {
          if (data.inventoryState > 0) {
            sessionStorage.pageStatus = 1;
            sessionStorage.setItem("applyData",JSON.stringify(data));
            parent.$t.goToPage(this, "page/literature/applyList.html");
          } else {
            alertMsg("库存数量不足！")
          }

        } else if (obj.event === 'show') {
          sessionStorage.setItem("applyData",JSON.stringify(data));
          sessionStorage.pageStatus = 2;
          parent.$t.goToPage(this, "page/literature/applyList.html");
        } else if (obj.event === 'down') {
          window.location.href = property.getProjectPath()+'postLiterature/downloadLiteratureFile.do?postLiteratureId='+data.literatureId;
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

      $("#key").keypress(function(e){
        if (e.which == 13){
          reloadTable();
          return false;
        }
      });
      function reloadTable() {
        table.reload("applyListTable",{
          page: {
            curr: 1 //重新从第 1 页开始
          },
          where: {
            key:$("#key").val(),
            department:$("#department").val(),
            approveStatus:$("#approveStatus").val(),
            orderBy:$("#orderBy").val()
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
        table.reload("applyListTable",{
          page: {
            curr: 1 //重新从第 1 页开始
          },
          where: {
            key:"",
            department:"",
            approveStatus:"",
            orderBy:""
          }
        });
        return false;
      });
    });
  }
}
main.init();

