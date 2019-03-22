package com.tj720.service.impl;

import com.tj720.dao.system.RoleAuthDao;
import com.tj720.entity.system.RoleAuth;
import com.tj720.entity.utils.JsonResult;
import com.tj720.service.RoleAuthService;
import com.tj720.service.WfIdentityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/5 9:56
 */
@Service
public class RoleAuthServiceImpl implements RoleAuthService{
    @Autowired
    RoleAuthDao roleAuthDao;
    @Autowired
    WfIdentityService wfIdentityService;
    /**
     * 保存角色用户关联
     *
     * @param roleAuth
     * @return
     */
    @Override
    public JsonResult saveRoleAuth(RoleAuth roleAuth) {
        try {
            roleAuth = roleAuthDao.save(roleAuth);
            JsonResult jsonResult = wfIdentityService.saveMembership(roleAuth.getPartyId(), roleAuth.getRoleId());
            return jsonResult;
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult("140000003");
        }
    }
}
