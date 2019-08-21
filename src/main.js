import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
console.log(process.env.API_KEY)
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
