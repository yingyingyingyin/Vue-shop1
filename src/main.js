// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import { Message } from 'element-ui';
Vue.use(axios)
Vue.use(ElementUI)



axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.config.productionTip = false
//axios请求拦截器
axios.interceptors.request.use(config=>{
  //为请求头对象，添加Token认证的Authorization字段
  config.headers.Authorization=window.sessionStorage.getItem('token');
  console.log(config);
  return config;
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
