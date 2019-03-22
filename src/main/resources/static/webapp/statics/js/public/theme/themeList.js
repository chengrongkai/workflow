var sourceList = [];
var main={

    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        setSelect();
        getSelectData();
        //getThemeShowOptions();
        //setSelect();

        var _this=this;
        loadTable();


        // 添加
        $('#btnAdd').click(function() {
            // localStorage.clear();
            localStorage.removeItem('themeType');
            localStorage.themeType = 'add';
            parent.$t.goToPage(this, "page/public/theme/list.html");
        });



    },
    tabBind:function () {
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

            //监听推荐操作
            form.on('switch(recommend)', function(data){
                var recommendName = data.elem.name;
                var recommendId = data.elem.value;
                var dataState = $(data.elem).attr("dataState");
                var recommendStatus;
                if (data.elem.checked) {
                    recommendStatus = "1";
                } else {
                    recommendStatus = "0";
                }
                $.ajax({
                    type:"get",
                    dataType:'json',
                    //contentType:'application/json',
                    contentType:'application/x-www-form-urlencoded',
                    url:property.getProjectPath()+"themeshow/modifyRecommend.do",
                    data:{"recommendStatus":recommendStatus,"recommendId":recommendId,"recommendName":recommendName},
                    success:function(result) {
                        if (result.success == 1) {
                            loadTable();
                            form.render();
                            return false;
                        } else if (result.success == 0){
                            if(recommendStatus == "1"){
                                $(data.elem).attr("checked",false);
                            }else{
                                $(data.elem).attr("checked",true);
                            }
                            form.render();
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {

                    }
                })
            });

            //监听查询
            form.on('submit(formDemo)', function(data){
                //layer.msg(JSON.stringify(data.field));
                loadTable();
                return false;
            });
            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("select").val("");
                $(this).parents(".layui-form").find("input").val("");
                $(this).prev().click();
            });


            //排序方式
            form.on('select(orderBy)',function(){
                loadTable();
                return false;
            })

        });
        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });





    }
}

//获取页面下拉数据
function getThemeShowOptions() {
    layui.use(['form'], function () {
        var form = layui.form;
        $.ajax({
            type:"get",
            url:property.getProjectPath()+"themeshow/getSourceOptions.do",
            data:{},
            success:function(result) {
                if (result.success == 1) {
                    var dataList = result.data;
                    var sourceStr = "";
                    for(var i = 0;i < dataList.length;i++) {
                        sourceStr +="<option value='"+dataList[i].themeSource+"' >"+dataList[i].themeSource+"</option>"
                    }
                    $("#themeSource").append(sourceStr);
                    form.render();
                }
            }
        })
    })

}

function getThemeShowOptions2(){
    $.ajax({
        type:"get",
        data:{},
        async:false,
        url:property.getProjectPath()+"themeshow/getSourceOptions.do",
        success:function(result) {
            if (result.code == 0) {
                sourceList = result.data;
            } else {
                errorMsg("数据异常");
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}



//获取页面下拉数据(来源)
function getSelectData(){
        typeList = property.getDictData('theme_source');
        var sourceTypeSelect = component.getSelectSimplePlus(typeList, null, 'storyType', 'dictCode', 'dictName');
        $("#themeSource").append(sourceTypeSelect);
}


function setSelect(){
    //var typeSelect = component.getSelect(sourceList,null,"themeSource");
    //$("#themeSource").html(typeSelect);

    layui.use('form', function() {
        var form = layui.form;
        //获取排序方式下拉框
        orderType = property.getDictData('order_by');
        var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');
        $("#orderBy").append(orderTypeSelect);
        form.render('select');
    });


}




main.init();




/**
 * 加载表格数据
 */
function loadTable(){
    layui.use('table', function(){
        var table = layui.table;
        var themeName = $("#themeName").val();
        // var themeSource = $("#themeSource").find("option:selected").text();
        var themeSource = $("#themeSource").val();
        var  orderBy = $("#orderBy").val();

        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"themeshow/getThemeShowList.do?themeName="+themeName+"&themeSource="+themeSource+"&orderBy="+orderBy
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '主题展数据表'
            ,id : "themeShowTable"
            ,cols: [[
                {type:"numbers", title:'编号'}
                ,{field:'mainPicUrl', title: '主题封面',width:110, style:'height:88px;', align:'center',templet:"#mainPicUrl"}
                ,{field:'themeName', title:'主题名称'}
                , {field:'themeSource', title:'来源', templet: function(res){
                        var source = "";
                        if (res.themeSource == 1) {
                            source = "系统创建";
                        } else {
                            source = "在线策展";
                        }
                        return '<em>'+ source +'</em>';
                    }}
                ,{field:'collectionAmount', title:'藏品数量'}
                ,{field:'sign', title:'推荐',templet: '#switchTp2',style:"height:88px"}
                ,{title:'操作', toolbar: '#barDemo'}
            ]],done:function(d){
                $("[data-field = 'mainPicUrl']").children(".layui-table-cell").css({"height":"100%","max-width":"100%","position":"relative"});
                $("[data-field = 'mainPicUrl']").children(".layui-table-cell").eq(0).css({"height":"auto","max-width":"100%","position":"relative"});
                $("[data-field = 'mainPicUrl']").find("img").css({"max-width":"100%","max-height":"100%","position":"absolute","top":"50%","left":"50%","transform":"translate(-50%, -50%)"});
            }
            ,page: true
        });
        //头工具栏事件
        table.on('toolbar(test)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'getCheckData':
                    var data = checkStatus.data;
                    break;
                case 'getCheckLength':
                    var data = checkStatus.data;
                    layer.msg('选中了：'+ data.length + ' 个');
                    break;
                case 'isAll':
                    layer.msg(checkStatus.isAll ? '全选': '未全选');
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'del'){
                layer.confirm('真的删除行么', function(index){
                    var json = {"id":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"themeshow/deleteById.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除主题展成功");
                                loadTable();
                            } else if (result.success == 0){
                                //top.layer.msg(result.error.message);
                                errorMsg("删除主题展失败");
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    layer.close(index);
                });
            } else if(obj.event === 'edit'){
                localStorage.themeType = "edit";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/theme/list.html");
            }else if(obj.event === 'detail'){
                localStorage.themeType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/theme/list.html");
            }
        });
    });
}