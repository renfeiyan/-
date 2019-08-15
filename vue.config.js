module.exports = {
    runtimeCompiler: true,
    outputDir: 'dist', /* 输出文件目录 */
    publicPath: process.env.NODE_ENV === 'production' ? '/dist/' : '/',
    productionSourceMap: false,
    css: {
        extract: true, /* 是否使用css分离插件 ExtractTextPlugin */
        sourceMap: false, /* 不开启 CSS source maps */
        loaderOptions: {}, /* css预设器配置项 */
        modules: false /* 启用 CSS modules for all css / pre-processor files */
    },
    devServer: {
        // host: '0.0.0.0',
        hot: true, /* 开启热点 */
        inline: true, /* 开启页面自动刷新 */
        progress: true, /* 显示打包的进度 */
        disableHostCheck: true,
        open: true,
        watchOptions: {
            aggregateTimeout: 300
        },
        proxy: {
            '/api': {
                target: 'http://202.202.43.5:92', /* 后台服务器地址 */
                // target: 'http://127.0.0.1:8081', /* 后台服务器地址 */
                hot: true,
                ws: false,
                changeOrigin: true,
                // disableHostCheck: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
};
