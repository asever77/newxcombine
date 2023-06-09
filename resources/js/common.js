'use strict';

const global = 'uiNXC';

window[global] = {};

const Global = window[global];
const UA = navigator.userAgent.toLowerCase();
const deviceSize = [1920, 1600, 1440, 1280, 1024, 960, 840, 720, 600, 480, 400, 360];
const deviceInfo = ['android', 'iphone', 'ipod', 'ipad', 'blackberry', 'windows ce', 'windows', 'samsung', 'lg', 'mot', 'sonyericsson', 'nokia', 'opeara mini', 'opera mobi', 'webos', 'iemobile', 'kfapwi', 'rim', 'bb10'];
Global.callback = {}
Global.state = {
	device: {
		info: (() => {
			for (let i = 0, len = deviceInfo.length; i < len; i++) {
				if (UA.match(deviceInfo[i]) !== null) {
					return deviceInfo[i];
				}
			}
		})(),
		width: window.innerWidth,
		height: window.innerHeight,
		breakpoint: null,
		colClass: null,
		ios: (/ip(ad|hone|od)/i).test(UA),
		android: (/android/i).test(UA),
		app: UA.indexOf('appname') > -1 ? true : false,
		touch: null,
		mobile: null,
		os: (navigator.appVersion).match(/(mac|win|linux)/i)
	},
	browser: {
		ie: UA.match(/(?:msie ([0-9]+)|rv:([0-9\.]+)\) like gecko)/i),
		local: (/^http:\/\//).test(location.href),
		firefox: (/firefox/i).test(UA),
		webkit: (/applewebkit/i).test(UA),
		chrome: (/chrome/i).test(UA),
		opera: (/opera/i).test(UA),
		safari: (/applewebkit/i).test(UA) && !(/chrome/i).test(UA),
		size: null
	},
	scroll: {
		y: 0,
		direction: 'down'
	},
	breakPoint: [600, 905],
	resizeState() {
		let timerWin;

		const act = () => {
			const browser = Global.state.browser;
			const device = Global.state.device;

			device.width = window.innerWidth;
			device.height = window.innerHeight;

			device.touch = device.ios || device.android || (document.ontouchstart !== undefined && document.ontouchstart !== null);
			device.mobile = device.touch && (device.ios || device.android);
			device.os = device.os ? device.os[0] : '';
			device.os = device.os.toLowerCase();

			device.breakpoint = device.width >= deviceSize[5] ? true : false;
			device.colClass = device.width >= deviceSize[5] ? 'col-12' : device.width > deviceSize[8] ? 'col-8' : 'col-4';

			if (browser.ie) {
				browser.ie = browser.ie = parseInt(browser.ie[1] || browser.ie[2]);
				(11 > browser.ie) ? support.pointerevents = false : '';
				(9 > browser.ie) ? support.svgimage = false : '';
			} else {
				browser.ie = false;
			}

			const clsBrowser = browser.chrome ? 'chrome' : browser.firefox ? 'firefox' : browser.opera ? 'opera' : browser.safari ? 'safari' : browser.ie ? 'ie' + browser.ie : 'other';
			const clsMobileSystem = device.ios ? "ios" : device.android ? "android" : 'etc';
			const clsMobile = device.mobile ? device.app ? 'ui-a ui-m' : 'ui-m' : 'ui-d';
			const el_html = document.querySelector('html');

			el_html.classList.remove('col-12', 'col-8', 'col-4');
			el_html.classList.add(device.colClass);
			el_html.classList.add(clsBrowser);
			el_html.classList.add(clsMobileSystem);
			el_html.classList.add(clsMobile);

			const w = window.innerWidth;

			clearTimeout(timerWin);
			timerWin = setTimeout(() => {
				el_html.classList.remove('size-tablet');
				el_html.classList.remove('size-desktop');
				el_html.classList.remove('size-mobile');
				el_html.classList.remove('size-desktop');

				if (w < Global.state.breakPoint[0]) {
					Global.state.browser.size = 'mobile';
					el_html.classList.add('size-mobile');
				} else if (w < Global.state.breakPoint[1]) {
					Global.state.browser.size = 'tablet';
					el_html.classList.add('size-tablet');
				} else {
					Global.state.browser.sizee = 'desktop';
					el_html.classList.add('size-desktop');
				}
			}, 200);
		}
		window.addEventListener('resize', act);
		act();
	}
}
Global.state.resizeState();
Global.parallax = {
	optionsParllax: {
		selector: null,
		area: null
	},
	init(option) {
		const opt = Object.assign({}, this.optionsParllax, option);
		//const opt = {...this.optionsParllax, ...option};
		const el_area = (opt.area === undefined || opt.area === null) ? window : opt.area;
		//Nullish coalescing operator
		//const el_area = opt.area ?? window;
		const el_parallax = (opt.selector === undefined || opt.selector === null) ? document.querySelector('.ui-parallax') : opt.selector;
		//const el_parallax = opt.selector ?? document.querySelector('.ui-parallax');

		//:scope >
		const el_wraps = el_parallax.querySelectorAll('.ui-parallax-wrap');
		const act = () => {
			const isWin = el_area === window;
			const areaH = isWin ? window.innerHeight : el_area.offsetHeight;

			for (let i = 0, len = el_wraps.length; i < len; i++) {
				const that = el_wraps[i];
				const callbackname = that.dataset.act;
				const h = Math.floor(that.offsetHeight);

				let start = Math.floor(that.getBoundingClientRect().top) - areaH;
				let _n = 0;
				let _per_s = 0;
				let _per_e = 0;

				if (start < 0) {
					_n = Math.abs(start);
					_per_s = Math.round(_n / areaH * 100);
					_per_s = _per_s >= 100 ? 100 : _per_s;
				} else {
					_n = 0;
					_per_s = 0;
				}

				if (start + areaH < 0) {
					_n = Math.abs(start + areaH);
					_per_e = Math.round(_n / h * 100);
					_per_e = _per_e >= 100 ? 100 : _per_e;
				} else {
					_n = 0;
					_per_e = 0;
				}

				that.setAttribute('data-parallax-s', _per_s);
				that.setAttribute('data-parallax-e', _per_e);

				if (!!Global.callback[callbackname]) {
					Global.callback[callbackname]({
						el: that,
						px: _n,
						start: _per_s,
						end: _per_e
					});
				}
			}
		}

		act();
		el_area.addEventListener('scroll', act);
	}
}
Global.scroll = {
	options: {
		selector: document.querySelector('html, body'),
		focus: false,
		top: 0,
		left: 0,
		add: 0,
		align: 'default',
		effect: 'smooth', //'auto'
		callback: false,
	},
	init() {
		const el_areas = document.querySelectorAll('.ui-scrollmove-btn[data-area]');

		for (let i = 0, len = el_areas.length; i < len; i++) {
			const that = el_areas[i];

			that.removeEventListener('click', this.act);
			that.addEventListener('click', this.act);
		}
		// for (let that of el_areas) {
		// 	that.removeEventListener('click', this.act);
		// 	that.addEventListener('click', this.act);
		// }
	},
	act(e) {
		const el = e.currentTarget;
		const area = el.dataset.area;
		const name = el.dataset.name;
		const add = el.dataset.add === undefined ? 0 : el.dataset.add;
		const align = el.dataset.align === undefined ? 'default' : el.dataset.align;
		const callback = el.dataset.callback === undefined ? false : el.dataset.callback;
		let el_area = document.querySelector('.ui-scrollmove[data-area="' + area + '"]');
		const item = el_area.querySelector('.ui-scrollbar-item');

		if (!!item) {
			el_area = el_area.querySelector('.ui-scrollbar-item');
		}

		const el_item = el_area.querySelector('.ui-scrollmove-item[data-name="' + name + '"]');

		let top = (el_area.getBoundingClientRect().top - el_item.getBoundingClientRect().top) - el_area.scrollTop;
		let left = (el_area.getBoundingClientRect().left - el_item.getBoundingClientRect().left) - el_area.scrollLeft;

		if (align === 'center') {
			top = top - (el_item.offsetHeight / 2);
			left = left - (el_item.offsetWidth / 2);
		}
console.log(top,align)
		Global.scroll.move({
			top: top,
			left: left,
			add: add,
			selector: el_area,
			align: align,
			focus: el_item,
			callback: callback
		});
	},
	move(option) {
		const opt = Object.assign({}, this.options, option);
		//const opt = {...this.options, ...option};
		const top = opt.top;
		const left = opt.left;
		const callback = opt.callback;
		const align = opt.align;
		const add = opt.add;
		const focus = opt.focus;
		const effect = opt.effect;
		let selector = document.querySelector('html, body');

		switch (align) {
			case 'center':
				selector.scrollTo({
					top: Math.abs(top) - (selector.offsetHeight / 2) + add,
					left: Math.abs(left) - (selector.offsetWidth / 2) + add,
					behavior: effect
				});
				break;

			case 'default':
			default:
				console.log(selector, Math.abs(top) + add, Math.abs(left) + add)
				selector.scrollTo({
					top: Math.abs(top) + add,
					left: Math.abs(left) + add,
					behavior: effect
				});
		}
		this.checkEnd({
			selector: selector,
			nowTop: selector.scrollTop,
			nowLeft: selector.scrollLeft,
			align: align,
			callback: callback,
			focus: focus
		});
	},
	checkEndTimer: {},
	checkEnd(opt) {
		const el_selector = opt.selector;
		const align = opt.align
		const focus = opt.focus
		const callback = opt.callback

		let nowTop = opt.nowTop;
		let nowLeft = opt.nowLeft;

		Global.scroll.checkEndTimer = setTimeout(() => {
			//스크롤 현재 진행 여부 판단
			if (nowTop === el_selector.scrollTop && nowLeft === el_selector.scrollLeft) {
				clearTimeout(Global.scroll.checkEndTimer);
				//포커스가 위치할 엘리먼트를 지정하였다면 실행
				if (!!focus) {
					focus.setAttribute('tabindex', 0);
					focus.focus();
				}
				//스크롤 이동후 콜백함수 실행
				if (!!callback) {
					if (typeof callback === 'string') {
						Global.callback[callback]();
					} else {
						callback();
					}
				}
			} else {
				nowTop = el_selector.scrollTop;
				nowLeft = el_selector.scrollLeft;

				Global.scroll.checkEnd({
					selector: el_selector,
					nowTop: nowTop,
					nowLeft: nowLeft,
					align: align,
					callback: callback,
					focus: focus
				});
			}
		}, 100);
	}
}
Global.scrollEvent = {
	y: 0,
	direction: 'down',
	scrollScope: {},
	isScope: false,
	init(opt) {
		let last_know_scroll_position = 0;
		let ticking = false;

		this.isScope = !!opt && !!opt.scope;
		this.scrollScope = this.isScope ? opt.scope : window;

		const options = {
			root: null,
			rootMargin: '0px',
			threshold: [0.5]
		}
		let nowY = null;
		const io = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				const bcr = entry.boundingClientRect;
				const bcrTop = entry.boundingClientRect.top;
				const scrTop = document.documentElement.scrollTop;
				const target = entry.target;
				const ratio = entry.intersectionRatio;
				const state = entry.isIntersecting;
				const isUp = nowY === null ? false : nowY < bcrTop ? true : false;
				const isOverflow = bcr.height >= entry.rootBounds.height ? true : false;
				const isHalfGone = ((scrTop - bcrTop) < (bcrTop + scrTop));

				nowY = bcrTop;


				if (isOverflow) {
					if (!isUp) {
						if (isHalfGone && ratio >= 0.5 && ratio < 1) {
							target.classList.add('ui-s2');
							target.dataset.state = 's2';
						}
						else if (isHalfGone && ratio > 0 && ratio < 0.5) {
							target.classList.add('ui-s1');
							target.dataset.state = 's1';
						}
						else if (!isHalfGone && ratio <= 0) {
							target.classList.add('ui-s4');
							target.dataset.state = 's4';
						}
						else if (!isHalfGone && ratio < 0.5) {
							target.classList.add('ui-s3');
							target.dataset.state = 's3';
						}
					}
					else {
						if (ratio <= 0 && isHalfGone) {
							target.classList.remove('ui-s1');
							target.dataset.state = 's0';
						}
						else if (ratio <= 0.5 && isHalfGone) {
							target.classList.remove('ui-s2');
							target.dataset.state = 's1';
						}
						else if (ratio < 1 && ratio > 0.5 && !isHalfGone) {
							target.classList.remove('ui-s3');
							target.dataset.state = 's2';
						}
						else if (ratio < 0.5 && ratio >= 0 && !isHalfGone) {
							target.classList.remove('ui-s4');
							target.dataset.state = 's3';
						}

					}
				} else {
					if (!isUp) {
						if (isHalfGone && ratio >= 0.5 && ratio < 1) {
							target.classList.add('ui-s2');
							target.dataset.state = 's2';
						}
						else if (isHalfGone && ratio > 0 && ratio < 0.5) {
							target.classList.add('ui-s1');
							target.dataset.state = 's1';
						}
						else if (!isHalfGone && ratio <= 0) {
							target.classList.add('ui-s6');
							target.dataset.state = 's6';
						}
						else if (!isHalfGone && ratio < 0.5) {
							target.classList.add('ui-s5');
							target.dataset.state = 's5';
						}
						else if (!isHalfGone && ratio <= 1) {
							target.classList.add('ui-s4');
							target.dataset.state = 's4';
						}
						else if (isHalfGone && ratio >= 1) {
							target.classList.add('ui-s3');
							target.dataset.state = 's3';
						}
					}
					else {
						if (ratio <= 0 && isHalfGone) {
							target.classList.remove('ui-s1');
							target.dataset.state = 's0';
						}
						else if (ratio <= 0.5 && isHalfGone) {
							target.classList.remove('ui-s2');
							target.dataset.state = 's1';
						}
						else if (ratio < 0.7 && ratio > 0.5 && !isHalfGone) {
							target.classList.remove('ui-s5');
							target.dataset.state = 's4';
						}
						else if (ratio < 0.2 && ratio >= 0 && !isHalfGone) {
							target.classList.remove('ui-s6');
							target.dataset.state = 's5';
						}
						else if (ratio >= 1 && isHalfGone) {
							target.classList.remove('ui-s4');
							target.dataset.state = 's3';
						}
						else if (ratio <= 1 && isHalfGone) {
							target.classList.remove('ui-s3');
							target.dataset.state = 's2';
						}
					}
				}

			});
		}, options);

		const items = document.querySelectorAll('[data-parallax]');

		for (let item of items) {
			io.observe(item);
		}
	},
	check() {
		const items = document.querySelectorAll('[data-parallax]');

		for (let item of items) {
			const item_t = item.getBoundingClientRect().top;
			const item_h = item.offsetHeight;
			const win_h = window.innerHeight;
			const scroll_t = this.isScope ? this.scrollScope.scrollTop : document.documentElement.scrollTop;

			((item_t + scroll_t - win_h) < scroll_t) ? item.classList.add('parallax-s-0') : item.classList.remove('parallax-s-0');
			((item_t + scroll_t) < scroll_t) ? item.classList.add('parallax-s-1') : item.classList.remove('parallax-s-1');
			((item_t + scroll_t - win_h + item_h) < scroll_t) ? item.classList.add('parallax-e-0') : item.classList.remove('parallax-e-0');
			((item_t + scroll_t + item_h) < scroll_t) ? item.classList.add('parallax-e-1') : item.classList.remove('parallax-e-1');
			((item_t + scroll_t - (win_h / 2)) < scroll_t) ? item.classList.add('parallax-m-0') : item.classList.remove('parallax-m-0');
			((item_t + scroll_t + (item_h / 2)) < scroll_t) ? item.classList.add('parallax-m-1') : item.classList.remove('parallax-m-1');
		}
	}
}