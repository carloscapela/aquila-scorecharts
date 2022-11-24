<template>
  <form class="d-flex" role="search" @submit.prevent>
    <v-date-picker
      v-model="range"
      mode="date"
      :masks="masks"
      is-range
    >
      <template v-slot="{ inputValue, inputEvents, isDragging }">
        <div class="btn-toolbar">
          <div class="btn-group btn-group-sm me-2" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-primary">
              <i class="bi bi-calendar-week"></i>
            </button>
            <button type="button" class="btn btn-outline-primary" v-on="inputEvents.start">
              {{ inputValue.start }}
            </button>
            <button type="button" class="btn btn-outline-primary" v-on="inputEvents.end">
              {{ inputValue.end }}
            </button>
          </div>
          <div class="me-2 btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" @click="handle()">
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
      </template>
    </v-date-picker>
  </form>
</template>

<script>
  export default {
    props: {
      handleSubmit: Function,
      start: '',
      end: '',
    },
    data() {
      return {
        range: { start: null, end: null },
        masks: { input: 'YYYY-MM-DD' },
      }
    },
    created() {
      if (this.end) this.range.end = this.end
      if (this.start) this.range.start = this.start
    },
    methods: {
      handle() {
        this.handleSubmit(this.range.start, this.range.end)
      },
      clear () { this.handleSubmit() }
    },
  }
</script>
