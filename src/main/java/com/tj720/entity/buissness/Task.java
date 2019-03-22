package com.tj720.entity.buissness;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 17:15
 * 流程任务
 */
public class Task {
    /**
     * 任务ID
     */
    private String taskId;
    /**
     * 任务名称
     */
    private String taskName;
    /**
     * 参与者
     */
    private String participant;
    /**
     * 流程实例ID
     */
    private String processId;

    /**
     * 流程定义ID
     * @return
     */
    private String processDefId;

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getParticipant() {
        return participant;
    }

    public void setParticipant(String participant) {
        this.participant = participant;
    }

    public String getProcessId() {
        return processId;
    }

    public void setProcessId(String processId) {
        this.processId = processId;
    }

    public String getProcessDefId() {
        return processDefId;
    }

    public void setProcessDefId(String processDefId) {
        this.processDefId = processDefId;
    }

    private Task(){

    }
    private  static Task instance = new Task();

    public static Task getInstance(org.activiti.engine.task.Task task){
        instance.taskId = task.getId();
        instance.taskName = task.getName();
        instance.participant = task.getAssignee();
        instance.processId = task.getProcessInstanceId();
        instance.processDefId = task.getProcessDefinitionId();
        return instance;
    }
}
