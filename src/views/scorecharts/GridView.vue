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

      <!-- SELECT conditions -->
      <div class="row mb-2">
        <div class="col-sm-12 col-md-4 col-lg-4">

          <div
            class="card border pointer"
            :class="{ 'text-success border-success':this.input==='units'}"
            @click="() => {
              this.input = 'units'
              this.options = this.units
              if (this.unit) this.options = [this.unit]
              this.device = null
              this.operator = null
            }"
          >
            <div class="card-body text-center p-2">
              <h5 class="card-title">
                Units <span class="badge bg-secondary float-end">{{ this.units.length }}</span>
              </h5>
              <v-select
                :options="units"
                v-model="unit"
                :get-option-label="(op) => op.name"
                class="mt-2"
                :disabled="(input!=='units')"
              ></v-select>
            </div>
          </div>
        </div>



        <div class="col-sm-12 col-md-4 col-lg-4">
          <div
            class="card border pointer"
            :class="{'text-primary border-primary': this.input==='devices'}"
            @click="handleClickDevice"
          >
            <div class="card-body text-center p-2">
              <h5 class="card-title">
                Devices
                <span class="badge bg-secondary float-end">{{ this.devices.length }}</span>
              </h5>
              <v-select
                :options="devices"
                v-model="device"
                :get-option-label="(op) => op.name"
                class="mt-2"
                :disabled="input!=='devices'"
              ></v-select>
            </div>
          </div>
        </div>

        <div class="col-sm-12 col-md-4 col-lg-4">
          <div
            class="card border pointer"
            :class="{'text-secondary border-secondary' : this.input==='operators'}"
            @click="() => {
              this.getOperators()
              this.options = this.operators
              if (this.operator) this.options = [this.operator]
              this.input = 'operators'
            }"
          >
            <div class="card-body text-center p-2">
              <h5 class="card-title">
                Operators
                <span class="badge bg-secondary float-end">{{ this.operators.length }}</span>
              </h5>
              <v-select
                :options="operators"
                v-model="operator"
                :get-option-label="(op) => op.name"
                class="mt-2"
                :disabled="(input!=='operators')"
              ></v-select>
            </div>
          </div>
        </div>

      </div>
      <!-- END SELECT conditions -->

      <div class="card">
        <div class="position-relative" style="overflow: hidden;">
          <Popper
            v-if="options.length"
            class="position-absolute"
            v-for="m in options"
            :hover="true"
            :style="Object.assign({
              left: getPostion(m, field.x) + '%',
              bottom: getPostion(m, field.y)-6 + '%',
              transition: 'all 300ms',
            })"
          >
            <div
              class="position-absolute translate-middle rounded-pill img shadow  bg-opacity-50 text-center  align-middle"
              :style="Object.assign({
                left: getPostion(m, field.x) + '%',
                bottom: getPostion(m, field.y)-6 + '%',
                transition: 'all 300ms',
              }, getDimension(m))"
              :class="{
                'bg-success' : this.input==='units',
                'bg-primary' : this.input==='devices',
                'bg-secondary' : this.input==='operators',
              }"
            >
              <small class="badge text-bg-light ml--5" style="margin-top: 30%">
                <span v-if="this.input==='operators'">
                  {{ m.name.split('^')[0] }}
                </span>
                <span v-else>
                  {{ m.name.split(' ')[0] }}
                </span>
              </small>
            </div>
            <template #content>
              <div class="card" style="width: 18rem;">
                <div class="card-header">
                  {{ m.name.replace('^', ' ') }}
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">
                    <span class="badge text-bg-secondary">X axis</span>
                    {{ this.scoreLabel(field.x) }}:
                    {{ m[`_${field.x}`].avg }}
                    ({{ getPostion(m, field.x) + '%' }})
                  </li>
                  <li class="list-group-item">
                    <span class="badge text-bg-warning">Y axis</span>
                    {{ this.scoreLabel(field.y) }}:
                    {{ m[`_${field.y}`].avg }}
                    ({{ getPostion(m, field.y) + '%' }})
                  </li>
                </ul>
              </div>
            </template>
          </Popper>

          <!-- GRIDS -->
          <div
            v-for="r in [10,9,8,7,6,5,4,3,2,1]"
            class="row p-0 m-0"
            :class="{ eixox: r==6 }"
          >
            <div
              class="col grid text-end text-black-50"
              v-for="m in [1,2, 3,4,5,6,7,8,9,10]"
              :style="{ width: '10%', height: '80px' }"
              :class="{eixoy: m==5}">

              <small v-if="m === 1">
                {{ r*10 }}%
              </small>

              <small v-if="(r === 1) && (m != 1)">
                {{ m*10 }}%
              </small>

            </div>
          </div>
        </div>
        <div class="card-body p-1">
          <LineComponent
            :fieldX="field.x"
            :fieldY="field.y"
            :main="itemSelect ? itemSelect : customer"
          />
        </div>
      </div>
    </template>

    <template #sidebar>
      <SidebarComponent
        :main="itemSelect ? itemSelect : customer"
        :callbackX="(v) => this.setClickData(v)"
        :callbackY="(v) => this.setClickDataY(v)"
      />
    </template>
  </LayoutMain>
