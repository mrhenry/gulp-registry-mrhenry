const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

export default {
	input: "./dist/lib/index.js",
	output: {
		name: 'browserVersion',
		file: 'dist/bundle.js',
		format: 'iife',
	},
	plugins: [
		resolve(),
		commonjs(),
	]
}
