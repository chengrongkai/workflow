/**
 * author: zhangwei
 * 角色新增、编辑
 * eleTree组件文档：https://fly.layui.com/extend/eleTree/#doc
 */
var roleId = localStorage.roleId;
var buttonAddList = getButtonListByUser();
var authAddList = getAuthListByUser();
var main = {

    init: function() {
        this.id = localStorage.roleId;
        this.loadBaseInfo(this.id);
        this.getData();
        this.bindEvent();
    },
    bindEvent: function() {
        //监听取消
        $("#cancel").click(function () {
            layer.confirm('确认取消吗?', function(index){
                parent.$(".myRefresh").click();
                layer.close(index);
            });
            return false;
        });

        layui.use('form', function() {
            var form = layui.form;

            // 监听选择全部事件
            form.on('checkbox(chooseAll)', function(data){
                var checkAll = $(data.othis).hasClass('layui-form-checked'); // 是否选中
                
                $.each($('.eleTree'), function(i, item) {
                    var length = $(this).find(".eleTree-node[eletree-floor='1']").length;  // 是否为树结构

                    if(length > 0) {
                        $.each($(this).find(".eleTree-node[eletree-floor='0']"), function () {
                            var isStatusAll = $($($(this).find('.eleTree-checkbox')[0])
                                .find('.layui-icon'))
                                .hasClass('layui-icon-ok'); //是否已全选状态
                            if((!isStatusAll && checkAll) || (isStatusAll && !checkAll)) {
                                $($(this).find('.eleTree-checkbox')[0]).click();  // 全选
                            }
                        });
                        $(this).attr("title","取消选择");
                        form.render();
                    } else {
                        $.each($(this).find('.eleTree-checkbox'), function() {
                            var $this = $(this);
                            var isSel = $(this).find('.layui-icon').hasClass('layui-icon-ok');
                            if((!isSel && checkAll) || (isSel && !checkAll)) {
                                $this.click();
                            }
                        })
                        $(this).attr("title","选择全部");
                        form.render();
                    }
                    
                })


                return false;
            });
        });
    },
    getData: function() {

        // 菜单列表
        var data = [
            {
                "label": "影视资料管理",
                "spread": true,  // 是否展开
                "children": [
                    {
                        "label": "资料管理",
                        "spread": true,   
                        // "disabled": true,  // 是否禁用
                        "children": [
                            {
                                "label": "资料管理",
                                "checked": true
                            },
                            {
                                "label": "上传资料"
                            },
                            {
                                "label": "编辑资料"
                            },
                            {
                                "label": "资料编目"
                            },
                            {
                                "label": "查看资料"
                            }
                        ]
                    },
                    {
                        "label": "资料查询",
                        "spread": true,
                        "children": [
                            {
                                "label": "资料列表",
                                "checked": true
                            },
                            {
                                "label": "查看资料",
                                "checked": true
                            },
                            {
                                "label": "发起申请"
                            }
                        ]
                    }
                ]
            }
        ];

        var data2 = [
            {
                "label": "上传资料",
                "checked": true
            },
            {
                "label": "批量导入",
                "checked": true
            },
            {
                "label": "编辑"
            },
        ];

        var data3 = [
            {
                "label": "录入人数据权限",
            },
            {
                "label": "所有数据权限"
            }
        ];

        this.initTree(data, data2, data3);
    },
    initTree: function(data, data2, data3) {
        var _this = this;
        layui.config({ 
            base: "../../../statics/plugins/layui/lay/mymodules/"
        }).use(['jquery', 'eleTree'], function(){
            var $ = layui.jquery;
             eleTree = layui.eleTree;
            data = _this.loadTree("-1","0");
            eleTree.render({
                elem: '.ele1',
                data:data,
                type: "post",
                showCheckbox: true,  // 是否启用checkbox
                // contextmenuList: ["copy","add","edit","remove"],  // 右键操作
                // drag: true, // 拖拽
                // accordion: true // 手风琴功能
            });
            eleTree.render({
                elem: '.ele2',
                // url: "../../data/home/tree.json",
                // type: "post",
                data: [],
                showCheckbox: true,
                // contextmenuList: ["add","remove"],
                // drag: true,
                // accordion: true
            });
            eleTree.render({
                elem: '.ele3',
                // url: "../../data/home/tree.json",
                // type: "post",
                data: [],
                showCheckbox: true,
                // contextmenuList: ["add","remove"],
                // drag: true,
                // accordion: true
            });

            $("#submit").on("click",function() {
                var functionList = new Array();
                var list1 = eleTree.checkedData(".ele1");
                var list2 = eleTree.checkedData(".ele2");
                list2 = concatWithNoSpeat(list2,buttonAddList);
                var list3 = eleTree.checkedData(".ele3");
                list3 = concatWithNoSpeat(list3,authAddList);
                for (var i=0;i<list1.length;i++){
                    var temp = list1[i];
                    var json = {"functionId":temp.key,"name":temp.label};
                    functionList.push(json);
                }
                var tempList = new Array();
                for (var i=0;i<list2.length;i++){
                    var temp = list2[i];
                    var json = {"functionId":temp.key,"name":temp.label};
                   if (tempList == null || tempList.length==0||tempList.indexOf(temp.key)==-1){
                       functionList.push(json);
                       tempList.push(temp.key);
                   }
                }
                for (var i=0;i<list3.length;i++){
                    var temp = list3[i];
                    var json = {"functionId":temp.key,"name":temp.label};
                    functionList.push(json);
                }
                var json = {"roleId":roleId,"res":functionList};
                var index = layer.load();
                $.ajax({
                    url:property.getProjectPath()+"ResAuth/batchUpdateResAuth.do",
                    async:false,
                    data:JSON.stringify(json),
                    type:'post',
                    dataType : 'json',
                    contentType:"application/json",
                    success:function(result) {
                        layer.close(index);
                        if (result.success == 1) {
                            data = result.data;

                            successMsg("权限设置成功!");
                            buttonAddList = getButtonListByUser();
                            authAddList = getAuthListByUser();

                        } else if (result.success == 0){
                            errorMsg(result.error.message);
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
            })

            eleTree.on("checkbox(data2)",function(d) {
                if(d.currentData.checked == true){

                }else{
                    for (var i=0;i<buttonAddList.length;i++){
                        if(buttonAddList[i].functionId == d.currentData.key){
                            buttonAddList.splice(i,1);
                            return false;
                        }
                    }
                }
            })

            eleTree.on("checkbox(data3)",function(d) {
                if(d.currentData.checked == true){

                }else{
                    for (var i=0;i<authAddList.length;i++){
                        if(authAddList[i].key == d.currentData.key){
                            authAddList.splice(i,1);
                            return false;
                        }
                    }
                }
            })
            //节点切换操作
            eleTree.on("toggleSlide(data1)",function(data) {
                var currentData = data.currentData;
                var list1 = eleTree.checkedData(".ele2");
                if (null != list1 && list1.length>0){
                    buttonAddList = concatWithNoSpeat(list1,buttonAddList);
                }
                var list2 = eleTree.checkedData(".ele3");
                if (null != list2 && list2.length>0){
                    authAddList = concatWithNoSpeat(list2,authAddList);
                }
                data2 = _this.loadTree(currentData.key,1);
                if (null != data2 && data2.length>0){
                    for (var i=0;i<data2.length;i++){
                        if (null != buttonAddList && buttonAddList.length>0) {
                            for (var j=0;j<buttonAddList.length;j++){
                                if (data2[i].key == buttonAddList[j].key){
                                    data2[i].checked = true;
                                }
                            }
                        }
                    }
                }

                eleTree.render({
                    elem: '.ele2',
                    // url: "../../data/home/tree.json",
                    // type: "post",
                    data: data2,
                    showCheckbox: true,
                    // contextmenuList: ["add","remove"],
                    // drag: true,
                    // accordion: true
                });


                data3 = _this.loadTree(currentData.key,2);
                if (null != data3 && data3.length>0){
                    for (var i=0;i<data3.length;i++){
                        if (null != authAddList && authAddList.length>0) {
                            for (var j=0;j<authAddList.length;j++){
                                if (data3[i].key == authAddList[j].key){
                                    data3[i].checked = true;
                                }
                            }
                        }
                    }
                }
                eleTree.render({
                    elem: '.ele3',
                    // url: "../../data/home/tree.json",
                    // type: "post",
                    data: data3,
                    showCheckbox: true,
                    // contextmenuList: ["add","remove"],
                    // drag: true,
                    // accordion: true
                });
            });
            //节点切换操作
            eleTree.on("toggleSlide(data2)",function(data) {

            })
            
        });
    },
    loadBaseInfo:function (id) {
        var json = {"roleId":id};
        //加载数据
        $.ajax({
            type:"get",
            data:json,
            async:false,
            url:property.getProjectPath()+"Role/queryRoleById.do",
            success:function(result) {
                if (result.success == 1) {
                    var data = result.data;
                    $("#roleName").text(data.name);
                } else if (result.success == 0){
                    errorMsg(result.error.message);
                }
            },
            error:function(result) {
                errorMsg("系统异常");
            }
        });
    },
    loadTree:function (functionId,type) {
        var data = null;
        var json = {"roleId":roleId,"functionId":functionId,"type":type};
        $.ajax({
            type:"post",
            data:json,
            async:false,
            url:property.getProjectPath()+"ResAuth/queryResListTreeByRole.do",
            success:function(result) {
                if (result.success == 1) {
                    data = result.data;
                } else if (result.success == 0){
                    errorMsg(result.error.message);
                }
            },
            error:function(result) {
                errorMsg("系统异常");
            }
        });
        return data;
    },

}
main.init();

function getChildrenList(functionList,dataList) {

    for (var i=0;i<dataList.length;i++){
        var temp = dataList[i];
        var json = {"functionId":temp.key,"name":temp.label};
        if (temp.children != null && temp.children.length>0){
            getChildrenList(functionList,temp.children);
        }else{
            functionList.push(json);
        }
    }
}

function getButtonListByUser() {
    var json = {"roleId":roleId,"type":"1"};
    var datas = null;
    $.ajax({
        type:"post",
        async:false,
        data:json,
        url:property.getProjectPath()+"ResAuth/getFunctionTreeByRole.do",
        success:function(result) {
            if (result.success == 1) {
                datas = result.data;

            } else if (result.success == 0) {
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
    return datas;
}

function getAuthListByUser() {
    var json = {"roleId":roleId,"type":"2"};
    var datas = null;
    $.ajax({
        type:"post",
        async:false,
        data:json,
        url:property.getProjectPath()+"ResAuth/getFunctionTreeByRole.do",
        success:function(result) {
            if (result.success == 1) {
                datas = result.data;

            } else if (result.success == 0) {
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
    return datas;
}

function concatWithNoSpeat(array1,array2){
    for (var i=0;i<array1.length;i++){
        for (var j=0;j<array2.length;j++){
            if (array1[i].key ==  array2[j].key){
                array2.splice(j,1);
            }
        }
    }
    array1 = array1.concat(array2);
    return array1;
}


