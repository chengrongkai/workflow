/**
 * author: zhangwei
 * 角色管理列表
 */
var typeLevelList = null;
//排序方式,默认为倒序
var orderBy = 1;
var main = {

    init: function() {
        this.initTable();
        this.tabBind();
    },
    initTable: function() {
        getDictData();
        setSelect();

        var _this=this;
        loadTable();
        // 添加
        $('#btnAdd').click(function() {
            localStorage.roleType = "add";
            parent.$t.goToPage(this, "page/video/videoTypeList.html");
        });
    },
    tabBind: function() {
        layui.use(['form'], function () {
            var form = layui.form;
            //监听查询
            form.on('submit(formDemo)', function(data){
                loadTable();
                return false;
            });
            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("input").val("");
                $("#status").val("");
                $("#typeLevel").val("");
                $(this).prev().click();
                return false;
            });

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
                var flag = obj.elem.checked;
                var status = 0;
                if (flag){
                    status = 1;
                }else {
                    status = 0;
                }
                var typeId = $(obj.elem).attr("data-id");
                var json = {"status":status,"id":typeId};
                $.ajax({
                    type:"post",
                    data:json,
                    async:false,
                    url:property.getProjectPath()+"PostVideo/changeTypeStatus.do",
                    success:function(result) {
                        if (result.success == 1) {
                            // loadTable();
                            successMsg("操作成功");
                            loadTable();
                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
            });



            form.on('select(orderBy)', function(data){
                orderBy =  data.value;
                loadTable();
                return false;
            });



            
        });

        $("#keywords").keypress(function(e){
            if (e.keyCode == 13){
                loadTable();
            }
        });

        $("#typeLevel").keypress(function(e){
            if (e.keyCode == 13){
                loadTable();
            }
        });
        $("#status").keypress(function(e){
            if (e.keyCode == 13){
                loadTable();
            }
        });
    }
}
main.init();

function loadTable() {
    layui.use('table', function(){
        var table = layui.table;
        var form = layui.form;
        var keywords = $("#keywords").val();
        var typeLevel = $("#typeLevel").val();
        var status = $("#status").val();
        table.render({
            elem: '#test'
            ,url:property.getProjectPath()+"PostVideo/queryPostVideoTypeList.do?keywords="+keywords+"&typeLevel="+typeLevel
            +"&status="+status+"&orderBy="+orderBy
            ,title: '用户数据表'
            ,cols: [[
                {type:'numbers', title:'编号', width:80, fixed: 'left', unresize: true, sort: true}
                ,{field:'name', title:'分类名称'}
                ,{field:'typeCode', title:'分类代码'}
                ,{field:'typeLevel', title:'级别',templet:function (res) {
                    return property.getTextByValuePlus(typeLevelList,res.typeLevel,"dictCode","dictName");
                }}
                ,{field:'typeMark', title:'分类依据'}
                ,{field:'status', title:'状态', templet: '#switchTpl'}
                ,{field:'sort', title:'排序值'}
                ,{fixed: 'right', title:'设置', toolbar: '#setting', width:200}
                ,{fixed: 'right', title:'操作', toolbar: '#barDemo', width:200}
            ]]
            ,page: true
        });

        //监听行工具事件
        table.on('tool(test)', function(obj){
            var data = obj.data;
            if(obj.event === 'del') {
                layer.confirm('真的删除行么', function(index){
                    var json = {"id":data.id};
                    $.ajax({
                        type:"post",
                        data:json,
                        async:false,
                        url:property.getProjectPath()+"PostVideo/deletePostVideoType.do",
                        success:function(result) {
                            if (result.success == 1) {
                                successMsg("删除分类成功");
                                loadTable();
                            } else if (result.success == 0){
                                errorMsg(result.error.message);
                            }
                        },
                        error:function(result) {
                            errorMsg("系统异常");
                        }
                    });
                    layer.close(index);
                });
            } else if (obj.event === 'edit'){
                localStorage.roleType = "edit";
                localStorage.roleId = data.id;
                parent.$t.goToPage(this, "page/video/videoTypeList.html");
            }else if (obj.event === "addChildren"){
                localStorage.roleType = 'addChildren';
                localStorage.pid = data.id;
                parent.$t.goToPage(this, "page/video/videoTypeList.html");
            }
            else if (obj.event === "showChildren"){
                $("#keywords").val(data.typeCode);
                var level = data.typeLevel;
                var temp = parseInt(level)+1;
                var nowLevel = ""+ temp;
                $("#typeLevel").val(nowLevel);
                form.render('select');
                loadTable();
            }
        });
    });
}

/**
 * 获取全部业务字典数据
 */
function getDictData() {
    var keys = ['video_type_level'];
    var dictDataMulti = property.getDictDataMulti(keys);
    typeLevelList = dictDataMulti.video_type_level;
}


/**
 * 设置下拉框
 */
function setSelect() {
    layui.use('form', function() {
        var form = layui.form;
        // var pidSelect = component.getSelectPlus(videoTypeList, null, "pid", "id", "name");
        // $("#pid").html(pidSelect);

        var typeLevelSelect = component.getSelectSimplePlus(typeLevelList, null, "typeLevel", "dictCode", "dictName");
        $("#typeLevel").append(typeLevelSelect);
        form.render('select');
        // form.on('select(pid)', function(data){
        // });

    })
}

