import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import App from './App'
import store from './store'
import router from './router'

import VuePagination from "vuejs-paginate";
Vue.component("VuePagination", VuePagination);

require("@/style/main.scss")

import '@/permission'

Vue.use(ElementUI, { locale })

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
Vue.use(Toast);

Vue.config.productionTip = false

new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
