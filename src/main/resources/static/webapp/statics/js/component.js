var Component = function () {
}
/**
 * 加载下拉框数据
 * @param data 数据集合
 * @param value 选中值
 * @param componentId 组件id及名称
 */
Component.prototype.getSelect = function (data,value,componentId) {
    var html = '<select name='+componentId +' lay-search="" lay-filter='+componentId+' id='+componentId+' class="layui-select">';
    html = html + '<option value=""></option>';
    if (null != data && data.length>0){
        for (var i = 0;i<data.length;i++){
            var element = '<option value='+data[i].value+'>'+data[i].text+'</option>';
            if (data[i].value == value){
                element = '<option value='+data[i].value+' selected>'+data[i].text+'</option>';
            }
            html = html + element;
        }
    }
    html = html + '</select>';
    return html;
}
/**
 * 获取下拉框
 * @param data 数据 (数据字典数据)
 * @param value 值 (表单值)
 * @param componentId 组件id及名称
 * @param valueField 值字段
 * @param textField 显示值字段
 * @returns {string} html元素
 */
Component.prototype.getSelectPlus = function (data,value,componentId,valueField,textField) {
    var html = '<select name='+componentId +' lay-search="" lay-filter='+componentId+' id='+componentId+' class="layui-select">';
    html = html + '<option value=""></option>';
    if (null != data && data.length>0){
        for (var i = 0;i<data.length;i++){
            var element = '<option value='+data[i][valueField]+'>'+data[i][textField]+'</option>';
            if (data[i][valueField] == value){
                element = '<option value='+data[i][valueField]+' selected>'+data[i][textField]+'</option>';
            }
            html = html + element;
        }
    }
    html = html + '</select>';
    return html;
}
/**
 * 获取下拉框
 * @param data 数据 (数据字典数据)
 * @param value 值 (表单值)
 * @param componentId 组件id及名称
 * @param valueField 值字段
 * @param textField 显示值字段
 * @returns {string} html元素
 */
Component.prototype.getSelectSimplePlus = function (data,value,componentId,valueField,textField) {
    var html = '';
    html = html + '<option value=""></option>';
    if (null != data && data.length>0){
        for (var i = 0;i<data.length;i++){
            var element = '<option value='+data[i][valueField]+'>'+data[i][textField]+'</option>';
            if (data[i][valueField] == value){
                element = '<option value='+data[i][valueField]+' selected>'+data[i][textField]+'</option>';
            }
            html = html + element;
        }
    }
    return html;
}
/**
 * 获取复选框
 * @param data
 * @param value
 * @param componentId
 * @param valueField
 * @param textField
 * @returns {string}
 */
Component.prototype.getCheckBox = function (data,value,componentId,valueField,textField) {
    var html = '';;
    if (null != data && data.length>0){
        for (var i = 0;i<data.length;i++){
            var element = '<input type="checkbox" name='+componentId+' value='+data[i][valueField]+' title='+data[i][textField]+'>';
            if (data[i][valueField] == value){
                element = '<input type="checkbox" name='+componentId+' value='+data[i][valueField]+' title='+data[i][textField]+' checked>';
            }
            html = html + element;
        }
    }
    html = html + '</select>';
    return html;
}
/**
 * 获取复选框
 * @param data
 * @param value
 * @param componentId
 * @param valueField
 * @param textField
 * @returns {string}
 */
Component.prototype.getCheckBoxPlus = function (data,values,componentId,valueField,textField) {
    var html = '';;
    if (null != data && data.length>0){
        for (var i = 0;i<data.length;i++){
            var element = '<input type="checkbox" lay-skin="primary" name='+componentId+' value='+data[i][valueField]+' title='+data[i][textField]+'>';
            if (values.indexOf(data[i][valueField])>=0){
                element = '<input type="checkbox" lay-skin="primary" name='+componentId+' value='+data[i][valueField]+' title='+data[i][textField]+' checked>';
            }
            html = html + element;
        }
    }
    html = html + '</select>';
    return html;
}
/**
 * 获取单选框
 * @param data 数据
 * @param value 值
 * @param componentId 组件id及名称
 * @param valueField 值字段
 * @param textField 显示值字段
 * @returns {string} html元素
 */
Component.prototype.getRadio = function (data,value,componentId,valueField,textField) {
    var htmlStr = '';
    for (var i=0;i<data.length;i++){
        var temp = '<input type="radio" name='+componentId+' value='+data[i][valueField]+' title='+data[i][textField]+'>';
        if (data[i][valueField] == value){
            temp = '<input type="radio" name='+componentId+' value='+data[i][valueField]+' title='+data[i][textField]+' checked>';
        }
        htmlStr = htmlStr+temp;
    }
    return htmlStr;
}

Component.prototype.getAttachmentList = function (data) {
    var htmlStr = '';
    for (var i=0;i<data.length;i++){
        var tr="<li>" +
        "                                    <div class='upLeft' id='upload-"+data[i].attId+"'>" +
        "                                        <span class=\"fileName\">"+data[i].attName+"</span>" +
        "                                        <span class=\"fileState\">上传成功</span>" +
        "                                    </div>" +
        "                                    <div class=\"upRight\">" +
        "                                        <div class='layui-progress layui-col-md8 layui-col-sm8'  lay-filter='progressBar"+data[i].attId+"'>" +
        "                                            <div class=\"layui-progress-bar layui-progress-big layui-bg-green\" lay-percent=\"100%\">" +
            "<span class=\"layui-col-md2 layui-col-sm2\">100%</span>" +
            "</div></div>" +

            "                                        <a href=\"javascript:void (0);\" style=\"margin-left:15px;\"" +
            " class=\"layui-col-md1 layui-col-sm1 demo-delete\" data-id='"+data[i].attId+"'>删除</a>" +
            "                                    </div>" +

            "                                </li>";
        htmlStr = htmlStr+tr;
    }
    return htmlStr;
}


var component = new Component();

