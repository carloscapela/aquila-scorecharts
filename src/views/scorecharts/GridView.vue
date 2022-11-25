<template>
  <LayoutMain :customer="customer.name">
    <template #header>
      <Header
        :customer="customer.name"
      />
    </template>
    <template #content>

      <div class="row mb-2">
        <div class="btn-group dropend">
          <button type="button" class="btn btn-secondary">
            Units
          </button>
          <button
            type="button"
            class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span class="visually-hidden">Toggle Dropend</span>
          </button>
          <ul class="dropdown-menu">
            <!-- Dropdown menu links -->
          </ul>
        </div>
          <!-- <div class="col-4">
            <div class="card" @click="handleOptions('units')">
              <div class="card-header text-center">Units</div>
              <div class="card-body p-1">
                <v-select
                  disableb
                  :options="units"
                  v-model="input"
                  :get-option-label="(op) => op.name"
                ></v-select>
              </div>
            </div>
          </div> -->
        <!--
        <div class="col-4">
          <div class="card" @click="handleOptions('devices')">
            <div class="card-header text-center">Devices</div>
            <div class="card-body p-1">
              <v-select
                :options="devices"
                v-model="input"
                :get-option-label="(op) => op.name"
              ></v-select>
            </div>
          </div>
        </div>

        <div class="col-4">
          <div class="card" @click="handleOptions('operators')">
            <div class="card-header text-center">Operators</div>
            <div class="card-body p-1">
              <v-select
                :options="units"
                v-model="input"
                :get-option-label="(op) => op.name"
              ></v-select>
            </div>
          </div>
        </div>
         -->
      </div>

      <div class="card">
        <div class="position-relative">
          <div
            v-for="m in options"
            class="position-absolute translate-middle rounded-pill img bg-success"
            :style="{
              left: getPostion(m, field.x),
              bottom: getPostion(m, field.y),
              transition: 'all 300ms',
              // width: m[`_${field.x})`].avg + 'px',
              // height: m[`_${field.x})`].avg + 'px',
            }"
          >
            <!-- <img src="@/assets/operator.png" alt="Devices" width="50" /> -->
            <small>{{ m.name[0] }}</small>
          </div>
          <!--
          <small class="position-absolute top-0 start-0" style="width: 20px;">
            100%
          </small>
          <small class="position-absolute top-50 start-0" style="width: 20px;">
            50%
          </small>
          <small class="position-absolute top-100 start-0" style="width: 20px;">
            0%
          </small>
          -->
          <div
            v-for="m in [1,2, 3,4,5,6,7,8,9,10]"
            class="row p-0 m-0"
            :class="{ eixox: m==5 }"
          >
            <div
              class="col grid"
              v-for="m in [1,2, 3,4,5,6,7,8,9,10]"
              :style="{ width: '5%', height: '50px' }"
              :class="{eixoy: m==5}">
            </div>
          </div>
        </div>
        <div class="card-body p-1">
          <!-- <LineComponent
            :fieldX="field.x"
            :fieldY="field.y"
            :main="customer"
          /> -->
        </div>
      </div>
    </template>

    <template #sidebar>
      <SidebarComponent
        :main="customer"
        :callbackX="(v) => this.setClickData(v)"
        :callbackY="(v) => this.setClickDataY(v)"
      />
    </template>
  </LayoutMain>
</template>

<script>
  import { mapState } from 'vuex'
  import LayoutMain from '../../scorecharts/layouts/Main.vue'
  import Header from '../../components/scorecharts/Header.vue'
  import SidebarComponent from '../../components/scorecharts/mult/Sidebar.vue'
  import LineComponent from '../../components/scorecharts/mult/LineFooter.vue'
  import SelectComponent from '../../components/scorecharts/Select.vue'


  export default {
    components: {
      SidebarComponent,
      LineComponent,
      LayoutMain,
      Header,
      SelectComponent,
    },
    data() {
      return {
        tab: 'units',
        // device: {},
        options: [],
        range: { start: null, end: null },
        // LineFooter
        // Obrigatório para o LineBar
        // series: [],
        // title: [],
        // Sidebar
        itemSelect: {},
        // field: '',
        field: { x: '', y: '' },
      }
    },
    methods: {
      handleInit (start='', end='') {
        this.$store.dispatch('fetch', {
          name: this.$route.params.customer,
          start,
          end,
        })

        // Get Devices
        this.$store.dispatch('fetchDevices', {
          name: this.customer.name,
          // unitName: this.$route.params.unitName,
        })

        // Get Operators
        this.$store.dispatch('fetchOperators', {
          name: this.$route.params.customer,
          start,
          end,
          // Filter Complex
          // callback: function (dataJson) {
          //   return dataJson.filter(item => {
          //     if (item.type==='Operator:') {
          //       return item.operator_name === deviceName
          //     }
          //     return item
          //   })
          // }
        })

        if (this.units.length) this.options = this.units
      },

      handleOptions(name) {
        if (this[name].length) this.options = this[name]
        this.tab = name
      },

      // Obrigatório para o LineBar
      setClickData (field) {
        this.field.x = field
      },
      setClickDataY (field) {
        this.field.y = field
      },

      // possition
      getPostion (obj, value = '') {
        return value ? obj[`_${value}`].avg + '%' : '0%'
      },
    },
    created() {
      this.range = help.queryDate(this.$route.query)
      this.handleInit(this.range.start, this.range.end)
    },
    // watch: {
    //   item(newValue, oldValue) {
    //     this.setSidebar()
    //   },
    // },
    computed: mapState({
      customer: state => state.customer,
      units: state => state.units,
      operators: state => state.operators,
      devices: state => state.devices,
    }),
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
  width: 40px;
  height: 40px;
  padding: 2px;
  position: absolute;
  border: 2px dashed #ccc;
  cursor: pointer;
  background-color: #fff;
}

.img:hover {
  z-index: 99;
  background-color: #b3e4fc;
}
</style>