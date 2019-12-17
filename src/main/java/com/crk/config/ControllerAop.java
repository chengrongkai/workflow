package com.crk.config;

import java.lang.annotation.*;

@Target({ ElementType.PARAMETER, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
/**
 * 记录日志
 */
public @interface ControllerAop {
    String url() default "";

    /** 动作的名称 */
    String action() default "";

    String actionType();

    String result();
}
