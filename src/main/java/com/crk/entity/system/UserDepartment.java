package com.crk.entity.system;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 15:50
 * 组织机构用户关联
 */
@Entity
@Table(name = "sys_user_department")
public class UserDepartment {
    /**
     * 主键
     */
    @Id
    private String id;
    /**
     * 用户ID
     */
    private String userId;
    /**
     * 部门ID
     */
    private String departmentId;
    /**
     * 主要部门
     */
    private String isMain;
    /**
     * 状态
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

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public String getIsMain() {
        return isMain;
    }

    public void setIsMain(String isMain) {
        this.isMain = isMain;
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
