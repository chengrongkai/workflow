//设置验证码
// refreshCode();


layui.config({
    base: "js/"
}).use(['form', 'layer'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : parent.layer,
        $ = layui.jquery;

    form.verify({
        pwd:[/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/,'6-20位字符；数字、字母、特殊字符（除空格），起码其中两种组合']
    });

    //登录按钮事件
    form.on("submit(login)", function (data) {
        var datas = "userName=" + data.field.username + "&password=" + hex_md5(data.field.password)+"&loginType=2";
        $.ajax({
            type: "POST",
            url: "/login/backLogin",
            data: datas,
            success: function (result) {
                if (result.success == 1) {//登录成功
                    localStorage.userInfo = JSON.stringify(result.data);
                    parent.location.href = 'index.html';
                } else {
                    layer.msg(result.error.message, {icon: 5});
                }
            }
          ,error:function (result) {
                layer.msg("系统异常", {icon: 5});
                // refreshCode();
            }
        });
        return false;
    })

    $("#toAdminLogin").click(function () {
        window.location.href="adminLogin.html";
    })
});

