package com.tj720.entity.system;


import javax.persistence.*;
import java.util.Date;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 14:34
 */
@Entity
@Table(name = "sys_user")
public class User{
    /**
     * 主键
     */
    @Id
    private String userId;

    private String password;


    /**
     * 用户名
     */
    private String userName;
    /**
     * 名称
     */
    private String name;
    /**
     * 手机号
     */
    private String phone;
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

    /**
     * 备用字段
     */
    private String ext1;
    /**
     * 备用字段
     */
    private String ext2;

    public String getUserId() {
        return userId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
