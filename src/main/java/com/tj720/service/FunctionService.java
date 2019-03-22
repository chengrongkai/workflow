package com.tj720.service;

import com.tj720.entity.system.menu.Function;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 16:22
 * 功能服务
 */
@Service
public interface FunctionService {
    /**
     * 保存功能
     * @param function
     * @return
     */
    Function saveFunction(Function function);

    /**
     * 删除功能
     * @param functionId
     * @return
     */
    boolean deleteFunction(String functionId);

    /**
     * 根据功能ID查询功能
     * @param funtionId
     * @return
     */
    Function getFunctionById(String funtionId);

    /**
     * 根据角色查询功能列表
     * @param roleId 角色ID
     * @param type 类型
     * @return
     */
    List<Function> getFunctionListByRoleAndType(String roleId,String type);

    /**
     * 根据功能名称和类型查询列表
     * @param functionName 功能名称
     * @param type 类型
     * @return
     */
    List<Function> queryFunctionByFunctionNameAndType(String functionName,String type);
}
