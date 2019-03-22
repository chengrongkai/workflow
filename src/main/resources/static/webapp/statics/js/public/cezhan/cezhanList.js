var main={

    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        getSelect();
        var _this=this;
        loadTable();

        // 添加
        $('#btnAdd').click(function() {
            // localStorage.clear();
            localStorage.removeItem('id');
            localStorage.curatorType = 'add';
            parent.$t.goToPage(this, "page/public/cezhan/list.html");
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

            //监听查询
            form.on('submit(formDemo)', function(data){
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


            //回车触发查询
            $("#themeName").keypress(function(e){
                if (e.which == 13){
                    loadTable();
                }
            });



        });
        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });
    }
}



function  getSelect(){
    //获取排序方式下拉框
    orderType = property.getDictData('order_by');
    var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');
    $("#orderBy").append(orderTypeSelect);
}



main.init();




/**
 * 加载表格数据
 */
function loadTable(){
    layui.use('table', function(){
        var table = layui.table;
        var themeName = $("#themeName").val();
        var processState = $("#processState option:selected").val();
        var processResult = $("#processResult option:selected").val();


        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"curator/getCuratorList.do?themeName="+themeName+"&processState="+processState+"&processResult="+processResult
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            ,toolbar: '#toolbarDemo'
            ,title: '公众策展数据表'
            ,id : "curatorTable"
            ,cols: [[
                {type:"numbers", title:'编号'}
                ,{field:'mainPicUrl', title: '封面图片',width:110, style:'height:88px;', align:'center',templet:"#mainPicUrl"}
                ,{field:'themeName', title:'主题名称'}
                ,{field:'userName', title:'创建账号'}
                ,{field:'collectionAmount', title:'藏品数量'}
                ,{field:'processState', title:'处理状态',templet:function(data){
                        if (data.processState == "0"){
                            return "待处理";
                        }else if(data.processState == "1"){
                            return "已处理";
                        } else {
                            return "-";
                        }
                  }}
                ,{field:'processResult', title:'处理结果',templet:function(data){
                        if (data.processResult == "-1" || data.processResult == "" || data.processResult == null){
                            return "-";
                        }else if(data.processResult == "1"){
                            return "采用";
                        }else if(data.processResult == "0"){
                            return "不采用";
                        }
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
                layer.confirm('真的删除行么', function(index){
                    var json = {"id":data.id};
                    $.ajax({
                        type:"get",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"curator/deleteById.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除公众策展成功");
                                loadTable();
                            } else if (result.success == 0){
                                //top.layer.msg(result.error.message);
                                errorMsg("删除公众策展失败");
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    layer.close(index);
                });
            } else if(obj.event === 'edit'){
                localStorage.curatorType = "edit";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/cezhan/list.html");
            }else if(obj.event === 'detail'){
                localStorage.curatorType = "detail";
                localStorage.id = data.id;
                parent.$t.goToPage(this,"page/public/cezhan/list.html");
            }
        });
    });
}