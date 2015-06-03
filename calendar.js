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
				this.width = options.width || 350;
				this.height = options.height || 300;
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
					header = appendElem('div', container, 'calender-header'),
					prevBtn = appendElem('div', header, 'prev'),
					nextBtn = appendElem('div', header, 'next'),
					dateText = appendElem('span', header, 'today'),
					body = appendElem('div', container, 'calender-body'),
					divs = [];

				this.header = header;
				this.body = body;
				this.prevBtn = prevBtn;
				this.nextBtn = nextBtn;
				this.dateText = dateText;
				this.buildHeader();
				for (var i = 0, k = 0; i < r; i++) {
					for (var j = 0; j < c; j++) {
						var div = appendElem('div', body, 'day');
						css(div, 'width', iW);
						css(div, 'height', iH);
						div.setAttribute('data-index', k++);
						divs.push(div);
					}
				}
				aDivs = divs;
				callback && callback.call(this);
				return aDivs;
			},
			buildHeader : function  (){
				var header = this.header;
				for (var i=0;i<7;i++) {
					var div = create('div', 'week');
					div.innerHTML = weekDateMapping[i];
					header.appendChild(div);
				}
			},
			calcDate: function(d) {
				var divs = this.divs;
				var date = getJsonDate((d && new Date(d)) || new Date());
				
				this.date = date;
				this.year = date['year'],
				this.month = date['month'],
				this.day = date['day'];

				var prevMonth = this.month-1,
					prevYear = this.year,
					nextMonth = this.month+1,
					nextYear = this.year;

				if(this.month == 1){
					prevMonth = 12;
					prevYear -= 1;
				} else if (this.month == 12) {
					nextMonth = 1;
					nextYear += 1;
				}

				this.prevMonth = prevMonth;
				this.prevYear = prevYear;
				this.nextMonth = nextMonth;
				this.nextYear = nextYear;


				alert(this.month+':' + this.prevMonth + ':' + this.nextMonth);
				this.weekDay = getWeekDay(this.year, this.month, this.day);
				this.firstDate = getWeekDay(this.year, this.month, 1);
				this.firstDate = this.firstDate < 0 ? this.firstDate += 7 : this.firstDate;
            	this.finalDate = new Date(this.year, this.month+1, 0).getDate();
            	this.lastDate = new Date(this.year, this.month, 0).getDate();
				this.render();
			},
			render: function() {
				forEach(aDivs, function (index, div){
					div.className = 'day';
				});

				this.dateText.innerText = '' + (this.year) + '/' + (this.month);

				var prevMonth = this.prevMonth,
					prevYear = this.prevYear,
					nextMonth = this.nextMonth,
					nextYear = this.nextYear;

				// render previous month
				for (var i=this.firstDate-1,k=0; i>=0; i--, k++) {
					aDivs[i].innerText = this.finalDate - k;
					aDivs[i].setAttribute('data-date', prevYear + '-' + prevMonth + '-' + (this.finalDate - k));
					addClass(aDivs[i], 'prev-month');
				}
				// render current month
				for (var i=this.firstDate, tot = 0; tot<this.lastDate; i++) {
					aDivs[i].innerText = ++tot;
					
					aDivs[i].setAttribute('data-date', this.year + '-' + this.month + '-' + tot);
					addClass(aDivs[i], 'this-month');
				}

				// render next month
				for (var j=i, k; j<42; j++) {
					k = j-i + 1;
					aDivs[j].innerText = k;
					aDivs[j].setAttribute('data-date', nextYear + '-' + nextMonth + '-' + k);
					addClass(aDivs[j], 'next-month');
				}

				this.bindEvent();
			},
			bindEvent : function (){
				this.prevDays = filteredByClass(aDivs, 'prev-month');
				this.nextDays = filteredByClass(aDivs, 'next-month');
				this.thisDays = filteredByClass(aDivs, 'this-month');

				var _this = this;
				forEach(_this.thisDays, function (i, elem){
					removeEvent(elem, 'click');
				});
				forEach(_this.thisDays, function (i, elem){
					addEvent(elem, 'click', function(){
						var d = elem.getAttribute('data-date');
						alert('当前日期' + d);
						alert('请添加回调');
						opt && opt['OnClick'] && isFunction(opt['OnClick']) && opt['OnClick'].call(elem);
					});
				});

				
				forEach(_this.prevDays, function (i, elem){
					removeEvent(elem, 'click');
				});

				forEach(_this.nextDays, function (i, elem){
					removeEvent(elem, 'click');
				});

				forEach(_this.nextDays, function (i, elem){
					addEvent(elem, 'click', function(){
						var d = elem.getAttribute('data-date');
						var firstDay = getFirstDate(d);
						_this.refresh(firstDay);
					});
				});

				

				removeEvent(_this.prevBtn,'click');
				addEvent(_this.prevBtn, 'click', function (){
					var firstDay =_this.prevYear + '-' + _this.prevMonth + '-1';
					_this.refresh(new Date(firstDay));
				});

				removeEvent(_this.nextBtn, 'click');
				addEvent(_this.nextBtn, 'click', function (){
					var d = new Date(_this.nextYear, _this.nextMonth-1, 1);
					var firstDay = getFirstDate(d);
					_this.refresh(firstDay);
				});
			},
			refresh : function (d){
				forEach(aDivs, function (i, div){
					removeEvent(div, 'click');
				});
				this.clear(this.calcDate(d));
			},
			clear : function (callback){
				if (aDivs){
					if (aDivs.length){
						forEach(aDivs, function (i, div){
							removeEvent(div, 'click');
						});
						callback && callback.call(this);
					}
				} else {
					aDivs = this.generateDayBlocks(this.width, this.height, this.calcDate);
				}
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

	function formatDate(d){
		var oDate = getJsonDate(d);
		return oDate['year'] + '/' + oDate['month'] + '/' + oDate['day'];
 	}
	function getFirstDate (d) {
		
		var arr = d.toString().split('-');
		arr[2] = '1';
		return arr.join('-');
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