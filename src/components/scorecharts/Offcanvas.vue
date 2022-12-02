<template>
  <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasScrollingLabel">
        <img src="@/assets/aquila.png" :alt="customer" width="40" height="40" />
        Customer {{ customer }}
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <ul class="nav flex-column">
        <li class="nav-item">
          <a
            class="nav-link"
            :href="`/${customer}`"
            v-if="customer"
          >
            <i class="bi bi-house"></i>
            Units
          </a>
        </li>
        <li class="nav-item">
          <router-link
            v-if="customer"
            :to="{ name: 'ListDevices', params: { customer: customer }, query: range}"
            class="nav-link"
          >
            <i class="bi bi-house-heart"></i>
            Devices
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="customer"
            :to="{ name: 'ListOperators', params: { customer: customer }, query: range}"
            class="nav-link"
          >
            <i class="bi bi-people"></i>
            Operators
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-if="customer"
            :to="{ name: 'grid', params: { customer: customer }, query: range }"
            class="nav-link"
          >
            <i class="bi bi-graph-up-arrow"></i>
            Chart XY
          </router-link>
        </li>
    </ul>
  </div>
</div>
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