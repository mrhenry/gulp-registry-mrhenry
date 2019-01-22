const css = require('./tasks/css');
const favicons = require('./tasks/favicons');
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
		const {
			css: cssConfig,
			fonts: fontsConfig,
			favicons: faviconsConfig,
			icons: iconsConfig,
			images: imagesConfig,
			js: jsConfig,
		} = this.config;

		if (cssConfig) {
			this.set('css', css(cssConfig), { watch: cssConfig.watch || cssConfig.src });
		}

		if (faviconsConfig) {
			this.set('favicons', favicons(faviconsConfig), { default: false, watch: false });
		}

		if (fontsConfig) {
			this.set('fonts', fonts(fontsConfig), { watch: fontsConfig.watch || fontsConfig.src });
		}

		if (iconsConfig) {
			this.set('icons', icons(iconsConfig), { watch: iconsConfig.watch || iconsConfig.src });
		}

		if (imagesConfig) {
			this.set('images', images(imagesConfig), { watch: imagesConfig.watch || imagesConfig.src });
		}

		if (jsConfig) {
			const { modern, legacy } = javascript(jsConfig);
			this.set('javascript:es6', modern, { default: false });
			this.set('javascript:babel', legacy, { default: false });
			this.set('javascript', taker.parallel('javascript:es6', 'javascript:babel'), { watch: jsConfig.watch || jsConfig.src });
		}

		this.set('default', taker.parallel(...this[DEFAULT_TASKS]));

		// The registry is consumed by a tool that supports watching
		// (probably Gulp)
		if (typeof taker.watch === 'function') {
			const watch = () => {
				Object.entries(this[WATCH_TASKS]).forEach(([task, files]) => {
					taker.watch(files, this.get(task));
				});
			};

			this.set('watch', taker.series('default', watch));
		}
	}

	get(task) {
		return this[TASKS][task];
	}

	set(task, fn, options = {}) {
		const defaults = { watch: false, default: true };
		const settings = Object.assign({}, defaults, options);

		if (settings.watch) {
			const files = settings.watch;
			this[WATCH_TASKS][task] = files;
		}

		if (settings.default) {
			this[DEFAULT_TASKS].push(task);
		}

		this[TASKS][task] = fn;

		return this[TASKS][task];
	}

	tasks() {
		return Object.keys(this[TASKS]).reduce((tasks, name) => {
			Object.assign(tasks, { [name]: this.get(name) });
			return tasks;
		}, {});
	}
}

module.exports = GulpRegistryMrHenry;
