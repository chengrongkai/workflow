package com.tj720.controller;

import com.tj720.config.RedisConfig;
import com.tj720.config.TestProperties;
import com.tj720.entity.system.User;
import com.tj720.entity.utils.JsonResult;
import com.tj720.service.UserService;
import com.tj720.service.WorkflowService;
import com.tj720.entity.buissness.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 15:22
 */
@RestController
@RequestMapping("test")
public class TestController {

    @Value("${redis.port}")
    String port;

    @Autowired
    RedisConfig redisConfig;

    @Autowired
    WorkflowService workflowService;
    @Autowired
    UserService userService;

    /**
     * 根据key启动流程
     * @param key 流程key
     * @param userId 创建人
     * @return
     */
    @RequestMapping("startProcessByKey")
    public String startProcessByKey(@RequestParam String key,@RequestParam String userId){
        return workflowService.startProcessInstanceByKey(key,userId);
    }

    /**
     * 根据用户ID查询任务列表
     * @param userId 用户ID
     * @return
     */


    @RequestMapping("getTaskList")
    public JsonResult getTaskList(@RequestParam String userId){
        List<Task> data = workflowService.getTaskList(userId);
        return new JsonResult(1,data);


    }

    @RequestMapping("saveUser")
    public JsonResult saveUser(User user){
        JsonResult jsonResult = userService.saveUser(user);
        return jsonResult;
    }

    @RequestMapping("getUser")
    public JsonResult getUser(String userName){
        JsonResult jsonResult = userService.getUserByNameOrPhone(userName);
        return jsonResult;
    }

    @RequestMapping("test1")
    public String test1(){
        return "8080";
    }

    @RequestMapping("addUserInfo")
    public JsonResult addUserInfo(User user){
        userService.addUserInfo(user);
        return new JsonResult(1);
    }
    @RequestMapping("getUserInfo")
    public JsonResult getUserInfo(String userName){
        JsonResult jsonResult = userService.getUserInfo(userName);
        return jsonResult;
    }

    @RequestMapping("testPort")
    public String testPort(){
        return redisConfig.getPort();
    }

    @Autowired
    TestProperties testProperties;
    @RequestMapping("testaa")
    public String testaa(){
        return testProperties.getAa();
    }

}
