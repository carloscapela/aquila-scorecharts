<template>
  <LayoutMain>
    <template #header>
      <Header />
    </template>

    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-3 mb-4" v-for="m in customers">
        <div class="card">
          <div class="card-header">
            <h5>Customer - {{ m.name }}</h5>
          </div>
          <!-- <div class="card-body"> -->
            <table class="table table-striped table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th>Min</th>
                  <th>AVG</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(v, i) in scores">
                  <th>{{ v }}</th>
                  <td>{{ m[`_${i}`].min }}</td>
                  <td>{{ m[`_${i}`].avg }}</td>
                  <td>{{ m[`_${i}`].max }}</td>
                </tr>
                <tr>
                  <td colspan="4">
                    <div class="input-group">
                      <label class="input-group-text" for="inputGroupFile01">Units</label>
                      <select
                        class="form-select"
                        id="inputGroupSelect04"
                        aria-label="Example select with button addon"
                        @input="event => linkName = event.target.value"
                        >
                        <option></option>
                        <option v-for="unit in m.units">{{ unit.name }}</option>
                      </select>
                      <router-link
                        :to="{ name: 'customer', params: { customer : m.name, unitName: linkName }}"
                        class="btn btn-outline-secondary"
                        :class="{ disabled: !linkName }"
                      >
                        <i class="bi bi-box-arrow-up-right"></i>
                      </router-link>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

          <!-- <div class="card-body"> -->
            <div class="d-grid gap-2 p-2">
              <router-link
                :to="{ name: 'customer', params: { customer: m.name } }"
                class="btn btn-primary"
              >
                <i class="bi bi-box-arrow-up-right"></i>
                Go to customer
              </router-link>
            </div>
          <!-- </div> -->

        </div>
      </div>
    </div>
  </LayoutMain>
</template>

<script>
  import Header from '../components/Header.vue'
  import Customer from '../models/Customer'
  import LayoutMain from '../layouts/Main.vue'
  import {labels} from '../helpers/util'

  export default {
    components: {
      LayoutMain,
      Header,
    },
    data() {
      return {
        customers: [],
        itemSelect: {},
        linkName: '',
      }
    },
    created() {
      this.handleInit()
    },
    methods: {
      handleInit () {
        this.customers = (new Customer).all()
      },
    },
    setup() {
      const scores = labels()

      return { scores }
    }
  }
</script>
