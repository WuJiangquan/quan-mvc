define('BaseModel',['./Validator'],function(Validtor){
	var BaseModel = function(){
		var me = this;
		var validtor = new Validtor();
		/*map local model to server model*/
		this.getPostMappingRecord = function(){
			var newRecord = {};
			var fields = me['fields'];
			for(var element in fileds){
				var mapping = fileds[element]['mapping'] || element;
				newRecord[mapping] = me[element];
			}
			return newRecord
		}
		
		//map server model to local model
		this.setMappingRecord = function(record){
			var fields = me['fields'];
			for(var el in fields){
				var mapping = fileds[element]['mapping'] || element;
				me[el] = record[mapping];
			}
		}
		
		this.save = function(callback){
			if(model.doSave && "function" == typeof model.doSave)
				model.doSave(callback);
		}
		
		this.resetRecrod = function(newRecrod){
			var fields = me['fields'];
			for(var el in fields){
				me[el] = newRecrod[el] || me[el];
			}
		}
		
		this.set = function(proName,val){			
			me[proName] = val;
		}
		
		this.validate = function(callback){
			var fields = me['fields'];
			for(element in fields){
				var data = me[element];
				var verification = fields[element].verification;
				if(verification){
					for(var validateItem in verification){
						if(validtor[validateItem] && !validtor[validateItem](data,verification[validateItem].standard)){
							callback(verification[validateItem].errmsg);
							return
						}
					}
					
				}
			}
			callback("");
		}
		
		this.initMappingFields = function(){
			var fields = me['fields'];
			for(var el in fields){
				if(!fields[el]['mapping']){
					fields[el]['mapping'] = el;
				}
			}
		}
	}
	
	return BaseModel;
});
