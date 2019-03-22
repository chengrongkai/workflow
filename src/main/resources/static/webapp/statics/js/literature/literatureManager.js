var projectName = property.getProjectPath();

var main = {

  init: function () {
    this.initTable();
    this.tabBind();
    this.getSelectData();
    $('.upload').click(function () {
      parent.$t.goToPage(this, "page/literature/literatureManager.html");
    })
  },
  initTable: function () {
    var module = localStorage.functinId;
    var _this = this;
    layui.use(['form','table'], function () {
      var form = layui.form;
      table = layui.table;
      tableIns = table.render({
        elem: '#literature'
        , url: projectName + '/postLiterature/postLiteratureList.do?module='+module
        , request:{
              pageName: 'currentPage',
              limitName: 'size'
            }
        , toolbar: '#literaturetoolbar'
        , title: '文献资料列表'
        , defaultToolbar:[]
        , cols: [[
            {type: 'checkbox', fixed: 'left'}
          , {type: 'numbers', title: '序号'}
          , {field: 'dataName', title: '文献名称', width: 100}
          , {field: 'dataTypeName', title: '文献类型', width: 120}
          , {field: 'number', title: '数量', width: 85}
          , {field: 'inventoryState', title: '库存数量', width: 100}
          , {field: 'price', title: '单价', width: 100}
          , {field: 'press', title: '出版社'}
          , {field: 'publishingTime', title: '出版时间', width: 80, sort: true}
          , {field: 'warehousesName', title: '入库人', width: 100}
          , {field: 'literatureTypeTwo', title: '文献分类', width: 100, sort: true}
          , {field: 'callNo', title: '分类索书号', width: 100}
          , {field: 'statusName', title: '状态', width: 100}
          , {field: 'permissionsSettingsName', title: '权限设置', width: 100}
          , {fixed: 'right', title: '操作', toolbar: '#barDemo', width: 170}
        ]]
        , page: true
        ,limits : [10,15,20,25]
        , limit : 10
        , id : "literatureTable"
      });
      //头工具栏事件
      table.on('toolbar(literature)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        var data = checkStatus.data;
        switch (obj.event) {
          case 'batchRecall':
              var arr1=[];
              for(var i=0;i<data.length;i++){
                //已公开数据可以撤回
                if (data[i].status === "2") {
                  arr1.push(data[i].id);
                }
              }
              var len = arr1.length;
              if (len > 0) {
                layer.confirm('当前已选择'+ len + '项有效数据，确认撤回吗？', {
                  title:"撤回确认",
                  area: ['450px', '218px'],
                  skin: 'demo-class',
                  btn: ['取消', '确认']
                }, function(index, layero){
                  layer.close(index);
                }, function(index){
                  var data = {arr:arr1};
                  $.ajax({
                    url:projectName + '/postLiterature/batchRecall.do',
                    type:'post',
                    data:data,
                    success:function(result) {
                      if (result.success == "1") {
                        successMsg("批量撤回成功！");
                      } else if (result.success == "0"){
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
          case 'batchSetting':

            var arr2=[];
            for(var j=0;j<data.length;j++){
              //已公开数据可以设置权限
              if (data[j].status === "2") {
                arr2.push(data[j]);
              }
            }
            var len = arr2.length;
            if (len > 0) {
              layer.confirm('', {
                title:"设置确认",
                area: ['450px', '218px'],
                skin: 'demo-class',
                success: function(layero, index){
                  form.render();
                },
                content:"<form class='layui-form' id='batchSetForm'>"
                + "<div class='layui-form-item'>"
                + "<div><span>当前已选择"
                + len
                + "项有效数据，确认设置吗？</span></div>"
                + "<div class='layui-input-block' style='margin-left: 0px' id='batchSetting'>"
                + "<input type='radio' name='setting' value='1' title='不公开' checked>"
                + "<input type='radio' name='setting' value='2' title='公开可查询'>"
                + "<input type='radio' name='setting' value='3' title='公开可下载'>"
                + "</div>"
                + "</div>"
                + "</form>",
                btn: ['取消', '确认']
              }, function(index, layero){
                layer.close(index);
              }, function(index){

                var arr3=[];
                var batchSetting = $('#batchSetting input[name="setting"]:checked ').val();
                for (var k = 0;k < arr2.length;k++) {
                  if (batchSetting == 2) {
                    if (arr2[k].dataType == 1 || arr2[k].dataType == 3) {
                      arr3.push(arr2[k].id)
                    }
                  } else if (batchSetting == 3) {
                    if (arr2[k].dataType == 2) {
                      arr3.push(arr2[k].id)
                    }
                  } else {
                    arr3.push(arr2[k].id)
                  }
                }
                var data = {arr:arr3,setting:batchSetting};
                $.ajax({
                  url:projectName + '/postLiterature/batchSetting.do',
                  type:'post',
                  data:data,
                  success:function(result) {
                    if (result.success == "1") {
                      successMsg("批量设置成功！");
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
          case 'batchExport':
            $(".daochuList").toggleClass("show");
            $(".daochuList li").off().on('click', function (e) {
              stopBubble(e);
              if ($(this).index() == 0) {
                if (data.length > 0) {
                  table.exportFile(tableIns.config.id, data,'xls');
                } else {
                  alertMsg("未选中有效项！");
                }
                return false;
              } else if ($(this).index() == 1) {
                var allData = table.cache.literatureTable;
                table.exportFile(tableIns.config.id, allData,'xls');
                return false;
              } else {
//              window.location.href=projectPath + '/collectionInfo/batchExport.do';

                return false;
              }
            });
            break;
        }
      });
      document.addEventListener('click', function (e) {
        if (!$(e.target).hasClass("daochuList") && !$(e.target).hasClass(
                "daochu")) {
          $(".daochuList").removeClass("show");
        }
        return false
      });
      function stopBubble(e){

        if(e && e.stopPropagation)

          e.stopPropagation()

        else

          window.event.cancelBubble = true

      }

      //监听行工事具件
      table.on('tool(literature)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
          layer.confirm('您确定要删除吗？', {
            title:'删除确认',
            area: ['450px', '218px'],
            skin: 'demo-class',
            btn: ['取消', '确认']
          }, function(index, layero){
            layer.close(index);
          }, function(index){
            $.ajax({
              url:projectName + '/postLiterature/modifyState.do',
              type:'post',
              data:{"id":data.id,"status":"0"},
              success:function(result) {
                if (result.success == "1") {
                  successMsg("删除成功！");
                } else if (result.success == "0"){
                  var resultMsg = result.error.message;
                  errorMsg(resultMsg);
                }
                tableIns.reload();
                layer.close(index);
              }
            })
          });
          return false;

        } else if (obj.event === 'edit') {
          parent.$t.goToPage(this, "page/literature/literatureManager.html");
        } else if (obj.event === 'pub') {
          layer.confirm('您确定要发布吗？', {
            title:'发布确认',
            area: ['450px', '218px'],
            skin: 'demo-class',
            btn: ['取消', '确认']
          }, function(index, layero){
            layer.close(index);
          }, function(index){
            $.ajax({
              url:projectName + '/postLiterature/modifyState.do',
              type:'post',
              data:{"id":data.id,"status":"2"},
              success:function(result) {
                if (result.success == "1") {
                  successMsg("发布成功！");
                } else if (result.success == "0"){
                  var resultMsg = result.error.message;
                  errorMsg(resultMsg);
                }
                tableIns.reload();
                layer.close(index);
              }
            })
          });
          return false;
        } else if (obj.event === 'recall') {
          layer.confirm('您确定要撤回吗？', {
            title:'撤回确认',
            area: ['450px', '218px'],
            skin: 'demo-class',
            btn: ['取消', '确认']
          }, function(index, layero){
            layer.close(index);
          }, function(index){
            $.ajax({
              url:projectName + '/postLiterature/modifyState.do',
              type:'post',
              data:{"id":data.id,"status":"3"},
              success:function(result) {
                if (result.success == "1") {
                  successMsg("撤回成功！");
                } else if (result.success == "0"){
                  var resultMsg = result.error.message;
                  errorMsg(resultMsg);
                }
                tableIns.reload();
                layer.close(index);
              }
            })
          });
          return false;
        } else if (obj.event === 'set') {
          var setContent = "";
          if (data.dataType == 2) {
            setContent = "<form class='layui-form' id='setForm'>"
                + "<div class='layui-form-item'>"
                + "<div><span>下载设置</span></div>"
                + "<div class='layui-input-block' style='margin-left: 0px' id='setting'>"
                + "<input type='radio' name='setting' value='1' title='不公开' checked>"
                + "<input type='radio' name='setting' value='3' title='公开可下载'>"
                + "</div>"
                + "</div>"
                + "</form>"
          } else {
            setContent = "<form class='layui-form' id='setForm'>"
                + "<div class='layui-form-item'>"
                + "<div><span>下载设置</span></div>"
                + "<div class='layui-input-block' style='margin-left: 0px' id='setting'>"
                + "<input type='radio' name='setting' value='1' title='不公开' checked>"
                + "<input type='radio' name='setting' value='2' title='公开可查询'>"
                + "</div>"
                + "</div>"
                + "</form>"
          }
          layer.confirm('', {
            title:'设置确认',
            area: ['450px', '218px'],
            skin: 'demo-class',
            success: function(layero, index){
              form.render();
            },
            content:setContent,
            btn: ['取消', '确认']
          }, function(index, layero){
            layer.close(index);
          }, function(index){
            var setting = $('#setting input[name="setting"]:checked ').val()
            $.ajax({
              url:projectName + '/postLiterature/modifyState.do',
              type:'post',
              data:{"id":data.id,"setting":setting},
              success:function(result) {
                if (result.success == "1") {
                  successMsg("设置成功！");
                } else if (result.success == "0"){
                  var resultMsg = result.error.message;
                  errorMsg(resultMsg);
                }
                tableIns.reload();
                layer.close(index);
              }
            })
          });
          return false;
        } else if (obj.event === 'show') {
          parent.$t.goToPage(this, "page/literature/literatureManager.html");
        }
      });
    });
  },
  tabBind: function () {
    layui.use(['form'], function () {
      var form = layui.form;

      $("#addNew").click(function(){
        localStorage.pageType = "1";
      })


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
      //监听switch操作
      form.on('switch(sexDemo)', function (obj) {
        layer.tips(this.value + ' ' + this.name + '：' + obj.elem.checked,
            obj.othis);
      });
      form.on('select(batchImport)',function(obj) {
        var value = obj.value;
        $("#defaultSelect").attr("selected","selected");
        form.render();
        //1下载模板 2导入
        if (value === "1") {
          window.location.href=projectName + '/postLiterature/downDemo.do?type=1';
        } else if (value === "2") {
          window.location.href=projectName + '/postLiterature/downDemo.do?type=2';
        } else if (value === "3") {
          $("#uploadFile").click();
        }

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
        table.reload("literatureTable",{
          page: {
            curr: 1 //重新从第 1 页开始
          },
          where: {
            key:$("#key").val(),
            dataType:$("#dataType").val(),
            status:$("#status").val(),
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
        $(this).prev().click();
        table.reload("literatureTable",{
          page: {
            curr: 1 //重新从第 1 页开始
          },
          where: {
            key:"",
            dataType:"",
            status:"",
            orderBy:""
          }
        })
        return false;
      });
    });

  },

  getSelectData:function () {
    layui.use(['form'], function () {
      var form = layui.form;

      var data = {arr:['literature_type','submit_state','order_by']};
      $.ajax({
        type:"post",
        url:projectName + '/sysDict/getSelectDataByArea.do',
        data:data,
        success:function(result) {
          if (result.success == 1) {
            var map = result.data;

            var submit_state = map.submit_state;
            var submitStateStr = "";
            for(var i = 0;i < submit_state.length;i++) {
              literatureTypeStr +="<option value='"+submit_state[i].dictCode+"' >"+submit_state[i].dictName+"</option>"
            }
            $("#status").append(literatureTypeStr);

            var literature_type = map.literature_type;
            var literatureTypeStr = "";
            for(var j = 0;j < literature_type.length;j++) {
              literatureTypeStr +="<option value='"+literature_type[j].dictCode+"' >"+literature_type[j].dictName+"</option>"
            }
            $("#dataType").append(literatureTypeStr);

            var order_by = map.order_by;
            var orderStr = "";
            for(var k = 0;k < order_by.length;k++) {
              orderStr +="<option value='"+order_by[k].dictCode+"' >"+order_by[k].dictName+"</option>"
            }
            $("#orderBy").append(orderStr);

            form.render();
          }
        }
      })

    });
  }
};
main.init();

function uploadValue(value) {
  var name = value.substring(value.lastIndexOf(".")+1).toLowerCase();
  if (name =="xls" || name =="xlsx") {
    var form_data = new FormData();
    var file_data = $("#uploadFile").prop("files")[0];
    form_data.append("file",file_data);
    var loadingIndex = loadingMsg("导入中,请稍后！");
    $.ajax({
      type: 'post',
      url: projectName + '/postLiterature/batchImport.do',
      data: form_data,
      dataType : "json",
      cache: false,
      processData: false,
      contentType: false,
      success:function(result) {
        resetFileInput($("#uploadFile"));
        layui.layer.close(loadingIndex);
        if (result.success == "1") {
          successMsg("批量导入成功！")
          tableIns.reload();
        } else if (result.success == 0){
          var resultMsg = result.error.message;
          errorMsg(resultMsg);
        }
      },
      error:function(result) {
        resetFileInput($("#uploadFile"));
        layui.layer.close(loadingIndex);
        errorMsg("系统异常");
      }
    })
  } else {
    alertMsg("请选择excel格式文件上传！");
    return false;
  }
}
function resetFileInput(file){
  file.after(file.clone().val(""));
  file.remove();

}




