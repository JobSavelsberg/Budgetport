import Vue from "vue";
import { BootstrapVue, IconsPlugin }  from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false;

import App from "./App.vue"

new Vue({
  render: h => h(App)
}).$mount("#app");