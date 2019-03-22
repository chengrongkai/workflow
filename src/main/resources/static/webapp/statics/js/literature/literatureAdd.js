var projectName = property.getProjectPath();
var collectArray = [];
var choseCollect = [];
var tableId = '';
var userInfo = null;
var attachmentsList = null;
var attCount = 0;
var pageType = "";
var main = {

  init: function () {
    pageType = getQueryString("pageType");
    if (pageType == 1) {
      tableId = property.getTimeJson();
      $("#attachmentId").val(tableId);
    }
    this.initTable();
    this.tabBind();
    this.getPageData();

    $(".quxiao").click(function () {
      $('.myRefresh', window.parent.document).click();
    })

  },
  getPageData: function () {

  },

  initTable: function () {
    initData();

    function initData() {

      if (!isEmpty(localStorage.userInfo)) {
        userInfo = JSON.parse(localStorage.userInfo);
        $("#headUserName").text(userInfo.userName);
        $("#headRole").text(userInfo.orgName);
        var nowdate = getNowFormatDate();
        $("#headDate").text(nowdate);
      }

    }

      layui.config({
          base: '../../common/js/formSelects-v4.js' //此处路径请自行处理, 可以使用绝对路径
      }).extend({
          formSelects: 'formSelects-v4'
      });



    $.get(projectName + "postLiterature/getLiteratureType.do", function (res) {
        layui.use(['element', 'tree', 'layer', 'form', 'upload'], function () {
            var $ = layui.jquery, tree = layui.tree;
            tree({
                elem: "#classtree"
                ,
                nodes: res.data
                ,
                click: function (node) {
                    if (pageType == 3) {
                        return false;
                    } else {
                        var children = node.children;
                        if (null == children || children.length == 0) {
                            var $select = $($(this)[0].elem).parents(".layui-form-select");
                            $select.removeClass("layui-form-selected").find(".layui-select-title span").html(node.name).end().find("input:hidden[name='selectID']").val(node.id);
                            if (null != $('#dataName').val() && $('#dataName').val() != '') {
                                $('#buildCallNo').click();
                            } else {
                                $('#callNo').val('');
                            }
                        } else {
                            return false;
                        }
                    }
                }
            });
            $(".downpanel").on("click", ".layui-select-title", function (e) {
                if (pageType == 3) {
                    return false;
                }
                $(".layui-form-select").not($(this).parents(".layui-form-select")).removeClass("layui-form-selected");
                $(this).parents(".downpanel").toggleClass("layui-form-selected");
                layui.stope(e);
                return false;
            }).on("click", "dl i", function (e) {
                layui.stope(e);
                return false;
            });
            /*$(document).on("click", function (e) {
                $(".layui-form-select").removeClass("layui-form-selected");
            });*/

        });
    })

    $('#dataName').keyup(function () {
        $('#dataNameTemp').val("资料名称：" + $('#dataName').val());
        if (null != $('#selectID').val() && $('#selectID').val() != '') {
            $('#buildCallNo').click();
        } else {
            $('#callNo').val("");
        }
    });
    $('#dataName').change(function () {
        $('#dataNameTemp').val("资料名称：" + $('#dataName').val());
        if (null != $('#selectID').val() && $('#selectID').val() != '') {
            $('#buildCallNo').click();
        } else {
            $('#callNo').val("");
        }
    });

    $('#buildCallNo').click(function () {
        var dataName = $('#dataName').val();
        var selectID = $('input[name=selectID]').val();
        if (null == dataName || dataName == '') {
            alertMsg("请输入资料名称");
            return false;
        }
        if (null == selectID || selectID == '') {
            alertMsg("请选择文献分类");
            return false;
        }
        $.post(projectName + "postLiterature/getSerialNumber.do", {
            dataName: dataName,
            selectID: selectID
        }, function (res) {
            if (res.success == 1) {
                $('#callNo').val(res.data.callNo);
                $('#searchValue').val(res.data.searchValue);
            }
        })
    })
    layui.use(['upload', 'element','laydate','form'], function () {
      var $ = layui.jquery,
          laydate = layui.laydate,
          form = layui.form,
          upload = layui.upload, element = layui.element;


        form.verify({
            number2Mix : function(value) {
                var reg = /^\d+(\.\d{0,2})?$/;
                if (!reg.test(value)) {
                    return '请输入最多包含两位小数的数字';
                }
            }
        });


        $.get(projectName + 'interfaceCollect/getCollctTypeList.do', function (res) {
            if (res.success == 1) {
                var data = res.data;
                for (var i = 0, length = data.length; i < length; i++) {
                    var option = $('<option value="'+ data[i].typeCode +'">'+ data[i].typename +'</option>');
                    $('#culCategory').append(option);
                }
                form.render("select");
            } else {
                layer.msg(res.message, {icon:5, })
            }
        });
        var formSelects = layui.formSelects;
        formSelects.config('select1', {
            keyName: 'culName',            //自定义返回数据中name的key, 默认 name
            keyVal: 'culId',            //自定义返回数据中value的key, 默认 value
            success: function(id, url, searchVal, result){      //使用远程方式的success回调
                collectArray = result.data;
            },
        }, true);
        var culName = $($($('.xm-select-label')[0]).children()[0]).val();
        formSelects.data('select1', 'server', {
            url:property.getProjectPath()+"interfaceCollect/getCollectByTypeAndName.do"
        });

        form.on('select(culCategory)', function(data){
            var formSelects = layui.formSelects;
            formSelects.config('select1', {
                keyName: 'culName',            //自定义返回数据中name的key, 默认 name
                keyVal: 'culId',            //自定义返回数据中value的key, 默认 value
                success: function(id, url, searchVal, result){      //使用远程方式的success回调
                    collectArray = result.data;
                },
            }, true);
            var culName = $($($('.xm-select-label')[0]).children()[0]).val();
            formSelects.data('select1', 'server', {
                url:property.getProjectPath()+"interfaceCollect/getCollectByTypeAndName.do?culCategory="+data.value
            });
        });

        //添加藏品
        $("#addCollect").click(function(){
            var formSelects = layui.formSelects;
            var ids = formSelects.value('select1', 'val');
            var hasAddName = [];
            for (var i = 0, length = ids.length; i < length; i++) {
                var id = ids[i];
                var flg = false;
                for (var j = 0, size = choseCollect.length; j < size; j++) {
                    var collect = choseCollect[j];
                    if (id == collect.culId) {
                        hasAddName.push(collect.culName);
                        flg = true;
                        break;
                    }
                }
                if (flg) {
                    continue;
                }
                for (var j = 0, size = collectArray.length; j < size; j++) {
                    var collect = collectArray[j];
                    if (id == collect.culId) {
                        choseCollect.push(collect);
                        $('#choseCollectList').append($('<div class="layui-btn layui-btn-sm" id="'+collect.culId+'">'+collect.culName+'&nbsp;<i class="layui-icon" onclick="deleteCollect(\''+collect.culId+'\')">&#x1006;</i></div>'));
                        break;
                    }
                }
            }
        });

      //执行一个laydate实例
      laydate.render({
        elem: '#publishingTime' //指定元素
      });
      laydate.render({
        elem: '#warehousingTime' //指定元素
      });

      form.on('select(dataType)',function(data) {
        if (data.value == 2) {
          // $("#inventoryState option").eq(0).text("/");
          // $("#inventoryState option").eq(0).attr("selected",true);
          // $("#inventoryState").removeAttr("lay-verify");
          // $("#inventoryState").attr("disabled","disabled");

          $("#permissionsSettings3").removeClass("layui-hide");
          $("#number").val("1");
          $("#number").attr("disabled","disabled");
          form.render();
          $("#permissionsSettings2").next().addClass("layui-hide");
          $("#permissionsSettings3").next().removeClass("layui-hide");
          $("#callNoDiv").addClass("layui-hide");
          $("#callNo").val("");
          $("#searchValue").val("");
        } else {
          // $("#inventoryState option").eq(0).text("请选择");
          // $("#inventoryState").attr("lay-verify","required");
          // $("#inventoryState").removeAttr("disabled");
          $("#number").val("");
          $("#number").removeAttr("disabled");
          form.render();
          $("#permissionsSettings3").next().addClass("layui-hide");
          $("#permissionsSettings2").next().removeClass("layui-hide");
          $("#callNoDiv").removeClass("layui-hide")
        }
      });

      form.on('submit(saveAndSubmit)', function (data) {
        data.field.submitType = "2";
        saveInfo(data);
        return false;
      });
      form.on('submit(save)', function (data) {
        data.field.submitType = "1";
        saveInfo(data);
        return false;
      });

      function saveInfo(data) {
        var data = data.field;
        data.literatureTypeOne = $('input[name=selectID]').val();
        data.literatureTypeTwo = $('#treeclass').html();
        data.warehouses = userInfo.userId;
        var callNo = data.callNo;
        var dataType = $('#dataType').val();
        if (dataType != 2 && (null == callNo || callNo == '')) {
            $('#callNo').css("border", "2px solid, red");
            $('#callNo').blur();
            errorMsg("索书号不能为空")
            return false;
        }
        if (null == data.literatureTypeOne || data.literatureTypeOne == '' || null == data.literatureTypeTwo || data.literatureTypeTwo == '') {
            errorMsg("请选择文献分类");
            return false;
        }
        var literatureRelated = [];
        for (var i = 0; i < choseCollect.length; i++) {
            literatureRelated.push({
                culId: choseCollect[i].culId,
                culName: choseCollect[i].culName
            })
        }
        data.literatureRelated = JSON.stringify(literatureRelated);

        $.ajax({
          url:projectName + '/postLiterature/postLiteratureSave.do',
          type:"post",
          data:data,
          success:function (res) {
            if (res.success == 1) {
              if (data.submitType == 1) {
                successMsg("保存成功！");
              } else if (data.submitType == 2) {
                successMsg("提交成功！");
              }
              $('.msg').css("top","300px");
              setTimeout(function () {
                $('.myRefresh', window.parent.document).click();
              },800)
            } else if (res.success == 0){
              errorMsg();
              $('.msg').css("top","300px");
            }
          }
        })
      }


      function getDictData() {
        var arr = ['literature_type', 'inventory_state', 'format', 'edition'];
        var dictDatas = property.getDictDataMulti(arr);
        var literature_type = dictDatas.literature_type;
        var inventory_state = dictDatas.inventory_state;
        var format = dictDatas.format;
        var edition = dictDatas.edition;

        var dataTypeStr = component.getSelectSimplePlus(literature_type, null, "dataType", "dictCode", "dictName");
        // var inventoryStateStr = component.getSelectSimplePlus(inventory_state, null, "inventoryState", "dictCode", "dictName");
        var formatStr = component.getSelectSimplePlus(format, null, "format", "dictCode", "dictName");
        var editionStr = component.getSelectSimplePlus(edition, null, "edition", "dictCode", "dictName");

        $("#dataType").append(dataTypeStr);
        // $("#inventoryState").append(inventoryStateStr);
        $("#format").append(formatStr);
        $("#edition").append(editionStr);
        form.render('select');
      }

      function getSelectData(pageType) {
        $.ajax({
          type:'get',
          url:projectName + '/postLiterature/getSelectData.do',
          success:function(result) {
            if (result.success == 1) {
              var map = result.data;
              var userList = map.userList;
              var userListStr = "";
              for (var i = 0;i < userList.length;i++) {
                userListStr +="<option value='"+userList[i].id+"' >"+userList[i].name+"</option>"
              }
              $("#warehouses").append(userListStr);

              form.render();

              if (!isEmpty(pageType) && pageType != 1) {
                setData(pageType);
              } else {
                getUpload();
              }
            }
          },
          error:function(result) {

          }
        })
      }
      function setData(pageType) {
        this.id = parent.$t.getQueryStringFrame('id');
        $.post(projectName + "postLiterature/getLiteratureBLOBSById.do", {
            id: id
        }, function (res) {
            if (res.success == 1) {
                var dataObject = res.data;
                property.setForm($("#addForm"),dataObject);
                var dataType = $("#dataType").val();
                if (dataType == "2") {
                  // $("#inventoryState option").eq(0).text("/");
                  // $("#inventoryState option").eq(0).attr("selected",true);
                  // $("#inventoryState").removeAttr("lay-verify");
                  // $("#inventoryState").attr("disabled","disabled");
                  $("#number").val("1");
                  $("#number").attr("disabled","disabled");
                }
                form.render();
                $("#uploadList").text(dataObject.attachmentName);
                form.val("addForm", dataObject);
                $('#dataNameTemp').val("资料名称：" + dataObject.dataName);
                $('#treeclass').html(dataObject.literatureTypeTwo);
                $('#selectID').val(dataObject.literatureTypeOne);
                var collects = eval(dataObject.literatureRelated);
                if (null != collects && collects.length > 0) {
                    for (var i = 0; i < collects.length; i++) {
                        var collect = collects[i];
                        choseCollect.push(collect);
                        var str = '<div class="layui-btn layui-btn-sm" id="'+collect.culId+'">'+collect.culName+'&nbsp;';
                        if (pageType != 3) {
                            str += '<i class="layui-icon" onclick="deleteCollect(\''+collect.culId+'\')">&#x1006;</i>';
                        }
                        str += '</div>';
                        $('#choseCollectList').append($(str));
                    }
                }
                // $('#callNo').val(dataObject.callNo);
                // $('#searchValue').val(dataObject.searchValue);
                $("#warehouses option[value='"+dataObject.warehouses+"']").attr("selected",true);
                $("input[name='permissionsSettings'][value='"+ dataObject.permissionsSettings +"']").attr('checked',true);
                tableId = dataObject.attachmentId;
                attachmentsList = loadAttachments(tableId);
                var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
                $("#attachmentsList").append(attachmentsListSelect);
                form.render();
                if (dataObject.dataType == 2) {
                  $("#permissionsSettings2").next().addClass("layui-hide");
                  $("#permissionsSettings3").next().removeClass("layui-hide");
                } else {
                  $("#permissionsSettings3").next().addClass("layui-hide");
                  $("#permissionsSettings2").next().removeClass("layui-hide");
                }
                if (null != attachmentsList){
                    if (pageType == 3) {
                        //显示附件
                        if (null != attachmentsList){
                            var attList = '';
                            for (var i=0;i<attachmentsList.length;i++){
                                var attachment = attachmentsList[i];
                                var type = 'img'
                                var srcStr = attachment.attPath;
                                var data = attachment.attPath;
                                if (attachment.attFileType == 1){
                                    type = 'img';
                                }else if (attachment.attFileType == 4){
                                    type = 'video';
                                    srcStr = "../../statics/img/分组 2.svg";
                                }else if (attachment.attFileType == 3){
                                    type = 'audio'
                                    srcStr = "../../statics/img/分组 3.svg";
                                }
                                var liStr = "<li class=\"imgItem\" data-type="+type+">\n" +
                                    "                                <img src='"+srcStr+"' alt='' data='"+data+"'>\n" +
                                    "                                <p class='myfont'>"+attachment.attName+"</p>\n" +

                                    "                            </li>";
                                attList = attList+liStr;

                            }
                            $(".imgList").append(attList);
                            $(".imgList li").on({
                                'click':function () {
                                    if($(this).attr("data-type")=="img"){
                                        parent.layer.open({
                                            type: 1,
                                            title:false,
                                            closeBtn: 0, //不显示关闭按钮
                                            // area: ['420px', '240px'], //宽高
                                            shadeClose: true, //开启遮罩关闭
                                            content: "<div style='position: relative;height: 450px'><img style='max-width:" +
                                                " 600px;position:" +
                                                " absolute;max-height:100%;margin: auto;left: 0;right: 0;top:0;bottom:0'" +
                                                " src='"+$(this).find("img").attr("data")+"'/></div> "
                                            /*  content: "<div style='position: relative;height: 800px'><img style='max-width: 800px;position:" +
                                              " absolute;margin: auto;left: 0;right: 0;top:0;bottom:0'" +
                                              " src='"+$(this).find("img").attr("data")+"'/></div> "*/
                                        })
                                    }else if($(this).attr("data-type")=="video"){
                                        parent.layer.open({
                                            type: 1,
                                            title:false,
                                            closeBtn: 0, //不显示关闭按钮
                                            shadeClose: true, //开启遮罩关闭
                                            content: "<video src='"+$(this).find("img").attr("data")+ "' controls='controls'" +
                                                " height='300'>" +
                                                "您的浏览器不支持 video 标签。" +
                                                "'</video> "
                                        })
                                    }else{
                                        parent.layer.open({
                                            type: 1,
                                            title:false,
                                            closeBtn: 0, //不显示关闭按钮
                                            shadeClose: true, //开启遮罩关闭
                                            content: "<audio src='"+$(this).find("img").attr("data")+"' controls='controls'>" +
                                                "</audio> "
                                        })
                                    }
                                }
                            })
                        }
                    } else {
                        attCount = attachmentsList.length;
                        $("#demoList").append(component.getAttachmentList(attachmentsList));
                    }
                }
              if (isEmpty(tableId)) {
                tableId = property.getTimeJson();
                $("#attachmentId").val(tableId);
              }
              getUpload();
            }
        })


        if (pageType == 3) {
          $('input,select,textarea').attr("disabled","disabled");
          $('.saveBtn').hide();
          $("#upload").hide();
          $('#test10').hide();
          $('#searchCollect').hide();
          $('#buildCallNo').hide();
          // $('#addCollect').hide();
          $('#callNo').attr("disabled","disabled");
          $('#testListAction').hide();
          form.render();
        }
      }

      getDictData();
      getSelectData(pageType);

      function getUpload() {
        layui.use(['upload', 'element','laydate','form'],function() {
          var $ = layui.jquery
              ,upload = layui.upload,element = layui.element;
          var demoListView = $('#demoList')
              ,uploadListIns = upload.render({
            elem: '#test10'
            ,url: property.getProjectPath()+"attach/upload.do?tableName="+"post_literature"+"&tableId="+tableId
            ,accept: 'file'
            ,multiple: true
            ,auto: false
            ,xhr:xhrOnProgress
            ,progress:function(index,value){//上传进度回调 value进度值
              var tr = demoListView.find('#upload-'+ index)
                  ,tds = tr.children();
              tds.eq(1).html('<span style="color: red;">正在上传</span>');
              element.progress('progressBar'+index, value+'%')//设置页面进度条
            }
            ,bindAction: '#testListAction'
            ,choose: function(obj){
              var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
              //读取本地文件
              obj.preview(function(index, file, result){
                var tr=$(["<li>" +
                "<div class='upLeft' id='upload-"+index+"'>" +
                "<span class=\"fileName\">"+file.name+"</span>" +
                "<span class=\"fileState\">准备上传</span>" +
                "</div>" +
                "<div class=\"upRight\">" +
                "<div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"+index+"'>" +
                "<div class=\"layui-progress-bar layui-progress-big layui-bg-blue\" lay-percent=\"30%\">" +
                '<span class="layui-progress-text">'+'0%'+'</span>'+'</div>' +
                "</div>" +
                "<a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 layui-hide demo-reload\">重传</a>" +
                "<a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 demo-cancel\">取消</a>" +
                "</div>" +
                "</li>"].join(''));
                //单个重传
                tr.find('.demo-reload').on('click', function(){
                  obj.upload(index, file);
                });
                demoListView.append(tr);
                //删除

              });
            }
            ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
              //layer.load(); //上传loading
            }
            ,done: function(res, index, upload){
              if(res.code == 1){ //上传成功
                attCount = attCount+1;
                var tr = demoListView.find('#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(1).html('<span style="color: #5FB878;">上传成功</span>');
                //tds.eq(2).html(''); //清空操作
                tr.siblings(".upRight").find(".demo-reload").remove();
                tr.siblings(".upRight").find(".demo-cancel").addClass("demo-delete");
                tr.siblings(".upRight").find(".demo-cancel").text("删除");
                tr.siblings(".upRight").find(".demo-cancel").attr("data-id",res.data.id);
                tr.siblings(".upRight").find(".demo-delete").removeClass("demo-cancel");

                tr.siblings(".upRight").find(".layui-bg-blue").addClass("layui-bg-green");
                tr.siblings(".upRight").find(".layui-bg-green").removeClass("layui-bg-blue");
                return delete this.files[index]; //删除文件队列已经上传成功的文件
              }else {
                var tr = demoListView.find('#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(1).html('<span style="color: #5FB878;">'+res.msg+'</span>');
                //tds.eq(2).html(''); //清空操作
                //tr.siblings(".upRight").find(".demo-reload").remove();
                //tr.siblings(".upRight").find(".demo-delete").remove();
                // return delete this.files[index]; //删除文件队列已经上传成功的文件
              }
              this.error(index, upload);
            }
            ,error: function(index, upload){
              var tr = demoListView.find('#upload-'+ index)
              //     ,tds = tr.children();
              // tds.eq(1).html('<span style="color: #FF5722;">上传失败</span>');
              tr.siblings(".upRight").find('.demo-reload').removeClass('layui-hide'); //显示重传
              tr.siblings(".upRight").find(".layui-bg-blue").addClass("layui-bg-red");
              tr.siblings(".upRight").find(".layui-bg-red").removeClass("layui-bg-blue");
            }
          });
          //删除附件
          $('#demoList').on('click','.demo-delete',function(){
            var attId = $(this).attr("data-id");
            // delete files[index]; //删除对应的文件
            $(this).parent().parent().remove();
            deleteAttachment(attId);
            attachmentsList = loadAttachments(tableId);
            attCount = attCount-1;
            // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
          });
          //取消上传
          $('#demoList').on('click','.demo-cancel',function(){
            var attId = $(this).attr("data-id");
            // delete files[index]; //删除对应的文件
            $(this).parent().parent().remove();
            // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
          });
        })
      }
    });
    //删除附件
      $('#demoList').on('click','.demo-delete',function(){
          var attId = $(this).attr("data-id");
          // delete files[index]; //删除对应的文件
          $(this).parent().parent().remove();
          deleteAttachment(attId);
          attachmentsList = loadAttachments(tableId);
          attCount = attCount-1;
          // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
      });
      //取消上传
      $('#demoList').on('click','.demo-cancel',function(){
          var attId = $(this).attr("data-id");
          // delete files[index]; //删除对应的文件
          $(this).parent().parent().remove();
          // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
      });


  },

  tabBind: function () {
    //导出函数
    $(".layui-btn-green").on({
      'click': function () {
        return false
      }
    })
    //时间切换
    $(".searchBtn").on({
      'click': function () {
        var index = $(this).index();
        if ($(this).hasClass('active')) {
          return false
        }
        if (index == 1) {
          $(".searchBtn").removeClass("active");
          $(".searchBtn").eq(0).addClass("active");
        } else {
          $(".searchBtn").removeClass("active");
          $(".searchBtn").eq(1).addClass("active");
        }

        return false
      }
    })



  }
}
main.init();
//日历切换
function cDayFunc() {
  main.initTable()
}

//删除附件

function deleteAttachment(attId) {
    var json = {"attId":attId};
    $.ajax({
        type:"post",
        data:json,
        async:false,
        url:property.getProjectPath()+"attach/deleteAttachment.do",
        success:function(result) {
            if (result.success == 1) {
                successMsg("删除成功");
                attachmentsList = loadAttachments(tableId);
            } else if (result.success == 0){
                errorMsg(result.data);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}

function xhrOnProgress(fun) {
  xhrOnProgress.onprogress = fun;
  return function () {
    var xhr = $.ajaxSettings.xhr();
    if (typeof xhrOnProgress.onprogress !== 'function') {
      return xhr;
    }
    if (xhrOnProgress.onprogress && xhr.upload) {
      xhr.upload.onprogress = xhrOnProgress.onprogress;
    }
    return xhr;
  }
}

function deleteCollect(id) {
    for (var i = 0, length = choseCollect.length; i < length; i++) {
        if (id == choseCollect[i].culId) {
            choseCollect.splice(i,1);
            $('#'+id).remove();
            break;
        }
    }
}

function loadAttachments(fkId) {
    var datas = null;
    var json = {"fkId":fkId};
    $.ajax({
        type:"get",
        data:json,
        async:false,
        url:property.getProjectPath()+"attach/getAttachmentsByFkId.do",
        success:function(result) {
            if (result.success == 1) {
                datas = result.data;
            } else if (result.success == 0){
                errorMsg(result.data);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
    return datas;
}

function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

// function getSelectData() {
//   layui.use(['form'], functionu () {
//     var form = layui.form;
//     $.ajax({
//       type:'get',
//       dataType:'jsonp',
//       jsonp: "callback",
//       url:projectName + '/postLiterature/getSelectData.do',
//       success:function(result) {
//         // var data = JSON.stringify(result);
//         // var jsonO = eval(data);
//         var userList = result[0].userList;
//         var userListStr = "";
//         for (var i = 0;i < userList.length;i++) {
//           userListStr +="<option value='"+userList[i].id+"' >"+userList[i].name+"</option>"
//         }
//         $("#warehouses").append(userListStr);
//
//         form.render();
//       },
//       error:function(result) {
//
//       }
//     })
//   });
// }


