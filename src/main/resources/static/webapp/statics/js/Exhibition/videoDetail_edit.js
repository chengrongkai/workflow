var projectName = property.getProjectPath();
var collectCols = [{type: "numbers", title: '序号', width: 70, align: "center"},
  {field: 'culCategoryName', title: '藏品类型', width: 200, align: 'center'},
  {field: 'culName', title: '藏品名称', align: 'center'},
  {field: 'culremark', title: '藏品简介', align: 'center'},
  {title: '操作', width: 200, toolbar: '#barDemo2', align: "center"}];
var videoSaveTypeList = null;
var videoSourceList = null;
var videoTypeList = null;
var listExhibRoom = [];
var collectArray = [];
var choseCollect = [];
var videoArray = [];
var choseVideo = [];
var tableId;
var tableInfo = {};
var main = {

  init: function () {
    //设置用户信息
    property.setUserInfo();
    if (null != localStorage.pageType) {
      pageType = localStorage.pageType;
    }
    this.initTable();
    this.tabBind();
  },
  initTable: function () {

    layui.config({
      base: '../../common/js/formSelects-v4.js' //此处路径请自行处理, 可以使用绝对路径
    }).extend({
      formSelects: 'formSelects-v4'
    });

    layui.use('laydate', function () {
      var laydate = layui.laydate;
      //执行一个laydate实例
      laydate.render({
        elem: '#planTime' //指定元素
      });
      laydate.render({
        elem: '#startTime' //指定元素
      });
      laydate.render({
        elem: '#endTime' //指定元素
      });
    });

    var that = this;
    this.id = parent.$t.getQueryStringFrame('id');

    var datas = yc.ajaxGetByParams("exhib/getOneExhibition.do", {id: this.id},
        null, null).data;
    //tableInfo  =  datas
    var exhibition = datas.exhibition || {};
    layui.use('util', function () {
      var util = layui.util;
      exhibition.planTime = util.toDateString(exhibition.planTime,
          'yyyy-MM-dd');
      exhibition.startTime = util.toDateString(exhibition.startTime,
          'yyyy-MM-dd');
      exhibition.endTime = util.toDateString(exhibition.endTime, 'yyyy-MM-dd');
      property.setForm($("#exhibitionForm"), exhibition);
      tableId = exhibition.datumIds;
      attachmentsList = loadAttachments(tableId);
      var attachmentsListSelect = component.getSelectSimplePlus(attachmentsList,
          null, "attachmentList", "attId", "attName");
      $("#attachmentsList").append(attachmentsListSelect);
      if (null != attachmentsList) {
        attCount = attachmentsList.length;
        $("#demoList").append(component.getAttachmentList(attachmentsList));
      }
    })

    choseCollect = datas.listExhibCollection || [];
    listExhibRoom = datas.listExhibRoom || [];
    choseVideo = datas.listExhibVideo || [];
    setDatas(listExhibRoom, choseCollect, choseVideo);

    layui.use('form', function () {
      var form = layui.form;

      $.get(projectName + 'interfaceCollect/getCollctTypeList.do',
          function (res) {
            if (res.success == 1) {
              var data = res.data;
              /*  for (var i = 0, length = data.length; i < length; i++) {
               var option = $('<option value="'+ data[i].typeCode +'">'+ data[i].typename +'</option>');
               $('#culCategory').append(option);
               }*/
              var culCategorySelect = component.getSelectSimplePlus(data,
                  data[0].typeCode, "culCategory", "typeCode", "typename");
              $("#culCategory").append(culCategorySelect);

              form.render("select");
            } else {
              layer.msg(res.message, {icon: 5,})
            }
          });
      var keys = ['video_save_type', 'video_source', 'video_type'];
      var dictDataMulti = property.getDictDataMulti(keys);
      videoSaveTypeList = dictDataMulti.video_save_type;
      videoSourceList = dictDataMulti.video_source;
      videoTypeList = dictDataMulti.video_type;
      var saveTypeSelect = component.getSelectSimplePlus(videoSaveTypeList,
          null, "saveType", "dictCode", "dictName");
      $("#saveType").append(saveTypeSelect);
      form.render("select");
      var formSelects = layui.formSelects;
      formSelects.data('select1', 'server', {
        url: property.getProjectPath()
        + "interfaceCollect/getCollectByTypeAndName.do?culCategory="
        + videoSaveTypeList[0].dictCode
      });
      formSelects.data('select2', 'server', {
        url: property.getProjectPath()
        + "PostVideo/getPostVideoForExhib.do?saveType="
        + videoSaveTypeList[0].dictCode
      })

      form.on('select(culCategory)', function (data) {
        var formSelects = layui.formSelects;
        formSelects.config('select1', {
          keyName: 'culName',            //自定义返回数据中name的key, 默认 name
          keyVal: 'culId',            //自定义返回数据中value的key, 默认 value
          success: function (id, url, searchVal, result) {      //使用远程方式的success回调
            collectArray = result.data;
          },
        }, true);
        var culName = $($($('.xm-select-label')[0]).children()[0]).val();
        formSelects.data('select1', 'server', {
          url: property.getProjectPath()
          + "interfaceCollect/getCollectByTypeAndName.do?culCategory="
          + data.value
        });
      });

      form.on('select(saveType)', function (data) {
        var fromSelects = layui.formSelects;
        fromSelects.config('select2', {
          keyName: 'videoName',
          keyVal: 'videoId',
          success: function (id, url, searchVal, result) {
            videoArray = result.data;
          }
        }, true);
        fromSelects.data('select2', 'server', {
          url: property.getProjectPath()
          + "PostVideo/getPostVideoForExhib.do?saveType=" + $('#saveType').val()
        })
      });

      //监听提交
      form.on('submit(formDemo)', function (data) {
        var childs = $("#demoList").children();
        if (!(childs && childs.length > 0)) {
          alertMsg("请上传附件！")
          return false;
        }
        var exhibitionDto = {
          exhibition: '',
          listExhibRoom: [],
          listExhibCollection: choseCollect,
          listExhibVideo: choseVideo
        };
        exhibitionDto.exhibition = data.field;
        exhibitionDto.listExhibRoom = listExhibRoom;
        exhibitionDto.exhibition.datumIds = tableId;
        yc.ajaxPostByJson('exhib/updateExhibition', exhibitionDto, null,
            '修改成功');
        parent.$t.goback("page/Exhibition/videoList.html");
        return false;
      });
    });
    layui.use(['upload', 'element'], function () {
      var $ = layui.jquery
          , upload = layui.upload, element = layui.element;
      var demoListView = $('#demoList')
          , uploadListIns = upload.render({
        elem: '#test10'
        ,
        url: property.getProjectPath() + "attach/upload.do?tableName="
        + "post_literature" + "&tableId=" + tableId
        ,
        accept: 'file'
        ,
        multiple: true
        ,
        auto: false
        ,
        xhr: xhrOnProgress
        ,
        progress: function (index, value) {//上传进度回调 value进度值
          var tr = demoListView.find('#upload-' + index)
              , tds = tr.children();
          tds.eq(1).html('<span style="color: red;">正在上传</span>');
          element.progress('progressBar' + index, value + '%')//设置页面进度条
        }
        ,
        bindAction: '#testListAction'
        ,
        choose: function (obj) {
          var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
          //读取本地文件
          obj.preview(function (index, file, result) {
            /*  var tr=$(["<li>" +
             "                                    <div class='upLeft' id='upload-"+index+"'>" +
             "                                        <span class=\"fileName\">"+file.name+"</span>" +
             "                                        <span class=\"fileState\">准备上传</span>" +
             "                                    </div>" +
             "                                    <div class=\"upRight\">" +
             "                                        <div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"+index+"'>" +
             "                                            <div class=\"layui-progress-bar layui-progress-big layui-bg-red\" lay-percent=\"30%\">" +
             '<span class="layui-progress-text">'+'0%'+'</span>'+'</div>' +
             "                                        </div>" +
             "                                        <a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 layui-hide demo-reload\">重传</a>" +
             "                                        <a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 demo-cancel\">取消</a>" +
             "                                    </div>" +
             "                                </li>"].join(''));*/
            var tr = $(["<li>" +
            "<div class='upLeft' id='upload-" + index + "'>" +
            "<span class=\"fileName\">" + file.name + "</span>" +
            "<span class=\"fileState\">准备上传</span>" +
            "</div>" +
            "<div class=\"upRight\">" +
            "<div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"
            + index + "'>" +
            "<div class=\"layui-progress-bar layui-progress-big layui-bg-red\" lay-percent=\"30%\">"
            +
            '<span class="layui-progress-text">' + '0%' + '</span>' + '</div>' +
            "</div>" +
            "<a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 layui-hide demo-reload\">重传</a>"
            +
            "<a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 demo-cancel\">取消</a>"
            +
            "</div>" +
            "</li>"].join(''));
            //单个重传
            tr.find('.demo-reload').on('click', function () {
              obj.upload(index, file);
            });
            demoListView.append(tr);
            //删除

          });
        }
        ,
        before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
          //layer.load(); //上传loading
        }
        ,
        done: function (res, index, upload) {
          if (res.code == 1) { //上传成功
            attCount = attCount + 1;
            var tr = demoListView.find('#upload-' + index)
                , tds = tr.children();
            tds.eq(1).html('<span style="color: #5FB878;">上传成功</span>');
            //tds.eq(2).html(''); //清空操作
            tr.siblings(".upRight").find(".demo-reload").remove();
            tr.siblings(".upRight").find(".demo-cancel").addClass(
                "demo-delete");
            tr.siblings(".upRight").find(".demo-cancel").text("删除");
            tr.siblings(".upRight").find(".demo-cancel").attr("data-id",
                res.data.id);
            tr.siblings(".upRight").find(".demo-delete").removeClass(
                "demo-cancel");

            tr.siblings(".upRight").find(".layui-bg-red").addClass(
                "layui-bg-green");
            tr.siblings(".upRight").find(".layui-bg-green").removeClass(
                "layui-bg-red");
            return delete this.files[index]; //删除文件队列已经上传成功的文件
          } else {
            var tr = demoListView.find('#upload-' + index)
                , tds = tr.children();
            tds.eq(1).html(
                '<span style="color: #5FB878;">' + res.msg + '</span>');
            //tds.eq(2).html(''); //清空操作
            //tr.siblings(".upRight").find(".demo-reload").remove();
            //tr.siblings(".upRight").find(".demo-delete").remove();
            // return delete this.files[index]; //删除文件队列已经上传成功的文件
          }
          this.error(index, upload);
        }
        ,
        error: function (index, upload) {
          var tr = demoListView.find('#upload-' + index)
          //     ,tds = tr.children();
          // tds.eq(1).html('<span style="color: #FF5722;">上传失败</span>');
          tr.siblings(".upRight").find('.demo-reload').removeClass(
              'layui-hide'); //显示重传
        }
      });
      //删除附件
      $('#demoList').on('click', '.demo-delete', function () {
        var attId = $(this).attr("data-id");
        // delete files[index]; //删除对应的文件
        $(this).parent().parent().remove();
        deleteAttachment(attId);
        attachmentsList = loadAttachments(tableId);
        attCount = attCount - 1;
        // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
      });
      //取消上传
      $('#demoList').on('click', '.demo-cancel', function () {
        var attId = $(this).attr("data-id");
        // delete files[index]; //删除对应的文件
        $(this).parent().parent().remove();
        // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
      });
    });

    $("#roomAddId").click(function () {
      var inputRoomName = $("#inputRoomNameId").val();
      var inputRoomTitle = $("#inputRoomTitleId").val();
      if (yc.isNull(inputRoomName)) {
        layer.alert('请填写展厅名称');
      } else if (yc.isNull(inputRoomTitle)) {
        layer.alert('请填写展厅主题');
      } else {
        var datas = {
          id: listExhibRoom.length,
          roomName: inputRoomName,
          roomTitle: inputRoomTitle
        };
        listExhibRoom.push(datas);
        layui.use('table', function () {
          var table = layui.table;
          table.reload('tableRoom', {data: listExhibRoom});
        });
      }

    });

    layui.use('table', function () {
      var table = layui.table;

      table.on('tool(test2)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'collectDel') { //删除
          property.remove(choseCollect, data);


          //渲染关联藏品信息列表
          table.render({
            elem: '#test2',
            page: true,
            id: "test2",
            cols: [collectCols],
            data: choseCollect
          });
        } else if (layEvent === 'detail') {
          // data = obj.data;
          // debugger
          // console.dir(data)
          // localStorage.id = data.id;
          // parent.$t.goToPage(this, "page/public/collect/add.html");

        }
      });
      // 监听工具条
      table.on('tool(tableRoom)', function (obj) {
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event;
        // if (layEvent === 'delRoom') { //删除
        //   listExhibRoom.splice(listExhibRoom.indexOf(data), 1);
        //   table.render({
        //     elem: '#tableRoom'
        //     , data: listExhibRoom
        //     , limits: [10]
        //     , cols: [[
        //       {type: 'numbers', title: '序号'}
        //       , {field: 'roomName', title: '展厅名称'}
        //       , {field: 'roomTitle', title: '展厅主题'}
        //       , {fixed: 'right', title: '操作', toolbar: '#barDemo1'}
        //     ]]
        //     , page: true
        //   });
        // }
        if (layEvent === 'delRoom') { //删除
          for (var i = 0; i < listExhibRoom.length; i++) {
            if (listExhibRoom[i].id == data.id) {
              listExhibRoom.splice(i, 1);
              break;
            }
          }
          var curr = 1;
          var count = listExhibRoom.length;
          var mo = Math.floor((count - 1) / 10);
          var maxCurr = mo + 1;
          //获取当前页码
          var nowCurr = $("#tableRoom").next().find(".layui-laypage-skip").find("input").val();
          if (maxCurr < nowCurr) {
            curr = maxCurr;
          } else {
            curr = nowCurr;
          }
          table.reload('tableRoom', {
            page: {
              curr: curr
            },
            data: listExhibRoom
          });
        }

      });

      //监听行工具事件
      table.on('tool(test)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
          // choseVideo.splice(choseVideo.indexOf(data), 1);

          for (var i = 0; i < choseVideo.length; i++) {
            if (choseVideo[i].id == data.id) {
              choseVideo.splice(i, 1);
              break;
            }
          }
          var curr = 1;
          var count = choseVideo.length;
          var mo = Math.floor((count - 1) / 10);
          var maxCurr = mo + 1;
          //获取当前页码
          var nowCurr = $("#test").next().find(".layui-laypage-skip").find("input").val();
          if (maxCurr < nowCurr) {
            curr = maxCurr;
          } else {
            curr = nowCurr;
          }
          table.reload('test', {
            page: {
              curr: curr
            },
            data: choseVideo
          });

        } else if (obj.event === 'edit') {
          layer.prompt({
            formType: 2
            , value: data.email
          }, function (value, index) {
            obj.update({
              email: value
            });
            layer.close(index);
          });
        }
      });
      $('#addVideo').click(function () {
        var formSelects = layui.formSelects;
        var ids = formSelects.value('select2', 'val');
        var hasAddName = [];
        for (var i = 0, length = ids.length; i < length; i++) {
          var id = ids[i];
          var flg = false;
          for (var j = 0, size = choseVideo.length; j < size; j++) {
            var video = choseVideo[j];
            if (id == video.videoId) {
              hasAddName.push(choseVideo.videoName);
              flg = true;
              break;
            }
          }
          if (flg) {
            continue;
          }
          for (var j = 0, size = videoArray.length; j < size; j++) {
            var video = videoArray[j];
            if (id == video.id) {
              choseVideo.push(video);
              break;
            }
          }
        }
        table.render({
          elem: '#test'
          // , url: '../../statics/json/demo1.json',
          , page: true
          , cols: [[
            {type: 'numbers', title: '序号'}
            , {
              field: 'saveType', title: '类型', templet: function (res) {
                if (res.saveType == 'T') {
                  return '<i class="layui-icon">&#xe64a;</i> ';
                } else if (res.saveType == 'S') {
                  return '<i class="layui-icon">&#xe6ed;</i>';
                } else if (res.saveType == 'Y') {
                  return '<i class="layui-icon">&#xe6fc;</i>';
                }
              }
            }
            , {field: 'videoCode', title: '编号'}
            , {field: 'videoName', title: '资料名称'}
            , {
              field: 'videoType', title: '资料分类', templet: function (data) {
                return property.getTextByValue(videoTypeList, data.videoType);
              }
            }
            , {field: 'relativeObject', title: '关联主体'}
            , {field: 'relativeCollectionName', title: '关联藏品'}
            , {
              field: 'source', title: '来源', templet: function (data) {
                return property.getTextByValue(videoSourceList, data.source);
              }
            }
            , {fixed: 'right', title: '操作', toolbar: '#barDemo'}
          ]]
          , data: choseVideo
          , page: true
        });
      })

      //添加藏品
      $("#addCollect").click(function () {
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
              break;
            }
          }
        }
        table.render({
          elem: '#test2',
          page: true,
          id: "test2",
          cols: [collectCols],
          data: choseCollect
        });
      });
    })
  },

  tabBind: function () {
    //导出函数
    $(".layui-btn-green").on({
      'click': function () {
        return false
      }
    })
    //取消
    $("button[type='reset']").click(function () {
      parent.$t.goback("page/Exhibition/videoList.html");
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

function setDatas(data1, data2, data3) {
  layui.use('table', function () {
    var table = layui.table;
    table.render({
      elem: '#tableRoom'
      , data: data1
      , limits: [10]
      , cols: [[
        {type: 'numbers', title: '序号'}
        , {field: 'roomName', title: '展厅名称'}
        , {field: 'roomTitle', title: '展厅主题'}
        , {fixed: 'right', title: '操作', toolbar: '#barDemo1'}
      ]]
      , page: true
    });
    //渲染关联藏品信息列表
    table.render({
      elem: '#test2',
      page: true,
      id: "test2",
      cols: [collectCols],
      data: data2
    });
    table.render({
      elem: '#test'
      // , url: '../../statics/json/demo1.json'
      , cols: [[
        {type: 'numbers', title: '序号'}
        , {
          field: 'saveType', title: '类型', templet: function (res) {
            if (res.saveType == 'T') {
              return '<i class="layui-icon">&#xe64a;</i> ';
            } else if (res.saveType == 'S') {
              return '<i class="layui-icon">&#xe6ed;</i>';
            } else if (res.saveType == 'Y') {
              return '<i class="layui-icon">&#xe6fc;</i>';
            }
          }
        }
        , {field: 'videoCode', title: '编号'}
        , {field: 'videoName', title: '资料名称'}
        , {
          field: 'videoType', title: '资料分类', templet: function (data) {
            return property.getTextByValue(videoTypeList, data.videoType);
          }
        }
        , {field: 'relativeObject', title: '关联主体'}
        , {field: 'relativeCollectionName', title: '关联藏品'}
        , {
          field: 'source', title: '来源', templet: function (data) {
            return property.getTextByValue(videoSourceList, data.source);
          }
        }
        , {fixed: 'right', title: '操作', toolbar: '#barDemo'}
      ]]
      , data: data3
      , page: true
    });
  });
}

//删除附件
function deleteAttachment(attId) {
  var json = {"attId": attId};
  $.ajax({
    type: "post",
    data: json,
    async: false,
    url: property.getProjectPath() + "attach/deleteAttachment.do",
    success: function (result) {
      if (result.success == 1) {
        successMsg("删除成功！");
        attachmentsList = loadAttachments(tableId);
      } else if (result.success == 0) {
        errorMsg(result.data);
      }
    },
    error: function (result) {
      errorMsg("系统异常");
    }
  });
}

function loadAttachments(fkId) {
  var datas = null;
  var json = {"fkId": fkId};
  $.ajax({
    type: "get",
    data: json,
    async: false,
    url: property.getProjectPath() + "attach/getAttachmentsByFkId.do",
    success: function (result) {
      if (result.success == 1) {
        datas = result.data;
      } else if (result.success == 0) {
        errorMsg(result.data);
      }
    },
    error: function (result) {
      errorMsg("系统异常");
    }
  });
  return datas;
}