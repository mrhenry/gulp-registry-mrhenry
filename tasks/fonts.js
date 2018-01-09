const gulp = require('gulp');

module.exports = (config) => {
	const { src, dest } = config;

	const fonts = () => gulp
		.src(config.src, { since: gulp.lastRun(fonts) })
		.pipe(gulp.dest(config.dest))

	return fonts;
};