</template>

<script>
  import { mapState } from 'vuex'
  import help from '../../scorecharts/helpers'
  import LayoutMain from '../../scorecharts/layouts/Main.vue'
  import DateRanger from '../../components/scorecharts/DateRanger.vue'
  import Header from '../../components/scorecharts/Header.vue'
  import Spinner from '../../components/scorecharts/Spinner.vue'
  import SidebarComponent from '../../components/scorecharts/mult/Sidebar.vue'
  import LineComponent from '../../components/scorecharts/mult/LineFooter.vue'
  import SelectComponent from '../../components/scorecharts/Select.vue'

  export default {
    components: {
      SidebarComponent,
      LineComponent,
      LayoutMain,
      Header,
      Spinner,
      SelectComponent,
      DateRanger,
    },
    data() {
      return {
        tab: 'units',
        options: [],
        range: { start: null, end: null },
        // Sidebar
        field: { x: 'total_exams', y: 'general_score' },
        unit: null,
        device: null,
        operator: null,
        itemSelect: null,
        input: null,
      }
    },

    computed: mapState({
      load: state => state.dataLoad,
      customer: state => state.customer,
      units: state => state.units,
      devices: state => state.devices,
      data: state => state.data,
      operators () {
        let operators = this.data.filter(item => item.type === 'Operator:')
        // selected Units
        if (this.unit && this.unit.name) {
          // filter devices to unit selected
          this.getDevices()

          let dvs = []
          this.devices.map(d => dvs.push(d.name))

          operators = operators.filter(item => {
            return item.operator_name.find(value => dvs.includes(value))
          })
        }
        // selected Device
        if (this.device && this.device.name) {
          operators = operators.filter(item =>
            item.operator_name.includes(this.device.name)
          )
        }

        return operators
      },
    }),

    created() {
      this.range = help.queryDate(this.$route.query)
      this.fetch()
    },

    updated () {
      this.getDevices()
      this.getOperators()
    },

    methods: {

      fetch () {
        this.$store.dispatch('fetchApi', {
          name: this.$route.params.customer,
          start: this.range.start,
          end: this.range.end,
        })
      },

      handleClickDevice(){
        this.getDevices()
        this.input = 'devices'
        this.options = this.devices
        if (this.device) this.options = [this.device]
        this.operator = null
      },

      scoreLabel (field) {
        return field === 'total_exams'
          ? 'Production' : help.scores(field)
      },

      // Interage API
      getDevices() {
        this.$store.dispatch('fetchDevices', {
          name: this.$route.params.customer,
          // all devices in UNIT.NAME
          unitName: this.unit ? this.unit.name : null,
        })
      },

      getOperators() {
        this.$store.dispatch('fetchOperators', {
          name: this.$route.params.customer,
        })
      },

      // Obrigatório para o LineBar
      setClickData (field) {
        this.field.x = field
      },

      setClickDataY (field) {
        this.field.y = field
      },

      // possition
      getPostion (obj, field=null) {
        if (!field) return 50

        let value = obj[`_${field}`].avg
        let max = obj[`_${field}`].max

        return (['total_exams', 'avg_exam_duration'].includes(field))
          ? help.toPercent(value, max)
          : value
      },

      // width: 80px; height: 80px;
      getDimension(obj) {

        let w = this.getPostion(obj, this.field.x)
        let h = this.getPostion(obj, this.field.y)

        let d = 80

        if (w && h) {
          w = (w * 80) / 100
          h = (h * 80) / 100

          d = (h * w) / w
          if (d <= 40) d = 40;
          if (d >= 80) d = 80;
        }

        return {
          width: `${d}px`,
          height: `${d}px`,
        }
      },
    },

    watch: {
      unit(newValue, oldValue) {
        if (!newValue) {
          this.itemSelect = this.customer
          this.options = this.units
        }

        if (newValue !== oldValue && newValue) {
          this.itemSelect = newValue
          this.options = [newValue]
        }
      },

      device(newValue, oldValue) {
        if (!newValue) {
          this.itemSelect = this.unit ? this.unit : this.customer
          this.options = this.devices
        }

        if (newValue !== oldValue && newValue) {
          this.itemSelect = newValue
          this.options = [newValue]
        }
      },

      operator(newValue, oldValue) {
        if (!newValue) {
          this.itemSelect = this.device ? this.device : this.customer
          this.options = this.operators
        }

        if (newValue !== oldValue && newValue) {
          this.itemSelect = newValue
          this.options = [newValue]
        }
      },
    },
  }
</script>

<style scoped>
.item {
  cursor: pointer;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px dashed #ccc;
}
.item.active {
  border-color: #21ed21;
  background-color: #bdffa3;
}
.grid{
  width: 5%;
  height: 20px;
  border: 1px dashed #ccc;
}
.eixox {
  border-bottom: 2px dashed rgb(92, 90, 240);
}
.eixoy {
  border-right: 2px dashed rgb(240, 180, 90);
}

.img {
  width: 80px;
  height: 80px;
  padding: 2px;
  position: absolute;
  /* border: 1px solid #ccc; */
  cursor: pointer;
}

.img:hover {
  z-index: 99;
  background-color: #ecb678!important;
}

</style>