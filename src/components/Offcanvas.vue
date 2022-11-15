<template>
  <div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasScrollingLabel">
        <img src="@/assets/aquila.jpg" :alt="customer" width="40" height="40" />
        Customer {{ customer }}
      </h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <ul class="nav flex-column">
            <li class="nav-item">
              <router-link
                v-if="customer"
                :to="{ name: 'customer', params: { customer: customer } }"
                class="nav-link">
                  <i class="bi bi-house"></i>
                  Units
              </router-link>
            </li>
            <li class="nav-item">
                <a class="nav-link disabled" href="#">
                  <i class="bi bi-house-heart"></i>
                  Devices
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link disabled" href="#">
                  <i class="bi bi-people"></i>
                  Operators
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link disabled">
                  <i class="bi bi-graph-up-arrow"></i>
                  Chart XY
                </a>
            </li>
        </ul>
        <!-- <p>Try scrolling the rest of the page to see this option in action.</p> -->
    </div>
</div>
</template>

<script>
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
    }
  },
}
</script>