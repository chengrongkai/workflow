package com.tj720.service.impl;

import com.tj720.dao.system.DepartmentDao;
import com.tj720.entity.system.Department;
import com.tj720.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 16:57
 */
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    DepartmentDao departmentDao;
    /**
     * 保存组织机构
     *
     * @param department
     * @return
     */
    @Override
    public Department saveDepartment(Department department) {
        Department save = departmentDao.save(department);
        return save;
    }

    /**
     * 查询组织机构
     *
     * @param departmentId
     * @return
     */
    @Override
    public Department getDepartment(String departmentId) {
        Department one = departmentDao.getOne(departmentId);
        return one;
    }

    /**
     * 删除组织机构
     *
     * @param departmentId
     */
    @Override
    public void deleteDepartment(String departmentId) {
        departmentDao.deleteById(departmentId);
    }

    /**
     * 查询组织机构列表
     *
     * @return
     */
    @Override
    public Page<Department> getDepartmentListWithPage(Integer page,Integer size) {
        Pageable pageable = new PageRequest(page, size, Sort.Direction.ASC, "id");
        Page<Department> all = departmentDao.findAll(pageable);
        return all;
    }
}
