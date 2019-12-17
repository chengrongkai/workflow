package com.crk.aspect;

import com.crk.config.UserConfig;
import com.crk.config.WfUserAop;
import com.crk.entity.buissness.inter.UserObject;
import com.crk.service.WfIdentityService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

/**
 * @Author: 程荣凯
 * @Date: 2019/2/28 12:11
 */
@Aspect
@Component
public class WfUserAopAspect {
    @Autowired
    WfIdentityService wfIdentityService;

    @Pointcut("@annotation(com.crk.config.WfUserAop)")
    public void listener() {
//        System.out.println("我是一个切入点");
    }

    @After("listener()")
    public void saveUser(JoinPoint joinPoint){
        handleUser(joinPoint,null);
    }

    private void handleUser(JoinPoint joinPoint, Exception e)
    {
        try
        {
            // 获得注解
            WfUserAop controllerAop = giveController(joinPoint);
            if (controllerAop== null)
            {
                return;
            }else {
               String actionType = controllerAop.actionType();
               UserObject userObject = getUserObject(joinPoint,actionType);
               if (UserConfig.SAVE_TYPE.equals(actionType)){
                   wfIdentityService.saveUser(userObject.getUserId(),userObject.getPassword(),userObject.getUserName());
               }else if (UserConfig.DELETE_TYPE.equals(actionType)){
                   wfIdentityService.deleteUser(userObject.getUserId());
               }
            }

        }
        catch (Exception ex)
        {
            // 记录本地异常日志
            ex.printStackTrace();
        }
    }

    /**
     * 是否存在注解，如果存在就记录日志
     *
     * @param joinPoint
     * @param  //controllerAop
     * @return
     * @throws Exception
     */
    private static WfUserAop giveController(JoinPoint joinPoint) throws Exception
    {
        Signature signature = joinPoint.getSignature();
        MethodSignature methodSignature = (MethodSignature) signature;
        Method method = methodSignature.getMethod();
        if (method != null)
        {
            WfUserAop wfUserAop = method.getAnnotation(WfUserAop.class);
            return wfUserAop;
        }
        return null;
    }

    /**
     * 获取UserObject对象
     * @param joinPoint
     * @param type
     * @return
     */
    private UserObject getUserObject(JoinPoint joinPoint,String type){
        UserObject userObject = new UserObject();
        Object[] args = joinPoint.getArgs();
        if (UserConfig.DELETE_TYPE.equals(type)){
            String u1 = (String) args[0];
            userObject.setUserId(u1);
        }else {
            userObject = (UserObject) args[0];
        }
        return userObject;

    }




}
