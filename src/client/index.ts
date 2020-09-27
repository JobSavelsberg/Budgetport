import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import colors from 'vuetify/lib/util/colors'
import numeral from 'numeral'
import VueNestable from 'vue-nestable'
import store from "./store";
import router from './routes'
import firebase from "firebase";
import path from "path";

console.log(process.env);
firebase.initializeApp({
  apiKey: "AIzaSyB3U6fHT8OlUvE_a9ka2zrqCz2fsm7Jx-s",
  authDomain: "budgetport-2644b.firebaseapp.com",
  databaseURL: "https://budgetport-2644b.firebaseio.com",
  projectId: "budgetport-2644b",
  storageBucket: "budgetport-2644b.appspot.com",
  messagingSenderId: "476483402040",
  appId: "1:476483402040:web:6339e994033acf70ef69cd",
  measurementId: "G-5KNJ3R7QT7"
})

firebase.auth().onAuthStateChanged(user => {
  store.dispatch("fetchUser", user);
  console.log("Dispatching user to store", user);
});

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

Vue.use(VueNestable)


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
  store: store,
  router: router,
  vuetify,
  render: h => h(App)
}).$mount("#app");

