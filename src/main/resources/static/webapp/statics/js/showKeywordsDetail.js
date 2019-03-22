var videoMarkList = null;
var orgList = null;
var videoSaveTypeList = null;
var videoSourceList = null;
var videoTypeList = null;
var authSettingList = null;
var tableId = '';
var attachmentsList = null;
var statusDictList = property.getDictData("video_status");
var form1;
var keyId = null;
//所有用户列表
var userList = property.getAllUserList();
//所有部门列表
var orgList = property.getAllOrgList();

var videoData = new Array();
//页面属性
var pageType = "show";
var main={
    init:function () {
        //设置用户信息
        property.setUserInfo();
        pageType = localStorage.pageType;
        keyId = localStorage.keyId;
        var text = "当前关键词:"+keyId;
        $("#currentKeywords").text(text);
        //加载业务字典
        getDictData();
        layui.use(['form','table'], function(){
            var form = layui.form;
            var table = layui.table;
            form1 = form;
            table.render({
                elem: '#test'
                ,url:property.getProjectPath()+"PostVideo/getVideoListByKeywords.do?keyId="+keyId
                ,title: '影视资料数据表'
                ,cols: [[
                    {type: 'checkbox', fixed: 'left'}
                    ,{field:'saveType', title:'类型',templet: function(res){
                        if (res.saveType == 'T'){
                            return '<i class="layui-icon">&#xe64a;</i> ';
                        }else if (res.saveType == 'S'){
                            return '<i class="layui-icon">&#xe6ed;</i>';
                        }else if (res.saveType == 'Y'){
                            return '<i class="layui-icon">&#xe6fc;</i>';
                        }
                    }}
                    ,{field:'videoCode', title:'编号', sort: true}
                    ,{field:'videoName', title:'资料名称'}
                    ,{field:'videoMark', title:'资料分类',templet: function(res){
                        // return res.videoMark;
                        return property.getTextByValuePlus(videoMarkList,res.videoMark,"id","name");
                    }}
                    ,{field:'keywords', title:'关键词'}
                    ,{field:'relativeObject', title:'关联主题'}
                    ,{field:'relativeCollection', title:'关联藏品', templet: function (res) {
                        var cul = eval(res.relativeCollection);
                        var name = [];
                        if (null != cul) {
                            for (var i = 0; i < cul.length; i++) {
                                name.push(cul[i].culName);
                            }
                        }
                        return name.join("，");
                    }}
                    ,{field:'source', title:'来源',templet: function(res){
                        return property.getTextByValuePlus(videoSourceList,res.source,"dictCode","dictName");
                    }}
                    ,{field:'uploadOrg', title:'上传部门',templet: function(res){
                        return property.getTextByValuePlus(orgList,res.uploadOrg,"departmentId","departmentName");
                    }}
                    ,{field:'status', title:'资料状态',templet: function(res){
                        return property.getTextByValuePlus(statusDictList,res.status,"dictCode","dictName");
                    }}
                    ,{field:'authSetting', title:'下载设置',templet: function(res){
                        return property.getTextByValuePlus(authSettingList,res.authSetting,"dictCode","dictName");
                    }}
                    ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
                ]]
            });
            table.on('tool(test)', function(obj){
                var data = obj.data;
                if(obj.event === 'detail'){
                    localStorage.videoId = data.id;
                    localStorage.pageType = "detail";
                    parent.$t.goToPage(this,"page/video/keywordsList.html");
                }

            });

        });
        this.initTable();
        this.tabBind();

    },
    initTable:function(){
        layui.use('form', function(){
            var form = layui.form;
            form1 =layui.form;

            table.on('tool(test)', function(obj){
                var data = obj.data;
                if(obj.event === 'detail'){
                    localStorage.videoId = data.id;
                    localStorage.pageType = "detail";
                    parent.$t.goToPage(this,"page/video/videoQueryList.html");
                }

            });
        });

    },

    tabBind:function () {
        //导出函数
        $(".layui-btn-green").on({
            'click':function () {
                return false
            }
        })
        //时间切换
        $(".searchBtn").on({
            'click':function () {
                var index=$(this).index();
                if($(this).hasClass('active'))return false
                if(index==1){
                    $(".searchBtn").removeClass("active");
                    $(".searchBtn").eq(0).addClass("active");
                }else{
                    $(".searchBtn").removeClass("active");
                    $(".searchBtn").eq(1).addClass("active");
                }

                return false
            }
        });


        $("#print").click(function () {
            window.print();
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
    return function() {
        var xhr = $.ajaxSettings.xhr();
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }                return xhr;
    }
}

/**
 * 获取全部业务字典数据
 */
function getDictData() {
    var keys = ['video_save_type','video_source','video_type','permissions_settings']
    var dictDataMulti = property.getDictDataMulti(keys);
    videoSaveTypeList = dictDataMulti.video_save_type;
    videoSourceList = dictDataMulti.video_source;
    videoTypeList = dictDataMulti.video_type;
    authSettingList = dictDataMulti.permissions_settings;
    orgList = property.getAllOrgList();
    $.ajax({
        type:"get",
        async:false,
        url:property.getProjectPath()+"PostVideo/queryPostVideoTypeListTree.do",
        success:function(result) {
            if (result.code == 0) {
                videoMarkList = result.data;
            } else {
                errorMsg();
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}








