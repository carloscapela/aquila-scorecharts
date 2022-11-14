<template>
  <LayoutMain>
    <template #header>
      <Header
        :customer="itemSelect.customer_name"
        :unit="itemSelect.unit_name"
      >
        <DateRanger :handle-submit="handleInit"/>
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
              <h2 class="mt-2">{{ m[`_${field}`].avg }}%</h2>
              <img src="@/assets/mammography.png" alt="Devices" width="110" />
              <br>
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
  import help from '../helpers'
  import DateRanger from '../components/DateRanger.vue'
  import Header from '../components/Header.vue'
  import LayoutMain from '../layouts/Main.vue'
  import SidebarComponent from '../components/Sidebar.vue'
  import LineComponent from '../components/LineFooter.vue'
  import LineBarComponent from '../components/LineBarFooter.vue'
  import SelectComponent from '../components/Select.vue'
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
    },
    data() {
      return {
        devices: [],
        itemSelect: {},
        field: '',
      }
    },
    computed: mapState({
      customer: state => state.customer,
      devicesCutomer: state => state.devices,
      unit: state => state.main,
    }),
    created() {
      this.handleInit()
    },
    methods: {
      handleInit (start='', end='') {

        this.$store.dispatch('fetch', {
          name: this.$route.params.customer,
          start,
          end,
        })
        this.$store.dispatch('find', {name: this.$route.params.unitName, type: 'Unit:' })

        this.devices = this.devicesCutomer.filter(item => item.unit_name==this.$route.params.unitName)

        this.devices.sort((a, b) =>
          b[`_${help.getKeyScore(a)}`].max - a[`_${help.getKeyScore(a)}`].max
        )

        this.itemSelect = this.unit
        this.field = help.getKeyScore(this.itemSelect)
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
