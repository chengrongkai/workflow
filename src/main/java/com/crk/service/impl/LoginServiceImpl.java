package com.crk.service.impl;

import com.crk.config.Constanst;
import com.crk.config.ResponseEnum;
import com.crk.config.ResponseResult;
import com.crk.dao.system.UserDao;
import com.crk.entity.system.User;
import com.crk.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;


/**
 * Description:
 *
 * @author: chengrongkai
 * Date: 2019-12-17
 * Time: 15:32
 */
@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    UserDao userDao;
    @Autowired
    HttpServletRequest request;


    /**
     * 登录
     * @param loginName 用户名
     * @param pwd 密码
     * @return
     */
    @Override
    public ResponseResult login(String loginName, String pwd) {
        User user = userDao.getUserByLoginNameAndPwd(loginName, pwd);
        if (user != null){
            saveUserLoginInfo(user);
            return ResponseResult.success();
        }else{
            return ResponseResult.fail(ResponseEnum.USERCHECK_ERROR);
        }
    }

    private void saveUserLoginInfo(User user){
        HttpSession session = request.getSession();
        session.setAttribute(Constanst.USER_SESSION_KEY,user);
    }

    /**
     * 用户注册
     *
     * @param userName 用户名
     * @param phone    手机号
     * @param pwd      密码
     * @return
     */
    @Override
    public ResponseResult register(String userName, String phone, String pwd) {
        User user = userDao.findUserByPhoneOrUserName(phone, userName);
        if (user != null){
            return ResponseResult.fail(ResponseEnum.USEREXIST_ERROR);
        }
        user = new User();
        user.setUserName(userName);
        user.setPassword(pwd);
        user.setPhone(phone);
        user.setCreateTime(new Date());
        User save = userDao.save(user);
        if (null != save){
            return ResponseResult.success();
        }else{
            return ResponseResult.fail(ResponseEnum.REGISTER_ERROR);
        }
    }
}
