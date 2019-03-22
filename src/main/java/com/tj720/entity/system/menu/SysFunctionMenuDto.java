package com.tj720.entity.system.menu;

import java.util.List;

/**
 * 菜单树形dto
 */
public class SysFunctionMenuDto {
    /**
     * 功能名称
     */
    private String name;
    /**
     * 功能ID
     */
    private String key;
    /**
     * 功能地址
     */
    private String url;
    /**
     * 功能类型
     */
    private String type;
    /**
     * 功能图标
     */
    private String icon;

    private String ext1;

    private String ext2;

    /**
     * 子列表
     */
    private List<SysFunctionMenuDto> list;

    private String children;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public List<SysFunctionMenuDto> getList() {
        return list;
    }

    public void setList(List<SysFunctionMenuDto> list) {
        this.list = list;
    }

    public String getChildren() {
        return children;
    }

    public void setChildren(String children) {
        this.children = children;
    }

    public String getExt1() {
        return ext1;
    }

    public void setExt1(String ext1) {
        this.ext1 = ext1;
    }

    public String getExt2() {
        return ext2;
    }

    public void setExt2(String ext2) {
        this.ext2 = ext2;
    }
}