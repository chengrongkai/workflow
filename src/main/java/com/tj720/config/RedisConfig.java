package com.tj720.config;

import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/8 9:28
 */
@Component
//@ConfigurationProperties(prefix = "com.tj720")
public class RedisConfig {
    @Value("${redis.host}")
    private  String host;
    @Value("${redis.port}")
    private  String port;
    @Value("${redis.pass}")
    private  String pass;
    @Value("${redis.timeout}")
    private  String timeout;
    @Value("${redis.maxIdle}")
    private  String maxIdle;
    @Value("${redis.maxTotal}")
    private  String maxTotal;
    @Value("${redis.maxWaitMillis}")
    private  String maxWaitMillis;
    @Value("${redis.testOnBorrow}")
    private  String testOnBorrow;

    public String getHost() {
        return host;
    }

    public String getPort() {
        return port;
    }

    public String getPass() {
        return pass;
    }

    public String getTimeout() {
        return timeout;
    }

    public String getMaxIdle() {
        return maxIdle;
    }

    public String getMaxTotal() {
        return maxTotal;
    }

    public String getMaxWaitMillis() {
        return maxWaitMillis;
    }

    public String getTestOnBorrow() {
        return testOnBorrow;
    }


}
