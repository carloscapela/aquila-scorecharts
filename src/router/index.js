import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UnitView from '../views/UnitView.vue'
import DevicesView from '../views/DevicesView.vue'
import OperatorView from '../views/OperatorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:customer/:unitName?',
      name: 'customer',
      component: UnitView,
    },
    {
      path: '/:customer/unit/:unitName/devices',
      name: 'devices',
      component: DevicesView,
    },
    {
      path: '/:customer/unit/:unitName/devices/:deviceName',
      name: 'operators',
      component: OperatorView,
    },
    // {
    //   path: '/:customer/unit/:unitName/devices/:deviceName/xy',
    //   name: 'OperatorXY',
    //   component: OperatorGridView,
    // },
  ]
})

export default router
