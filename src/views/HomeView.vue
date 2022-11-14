<template>
  <LayoutMain>
    <div class="row justify-content-md-center">
      <div class="col">
        <img
          src="@/assets/aquila.jpg"
          class="rounded mx-auto d-block animate__animated animate__bounce"
          width="200"
        />
      </div>
    </div>
  </LayoutMain>
</template>

<script>
  import LayoutMain from '../layouts/Main.vue'

  export default {
    components: {
      LayoutMain,
    },
    created() {
      this.$store.dispatch('fetch', 9)
      console.log( this.$store.state.customer )
    },
  }
</script>