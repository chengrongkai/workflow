package com.crk.entity.system;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 15:45
 * 组织机构
 */
@Entity
@Table(name = "sys_department")
public class Department {
    /**
     * 部门ID
     */
    @Id
    private String departmentId;
    /**
     * 上级部门ID
     */
    private String parentId;
    /**
     * 部门编码
     */
    private String departmentCode;
    /**
     * 部门名称
     */
    private String departmentName;
    /**
     * 部门级别
     */
    private String level;
    /**
     * 部门状态
     */
    private String status;

    /**
     * 创建时间
     */
    private Date createTime;
    /**
     * 创建人
     */
    private String creator;
    /**
     * 修改人
     */
    private String updater;
    /**
     * 修改时间
     */
    private Date updateTime;

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getDepartmentCode() {
        return departmentCode;
    }

    public void setDepartmentCode(String departmentCode) {
        this.departmentCode = departmentCode;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getUpdater() {
        return updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}
