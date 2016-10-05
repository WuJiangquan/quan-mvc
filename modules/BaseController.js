define(function(){
	return function(){
		this.test = "baseController";

		this.saveSession= function(name,val){
			window.sessionStorage[name] = val;
		}

		this.getSession = function(name){
			return window.sessionStorage[name] || "";
		}

		this.startNewWebpage = function(webPageHref){
			window.location.href = webPageHref;
		}
	}
});