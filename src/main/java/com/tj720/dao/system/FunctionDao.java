package com.tj720.dao.system;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tj720.entity.system.menu.Function;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 16:19
 */
public interface FunctionDao extends JpaRepository<Function,String>{
    /**
     * 根据角色ID和类型查询功能列表
     * @param roleId 角色ID
     * @param type 类型
     * @return
     */
    @Query(value = "from Function f where f.functionId in (select rs.functionId from ResAuth rs where rs.roleId = ?1)" +
            "and functionType = ?2")
    List<Function> getFunctionListByRole(String roleId, String type);

    /**
     * 根据功能名和类型查询数据
     * @param functionName
     * @param functionType
     * @return
     */
    List<Function> findAllByFunctionNameAndFunctionType(String functionName,String functionType);
}
