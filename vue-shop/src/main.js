import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.filter("dateFormat", function(orig){
	const dt = new Date(orig);
	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2,'0')
	const d = (dt.getDate() + '').padStart(2,'0')
	const hh = (dt.getHours() + '').padStart(2,'0')
	const mm= (dt.getMinutes() + '').padStart(2,'0')
	const ss = (dt.getSeconds() + '').padStart(2,'0')
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
