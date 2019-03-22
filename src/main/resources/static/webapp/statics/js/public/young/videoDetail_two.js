var main={

    init:function () {
        this.initTable();
        this.tabBind();
    },
    initTable:function(){
        layui.use('form', function(){
            var form = layui.form;

            //监听提交
            form.on('submit(formDemo)', function(data){
                layer.msg(JSON.stringify(data.field));
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
                elem: '#demo'
                ,url: '../../statics/json/demo1.json'
                ,page: true //开启分页
                ,cols: [[ //表头
                    {type: 'numbers', title: '序号'}
                    ,{field: 'username', title: '姓名'}
                    ,{field: 'sex', title: '电话'}
                    ,{field: 'city', title: '年龄'}
                    ,{field: 'sign', title: '职业'}
                    ,{field: 'experience', title: '申请原因', }
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

