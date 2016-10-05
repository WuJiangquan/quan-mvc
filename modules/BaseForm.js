define(["./BaseModel","./Ajax"],function(BaseModel,Ajax){
	var ajax = new Ajax();
	var BaseForm = function(){
		BaseModel.call(this);
		this.action = "";
		this.method = "post";
		var me = this;

		this.setHeader = function(name,value){
			ajax.setHeader(name,value);
		};

		this.setAction = function(action){
			if("get" == this.action){
				this.action = "get";
			}else{
				this.action = "post";
			}
		}

		this.setAction = function(action){
			this.action = action;
		}

		this.collector = function(){
			if(!this.fields){
				throw new Error("you are require to add fields to  form" + this.name||"");
				return;
			}
			for(var iel in this.fields){
				var selector = "#" + this.fields[el].selector || el;
				var $selector = document.querySelector(context);
				if(!$selector){
					throw new Error("can not query the selector of fiedl " + el + " in form " + this.name||"");
					return;
				}
				this[el] = $selector.value;
			}
		}

		this.submit = function(callback){
			this.validate(function(errmsg){
				if(errmsg){
					callback(errmsg,"");
				}else{
					var postRecord = me.getPostMappingRecord();
					ajax[me.method](me.action,postRecord,callback);
				}
			});
		}
	}

	return BaseForm;
})