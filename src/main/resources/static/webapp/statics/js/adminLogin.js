//设置验证码
// refreshCode();


layui.config({
    base: "js/"
}).use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        $ = layui.jquery;

    // form.verify({
    //     pwd:[/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/,'6-20位字符；数字、字母、特殊字符（除空格），起码其中两种组合']
    // });

    //登录按钮事件
    form.on("submit(login)", function (data) {
        var password = hex_md5(data.field.password);
        // parent.location.href = 'http://localhost:63342/chinayouzheng/index.html';
        var datas = "userName=" + data.field.username + "&password=" + password+ "&verification=" + data.field.captcha
        +"&loginType=1";
        $.ajax({
            type: "POST",
            url: "/login/backLogin",
            data: datas,
            dataType: "json",
            success: function (result) {
                if (result.success == 1) {//登录成功
                    localStorage.userInfo = JSON.stringify(result.data);
                    localStorage.functinId = '3407276609592431735736823983';
                    parent.location.href = 'index.html';
                } else {
                    // $("#formCode").removeClass('layui-hide');
                    layer.msg(result.error.message, {icon: 5});
                    // refreshCode();
                }
            }
          ,error:function (result) {
                layer.msg("系统异常", {icon: 5});
                // refreshCode();
            }
        });
        return false;
    })
});
function refreshCode(){
    var captcha = document.getElementById("captcha");
    captcha.src = property.getProjectPath()+"Tools/getAdminImgCode.do";

}

$("#toLogin").click(function () {
    window.location.href="login.html";
})
