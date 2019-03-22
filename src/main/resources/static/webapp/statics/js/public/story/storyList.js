var typeList = [];
var main={

    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        setSelect();
        //getStoryTypeOptions();
        var _this=this;
        reloadTable();


        // 添加
        $('#btnAdd').click(function() {
            //localStorage.clear();
            localStorage.removeItem('id');
            localStorage.storyType = 'add';
            parent.$t.goToPage(this, "page/public/story/list.html");
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
            //监听性别操作
            form.on('switch(sexDemo)', function(obj){
                layer.tips(this.value + ' ' + this.name + '：'+ obj.elem.checked, obj.othis);
            });

            layui.use('laydate', function(){
                var laydate = layui.laydate;
                //执行一个laydate实例
                laydate.render({
                    elem: '#createTime' //指定元素
                });
            });


            //监听查询
            form.on('submit(formDemo)', function(data){
                reloadTable();
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
                reloadTable();
                return false;
            })

        });
        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });
    }
}


function getStoryTypeOptions(){
    $.ajax({
        type:"get",
        data:{},
        async:false,
        url:property.getProjectPath()+"stampstory/getStoryTypeOptions.do",
        success:function(result) {
            if (result.success == 1) {
                typeList = result.data;
                setSelect();
            } else if (result.success == 0){
                errorMsg("数据异常");
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
}


//获取页面下拉数据
function getSelectData(data){
    layui.use('form', function() {
        var form = layui.form;
        typeList = property.getDictData('stamp_story');
        var storyTypeSelect = component.getSelectSimplePlus(typeList, null, 'storyType', 'dictCode', 'dictName');

        //获取排序方式下拉框
        orderType = property.getDictData('order_by');
        var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');

        $("#storyType").append(storyTypeSelect);
        $("#orderBy").append(orderTypeSelect);
        form.render('select');
    });
}



function setSelect(data) {
    getSelectData(data);
}



main.init();




/**
 * 加载表格数据
 */
function reloadTable(){
    layui.use('table', function(){
        var table = layui.table;
        var storyType = $("#storyType option:selected").val();
        var createTime = $("#createTime").val();
        var  orderBy = $("#orderBy").val();
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"stampstory/getStampStoryList.do?storyType="+storyType+"&createTime="+createTime+"&orderBy="+orderBy
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '邮政故事数据表'
            ,id : "stampStoryTable"
            ,cols: [[
                //{type: 'checkbox'}
                {type:"numbers", title:'编号'}
                ,{field:'createTime', title:'创建时间',templet:function(data){
                        return  formatDate(data.createTime);}}
                ,{field:'mainPicUrl', title: '封面图片',width:110, style:'height:88px;', align:'center',templet:"#mainPicUrl"}
                ,{field:'storyTitle', title:'故事标题'}
                ,{field:'storyType', title:'故事类型',templet: function(d){
                          return property.getTextByValue(typeList,d.storyType);
                    }}
                ,{title:'操作', toolbar: '#barDemo'}
            ]],
            done:function(d){
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

                parent.layer.confirm('确定要删除么',{icon:3, title:'删除确认'}, function(index){
                    var json = {"id":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"stampstory/deleteById.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除邮政故事成功");
                                reloadTable();
                            } else if (result.success == 0){
                                //top.layer.msg(result.error.message);
                                errorMsg("删除邮政故事失败");
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    parent.layer.close(index);
                });
            } else if(obj.event === 'edit'){
                localStorage.storyType = "edit";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/story/list.html");
            }else if(obj.event === 'detail'){
                localStorage.storyType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/story/list.html");
            }
        });
    });
}