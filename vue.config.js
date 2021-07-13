module.exports = {
	publicPath: './',
	css: {
		loaderOptions: {
			less: {
				lessOptions: {
					modifyVars: {
						// 通过 less 文件覆盖（文件路径为绝对路径）
						hack: `true; @import "@/assets/less/theme.less";`,
					},
				},
			},
		},
	},
}
