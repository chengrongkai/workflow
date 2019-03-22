package com.tj720.service;

import com.tj720.entity.system.Department;
import com.tj720.entity.system.User;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 17:07
 * 用户组织机构服务
 */
@Service
public interface UserDepartmentService {
    /**
     * 查询主要部门
     * @param userId 用户ID
     * @return
     */
    Department getMainDepartment(String userId);

    /**
     * 查询所有部门
     * @param userId 用户ID
     * @return
     */
    List<Department> getDepartmentList(String userId);

    /**
     * 查询所有用户
     * @param departmentId 组织机构ID
     * @return
     */
    List<User> getUserList(String departmentId);
}
