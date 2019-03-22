package com.tj720.service;

import com.tj720.entity.utils.RedisUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/7 17:13
 */
@Service
public interface CacheService {
    /**
     * 设置字符串类型的数据
     * @param key
     * @param value
     */
    void setStr(String key,String value);

    /**
     * 查询字符串类型的数据
     * @param key
     * @return
     */
    String getStr(String key);

    /**
     * 设置字符串类型的数据,并设置超时时间
     * @param key
     * @param value
     * @param expire
     */
    void setStrExpire(String key,String value,int expire);

    /**
     * 添加zset
     * @param key
     * @param value
     */
    void addSortSet(String key, String value);

    /**
     * 获取倒序的SortSet型的数据
     * @param key
     * @return
     */
    Set<String> getDescSortSet(String key);

    /**
     * 删除SortSet型数据
     * @param key
     * @param value
     */
    void deleteSortSet(String key, String value);

    /**
     * 批量删除SortSet型数据
     * @param key
     * @param value
     */
    void deleteSortSetBatch(String key, String[] value);

    /**
     * 范围获取倒序的SortSet型的数据
     * @param key
     * @return
     */
     Set<String> getDescSortSetPage(String key, int start, int end);

    /**
     * 获取SortSet型的总数量
     * @param key
     * @return
     */
     long getSortSetAllCount(String key);

    /**
     * 检查KEY是否存在
     * @param key
     * @return
     */
     boolean checkExistsKey(String key);

    /**
     * 重命名KEY
     * @param oldKey
     * @param newKey
     * @return
     */
     String renameKey(String oldKey, String newKey);

    /**
     * 删除KEY
     * @param key
     */
     void deleteKey(String key);

    /**
     * 设置失效时间
     * @param key
     * @param seconds 失效时间，秒
     */
     void setExpireTime(String key, int seconds);

    /**
     * 删除失效时间
     * @param key
     */
     void deleteExpireTime(String key);
}
