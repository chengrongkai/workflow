package com.tj720.entity.utils;


import java.io.Serializable;


public class JsonResult implements Serializable {
	private static final long serialVersionUID = 7553249056983455065L;
	private Page page;
	private Integer success;
	private Object data;
	private  ErrorMessage error;
	private String errorCode;

	private Integer code;
	private String msg;
	private Integer count;

	public JsonResult(Integer success,Object data,String errorCode){
		this.data = data;
		this.success = success;
		this.errorCode = errorCode;
		if(success == 0){
			String errorMsg =  ErrorInfos.getMessage(errorCode);
			this.error = new ErrorMessage(errorCode,errorMsg);
		}
	}
	public JsonResult(Integer success,Object data,Page page){
		this.data = data;
		this.success = success;
		this.page = page;
	}
	public JsonResult(Integer success,Object data){
		this.data = data;
		this.success = success;
	}
	public JsonResult(Integer success){
		this.success = success;
	}
	
	public JsonResult(MyException exception){
		this.data = null;
		this.success = 0;
		String errorCode = exception.getMessage();
		String errorMsg =  ErrorInfos.getMessage(errorCode);
		this.setError( new ErrorMessage(errorCode,errorMsg+(exception.getMsgExtention()==null?"":exception.getMsgExtention())));
	}


	public JsonResult(){
		this.success= 1;
		this.data= null;
	}


	public JsonResult(String errorCode){
		this.data = null;
		this.success = 0;
		String errorMsg =  ErrorInfos.getMessage(errorCode);
		this.setError( new ErrorMessage(errorCode,errorMsg) );
	}
	
	
	public Integer getSuccess() {
		return success;
	}

	public void setSuccess(Integer success) {
		this.success = success;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public ErrorMessage getError() {
		return error;
	}

	public void setError(ErrorMessage error) {
		this.error = error;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public Page getPage() {
		return page;
	}

	public void setPage(Page page) {
		this.page = page;
	}

	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}
}

class ErrorMessage{
	private String code;
	private String message;
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	public ErrorMessage(String code,String message){
		this.setCode(code);
		this.setMessage(message);
	}
}
