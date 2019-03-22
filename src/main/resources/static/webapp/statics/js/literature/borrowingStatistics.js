var main={

    init:function () {
        this.initTable();
        this.tabBind()
    },
    initTable:function(){
        layui.use('table', function(){

            var table = layui.table;
            table.render({
                elem: '#test1'
                ,url:'../../statics/json/demo2.json'
                ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                ,cols: [[
                    {field:'a1', title:' '}
                    ,{field:'username', title:'纸质版本'}
                    ,{field:'experience', title:'档案版本'}

                ]]
            });
        });
        this.initPie();
        //this.initBye();
        this.initLine();
    },
    initPie:function(){
        var myChart = echarts.init(document.getElementById('mainPie'));

        // 指定图表的配置项和数据

         var option = {
            title : {
                text: '某站点用户访问来源',
                subtext: '纯属虚构',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                left: '200px',
                right: '0px',
                bottom:'0px',
                data: ['PC端申请','纸质申请']
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'PC端申请'},
                        {value:310, name:'纸质申请'}
                    ],
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
        var myChart = echarts.init(document.getElementById('mainLine'));
        var option = {

            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['申请','借阅','归还'],
                align:'left',
                orient: 'horizontal',
                left: '450px',
                right: '0px',
                bottom:'0px'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'申请',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'借阅',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name:'归还',
                    type:'line',
                    stack: '总量',
                    data:[150, 232, 201, 154, 190, 330, 410]
                }
            ]
        };
        myChart.setOption(option);
        myChart.resize();
    },
    initBye:function(){
        var myChart = echarts.init(document.getElementById('mainBye'));
        var option = {
            color: ['#003366', '#006699', '#4cabce', '#e5323e'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Forest', 'Steppe', 'Desert', 'Wetland']
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: true,
            xAxis: [
                {
                    type: 'category',
                    axisTick: {show: false},
                    data: ['2012', '2013', '2014', '2015', '2016']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Forest',
                    type: 'bar',
                    barGap: 0,
                    data: [320, 332, 301, 334, 390]
                },
                {
                    name: 'Steppe',
                    type: 'bar',
                    data: [220, 182, 191, 234, 290]
                },
                {
                    name: 'Desert',
                    type: 'bar',
                    data: [150, 232, 201, 154, 190]
                },
                {
                    name: 'Wetland',
                    type: 'bar',
                    data: [98, 77, 101, 99, 40]
                }
            ]
        };
        myChart.setOption(option);
        myChart.resize();
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
