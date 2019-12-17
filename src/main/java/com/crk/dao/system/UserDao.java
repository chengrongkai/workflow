package com.crk.dao.system;

import com.crk.entity.system.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 14:49
 */
public interface UserDao extends JpaRepository<User,String> {

    /**
     * 根据登录名和密码查询用户
     * @param loginName 登录名
     * @param pwd 登录密码
     * @return
     */
    @Query(value = "from User s where s.userName = ?1 and s.password = ?2")
    User getUserByLoginNameAndPwd(String loginName,String pwd);

    /**
     * 根据用户名或手机号查询用户
     * @param phone 手机号
     * @param userName 用户名
     * @return
     */
    User findUserByPhoneOrUserName(String phone,String userName);
}
