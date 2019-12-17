package com.crk.service.impl;

import com.crk.dao.system.RoleDao;
import com.crk.entity.system.Role;
import com.crk.entity.utils.IdUtils;
import com.crk.entity.utils.JsonResult;
import com.crk.service.RoleService;
import com.crk.service.WfIdentityService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/4 18:03
 */
@Service
public class RoleServiceImpl implements RoleService{
    @Autowired
    RoleDao roleDao;
    @Autowired
    WfIdentityService wfIdentityService;
    /**
     * 保存角色
     *
     * @param role
     * @return
     */
    @Override
    public JsonResult saveRole(Role role) {
        if (null != role){
            if (StringUtils.isEmpty(role.getRoleId())){
                role.setRoleId(IdUtils.getRandomIdByUUID());
            }
            role = roleDao.save(role);
            JsonResult jsonResult = wfIdentityService.saveGroup(role.getRoleId(), role.getRoleName(),role.getLevel());
            return jsonResult;
        }else {
            return new JsonResult("140000003");
        }
    }
}
