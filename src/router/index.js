import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/scorecharts/HomeView.vue'
import UnitsView from '../views/scorecharts/UnitsView.vue'
import DevicesView from '../views/scorecharts/DevicesView.vue'
import OperatorsView from '../views/scorecharts/OperatorsView.vue'
import GridView from '../views/scorecharts/GridView.vue'
// lists
import ListDevicesView from '../views/scorecharts/Lists/DevicesView.vue'
import ListOperatorsView from '../views/scorecharts/Lists/OperatorsView.vue'

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
      path: '/:customer/grid',
      name: 'grid',
      component: GridView,
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
  ]
})

export default router
