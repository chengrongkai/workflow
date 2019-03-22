package com.tj720.entity.system.menu;

import java.util.List;

/**
 * 菜单树形dto
 */
public class SysFunctionTreeDto {
    /**
     * 功能名称
     */
    private String label;
    /**
     * 功能ID
     */
    private String key;
    /**
     * 是否展开
     */
    private boolean spread;

    public boolean isChecked() {
        return checked;
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    /**
     * 是否被选中

     */
    private boolean checked;
    /**
     * 子列表
     */
    private List<SysFunctionTreeDto> children;

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public boolean isSpread() {
        return spread;
    }

    public void setSpread(boolean spread) {
        this.spread = spread;
    }

    public List<SysFunctionTreeDto> getChildren() {
        return children;
    }

    public void setChildren(List<SysFunctionTreeDto> children) {
        this.children = children;
    }
}