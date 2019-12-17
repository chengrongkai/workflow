package com.crk.dao.system;

import com.crk.entity.system.RoleAuth;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/5 9:52
 * 角色用户关联操作
 */
public interface RoleAuthDao extends JpaRepository<RoleAuth,String>{
}
