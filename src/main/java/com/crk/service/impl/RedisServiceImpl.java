package com.crk.service.impl;

import com.crk.entity.utils.RedisUtil;
import com.crk.service.CacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/7 17:13
 */
@Service
public class RedisServiceImpl implements CacheService{

    @Autowired
    RedisUtil redisUtil;

    /**
     * 设置字符串类型的数据
     *
     * @param key
     * @param value
     */
    @Override
    public void setStr(String key, String value) {
        redisUtil.add(key,value);
    }

    /**
     * 查询字符串类型的数据
     *
     * @param key
     * @return
     */
    @Override
    public String getStr(String key) {
        String s = redisUtil.get(key);
        return s;
    }

    /**
     * 设置字符串类型的数据,并设置超时时间
     *
     * @param key
     * @param value
     * @param expire
     */
    @Override
    public void setStrExpire(String key, String value, int expire) {
        redisUtil.add(key,value,expire);
    }

    /**
     * 添加SortSet型数据
     * @param key
     * @param value
     */
    @Override
    public void addSortSet(String key, String value) {
        int score = LocalDateTime.now().getSecond();
        redisUtil.zadd(key, value, score);
    }

    /**
     * 获取倒序的SortSet型的数据
     * @param key
     * @return
     */
    @Override
    public Set<String> getDescSortSet(String key) {
        return redisUtil.zrevrange(key, 0, -1);
    }

    /**
     * 删除SortSet型数据
     * @param key
     * @param value
     */
    @Override
    public void deleteSortSet(String key, String value) {
        redisUtil.zrem(key, value);
    }

    /**
     * 批量删除SortSet型数据
     * @param key
     * @param value
     */
    @Override
    public void deleteSortSetBatch(String key, String[] value) {
        redisUtil.zrem(key, value);
    }

    /**
     * 范围获取倒序的SortSet型的数据
     * @param key
     * @return
     */
    @Override
    public Set<String> getDescSortSetPage(String key, int start, int end) {
        return redisUtil.zrevrange(key, start, end);
    }

    /**
     * 获取SortSet型的总数量
     * @param key
     * @return
     */
    @Override
    public long getSortSetAllCount(String key) {
        return redisUtil.zcard(key);
    }

    /**
     * 检查KEY是否存在
     * @param key
     * @return
     */
    @Override
    public boolean checkExistsKey(String key) {
        return redisUtil.exists(key);
    }

    /**
     * 重命名KEY
     * @param oldKey
     * @param newKey
     * @return
     */
    @Override
    public String renameKey(String oldKey, String newKey) {
        return redisUtil.rename(oldKey, newKey);
    }

    /**
     * 删除KEY
     * @param key
     */
    @Override
    public void deleteKey(String key) {
        redisUtil.del(key);
    }

    /**
     * 设置失效时间
     * @param key
     * @param seconds 失效时间，秒
     */
    @Override
    public void setExpireTime(String key, int seconds) {
        redisUtil.expire(key, seconds);
    }

    /**
     * 删除失效时间
     * @param key
     */
    @Override
    public void deleteExpireTime(String key) {
        redisUtil.persist(key);
    }

}
