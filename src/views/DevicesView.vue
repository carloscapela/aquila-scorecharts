<template>
  <LayoutMain>
    <template #header>
      <Header
        :customer="itemSelect.customer_name"
        :unit="itemSelect.unit_name"
      >
        <!-- <DateRanger :handle-submit="handleInit"/> -->
      </Header>
    </template>

    <template #content>
      <div class="card position-relative">

        <div class="unit rounded"
          @click="() => this.itemSelect = unit"
          :class="{ active: itemSelect.name == unit.name }"
        ></div>

        <div
            class="card-header link-primary pointer mb-4"
            style="z-index: 99;"
            @click="() => this.itemSelect = unit"
          >
            Unit: {{ itemSelect.unit_name }}
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
              <img src="@/assets/mammography.png" alt="Devices" width="140" class="mt-3" />
              <router-link :to="{ name: 'operators', params: operatorParams(m.name) }">
                Operators
              </router-link>
            </div>
          </div>
        </div>

        <div class="card-body" style="z-index: 99; background-color: #FFF;">
          <LineComponent
            v-if="itemSelect.name === this.unit.name"
            :field="field"
            :main="itemSelect"
          />
          <LineBarComponent
            v-if="itemSelect.name !== this.unit.name"
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
        :callback="(v) => {
          this.field = v
        }">
        <SelectComponent
          :options="devices"
          :main="unit"
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
  import h from '../helpers'
  import DateRanger from '../components/DateRanger.vue'
  import Header from '../components/Header.vue'
  import Device from '../models/Device'
  import Unit from '../models/Unit'
  import LayoutMain from '../layouts/Main.vue'
  import SidebarComponent from '../components/Sidebar.vue'
  import LineComponent from '../components/LineFooter.vue'
  import LineBarComponent from '../components/LineBarFooter.vue'
  import SelectComponent from '../components/Select.vue'

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
        unit: {},
        devices: [],
        itemSelect: {},
        field: '',
      }
    },
    created() {
      this.handleInit()
    },
    methods: {
      handleInit (start='', end='') {
        this.unit = (new Unit(start, end)).findBy(this.$route.params.unitName)

        this.devices = (new Device(start, end)).getToUnit(this.$route.params.unitName)
        this.devices.sort((a, b) => b._general_score.max-a._general_score.max)

        this.itemSelect = this.unit
        this.field = h.getKeyScore(this.itemSelect)
      },

      operatorParams (deviceName = '') {
        return {
          customer: this.itemSelect.customer_name,
          unitName: this.itemSelect.unit_name,
          deviceName: deviceName,
        }
      }
    },
  }
</script>
