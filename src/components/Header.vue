<template>
  <nav class="navbar navbar-expand-lg bg-light shadow sticky-top">
    <div class="container-fluid">
      <router-link
        v-if="customer"
        :to="{ name: 'customer', params: { customer: customer } }"
        class="navbar-brand">
        <img src="@/assets/aquila.jpg" :alt="customer" width="40" height="40" />
        Customer {{ customer }}
      </router-link>

      <router-link
        v-if="!customer"
        :to="{ name: 'home' }"
        class="navbar-brand">
        <img src="@/assets/aquila.jpg" width="40" height="40" />
        List Customers
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- Units -->
          <li class="nav-item" v-if="unit">
            <router-link
              :to="{ name: 'customer', params: { customer : customer, unitName: unit }}"
              class="nav-link text-truncate"
              :title="unit"
            >
              <i class="bi bi-caret-right-fill"></i>
              {{ unit }}
            </router-link>
          </li>
          <li class="nav-item" v-if="unit">
            <span class="nav-link text-truncate disabled">
              <i class="bi bi-caret-right-fill"></i>
              Devices
            </span>
          </li>

          <li class="nav-item" v-if="device">
            <router-link
              :to="{ name: 'devices', params: { customer : customer, unitName: unit}}"
              class="nav-link text-truncate"
              :title="device"
            >
              <i class="bi bi-caret-right-fill"></i>
              {{ device }}
            </router-link>
          </li>
          <li class="nav-item" v-if="device">
            <span class="nav-link text-truncate disabled">
              <i class="bi bi-caret-right-fill"></i>
              Operators
            </span>
            <!-- <ul class="dropdown-menu">
              <li>
                <router-link
                  :to="{ name: 'operators', params: {
                    customer,
                    unitName: unit,
                    deviceName: device,
                  }}"
                  class="dropdown-item"
                >
                  List Operators
                </router-link>
              </li>
              <li>
                <router-link
                  :to="{ name: 'OperatorXY', params: {
                    customer,
                    unitName: unit,
                    deviceName: device,
                  }}"
                  class="dropdown-item"
                >
                  XY to Operators
                </router-link>
              </li>
            </ul> -->
          </li>

        </ul>
        <slot></slot>
      </div>
    </div>
  </nav>
</template>

<script>
import DateRanger from './DateRanger.vue'
export default {
  components: {DateRanger},
  props: {
    customer: {
      type: Number,
      required: false,
    },

    unit: {
      type: String,
      required: false,
    },

    device: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      dates: null,
    }
  },
}
</script>