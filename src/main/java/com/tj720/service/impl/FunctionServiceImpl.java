package com.tj720.service.impl;

import com.tj720.dao.system.FunctionDao;
import com.tj720.entity.system.menu.Function;
import com.tj720.entity.utils.IdUtils;
import com.tj720.service.FunctionService;
import com.tj720.util.TimeAuto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 16:27
 */
@Service
public class FunctionServiceImpl implements FunctionService{
    @Autowired
    FunctionDao functionDao;
    @Autowired
    TimeAuto timeAuto;
    /**
     * 保存功能
     *
     * @param function
     * @return
     */
    @Override
    public Function saveFunction(Function function) {
        if (StringUtils.isEmpty(function.getFunctionId())){
            function.setFunctionId(IdUtils.getIncreaseIdByCurrentTimeMillis());
            timeAuto.autoSetNowInfo(function,"createTime","updateTime");
            timeAuto.autoSetCurrentUserInfo(function,"creator","updater");
        }else{
            timeAuto.autoSetNowInfo(function,"updateTime");
            timeAuto.autoSetCurrentUserInfo(function,"updater");
        }
        Function save = functionDao.save(function);
        return save;
    }

    /**
     * 删除功能
     *
     * @param functionId
     * @return
     */
    @Override
    public boolean deleteFunction(String functionId) {
        functionDao.deleteById(functionId);
        return true;
    }

    /**
     * 根据功能ID查询功能
     *
     * @param funtionId
     * @return
     */
    @Override
    public Function getFunctionById(String funtionId) {
        Function one = functionDao.getOne(funtionId);
        return one;
    }

    /**
     * 根据角色查询功能列表
     *
     * @param roleId 角色ID
     * @param type   类型
     * @return
     */
    @Override
    public List<Function> getFunctionListByRoleAndType(String roleId, String type) {

        return null;
    }

    /**
     * 根据功能名称和类型查询列表
     *
     * @param functionName 功能名称
     * @param type         类型
     * @return
     */
    @Override
    public List<Function> queryFunctionByFunctionNameAndType(String functionName, String type) {
        return functionDao.findAllByFunctionNameAndFunctionType(functionName,type);
    }
}
