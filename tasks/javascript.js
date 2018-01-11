const gulp = require('gulp');

const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const rollup = require('rollup-stream');
const resolve = require('rollup-plugin-node-resolve');
const babili = require('gulp-babel-minify');
const babelPresetEnv = require('babel-preset-env');

module.exports = (config) => {
	const {
		src, dest, bundleName, browsers,
	} = config;

	const es6 = () => {
		const build = () => {
			const rollupSettings = {
				input: src,
				format: 'es',
				plugins: [resolve()],
			};

			return rollup(rollupSettings)
				.pipe(source(bundleName.replace('.js', '.es6.js')))
				.pipe(buffer());
		};

		return build()
			.pipe(gulp.dest(dest))
			.pipe(babili())
			.pipe(rename(bundleName.replace('.js', '.es6.min.js')))
			.pipe(gulp.dest(dest));
	};

	const babel = () => {
		const build = () => {
			const babelSettings = {
				presets: [
					[babelPresetEnv, {
						targets: {
							browsers,
						},
					}],
				],
			};

			return browserify(src, { debug: true })
				.transform(babelify, babelSettings)
				.bundle()
				.pipe(source(bundleName))
				.pipe(buffer());
		};

		return build()
			.pipe(gulp.dest(dest))
			.pipe(uglify())
			.pipe(rename(bundleName.replace('.js', '.min.js')))
			.pipe(gulp.dest(config.dest));
	};

	return { es6, babel };
};
