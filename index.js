define(["./modules/Validator","./modules/templateEngine","./modules/BaseModel","./modules/BaseForm","./modules/BaseCollector",
"./modules/BaseViewController","./modules/BaseController","./modules/Ajax"],
function(Validator,templateEngine,BaseModel,BaseForm,
BaseCollector,BaseViewController,BaseController){
	var quanMVC = {
		Validator : Validator,
		template : templateEngine.template,
		BaseModel : BaseModel,
		BaseForm : BaseForm,
		BaseCollector : BaseCollector,
		BaseViewController : BaseViewController,
		BaseController : BaseController,
		Ajax :  Ajax
	}

	return quanMVV;
})