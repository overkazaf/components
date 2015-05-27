/**
 * 
 */
function byId(id){
	return id instanceof Object ? id : document.getElementById(id);
}

function byClass(sClass, oParent){
	oParent = oParent || document;
    var aResult=[];
    var aEle=oParent.getElementsByTagName('*');

    var re=new RegExp("\\b" + sClass + "\\b","g");
    for(var i=0, l=aEle.length; i<l; i++){
        if(aEle[i].className.search(re) != -1){
            aResult.push(aEle[i]);
        }
    }
    return aResult;
}

function byTag (tagName, oParent){
	oParent = oParent || document;
	return oParent.getElementsByTagName(tagName);
}

function isArray(elems){
	return Object.prototype.toString.call(elems) === '[object Array]';
}

function isArrayLike (o) {
	if (o &&                                // o is not null, undefined, etc.
        typeof o === 'object' &&            // o is an object
        isFinite(o.length) &&               // o.length is a finite number
        o.length >= 0 &&                    // o.length is non-negative
        o.length===Math.floor(o.length) &&  // o.length is an integer
        o.length < 4294967296)              // o.length < 2^32
        return true;                        // Then o is array-like
    else
        return false; 
}

function forEach(elems, callback){
	if (isArray(elems)){
		for (var i=0,l=elems.length; i<l; i++) {
			callback.call(elems, i, elems[i]);
		}
	} else if (isArrayLike(elems)) {
		for (var attr in elems) {
			callback.call(elems, attr, elems[attr]);
		}
	}
}


function slideToggle (obj) {
	var tarH = css(obj, 'height');
	if (tarH === 0) {
		buffer(obj, {'height': 400});
	} else {
		buffer(obj, {'height': 0});
	}
}
function css(obj, attr, val){
	if (arguments.length == 2) {
		return parseFloat(obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, null)[attr]);
	} else {
		switch (attr){
			case 'width':
			case 'height':
			case 'padding-left':
			case 'padding-right':
			case 'padding-bottom':
			case 'padding-top':
				val = Math.max(val, 0);
			case 'left':
			case 'top':
			case 'margin-left':
			case 'margin-right':
			case 'margin-top':
			case 'margin-bottom':
				obj.style[attr] = val + 'px';
				break;
			case 'opacity':
				obj.style.opacity = val;
				obj.style.filter = 'alpha(opacity:'+(val*100)+')';
				break;
			default : 
				obj.style[attr] = val;
		}

		return function (attr_in, attr_val){css(obj, attr_in, attr_val);};
	}
}


/* a tiny animate function */
function buffer (obj, json, fnDuring, fnEnd){
	clearInterval(obj.timer);
	obj.timer = setInterval(function (){
		var isEnd = true;
		for (var attr in json) {
			var cur,
				speed = 0;

			cur = css(obj, attr);
			speed = (json[attr] - cur) / 7;
			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

			if (json[attr] != cur) {
				isEnd = false;
			}

			if (fnDuring)fnDuring.call(obj);

			css(obj, attr, cur + speed);
		}

		if (isEnd) {
			clearInterval(obj.timer);
			obj.timer = null;
			fnEnd && fnEnd.call(obj);
		}
	}, 20);

}

// function flex (obj, json, fnDuring, fnEnd){
// 	if(!obj.oSpeed)obj.oSpeed = {};

// 	obj.timer = setInterval(function (){
// 		var isEnd = true,
// 			maxSpeed = 65;
// 		for (var attr in json) {
// 			if(!obj.oSpeed[attr])obj.oSpeed[attr] = 0;
			

// 			if (obj.oSpeed[attr])
// 		}

// 		if (isEnd){
// 			clearInterval(obj.timer);
// 			obj.timer = null;
// 			fnEnd && fnEnd.call(obj);
// 		}
// 	}, 50);
// }

window.debug = true;
function log (k, v) {
	if (window.debug){
		return v ? console.log(k, v) : console.log(k);
	}
}