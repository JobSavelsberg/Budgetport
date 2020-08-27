import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import colors from 'vuetify/lib/util/colors'

Vue.config.productionTip = false;

Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  theme: {
    dark: true,
    themes: {
      light: {
        primary: colors.red.darken1, // #E53935
        secondary: colors.red.lighten4, // #FFCDD2
        accent: colors.indigo.base, // #3F51B5
      },
      dark: {
        primary: colors.teal.darken1, // #E53935
        secondary: colors.amber.darken2, // #FFCDD2
        accent: colors.indigo.base, // #3F51B5
        warning: colors.orange.base,
      }
    },
  },
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app");

