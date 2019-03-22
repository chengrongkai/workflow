package com.tj720.service;

import org.activiti.engine.task.Task;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 14:54
 */
@Service
public interface WorkflowService {
    /**
     * 根据流程定义key启动流程实例
     * @param key 流程定义key
     * @param creator 创建人
     * @return 流程实例ID
     */
    String startProcessInstanceByKey(String key,String creator);

    /**
     * 设置环节的参与者
     * @param activity
     * @param type
     * @param participant
     */
    void setParticipant(String activity,String type,String participant);

    /**
     *查询任务列表（返回activiti内置task对象列表，无法直接转json）
     * @param userId 用户ID
     * @return 任务列表
     */
    List<Task> getOriginTaskList(String userId);

    /**
     * 查询任务——分页（返回activiti内置task对象列表，无法直接转json）
     * @param userId 用户ID
     * @param start 当前页数
     * @param size 每页大小
     * @return
     */
    List<Task> getOriginTaskListAndPage(String userId,int start,int size);

    /**
     * 查询任务列表
     * @param userId 用户ID
     * @return 任务列表
     */
    List<com.tj720.entity.buissness.Task> getTaskList(String userId);

    /**
     * 查询任务列表——分页
     * @param userId 用户ID
     * @param start 当前页数
     * @param size 每页大小
     * @return 任务列表
     */
    List<com.tj720.entity.buissness.Task> getTaskListAndPage(String userId, int start, int size);

    /**
     * 审批同意
     * @param processId
     * @return
     */
    boolean AgreeTask(String processId);

    /**
     * 审批不同意
     * @param processId
     * @return
     */
    boolean DisAgreeTask(String processId);

}
