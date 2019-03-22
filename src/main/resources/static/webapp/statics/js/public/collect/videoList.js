var main={

    init:function () {
        $('#btnAdd').click(function() {
            localStorage.userType = "add";
            parent.$t.goToPage(this, "page/public/collect/list.html");
        });

        // 给type 下拉框赋值
        var typeDatas = yc.ajaxGetByParams('sysDict/getSelectDataByKey.do', {key: 'post_collect'}, null);
        var  typeData = typeDatas.data.map(function (obj){
           return {value: obj.id, text: obj.dictName}
        });
        //var typeData = typeDatas.data.map((obj) => {return {value: obj.id, text: obj.dictName}});
        var selects_types = component.getSelect(typeData, null, "type");
        $("#type").html(selects_types);
        // 给 sonType 下拉框赋值

        var sonTypeDatas = yc.ajaxGetByParams('sysDict/getSelectDataByKey.do', {key: 'post_collect_two'}, null);
        var sonTypeData = sonTypeDatas.data.map(function (obj) {
            return { value: obj.id, text: obj.dictName };
        });
        //var sonTypeData = sonTypeDatas.data.map((obj) => {return {value: obj.id, text: obj.dictName}});
        var selects_sonTypes = component.getSelect(sonTypeData, null, "sonType");
        $("#sonType").html(selects_sonTypes);


        //获取排序方式下拉框
        orderType = property.getDictData('order_by');
        var orderTypeSelect = component.getSelectSimplePlus(orderType, null, 'orderBy', 'dictCode', 'dictName');
        $("#orderBy").append(orderTypeSelect);



        this.initTable(null);
        this.tabBind()
    },
    initTable:function(where){
        var _this=this;
        reloadTable();
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
            form.on('switch(sexDemo)', function(data){
                var flag = data.elem.checked;

                var commend = 0;
                var msg = "";
                if (flag){
                    commend = 1;
                    msg="推荐成功！";
                }else {
                    commend= 0;
                    msg="取消成功！";
                }
                var id = $(data.elem).attr("data-id");
                var json = {id: id, commend: commend};
                $.ajax({
                    type:"post",
                    data:JSON.stringify(json),
                    dataType: 'json',
                    contentType: "application/json",
                    async:false,
                    url:property.getProjectPath()+"collect/updateCollectType.do",
                    success:function(result) {
                        if (result.success == 1) {
                            //reloadTable();
                            successMsg(msg);
                        } else if (result.success == 0){
                            //reloadTable();
                           // $(data.elem).attr("checked",false);
                            reloadTable();
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });



/*
                console.log(data)
                var flag = data.elem.checked;
                var id = data.elem.dataset.id;
                var commend = '1';
                if (data.value == 1) {
                    commend = 0;
                }
                console.log(commend);

                // if (data.elem.checked) {
                //     commend = "1";
                // } else {
                //     commend = "0";
                // }


                var msg = '推荐成功';
                if (flag) {
                    commend = '0';
                    msg = '取消推荐成功';
                    $(data.elem).attr("checked",false);
                }

                let collect = {id: id, commend: commend};
                var datas = yc.ajaxPostByJson('collect/updateCollectType', collect, null, msg,data.elem);
                form.render();
                return false;*/

            });

            //监听查询
            form.on('submit(formDemo)', function(data){
                var datas = data.field;
                var type = datas.type || '';
                // var sonType= $("#sonTypeId").val() || '';
                var sonType = datas.sonType || '';
                var name = $("#selName").val() || '';
                var json = {name: name, typeId: type, sonTypeId: sonType};
                _this.initTable(json);
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
main.init();




/**
 * 加载表格数据
 */
function reloadTable(){

    layui.use('table', function(){
        var table = layui.table;
        var name = $("#selName").val();
        var typeId = $("#type option:selected").val();
        var  sonTypeId = $("#sonType").val();
        var  orderBy = $("#orderBy").val();
        //console.dir(name+typeId+sonTypeId);
        table.render({
            elem: '#test'
            ,url: property.getProjectPath()+"collect/getListCollect.do?name="+name+"&typeId="+typeId +"&sonTypeId="+sonTypeId+"&orderBy="+orderBy
            ,request:{
                pageName: 'currentPage',
                limitName: 'size'
            }
            //,where: where || {}
            ,toolbar: '#toolbarDemo'
            ,title: '用户数据表'
            ,cols: [[
                //{type: 'checkbox'}
                // ,{field:'id', title:'编号', width:80, fixed: 'left', unresize: true, sort: true}
                {type: 'numbers', title:'编号'}
                ,{field:'mainPicUrl', title: '藏品图片',width:110, style:'height:88px;', align:'center',templet:"#mainPicUrl"}
                ,{field:'name', title:'藏品名称'}
                // ,{field:'name', title:'藏品名称', width:250, edit: 'text', templet: function(res){
                //         return '<em>'+ res +'</em>'
                //     }}
                ,{field:'type', title:'藏品类别'}
                // ,{field:'type', title:'藏品类别', width:185, templet: '#switchTpl', unresize: true}
                ,{field:'sonType', title:'藏品子类别'}
                ,{field:'commend', title:'推荐',width:200, templet: '#switchTp2'}
                ,{title:'操作',toolbar: '#barDemo'}
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
                    //var ids = data.map(obj => obj.id);
                    var ids = data.map(function (obj){
                        return obj.id;
                    });
                    var length = ids.length;
                    if (length <= 0) {
                        alertMsg('请勾选要删除的藏品信息');
                        return ;
                    } else {
                        var idStr = ids.join(',');
                        let datas = yc.ajaxGetByParams('collect/updateCollectByIds', {ids: idStr}, null);
                        if (datas.success == 1) {
                            successMsg('批量删除成功');
                            reloadTable();
                        } else if (datas.success == 0){
                            errorMsg('批量删除失败');
                        }
                    }
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
                    obj.del();
                    let delId = obj.data.id;
                    var datas = yc.ajaxGetByParams('collect/deleteCollectById', {id: delId}, null);
                    if (datas.success == 1) {
                        successMsg('删除成功');
                        reloadTable();
                    } else if (datas.success == 0){
                        errorMsg('删除失败');
                    }
                    parent.layer.close(index);
                    //reloadTable();
                });
            } else if(obj.event === 'edit'){
                localStorage.userType = "edit";
                localStorage.userId = obj.data.collect.id;
                parent.$t.goToPage(this,"page/public/collect/list.html");
            }else if(obj.event === 'detail'){
                localStorage.userType = "detail";
                localStorage.userId = obj.data.collect.id;
                parent.$t.goToPage(this,"page/public/collect/list.html");
                // layer.prompt({
                //     formType: 2
                //     ,value: data.email
                // }, function(value, index){
                //     obj.update({
                //         email: value
                //     });
                //     layer.close(index);
                // });
            }
        });
        return false
    });


}