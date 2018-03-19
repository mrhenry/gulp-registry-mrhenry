const gulp = require('gulp');

const imagemin = require('gulp-imagemin');

module.exports = (config) => {
	const { src, dest } = config;

	const favicons = () => gulp
		.src(src, { since: gulp.lastRun(favicons) })
		.pipe(imagemin())
		.pipe(gulp.dest(dest));

	return favicons;
};
