const CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
  publicPath: "./",
  devServer: {
    proxy: "http://localhost:8000"
  },
  configureWebpack: () => {
    if (process.env.NODE_ENV === "production") {
      return {
        plugins: [
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css/, //匹配文件名
            threshold: 10240, //对超过10k的数据压缩
            deleteOriginalAssets: false //不删除源文件
          })
        ],
        externals: {
          "element-ui": "ELEMENT",
          vue: "Vue"
        }
      };
    }
  }
};
