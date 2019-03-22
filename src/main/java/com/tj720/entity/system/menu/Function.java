package com.tj720.entity.system.menu;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 15:55
 * 功能表
 */
@Entity
@Table(name = "sys_function")
public class Function {
    /**
     * 功能ID
     */
    @Id
    private String functionId;
    /**
     * 功能名称
     */
    private String functionName;
    /**
     * 功能类型
     */
    private String functionType;
    /**
     * 功能地址
     */
    private String functionUrl;
    /**
     * 上级功能ID
     */
    private String parentId;
    /**
     * 排序
     */
    private String sort;
    /**
     * 图标
     */
    private String icon;

    public String getFunctionId() {
        return functionId;
    }

    public void setFunctionId(String functionId) {
        this.functionId = functionId;
    }

    public String getFunctionName() {
        return functionName;
    }

    public void setFunctionName(String functionName) {
        this.functionName = functionName;
    }

    public String getFunctionType() {
        return functionType;
    }

    public void setFunctionType(String functionType) {
        this.functionType = functionType;
    }

    public String getFunctionUrl() {
        return functionUrl;
    }

    public void setFunctionUrl(String functionUrl) {
        this.functionUrl = functionUrl;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
