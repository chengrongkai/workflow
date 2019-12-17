package com.crk.config;

import java.lang.annotation.*;

@Target({ ElementType.PARAMETER, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
/**
 * 流程认证切面
 */
public @interface WfIdentityAop {

}
