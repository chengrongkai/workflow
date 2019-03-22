package com.tj720.service.impl;

import com.alibaba.fastjson.JSON;
import com.tj720.dao.system.UserDao;
import com.tj720.entity.system.User;
import com.tj720.entity.utils.IdUtils;
import com.tj720.entity.utils.JsonResult;
import com.tj720.service.CacheService;
import com.tj720.service.UserService;
import com.tj720.service.WfIdentityService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 14:47
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService{
    /**
     * 用户操作
     */
    @Autowired
    UserDao userDao;
    @Autowired
    WfIdentityService wfIdentityService;

    @Autowired
    CacheService cacheService;

    /**
     * 获取所有用户
     *
     * @return 用户列表
     */
    @Override
    public List<User> getAllUser() {
        return userDao.findAll();
    }

    /**
     * 保存用户
     *
     * @param user 用户对象
     * @return
     */
    @Override
    public JsonResult saveUser(User user) {
        if (null != user){
            if (StringUtils.isEmpty(user.getUserId())){
                user.setUserId(IdUtils.getRandomIdByUUID());
            }
            user = userDao.save(user);

            JsonResult jsonResult = wfIdentityService.saveUser(user.getUserId(), user.getPassword(), user.getUserName());
            return jsonResult;
        }else {
            return new JsonResult("140000003");
        }
    }

    /**
     * 根据用户名或手机号查询用户信息
     *
     * @param userName 用户名或手机号
     * @return
     */
    @Override
    public JsonResult getUserByNameOrPhone(String userName) {
        User user = userDao.getByUserNameOrPhone(userName);
        if (null != user){
            return new JsonResult(1,user);
        }else {
            return new JsonResult("140000003");
        }

    }

    @Override
    public JsonResult getUserInfo(String userName) {
        String str = cacheService.getStr(userName);
        User user = JSON.parseObject(str,User.class);
        return new JsonResult(1,user);
    }

    @Override
    public void addUserInfo(User user) {
        String key = user.getUserName();
        String info = JSON.toJSONString(user);
        cacheService.setStr(key,info);
    }
}
