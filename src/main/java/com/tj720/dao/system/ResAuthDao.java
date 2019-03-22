package com.tj720.dao.system;

import com.tj720.entity.system.menu.ResAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/21 16:30
 */
public interface ResAuthDao extends JpaRepository<ResAuth,String>{

}
