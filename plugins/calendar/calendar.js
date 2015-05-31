/* This calendar plugin is based on base.js */ ;
(function(win, doc) {
	function Calendar() {
		return new _Calendar().init(arguments[0]);
	}

	function _Calendar() {
		var weekDateMapping = {
			'0' : '星期天',
			'1' : '星期一',
			'2' : '星期二',
			'3' : '星期三',
			'4' : '星期四',
			'5' : '星期五',
			'6' : '星期六'
		},
			aDivs = [],
			opt;
		return {

			init: function(options) {
				this.id = options.id || 'test';
				this.width = options.width || 490;
				this.height = options.height || 420;
				this.obj = byId(options.id);
				opt = options || {};
				aDivs = this.generateDayBlocks(this.width, this.height, this.calcDate);

			},
			generateDayBlocks: function(w, h, callback) {
				var c = 7,
					r = 6,
					iW = w / 7,
					iH = h / 6,
					container = this.obj,
					divs = [];
				for (var i = 0, k = 0; i < r; i++) {
					for (var j = 0; j < c; j++) {
						var div = appendElem('div', container, 'day');
						css(div, 'width', iW);
						css(div, 'height', iH);
						div.setAttribute('data-index', k++);
						divs.push(div);
					}
				}
				aDivs = divs;
				callback && callback.call(this);
			},
			calcDate: function() {
				var divs = this.divs;
				var date = getJsonDate(new Date());
				
				this.year = date['year'],
				this.month = date['month'],
				this.day = date['day'];

				this.weekDay = getWeekDay(this.year, this.month, this.day);
				this.firstDate = getWeekDay(this.year, this.month, 1);
				this.firstDate = this.firstDate < 0 ? this.firstDate += 7 : this.firstDate;
            	this.finalDate = new Date(this.year, this.month+1, 0).getDate();
            	this.lastDate = new Date(this.year, this.month, 0).getDate();
				this.render();
				
			},
			render: function() {

				// render previous month
				for (var i=this.firstDate-1,k=0; i>=0; i--) {
					aDivs[i].innerHTML = this.finalDate - k++;
					addClass(aDivs[i], 'prev-month');
				}
				// render current month
				for (var i=this.firstDate, tot = 0; tot<=this.finalDate; i++) {
					aDivs[i].innerHTML = ++tot;
					addClass(aDivs[i], 'this-month');
				}

				// render next month
				for (j=i; j<42; j++) {
					aDivs[j].innerHTML = j-i + 1;
					addClass(aDivs[j], 'next-month');
				}

				this.bindEvent();
			},
			bindEvent : function (){
				this.thisDays = filteredByClass(aDivs, 'this-month');
				forEach(this.thisDays, function (i, elem){
					addEvent(elem, 'click', function(){
						opt && opt['OnClick'] && isFunction(opt['OnClick']) && opt['OnClick'].call(elem);
					});
					addEvent(elem, 'dblclick', function(ev){
						opt && opt['OnDblClick'] && isFunction(opt['OnDblClick']) && opt['OnDblClick'].call(elem);
					});
				});
			}
		};
	}



	win.debug = true;

	function log(k, v) {
		if (win.debug) {
			return v ? console.log(k, v) : console.log(k);
		}
	}

	function getJsonDate(d) {
		return {
			year: d.getFullYear(),
			month: d.getMonth() + 1,
			day: d.getDate(),
			hour: d.getHours(),
			minutes: d.getMinutes(),
			second: d.getSeconds()
		};
	}

	function getWeekDay(y, m, d) {

		if (m == 1) {
			m = 13;
			y--;
		}
		if (m == 2) {
			m = 14;
			y--;
		}
		c = parseInt(y / 100);
		y = y % 100;

		return parseInt((parseInt((c / 4)) - 2 * c + parseInt(y / 4) + y + parseInt(13 * (m + 1) / 5) + d - 1)) % 7;
	}

	win.Calendar = Calendar;
})(window, document);