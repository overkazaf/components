;(function($, undefined){
	var log = function(s){
		window.console && window.console.log(s);
	};

	$.fn.powerpoint = function(options, data){
		var pptList = [],
			options = $.extend({}, $.fn.powerpoint.defaults, options || {}),
			ctx = $(options.context) || $('#' + options.context),
			container = ctx.find(options.container);

		return $(this).each(function(){
			var Powerpoint = {
				_timer_ : null,
				page : 1,
				init : function(){
					// Small buttons at the bottom
					this.smallButtons = options.hasSmallButton && ctx.find(options.smallButton.context).find(options.smallButton.className);
					// Small buttons that can quickly position small btns, only for dom querying
					this.smallButtonContext = this.smallButtons ? ctx.find(options.smallButton.context).find(options.smallButton.context) : null;

					// Total counts that need to scroll
					this.total = this.smallButtons ? this.smallButtons.length : 0;

					// Main list that wrapped all the scroll items
					this.list = container.find('ul');

					// Items that will be displayed
					this.listItem = this.list ? this.list.children('li') : null;
					this.setup();

					if(options.autoResize){
						this.autoResize();
					}


					this.bindEvents();
					options.autoPlayFlag && this.autoPlay();
				},
				setup : function(){
					if(this.list){
						this.listItem.each(function (i, icont){
							if(options.effects === 'fade'){
								$(this).css({
									position:'absolute',
									left : 0,
									top : 0,
									'z-index' : i
								}).attr('data-index', i).hide();
							}
						});
						this.listItem.first().show();
					}
					if(options.hasSmallButton){
						this.smallButtons.each(function(j, jcont){
							$(this).attr('data-index', j);
						});
					}
				},
				autoResize : function (){

				},
				bindEvents : function (){
					if(options.hasSmallButton){
						log(this.smallButtonContext);
						this.smallButtonContext.on('click', options.smallButton.className, function (){
							alert($(this).attr('data-index'));
						});
						
					}
				},
				autoPlay : function (){
					var _this_ = this;
					_this_._timer_ = setInterval(function (){
						_this_.page = ((_this_.page + 1) % _this_.total) + 1;
						_this_.refresh();
					}, options.interval);
				},
				refresh : function (){

				}

			};

			Powerpoint.init();
		});
	};

	$.fn.powerpoint.defaults = {
		context     	: '#contextId', // The whole plugin container id
		container : '.ppt-slider', // 
		autoResize      : 1, // calculate the width / height dynamically
		direction       : 'horizental',
		effects         : 'fade',  // fade / move effects are provided
		hasShortcut     : 1,
		type : 'normal', // normal / shortcut
		info : {
			type : 'shortcut',
			data : {
				direction : 'horizental', // or vertical
				count : 3, // shortcut counts
				container: ".ppt-shortcut"
			}
		},
		hasSmallButton  : 1,
		smallButton     : {
			className   : '.page-btn',
			container   : '.page-btn-list',
			context     : '.powerpoint-footer'
		},
		autoPlayFlag	: 1,
		switchSpeed 	: 1000,
		interval        : 3000,
		hasTitle        : 1,
        titleClass      : 'titleClass',
        titleArray      : []
	};
})(jQuery)