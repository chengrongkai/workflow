package com.tj720.entity.system;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/5 9:48
 * 角色用户关联表
 */
@Entity
@Table(name = "sys_role_auth")
public class RoleAuth {
    /**
     * 主键
     */
    @Id
    private String authId;
    /**
     * 角色ID
     */
    private String roleId;
    /**
     * 用户ID
     */
    private String partyId;
    /**
     * 用户类型
     */
    private String partyType;
    /**
     * 备用字段
     */
    private String ext;

    public String getAuthId() {
        return authId;
    }

    public void setAuthId(String authId) {
        this.authId = authId;
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getPartyId() {
        return partyId;
    }

    public void setPartyId(String partyId) {
        this.partyId = partyId;
    }

    public String getPartyType() {
        return partyType;
    }

    public void setPartyType(String partyType) {
        this.partyType = partyType;
    }

    public String getExt() {
        return ext;
    }

    public void setExt(String ext) {
        this.ext = ext;
    }
}
