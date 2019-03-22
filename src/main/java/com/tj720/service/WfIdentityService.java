package com.tj720.service;

import com.tj720.entity.utils.JsonResult;
import org.springframework.stereotype.Service;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/28 10:53
 * 工作流身份服务接口
 */
@Service
public interface WfIdentityService {
    /**
     * 保存用户
     *
     * @param userId 工作流用户
     * @param password 密码
     * @param userName 用户名
     * @return 处理结果
     */
    JsonResult saveUser(String userId,String password,String userName);


    /**
     * 删除用户
     * @param userId 用户ID
     * @return 处理结果
     */
    JsonResult deleteUser(String userId);

    /**
     * 查询用户
     * @param userId 用户ID
     * @return 查询结果
     */
    JsonResult queryUser(String userId);

    /**
     * 保存组
     * @param groupId
     * @param groupName
     * @param type
     * @return
     */
    JsonResult saveGroup(String groupId,String groupName,String type);

    /**
     * 保存用户与组的关系
     * @param userId 用户ID
     * @param groupId 组ID
     * @return
     */
    JsonResult saveMembership(String userId,String groupId);
}
