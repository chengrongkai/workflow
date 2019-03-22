var userType = "0";
var projectName = property.getProjectPath();
var value = "forVideo";

var main={

    init:function () {
        $('#searchName').val(decodeURI(window.location.href).split("=")[1]);
        getDictData();
        setSelect();
        property.setUserInfo();
        if (checkOrg(userInfo.userId)){
            userType = '1';
        }
        // 给type 下拉框赋值
        var typeDatas = yc.ajaxGetByParams('sysDict/getSelectDataByKey.do', {key: 'post_collect'}, null);
        var typeData = typeDatas.data.map((obj) => {return {value: obj.id, text: obj.dictName}});
        var selects_types = component.getSelect(typeData, null, "type");
        $("#type").html(selects_types);
        // 给 sonType 下拉框赋值

        var sonTypeDatas = yc.ajaxGetByParams('sysDict/getSelectDataByKey.do', {key: 'post_collect_two'}, null);
        var sonTypeData = sonTypeDatas.data.map((obj) => {return {value: obj.id, text: obj.dictName}});
        var selects_sonTypes = component.getSelect(sonTypeData, null, "sonType");
        $("#sonType").html(selects_sonTypes);


        //获取排序方式下拉框
        orderType = property.getDictData('order_by');
        var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');
        $("#orderBy").append(orderTypeSelect);

        layui.use('laydate', function(){
            var laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#exhibitionPlanTime' //指定元素
            });
        });

        this.initTable(null);
        this.tabBind();

        $('#searchName').bind('keydown',function(event){
            if(event.keyCode == "13") {
                renderTable();
            }
        });
        $('#searchName').blur(function () {
            renderTable();
        })
        $('#searchName').change(function () {
            renderTable();
        })
        $('#forLiterature').hide();
        $('#forExhibition').hide();
    },
    initTable:function(where){
        var _this=this;
        loadVideoTable();
    },
    tabBind:function () {
        var _this=this;
        layui.use(['form'], function () {
            var form = layui.form;
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
                // layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
                var flag = obj.elem.checked;
                var id = obj.elem.dataset.id;
                var commend = '1';
                var msg = '推荐成功';
                if (!flag) {
                    commend = '0';
                    msg = '取消推荐成功';
                }
                let collect = {id: id, commend: commend};
                var datas = yc.ajaxPostByJson('collect/updateCollectType', collect, null, msg);
                return false;

            });

            //监听查询
            form.on('submit(formDemo)', function(data){
                var datas = data.field;
                var searchName = $('#searchName').val();
                if (value == "forVideo") {
                    loadVideoTable();
                } else if (value == "forLiterature") {
                    loadLiteratureTable();
                } else if (value == "forExhibition") {
                    loadExhibitionTable();
                } else if (value == "forSocialist") {
                    loadSocialistTable();
                }
                return false;
            });
            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("select").val("");
                $(this).parents(".layui-form").find("input").val("");
                $("#searchName").val("");
                $(this).prev().click();
            });


            //排序方式
            form.on('select(orderBy)',function(){
                renderTable();
                return false;
            })

            form.on('select(searchType)', function () {
                var selectValue = $('#searchType').val();
                $('#'+value).hide();
                value = "for" + selectValue.substring(0, 1).toUpperCase() + selectValue.substring(1);
                $('#'+value).show();
                form.render();
                renderTable();
            })
        });
    }
}
main.init();
function renderTable() {
    switch (value) {
        case 'forVideo':
            loadVideoTable();
            break;
        case 'forLiterature':
            loadLiteratureTable();
            break;
        case 'forExhibition':
            loadExhibitionTable();
            break;
        case 'forSocialist':
            loadSocialistTable();
            break;
        case 'forCollection':
            initCollectTable();
            break;
    }
}

function setSelect() {
    // var videoTypeSelect  = component.getSelectPlus(videoTypeDictList,null,"videoType","dictCode","dictName");
    // $("#videoType").html(videoTypeSelect);
    // var statusSelect  = component.getSelectSimplePlus(statusDictList,null,"status","dictCode","dictName");
    // $("#videoStatus").append(statusSelect);
    var videoMarkSelect  = component.getSelectSimplePlus(videoMarkList,null,"videoMark","id","name");
    $("#videoMark").append(videoMarkSelect);
}

