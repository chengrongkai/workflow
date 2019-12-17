package com.crk.service;

import com.crk.entity.system.User;
import com.crk.entity.utils.JsonResult;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 14:46
 * 用户服务
 */
@Service
public interface UserService {
    /**
     * 获取所有用户
     * @return 用户列表
     */
    List<User> getAllUser();

    /**
     * 保存用户
     * @param user
     * @return
     */
    JsonResult saveUser(User user);

    /**
     * 根据用户名或手机号查询用户信息
     * @param userName 用户名或手机号
     * @return
     */
    JsonResult getUserByNameOrPhone(String userName);



    JsonResult getUserInfo(String userName);

    void addUserInfo(User user);

}
