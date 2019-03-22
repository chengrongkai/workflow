var projectName = property.getProjectPath();
var dataRoom = [];
var collectArray = [];
var choseCollect = [];
var videoArray = [];
var choseVideo = [];
var tableId = property.getTimeJson();
var collectCols = [{type: "numbers", title: '序号', width: 70, align: "center"},
  {field: 'culCategoryName', title: '藏品类型', width: 200, align: 'center'},
  {field: 'culName', title: '藏品名称', align: 'center'},
  {field: 'culremark', title: '藏品简介', align: 'center'},
  {title: '操作', width: 200, toolbar: '#barDemo2', align: "center"}];
var videoSaveTypeList = null;
var videoSourceList = null;
var videoTypeList = null;
/*var attCount = 0;*/
var main = {

  init: function () {
    property.setUserInfo();
    this.initTable();
    this.tabBind();
  },
  initTable: function () {

    var d1 = 0;
    var d2 = 0;
    var d3 = 0;

    layui.use('form', function () {
      var form = layui.form
      form.verify({
        'roomNum': function () {
          var str = /^\+?[1-9][0-9]*$/;

          if (!str.test($("#roomNum").val())) {
            return '输入内容必须为整数';
          }
        },
        'planTime': function () {
          var planTime = $("#planTime").val();
          var startTime = $("#startTime").val();
          var endTime = $("#endTime").val();

          if (planTime) {
            d1 = (new Date(planTime)).getTime();
          }
          if (startTime) {
            d2 = (new Date(startTime)).getTime();
          }
          if (endTime) {
            d3 = (new Date(endTime)).getTime();
          }

          if (d1 > d2 || d1 > d3) {
            return "策划时间应该早于开始时间或结束时间";
          }
        },
        'startTime': function () {
          if (d2 > d3) {
            return "开始时间不得晚于结束时间";
          }
        }

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
    })

    layui.config({
      base: '../../common/js/formSelects-v4.js' //此处路径请自行处理, 可以使用绝对路径
    }).extend({
      formSelects: 'formSelects-v4'
    });

    var formSelects = layui.formSelects;
    formSelects.config('select1', {
      keyName: 'culName',            //自定义返回数据中name的key, 默认 name
      keyVal: 'culId',            //自定义返回数据中value的key, 默认 value
      success: function (id, url, searchVal, result) {      //使用远程方式的success回调
        collectArray = result.data;
      },
    }, true);
    var culName = $($($('.xm-select-label')[0]).children()[0]).val();
    // formSelects.data('select1', 'server', {
    //     url:property.getProjectPath()+"interfaceCollect/getCollectByTypeAndName.do"
    // });

    // $('#searchVideo').click(function () {
    //     var fromSelects = layui.formSelects;
    //     fromSelects.config('select2', {
    //         keyName: 'videoName',
    //         keyVal: 'videoId',
    //         success: function (id, url, searchVal, result) {
    //             videoArray = result.data;
    //         }
    //     }, true);
    //     fromSelects.data('select2', 'server', {
    //         url: property.getProjectPath() + "PostVideo/getPostVideoForExhib.do?saveType="+$('#saveType').val()+"&keywords="+$($($('.xm-select-label')[1]).children()[0]).val()
    //     })
    // })

    $('.form-control-chosen').chosen({
      allow_single_deselect: true,
      width: '100%'
    });

    $('.form-control-chosen-required').chosen({
      allow_single_deselect: false,
      width: '100%'
    });
    $('.form-control-chosen-search-threshold-100').chosen({
      allow_single_deselect: true,
      disable_search_threshold: 100,
      width: '100%'
    });
    $('.form-control-chosen-optgroup').chosen({
      width: '100%'
    });
    var div = $('#collect').next();
    $('[title="clickable_optgroup"]').addClass(
        'chosen-container-optgroup-clickable');
    $(document).on('click', '[title="clickable_optgroup"] .group-result',
        function () {
          var unselected = $(this).nextUntil('.group-result').not(
              '.result-selected');
          if (unselected.length) {
            unselected.trigger('mouseup');
          } else {
            $(this).nextUntil('.group-result').each(function () {
              $('a.search-choice-close[data-option-array-index="' + $(
                      this).data('option-array-index') + '"]').trigger('click');
            });
          }
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
    layui.use('form', function () {
      var form = layui.form;
      $.get(projectName + 'interfaceCollect/getCollctTypeList.do',
          function (res) {
            if (res.success == 1) {
              var data = res.data;
              // for (var i = 0, length = data.length; i < length; i++) {
              //     var option = $('<option value="'+ data[i].typeCode +'">'+ data[i].typename +'</option>');
              //     $('#culCategory').append(option);
              // }

              //$("#culCategory").val(data[0].typename);
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
          videoSaveTypeList[0].dictCode, "saveType", "dictCode", "dictName");
      $("#saveType").append(saveTypeSelect);
      form.render("select");
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
      //监听提交
      form.on('submit(formDemo)', function (data) {
        /*layer.msg(JSON.stringify(data.field));*/
        data.field.datumIds = tableId;
        var childs = $("#demoList").children();

        if (!(childs && childs.length > 0)) {
          alertMsg("请上传附件！");
          return false;
        }
        // if (attCount <= 0){
        //     top.layer.msg("请上传附件");
        //     return false;
        // }

        var exhibitionDto = {
          exhibition: '',
          listExhibRoom: [],
          listExhibCollection: choseCollect,
          listExhibVideo: choseVideo
        };
        exhibitionDto.exhibition = data.field;
        exhibitionDto.listExhibRoom = dataRoom.map((obj) => {
          return {roomName: obj.inputRoomName, roomTitle: obj.inputRoomTitle}
        });
        var async = false;
        var datas = yc.ajaxPostByJson('exhib/addExhibition', exhibitionDto,
            async, "添加展陈成功", data.elem);
        parent.$t.goback("page/Exhibition/videoList.html");
        //successMsg("添加展陈成功");
        /*debugger
         setTimeout(function () {
         parent.$t.goback("page/Exhibition/videoList.html");

         },2000)*/
        // parent.$t.goback("page/Exhibition/videoList.html");
        return false;
      });
    });
    layui.use(['upload', 'element', 'form'], function () {
      var form = layui.form;
      var $ = layui.jquery
          , upload = layui.upload, element = layui.element;
      var demoListView = $('#demoList')
          , uploadListIns = upload.render({
        elem: '#test10'
        ,
        url: property.getProjectPath() + "attach/upload.do?tableName="
        + "exhibition" + "&tableId=" + tableId
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
            /* var tr = $(['<tr id="upload-'+ index +'">'
             ,'<td>'+ file.name +'</td>'
             ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
             ,'<td>等待上传</td>'
             ,'<td>'
             ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
             ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
             ,'</td>'
             ,'</tr>'].join(''));*/
            var tr = $(["<li>" +
            "                                    <div class='upLeft' id='upload-"
            + index + "'>" +
            "                                        <span class=\"fileName\">"
            + file.name + "</span>" +
            "                                        <span class=\"fileState\">准备上传</span>"
            +
            "                                    </div>" +
            "                                    <div class=\"upRight\">" +
            "                                        <div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"
            + index + "'>" +
            "                                            <div class=\"layui-progress-bar layui-progress-big layui-bg-red\" lay-percent=\"30%\">"
            +
            '<span class="layui-progress-text">' + '0%' + '</span>' + '</div>' +
            "                                        </div>" +
            "                                        <a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 layui-hide demo-reload\">重传</a>"
            +
            "                                        <a href=\"javascript:void (0);\" style='margin-left:15px;' class=\"layui-col-md1 layui-col-sm1 demo-cancel\">取消</a>"
            +
            "                                    </div>" +
            "                                </li>"].join(''));
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
          layer.load(); //上传loading
        }
        ,
        done: function (res, index, upload) {
          if (res.code == 1) { //上传成功
            //attCount ++;
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
            //重新设置下拉框
            attachmentsList = loadAttachments(tableId);
            var attachmentsListSelect = component.getSelectSimplePlus(
                attachmentsList, null, "attachmentList", "attId", "attName");
            $("#attachmentsList").empty();
            $("#attachmentsList").append(attachmentsListSelect);
            $('.layui-layer-shade').css('display', 'none');//layui-layer-shade
            //form1.render('select');
            form.render('select');
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
          var tr = demoListView.find('tr#upload-' + index)
              , tds = tr.children();
          tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
          tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
        }
      });

    });

    //删除附件
    $('#demoList').on('click', '.demo-delete', function () {
      //attCount --;
      var attId = $(this).attr("data-id");
      // delete files[index]; //删除对应的文件
      $(this).parent().parent().remove();
      deleteAttachment(attId);
      attachmentsList = loadAttachments(tableId);
      var attachmentsListSelect = component.getSelectSimplePlus(attachmentsList,
          null, "attachmentList", "attId", "attName");
      $("#attachmentsList").empty();
      $("#attachmentsList").append(attachmentsListSelect);
      //form1.render('select');
      //form.render('select');
      // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
    });

    //取消上传
    $('#demoList').on('click', '.demo-cancel', function () {
      var attId = $(this).attr("data-id");
      // delete files[index]; //删除对应的文件
      $(this).parent().parent().remove();
      // uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
    });

    // 监听展厅新增

    $("#roomAddId").click(function () {
      var inputRoomName = $("#inputRoomNameId").val();
      var inputRoomTitle = $("#inputRoomTitleId").val();
      var datas = {
        id: dataRoom.length,
        inputRoomName: inputRoomName,
        inputRoomTitle: inputRoomTitle
      };
      dataRoom.push(datas);
      layui.use('table', function () {
        var table = layui.table;
        table.reload('tableRoom', {data: dataRoom});
      });
    });

    layui.use('table', function () {
      var table = layui.table;
      table.on('tool(test2)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'collectDel') { //删除
          for (var i = 0; i < choseCollect.length; i++) {
            if (data.culId == choseCollect[i].culId) {
              choseCollect.splice(i, 1);
              break;
            }
          }

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

      var tableRoomIns = table.render({
        elem: '#tableRoom'
        , data: dataRoom
        , page: true
        , limits: [10]
        , cols: [[
          {type: 'numbers', title: '序号'}
          , {field: 'inputRoomName', title: '展厅名称'}
          , {field: 'inputRoomTitle', title: '展厅主题'}
          , {fixed: 'right', title: '操作', toolbar: '#barDemo1'}
        ]]
      });

      // 监听工具条
      table.on('tool(tableRoom)', function (obj) {
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event;

        if (layEvent === 'delRoom') { //删除
          for (var i = 0; i < dataRoom.length; i++) {
            if (dataRoom[i].id == data.id) {
              dataRoom.splice(i, 1);
              break;
            }
          }
          // for (var i = 0; i < dataRoom.length; i++) {
          //     dataRoom[i].id = i;
          // }
          var curr = 1;
          var count = dataRoom.length;
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
            data: dataRoom
          });
        }
      });

      table.render({
        elem: '#test2'
        , cols: [[
          {type: "numbers", title: '序号', width: 70, align: "center"},
          {
            field: 'culCategoryName',
            title: '藏品类型',
            width: 200,
            align: 'center'
          },
          {field: 'culName', title: '藏品名称', align: 'center'},
          {field: 'culremark', title: '藏品简介', align: 'center'},
          {title: '操作', width: 200, toolbar: '#barDemo2', align: "center"}
        ]]
        , data: choseCollect
      });
      table.render({
        elem: '#test'
        // , url: '../../statics/json/demo1.json'
        , cols: [[
          {type: 'numbers', title: '序号'}
          , {
            field: 'saveType', title: '类型', templet: function (data) {
              var saveType = data.saveType;
              for (var i = 0, length = videoSaveTypeList.length; i < length;
                  i++) {
                if (saveType == videoSaveTypeList[i].dictCode) {
                  return videoSaveTypeList[i].dictName;
                }
              }
            }
          }
          , {field: 'videoCode', title: '编号'}
          , {field: 'videoName', title: '资料名称'}
          , {
            field: 'videoType', title: '资料分类', templet: function (data) {
              var saveType = data.videoType;
              for (var i = 0, length = videoTypeList.length; i < length; i++) {
                if (saveType == videoTypeList[i].dictCode) {
                  return videoTypeList[i].dictName;
                }
              }
            }
          }
          , {field: 'relativeObject', title: '关联主体'}
          , {
            field: 'relativeCollectionName',
            title: '关联藏品',
            templet: function (res) {
              var cul = eval(res.relativeCollection);
              var name = [];
              if (null != cul) {
                for (var i = 0; i < cul.length; i++) {
                  name.push(cul[i].culName);
                }
              }
              return name.join("，");
            }
          }
          , {
            field: 'source', title: '来源', templet: function (data) {
              var saveType = data.source;
              for (var i = 0, length = videoSourceList.length; i < length;
                  i++) {
                if (saveType == videoSourceList[i].dictCode) {
                  return videoSourceList[i].dictName;
                }
              }
            }
          }
          , {fixed: 'right', title: '操作', toolbar: '#barDemo'}
        ]]
        , data: choseVideo
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
              field: 'saveType', title: '类型', templet: function (data) {
                var saveType = data.saveType;
                for (var i = 0, length = videoSaveTypeList.length; i < length;
                    i++) {
                  if (saveType == videoSaveTypeList[i].dictCode) {
                    return videoSaveTypeList[i].dictName;
                  }
                }
              }
            }
            , {field: 'videoCode', title: '编号'}
            , {field: 'videoName', title: '资料名称'}
            , {
              field: 'videoType', title: '资料分类', templet: function (data) {
                var saveType = data.videoType;
                for (var i = 0, length = videoTypeList.length; i < length;
                    i++) {
                  if (saveType == videoTypeList[i].dictCode) {
                    return videoTypeList[i].dictName;
                  }
                }
              }
            }
            , {field: 'relativeObject', title: '关联主体'}
            , {field: 'relativeCollectionName', title: '关联藏品'}
            , {
              field: 'source', title: '来源', templet: function (data) {
                var saveType = data.source;
                for (var i = 0, length = videoSourceList.length; i < length;
                    i++) {
                  if (saveType == videoSourceList[i].dictCode) {
                    return videoSourceList[i].dictName;
                  }
                }
              }
            }
            , {fixed: 'right', title: '操作', toolbar: '#barDemo'}
          ]]
          , data: choseVideo
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

      //监听行工具事件
      table.on('tool(test)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {

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

          // obj.del();
          // layer.close(index);
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
    });
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

function setDataForUse(elem, datas) {
  var cacheElem = null;
  if (elem.indexOf('#') < 0) {
    cacheElem = elem
    elem = '#' + elem;
  } else {
    cacheElem = elem.replace("#", "");
  }
  if (!Array.isArray(datas)) {
    datas = [datas];
  }
  layui.use('table', function () {
    var table = layui.table;
    var oldData = table.cache[cacheElem];
    oldData.push(datas);
    table.reload(cacheElem, {
      data: oldData
    });
    // table.render({
    //     elem: elem
    //     // , url: '../../statics/json/demo1.json'
    //     ,data: datas
    //     , cols: [[
    //         {type: 'numbers', title: '序号'}
    //         , {field: 'inputRoomName', title: '展厅名称'}
    //         , {field: 'inputRoomTitle', title: '展厅主题'}
    //         , {fixed: 'right', title: '操作', toolbar: '#barDemo1'}
    //     ]]
    // });
  })

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
        var attachmentsListSelect = component.getSelectSimplePlus(
            attachmentsList, null, "attachmentList", "attId", "attName");
        $("#attachmentsList").append(attachmentsListSelect);
        //form.render('select');
        //form1.render('select');
      } else if (result.success == 0) {
        errorMsg(result.data);
      }
    },
    error: function (result) {
      errorMsg("系统异常");
    }
  });
}

function selectCollectList() {

}

function openOptions(e) {

}