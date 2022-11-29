import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import Popper from 'vue3-popper'
import VCalendar from 'v-calendar'
import vSelect from 'vue-select'

import store from './scorecharts/store';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'v-calendar/dist/style.css'
import 'animate.css'
import 'vue-select/dist/vue-select.css'
import '@/assets/main.css'
import 'floating-vue/dist/style.css'

const app = createApp(App)

// Components
app.component('Popper', Popper)
app.component('v-select', vSelect)

// Use
app.use(VCalendar, {})
app.use(router)
app.use(store)
app.use(VueApexCharts)
app.mount('#app')
