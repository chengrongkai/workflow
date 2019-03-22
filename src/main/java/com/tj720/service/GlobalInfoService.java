package com.tj720.service;

import org.springframework.stereotype.Service;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/18 17:57
 * 全局服务
 */
@Service
public interface GlobalInfoService {
    /**
     * 设置全局用户ID
     * @param userId
     * @return
     */
    boolean setUserId(String userId);

    /**
     * 获取用户ID
     * @return
     */
    String getUserId();
}
