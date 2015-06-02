function css (obj, attr, value) {
	if (arguments.length == 2) {
		var ret;
		if (obj.style) {
			ret=obj.style[attr];
		} else if (obj.currentStyle) {
			ret=obj.currentStyle[attr];
		} else if (document.defaultView && document.defaultView.getComputedStyle) {
			ret=document.defaultView.getComputedStyle(obj,false)[attr];
		} else{
			return ret;
		}
		return parseFloat(ret);
	} else if (arguments.length === 3) {
		switch(attr){
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingRight':
			case 'paddingTop':
			case 'paddingBottom':
				value = Math.max(value,0);
			case 'left':
			case 'top':
			case 'marginRight':
			case 'marginTop':
			case 'marginLeft':
			case 'marginBottom':
				obj.style[attr]=value+'px';
				break;
			case 'opacity':
				obj.style.filter="alpha(opacity:"+value*100+")";
				obj.style.opacity=value;
				break;
			default :
				obj.style[attr] = value;
		}
	}
	return function(a,b){css(obj,a,b)};
}
function flex (obj, targetJson, fnCallback , fnDuring) {
	var bStop = true;
	var attr = '';
	var cur = 0;
	for (attr in targetJson) {
		cur = css(obj, attr);
		if(!obj.oSpeed)obj.oSpeed={};
		if(!obj.oSpeed[attr])obj.oSpeed[attr] = 0;

		if (Math.abs(targetJson[attr] - cur) > 1 || Math.abs(obj.oSpeed[attr]) > 1) {
			bStop = false;
			var maxSpeed = 65;
			obj.oSpeed[attr] += (targetJson[attr] - cur) / 5;
			obj.oSpeed[attr] *= 0.7;
			if (Math.abs(obj.oSpeed[attr]) > maxSpeed) {
				obj.oSpeed[attr] = obj.oSpeed[attr] > 0 ? maxSpeed : -maxSpeed;
			}
			css(obj, attr, cur+obj.oSpeed[attr]);
		}
	}
	if(fnDuring)fnDuring.call(obj);
	if(bStop) {
		clearInterval(obj.timer);
		obj.timer=null;
		fnCallback && fnCallback.call(obj);
	}
}
function buff(obj, targetJson, fnCallback, fnDuring){
	var bStop = true;
	var attr = '';
	var speed = 0;
	var cur = 0;
	for (attr in targetJson) {
		cur=css(obj, attr);
		if(targetJson[attr]!=cur)
		{
			bStop=false;
			
			speed=(targetJson[attr]-cur)/5;
			speed=speed>0?Math.ceil(speed):Math.floor(speed);
			
			css(obj, attr, cur+speed);
		}
	}

	if(fnDuring)fnDuring.call(obj);
	if(bStop) {
		clearInterval(obj.timer);
		obj.timer=null;
		fnCallback && fnCallback.call(obj);
	}
}
function animate(obj, json, iType, fnCallback, fnDuring){
	var fnMove = null;
	switch(iType) {
		case 1 : fnMove = flex;break;
		case 2 : fnMove = buff;break;
	}

	obj.timer = setInterval(function(){
		fnMove(obj, json, fnCallback, fnDuring);
	}, 15);
}