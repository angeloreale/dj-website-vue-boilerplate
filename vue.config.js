module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          $HP_BG: "${process.env.VUE_APP_IMAGE_BG}";
          @import "@/assets/scss/main.scss";
        `
      }
    }
  }
}
