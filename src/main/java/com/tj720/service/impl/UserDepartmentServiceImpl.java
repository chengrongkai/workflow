package com.tj720.service.impl;

import com.tj720.dao.system.UserDepartmentDao;
import com.tj720.entity.system.Department;
import com.tj720.entity.system.User;
import com.tj720.service.UserDepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 17:11
 */
@Service
public class UserDepartmentServiceImpl implements UserDepartmentService {
    @Autowired
    UserDepartmentDao userDepartmentDao;
    /**
     * 查询主要部门
     *
     * @param userId 用户ID
     * @return
     */
    @Override
    public Department getMainDepartment(String userId) {
        Department byUserIdAndIsMain = userDepartmentDao.findByUserIdAndIsMain(userId, "1");
        return byUserIdAndIsMain;
    }

    /**
     * 查询所有部门
     *
     * @param userId 用户ID
     * @return
     */
    @Override
    public List<Department> getDepartmentList(String userId) {
        List<Department> departmentByUserId = userDepartmentDao.findDepartmentByUserId(userId);
        return departmentByUserId;
    }

    /**
     * 查询所有用户
     *
     * @param departmentId 组织机构ID
     * @return
     */
    @Override
    public List<User> getUserList(String departmentId) {
        List<User> userByDepartmentId = userDepartmentDao.findUserByDepartmentId(departmentId);
        return userByDepartmentId;
    }
}
