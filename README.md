# quan-mvc
a front end mvc framework base on [webpack](http://webpack.github.io/docs/amd.html)

## 下载
  `npm install quan-mvc --save-dev`

## 导入
  `define("quan-mvc",function(quanMvc){})`
  
## 功能
### validator
    validator提供了检验字符串，数字，手机号码，邮箱，字符串长度，最大数值，最小数值，是否为空，和正则表达式校验接口，
    其中校验字符串、数字、手机号码、邮箱，是否为空接口参数只需要传入被校验数值。而字符串长度、最数值、最小数值，第二个
    参数都要传入一个参考数值，而正则表达式第二个参数需要传入正则表达式；在定义model的字段的时候如果需要定义以上四个校
    验规则，则需要指定一个standard,model对象在提交前会根据你所定义的规则去执行校验。比如：
    CategoryModel.fields = {
        name : {
          type : "string",
          verifycation:{
                length : {
                    standard : 15,
                    errmsg : "名字的长度必须是15位"
                }
          }
        },
        phone : {
          type : number,
          verifycation : {
              phone : {
                errmsg : "手机号码必须是长度为11位，以1开头的数字"
              }
          }
        }
    }
    
    validator还提供了一个只对单一字段进行校验的接口isFieldValid(data,field)。
    参数data:待校验的数值，参数field一个指定校验规则的字面量对象，比如上面例子中的 name 和 phone。 
    返回值是布尔值，符合定义返回true，否则返回false。
    
### model
    model层的作用是用来定义前端的数据表，他提供的功能包括：
    1.mapping。
      mapping的功能是上传的时候将mapping指定的字段名转换成你本来定义的字段名提供给前端使用，上传数据的时候，
      再将你自己的字段名转换成mapping指定的字段名。这样做的作用时，当我开发前端模块的时候，后台还没提供相应的接口，如果以后后台
      提供的接口名与我定义的字段名不一致，那么我就需要在使用这个表的页面进行查询修改。虽然可以全局查询所有该字段然后修改，但是在
      我看来还是很繁琐的工作。如果有了这个mapping的功能，我就只需要在我定义的字段设置一个mapping值，这个值跟后台提供的接口字段名
      一致，这样在上传下载数据的时候由model自动根据mapping进行转换，那就不用担心这个问题了。这样前端和后台就可以完全放心地并行开发。
      如果定义数据表字段的时候不设置这个mapping值，那么在这个表对象初始化的时候，我就会把缺省的mapping值设置成跟字段名一样。所以如果
      前端定义的表字段跟后台接口字段一致，就无需设置mapping 值。使用例子如下：
       CategoryModel.fields = {
        id : {
          type : "number",
          mapping : "pk"
        }
       }
    2. 校验功能。
        BaseModel提供了一个接口validate(callback)，子类在写数据接口的时候，只需要调用这个方法就可以自动根据我设置数据表时定义的检验规则
        进行校验。
        参数callback是一个回调函数，如果校验失败，callback会得到一个errmsg的参数，errmsg就是这么多字段中，第一个校验失败字段的提示值。
    3. set 接口，用来修改根据model生成的一条record 的字段值。这个接口有两个参数，第一个参数是字段名称，第二个参数是字段值。
    4. resetRecord,相当于复制一个record的值。参数是一个被复制的record.
    5.save接口，调用需要子类重写的dosave方法去提交数据表，如果不重写doSave方法，将不会进行任何的操作。
    
    例子：
    define("CategoryModel",["quan-mvc"],function(quanMVC){
      var CategoryModel = function(){
        quanMVC.BaseModel.call(this);
        this.fields = {
        name : {
          type : "string",
          verifycation:{
                length : {
                    standard : 15,
                    errmsg : "名字的长度必须是15位"
                }
          }
        },
        phone : {
          type : number,
          verifycation : {
              phone : {
                errmsg : "手机号码必须是长度为11位，以1开头的数字"
              }
          }
        }
        
        this.doSave = function(callback){
          
        }
      }
    })
### form 
    BaseForm类是继承BaseModel的子类。不同之处在于：
    1. 字段定义时需要指定selector属性，这个属性必须是一个css的id选择器，在表单提交时，我会自动根据设置的id选择器去
       获取表单的值。
    2. BaseForm的子类必须设置重写成员变量action和method,如果子类action 字段缺省，则提交时无法知道该提交到什么地方。
       如果子类的method成员属性值缺省，则默认为post方法提交。调用这个类对象时可以通过成员方法setAction,setMethod对
       action和method重新赋值。
    3. submit方法，用来提交表单。参数是一个回调函数，如果发生错误，回调函数的第一个参数值errmsg会有相应的错误原因，否
       则这个参数值为空。第二个参数 result会赋返回值。

### template 参考：  [front-end-template-engine](https://github.com/WuJiangquan/front-end-template-engine)
     template是一个方法，用来解析模版，用法跟underscore的template完全一致。源代码就是从underscore偷过来的。具体的使用请
     查看我的另一个工程 front-end-template-engine
     
### collector
     collector类似于ext的store，用来在内存存储数据的。它提供了如下接口：
     1. loadMoreItems，调用子类重写的doLoadMore去加载数据，数据加载成功之后会根据设置的Model封装成很多个items，并且对每条
        数据做mapping处理。
        参数是一个回调函数，如果这个collector设置了分页，则回调函数会获得最后一页的数据，否则会获得所有数据。
     2. reLoadMoreItems,清空之前的所有items 然后重新调用loadMoreItems去加载数据。参数与loadMoreItems一致。
     3. clear 清空collector的所有items。无参数，无返回值
     4. 设置分页，在子类重写isInPage成员属性，值为true就是分页。分页可以调用loadFirstPage、loadNextPageloadPrevPage、
        loadLastPage、loadIndexPage加载响应的页面的数据。
### ajax
    ajax提供了get、post方法。参数与jquery的ajax 一致。
    另外可以使用setHeader 方法对http头部进行设置。需要两个参数，第一个是name,设置的头部域名称，第二个参数value，头部的域值
## 说明
   这个项目是基于webpack进行模块化开发的，构建项目时，可以使用gulp和webpack搭配。具体的例子可以参考 [webpack-gulp-example](https://github.com/WuJiangquan/webpack-gulp-example)
        
