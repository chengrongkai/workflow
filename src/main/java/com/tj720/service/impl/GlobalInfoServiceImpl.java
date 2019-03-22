package com.tj720.service.impl;

import com.tj720.service.CacheService;
import com.tj720.service.GlobalInfoService;
import com.tj720.util.SystemConsts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/18 18:00
 */
@Service
public class GlobalInfoServiceImpl implements GlobalInfoService{
    @Autowired
    CacheService cacheService;
    /**
     * 设置全局用户ID
     *
     * @param userId
     * @return
     */
    @Override
    public boolean setUserId(String userId) {
        //设置30分钟的超时时间
        cacheService.setStrExpire(SystemConsts.USER_ID,userId,30*30);
        return false;
    }

    /**
     * 获取用户ID
     *
     * @return
     */
    @Override
    public String getUserId() {
        return cacheService.getStr(SystemConsts.USER_ID);
    }
}
