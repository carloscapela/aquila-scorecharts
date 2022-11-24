<template>
  <LayoutMain :customer="customer.name">
    <template #header>
      <Header
        :customer="customer.name"
      >
        <DateRanger
          :handle-submit="handleInit"
          :start="range.start"
          :end="range.end"
        />
      </Header>
    </template>

    <template #content>
      <div class="card position-relative">

        <div class="unit rounded"
          @click="() => this.itemSelect = customer"
          :class="{ active: itemSelect.name == customer.name }"
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
              :class="{ active: itemSelect.name == m.name }"
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
            v-if="itemSelect.name === this.customer.name"
            :field="field"
            :main="itemSelect"
          />
          <LineBarComponent
            v-if="itemSelect.name !== this.customer.name"
            :field="field"
            :main="itemSelect"
          />
        </div>
      </div>
    </template>

    <template #sidebar>
      <SidebarComponent
        :main="itemSelect"
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
          :selected="itemSelect"
        />
      </SidebarComponent>
    </template>

  </LayoutMain>
</template>

<script>
  import moment from 'moment'
  import { mapState } from 'vuex'
  import help from '../../../scorecharts/helpers'
  import LayoutMain from '../../../scorecharts/layouts/Main.vue'
  import DateRanger from '../../../components/scorecharts/DateRanger.vue'
  import Header from '../../../components/scorecharts/Header.vue'
  import SidebarComponent from '../../../components/scorecharts/Sidebar.vue'
  import LineComponent from '../../../components/scorecharts/LineFooter.vue'
  import LineBarComponent from '../../../components/scorecharts/LineBarFooter.vue'
  import SelectComponent from '../../../components/scorecharts/Select.vue'

  export default {
    components: {
      SidebarComponent,
      LineComponent,
      LayoutMain,
      Header,
      DateRanger,
      SelectComponent,
      LineBarComponent,
    },
    data() {
      return {
        itemSelect: {},
        field: 'total_exams',
        range: { start: null, end: null }
      }
    },
    computed: mapState({
      customer: state => state.customer,
      devices: state => state.devices,
    }),
    created() {
      this.range.start = moment().subtract(1, 'months').format('YYYY-MM-DD')
      this.range.end = moment().format('YYYY-MM-DD')
      this.handleInit(this.range.start, this.range.end)
    },
    methods: {
      handleInit (start='', end='') {

        this.$store.dispatch('fetch', {
          name: this.$route.params.customer,
          start,
          end,
        })

        this.$store.dispatch('fetchDevices', {
          name: this.$route.params.customer,
        })

        // Order
        this.devices.sort((a, b) =>
          b[`_${help.getKeyScore(a)}`].max - a[`_${help.getKeyScore(a)}`].max
        )

        this.itemSelect = this.customer
      },

      symbol () { return help.symbol(this.field) },

      indicate (item) {
        const f = this.field
        return f=== 'total_exams' ? help.totalExams(item) : item[`_${f}`].avg
      },
    },
  }
</script>
