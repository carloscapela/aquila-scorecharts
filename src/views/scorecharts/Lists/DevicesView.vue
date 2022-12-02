<template>
  <Spinner v-if="load" />

  <LayoutMain v-else :customer="customer.name">
    <template #header>
      <Header :customer="customer.name">
        <DateRanger
          :start="range.start"
          :end="range.end"
        />
      </Header>
    </template>

    <template #content>
      <div class="card position-relative">

        <div class="unit rounded"
          @click="() => this.itemSelect = customer"
          :class="{ active: itemSelect && itemSelect.name == customer.name }"
        >
        </div>

        <div
          class="card-header link-primary pointer mb-4"
          style="z-index: 99;"
          @click="() => this.itemSelect = customer"
        >
          Customer: {{ customer.name }}
        </div>

        <div class="row text-center justify-content-md-center">
          <div class="col-sm-12 col-md-12 col-lg-3 mb-3" v-for="m in devices">
            <div
              class="item position-relative shadow"
              :class="{ active: itemSelect && itemSelect.name == m.name }"
              @click="() => this.itemSelect = m"
            >
              <div class="position-absolute top-0 start-50 translate-middle badge rounded-pill badge text-bg-light">
                Device: {{ m.name }}
              </div>
              <h2 class="mt-2">
                {{ this.indicate(m) }}
                {{ this.symbol() }}
              </h2>
              <img src="@/assets/mammography.png" alt="Devices" width="110" />
            </div>
          </div>
        </div>

        <div class="card-body p-2" style="z-index: 99; background-color: #FFF;">
          <LineComponent
            v-if="itemSelect && itemSelect.name === this.customer.name"
            :field="field"
            :main="itemSelect"
          />
          <LineBarComponent
            v-if="itemSelect && itemSelect.name !== this.customer.name"
            :field="field"
            :main="itemSelect"
          />
        </div>
      </div>
    </template>

    <template #sidebar>
      <SidebarComponent
        :main="itemSelect ? itemSelect : customer"
        :field="field"
        :callback="(v) => this.field = v"
      >
        <SelectComponent
          :options="devices"
          :main="customer"
          :callback="(v) => {
            this.itemSelect = v
            this.field = field
          }"
          :selected="itemSelect ? itemSelect : customer"
        />
      </SidebarComponent>
    </template>

  </LayoutMain>
</template>

<script>
  import { mapState } from 'vuex'
  import help from '../../../scorecharts/helpers'
  import LayoutMain from '../../../scorecharts/layouts/Main.vue'
  import DateRanger from '../../../components/scorecharts/DateRanger.vue'
  import Header from '../../../components/scorecharts/Header.vue'
  import SidebarComponent from '../../../components/scorecharts/Sidebar.vue'
  import LineComponent from '../../../components/scorecharts/LineFooter.vue'
  import LineBarComponent from '../../../components/scorecharts/LineBarFooter.vue'
  import SelectComponent from '../../../components/scorecharts/Select.vue'
  import Spinner from '../../../components/scorecharts/Spinner.vue'

  export default {
    components: {
      SidebarComponent,
      LineComponent,
      LayoutMain,
      Header,
      DateRanger,
      SelectComponent,
      LineBarComponent,
      Spinner,
    },
    data() {
      return {
        itemSelect: null,
        field: 'total_exams',
        range: { start: null, end: null },
        devices: [],
      }
    },
    computed: mapState({
      customer: state => state.customer,
      devicesFetch: state => state.devices,
      load: state => state.dataLoad,
    }),

    created() {
      this.range = help.queryDate(this.$route.query)
      this.fetch()
    },

    updated() {
      this.handleDevices()
    },

    methods: {
      fetch () {
        this.$store.dispatch('fetchApi', {
          name: this.$route.params.customer,
          start: this.range.start,
          end: this.range.end,
        })
      },

      handleDevices() {
        this.$store.dispatch('fetchDevices', {
          name: this.$route.params.customer,
        })

        this.devices = this.devicesFetch.sort((a, b) =>
          a[`_${help.getKeyScore(a)}`].avg - b[`_${help.getKeyScore(a)}`].avg
        ).reverse()
        // Set itemSelect
        this.itemSelect = this.customer
      },

      symbol () {
        return help.symbol(this.field)
      },

      indicate (item) {
        const f = this.field
        return f=== 'total_exams' ? help.totalExams(item) : item[`_${f}`].avg
      },
    },
  }
</script>
