package com.crk.service.impl;

import com.crk.dao.system.RoleAuthDao;
import com.crk.entity.system.RoleAuth;
import com.crk.entity.utils.JsonResult;
import com.crk.service.RoleAuthService;
import com.crk.service.WfIdentityService;
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
