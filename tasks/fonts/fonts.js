const gulp = require('gulp');

module.exports = (config) => {
	const { src, dest } = config;

	const fonts = () => gulp
		.src(src, { since: gulp.lastRun(fonts) })
		.pipe(gulp.dest(dest));

	return fonts;
};
