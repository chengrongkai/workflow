package com.crk.config;

import com.crk.entity.system.User;
import org.apache.commons.codec.digest.DigestUtils;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 14:16
 * 三员账号（不允许存储在数据库,保密要求）
 */
public class ThreeAdminInfo {
    /**
     * 系统管理员
     */
    private static User systemAdmin = new User();
    /**
     * 审计管理员
     */
    private static User auditAdmin = new User();;
    /**
     * 安全管理员
     */
    private static User securityAdmin = new User();;

    static {
        /**
         * 设置系统管理员
         */
        systemAdmin.setUserId("sysadmin");
        systemAdmin.setPassword(DigestUtils.md5Hex("sysadmin"));
        systemAdmin.setUserName("系统管理员");

        auditAdmin.setUserId("audit");
        auditAdmin.setUserId(DigestUtils.md5Hex("audit"));
        auditAdmin.setUserName("审计管理员");

        securityAdmin.setUserId("security");
        securityAdmin.setPassword(DigestUtils.md5Hex("security"));
        securityAdmin.setUserName("安全管理员");
    }

    public static User getSystemAdmin() {

        return systemAdmin;
    }

    public static User getAuditAdmin() {
        return auditAdmin;
    }

    public static User getSecurityAdmin() {
        return securityAdmin;
    }

    /**
     * 可以不开放
     * @param pwd
     */
    public static void changeSystemInfo(String pwd){
        systemAdmin.setPassword(pwd);
    }
}
