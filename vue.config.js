const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  chainWebpack: (config) => {
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker")
      .loader("worker-loader")
      .options({ inline: "fallback" });
    config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
  },
  productionSourceMap: false,
  parallel: false,
  publicPath: "./",
  transpileDependencies: true,
  devServer: {
    // host: "0.0.0.0",
    // port: port,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: 'http://'.concat(process.env.VUE_APP_BACKEND_IP, ':', process.env.VUE_APP_BACKEND_PORT),
        target: process.env.VUE_APP_HTTP_API,
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
    },
    // disableHostCheck: true,
  },
});
