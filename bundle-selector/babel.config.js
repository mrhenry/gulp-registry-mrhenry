module.exports = {
	presets: [
		[
			"@babel/preset-env",
			{
				ignoreBrowserslistConfig: true,
				targets: 'defaults',
			},
		],
		[
			"minify",
			{
				"mangle": {
					"exclude": [
						'browserVersion',
						'name',
						'version',
					]
				},
			},
		],
	]
}
