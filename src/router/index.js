import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UnitsView from '../views/UnitsView.vue'
import DevicesView from '../views/DevicesView.vue'
import OperatorsView from '../views/OperatorsView.vue'
// lists
import ListDevicesView from '../views/Lists/DevicesView.vue'
import ListOperatorsView from '../views/Lists/OperatorsView.vue'

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
      component: UnitsView,
    },
    {
      path: '/:customer/unit/:unitName/devices',
      name: 'devices',
      component: DevicesView,
    },
    {
      path: '/:customer/unit/:unitName/devices/:deviceName',
      name: 'operators',
      component: OperatorsView,
    },
    // Lists
    {
      path: '/:customer/list-devices',
      name: 'ListDevices',
      component: ListDevicesView,
    },
    {
      path: '/:customer/list-operators',
      name: 'ListOperators',
      component: ListOperatorsView,
    },
    // {
    //   path: '/:customer/unit/:unitName/devices/:deviceName/xy',
    //   name: 'OperatorXY',
    //   component: OperatorGridView,
    // },
  ]
})

export default router
