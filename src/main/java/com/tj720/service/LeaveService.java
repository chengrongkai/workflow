package com.tj720.service;

import com.tj720.entity.buissness.LeaveApproval;
import com.tj720.entity.buissness.LeaveInfo;
import com.tj720.entity.utils.Page;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/20 14:51
 * 请假服务类
 */
@Service
public interface LeaveService {
    /**
     * 添加请假
     * @param leaveInfo 请假对象
     * @return 请假ID
     */
    String addLeave(LeaveInfo leaveInfo);

    /**
     * 更新请假信息
     * @param leaveInfo
     * @return
     */
    String updateLeave(LeaveInfo leaveInfo);

    /**
     * 删除请假信息
     * @param leaveId
     * @return
     */
    boolean deleteLeave(String leaveId);

    /**
     * 获取请假单详情
     * @param formId 表单ID
     * @return
     */
    LeaveInfo getLeaveInfo(String formId);

    /**
     * 查询请假列表
     * @param condition 查询条件
     * @param page 分页参数
     * @return 请假信息列表
     */
    List<LeaveInfo> queryLeaveListWithPage(HashMap<String,Object> condition,Page page);

    /**
     * 查询审批过程列表
     * @param formId
     * @return
     */
    List<LeaveApproval> getLeaveApprovalList(String formId);

    /**
     * 保存审批记录信息
     * @param leaveApproval 审批记录
     * @return
     */
    boolean saveLeaveApproval(LeaveApproval leaveApproval);
}
