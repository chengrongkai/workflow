package com.crk.service.impl;

import com.crk.dao.LeaveApprovalDao;
import com.crk.dao.LeaveDao;
import com.crk.entity.buissness.LeaveApproval;
import com.crk.entity.buissness.LeaveInfo;
import com.crk.entity.utils.IdUtils;
import com.crk.entity.utils.Page;
import com.crk.service.LeaveService;
import com.crk.util.TimeAuto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/20 15:02
 */
@Service
public class LeaveServiceImpl implements LeaveService{
    @Autowired
    LeaveDao leaveDao;
    @Autowired
    TimeAuto timeAuto;
    @Autowired
    LeaveApprovalDao leaveApprovalDao;
    /**
     * 添加请假
     *
     * @param leaveInfo 请假对象
     * @return 请假ID
     */
    @Override
    public String addLeave(LeaveInfo leaveInfo) {
        try {
            timeAuto.autoSetNowInfo(leaveInfo,"createTime","updateTime");
            timeAuto.autoSetCurrentUserInfo(leaveInfo,"creator","updater");
            LeaveInfo save = leaveDao.save(leaveInfo);
            return save.getFormId();
        }catch (Exception e){
            return null;
        }

    }

    /**
     * 更新请假信息
     *
     * @param leaveInfo
     * @return
     */
    @Override
    public String updateLeave(LeaveInfo leaveInfo) {
        try {
            timeAuto.autoSetNowInfo(leaveInfo,"updateTime");
            timeAuto.autoSetCurrentUserInfo(leaveInfo,"updater");
            leaveInfo.setFormId(IdUtils.getIncreaseIdByCurrentTimeMillis());
            LeaveInfo save = leaveDao.save(leaveInfo);
            return save.getFormId();
        }catch (Exception e){
            return null;
        }
    }

    /**
     * 删除请假信息
     *
     * @param leaveId
     * @return
     */
    @Override
    public boolean deleteLeave(String leaveId) {
        try {
            leaveDao.deleteById(leaveId);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    /**
     * 获取请假单详情
     *
     * @param formId 表单ID
     * @return
     */
    @Override
    public LeaveInfo getLeaveInfo(String formId) {
        try {
            LeaveInfo leaveInfoByCondition = leaveDao.getOne(formId);
            return leaveInfoByCondition;
        }catch (Exception e){
            return null;
        }
    }

    /**
     * 查询请假列表
     *
     * @param condition 查询条件
     * @param page      分页参数
     * @return 请假信息列表
     */
    @Override
    public List<LeaveInfo> queryLeaveListWithPage(HashMap<String, Object> condition, Page page) {
        return null;
    }

    /**
     * 查询审批过程列表
     *
     * @param formId
     * @return
     */
    @Override
    public List<LeaveApproval> getLeaveApprovalList(String formId) {
        try {
            List<LeaveApproval> leaveApprovalList = leaveApprovalDao.findAllByFormId(formId);
            return leaveApprovalList;
        }catch (Exception e){
            return null;
        }
    }

    /**
     * 保存审批记录信息
     *
     * @param leaveApproval 审批记录
     * @return
     */
    @Override
    public boolean saveLeaveApproval(LeaveApproval leaveApproval) {
        try {
            timeAuto.autoSetCurrentUserInfo(leaveApproval,"approval");
            timeAuto.autoSetNowInfo(leaveApproval,"approvalTime");
            leaveApprovalDao.save(leaveApproval);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
}
