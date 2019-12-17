package com.crk.controller;

import com.crk.entity.buissness.LeaveApproval;
import com.crk.entity.buissness.LeaveInfo;
import com.crk.entity.utils.JsonResult;
import com.crk.service.GlobalInfoService;
import com.crk.service.LeaveService;
import com.crk.service.WorkflowService;
import com.crk.util.ActionTypes;
import com.crk.util.ProcessKeys;
import com.crk.util.ProcessStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/18 17:51
 *请假申请
 */
@RestController
@RequestMapping("leave")
public class LeaveController {
    @Autowired
    WorkflowService workflowService;
    @Autowired
    GlobalInfoService globalInfoService;
    @Autowired
    LeaveService leaveService;
    /**
     * 发起请假申请
     * @return
     */
    @PostMapping("applyLeave")
    public JsonResult applyLeave(LeaveInfo leaveInfo){
        try {
            String processInstId = workflowService.startProcessInstanceByKey(ProcessKeys.LEAVE_APPLY, globalInfoService.getUserId());

            leaveInfo.setProcessInstanceId(processInstId);
            leaveInfo.setProcessStatus(ProcessStatus.RUNNING);
            String leaveId = leaveService.addLeave(leaveInfo);
            return new JsonResult(1,leaveId);
        }catch (Exception e){
            return new JsonResult(0);
        }
    }

    @GetMapping("getDetailLeaveApply")
    public JsonResult getDetailLeaveApply(@RequestParam String formId){
        try {
            HashMap<String,Object> data = new HashMap<String,Object>(8);
            LeaveInfo leaveInfo = leaveService.getLeaveInfo(formId);
            data.put("leaveInfo",leaveInfo);
            List<LeaveApproval> leaveApprovalList = leaveService.getLeaveApprovalList(formId);
            data.put("leaveApprovalList",leaveApprovalList);
            return new JsonResult(1,data);
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult(0);
        }
    }

    @PostMapping("approvalLeave")
    public JsonResult approvalLeave(LeaveApproval approval){
        try {
            leaveService.saveLeaveApproval(approval);
            //审批通过
            if (ActionTypes.AGREE.equals(approval.getActionType())){
                workflowService.AgreeTask(approval.getProcessInstanceId());
                return new JsonResult(1);
            }else if(ActionTypes.DISAGREE.equals(approval.getActionType())){
                workflowService.DisAgreeTask(approval.getProcessInstanceId());
                return new JsonResult(1);
            }else {
                return new JsonResult(0);
            }
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult(0);
        }
    }

}
