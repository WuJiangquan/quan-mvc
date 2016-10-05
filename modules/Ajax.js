define("Ajax",[],function(){
	var Ajax = function(){
		var me = this;
		var request ;
		
		
		this.createHttpRequestObject = function(){
			
			if(window.XMLHttpRequest){
				return new XMLHttpRequest();
			}else if(window.ActiveXObject){
				try{
					return new ActiveXObject("Msxm12.XMLHTTP");
				}catch(e){
					try{
						return new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch(e){
						
					}
				}
			}
			return null;
		};
		
		this.getrequest = function(){
			if(!request){
				request = this.createHttpRequestObject();;
			}
			return  request;
		} 
		
		
		
		this.processRespone = function(callBack){
			if(me.request.readyState == 4){
				if(me.request.status == 200){
					var response = me.request.responseText;
					if('string' == typeof response){
						response = JSON.parse(response);
					}
					callBack(response);
				}
			}
		};
		
		this.parseParmeter = function(obj){//子元素是对象的情况尚未考虑
			var newParameter = '';
			for(var element in obj){
				//obj[element] = obj[element].replace(/\+/g, "%2B");
				//obj[element] = obj[element].replace(/&/g,"%26");
				//obj[element] = escape(obj[element]);
				obj[element] = encodeURIComponent(obj[element]);
				newParameter += element+'=' + obj[element]+'&';
			};
			return newParameter.substring(0,newParameter.length - 1);	
		};
		
		this.post = function(url,parameter,callback){
			var request = this.getrequest();
			var parameterStr = this.parseParmeter(parameter);
			request.onreadystatechange = function(respone){
				me.processRespone(callback);
			};
			request.open("POST",url,true);
			request.setHeader('Charset',"utf-8");
			request.setHeader('Accept',"application/json");
			request.setHeader('Content-Type',"application/x-www-form-urlencoded;application/json;utf-8");
			request.send(parameterStr);
		};

		this.setHeader = function(name,value){
			var request = this.getrequest();
			request.setRequestHeader(name,value);
		}
		
		this.get = function(url,callback,parameter){
			var request = this.getrequest();
			var parameterStr = parameter?this.parseParmeter(parameter):"";
			request.onreadystatechange = function(respone){
				me.processRespone(callback);
			};
			if("" == parameterStr){
				request.open("GET",url,true);
			}else{
				request.open("GET",url+"?"+parameterStr,true);
			}
			request.send(null);
		};

	}

	return Ajax;
})
