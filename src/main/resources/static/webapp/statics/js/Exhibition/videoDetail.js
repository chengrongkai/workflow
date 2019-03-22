var videoSaveTypeList = null;
var videoSourceList = null;
var videoTypeList = null;
var tableId;
var main = {

    init: function () {
        //设置用户信息
        property.setUserInfo();
        if (null != localStorage.pageType){
            pageType = localStorage.pageType;
        }
        var keys = ['video_save_type','video_source','video_type'];
        var dictDataMulti = property.getDictDataMulti(keys);
        videoSaveTypeList = dictDataMulti.video_save_type;
        videoSourceList = dictDataMulti.video_source;
        videoTypeList = dictDataMulti.video_type;
        this.initTable();
        this.tabBind();
    },
    initTable: function () {
        var that = this;
        this.id = parent.$t.getQueryStringFrame('id');
        var datas = yc.ajaxGetByParams("exhib/getOneExhibition.do", {id: this.id}, null, null).data;
        var exhibition = datas.exhibition || {};
        layui.use('util', function(){
            var util = layui.util;
            exhibition.planTime = util.toDateString(exhibition.planTime, 'yyyy-MM-dd');
            exhibition.startTime =  util.toDateString(exhibition.startTime, 'yyyy-MM-dd');
            exhibition.endTime =  util.toDateString(exhibition.endTime, 'yyyy-MM-dd');
            property.setForm($("#exhibitionForm"), exhibition);
        })

        var listExhibCollection = datas.listExhibCollection || [];
        var listExhibRoom = datas.listExhibRoom || [];
        var listExhibVideo = datas.listExhibVideo || [];
        setDatas(listExhibRoom, listExhibCollection, listExhibVideo);

        tableId = exhibition.datumIds;
        attachmentsList = loadAttachments(tableId);
        var attachmentsListSelect  = component.getSelectSimplePlus(attachmentsList,null,"attachmentList","attId","attName");
        $("#attachmentsList").append(attachmentsListSelect);
        //显示附件
        if (null != attachmentsList){
            var attList = '';
            for (var i=0;i<attachmentsList.length;i++){
                var attachment = attachmentsList[i];
                var type = 'img'
                var srcStr = attachment.attPath;
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
                    "                                <img src='"+srcStr+"' alt=''>\n" +
                    "                                <p class='myfont'>"+attachment.attName+"</p>\n" +

                    "                            </li>";
                attList = attList+liStr;

            }
            $(".imgList").append(attList);
        }

        layui.use('form', function () {
            var form = layui.form;

            //监听提交
            form.on('submit(formDemo)', function (data) {
                layer.msg(JSON.stringify(data.field));
                return false;
            });
        });
        layui.use(['upload', 'element'], function () {
            var $ = layui.jquery
                , upload = layui.upload, element = layui.element;
            var demoListView = $('#demoList')
                , uploadListIns = upload.render({
                elem: '#test10'
                , url: '/statics/upload'
                , accept: 'file'
                , multiple: true
                , auto: false
                , xhr: xhrOnProgress
                , progress: function (index, value) {//上传进度回调 value进度值
                    element.progress('progressBar' + index, value + '%')//设置页面进度条
                }
                , bindAction: '#testListAction'
                , choose: function (obj) {
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
                        "                                    <div class=\"upLeft\">\n" +
                        "                                        <span class=\"fileName\">" + file.name + "</span>" +
                        "                                        <span class=\"fileState\">准备上传</span>" +
                        "                                    </div>" +
                        "                                    <div class=\"upRight\">" +
                        "                                        <div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar" + index + "'>" +
                        "                                            <div class=\"layui-progress-bar" +
                        " layui-progress-big layui-bg-red\"" +
                        " lay-percent=\"30%\"></div>" +
                        "                                        </div>" +
                        "                                        <span class=\"layui-col-md2 layui-col-sm2\">0%</span>" +
                        "                                        <a href=\"javascript:void (0);\" class=\"layui-col-md1 layui-col-sm1 demo-reload\">重传</a>" +
                        "                                        <a href=\"javascript:void (0);\" class=\"layui-col-md1 layui-col-sm1 demo-delete\">取消</a>" +
                        "                                    </div>" +
                        "                                </li>"].join(''));
                        //单个重传
                        tr.find('.demo-reload').on('click', function () {
                            obj.upload(index, file);
                        });

                        //删除
                        tr.find('.demo-delete').on('click', function () {
                            delete files[index]; //删除对应的文件
                            tr.remove();
                            uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                        });

                        demoListView.append(tr);
                    });
                }
                , before: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                    layer.load(); //上传loading
                }
                , done: function (res, index, upload) {
                    if (res.code == 0) { //上传成功
                        var tr = demoListView.find('tr#upload-' + index)
                            , tds = tr.children();
                        tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                        tds.eq(3).html(''); //清空操作
                        return delete this.files[index]; //删除文件队列已经上传成功的文件
                    }
                    this.error(index, upload);
                }
                , error: function (index, upload) {
                    var tr = demoListView.find('tr#upload-' + index)
                        , tds = tr.children();
                    tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                    tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
                }
            });

        });
        layui.use('table', function () {
            var table = layui.table;
            // table.render({
            //     elem: '#test1'
            //     , url: '../../statics/json/demo1.json'
            //     , cols: [[
            //         {type: 'numbers', title: '序号'}
            //         , {field: 'logins', title: '展厅名称'}
            //         , {field: 'joinTime', title: '展厅主题'}
            //     ]]
            // });
            //头工具栏事件
            table.on('toolbar(test)', function (obj) {
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
            table.on('tool(test)', function (obj) {
                var data = obj.data;
                if (obj.event === 'del') {
                    parent.layer.confirm('确定要删除么',{icon:3, title:'删除确认'}, function(index){
                        obj.del();
                        layer.close(index);
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
        });
    },


    tabBind: function () {
        //导出函数
        $(".layui-btn-green").on({
            'click': function () {
                return false
            }
        });


        $(".imgList li").on({
            'click':function () {
                if($(this).attr("data-type")=="img"){
                    parent.layer.open({
                        type: 1,
                        title:false,
                        closeBtn: 0, //不显示关闭按钮
                        //area: ['420px', '240px'], //宽高
                        shadeClose: true, //开启遮罩关闭
                        content: "<div style='position: relative;height: 450px'><img style='max-width:" +
                        " 600px;position:" +
                        " absolute;max-height:100%;margin: auto;left: 0;right: 0;top:0;bottom:0'" +
                        " src='"+$(this).find("img").attr("src")+"'/></div> "
                       /* content: "<img src='"+$(this).find("img").attr("src")+"'/> "*/
                    })
                }else if($(this).attr("data-type")=="video"){
                    parent.layer.open({
                        type: 1,
                        title:false,
                        closeBtn: 0, //不显示关闭按钮
                        shadeClose: true, //开启遮罩关闭
                        content: "<video src='"+$(this).find("img").attr("src")+ "' controls='controls' width='400px' height='220px'>" +
                        "您的浏览器不支持 video 标签。" +
                        "'</video> "
                    })
                }else{
                    parent.layer.open({
                        type: 1,
                        title:false,
                        closeBtn: 0, //不显示关闭按钮
                        shadeClose: true, //开启遮罩关闭
                        content: "<audio src='"+$(this).find("img").attr("src")+"' controls='controls'>" +
                        "</audio> "
                    })
                }
            }
        });
        //取消
        $("button[type='reset']").click(function () {
            parent.$t.goback("page/Exhibition/videoList.html");
        })
        //时间切换
        $(".searchBtn").on({
            'click': function () {
                var index = $(this).index();
                if ($(this).hasClass('active'))return false
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
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
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
            , page: true
            , cols: [[
                {type: 'numbers', title: '序号'}
                , {field: 'roomName', title: '展厅名称'}
                , {field: 'roomTitle', title: '展厅主题'}
            ]]
        });
        //渲染关联藏品信息列表
        table.render({
            elem: '#test2',
            page: true,
            id: "test2",
            cols: [[{type:"numbers",title: '序号', width:70, align:"center"},
                {field:'culCategoryName', title: '藏品类型', width:200,align:'center'},
                {field: 'culName', title: '藏品名称',  align:'center'},
                {field: 'culremark', title: '藏品简介',  align:'center'},
                {title: '操作', toolbar:'#barDemo2'}]],
            data: data2
        });
        //渲染关联影视资料
        table.render({
            elem: '#videoDemo'
            , cols: [[
                {type: 'numbers', title: '序号'}
                , {field: 'saveType', title: '类型', templet: function(res){
                        if (res.saveType == 'T'){
                            return '<i class="layui-icon">&#xe64a;</i> ';
                        }else if (res.saveType == 'S'){
                            return '<i class="layui-icon">&#xe6ed;</i>';
                        }else if (res.saveType == 'Y'){
                            return '<i class="layui-icon">&#xe6fc;</i>';
                        }
                    }}
                , {field: 'videoCode', title: '编号'}
                , {field: 'videoName', title: '资料名称'}
                , {field: 'videoType', title: '资料分类', templet: function (data) {
                        var saveType = data.videoType;
                        for (var i = 0, length = videoTypeList.length; i < length; i++) {
                            if (saveType == videoTypeList[i].dictCode) {
                                return videoTypeList[i].dictName;
                            }
                        }
                    }}
                , {field: 'relativeObject', title: '关联主体'}
                , {field: 'relativeCollectionName', title: '关联藏品'}
                , {field: 'source', title: '来源', templet: function (data) {
                        var saveType = data.source;
                        for (var i = 0, length = videoSourceList.length; i < length; i++) {
                            if (saveType == videoSourceList[i].dictCode) {
                                return videoSourceList[i].dictName;
                            }
                        }
                    }},
                {title: '操作', toolbar: '#barDemo'}
            ]]
            , data: data3
          , page: true
        });

          //监听行工具事件
          table.on('tool(videoDemo)', function(obj){
            var data = obj.data;
            if(obj.event === 'show'){
              localStorage.videoId = data.videoId;
              parent.$t.goToPage(this,"page/Exhibition/videoList.html");
            }
          });


    });
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