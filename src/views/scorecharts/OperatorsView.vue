<template>
  <Spinner v-if="load"/>
  <LayoutMain v-else :customer="customer.name">
    <template #header>
      <Header
        :customer="customer.name"
        :unit="device ? device.unit_name : null"
        :device="device ? device.name : null"
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

        <div
          v-if="device"
          class="device rounded"
          @click="() => this.itemSelect = device"
          :class="{ active: itemSelect.name == device.name }"
        >
        </div>
        <div
          v-if="device"
          class="card-header link-primary pointer mb-4"
          style="z-index: 99;"
          @click="() => this.itemSelect = device"
        >
          Device: {{ device.name }}
        </div>

        <div class="row text-center justify-content-md-center">
          <div
            class="col-sm-12 col-md-12 col-lg-3 mb-3"
            v-for="m in operators"
          >
            <!-- Operator active -->
            <div
              v-if="this.indicate(m) > 0"
              class="item position-relative shadow"
              :class="{ active: itemSelect.name == m.name }"
              @click="() => {
                this.itemSelect = m
                this.setSeries(this.field)
              }">
              <div class="position-absolute top-0 start-50 translate-middle badge rounded-pill badge text-bg-light">
                {{ m.name }}
              </div>
              <h2 class="mt-2">
                {{ this.indicate(m) }}
                {{ this.symbol() }}
              </h2>
              <img src="@/assets/operator.png" alt="Devices" width="110" class="mt--5"/>
            </div>
            <!-- Operator disabled -->
            <div
              v-if="this.indicate(m) <= 0"
              class="item-disabled position-relative shadow"
              :class="{ active: itemSelect.name == m.name }">
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
          <!--Line to  DEVICE-->
          <LineBarComponent
            v-if="(itemSelect && itemSelect.name === device.name)"
            :field="field"
            :main="itemSelect"
          />
          <!--Line to OPERATOR-->
          <LineComponent
            v-if="(itemSelect && itemSelect.name !== device.name)"
            :field="field"
            :main="itemSelect"
            :options="options"
          />
          <QuaLineComponent
            v-if="(field === 'qual_score') && itemSelect && itemSelect.name !== device.name"
            :field="field"
            :main="itemSelect"
          />
        </div>
      </div>

    </template>

    <template #sidebar>
      <SidebarComponent
        :main="itemSelect ? itemSelect : device"
        :field="field"
        :callback="(v) => this.setSeries(v)">
        <SelectComponent
          :options="operators"
          :main="device"
          :callback="(v) => this.itemSelect = v"
          :selected="itemSelect ? itemSelect : device"
        />
      </SidebarComponent>
    </template>

  </LayoutMain>
</template>

<script>
  import help from '../../scorecharts/helpers'
  import LayoutMain from '../../scorecharts/layouts/Main.vue'
  import Header from '../../components/scorecharts/Header.vue'
  import DateRanger from '../../components/scorecharts/DateRanger.vue'
  import SidebarComponent from '../../components/scorecharts/Sidebar.vue'
  import LineComponent from '../../components/scorecharts/LineFooter.vue'
  import SelectComponent from '../../components/scorecharts/Select.vue'
  import LineBarComponent from '../../components/scorecharts/LineBarFooter.vue'
  import QuaLineComponent from '../../components/scorecharts/QuaLineFooter.vue'
  import Spinner from '../../components/scorecharts/Spinner.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      SidebarComponent,
      LineComponent,
      LayoutMain,
      Header,
      DateRanger,
      SelectComponent,
      LineBarComponent,
      QuaLineComponent,
      Spinner,
    },
    data() {
      return {
        field: 'total_exams',
        range: { start: null, end: null },
        options: [],
        operators: [],
        itemSelect: null,
        device: null,
      }
    },
    computed: mapState({
      customer: state => state.customer,
      operatorsFetch: state => state.operators,
      load: state => state.dataLoad,
      devices: state => state.devices,
      data: state => state.data, // get all operators
      getField () { return `_${this.field}` },
    }),
    created() {
      this.range = help.queryDate(this.$route.query)
      this.fetch()
    },
    updated () {
      this.handleDevices()
      this.handleOperators()
      this.handleItemSelect()
    },
    methods: {
      fetch () {
        // Main Store
        this.$store.dispatch('fetchApi', {
          name: this.$route.params.customer,
          start: this.range.start,
          end: this.range.end,
        })
      },
      // 01
      handleDevices () {
        this.$store.dispatch('fetchDevices', {
          name: this.$route.params.customer,
          unitName: this.$route.params.unitName,
        })

        this.devices.sort((a, b) =>
          b[`_${help.getKeyScore(a)}`].avg - a[`_${help.getKeyScore(a)}`].avg
        )
      },
      // 02
      handleOperators () {
        this.$store.dispatch('fetchOperators', {
          name: this.$route.params.customer,
        })
        // filter to diveceName
        this.operators = this.operatorsFetch.filter(op => op.operator_name.includes(this.$route.params.deviceName))
        // Order
        this.operators.sort((a, b) =>  b[this.getField].max-a[this.getField].max)
      },
      // 03
      handleItemSelect () {
        this.device = this.devices.find(device => device.name === this.$route.params.deviceName)
        this.itemSelect = this.device
      },

      setSeries (field) {
        let options = []
        this.field = field

        this.itemSelect.operator_name.map((name, i) => {
          if (name === this.$route.params.deviceName) {
            console.log(this.itemSelect[field][i])
            options.push(this.itemSelect[field][i])
          }
        })

        this.options = options
      },

      symbol () { return help.symbol(this.field) },

      indicate (item) {

        let f = this.field
        let str = item[`_${f}`].avg

        if (f === 'total_exams') str = help.totalExams(item)
        if (f === 'safety_score') str = item[`_${f}`].max
        if (str <= 0) str = 0

        return str
      },
    },
  }
</script>
