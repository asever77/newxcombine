'use strict';

const global = 'uiNXC';

window[global] = {};

const Global = window[global];

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