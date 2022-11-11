<template>
  <LayoutMain>
    <template #header>
      <Header
        :customer="device.customer_name"
        :unit="device.unit_name"
        :device="device.name"
      >
        <!-- <DateRanger :handle-submit="handleInit"/> -->
      </Header>
    </template>

    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-9">
        <div class="row text-center justify-content-md-center">

          <fieldset class="row justify-content-md-center position-relative" style="min-height: 350px;">
            <div class="device rounded"
              @click="() => {
                this.itemSelect = device
                this.setClickData(this.field)
              }"
              :class="{ active: itemSelect.name == device.name }"
            ></div>

            <legend
              @click="() => {
                this.itemSelect = device
                this.setClickData(this.field)
              }"
              class="link-primary pointer mb-5"
              style="z-index: 99;">
              Device: {{ device.name }}
            </legend>

            <div class="col-sm-12 col-md-12 col-lg-3 mb-3" v-for="m in operators">
              <div
                class="item position-relative"
                :class="{ active: itemSelect.name == m.name }"
                @click="() => {
                  itemSelect = m
                  this.setClickData(this.field)
                }">
                <div class="position-absolute top-0 start-50 translate-middle badge rounded-pill badge text-bg-light">
                  Operator: {{ m.name }}
                </div>
                <img src="@/assets/operator.png" alt="Devices" width="140" class="mt-3" />
              </div>
            </div>
          </fieldset>

          <div class="col-12">
            <LineComponent
              v-if="itemSelect.name !== device.name"
              :options="series"
              :field="field"
              :main="itemSelect"
            />
            <LineBarComponent
              v-if="itemSelect.name === device.name"
              :options="series"
              :field="field"
              :main="itemSelect"
            />
            <QuaLineComponent
              v-if="(field === 'qual_score') && itemSelect.name !== device.name"
              :options="series"
              :field="field"
              :main="itemSelect"
            />
          </div>

        </div>
      </div>

      <div class="col-sm-12 col-md-12 col-lg-3">
        <SidebarComponent
          :main="itemSelect"
          :callback="(v) => this.setClickData(v)">
          <SelectComponent
            :options="operators"
            :main="device"
            :callback="(v) => {
              this.itemSelect = v
              this.setClickData(this.field)
            }"
            :selected="itemSelect"
          />
        </SidebarComponent>
      </div>

    </div>

  </LayoutMain>
</template>

<script>
  import Header from '../components/Header.vue'
  import DateRanger from '../components/DateRanger.vue'
  import Device from '../models/Device'
  import LayoutMain from '../layouts/Main.vue'
  import SidebarComponent from '../components/Sidebar.vue'
  import LineComponent from '../components/LineFooter.vue'
  import SelectComponent from '../components/Select.vue'
  import LineBarComponent from '../components/LineBarFooter.vue'
  import QuaLineComponent from '../components/QuaLineFooter.vue'

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
        device: {},
        // LineFooter
        // Obrigatório para o LineBar
        series: [],
        field: '',
        itemSelect: {},
      }
    },
    created() {
      this.handleInit()
    },
    computed: {
      operatorParams () {
        return {
          customer: this.itemSelect.customer_name,
          unitName: this.itemSelect.unit_name,
          deviceName: this.device.name,
        }
      }
    },
    methods: {
      handleInit (start='', end='') {
        this.device = (new Device(start, end)).findBy(this.$route.params.deviceName)
        this.operators = (new Device(start, end)).getOperators(this.$route.params.deviceName, start, end)
        // Order
        this.operators.sort((a, b) =>  b._general_score.max-a._general_score.max)
        this.operators.map((d, i) => this.operators[i].name = d.name.split('^').join(' '))
        // selected ITEM
        this.itemSelect = this.itemSelect.name ? this.itemSelect : this.device
        // init Sidebar
        this.setClickData('general_score')
      },

      setClickData(field){
        this.field = field
        this.series = this.itemSelect[field]
      },
    },
  }
</script>
