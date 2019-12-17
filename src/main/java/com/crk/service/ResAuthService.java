package com.crk.service;

import com.crk.entity.system.menu.ResAuth;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 17:38
 */
@Service
public interface ResAuthService {
    /**
     * 保存资源权限
     * @param resAuth 资源权限
     * @return
     */
    ResAuth saveResAuth(ResAuth resAuth);

    /**
     * 批量保存
     * @param resAuthList
     * @return
     */
    boolean batchSaveResAuth(List<ResAuth> resAuthList);


}
