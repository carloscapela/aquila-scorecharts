<template>
  <form class="d-flex" role="search" @submit.prevent>
    <v-date-picker
      v-model="range"
      mode="date"
      :masks="masks"
      is-range
    >
      <template v-slot="{ inputValue, inputEvents, isDragging }">
        <div class="row g-3">
          <div class="col-5">

            <div class="input-group">
              <div class="input-group-text">
                <i class="bi bi-calendar-week"></i>
              </div>
              <input
                class="form-control"
                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                :value="inputValue.start"
                v-on="inputEvents.start"
              />
            </div>
          </div>

          <div class="col-5">
            <div class="input-group">
              <div class="input-group-text">
                <i class="bi bi-calendar-week"></i>
              </div>
              <input
                class="form-control"
                :class="isDragging ? 'text-gray-600' : 'text-gray-900'"
                :value="inputValue.end"
                v-on="inputEvents.end"
              />
            </div>
          </div>

          <div class="col-2 btn-group">
            <button class="btn btn-outline-secondary" @click="handle()">
              <i class="bi bi-search"></i>
            </button>
            <button
              class="btn btn-outline-secondary"
              type="reset"
              :disabled="(!inputValue.end && !inputValue.start)"
              @click="clear()"
            >
              <i class="bi bi-trash3"></i>
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
    },
    data() {
      return {
        range: {
          start: null,
          end: null,
        },
        masks: {
          input: 'YYYY-MM-DD',
        },
      }
    },
    methods: {
      handle() {
        this.handleSubmit(this.range.start, this.range.end)
      },
      clear () { this.handleSubmit('', '') }
    },
  }
</script>
