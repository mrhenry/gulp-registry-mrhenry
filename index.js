const gulp = require('gulp');

const css = require('./tasks/css');
const fonts = require('./tasks/fonts');
const icons = require('./tasks/icons');
const images = require('./tasks/images');
const javascript = require('./tasks/javascript');

const TASKS = Symbol('tasks');

class GulpRegistryMrHenry {
	constructor(config = {}) {
		this[TASKS] = {};
		this.config = config;
	}

	init(taker) {
		this.set('css', css(this.config.css));
		this.set('fonts', fonts(this.config.fonts));
		this.set('icons', icons(this.config.icons));
		this.set('images', images(this.config.images));

		const { es6, babel } = javascript(this.config.js);
		this.set('javascript:es6', es6);
		this.set('javascript:babel', babel);
		this.set('javascript', taker.parallel('javascript:es6', 'javascript:babel'));

		this.set('default', taker.parallel('css', 'fonts', 'icons', 'images', 'javascript'));

		const watch = () => {
			gulp.watch(this.config.css.watch, this.get('css'));
			gulp.watch(this.config.fonts.src, this.get('fonts'));
			gulp.watch(this.config.images.src, this.get('images'));
			gulp.watch(this.config.js.watch, this.get('javascript'));
		};

		this.set('watch', taker.series('default', watch));
	}

	get(task) {
		return this[TASKS][task];
	}

	set(task, fn) {
		return this[TASKS][task] = fn;
	}

	tasks() {
		return Object.keys(this[TASKS]).reduce((tasks, name) => {
			tasks[name] = this.get(name);
			return tasks;
		}, {});
	}
}

module.exports = GulpRegistryMrHenry;
