<template>
  <nav class="navbar navbar-expand-lg bg-light shadow sticky-top">
    <div class="container-fluid">

      <button class="btn btn-link" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">
        <i class="bi bi-list"></i>
      </button>

      <span
        v-if="customer"
        class="navbar-brand">
        Customer {{ customer }}
      </span>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <!-- Units -->
          <li class="nav-item" v-if="unit">
            <router-link
              :to="{ name: 'customer', params: { customer : customer, unitName: unit }, query: range}"
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
              :to="{ name: 'devices', params: { customer : customer, unitName: unit}, query: range }"
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
          </li>
        </ul>
        <slot></slot>
      </div>
    </div>
  </nav>
</template>

<script>
import help from '../../scorecharts/helpers'

export default {
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
      range: {},
    }
  },
  created() {
    this.range = help.queryDate(this.$route.query)
  },
}
</script>