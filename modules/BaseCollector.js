define('BaseCollector',[],function(){
	var BaseCollector = function(Model){
		var me = this;
		
		//all items had laoded.Not a single page;
		this.items = [];
		this.pageSize = 15;
		
		this.hasLoadMore = true;
		this.currentPageNumber = 1;
		
		//Is load in page? Or change it in children Class;
		this.isInPage = false;
		
		this.setPageSize = function(pageSize){
			this.getPageSize = pageSize;
		}
		
		this.isHasLoadMore = function(){
			return this.hasLoadMore;
		}
		
		this.resetHasLoadMore = function(hasLoadMore){
			this.hasLoadMore = hasLoadMore;
		}
		
		this.getItems = function(){
			return this.items;
		}
		
		
		this.clear = function(){
			this.hasLoadMore = true;
			this.currentPageNumber = 1;
			this.items = [];
		}
		
		this.mappingItems = function(items){
			var newItems = new Array();
			for(var i = 0,len = items.length;i<len;i++){
				var item = new Model();
				item.setMappingRecord(items[i]);
				newItems.push(item)
			}
			
			return newItems;
		}
		
		this.loadMoreItems = function(parameter,callBack){
			if(me.hasLoadMore){
				this.doLoadMore(parameter,function(error,datas,hasNext,count,totalPageLength){
					if(error && callBack){
						callBack(error,null);
					}
					if(datas && datas.length>0){
						me.addItems(me.mappingItems(datas));
					}
					me.hasLoadMore = hasNext;
					me.totalPageLength = totalPageLength;
					if(callBack && "function" == typeof callBack){
						if(me.inpage)
							callBack(null,me.getLastPage());
						else
							callBack(null,me.getItems());
					}
				})
			}
		}
		
		this.loadAllItems = function(callBack){
			this.doLoadAllItems(function(err,datas){
				if(error && callBack){
					callBack(error,null);
				}
				if(datas && datas.length>0 && callBack && "function" == typeof callBack){
					var mappingDatas = me.mappingItems(datas);
					callBack(null,mappingDatas);
				}
			})
		}
		
		this.reLoadMoreItems = function(parameter,callBack){
			this.clear();
			this.loadMoreItems(parameter, callBack);
		}
		
		
		this.addItems = function(items){
			this.items = this.items.concat(items);
		}
		
		this.loadIndexPage = function(index,parameter,callBack){
			this.items = [];
			me.currentPageNumber = index;
			this.loadMoreItems(parameter, callBack);
		}
		
		this.loadFirstPage = function(parameter,callBack){
			me.loadIndexPage(1,parameter,callBack);
		}
		
		this.loadNextPage = function(parameter,callBack){
			if(me.hasLoadMore){
				me.loadIndexPage(me.currentPageNumber + 1,parameter,callBack);
			}
		}
		
		this.loadPrevPage  = function(parameter,callBack){
			var currentPageNumber = me.currentPageNumber;
			if(currentPageNumber>1){
				me.loadIndexPage(currentPageNumber-1,parameter,callBack);
			}
		}
		
		this.loadLastPage = function(parameter,callBack){
			me.loadIndexPage(me.totalPageLength,parameter,callBack);
		}
	}
	
	return BaseCollector;
});
