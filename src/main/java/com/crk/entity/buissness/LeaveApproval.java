package com.crk.entity.buissness;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/18 17:22
 */
@Data
@Entity
@Table(name = "bs_leave_approval")
    public class LeaveApproval {
    /**
     * 审批ID
     */
    @Id
    private String approvalId;
    /**
     * 表单ID
     */
    private String formId;
    /**
     * 流程实例ID
     */
    private String processInstanceId;
    /**
     * 审批人
     */
    private String approval;
    /**
     * 备注
     */
    private String remarks;

    /**
     * 操作类型
     */
    private String actionType;
    /**
     * 审批意见
     */
    private String approvalComments;

    private Date approvalTime;

    public String getApprovalId() {
        return approvalId;
    }

    public void setApprovalId(String approvalId) {
        this.approvalId = approvalId;
    }

    public String getFormId() {
        return formId;
    }

    public void setFormId(String formId) {
        this.formId = formId;
    }

    public String getProcessInstanceId() {
        return processInstanceId;
    }

    public void setProcessInstanceId(String processInstanceId) {
        this.processInstanceId = processInstanceId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getApprovalComments() {
        return approvalComments;
    }

    public void setApprovalComments(String approvalComments) {
        this.approvalComments = approvalComments;
    }

    public String getApproval() {
        return approval;
    }

    public void setApproval(String approval) {
        this.approval = approval;
    }

    public Date getApprovalTime() {
        return approvalTime;
    }

    public void setApprovalTime(Date approvalTime) {
        this.approvalTime = approvalTime;
    }
}
