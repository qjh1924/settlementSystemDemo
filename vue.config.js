module.exports = {
  publicPath: "./",
  /* devServer: {
    proxy: {
      '/cu_admin': {
        target: 'http://localhost',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            '^/cu_admin': ''
        }
      }
    } */
  devServer: {
    // proxy: 'https://hdlshz.cn:443',
    proxy: 'http://localhost:80',
    port: 8080
  }
}