package com.crk.dao.mybatis;

import com.crk.entity.mybatis.SysResAuth;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SysResAuthMapper {
    int deleteByPrimaryKey(String id);

    int insert(SysResAuth record);

    int insertSelective(SysResAuth record);

    SysResAuth selectByPrimaryKey(String id);

    int updateByPrimaryKeySelective(SysResAuth record);

    int updateByPrimaryKey(SysResAuth record);

    /**
     * 批量保存数据
     * @param list
     * @return
     */
    int batchSaveData(List<SysResAuth> list);
}