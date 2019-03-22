package com.tj720.entity.utils;

import java.io.Serializable;
import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2018/9/27 17:38
 */
public class LayUiTableJson implements Serializable{
    private int code;
    private String msg;
    private int count;
    private List data;
    private int success;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public List<Object> getData() {
        return data;
    }

    public void setData(List<Object> data) {
        this.data = data;
    }

    public int getSuccess() {
        return success;
    }

    public void setSuccess(int success) {
        this.success = success;
    }

    public LayUiTableJson(int code, String msg, int count, List data) {
        this.code = code;
        this.msg = msg;
        this.count = count;
        this.data = data;
    }


    public LayUiTableJson(int code, String msg, int count, List data, int success) {
        this.code = code;
        this.msg = msg;
        this.count = count;
        this.data = data;
        this.success = success;
    }


}
