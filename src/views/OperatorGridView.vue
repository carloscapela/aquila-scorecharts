<template>
  <LayoutMain>
    <template #header>
      <Header
        :customer="itemSelect.customer_name"
        :unit="itemSelect.unit_name"
        :device="device.name"
      />
    </template>
    <div class="row justify-content-md-center text-center">
      <div class="col-sm-12 col-md-12 col-lg-10">
        <div class="row justify-content-md-center text-center">
          <div class="row position-relative justify-content-md-center">
            <div
              v-for="m in operators"
              class="position-absolute translate-middle rounded-pill img"
              :style="{
                left: getPostion(m, field.x),
                bottom: getPostion(m, field.y),
                transition: 'all 300ms',
              }"
            >
              <img src="@/assets/operator.png" alt="Devices" width="50" />
              <small>{{ m.name }}</small>
            </div>
            <small class="position-absolute top-0 start-0" style="width: 20px;">
              100%
            </small>
            <small class="position-absolute top-50 start-0" style="width: 20px;">
              50%
            </small>
            <small class="position-absolute top-100 start-0" style="width: 20px;">
              0%
            </small>
            <div
              v-for="m in [1,2, 3,4,5,6,7,8,9,10]"
              class="row p-0 m-0"
              :class="{
                eixox: m==5,
                'bg-roxo' : m <= 3,
                'bg-laranja': m > 3 && m <= 6,
                'bg-cinza': m > 6,
              }"
            >
              <div
                class="col grid"
                v-for="m in [1,2, 3,4,5,6,7,8,9,10]"
                :style="{ width: '10%', height: '70px' }"
                :class="{eixoy: m==5}">
              </div>
            </div>
          </div>
          <div class="col-12 mt-5">
            <LineComponent
              :fieldX="field.x"
              :fieldY="field.y"
              :main="itemSelect"
            />
          </div>
        </div>
      </div>

      <div class="col-sm-12 col-md-12 col-lg-2">
        <SidebarComponent
          :main="itemSelect"
          :callbackX="(v) => this.setClickData(v)"
          :callbackY="(v) => this.setClickDataY(v)"
        >
        </SidebarComponent>
      </div>
    </div>
  </LayoutMain>
</template>

<script>
  import Header from '../components/Header.vue'
  import Device from '../models/Device'
  import LayoutMain from '../layouts/Main.vue'
  import SidebarComponent from '../components/mult/Sidebar.vue'
  import LineComponent from '../components/mult/LineFooter.vue'

  export default {
    components: {
      SidebarComponent,
      LineComponent,
      LayoutMain,
      Header,
    },
    data() {
      return {
        device: {},
        operators: [],
        // LineFooter
        // Obrigatório para o LineBar
        series: [],
        title: [],
        // Sidebar
        itemSelect: {},
        // field: '',
        field: {
          x: '',
          y: '',
        },
      }
    },
    methods: {
      handleInit (start='', end='') {
        this.device = (new Device(start, end)).findBy(this.$route.params.deviceName)
        this.operators = (new Device(start, end)).getOperators(this.$route.params.deviceName, start, end)
        // Order
        this.operators.sort((a, b) =>  b._general_score.max-a._general_score.max)
        this.operators.map((d, i) => this.operators[i].name = d.name.split('^').join(' '))

        this.itemSelect = this.device
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
      this.handleInit()
    },
    // watch: {
    //   item(newValue, oldValue) {
    //     this.setSidebar()
    //   },
    // },
    computed: {
      // /:customer/unit/:unitName/devices/:deviceName
      operatorParams () {
        return {
          customer: this.device.customer_name,
          unitName: this.device.unit_name,
          deviceName: this.device.name,
        }
      }
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
  width: 10%;
  height: 50px;
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
  border: 2px dashed #ccc;
  cursor: pointer;
  background-color: #fff;
}

.img:hover {
  z-index: 99;
  background-color: #b3e4fc;
}

:deep(.popper) {
  background: #e92791;
  padding: 20px;
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
}

:deep(.popper #arrow::before) {
  background: #e92791;
}

:deep(.popper:hover),
:deep(.popper:hover > #arrow::before) {
  background: #e92791;
}
.bg-roxo {
  background-color: #d9dcfc;
}
.bg-laranja {
  background-color: #EADEC5;
}

.bg-cinza {
  background-color: #E5ECF6;
}
</style>