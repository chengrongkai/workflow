// var projectPath = "http://localhost:8080/admin/";
var normalParticipant = getNormalParticipant();
var groupParticipant = getNormalParticipant();
var complexParticipant = getNormalParticipant();
var complexType = getNormalParticipant();
var branch = getNormalParticipant();
var cols = [
    {type: 'checkbox', fixed: 'left'}
    ,{field:'processDefId', title:'流程定义ID', fixed: 'left', sort: true}
    ,{field:'processDefName', title:'流程定义名称', sort: true}
    ,{field:'activityId', title:'活动定义ID'}
    ,{field:'activityName', title:'活动定义名称'}
    ,{field:'normalParticipant', title:'一般参与者',templet: function(res){
        var processDefId =  res.processDefId;
        var activityId = res.activityId;
        var myId = 'normalParticipant'+processDefId+activityId;
        myId = myId.split(':').join('_');
        return component.getSelect(normalParticipant,res.normalParticipant,myId);
    }, unresize: true}
    ,{field:'groupParticipant', title:'组参与者',templet: function(res){
        var processDefId =  res.processDefId;
        var activityId = res.activityId;
        var myId = 'groupParticipant'+processDefId+activityId;
        myId = myId.split(':').join('_');
        return component.getSelect(normalParticipant,res.groupParticipant,myId);
    }, unresize: true}
    ,{field:'complexParticipant', title:'复杂参与者',templet: function(res){
        var processDefId =  res.processDefId;
        var activityId = res.activityId;
        var myId = 'complexParticipant'+processDefId+activityId;
        myId = myId.split(':').join('_');
        return component.getSelect(complexParticipant,res.complexParticipant,myId);
    }, unresize: true}
    ,{field:'complexType', title:'复杂参与者类型',templet: function(res){
        var processDefId =  res.processDefId;
        var activityId = res.activityId;
        var myId = 'complexType'+processDefId+activityId;
        myId = myId.split(':').join('_');
        return component.getSelect(complexType,res.complexType,myId);
    }, unresize: true}
    ,{field:'participantRule', title:'参与者规则',edit:'text'}
    ,{field:'drillDown', title:'向下钻取',templet: function(res){
        var processDefId =  res.processDefId;
        var activityId = res.activityId;
        var myId = 'drillDown'+processDefId+activityId;
        myId = myId.split(':').join('_');
        return component.getSelect(branch,res.drillDown,myId);
    }, unresize: true}
    ,{field:'drillUp', title:'向上钻取',templet: function(res){
        var processDefId =  res.processDefId;
        var activityId = res.activityId;
        var myId = 'drillUp'+processDefId+activityId;
        myId = myId.split(':').join('_');
        return component.getSelect(branch,res.drillUp,myId);
    }, unresize: true}
    ,{field:'sort', title:'排序', sort: true,edit:'text'}
];
    function getNormalParticipant() {
        return [{'value':1,'text':"员工"},{'value':2,'text':"领导"}];
    }
    function removeDataBaseRow(data) {
        $.ajax({
            url:projectPath+'process/deleteProcessConfigList.do',
            data:data,
            success:function (res) {
                if (res.success == 1){
                    layer.msg("删除成功",{time: 10},function(){
                        table.render({
                            elem: '#test'
                            ,url: projectPath+'process/deleteProcessConfig.do'
                            ,toolbar: '#toolbarDemo'
                            ,title: '用户数据表'
                            ,cols: [cols]
                            ,page: true
                            ,height: 'full-20'
                        });
                    });
                }else{
                    layer.msg("删除失败");
                }
            }
        })
    }
