/**
 * 
 * @authors John Nong (overkazaf@gmail.com)
 * @date    2015-04-12 16:42:09
 * @version $Id$
 */

(function (window, $, undefined){
	window.jDropdown = jDropdown;
	function jDropdown(){
		return new _jDropdown().init(arguments[0]);
	}
	function _jDropdown() {
		return {
			init : function(opts) {
				var defaults = {
					container : '#testDiv',
					dropdownTitle : 'Testing Dropdown',
					dropdownData : {
						async : false,
						//dummy data
						items : [
							{
								title : 'Item 1',
								link : "",
								action : ''
							},{
								title : 'Item 2',
								link : "",
								action : ''
							},{
								title : 'Item 3',
								link : "",
								action : ''
							}
						]
					}
				};
				this.op = $.extend({},defaults, opts)
				this.buildDom();
			},
			buildDom : function (){
				var _this = this,
					op = _this.op,
					dropdownData = op['dropdownData'],
					dropdownItems = dropdownData['items'];
				var container = this.container = $(op.container);
				this.dropdownRndId = Math.round(Math.random() * 1000);
				this.dropdownId = '#jDropdown_' + this.dropdownRndId;
				this.dropdownElem = $('<div></div>').attr({
					id : _this.dropdownId,
					'class' : 'jDropdown_main'
				});
				if (dropdownItems.length > 0) {
					var oUl = $('<ul class="jDropdown_content"></ul>');
					var fragment = '<li><b>'+ op.dropdownTitle +'</b><span class="caret arrow-down"></span></li>';
					$.each(dropdownItems, function (){
						fragment += '<li>';
						fragment += '' + this['title'];
						fragment += '</li>';
					});
					oUl.html(fragment);
					this.dropdownContent = oUl;
				}

				this.render();
			},
			render : function (){
				var container = this.container;
				this.dropdownContent.appendTo(this.dropdownElem);
				this.dropdownElem.appendTo(container);

				var items = this.dropdownContentItems = this.dropdownContent.find('li');
				items.each(function (index){
					if (index){
						$(this).hide();
					}
				});
				this.bindEvents();
			},
			bindEvents : function (){
				var items = this.dropdownContentItems;
				items.each(function (index){
					$(this).on('click',function(){
						if (index === 0) {
							if ($(this).find('.caret').hasClass('arrow-down')) 
							{
								$(this).find('.caret').addClass('arrow-up').removeClass('arrow-down');
								$(this).siblings().fadeIn('slow');
							} else {
								$(this).find('.caret').addClass('arrow-down').removeClass('arrow-up');
								$(this).siblings().hide();
							}
							
						} else {
							var title = $(this).html();
							var fItem = items.eq(0);
							fItem.find('b').html(title);
							fItem.siblings().hide();
							fItem.find('.caret').addClass('arrow-down').removeClass('arrow-up');
						}
						return false;
					})
				});
			}
		}
	}
})(window, jQuery);