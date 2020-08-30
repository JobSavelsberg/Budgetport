import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import colors from 'vuetify/lib/util/colors'
import numeral from 'numeral'
// load a locale
const nlFormat: NumeralJSLocale = {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'K',
    million: 'M',
    billion: 'B',
    trillion: 'T'
  },
  ordinal: function (number) {
    return number === 1 ? 'euro' : 'euro\'s'
  },
  currency: {
    symbol: '€'
  }
};

numeral.register('locale', 'nl', nlFormat);

// switch between locales
numeral.locale('nl')

Vue.filter('formatNumberMoney', function (value: number) {
  return numeral(value).format('0,0.00')
})

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  options: {
    customProperties: true
  }
});



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
        primary: colors.grey.darken1, // #E53935
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

