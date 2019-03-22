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
                ,url:'../../statics/json/demo3.json'
                ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                ,cols: [[
                    {field:'a1', title:''}
                    ,{field:'experience', title:'积分'}
                    ,{field:'ip', title:'IP'}
                    ,{field:'username', title:'登入次数'}
                ]]
            });
        });
        this.initPie();
        this.initBye();
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
                left: '0px',
                right: '0px',
                bottom:'0px',
                data: ['纸质版本','电子版本','档案版本']
            },
            series : [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'}
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
                data:['采集','发布'],
                align:'left',
                orient: 'horizontal',
                left: '650px',
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
                    name:'采集',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name:'发布',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310]
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
                    data: ['马列毛邓', '哲学宗教', '社会科学', '自然科学', '综合性图书']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '采集',
                    type: 'bar',
                    barGap: 0,
                    data: [320, 332, 301, 334, 390]
                },
                {
                    name: '编目',
                    type: 'bar',
                    data: [220, 182, 191, 234, 290]
                },
                {
                    name: '发布',
                    type: 'bar',
                    data: [150, 232, 201, 154, 190]
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
