package com.crk.util;


import com.crk.service.GlobalInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/20 15:42
 * 一键填充创建人、创建时间、修改人、修改时间
 */
@Component
public class TimeAuto {
    @Autowired
    GlobalInfoService globalInfoService;
    /**
     * 设置当前时间
     * @param t
     * @param fileName
     */
     public void autoSetNowInfo(Object t,String... fileName){
        LocalDateTime localDateTime = LocalDateTime.now();
        Date date = Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
        autoSetInfo(t,date,fileName);
    }

    /**
     * 设置当前用户
     * @param t
     * @param fileName
     */
    public void autoSetCurrentUserInfo(Object t,String... fileName){
        String userId = globalInfoService.getUserId();
        autoSetInfo(t,userId,fileName);
    }


    private void autoSetInfo(Object t,Object value,String... fileName){
        Class c = t.getClass();
        // 获取该对象的propertvName成员变量
        try {
            for (int i = 0; i < fileName.length; i++) {
                String propertyName = fileName[i];
                Field f = c.getDeclaredField(propertyName);
                // 取消访问检查
                f.setAccessible(true);
                // 给对象的成员变量赋值为指定的值
                f.set(t, value);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
