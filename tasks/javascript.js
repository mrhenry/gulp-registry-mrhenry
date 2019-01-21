const gulp = require('gulp');

const filter = require('gulp-filter');
const minify = require("gulp-babel-minify");
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const rollup = require('gulp-better-rollup');
const tap = require('gulp-tap');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');

module.exports = (config) => {
	const {
		src,
		dest,
		browsers,
	} = config;

	const pipeline = (targets, suffix) => {
		const step1 = gulp.src(src)
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(rollup({
				plugins: [
					resolve({
						browser: true
					}),
					commonjs({
						sourceMap: true
					}),
					babel({
						babelrc: false,
						exclude: [
							'node_modules/@babel/**',
							'node_modules/core-js/**',
							'node_modules/regenerator-runtime/**',
						],
						presets: [
							[
								"@babel/preset-env",
								{
									useBuiltIns: "usage",
									ignoreBrowserslistConfig: true,
									targets: targets,
								}
							]
						]
					}),
				],
			}, {
				format: 'iife',
			}));

		const step2 = suffix ? step1.pipe(rename({
			suffix: suffix
		})) : step1;

		return step2
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(dest))
			.pipe(filter(['!**/*.map']))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(minify({
				mangle: {
					keepFnName: true,
					keepClassName: true
				}
			}))
			.pipe(rename({
				suffix: '.min'
			}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(dest));
	};

	const modern = () => {
		const targets = [
			// global coverage: 75.43% (on 21-01-2019)
			'chrome >= 70',
			'and_chr >= 70',
			'ff >= 63',
			'and_ff >= 63',
			'safari >= 12',
			'ios_saf >= 12',
			'opera >= 56',
			'Samsung >= 7',
			'and_uc >= 11',
		].join(', ')
		return pipeline(targets, '.es6');
	}

	const legacy = () => {
		return pipeline(browsers);
	}

	return {
		modern,
		legacy
	};
};
