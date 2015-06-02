function rnd(n, m) {
	return Math.random() * (m - n) + n;
}

function setStyle(obj, json) {
	if (obj.length) {
		for (var i = 0; i < obj.length; i++) {
			setStyle(obj[i], json);
		}
	} else {
		for (var i in json) {
			obj.style[i] = json[i];
		}
	}
}

var buffer = function(obj, cur, target, fnDo, fnEnd, fs) {

	if (!fs) fs = 6;
	var now = {};
	var x = 0;
	var v = 0;

	if (!obj.__last_timer) obj.__last_timer = 0;
	var t = new Date().getTime();
	if (t - obj.__last_timer > 20) {
		fnMove();
		obj.__last_timer = t;
	}

	clearInterval(obj.timer);
	obj.timer = setInterval(fnMove, 20);

	function fnMove() {
		v = Math.ceil((100 - x) / fs);

		x += v;

		for (var i in cur) {
			now[i] = (target[i] - cur[i]) * x / 100 + cur[i];
		}


		if (fnDo) fnDo.call(obj, now);

		if (Math.abs(v) < 1 && Math.abs(100 - x) < 1) {
			clearInterval(obj.timer);
			if (fnEnd) fnEnd.call(obj, target);
		}
	}
};

function setStyle3(obj, name, value) {
	obj.style['Webkit' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
	obj.style['Moz' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
	obj.style['ms' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
	obj.style['O' + name.charAt(0).toUpperCase() + name.substring(1)] = value;
	obj.style[name] = value;
}

document.onmousedown = function() {
	return false;
};

window.onload = function() {
	var now = 0;
	var oDiv = document.getElementById('img');
	var ready = true;
	var W = 700;
	var H = 400;

	function next() {
		return (now + 1) % 3;
	}

	document.getElementById('btn_turn').onclick = function() {
		if (!ready) return;
		ready = false;

		oDiv.innerHTML = '';
		oDiv.style.background = 'url(imgs/' + (next() + 1) + '.jpg) center no-repeat';
		//oDiv.style.background='none';

		var oDivPage = document.createElement('div');

		setStyle(oDivPage, {
			position: 'absolute',
			background: 'url(imgs/' + (now + 1) + '.jpg) right no-repeat',
			zIndex: 3,
			left: '50%',
			top: 0,
			width: '50%',
			height: '100%',
			overflow: 'hidden'
		});
		//setStyle3(oDivPage, 'transition', '0.5s all ease-in');
		setStyle3(oDivPage, 'transform', 'perspective(1000px) rotateY(0deg)');
		setStyle3(oDivPage, 'transformOrigin', 'left');

		oDiv.appendChild(oDivPage);

		var oDivOld = document.createElement('div');

		setStyle(oDivOld, {
			position: 'absolute',
			left: 0,
			top: 0,
			width: '50%',
			height: '100%',
			zIndex: 2,
			background: 'url(imgs/' + (now + 1) + '.jpg) left no-repeat'
		});

		oDiv.appendChild(oDivOld);
		var oDivShadow = document.createElement('div');

		setStyle(oDivShadow, {
			position: 'absolute',
			right: 0,
			top: 0,
			width: '50%',
			height: '100%',
			zIndex: 2,
			background: 'rgba(0,0,0,1)'
		});
		//setStyle3(oDivShadow, 'transition', '0.5s all ease-in');

		oDiv.appendChild(oDivShadow);

		oDivPage.ch = false;
		buffer(oDivPage, {
			y: 0,
			opacity: 1
		}, {
			y: -180,
			opacity: 0
		}, function(now) {
			if (now.y < -90 && !oDivPage.ch) {
				oDivPage.ch = true;
				oDivPage.innerHTML = '<img />';

				var oImg = oDivPage.getElementsByTagName('img')[0];

				oImg.src = 'imgs/' + (next() + 1) + '.jpg';
				setStyle3(oImg, 'transform', 'scaleX(-1)');

				setStyle(oImg, {
					position: 'absolute',
					right: 0,
					top: 0,
					width: '200%',
					height: '100%'
				});

				//setStyle3(oDivPage, 'transform', 'perspective(1000px) scale(-1,1) rotateY(-90deg)');
				setStyle3(oDivPage, 'transformOrigin', 'left');
			}

			if (now.y < -90) {
				setStyle3(oDivPage, 'transform', 'perspective(1000px) scale(-1,1) rotateY(' + (180 - now.y) + 'deg)');
			} else {
				setStyle3(oDivPage, 'transform', 'perspective(1000px) rotateY(' + now.y + 'deg)');
			}
			oDivShadow.style.background = 'rgba(0,0,0,' + now.opacity + ')';
		}, function() {
			now = next();
			ready = true;
		}, 14);
	};


	var timer = setInterval(function() {
		document.getElementById('btn_turn').onclick();
	}, 3000);
};