function getDictData() {
    var keys = ['video_type','video_status','permissions_settings','video_source','video_save_type']
    var dictDataMulti = property.getDictDataMulti(keys);
    statusDictList = dictDataMulti.video_status;
    videoSourceList = dictDataMulti.video_source;
    videoTypeList = dictDataMulti.video_type;
    authSettingDictList = dictDataMulti.permissions_settings;
    sourceDictList = dictDataMulti.video_source;
    saveTypeDictList = dictDataMulti.video_save_type;
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

                    var literature_type = map.literature_type;
                    var literatureTypeStr = "";
                    for(var j = 0;j < literature_type.length;j++) {
                        literatureTypeStr +="<option value='"+literature_type[j].dictCode+"' >"+literature_type[j].dictName+"</option>"
                    }
                    $("#literatureDataType").append(literatureTypeStr);

                    // var order_by = map.order_by;
                    // var orderStr = "";
                    // for(var k = 0;k < order_by.length;k++) {
                    //     orderStr +="<option value='"+order_by[k].dictCode+"' >"+order_by[k].dictName+"</option>"
                    // }
                    // $("#orderBy").append(orderStr);

                    form.render();
                }
            }
        })

    });
}

/**
 * 加载表格数据
 */
function loadVideoTable() {
    layui.use('table', function(){
        var table = layui.table;
        var keywords = $("#searchName").val();
        var videoMark = $("#videoMark").val();
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"PostVideo/queryVedilListForCompreQuery.do?keywords="+keywords+"&videoMark="+videoMark+"&orderBy="+$("#orderBy").val()
            +"&module=-2"
            // ,toolbar: '#toolbarDemo'
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
                        var videoMark = property.getTextByValuePlus(videoMarkList,res.videoMark,"id","name");
                        return null == videoMark ? '' : videoMark;
                    }}
                ,{field:'relativeObject', title:'关联主题'}
                ,{field:'relativeCollection', title:'关联藏品'}
                ,{field:'source', title:'来源',templet: function(res){
                        var source = property.getTextByValuePlus(sourceDictList,res.source,"dictCode","dictName");
                        return null == source ? '' : source;
                    }}
                ,{field:'uploadOrg', title:'上传部门',templet: function(res){
                        var uploadOrg = property.getTextByValuePlus(orgList,res.uploadOrg,"departmentId","departmentName");
                        return null == uploadOrg ? '' : uploadOrg;
                    }}
                ,{field:'status', title:'资料状态',templet: function(res){
                        var status = property.getTextByValuePlus(statusDictList,res.status,"dictCode","dictName");
                        return null == status ? '' : status;
                    }}
                ,{field:'authSetting', title:'下载设置',templet: function(res){
                        var authSetting = property.getTextByValuePlus(authSettingDictList,res.authSetting,"dictCode","dictName");
                        return null == authSetting ? '' : authSetting;
                    }}
                ,{fixed: 'right', title:'操作', toolbar: '#videoBar', width:300}
            ]]
            ,page: true
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'videoDetail'){
                localStorage.videoId = data.id;
                localStorage.pageType = "detail";
                parent.$t.goToPage(this,"main/comprehensiveQuery.html");
            }
        });
    });
}

function loadLiteratureTable() {
    layui.use('table', function() {
        var table = layui.table;
        var tableIns = table.render({
            elem: '#test'
            , url: projectName + '/postLiterature/postLiteratureList.do'+'?module=-2'
            , where: {
                key: $("#searchName").val(),
                dataType: $('#literatureDataType').val(),
                status : 2,
                open: 1,
                orderBy: $('#orderBy').val()
            }
            , request: {
                pageName: 'currentPage',
                limitName: 'size'
            }
            , toolbar: '#literaturetoolbar'
            , title: '文献资料列表'
            , defaultToolbar: []
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {type: 'numbers', title: '序号'}
                , {field: 'dataName', title: '文献名称', width: 100}
                , {field: 'dataTypeName', title: '文献类型', width: 120}
                , {field: 'number', title: '数量', width: 85}
                , {field: 'price', title: '单价', width: 100}
                , {field: 'press', title: '出版社'}
                , {field: 'publishingTime', title: '出版时间', width: 80, sort: true}
                , {field: 'warehousesName', title: '入库人', width: 100}
                , {field: 'literatureTypeName', title: '文献分类', width: 100, sort: true}
                , {field: 'literatureTypeIndex', title: '分类索书号', width: 100}
                , {field: 'inventoryStateName', title: '库存状态', width: 100}
                , {field: 'statusName', title: '状态', width: 100}
                , {field: 'permissionsSettingsName', title: '权限设置', width: 100}
                , {fixed: 'right', title: '操作', toolbar: '#literatureBar', width: 170}
            ]]
            , page: true
            , limits: [10, 15, 20, 25]
            , limit: 10
            , id: "literatureTable"
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if (obj.event == 'literatureDetail') {
                localStorage["dataObject"]=JSON.stringify(data);
                parent.$t.goToPage(this, "main/comprehensiveQuery.html");
            }
        });
    })
}

