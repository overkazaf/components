(function (window, $, undefined){
	$.fn.jnTab = function (config){
		return new JohnTab(config);
	};

	$.fn.jnTab.defaults = {

	}


	function JohnTab (config) {
		this.container = config.container || ".johnTab";
		//this.header = config.header || ".johnTabHeader"; 
		this.menu = config.menu || [];
		this.contentUrl = config.contentUrl || [];
		this.initTab();
	}
	JohnTab.prototype = {
		init : function (){
			var container = this._getContainer();
			container.empty();
			var oHeader = $("<div class='tab-header'></div>");
			var oBody = $("<div class='tab-body well'></div>");
			container.append(oHeader).append(oBody);;
		},
		initTab : function (){
			var _this = this;
			_this.init();
			_this._setHeaderContent();
			_this._bindEvent();
			var header = _this._getHeaderElem();
			header.find(".nav > li:eq(0)").trigger('click');
		},
		_getContainer : function (){
			return $(this.container);
		},
		_getHeaderElem : function (){
			var container = this._getContainer();
			return container.find('.tab-header');
		},
		_setHeaderContent : function (){
			var _this = this;
			var menu = this.menu,
				url = this.contentUrl;
			if (menu.length) {
				var oUl = $("<ul class='nav nav-tabs'></ul>");
				$.each(menu, function (index){
					$("<li><a>"+ menu[index] +"</a></li>").data("url", url[index]).appendTo(oUl);
				});
				oUl.appendTo(_this._getHeaderElem());
			}
		},
		_getBodyElem : function (){
			var container = this._getContainer();
			return container.find(".tab-body");
		}, 
		_setBodyContent : function (html){
			var tabBody = this._getBodyElem();
			tabBody.empty().html(html);
		},
		_getContent : function (url){
			return $.ajax({
				url : url
			});
		},
		_bindEvent : function (){
			var _this = this;
			var header = _this._getHeaderElem();
			var tabs = header.find(".nav > li");
			$.each(tabs, function (){
				$(this).on('click', function (){
					$(this).addClass('active').siblings().removeClass('active');
					var content = _this._getContent($(this).data("url"));
					content.done(function (res){
						_this._setBodyContent(res);	
					});
					
				});
			});
		}
	}
})(window, jQuery);