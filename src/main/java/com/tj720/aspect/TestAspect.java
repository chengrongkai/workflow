package com.tj720.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/4 9:53
 */
@Aspect
@Component
public class TestAspect {

    @Pointcut("execution(* com.tj720.controller.TestController.saveUser(..))")
    private void point(){

    }


    private void after(JoinPoint joinPoint){
        Object[] args = joinPoint.getArgs();
        for (int i = 0; i < args.length; i++) {
            Object arg = args[i];
            System.out.println("参数："+arg);
        }
    }



}