function loadExhibitionTable() {
    layui.use('table', function () {
        var table = layui.table;
        var util = layui.util;
        table.render({
            elem: '#test',
            where: {
                name: $("#searchName").val(),
                planTime: $('#exhibitionPlanTime').val(),
                orderBy: $('#orderBy').val()
            },
            url: property.getProjectPath() + 'exhib/getListExhibition.do'+'?module=-2',
            request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '用户数据表'
            ,cols: [[
                {type: 'checkbox', fixed: 'left'}
                ,{type:'numbers', title:'编号', fixed: 'left', unresize: true, sort: true}
                ,{field:'exhibName', title:'展陈名称', edit: 'text'}
                ,{field:'inportWord', title:'关键词',edit: 'text'}
                ,{field:'roomNum', title:'展厅数量'}
                ,{field:'colleNum', title:'关联藏品'}
                ,{field:'videoNum', title:'关联影视资料'}
                ,{field:'planTime', title:'策划时间', sort: true,
                    templet: function (res) {
                        // return util.toDateString(res.planTime, 'yyyy-MM-dd HH:mm');
                        return util.toDateString(res.planTime, 'yyyy-MM-dd');
                    }
                }
                ,{field:'startTime', title:'开始时间',
                    templet: function (res) {
                        return util.toDateString(res.startTime, 'yyyy-MM-dd');
                    }
                }
                ,{field:'endTime', title:'结束时间',  sort: true,
                    templet: function (res) {
                        return util.toDateString(res.endTime, 'yyyy-MM-dd');
                    }}
                ,{field:'remark', title:'备注', }
                ,{fixed: 'right', title:'操作', toolbar: '#exhibitionDemo'}
            ]]
            ,page: true
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if (obj.event == 'exhibitionDetail') {
                localStorage.ExhibType = "detail";
                localStorage.ExhibId = data.id;
                parent.$t.goToPage(this,"main/comprehensiveQuery.html");
            }
        });
    })
}

function loadSocialistTable() {
    layui.use('table', function() {
        var table = layui.table;
        var tableObj = table.render({
            elem: '#test'
            , url: property.getProjectPath() + "postsocial/getSocialList.do?keywords=" + $("#searchName").val()+'&module=-2'
            , request: {
                pageName: 'currentPage',
                limitName: 'size',
            }
            , where: {
                orderBy: $('#orderBy').val()
            }
            , toolbar: '#toolbarDemo'
            , title: '社教管理表'
            , id: "showSocialTable"
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {type: 'numbers', title: '编号', width: 80, fixed: 'left', unresize: true}
                , {field: 'socialName', title: '社教名称'}
                , {field: 'keyWord', title: '关键词'}
                , {field: 'cooperationMode', title: '合作方式'}
                , {field: 'cooperationUnit', title: '合作单位'}
                , {
                    field: 'holdTime', title: '举办时间', templet: function (data) {
                        return formatSimpleDate(data.holdTime);
                    }
                }
                , {field: 'head', title: '提交人'}
                , {field: 'remark', title: '备注'}
                , {fixed: 'right', title: '操作', toolbar: '#socialistDemo', width: 200}
            ]]
            , page: true
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if (obj.event == 'socialistDetail') {
                localStorage.socialType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this, "main/comprehensiveQuery.html");
            }
        });
    })
}

function initCollectTable() {
    $.post(projectName + "interfaceCollect/getShareCulFieldAndDataList.do", {
        keyWord: $("#searchName").val(),
        pageIndex: 0,
        pageSize: 0
    }, function (res) {
        if (res.code == 0) {
            var head = res.head;
            var col = [];
            col.push({type: 'checkbox', fixed: 'left'}, {type: 'numbers', title: '编号', width: 80, fixed: 'left', unresize: true});
            jQuery.each(head, function (key, value) {
                col.push({
                    field: key,
                    title: value
                })
            })
            col.push({fixed: 'right', title: '操作', toolbar: '#collectDemo', width: 200});

            layui.use('table', function() {
                var table = layui.table;
                var tableObj = table.render({
                    elem: '#test'
                    , url: projectName + "interfaceCollect/getShareCulFieldAndDataList.do"
                    , request: {
                        pageName: 'pageIndex',
                        limitName: 'pageSize'
                    }
                    , where: {
                        keyWord: $("#searchName").val()
                    }
                    , toolbar: '#toolbarDemo'
                    , title: '藏品管理表'
                    , id: "showCollectTable"
                    , cols: [col]
                    , page: true
                });

                //监听行工具事件
                table.on('tool(test)', function(obj){
                    var data = obj.data;
                    if (obj.event == 'socialistDetail') {
                        localStorage.socialType = "detail";
                        localStorage.id = data.id;
                        parent.$t.goToPage(this, "main/comprehensiveQuery.html");
                    }
                });
            })
        } else {
            layer.msg(res.msg);
        }
    })
}
