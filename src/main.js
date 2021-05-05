import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import bindPrototype from '@/prototype'
import ECharts from "vue-echarts/dist/index.esm";

bindPrototype(Vue)

Vue.use(router)
Vue.use(ElementUI)
Vue.use(store)
Vue.use(ECharts)

Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  ECharts,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
