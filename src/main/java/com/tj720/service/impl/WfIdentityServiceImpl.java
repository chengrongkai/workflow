package com.tj720.service.impl;

import com.tj720.entity.utils.JsonResult;
import com.tj720.service.WfIdentityService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/28 10:53
 */
@Service
public class WfIdentityServiceImpl implements WfIdentityService{

    @Autowired
    IdentityService identityService;
    /**
     * 保存用户
     *
     * @param userId 工作流用户
     * @param password 密码
     * @param userName 用户名
     * @return 处理结果
     */
    @Override
    public JsonResult saveUser(String userId,String password,String userName) {
        try {
            User user = identityService.newUser(userId);
            user.setPassword(password);
            user.setFirstName(userName);
            identityService.saveUser(user);
            return new JsonResult(1);
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult("140000003");
        }
    }



    /**
     * 删除用户
     *
     * @param userId 用户ID
     * @return 处理结果
     */
    @Override
    public JsonResult deleteUser(String userId) {
        try {
            identityService.deleteUser(userId);
            return new JsonResult(1);
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult("140000003");
        }

    }

    /**
     * 查询用户
     *
     * @param userId 用户ID
     * @return 查询结果
     */
    @Override
    public JsonResult queryUser(String userId) {
        try {
            User user = identityService.createUserQuery().userId(userId).singleResult();
            return new JsonResult(1,user);
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult("140000003");
        }

    }
    /**
     * 保存组
     * @param groupId
     * @param groupName
     * @param type
     * @return
     */
    @Override
    public JsonResult saveGroup(String groupId, String groupName,String type) {
        try {
            Group group = identityService.newGroup(groupId);
            group.setName(groupName);
            group.setType(type);
            identityService.saveGroup(group);
            return new JsonResult(1);
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult("140000003");
        }
    }

    /**
     * 保存用户与组的关系
     * @param userId 用户ID
     * @param groupId 组ID
     * @return
     */
    @Override
    public JsonResult saveMembership(String userId, String groupId) {
        try {
            identityService.createMembership(userId,groupId);
            return new JsonResult(1);
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult("140000003");
        }
    }
}
