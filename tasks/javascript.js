const gulp = require('gulp');

const babelify = require('babelify');
const babelPresetEnv = require('babel-preset-env');
const babili = require('gulp-babel-minify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const rollup = require('rollup-stream');
const uglify = require('gulp-uglify');
const tap = require('gulp-tap');
const sourcemaps = require('gulp-sourcemaps');

module.exports = (config) => {
	const {
		src, dest, browsers,
	} = config;

	const es6 = () => {
		return gulp.src(src)
			.pipe(tap((file) => {
				file.contents = rollup({
					input: file.path,
					format: 'es',
					plugins: [
						resolve({ browser: true }),
						commonjs({ sourceMap: true }),
					],
				});
			}))
			.pipe(rename({ suffix: '.es6' }))
			.pipe(gulp.dest(dest))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(babili())
			.pipe(rename({ suffix: '.min' }))
			.pipe(sourcemaps.write('./
		'))
			.pipe(gulp.dest(dest));
	};

	const babel = () => {
		const babelSettings = {
			presets: [
				[babelPresetEnv, {
					targets: {
						browsers,
					},
				}],
			],
		};

		return gulp.src(src, { read: false })
			.pipe(tap((file) => {
				file.contents = browserify(file.path, { debug: true })
					.transform(babelify, babelSettings)
					.bundle();
			}))
			.pipe(gulp.dest(dest))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(rename({ suffix: '.min' }))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(config.dest));
	};

	return { es6, babel };
};
