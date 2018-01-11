module.exports = {
	extends: 'eslint-config-mrhenry',
	rules: {
		// This throws an error on `javascript:es6`-like task names
		'no-script-url': 'off',
	},
};
