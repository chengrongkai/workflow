package com.crk.controller;

import com.crk.config.ResponseEnum;
import com.crk.config.ResponseResult;
import com.crk.config.ThreeAdminInfo;
import com.crk.entity.system.User;
import com.crk.entity.utils.JsonResult;
import com.crk.service.LoginService;
import com.crk.service.UserService;
import com.crk.util.LoginType;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/5 10:31
 */
@RestController
@RequestMapping("login")
public class LoginController {

    @Autowired
    UserService userService;
    @Autowired
    LoginService loginService;

    @RequestMapping("toLogin")
    public ModelAndView toLogin(){
        ModelAndView modelAndView = new ModelAndView("login/login.html");
        modelAndView.addObject("title","登录页面");
        return modelAndView;
    }

    @RequestMapping("toRegister")
    public ModelAndView toRegister(){
        ModelAndView modelAndView = new ModelAndView("login/register.html");
        modelAndView.addObject("title","登录页面");
        return modelAndView;
    }

    @RequestMapping("toAdminLogin")
    public ModelAndView toAdminLogin(){
        ModelAndView modelAndView = new ModelAndView("login/adminLogin.html");
        modelAndView.addObject("title","管理员登录页面");
        return modelAndView;
    }
    @RequestMapping("toIndex")
    public ModelAndView toIndex(){
        ModelAndView modelAndView = new ModelAndView("workspace/index.html");
        modelAndView.addObject("title","首页");
        return modelAndView;
    }

    /**
     * 登录
     * @param loginName 登录名
     * @param pwd 密码
     * @return
     */
    @PostMapping("login")
    public ResponseResult login(@RequestParam String loginName,@RequestParam String pwd){
        if (StringUtils.isBlank(loginName)||StringUtils.isBlank(pwd)){
            return ResponseResult.fail(ResponseEnum.PARAM_ERROR);
        }
        return loginService.login(loginName,pwd);
    }
    /**
     * 用户注册
     * @param userName 用户名
     * @param phone 手机号
     * @param pwd 密码
     * @return
     */
    @PostMapping("register")
    public ResponseResult register(@RequestParam String userName,@RequestParam String phone,@RequestParam String pwd){
        if (StringUtils.isBlank(userName)||StringUtils.isBlank(pwd)||StringUtils.isBlank(phone)){
            return ResponseResult.fail(ResponseEnum.PARAM_ERROR);
        }
        return loginService.register(userName,phone,pwd);
    }





    @PostMapping("backLogin")
    public JsonResult backLogin(@RequestParam String userName,@RequestParam String password,@RequestParam String loginType){
        try {
            if (LoginType.ADMIN_LOGIN.equals(loginType)){
                if (ThreeAdminInfo.getSystemAdmin().getUserId().equals(userName)){
                    if (ThreeAdminInfo.getSystemAdmin().getPassword().equals(password)){
                        return new JsonResult(1,ThreeAdminInfo.getSystemAdmin());
                    }else{
                        return new JsonResult("140000003");
                    }
                }else if(ThreeAdminInfo.getAuditAdmin().getUserId().equals(userName)){
                    if (ThreeAdminInfo.getAuditAdmin().getPassword().equals(password)){
                        return new JsonResult(1,ThreeAdminInfo.getAuditAdmin());
                    }else{
                        return new JsonResult("140000003");
                    }
                }else if(ThreeAdminInfo.getSecurityAdmin().getUserId().equals(userName)){
                    if (ThreeAdminInfo.getSecurityAdmin().getPassword().equals(password)){
                        return new JsonResult(1,ThreeAdminInfo.getSecurityAdmin());
                    }else{
                        return new JsonResult("140000003");
                    }
                }else{
                    return new JsonResult("140000003");
                }
            }
            JsonResult userByNameOrPhone = userService.getUserByNameOrPhone(userName);
            if (userByNameOrPhone.getSuccess()==1){
                User user = (User) userByNameOrPhone.getData();
                if (password.equals(user.getPassword())){
                    return new JsonResult(1,user);
                }else {
                    return new JsonResult("140000003");
                }
            }else {
                return new JsonResult("140000003");
            }
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult("140000003");
        }

    }
}
