package com.tj720.service;

import com.tj720.entity.system.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 16:48
 * 组织机构服务
 */
@Service
public interface DepartmentService {
    /**
     * 保存组织机构
     * @param department
     * @return
     */
    Department saveDepartment(Department department);

    /**
     * 查询组织机构
     * @param departmentId
     * @return
     */
    Department getDepartment(String departmentId);

    /**
     * 删除组织机构
     * @param departmentId
     */
    void deleteDepartment(String departmentId);

    /**
     * 查询组织机构列表
     * @param page
     * @param size
     * @return
     */
    Page<Department> getDepartmentListWithPage(Integer page,Integer size);
}
