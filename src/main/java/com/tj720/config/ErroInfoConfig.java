package com.tj720.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/22 11:04
 */
@Configuration
@ImportResource(locations = {"errorInfo.xml"})
public class ErroInfoConfig {
}
