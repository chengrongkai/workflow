package com.crk.entity.buissness;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/28 11:54
 * 系统日志
 */
@Entity
@Table(name = "sys_log")
public class Log {
    /**
     * 日志ID
     */
    @Id
    private String logId;
    /**
     * 日志类型
     */
    private String logType;
    /**
     * 所属模块
     */
    private String module;
    /**
     * 操作类型
     */
    private String actionType;
    /**
     * 操作描述
     */
    private String actionDesc;
    /**
     * 操作时间
     */
    private Date actionTime;
    /**
     * 操作人
     */
    private String operator;
    /**
     * 操作结果
     */
    private String result;

    public String getLogId() {
        return logId;
    }

    public void setLogId(String logId) {
        this.logId = logId;
    }

    public String getLogType() {
        return logType;
    }

    public void setLogType(String logType) {
        this.logType = logType;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getActionDesc() {
        return actionDesc;
    }

    public void setActionDesc(String actionDesc) {
        this.actionDesc = actionDesc;
    }

    public Date getActionTime() {
        return actionTime;
    }

    public void setActionTime(Date actionTime) {
        this.actionTime = actionTime;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }


}
