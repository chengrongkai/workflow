//交叉表数据
var tableData = null;
//饼图数据
var pieData = null;
//折线图
var lineData = null;
var main={
    init:function () {
        var startTime = getDay(-7);
        var endTime = formatSimpleDate(new Date());
        var dateParagraph = formatDateParagraph(startTime,endTime);
        $("#time1").val(dateParagraph);
        getReport1(dateParagraph);
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        layui.use('laydate', function(){
            var laydate = layui.laydate;

            //执行一个laydate实例
            laydate.render({
                elem: '#time1' //指定元素
                ,range: true
               ,done:function (value, date, endDate) {
                    getReport1(value);
                }
            });
        });
        $("#last7_1").click(function () {

            var startTime = getDay(-7);
            var endTime = formatSimpleDate(new Date());
            var dateParagraph = formatDateParagraph(startTime,endTime);
            $("#time1").val(dateParagraph);
            getReport1(dateParagraph);
        })
        $("#last30_1").click(function () {

            var startTime = getDay(-30);
            var endTime = formatSimpleDate(new Date());
            var dateParagraph = formatDateParagraph(startTime,endTime);
            $("#time1").val(dateParagraph);
            getReport1(dateParagraph);
        })
    },
    initPie:function(){
        var myChart = echarts.init(document.getElementById('mainPie'),"walden");

        // 指定图表的配置项和数据

         var option = {

            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                y:'bottom',
                data: pieData.legend
            },
             grid:{
                 bottom:'20%',//距离下边距
             },
            series : [
                {
                    name:'类型',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:pieData.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        myChart.resize();
    },
    initLine:function(){
        var myChart = echarts.init(document.getElementById('mainLine'),"walden");
        var option = {

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:lineData.legend,
                y:'bottom'
            },
                grid:{
                    bottom:'20%',//距离下边距
                },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: lineData.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series: lineData.data
        };
        myChart.setOption(option);
        myChart.resize();
    },
    tabBind:function () {
        //导出函数
        $("#report1").on({
            'click':function () {
                var data = $("#time1").val();
                var startTime = data.split(" - ")[0];
                var endTime = data.split(" - ")[1];
                var type = "2";
                location.href = property.getProjectPath()+"postLiterature/exportLiteratureReport1.do?startTime="+startTime+
                    "&endTime="+endTime+"&type="+type;
                return false;
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
        $(".searchBtn1").on({
            'click':function () {
                var index=$(this).index();
                if($(this).hasClass('active'))return false
                if(index==1){
                    $(".searchBtn1").removeClass("active");
                    $(".searchBtn1").eq(0).addClass("active");
                }else{
                    $(".searchBtn1").removeClass("active");
                    $(".searchBtn1").eq(1).addClass("active");
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

//加载图表1
function getReport1(data) {
    var startTime = data.split(" - ")[0];
    var endTime = data.split(" - ")[1];
    var json = {"status":null,"startTime":startTime,"endTime":endTime,type:"2"};
    $.ajax({
        data:json,
        type:"post",
        async:false,
        url:property.getProjectPath()+"postLiterature/getLiteratureReport1.do",
        success:function(result) {
            if (result.success == 1) {
                var data = result.data;
                tableData = data.table;
                pieData = data.pie;
                lineData = data.line;
                loadChart1();
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });

}




function loadChart1() {
    layui.use('table', function(){

        var table = layui.table;
        table.render({
            elem: '#test1'
            ,data:tableData
            ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
            ,cols: [[
                {field:'type', title:'流程状态'}
                ,{field:'ZHIZHI', title:'纸质版本'}
                ,{field:'DANGAN', title:'档案版本'}
            ]]
        });
    });
    main.initPie();
    main.initLine();
}
