var yc = {

    info: '**********',

    arrayToJsonObject: function (keyArray, valueArray) {
        var datas = {};
        if (!Array.isArray(keyArray)) {
            keyArray = [keyArray];
        }
        ;
        if (!Array.isArray(valueArray)) {
            valueArray = [valueArray];
        }
        ;
        if (keyArray != null && valueArray != null) {
            for (var i = 0, j = keyArray.length; i < j; i++) {
                datas[keyArray[i]] = valueArray[i];
            }
            ;
        }
        ;
        return datas;
    },

// 将指定的数组array变成 num + 1 个 倍数的数组
    addOwnArray: function (array, num) {
        var arr = array;
        for (var i = 0; i < num; i++) {
            arr = arr.concat(array);
        }
        return arr;
    },

    getUseJson: function (keyArray, object) {
        var jsons = {};
        for (var i = 0, j = keyArray.length; i < j; i++) {
            jsons[keyArray[i]] = object[keyArray[i]]
        }
        return jsons;
    },
    // [], '', '  ', null, undefined, 0, false 七种  都会返回 true  {} 会返回 false;
    isNull: function (str) {
        if (str == "" || str == null) return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },

    compareTime: function (start, end) {
        var flag = false;
        var first = new Date(Date.parse(start)).getTime();
        var last = new Date(Date.parse(end)).getTime();
        if (first <= last) {
            flag = true;
        }
        return flag;
    },

// 数组去重
    dedupeArray: function (array) {
        return Array.from(new Set(array));
    },

// 判断某个数组是否含有某个元素
// 如果变量在数组内，则返回1，反之，则返回 - 1；
// 尤其要注意判断变量的类型，如果值相等，类型不同的话，也会返回 - 1；
    indexOfArray: function (array, value) {
        return array.indexOf(value);
    },
    //判断方法的url 是否含有.do,容错机制
    //                  method.do, ., do,    1;
    checkStr: function (strs, split, str, splitNum) {
        if (str == strs.split(split)[splitNum]) {
            return true;
        } else {
            return false;
        }
    },

    checkDo: function (url) {
        if (!yc.checkStr(url, '.', 'do', 1)) {
            url = url + '.do';
        }
        return url;
    },

    isBoolean: function(obj) {
        return obj === !!obj
    },

    checkAsync: function (async) {
        if (yc.isNull(async) || !yc.isBoolean(async) ) {
            async == false;
        }
        return async;
    },

    setOptionsIdAndName: function (ids, names) {
        var datas = "<option value='" + "请选择" + "' ></option>";
        if (yc.isNull(ids)) {
            // datas = "<option value='"+ "请选择" +"' >" + "请选择" + "</option>";
        } else {
            for (var i = 0, j = ids.length; i < j; i++) {
                datas += "<option value='" + ids[i] + "' >" + names[i] + "</option>";
            }
        }
        return datas;
    },

    ajaxGetByParams: function (url, data, async, msg) {
        var datas = null;
        $.ajax({
            url: property.getProjectPath() + yc.checkDo(url),
            // 是否异步， false 就是同步
            async: yc.checkAsync(async),
            data: data || {},
            type: 'get',
            dataType: 'json',
            // contentType:"application/json",
            success: function (result) {
                if (result.success == 1) {
                    datas = result;
                    if (!yc.isNull(msg)) {
                        successMsg(msg);
                    }
                } else if (result.success == 0){
                    errorMsg(result.error.message);
                }
            },
            error: function (result) {
                errorMsg("系统异常");
            }
        });
        return datas;

    },

    ajaxGetByParams: function (url, data, msg) {
        var datas = null;
        $.ajax({
            url: property.getProjectPath() + yc.checkDo(url),
            // 是否异步， false 就是同步
            async: false,
            data: data || {},
            type: 'post',
            // contentType:"application/json",
            success: function (result) {
                if (result.success == 1) {
                    datas = result;
                    if (!yc.isNull(msg)) {
                        successMsg(msg);
                    }
                } else if (result.success == 0){
                    errorMsg(result.error.message);
                }
            },
            error: function (result) {
                errorMsg("系统异常");
            }
        });
        return datas;

    },

    ajaxPostByJson: function (url, data) {
        var datas = null;
        $.ajax({
            url: property.getProjectPath() + yc.checkDo(url),
            // 是否异步， false 就是同步
            async: false,
            data: JSON.stringify(data || {}),
            type: 'post',
            dataType: 'json',
            contentType: "application/json",
            success: function (result) {
                if (result.success == 1) {
                    datas = result;
                } else if (result.success == 0){
                    errorMsg(result.error.message);
                }
            },
            error: function (result) {
                errorMsg(result.msg);
            }
        });
        return datas;
    },


    ajaxPostByJson: function (url, data, msg) {
        var datas = null;
        $.ajax({
            url: property.getProjectPath() + yc.checkDo(url),
            // 是否异步， false 就是同步
            async: false,
            data: data || {},
            type: 'post',
            // contentType:"application/json",
            success: function (result) {
                if (result.success == 1) {
                    datas = result;
                    if (!yc.isNull(msg)) {
                        successMsg(msg);
                    }
                } else if (result.success == 0){
                    errorMsg(result.error.message);
                }
            },
            error: function (result) {
                errorMsg("系统异常");
            }
        });
        return datas;

    },


    ajaxPostByJson: function (url, data, async, msg) {
        var datas = null;
        $.ajax({
            url: property.getProjectPath() + yc.checkDo(url),
            // 是否异步， false 就是同步
            async: yc.checkAsync(async),
            data: JSON.stringify(data || {}),
            type: 'post',
            dataType: 'json',
            contentType: "application/json",
            success: function (result) {
                if (result.success == 1) {
                    datas = result;
                    if (!yc.isNull(msg)) {
                        successMsg(msg);
                    }
                } else if (result.success == 0){
                    // errorMsg
                    errorMsg(result.error.message);
                }
            },
            error: function (result) {
                errorMsg(result.msg);
            }
        });
        return datas;
    },


    ajaxPostByJson: function (url, data, async, msg,elem) {
        var datas = null;
        $.ajax({
            url: property.getProjectPath() + yc.checkDo(url),
            // 是否异步， false 就是同步
            async: yc.checkAsync(async),
            data: JSON.stringify(data || {}),
            type: 'post',
            dataType: 'json',
            contentType: "application/json",
            success: function (result) {
                if (result.success == 1) {
                    datas = result;
                    if (!yc.isNull(msg)) {
                        successMsg(msg,function () {
                            parent.$t.goback("page/Exhibition/videoList.html");
                        });
                    }
                } else if (result.success == 0){
                    // errorMsg
                    errorMsg(result.error.message);
                    //加下非空校验
                   if(!isEmpty(elem)){
                       $(elem).attr("checked",false);
                    }
                }
            },
            error: function (result) {
                errorMsg(result.msg);
            }
        });
        return datas;
    }




}


