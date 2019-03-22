package com.tj720.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/20 9:53
 */
@Component
@PropertySource(value = {"config/test.properties"})
public class TestProperties {
    @Value("${test.aa}")
    private String aa;
    @Value("${test.bb}")
    private String bb;

    public String getAa() {
        return aa;
    }

    public void setAa(String aa) {
        this.aa = aa;
    }

    public String getBb() {
        return bb;
    }

    public void setBb(String bb) {
        this.bb = bb;
    }
}
