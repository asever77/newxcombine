'use strict';

const global = 'uiNXC';

window[global] = {};

const Global = window[global];
const UA = navigator.userAgent.toLowerCase();
const deviceSize = [1920, 1600, 1440, 1280, 1024, 960, 840, 720, 600, 480, 400, 360];
const deviceInfo = ['android', 'iphone', 'ipod', 'ipad', 'blackberry', 'windows ce', 'windows','samsung', 'lg', 'mot', 'sonyericsson', 'nokia', 'opeara mini', 'opera mobi', 'webos', 'iemobile', 'kfapwi', 'rim', 'bb10'];

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
				browser.ie = browser.ie = parseInt( browser.ie[1] || browser.ie[2] );
				( 11 > browser.ie ) ? support.pointerevents = false : '';
				( 9 > browser.ie ) ? support.svgimage = false : '';
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
			},200);
		}
		window.addEventListener('resize', act);
		act();
	}
}
Global.state.resizeState();
Global.scroll = {
	y : 0,
	direction : 'down',
	init() {
		let last_know_scroll_position = 0;
		let ticking = false;

		const doSomething = (scroll_pos) => {
			this.direction = this.y > scroll_pos ? 'up' : this.y < scroll_pos ? 'down' : ''; 
			this.y = scroll_pos;
			this.check();

            console.log(scroll_pos);

            scroll_pos > 20 ? document.querySelector('body').classList.add('bg') : document.querySelector('body').classList.remove('bg');

			document.querySelector('body').dataset.dir = this.direction;
		}
		window.addEventListener('scroll', (e) => {
			last_know_scroll_position = window.scrollY;

			if (!ticking) {
				window.requestAnimationFrame(() => {
					doSomething(last_know_scroll_position);
					ticking = false;
				});

				ticking = true;
			}
		});
		setTimeout(() => {
			this.check();
		}, 400);
		
	},
	check() {
		const items = document.querySelectorAll('[data-parallax]');
		for (let item of items) {
			const item_t = item.getBoundingClientRect().top;
			const item_h = item.offsetHeight;
			const win_h = window.innerHeight;
			const scroll_t = document.documentElement.scrollTop;

			if (win_h > item_t && win_h + (win_h / 10) > item_t+item_h) {
					item.classList.add('parallax-s-0');
					item.classList.add('parallax-e-0');
			} else {
				((item_t+scroll_t-win_h) < scroll_t) ? item.classList.add('parallax-s-0') : item.classList.remove('parallax-s-0');
				((item_t+scroll_t) < scroll_t) ? item.classList.add('parallax-s-1') : item.classList.remove('parallax-s-1');
				((item_t+scroll_t-win_h+item_h) < scroll_t) ? item.classList.add('parallax-e-0') : item.classList.remove('parallax-e-0');
				((item_t+scroll_t+item_h) < scroll_t) ? item.classList.add('parallax-e-1') : item.classList.remove('parallax-e-1');
			}
		}
	}
}