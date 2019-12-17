package com.crk.service.impl;

import com.crk.dao.system.ResAuthDao;
import com.crk.entity.system.User;
import com.crk.entity.system.menu.ResAuth;
import com.crk.service.ResAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Transient;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
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

    public static void main(String[] args) {
        HashMap A  = new HashMap();
        User user = new User();
        user.setName("zhangsan");
        A.put("A",user);
        HashMap B = (HashMap) A.clone();
        System.out.println((User)A.get("A"));//输出2222
    }
}
