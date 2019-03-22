/**
 * Created by chenyi on 2018/1/23.
 */
//判断是否登录
//设置用户信息
property.setUserInfo();
// 判断是否显示锁屏
if(window.sessionStorage.getItem("isLock") == "true"){
    lockPage();
}
//当前模块id
var currentId = "";
//锁屏
function lockScreen(){
    window.sessionStorage.setItem("isLock",true);
    lockPage();
}
function lockPage() {
    layer.open({
        title : false,
        area: ['1980', '1080'],
        type : 1,
        content : '<video class="video-player" preload="auto" autoplay="autoplay" loop="loop" data-height="1080" data-width="1980px" height="1080" width="1980px"> ' +
        '<source src="/statics/login/login.mp4" type="video/mp4"> </video>' +
        '<div class="lock-content"><div class="admin-header-lock" id="lock-box">'+
        '<div class="admin-header-lock-img"><img src="/statics/images/index/head.jpg"/></div>'+
        '<div class="admin-header-lock-name" id="lockUserName">cy-ui</div>'+
        '<div class="input_btn">'+
        '<input type="password" class="admin-header-lock-input layui-input" autocomplete="off" placeholder="请输入密码解锁.." name="lockPwd" id="lockPwd" />'+
        '<button class="layui-btn" id="unlock" style="background-color: #42bdf1">解锁</button>'+
        '</div>'+
        '</div></div>',
        closeBtn : 0,
        shade : 0.9
    })
    $(".admin-header-lock-input").focus();
}


// 解锁
$("body").on("click","#unlock",function(){

    if($(this).siblings(".admin-header-lock-input").val() == ''){
        Tips.tips("请输入解锁密码123456！",$("#lockPwd"),1,'#4fcef1');
        $(this).siblings(".admin-header-lock-input").focus();
    }else{
        //验证密码是否正确
        if($(this).siblings(".admin-header-lock-input").val() == "123456"){
            window.sessionStorage.setItem("isLock",false);
            $(this).siblings(".admin-header-lock-input").val('');
            layer.closeAll("page");
        }else{
            Tips.tips("密码错误，请重新输入123456！！",$("#lockPwd"),1,'#4fcef1');
            $(this).siblings(".admin-header-lock-input").val('').focus();
        }
    }
});
$(document).on('keydown', function() {
    if(event.keyCode == 13) {
        $("#unlock").click();
    }
});


//打赏作者
function reward() {
    layer.open({
        title: '',
        type: 1,
        area: ['600px', '448px'], //宽高
        content: '<img src="/statics/img/cy/reward.png">'
    });
}

