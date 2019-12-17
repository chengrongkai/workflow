package com.crk.service;

import com.crk.entity.system.RoleAuth;
import com.crk.entity.utils.JsonResult;
import org.springframework.stereotype.Service;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/5 9:53
 */
@Service
public interface RoleAuthService {
    /**
     * 保存角色用户关联
     * @param roleAuth
     * @return
     */
   JsonResult saveRoleAuth(RoleAuth roleAuth);
}
