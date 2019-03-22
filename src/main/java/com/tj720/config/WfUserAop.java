package com.tj720.config;

import java.lang.annotation.*;

@Target({ ElementType.PARAMETER,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
/**
 * 流程用户切面注解
 */
public @interface WfUserAop {
    /**
     * 用户ID
     * @return
     */
    String userId() default "";

    /**
     * 密码
     * @return
     */
    String password() default "";

    /**
     * 用户名
     * @return
     */
    String userName() default "";

    /**
     * 操作类型
     * @return
     */
    String actionType() default "";




}
