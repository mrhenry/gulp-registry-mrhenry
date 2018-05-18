const gulp = require('gulp');

const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const cssnext = require('postcss-cssnext');
const inlineImports = require('postcss-import');
const nested = require('postcss-nested');
const rename = require('gulp-rename');

module.exports = (config) => {
	const { src, dest, browsers } = config;

	const processors = [
		inlineImports({ path: src }),
		nested(),
		cssnext({
			browsers,
			features: {
				autoprefixer: {
					grid: true,
					supports: false,
				},
			},
		}),
	];

	const css = () => gulp
		.src(src)
		.pipe(postcss(processors))
		.pipe(gulp.dest(dest))
		.pipe(postcss([cssnano()]))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(dest));

	return css;
};
