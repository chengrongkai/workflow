var pageType = "add";
var CityList = []
var userInfo = {};

var main={

    init:function () {
        property.setUserInfo();
        pageType = localStorage.pubUserType;
        if(pageType == 'edit'){
            $('#submit').text('保存');
            this.id = localStorage.id;
            loadData(this.id);
        }else if(pageType == 'detail'){
            this.id = localStorage.id;
            loadData(this.id);

        }else if(pageType == 'add'){
            //getSelectData(null);
            // this.id = localStorage.id;
            // loadData(this.id);
        }

        this.initTable();

    },
    initTable:function(){
        getAreaData("province","init",null);

        layui.use('form', function(){
            var form = layui.form;
            //监听提交
            form.on('submit(formDemo)', function(data){
                var url = "pubUser/addPubUser.do";
                if (pageType == "edit"){
                    url = "pubUser/updatePubUser.do";
                }
                var  data = JSON.parse(JSON.stringify(data.field));
                data.password = hex_md5(property.md5Str+data.password);
                data.surePassword = hex_md5(property.md5Str+data.surePassword);
                data = JSON.stringify(data)
                $.ajax({
                    contentType: 'application/json;charset=UTF-8',
                    type:"post",
                    data:data,
                    async:false,
                    url:property.getProjectPath()+url,
                    success:function(result) {
                        if (result.success == 1) {
                            if(pageType == "edit"){
                                successMsg("修改公众用户成功");
                            }else{
                                successMsg("添加公众用户成功");
                            }
                            parent.$t.goback("page/public/user/list.html");
                        } else if (result.success == 0){
                            //top.layer.msg(result.error.message);
                            errorMsg("操作公众用户数据异常");
                        }
                    },
                    error:function(result) {
                        errorMsg("系统异常");
                    }
                });
                //layer.msg(JSON.stringify(data.field));
                return false;
            });
        });


        layui.use(['upload','element'], function(){
            var $ = layui.jquery
                ,upload = layui.upload,element = layui.element;
            var demoListView = $('#demoList')
                ,uploadListIns = upload.render({
                elem: '#test10'
                ,url: '/statics/upload'
                ,accept: 'file'
                ,multiple: true
                ,auto: false
                ,xhr:xhrOnProgress
                ,progress:function(index,value){//上传进度回调 value进度值
                    element.progress('progressBar'+index, value+'%')//设置页面进度条
                }
                ,bindAction: '#testListAction'
                ,choose: function(obj){
                    var files = this.files = obj.pushFile(); //将每次选择的文件追加到文件队列
                    //读取本地文件
                    obj.preview(function(index, file, result){
                        /* var tr = $(['<tr id="upload-'+ index +'">'
                             ,'<td>'+ file.name +'</td>'
                             ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                             ,'<td>等待上传</td>'
                             ,'<td>'
                             ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                             ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                             ,'</td>'
                             ,'</tr>'].join(''));*/
                        var tr=$(["<li>" +
                        "                                    <div class=\"upLeft\">\n" +
                        "                                        <span class=\"fileName\">"+file.name+"</span>" +
                        "                                        <span class=\"fileState\">准备上传</span>" +
                        "                                    </div>" +
                        "                                    <div class=\"upRight\">" +
                        "                                        <div class='layui-progress layui-col-md8 layui-col-sm8' lay-showPercent='yes' lay-filter='progressBar"+index+"'>" +
                        "                                            <div class=\"layui-progress-bar layui-bg-red\" lay-percent=\"30%\"></div>" +
                        "                                        </div>" +
                        "                                        <span class=\"layui-col-md2 layui-col-sm2\">0%</span>" +
                        "                                        <a href=\"javascript:void (0);\" class=\"layui-col-md1 layui-col-sm1 demo-reload\">重传</a>" +
                        "                                        <a href=\"javascript:void (0);\" class=\"layui-col-md1 layui-col-sm1 demo-delete\">取消</a>" +
                        "                                    </div>" +
                        "                                </li>"].join(''));
                        //单个重传
                        tr.find('.demo-reload').on('click', function(){
                            obj.upload(index, file);
                        });

                        //删除
                        tr.find('.demo-delete').on('click', function(){
                            delete files[index]; //删除对应的文件
                            tr.remove();
                            uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                        });

                        demoListView.append(tr);
                    });
                }
                ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
                    layer.load(); //上传loading
                }
                ,done: function(res, index, upload){
                    if(res.code == 0){ //上传成功
                        var tr = demoListView.find('tr#upload-'+ index)
                            ,tds = tr.children();
                        tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                        tds.eq(3).html(''); //清空操作
                        return delete this.files[index]; //删除文件队列已经上传成功的文件
                    }
                    this.error(index, upload);
                }
                ,error: function(index, upload){
                    var tr = demoListView.find('tr#upload-'+ index)
                        ,tds = tr.children();
                    tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
                    tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传
                }
            });

        });
        layui.use('table', function(){
            var table = layui.table;

            table.render({
                elem: '#test'
                ,url:'../../../statics/json/demo1.json'
                ,cols: [[
                    {type:'numbers'}
                    ,{field:'logins', title:'登入次数'}
                    ,{field:'joinTime', title:'加入时间'}
                    ,{fixed: 'right', title:'操作', toolbar: '#barDemo'}
                ]]
            });

            //头工具栏事件
            table.on('toolbar(test)', function(obj){
                var checkStatus = table.checkStatus(obj.config.id);
                switch(obj.event){
                    case 'getCheckData':
                        var data = checkStatus.data;
                        layer.alert(JSON.stringify(data));
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
                        obj.del();
                        layer.close(index);
                    });
                } else if(obj.event === 'edit'){
                    layer.prompt({
                        formType: 2
                        ,value: data.email
                    }, function(value, index){
                        obj.update({
                            email: value
                        });
                        layer.close(index);
                    });
                }
            });
        });



        //取消
        $("button[type='reset']").click(function () {
            layer.confirm('确认取消吗?', function(index){
                parent.$t.goback("page/public/user/list.html");
                layer.close(index);
            });
            return false;
        })
       /* layui.use('laydate', function(){
            var laydate = layui.laydate;
            //执行一个laydate实例
            laydate.render({
                elem: '#birthday', //指定元素
            });
        });
*/
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
        })


    }
}
main.init();







