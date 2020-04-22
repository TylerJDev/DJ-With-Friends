module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
                @import "@/scss/variables.scss";
                @import "@/scss/mixins.scss";
                `,
      },
    },
  },
};
