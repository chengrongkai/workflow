package com.crk.service;

import com.crk.config.ResponseResult;

/**
 * Description:
 *
 * @author: chengrongkai
 * Date: 2019-12-17
 * Time: 15:31
 */

public interface LoginService {
    /**
     * 登录
     * @param loginName 用户名
     * @param pwd 密码
     * @return
     */
    public abstract ResponseResult login(String loginName, String pwd);

    /**
     * 用户注册
     * @param userName 用户名
     * @param phone 手机号
     * @param pwd 密码
     * @return
     */
    ResponseResult register(String userName,String phone,String pwd);
}
