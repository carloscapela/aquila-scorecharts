<template>
  <Spinner v-if="load" />
  <LayoutMain v-else :customer="customer.name">
    <template #header>
      <Header
        :customer="customer.name"
        :unit="unit ? unit.name : null"
      >
      <!--  -->
        <DateRanger
          :start="range.start"
          :end="range.end"
        />
      </Header>
    </template>

    <template #content>
      <div class="card position-relative">

        <div
          class="unit rounded"
          v-if="unit"
          @click="() => this.itemSelect = unit"
          :class="{ active: itemSelect.name == unit.name }"
        ></div>

        <div
          v-if="unit"
          class="card-header link-primary pointer mb-4"
          style="z-index: 99;"
          @click="() => this.itemSelect.name = unit.name"
        >
          Unit: {{ unit.name }}
        </div>

        <div class="row text-center justify-content-md-center">
          <div class="col-sm-12 col-md-12 col-lg-3 mb-3" v-for="m in devices">
            <div
              class="item position-relative shadow"
              :class="{ active: itemSelect.name == m.name }"
              @click="() => this.itemSelect = m">
              <div class="position-absolute top-0 start-50 translate-middle badge rounded-pill badge text-bg-light">
                Device: {{ m.name }}
              </div>
              <h2 class="mt-2">
                {{ this.indicate(m) }}
                {{ this.symbol() }}
              </h2>
              <img src="@/assets/mammography.png" alt="Devices" width="110" />
              <br>
              <router-link :to="{ name: 'operators', params: operatorParams(m.name), query: this.range }">
                Operators
              </router-link>
            </div>
          </div>
        </div>

        <div class="card-body p-2" style="z-index: 99; background-color: #FFF;">
          <LineComponent
            v-if="(itemSelect && itemSelect.name === unit.name)"
            :field="field"
            :main="itemSelect ? itemSelect : unit"
          />
          <LineBarComponent
            v-if="(itemSelect && itemSelect.name !== unit.name)"
            :field="field"
            :main="itemSelect ? itemSelect : unit"
          />
        </div>
      </div>
    </template>

    <template #sidebar>
      <SidebarComponent
        :main="itemSelect ? itemSelect : unit"
        :field="field"
        :callback="(v) => this.field = v"
      >
        <SelectComponent
          :options="devices"
          :main="unit"
          :callback="(v) => {
            this.itemSelect = v
            this.field = field
          }"
          :selected="itemSelect ? itemSelect : unit"
        />
      </SidebarComponent>
    </template>

  </LayoutMain>
</template>

<script>
  import LayoutMain from '../../scorecharts/layouts/Main.vue'
  import help from '../../scorecharts/helpers'
  import DateRanger from '../../components/scorecharts/DateRanger.vue'
  import Header from '../../components/scorecharts/Header.vue'
  import SidebarComponent from '../../components/scorecharts/Sidebar.vue'
  import LineComponent from '../../components/scorecharts/LineFooter.vue'
  import LineBarComponent from '../../components/scorecharts/LineBarFooter.vue'
  import SelectComponent from '../../components/scorecharts/Select.vue'
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
      Spinner,
    },
    data() {
      return {
        field: 'total_exams',
        range: { start: null, end: null },
        itemSelect: null,
        unit: null,
      }
    },
    computed: mapState({
      customer: state => state.customer,
      devices: state => state.devices,
      units: state => state.units,
      load: state => state.dataLoad,
    }),
    created() {
      this.range = help.queryDate(this.$route.query)
      this.fetch()
    },
    updated () {
      this.handleItemSelect()
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

      handleItemSelect () {
        this.unit = this.units.find(unit => unit.name === this.$route.params.unitName)
        this.itemSelect = this.unit
      },

      handleDevices () {
        this.$store.dispatch('fetchDevices', {
          name: this.$route.params.customer,
          unitName: this.$route.params.unitName,
        })

        this.devices.sort((a, b) =>
          b[`_${help.getKeyScore(a)}`].avg - a[`_${help.getKeyScore(a)}`].avg
        )
      },

      operatorParams (deviceName = '') {
        return {
          customer: this.itemSelect.customer_name,
          unitName: this.itemSelect.unit_name,
          deviceName: deviceName,
        }
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
