package com.crk.dao.system;

import com.crk.entity.system.Department;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 16:40
 */
public interface DepartmentDao extends JpaRepository<Department,String>{

}
