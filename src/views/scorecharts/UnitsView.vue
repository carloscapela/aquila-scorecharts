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
      <div class="card">
        <div id="map" class="card-img-top" style="width: 100%; min-height: 650px"></div>
        <div class="card-body p-1">
          <LineFooterComponent
            :field="field"
            :main="itemSelect ? itemSelect : customer"
          />
        </div>
      </div>
    </template>

    <template #sidebar>
      <SidebarComponent
        :main="itemSelect ? itemSelect : customer"
        :field="field"
        :callback="(v) => {
          this.field = v
          this.initMap()
        }">
        <SelectComponent
          :options="units"
          :main="customer"
          :callback="(v) => {
            this.itemSelect = v
            this.initMap()
          }"
          :selected="itemSelect ? itemSelect : customer"
          prefix="Customer-"
        />
      </SidebarComponent>
      <!-- {{ units }} -->
    </template>
  </LayoutMain>
</template>

<script>
import help from '../../scorecharts/helpers'
import LayoutMain from '../../scorecharts/layouts/Main.vue'
import DateRanger from '../../components/scorecharts/DateRanger.vue'
import Header from '../../components/scorecharts/Header.vue'
import SidebarComponent from '../../components/scorecharts/Sidebar.vue'
import LineFooterComponent from '../../components/scorecharts/LineFooter.vue'
import SelectComponent from '../../components/scorecharts/Select.vue'
import Spinner from '../../components/scorecharts/Spinner.vue'
import { mapState } from 'vuex'

export default {
  components: {
    SidebarComponent,
    LineFooterComponent,
    LayoutMain,
    Header,
    DateRanger,
    SelectComponent,
    Spinner,
  },
  data() {
    return {
      itemSelect: null,
      mapOptions: {},
      field: 'total_exams',
      range: { start: null, end: null }
    }
  },

  computed: mapState({
    customer: state => state.customer,
    units: state => state.units,
    load: state => state.dataLoad,
  }),

  created() {
    this.range = help.queryDate(this.$route.query)
    this.handleInit(this.range.start, this.range.end)
  },


  updated(){
    this.initMap()
  },

  methods: {
    async handleInit (start='', end='') {
      this.$store.dispatch('fetchApi', {
        name: this.$route.params.customer,
        start,
        end,
      })

      if (!this.customer || !this.$route.params.customer) window.location.href = '/'

      // Filter with param UNITNAME
      if (this.$route.params.unitName) {
        this.itemSelect = this.units.find(item => item.name == this.$route.params.unitName)
      }
    },

    setUnitMap () {
      let lat = []
      let lng = []

      this.units.map(unit => {
        lat.push(unit.lat)
        lng.push(unit.long)
      })

      // Caso seja um customer
      this.mapOptions = {
        center: help.avgLatLong(lat, lng),
        zoom: 10,
      }
    },

    getDataRadius(valueMax) {
      let pointRadius = []
      let values = []
      let radius = 3500
      this.units.map(unit => values.push( this.indicate(unit) ))
      values.sort((a, b) => b - a)

      values.map((v, i) => {
        pointRadius.push({index: i, value: v, radius: radius - (150*(i+1))})
      })

      pointRadius.map(item =>
        radius = item.value === valueMax ? item.radius : radius
      )

      return radius
    },

    initMap () {
      this.setUnitMap()

      const loader = help.load()
      // const tests = []
      loader.loadCallback(e => {
        if (e) { console.log(e) }
        else {
          const map = new google.maps.Map(document.getElementById('map'), this.mapOptions)
          let vm = this
          // LOOP
          this.units.map((unit, i) => {

            const position = { lat: unit.lat, lng: unit.long }

            const href = this.$router.resolve({ name: 'devices', params: {
              unitName: unit.unit_name,
              customer: unit.customer_name,
            }, query: this.range }).href

            let radius = this.getDataRadius(
              this.indicate(unit)
            )

            let strScore =  this.scoreLabel() + ': '  +
              this.indicate(unit) +
              help.symbol(this.field)

            // JANELA DE CONTEUDO
            let contentTitle =
              `<div class="card border-0 p-0 m-0 text-center">` +
                `<h5 class="card-title"><i class="bi bi-house-heart"></i>${unit.name}</h5>` +
                `<h6>${strScore}</h6>` +
              `</div>`

            let contentString =
              `<div class="card border-0 p-0 m-0 text-center">` +
                `<h5 class="card-title"><i class="bi bi-house-heart"></i>${unit.name}</h5>` +
                `<h6>${strScore}</h6>` +
                `<ul class="list-group list-group-flush p-0">` +
                  `<div class="d-grid gap-2">
                    <a href="${href}" class="btn btn-link"><i class="bi bi-pc-display-horizontal"></i> Devices</a>
                  </div>` +
                `</ul>` +
              `</div>`

            const infoWindowTitle = new google.maps.InfoWindow({
              content: contentTitle,
              pixelOffset: new google.maps.Size(0, -25),
            })

            const infoWindow = new google.maps.InfoWindow({
              content: contentString,
              unit: unit,
              pixelOffset: new google.maps.Size(0, -25),
            })

            let colorSelect = '#174664'
            // Selected ITEM
            if (this.itemSelect) {
              if (this.itemSelect.name == unit.name) {
                colorSelect = '#ff0000'
                infoWindow.setPosition(position)
                infoWindow.open(map)
              }
            }

            // Add the circle for this city to the map.
            const circle = new google.maps.Circle({
              strokeColor: colorSelect,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: colorSelect,
              fillOpacity: 0.35,
              map,
              center: position,
              radius,
            })

            infoWindow.addListener('closeclick', () => {
              circle.setOptions({
                strokeColor: '#0014ad',
                fillColor: '#0014ad',
              })
            })

            // mouseout
            google.maps.event.addListener(circle, 'mouseout', (ev) => {
              infoWindowTitle.close()
            })

            // mousemove Event
            google.maps.event.addListener(circle, 'mouseover', (ev) => {
              infoWindowTitle.setPosition(ev.latLng)
              infoWindowTitle.open(map)
            })

            // Click
            google.maps.event.addListener(circle, 'click', (ev) => {
              infoWindowTitle.close()
              circle.setOptions({
                strokeColor: '#ff0000',
                fillColor: '#ff0000',
              })
              vm.itemSelect = infoWindow.unit

              infoWindow.setPosition(ev.latLng)
              infoWindow.open(map)
            })
          }) // end LOOPs
        }
      })
    },

    scoreLabel () {
      const f = this.field
      return f==='total_exams' ? 'Production' : help.scores(f)
    },

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
