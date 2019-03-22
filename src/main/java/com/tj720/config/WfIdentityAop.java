package com.tj720.config;

import org.activiti.engine.identity.User;

import java.lang.annotation.*;

@Target({ ElementType.PARAMETER, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface WfIdentityAop {

}
