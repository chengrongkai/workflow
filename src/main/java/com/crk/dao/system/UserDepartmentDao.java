package com.crk.dao.system;

import com.crk.entity.system.Department;
import com.crk.entity.system.User;
import com.crk.entity.system.UserDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 16:46
 */
public interface UserDepartmentDao extends JpaRepository<UserDepartment,String>{
    /**
     * 查询主要部门
     * @param userId
     * @param isMain
     * @return
     */
    Department findByUserIdAndIsMain(String userId,String isMain);

    /**
     * 查询所有部门
     * @param userId
     * @return
     */
    @Query(value = "from Department s where s.departmentId in (select departmentId from UserDepartment where userId = ?1)")
    List<Department> findDepartmentByUserId(String userId);

    /**
     * 查询所有用户
     * @param departmentId
     * @return
     */
    @Query(value = "from User s where s.userId in (select userId from UserDepartment where departmentId = ?1)")
    List<User> findUserByDepartmentId(String departmentId);


}