/**
 * 加载表单数据
 * @param id  公众用户id
 */
function loadData(id) {
    this.type = "edit";
    layui.use('form', function(){
        var form = layui.form;
        var index = parent.layer.getFrameIndex(window.name);
        var json = {"id":id};
        //加载数据
        $.ajax({
            type:"get",
            data:json,
            async:false,
            url:property.getProjectPath()+"pubUser/getOnePubUser.do",
            success:function(result) {
                if (result.success == 1) {
                    userInfo = result.data
                    setFormData(result.data);
                } else if (result.success == 0){
                    errorMsg("系统异常");
                }
            },
            error:function(result) {
                errorMsg("系统异常");
            }
        });
    });

    layui.use('form', function () {
        var form = layui.form;
        form.on('select(provinceId)', function(data){
           var cityList =  CityList.find(function (obj) {
               return obj.value == data.value
           })

            if(!isEmpty(cityList)){
                var newList = cityList.children.map(function (obj) {
                    return {value: obj.value, text: obj.label}
                })
                var cityStr = component.getSelect(newList, null, "cityId");
                $("#cityId").html(cityStr);
                form.render('select');
            }

        });

        /*form.on('select(cityId)', function(data){

            // getAreaData(data.value,null);
        });*/
    })
}






//获取省市联动数据
function getAreaData(type,init,data){
    layui.use('form', function() {
        var form = layui.form;
        $.ajax({
            type:"get",
            url:property.getProjectPath()+"pubUser/getArea.do",
            data:data,
            async:false,
            success:function(result){
                if (result.success == 1) {
                    var dataList = result.options;
                    CityList = result.options;
                    if (type == "province"){
                        var provinceStr = "";
                        for(var i = 0;i < dataList.length;i++) {
                            if(dataList[i].value == userInfo.provinceId) {
                                provinceStr +="<option  selected='selected' value='"+dataList[i].value+"' >"+dataList[i].label+"</option>"
                            } else {
                                provinceStr +="<option  value='"+dataList[i].value+"' >"+dataList[i].label+"</option>"
                            }

                        }

                        $("#provinceId").html(provinceStr);

                        if(userInfo.cityId) {
                            var cityobj =  CityList.find(function (obj) {
                                return obj.value == userInfo.provinceId
                            })
                            var selectCityList = cityobj.children
                            var cityStr = ''
                            for(var i = 0;i < selectCityList.length;i++) {
                                if(selectCityList[i].value == userInfo.cityId) {
                                    cityStr +="<option  selected='selected' value='"+selectCityList[i].value+"' >"+selectCityList[i].label+"</option>"
                                } else {
                                    cityStr +="<option  value='"+selectCityList[i].value+"' >"+selectCityList[i].label+"</option>"
                                }
                            }
                            $("#cityId").html(cityStr);

                        }
                        form.render('select');
                    }
                }
            }
        })
    })
}




/**
 * 设置表单数据
 * @param data
 */
function setFormData(data){


    property.setForm($("#pubUserForm"),data);
    $("#password").val("");
    $("#surePassword").val("");



    //生日赋值
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        laydate.render({
            elem: '#birthday',
            value: data.birthdayStr
        });
    });


    //性别赋值
    layui.use('form', function(){
        var form = layui.form;

        var sexList = [{"id":"0","text":"女"},{"id":"1","text":"男"}];
        var sexRadioStr = component.getRadio(sexList,data.sex,"sex","id","text");
        $("#sexRadio").append(sexRadioStr);
        form.render('radio');
    });

}













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
    }     }

