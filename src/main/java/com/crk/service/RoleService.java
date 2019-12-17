package com.crk.service;

import com.crk.entity.system.Role;
import com.crk.entity.utils.JsonResult;
import org.springframework.stereotype.Service;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/4 18:02
 */
@Service
public interface RoleService {
    /**
     * 保存角色
     * @param role
     * @return
     */
   JsonResult saveRole(Role role);
}
