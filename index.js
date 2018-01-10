const gulp = require('gulp');

const css = require('./tasks/css');
const fonts = require('./tasks/fonts');
const icons = require('./tasks/icons');
const images = require('./tasks/images');
const javascript = require('./tasks/javascript');

const TASKS = Symbol('TASKS');
const WATCH_TASKS = Symbol('WATCH_TASKS');
const DEFAULT_TASKS = Symbol('DEFAULT_TASKS');

class GulpRegistryMrHenry {
	constructor(config = {}) {
		this[TASKS] = {};
		this[WATCH_TASKS] = {};
		this[DEFAULT_TASKS] = [];
		this.config = config;
	}

	init(taker) {
		this.set('css', css(this.config.css), { watch: this.config.css.watch });
		this.set('fonts', fonts(this.config.fonts), { watch: this.config.fonts.src });
		this.set('icons', icons(this.config.icons), { watch: this.config.icons.src });
		this.set('images', images(this.config.images), { watch: this.config.images.src });

		const { es6, babel } = javascript(this.config.js);
		this.set('javascript:es6', es6, { default: false });
		this.set('javascript:babel', babel, { default: false });
		this.set('javascript', taker.parallel('javascript:es6', 'javascript:babel'), { watch: this.config.js.watch });

		this.set('default', taker.parallel(...this[DEFAULT_TASKS]));

		const watch = () => {
			Object.entries(this[WATCH_TASKS]).forEach(([task, files]) => {
				gulp.watch(files, this.get(task));
			});
		};

		this.set('watch', taker.series('default', watch));
	}

	get(task) {
		return this[TASKS][task];
	}

	set(task, fn, options = {}) {
		const defaults = { watch: false, default: true };
		const settings = Object.assign({}, defaults, options);

		if (!!settings.watch) {
			const files = settings.watch;
			this[WATCH_TASKS][task] = files;
		}

		if (settings.default) {
			this[DEFAULT_TASKS].push(task);
		}

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
