const gulp = require('gulp');

// const resize = require('gulp-image-resize');
const gm = require('gulp-gm');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');

const sizes = {
	'android-chrome-192x192': {
		width: 192,
		transparent: false,
	},
	'apple-touch-icon-120x120': {
		width: 120,
		transparent: false,
	},
	'apple-touch-icon-152x152': {
		width: 152,
		transparent: false,
	},
	'apple-touch-icon-167x167': {
		width: 167,
		transparent: false,
	},
	'apple-touch-icon-180x180': {
		width: 180,
		transparent: false,
	},
	'favicon-16x16': 16,
	'favicon-32x32': 32,
	'favicon-96x96': 96,
	'favicon-512x512': 512,
	largetile: {
		width: 310,
		transparent: false,
	},
	mediumtile: {
		width: 270,
		transparent: false,
	},
	smalltile: {
		width: 70,
		transparent: false,
	},
	widetile: {
		width: 310,
		height: 150,
		transparent: false,
	},
};

module.exports = (config) => {
	const {
		src: { png, svg },
		dest,
		backgroundColor = '#ffffff',
		padding = 0.825,
	} = config;

	const resizers = Object.entries(sizes).map(([filename, options]) => {
		const settings = {
			width: 512,
			height: 512,
			transparent: true,
		};

		if (typeof options === 'number') {
			Object.assign(settings, {
				width: options,
				height: options,
			});
		} else {
			const { width, height, transparent } = options;

			Object.assign(settings, {
				width,
				height: height || width,
				transparent: !!transparent,
			});
		}

		const task = () => gulp
			.src(png)
			.pipe(gm((favicon) => {
				const { width, height, transparent } = settings;

				const shortest = width <= height ? width : height;

				if (transparent) {
					return favicon.resize(width, height);
				}

				return favicon
					.resize(shortest * padding, shortest * padding)
					.gravity('Center')
					.extent(width, height)
					.background(backgroundColor);
			}))
			.pipe(imagemin())
			.pipe(rename(`${filename}.png`))
			.pipe(gulp.dest(dest));

		const name = `favicon:${filename}`;

		gulp.task(name, task);

		return name;
	});

	const generateFavicons = gulp.parallel(...resizers);

	if (svg) {
		const svgoSettings = {
			plugins: [
				{ cleanupAttrs: true },
				{ removeViewbox: false },
				{ removeRasterImages: true },
				{ removeDoctype: true },
				{ removeComments: true },
				{
					cleanupNumericValues: {
						floatPrecision: 2,
					},
				},
			],
		};

		const copyPinnedTab = () => gulp
			.src(svg)
			.pipe(imagemin([
				imagemin.svgo(svgoSettings),
			]))
			.pipe(gulp.dest(dest));

		return gulp.parallel(generateFavicons, copyPinnedTab);
	}

	return generateFavicons;
};
