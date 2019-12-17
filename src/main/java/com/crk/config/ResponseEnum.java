package com.crk.config;

/**
 * Description:
 * 响应状态码
 * @author: chengrongkai
 * Date: 2019-12-17
 * Time: 14:52
 */
public enum ResponseEnum {

    SUCCESS("200","操作成功"),
    FAIL("500","操作失败"),
    PARAM_ERROR("501","参数有误"),
    USERCHECK_ERROR("502","用户名或密码有误"),
    USEREXIST_ERROR("503","用户名或手机号已存在"),
    REGISTER_ERROR("504","注册失败")
    ;
    /**
     * 状态码
     */
    private String code;
    /**
     * 响应消息
     */
    private String msg;

    ResponseEnum(String code,String msg){
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
