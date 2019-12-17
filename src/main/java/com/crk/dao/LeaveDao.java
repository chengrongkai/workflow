package com.crk.dao;

import com.crk.entity.buissness.LeaveInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.HashMap;


/**
 * @Author: 程荣凯
 * @Date: 2019/3/20 15:07
 */
public interface LeaveDao extends JpaRepository<LeaveInfo,String> {
    @Query(value = "from LeaveInfo")
    LeaveInfo getLeaveInfoCondition(HashMap<String, Object> condition);


}

