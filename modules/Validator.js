
define("Validator",[],function(){
	var Validtor = function(){
		this.phone = function(phone){
			return  /^1\d{10}$/.test(phone);
		};
		
		this.string = function(data){
			return 'string' == typeof data;
		};
		
		this.number = function(data){
			return !isNaN(data);
		};
		
		this.email = function(data){
			return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(data);
		};
		
		this.length = function(data,length){
			var datastr = data + "";
			return datastr.length == length;
		};
		
		this.min = function(data,min){
			if('string' == typeof data){
				data = parseFloat(data);
			}
			if(isNaN(data)){
				return false;
			}
			
			return data > min;
		};
		
		this.max = function(data,max){
			if('string' == typeof data){
				data = parseFloat(data);
			}
			if(isNaN(data)){
				return false;
			}
			
			return data < max;
		};
		
		this.presence = function(data){
			if(isNaN(data)){
				return ("" != !!data);
			}
			return true;
		};
		
		this.format = function(data,format){
			return format.test(data);
		};
		
		this.isFieldValid = function(data,field){
			var verifications = field.verifycation;
			var type = field.type;
			if(type && !this[type](data)){
				return false;
			}
			if(verifications){
				for(var verificationsItem in verifications){
					if(this[verificationsItem] && !this[verificationsItem](data,verifications[verificationsItem].standard)){
						return false;
					}
				}
			}
			return true;
		};
	}
	return Validtor;
});