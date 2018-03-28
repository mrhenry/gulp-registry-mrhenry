const gulp = require('gulp');

const resize = require('gulp-image-resize');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');

const sizes = {
	'android-chrome-192x192': 192,
	'apple-touch-icon-120x120': 120,
	'apple-touch-icon-152x152': 152,
	'apple-touch-icon-167x167': 167,
	'apple-touch-icon-180x180': 180,
	'favicon-16x16': 16,
	'favicon-32x32': 32,
	'favicon-96x96': 96,
	'favicon-512x512': 512,
	largetile: 310,
	mediumtile: 270,
	smalltile: 70,
	widetile: [310, 150],
};

module.exports = (config) => {
	const { src, dest } = config;

	const resizers = Object.entries(sizes).map(([filename, size]) => {
		const parsedSize = Array.isArray(size) ? size : [size, size];
		const [width, height] = parsedSize;

		const task = () => gulp
			.src(src)
			.pipe(resize({
				width,
				height,
				crop: true,
				cover: false,
				format: 'png',
			}))
			.pipe(imagemin())
			.pipe(rename(`${filename}.png`))
			.pipe(gulp.dest(dest));

		const name = `favicon:${filename}`;

		gulp.task(name, task);

		return name;
	});

	const favicons = gulp.parallel(...resizers);
	return favicons;
};
