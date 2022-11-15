<template>
  <LayoutMain>
    <template #header>
      <Header
        :customer="device.customer_name"
        :unit="device.unit_name"
        :device="device.name"
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
          @click="() => this.itemSelect = device"
          :class="{ active: itemSelect.name == device.name }"
        ></div>

        <div
          class="card-header link-primary pointer mb-4"
          style="z-index: 99;"
          @click="() => this.itemSelect = device">
          Device: {{ device.name }}
        </div>

        <div class="row text-center justify-content-md-center">
          <div class="col-sm-12 col-md-12 col-lg-3 mb-3" v-for="m in operators">
            <div
              class="item position-relative shadow"
              :class="{ active: itemSelect.name == m.name }"
              @click="() => itemSelect = m">
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

        <div class="card-body" style="z-index: 99; background-color: #FFF;">
          <LineComponent
            v-if="itemSelect.name !== device.name"
            :field="field"
            :main="itemSelect"
          />
          <LineBarComponent
            v-if="itemSelect.name === device.name"
            :field="field"
            :main="itemSelect"
          />
          <QuaLineComponent
            v-if="(field === 'qual_score') && itemSelect.name !== device.name"
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
          :main="device"
          :callback="(v) => this.itemSelect = v"
          :selected="itemSelect"
        />
      </SidebarComponent>
    </template>

  </LayoutMain>
</template>

<script>
  import moment from 'moment'
  import help from '../helpers'
  import Header from '../components/Header.vue'
  import DateRanger from '../components/DateRanger.vue'
  import LayoutMain from '../layouts/Main.vue'
  import SidebarComponent from '../components/Sidebar.vue'
  import LineComponent from '../components/LineFooter.vue'
  import SelectComponent from '../components/Select.vue'
  import LineBarComponent from '../components/LineBarFooter.vue'
  import QuaLineComponent from '../components/QuaLineFooter.vue'
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
    },
    data() {
      return {
        field: '',
        itemSelect: {},
        range: {
          start: null,
          end: null,
        }
      }
    },
    created() {
      this.range.start = moment().subtract(1, 'months').format('YYYY-MM-DD')
      this.range.end = moment().format('YYYY-MM-DD')
      this.handleInit(this.range.start, this.range.end)
    },
    computed: mapState({
      devices: state => state.devices,
      operatorsStore: state => state.operators,
      operators () {
        const operators = this.operatorsStore.filter(m => m.operator_name.includes(this.device.name))
        operators.sort((a, b) =>  b[this.getField].max-a[this.getField].max)
        return operators
      },
      device () {
        return this.devices.find(d => d.name == this.$route.params.deviceName)
      },
      operatorParams () {
        return {
          customer: this.itemSelect.customer_name,
          unitName: this.itemSelect.unit_name,
          deviceName: this.device.name,
        }
      },
      getField () {
        return `_${this.field}`
      },
    }),
    methods: {
      handleInit (start='', end='') {
        this.$store.dispatch('fetch', { name: this.$route.params.customer, start, end })
        // selected ITEM
        this.itemSelect = this.itemSelect.name ? this.itemSelect : this.device
        // init Sidebar
        this.field = help.getKeyScore(this.itemSelect)
      },
      symbol () {
        return help.symbol(this.field)
      },
      indicate (item) {
        const field = this.field
        return field === 'total_exams' ? item[`_${field}`].total : item[`_${field}`].avg
      },
    },
  }
</script>
