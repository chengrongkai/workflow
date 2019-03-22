package com.tj720.controller;

import com.tj720.config.ThreeAdminInfo;
import com.tj720.entity.system.User;
import com.tj720.entity.utils.JsonResult;
import com.tj720.service.UserService;
import com.tj720.util.LoginType;
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

    @RequestMapping("toLogin")
    public ModelAndView toLogin(){
        ModelAndView modelAndView = new ModelAndView("login.html");
        modelAndView.addObject("title","登录页面");
        return modelAndView;
    }
    @RequestMapping("toAdminLogin")
    public ModelAndView toAdminLogin(){
        ModelAndView modelAndView = new ModelAndView("adminLogin.html");
        modelAndView.addObject("title","管理员登录页面");
        return modelAndView;
    }
    @RequestMapping("toIndex")
    public ModelAndView toIndex(){
        ModelAndView modelAndView = new ModelAndView("index.html");
        modelAndView.addObject("title","首页");
        return modelAndView;
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
