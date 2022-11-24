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
        <div class="device rounded"
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
          <div class="col-sm-12 col-md-12 col-lg-3 mb-3" v-for="m in operators">
            <div
              class="item position-relative shadow"
              :class="{ active: itemSelect.name == m.name }"
              @click="() => this.itemSelect = m">
              <div class="position-absolute top-0 start-50 translate-middle badge rounded-pill badge text-bg-light">
                {{ m.name }}
              </div>
              <h2 class="mt-2">
                {{ this.indicate(m) }}
                {{ this.symbol() }}
              </h2>
              <img src="@/assets/operator.png" alt="Devices" width="110" class="mt--5"/>
            </div>
          </div>
        </div>

        <div class="card-body p-1" style="z-index: 99; background-color: #FFF;">
          <LineComponent
            :field="field"
            :main="itemSelect"
          />
          <QuaLineComponent
            v-if="(field === 'qual_score') && itemSelect.name !== customer.name"
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
        :callback="(v) => this.field = v">
        <SelectComponent
          :options="operators"
          :main="customer"
          :callback="(v) => this.itemSelect = v"
          :selected="itemSelect"
        />
      </SidebarComponent>
    </template>

  </LayoutMain>
</template>

<script>
  import { mapState } from 'vuex'
  import moment from 'moment'
  import help from '../../../scorecharts/helpers'
  import LayoutMain from '../../../scorecharts/layouts/Main.vue'
  import Header from '../../../components/scorecharts/Header.vue'
  import DateRanger from '../../../components/scorecharts/DateRanger.vue'
  import SidebarComponent from '../../../components/scorecharts/Sidebar.vue'
  import LineComponent from '../../../components/scorecharts/LineFooter.vue'
  import SelectComponent from '../../../components/scorecharts/Select.vue'
  import QuaLineComponent from '../../../components/scorecharts/QuaLineFooter.vue'

  export default {
    components: {
      SidebarComponent,
      LineComponent,
      LayoutMain,
      Header,
      DateRanger,
      SelectComponent,
      QuaLineComponent,
    },
    data() {
      return {
        field: 'total_exams',
        itemSelect: {},
        range: { start: null, end: null },
        options: [],
      }
    },
    created() {
      this.range.start = moment().subtract(1, 'months').format('YYYY-MM-DD')
      this.range.end = moment().format('YYYY-MM-DD')
      this.handleInit(this.range.start, this.range.end)
    },
    computed: mapState({
      customer: state => state.customer,
      operators: state => state.operators,
      // device: state => state.main,
      operatorParams () {
        return {
          customer: this.itemSelect.customer_name,
          unitName: this.itemSelect.unit_name,
          deviceName: this.device.name,
        }
      },
      getField () { return `_${this.field}` },
    }),
    methods: {
      handleInit (start='', end='') {
        // Main Store
        this.$store.dispatch('fetch', { name: this.$route.params.customer, start, end })

        this.$store.dispatch('fetchOperators', {
          name: this.$route.params.customer,
          start,
          end,
        })

        // Order
        this.operators.sort((a, b) =>  b[this.getField].max-a[this.getField].max)

        this.itemSelect = this.customer
      },

      symbol () { return help.symbol(this.field) },

      indicate (item) {
        let f = this.field
        let str = item[`_${f}`].avg

        if (f === 'total_exams') str = help.totalExams(item)
        if (f === 'safety_score') str = item[`_${f}`].max

        return str
      },
    },
  }
</script>
