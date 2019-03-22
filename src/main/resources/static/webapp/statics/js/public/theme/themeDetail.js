var pageType = "detail";
var main = {

    init: function() {

        pageType = localStorage.socialType;
        if(pageType == 'detail') {
            this.id = localStorage.id;
            loadData(this.id);
        }
    },

}
main.init();





/**
 * 加载表单数据
 * @param id  主题展id
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
            url:property.getProjectPath()+"themeshow/getShowById.do",
            success:function(result) {
                if (result.success == 1) {
                    console.dir(result)
                    setFormData(result.data);
                } else if (result.success == 0){
                    //top.layer.msg(result.error.message);
                    errorMsg("系统异常");
                }
            },
            error:function(result) {
                errorMsg("系统异常");
            }
        });
    });


}



/**
 * 设置表单数据
 * @param data
 */
function setFormData(data) {
    property.setForm($("#themeshowForm"),data);
}
