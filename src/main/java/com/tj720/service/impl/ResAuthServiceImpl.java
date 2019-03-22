package com.tj720.service.impl;

import com.tj720.dao.system.ResAuthDao;
import com.tj720.entity.system.menu.ResAuth;
import com.tj720.service.ResAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Transient;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 17:38
 */
public class ResAuthServiceImpl implements ResAuthService{
    @Autowired
    ResAuthDao resAuthDao;
    @Autowired
    JdbcTemplate jdbcTemplate;
    /**
     * 保存资源权限
     *
     * @param resAuth 资源权限
     * @return
     */
    @Override
    public ResAuth saveResAuth(ResAuth resAuth) {
        ResAuth save = resAuthDao.save(resAuth);
        return save;
    }

    /**
     * 批量保存
     *
     * @param resAuthList
     * @return
     */
    @Override
    @Transient
    public boolean batchSaveResAuth(List<ResAuth> resAuthList) {
        String sql = "insert sys_res_auth(id,role_id,function_id,function_type) values(?,?,?,?)";
        jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setString(1, resAuthList.get(i).getId());
                ps.setString(2, resAuthList.get(i).getRoleId());
                ps.setString(3, resAuthList.get(i).getFunctionId());
                ps.setString(4, resAuthList.get(i).getFunctionType());
            }
            @Override
            public int getBatchSize() {
                return resAuthList.size();
            }
        });
//        resAuthDao.saveAll(resAuthList);
        return false;
    }
}
