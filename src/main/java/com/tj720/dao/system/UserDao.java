package com.tj720.dao.system;

import com.tj720.entity.system.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 14:49
 */
public interface UserDao extends JpaRepository<User,String> {
    /**
     * 根据用户名或手机查询用户
     * @param userName
     * @return
     */
    @Query(value = "from User s where s.userName = ?1 or s.phone = ?1")
    User getByUserNameOrPhone(String userName);
}
