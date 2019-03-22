package com.tj720.service.impl;

import com.tj720.service.WorkflowService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 15:03
 */
@Service
public class WorkflowServiceImpl implements WorkflowService{
    @Autowired
    IdentityService identityService;
    @Autowired
    RuntimeService runtimeService;
    @Autowired
    TaskService taskService;
    @Autowired
    RepositoryService repositoryService;
    /**
     * 同意后缀
     */
    private static  final String AGREE = "_agree";
    /**
     * 不同意后缀
     */
    private static final String DISAGREE = "_disagree";
    /**
     * 根据流程定义key启动流程实例
     *
     * @param key 流程定义key
     * @return 流程实例ID
     */
    @Override
    public String startProcessInstanceByKey(String key,String creator) {
        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(key);
        Task task = taskService.createTaskQuery().processInstanceId(processInstance.getProcessInstanceId())
                .singleResult();
        taskService.setAssignee(task.getId(),creator);
        return processInstance.getId();
    }

    /**
     * 设置环节的参与者
     *
     * @param activity
     * @param type
     * @param participant
     */
    @Override
    public void setParticipant(String activity, String type, String participant) {

    }

    /**
     * 查询任务列表（返回activiti内置task对象列表，无法直接转json）
     *
     * @param userId 用户ID
     * @return 任务列表
     */
    @Override
    public List<Task> getOriginTaskList(String userId) {
        List<Task> list = taskService.createTaskQuery().taskCandidateOrAssigned(userId).list();
        return list;
    }

    /**
     * 查询任务列表
     *
     * @param userId 用户ID
     * @return 任务列表
     */
    @Override
    public List<com.tj720.entity.buissness.Task> getTaskList(String userId) {
        List<Task> list = getOriginTaskList(userId);
        List<com.tj720.entity.buissness.Task> result = new ArrayList<com.tj720.entity.buissness.Task>();
        for (Task task : list) {
            result.add(com.tj720.entity.buissness.Task.getInstance(task));
        }
        return result;
    }

    /**
     * 查询任务——分页（返回activiti内置task对象列表，无法直接转json）
     *
     * @param userId 用户ID
     * @param start  当前页数
     * @param size   每页大小
     * @return
     */
    @Override
    public List<Task> getOriginTaskListAndPage(String userId, int start, int size) {
        List<Task> list = taskService.createTaskQuery().taskCandidateOrAssigned(userId).listPage(start,size);
        return list;
    }

    /**
     * 查询任务列表——分页
     *
     * @param userId 用户ID
     * @param start  当前页数
     * @param size   每页大小
     * @return 任务列表
     */
    @Override
    public List<com.tj720.entity.buissness.Task> getTaskListAndPage(String userId, int start, int size) {
        List<Task> list = getOriginTaskListAndPage(userId,start,size);
        List<com.tj720.entity.buissness.Task> result = new ArrayList<com.tj720.entity.buissness.Task>();
        for (Task task : list) {
            result.add(com.tj720.entity.buissness.Task.getInstance(task));
        }
        return result;
    }

    /**
     * 审批同意
     *
     * @param processId
     * @return
     */
    @Override
    public boolean AgreeTask(String processId) {
        Task task = taskService.createTaskQuery().processInstanceId(processId).singleResult();
        String taskDefinitionKey = task.getTaskDefinitionKey();
        runtimeService.setVariable(processId,taskDefinitionKey+AGREE,true);
        runtimeService.setVariable(processId,taskDefinitionKey+DISAGREE,false);
        taskService.complete(task.getId());
        return true;
    }

    /**
     * 审批不同意
     *
     * @param processId
     * @return
     */
    @Override
    public boolean DisAgreeTask(String processId) {
        Task task = taskService.createTaskQuery().processInstanceId(processId).singleResult();
        String taskDefinitionKey = task.getTaskDefinitionKey();
        runtimeService.setVariable(processId,taskDefinitionKey+AGREE,false);
        runtimeService.setVariable(processId,taskDefinitionKey+DISAGREE,true);
        taskService.complete(task.getId());
        return true;
    }
}
