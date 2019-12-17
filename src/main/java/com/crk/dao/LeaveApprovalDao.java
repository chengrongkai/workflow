package com.crk.dao;

import com.crk.entity.buissness.LeaveApproval;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/20 16:31
 */
public interface LeaveApprovalDao extends JpaRepository<LeaveApproval,String>{
    /**
     * 根据表单ID查询审批记录
     * @param formId 表单ID
     * @return
     */
    List<LeaveApproval> findAllByFormId(String formId);
}
