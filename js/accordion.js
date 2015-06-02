(function (window){
	var oMenu = byId('menu');
	var aLi = byClass('menu-list-item', oMenu);
	for (var i=0,l=aLi.length; i<l; i++) {
		(function (c){
			var oH = byTag('h4',aLi[c])[0],
				oDiv = byTag('div',aLi[c])[0];
			oH.onclick = function (){
				oDiv.style.display = 'block';
				slideToggle(oDiv);
			};
		})(i);
	};

	function accordion () {
		return new _accordion.init(arguments);
	};

	function _accordion () {
		return {
			init : function (opt){
				var co = cloneObject(opt,false);
			}
		};
	}

	window.accodion = accordion;
})(window);