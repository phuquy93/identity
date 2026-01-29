const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // assetsDir: './js/app_serial_system',
  css: {
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  },
  filenameHashing: false,
});

