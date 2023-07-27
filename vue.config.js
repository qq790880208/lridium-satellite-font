const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  chainWebpack: (config) => {
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker")
      .loader("worker-loader")
      .options({ inline: "fallback" });
  },
  parallel: false,
  publicPath: "./",
  transpileDependencies: true,
});
