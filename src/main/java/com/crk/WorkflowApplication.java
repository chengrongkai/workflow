package com.crk;

import org.activiti.spring.boot.SecurityAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
/**
 * @Author: 程荣凯
 * @Date: 2019/2/27 14:47
 * 启动类
 */
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class WorkflowApplication {

	public static void main(String[] args) {
		SpringApplication.run(WorkflowApplication.class, args);
	}

}
