package com.tj720.controller.system;

import com.tj720.entity.system.menu.Function;
import com.tj720.entity.utils.JsonResult;
import com.tj720.entity.utils.LayUiTableJson;
import com.tj720.service.FunctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @Author: 程荣凯
 * @Date: 2019/3/22 14:32
 */
@RestController
@RequestMapping("Function")
public class FunctionController {
    @Autowired
    FunctionService functionService;

    /**
     * 添加功能
     * @param sysFunction 功能
     * @return
     */
//    @ControllerAop(action = "添加功能")
    @RequestMapping("/saveFunction")
    public JsonResult addFunction(Function sysFunction){
        try {
            Function function = functionService.saveFunction(sysFunction);
            return new JsonResult(1,function);
        }catch (Exception e){
            return new JsonResult("000001");
        }
    }

    /**
     * 删除功能
     * @param functionId 功能ID
     * @return
     */
//    @ControllerAop(action = "删除功能")
    @RequestMapping("/deleteFunction")
    public JsonResult deleteFunction(@RequestParam String functionId){
        try {
            functionService.deleteFunction(functionId);
            return new JsonResult(1);
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult("000001");
        }
    }

    /**
     * 查询功能列表
     * @param type 功能类型
     * @return
     */
//    @ControllerAop(action = "查询功能列表")
    @RequestMapping("/queryFunctionList")
    public LayUiTableJson queryFunctionList(String functionName,String type){
        try{
            List<Function> functions = functionService.queryFunctionByFunctionNameAndType(functionName, type);
            return new LayUiTableJson(0,"查询成功",functions.size(),functions);
        }catch (Exception e){
            e.printStackTrace();
            return new LayUiTableJson(1,"查询失败",0,null);
        }
    }

    /**
     * 查询功能列表
     * @param type
     * @param functionName
     * @return
     */
//    @ControllerAop(action = "查询功能列表")
    @RequestMapping("/queryFunctionListTree")
    public LayUiTableJson queryFunctionListTree(String type,String functionName){
        try {
            List<Function> functions = functionService.queryFunctionByFunctionNameAndType(functionName, type);
            List<HashMap> data = new ArrayList<HashMap>();
            for (Function function : functions) {
                HashMap map = new HashMap();
                map.put("id",function.getFunctionId());
                map.put("name",function.getFunctionName());
                map.put("pId",function.getParentId());
                map.put("open",null);
                map.put("chkDisabled","false");
                data.add(map);
            }
            return new LayUiTableJson(0,null,data.size(),data);
        }catch (Exception e){
            e.printStackTrace();
            return new LayUiTableJson(1,"查询失败",0,null);
        }


    }
//    @ControllerAop(action = "根据id查询功能")
    @RequestMapping("/queryFunctionById")
    public JsonResult queryFunctionById(@RequestParam String functionId){
        try {
            Function functionById = functionService.getFunctionById(functionId);
            return new JsonResult(1,functionById);
        }catch (Exception e){
            e.printStackTrace();
            return new JsonResult("000001");
        }


    }
}
