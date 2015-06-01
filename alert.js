(function (window, $, undefined){
	function Alert (txt){
		return new _Alert().init(arguments[0]);
	}
	function _Alert (txt) {
		return {
			defaults : {
				width : "320px",
				height : "120px",
				theme : {

				}
			},
			initConfig : function (opts){
				this.op = $.extend({}, this.defaults, opts);
			},
			init : function (txt){
				var _this = this;
				this.op = this.defaults;
				_this.mask();
				_this.renderAlertBox(txt);
			},
			renderAlertBox : function (txt){
				var _this = this;
				if (!this.alertBox) {
					this.alertId = Math.round(Math.random() * 1000);
					this.alertBox = $("<div id='alert_"+this.alertId+"' class='alert-win'></div>").css({
						width : _this.op.width,
						"min-height" : _this.op.height
					});
					this.alertTitle = $("<div class='alert-title'><b>警告</b></div>");
					this.alertClose = $("<span class='alert-close'>x</span>");
					this.alertClose.appendTo(this.alertTitle);
					this.alertTitle.appendTo(_this.alertBox);
					if (!this.alertContent) {
						this.alertContent = $("<div class='alert-content'>"+txt+"</div>");
						this.alertContent.appendTo(_this.alertBox);
					}

					this.alertFooter = $("<div class='alert-footer'></div>");
					this.alertOK = $("<div class='alert-ok'>确定</div>");
					this.alertOK.appendTo(this.alertFooter);
					this.alertFooter.appendTo(_this.alertBox);

					this.alertBox.on('click', function (ev){
						var target = ev.target;
						var className = target.className;
						switch (className) {
							case "alert-ok" :
							case "alert-close" :
								_this.unmask();
								break;
							default : break;
						}
					});
					this.alertBox.appendTo(_this.maskElem);
				}
				this.alertContent.text(txt);
			},
			autoResize : function (){
				if (!this.resizeFlag) {
					this.resizeFlag = true;
					var _this = this;
					$(window).on('resize', function (){
						throttle(_this.maskElem , _this.adjust());
					});
				}
			},
			adjust : function (){
				this.maskElem.css({
					width : $(window).width(),
					height : $(window).height()
				});
			},
			mask : function (){
				if (!this.maskElem) {
					this.maskId = Math.round(Math.random() * 1000);
					this.maskElem = $("<div id='mask_"+this.maskId+"'></div>").addClass("mask").appendTo($('body'));
					this.adjust();
				}
				this.maskElem.fadeIn();
				this.autoResize();
			},
			unmask : function (){
				this.maskId && this.maskElem.fadeOut();
			}
		}
	}

	
	function throttle (obj, fn) {
		clearTimeout(obj.timer);
		obj.timer = setTimeout(function (){
			fn && fn();
		}, 200);
	}
})(window, jQuery);