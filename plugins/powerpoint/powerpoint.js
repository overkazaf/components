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
				currentIndex : 0,
				init : function(){
					// Small buttons at the bottom
					this.smallButtons = options.hasSmallButton && ctx.find(options.smallButton.context).find(options.smallButton.className);
					// Small buttons that can quickly position small btns, only for dom querying
					this.smallButtonContext = this.smallButtons ? ctx.find(options.smallButton.context) : null;

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
						this.currentIndex = 0;
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
					var _this_ = this;
					if(options.hasSmallButton){
						this.smallButtonContext.on('click', options.smallButton.className, function (){
							var index = $(this).attr('data-index');

							_this_.currentIndex = index;
							_this_.smallButtons.removeClass('active');
							$(this).addClass('active');
							_this_.listItem.fadeOut('slow');
							_this_.listItem.eq(index).fadeIn('slow');
						});
					}

					// ctx.on('mouseover', function (){
					// 	_this_.listItem.eq(_this_.currentIndex).children(options.titleClass).animate({
					// 		bottom : 0
					// 	}, 500);
					// }).on('mouseout', function(){
					// 	_this_.listItem.eq(_this_.currentIndex).children(options.titleClass).animate({
					// 		bottom : '-40px'
					// 	}, 500);
					// });
				},
				autoPlay : function (){
					var _this_ = this;
					var fnAuto = function (){
						_this_._timer_ = setInterval(function (){
							++_this_.currentIndex;
							_this_.currentIndex %= _this_.total;
							_this_.refresh();
						}, options.interval);
					};
					fnAuto();

					_this_.smallButtonContext.on('mouseover',function (){
						_this_.stop();
					}).on('mouseout', function (){
						fnAuto();
					});
				},
				next : function (){
					++this.currentIndex;
					this.currentIndex %= this.total;
				},
				stop : function (){
					clearInterval(this._timer_);
					this._timer_ = null;
				},
				refresh : function (){
					this.smallButtons.eq(this.currentIndex).trigger('click');
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
        titleClass      : '.powerpoint-title',
        titleArray      : []
	};
})(jQuery)