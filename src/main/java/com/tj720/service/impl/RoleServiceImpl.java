package com.tj720.service.impl;

import com.tj720.dao.system.RoleDao;
import com.tj720.entity.system.Role;
import com.tj720.entity.utils.IdUtils;
import com.tj720.entity.utils.JsonResult;
import com.tj720.service.RoleService;
import com.tj720.service.WfIdentityService;
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