var main={
    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        layui.use(['form','table','element'], function(){
            var form = layui.form;
            var element = layui.element;
            form.render();
            //监听下拉
            form.on('select(demo)', function (data) {
                // console.log(data.elem); //得到checkbox原始DOM对象
                // console.log(data.value); //复选框value值，也可以通过data.elem.value得到
                // console.log(data.othis); //得到美化后的DOM对象
            });
            //监听多选
            form.on('checkbox(searchChecked)', function (data) {
                Msg.info("value: "+data.elem.title+"  checked: "+data.elem.checked);
                return false;
            });

            var table = layui.table;
            table.render({
                elem: '#test'
                ,url: projectPath+'process/queryProcessConfigList.do'
                ,toolbar: '#toolbarDemo'
                ,title: '用户数据表'
                ,cols: [cols]
                ,page: true
            });

            //头工具栏事件
            table.on('toolbar(test)', function(obj){
                var checkStatus = table.checkStatus(obj.config.id);
                switch(obj.event){
                    case 'getCheckData':
                        var data = checkStatus.data;
                        layer.alert(JSON.stringify(data));
                        break;
                    case 'delete':
                        var data = checkStatus.data;

                        if (null == data || data.length == 0){
                            layer.msg('请选择需要删除的数据');
                        }
                        layer.confirm("你确定要删除么？",{btn:['是的,我确定','我再想想']},
                            function(){
                                var oldData =  table.cache["test"];
                                var type = 1;
                                for (var i = 0;i<data.length;i++){
                                    if (!data[i].xid){
                                        type = 0;
                                        oldData.splice(oldData.indexOf(data[i]),1);
                                    }else{
                                        removeDataBaseRow(data[i].xid);
                                    }
                                }
                                if (type == 0){
                                    table.render({
                                        elem: '#test'
                                        ,data: oldData
                                        ,toolbar: '#toolbarDemo'
                                        ,title: '用户数据表'
                                        ,cols: [cols]
                                        ,page: true
                                    });
                                    layer.msg("删除成功");
                                }

                            });

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

            //加载查询区域
            var processDefNameData = [{"value":0,"text":"测试流程"},{"value":1,"text":"测试流程1"}]
            var processDefNameSelect = component.getSelect(processDefNameData,null,'processDefNameSelect');
            $("#searchList").html(processDefNameSelect);
            form.render();
        });
    },
    tabBind:function () {
        layui.use(['form','table'], function () {
            var form = layui.form;
            var table = layui.table;
            //监听查询
            form.on('submit(formDemo)', function(data){
                var proceeDefName = $("#proceeDefName").val();
                table.render({
                    elem: '#test'
                    ,url: projectPath+'process/queryProcessConfigList.do?proceeDefName='+proceeDefName
                    ,toolbar: '#toolbarDemo'
                    ,title: '用户数据表'
                    ,cols: [cols]
                    ,page: true
                });
            });
            //监听重置
            $("[type='reset']").click(function () {
                $(this).parents(".layui-form").find("input").val("");
                $(this).prev().click();
            });

            //监听初始化流程配置
            $("#initConfig").click(function () {
                table.render({
                    elem: '#test'
                    ,url: projectPath+'process/getInitProcessConfig.do'
                    ,toolbar: '#toolbarDemo'
                    ,title: '用户数据表'
                    ,cols: [cols]
                    ,page: true
                });
            });


            //监听初始化流程配置
            $("#saveConfig").click(function () {
                var oldData =  table.cache["test"];
                for (var i=0;i<oldData.length;i++){
                    var processDefId =  oldData[i].processDefId;
                    var activityId = oldData[i].activityId;
                    var myId =  processDefId + activityId;
                    myId = myId.split(':').join('_');
                    oldData[i].normalParticipant = $('#normalParticipant'+myId).val();

                    oldData[i].groupParticipant = $('#groupParticipant'+myId).val();

                    oldData[i].complexParticipant = $('#complexParticipant'+myId).val();

                    oldData[i].complexType = $('#complexType'+myId).val();

                    oldData[i].drillDown = $('#drillDown'+myId).val();

                    oldData[i].drillUp = $('#drillUp'+myId).val();

                }
                $.ajax({
                    url:projectPath+'process/saveProcessConfigList.do',
                    data:JSON.stringify(oldData),
                    type:'post',
                    dataType : 'json',
                    contentType:"application/json",
                    success: function (res) {
                        if (res.success == 1){
                            layer.msg("保存成功");
                            table.render({
                                elem: '#test'
                                ,url: projectPath+'process/queryProcessConfigList.do'
                                ,toolbar: '#toolbarDemo'
                                ,title: '用户数据表'
                                ,cols: [cols]
                                ,page: true
                            });
                        }else{
                            layer.msg("保存失败");
                        }
                    }
                })
            });
        });
        //查询事件
        layui.use('form', function(){
            var form = layui.form;

        });
    }
}
main.init();

