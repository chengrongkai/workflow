package com.crk.config;

import com.crk.entity.utils.Page;

/**
 * Description:
 *
 * @author: chengrongkai
 * Date: 2019-12-17
 * Time: 14:59
 */
public class ResponseResult {
    private static final long serialVersionUID = 7553249056983455065L;
    /**
     * 分页信息
     */
    private Page page;
    /**
     * 状态码
     */
    private String code;
    /**
     * 信息
     */
    private String msg;
    /**
     * 数据对象
     */
    private Object data;

    private ResponseResult(){

    }


    public Page getPage() {
        return page;
    }

    public void setPage(Page page) {
        this.page = page;
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

    private void setResponse(ResponseEnum responseEnum){
        this.code = responseEnum.getCode();
        this.msg = responseEnum.getMsg();
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    private static ResponseResult getInstance(){
        return new ResponseResult();
    }


    public static ResponseResult success(){
        ResponseResult instance = getInstance();
        instance.setResponse(ResponseEnum.SUCCESS);
        return instance;
    }

    public static ResponseResult success(Object data){
        ResponseResult success = success();
        success.setData(data);
        return success;
    }

    public static ResponseResult success(Object data,Page page){
        ResponseResult success = success(data);
        success.setPage(page);
        return success;
    }

    public static ResponseResult fail(){
        ResponseResult instance = getInstance();
        instance.setResponse(ResponseEnum.FAIL);
        return instance;
    }

    public static ResponseResult fail(ResponseEnum responseEnum){
        ResponseResult instance = getInstance();
        instance.setResponse(responseEnum);
        return instance;
    }
}
