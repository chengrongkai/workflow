package com.tj720.entity.system.menu;

import java.util.ArrayList;
import java.util.List;

public class MenuNode {
    private String id;

    private String name;

    private String menuurl;

    private String parentid;

    private String iconremark;

    private String type;
    
    private String roleids;

    private Integer sequence;
    
    private List<MenuNode> children;

    
    
	public String getRoleids() {
		return roleids;
	}

	public void setRoleids(String roleids) {
		this.roleids = roleids;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMenuurl() {
		return menuurl;
	}

	public void setMenuurl(String menuurl) {
		this.menuurl = menuurl;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getIconremark() {
		return iconremark;
	}

	public void setIconremark(String iconremark) {
		this.iconremark = iconremark;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getSequence() {
		return sequence;
	}

	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<MenuNode> getChildren() {
		if(children == null) {
			children = new ArrayList<>();
		}
		return children;
	}

	public void setChildren(List<MenuNode> children) {
		this.children = children;
	}
    
}
