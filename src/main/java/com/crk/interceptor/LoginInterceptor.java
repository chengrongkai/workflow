package com.crk.interceptor;

import com.crk.config.Constanst;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Description:
 * 登录拦截
 * @author: chengrongkai
 * Date: 2019-12-17
 * Time: 16:06
 */
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        Object user = session.getAttribute(Constanst.USER_SESSION_KEY);
        //用户未登录
        if (user == null){
            response.sendRedirect("/login/toLogin");
            return false;
        }else{
            //TODO:增加redis的校验
            return true;
        }
    }
}