$(document).ready(function () {
    loadModules();
    //默认显示菜单
    createMenu(currentId);
    // createMenu("/statics/json/layuiMenu.json");
    setMainHeight();
});
$(window).resize(function () {
    setMainHeight();
});
//设置主内容高度
function setMainHeight() {
    var height = $(parent.window).height();
    $("#main").css("height", height - 154 + "px");
}
//生成菜单
function createMenu(url) {
    localStorage.removeItem('currentId');
    localStorage.currentId = url;
    $("#menuSearch").val("");
    var json = {"userId":userId,"pId":url,"type":"0"};
    $.ajax({
        type:"post",
        data:json,
        async:false,
        url:property.getProjectPath()+"ResAuth/queryMenuListAndChildrenByPid.do",
        success:function(result) {
            if (result.success == 1) {
                $t.setStorageItem("menuList", result.data);
                //显示菜单
                setMenu(result.data);
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });
    // $.getJSON(baseUrl+url, function (r) {
    //     //设置菜单缓存
    //     $t.setStorageItem("menuList", r.menuList);
    //     //显示菜单
    //     setMenu(r.menuList);
    //
    // });
}
//显示菜单
function setMenu(menuList) {
    $(".layui-nav-tree").html("");
    var elm;
    if(null == menuList){
        return;
    }
    for (var i = 0; i < menuList.length; i++) {
        var _li;
        if (menuList[i].type === "0") {
            _li = ['<li class="layui-nav-item layui-nav-itemed">',
                '<a class="" href="javascript:;" data="'+menuList[i].key+'" title="' + menuList[i].name + '" >',
                '<i class="' + menuList[i].icon + '"></i>' + menuList[i].name + '</a>',
                '</li>'].join("");
            //是否有下级菜单
            if (menuList[i].list) {
                var $li = $(_li);
                $li.find("a").after('<dl class="layui-nav-child">');
                for (var j = 0; j < menuList[i].list.length; j++) {
                    $li.find(".layui-nav-child").append(' <dd><a class="cy-page" href="javascript:;" data="'+menuList[i].list[j].key+'"  data-url="' + menuList[i].list[j].url + '" title="' + menuList[i].list[j].name + '">' + menuList[i].list[j].name + '</a></dd>');
                }
            }
            _li = $li.prop("outerHTML");

        }
        if (menuList[i].type === "1") {
            _li = '<li class="layui-nav-item"><a class="layui-nav-item cy-page" href="javascript:;" data="'+menuList[i].key+'" data-url="' + menuList[i].url + '" title="' + menuList[i].name + '"><i class="' + menuList[i].icon + '"></i> ' + menuList[i].name + '</a></li>';
        }
        $(".layui-nav-tree").append(_li);



       // $(".layui-nav-tree").eq(0).click();
    }

    layui.use('element', function () {
        var element = layui.element;
        element.render();
        $(".layui-nav-child")&&$(".layui-nav-child").each(function (i,elm) {
            if(i==0){
                $(elm).find("dd").eq(0).find("a").click();
                var bb = $(elm).find("dd").eq(0).find("a").attr("data");
                localStorage.functinId = bb;
            }
        })
        var aa = $(".layui-nav .layui-nav-tree").find(".layui-this").find('a').attr("data");
        // console.log(aa);
    });
}

//左侧菜单收起与显示
$(".toggle-collapse").click(function () {
    var width = $(window).width();
    if ($(this).hasClass("toggle-show")) {
        $(this).removeClass("toggle-show").animate({left: '200px'});
        $(".layui-body,.layui-footer").css("width", parseInt(width) - 200 + "px").animate({left: '200px'});
        $(".layui-side").animate({left: '0px'}).fadeIn("slow");
    } else {
        $(this).addClass("toggle-show").animate({left: '0px'});
        $(".layui-body,.layui-footer").css("width", parseInt(width) + "px").animate({left: '0px'});
        $(".layui-side").animate({left: '-200px'});
    }

});


//菜单搜索
$(" .menu-search-clear").click(function () {
    $("#menuSearch").val("");
    $(".menu-search-clear").hide()
    //显示默认菜单
    setMenu($t.getStorageItem("menuList"))
});

$("#menuSearch").keyup(function () {
    if ($("#menuSearch").val() == "") {
        $(".menu-search-clear").hide();
        //显示默认菜单
        setMenu($t.getStorageItem("menuList"))
    } else {
        $(".menu-search-clear").show();
        var menuList = $t.getStorageItem("menuList");

        //显示搜索结果菜单
        var k = $("#menuSearch").val().trim("");
        if (k == "") return;
        var arr = [];
        var patt = new RegExp(k);
        for (var i = 0; i < menuList.length; i++) {
            if (menuList[i].type === "1") {
                if (patt.test(menuList[i].name) || patt.test(menuList[i].url)) {
                    arr.push({name: menuList[i].name, url: menuList[i].url, icon: menuList[i].icon});
                }
            }
            if (menuList[i].list) {
                for (var j = 0; j < menuList[i].list.length; j++) {
                    if (menuList[i].list[j].type === 1) {
                        if (patt.test(menuList[i].list[j].name) || patt.test(menuList[i].list[j].url)) {
                            arr.push({
                                name: menuList[i].list[j].name,
                                url: menuList[i].list[j].url,
                                icon: menuList[i].list[j].icon
                            });
                        }
                    }

                }
            }
        }
        $(".layui-nav-tree").html("");
        if (arr.length > 0) {
            //渲染查询后的表格
            for (var i = 0; i < arr.length; i++) {
                $('.layui-nav-tree').append(
                    ['<li class="layui-nav-item">',
                        '<a class="layui-nav-item cy-page" href="javascript:;" ',
                        'data-url="' + arr[i].url + '" title="' + arr[i].name + '">',
                        '<i class="fa fa-pencil"></i> ' + arr[i].name + '</a></li>'].join(""));
            }
            layui.use('element', function () {
                var element = layui.element;
                element.render();

            });
        }

    }
});

$("#loginOut").click(function () {
    parent.layer.confirm('确定要退出么',{icon:3, title:'退出确认'}, function(index){
        localStorage.removeItem("userInfo");
        $.ajax({
            type: "POST",
            url: property.getProjectPath()+"backLogin/loginOut.do",
            success: function (result) {
                window.location.href='/admin/login.html';
                layer.close(index);
            }
        });
    });

});

/**
 * 加载模块数据
 */
function loadModules() {
    //权限控制(queyType为1时做权限控制，为0时不做权限控制)
     var json = {"currentUserId":userId,"pId":"-1","type":"0","queryType":"1"};
    $.ajax({
        type:"get",
        data:json,
        async:false,
        url:property.getProjectPath()+"ResAuth/queryMenuListByPid.do",
        success:function(result) {
            if (result.success == 1) {
               var data = result.data;
               if (null != data && data.length>0){
                   var htmlStr = "";
                   for (var i=0;i<data.length;i++){
                       var modules = data[i].functionname;
                       var id = ""+data[i].id;
                       var tempStr = "<li class='layui-nav-item'><a data="+id+">"+modules+"</a></li>";
                       if(currentId == null || currentId == ""){
                           if ((i == 0 && modules != '藏品')||i==1){
                               tempStr = "<li class='layui-nav-item layui-this'><a data="+id+">"+modules+"</a></li>";
                               currentId = id;
                           }
                       }
                       if (id == '-1') {
                           tempStr = "<li class='layui-nav-item'><a href='"+data[i].functionurl+"' target='_blank' data="+id+">"+modules+"</a></li>";
                       }
                       htmlStr = htmlStr+tempStr;
                   }
                   $("#modules").empty();
                   $("#modules").append(htmlStr);
                   $('#modules').on("click","a",function(){
                   if ($(this).attr("data") != '-1') {
                       createMenu($(this).attr("data"))
                   }
                   })
               }
            } else if (result.success == 0){
                errorMsg(result.error.message);
            }
        },
        error:function(result) {
            errorMsg("系统异常");
        }
    });

}

$('.saoma, .qqqun').hover(function() {
    $(".qqqun").show();
}, function() {
    $(".qqqun").hide();
});

jQuery(document).ready(function () {
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            /// 当点击浏览器的 后退和前进按钮 时才会被触发，
            window.history.pushState('forward', null, '');
            window.history.forward(1);
        });
    }
    //
    window.history.pushState('forward', null, '');  //在IE中必须得有这两行
    window.history.forward(1);


});

/*document.onkeypress = function(e){
    if(e.keyCode == 116){
        e.preventDefault(); //组织默认刷新

        /!*var iframeSrc = iframe.src;
        iframe.src = "page/main/main.html";*!/
    }
}*/
