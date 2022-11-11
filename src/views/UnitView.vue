<template>
  <LayoutMain>

    <template #header>
      <Header :customer="customer.name">
        <!-- <DateRanger :handle-submit="handleInit"/> -->
      </Header>
    </template>

    <template #content>
      <div class="card">
        <div id="map" class="card-img-top" style="width: 100%; min-height: 650px"></div>
        <div class="card-body p-1">
          <LineFooterComponent
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
          this.initMap()
        }">
        <SelectComponent
          :options="customer.units"
          :main="customer"
          :callback="(v) => {
            this.itemSelect = v
            this.initMap()
          }"
          :selected="itemSelect"
          prefix="Customer-"
        />
      </SidebarComponent>
    </template>
  </LayoutMain>
</template>

<script>
import h from '../helpers'
import DateRanger from '../components/DateRanger.vue'
import Customer from '../models/Customer'
import Header from '../components/Header.vue'
import LayoutMain from '../layouts/Main.vue'
import SidebarComponent from '../components/Sidebar.vue'
import LineFooterComponent from '../components/LineFooter.vue'
import SelectComponent from '../components/Select.vue'

export default {
  components: {
    SidebarComponent,
    LineFooterComponent,
    LayoutMain,
    Header,
    DateRanger,
    SelectComponent,
  },
  data() {
    return {
      teste: 0,
      // GENERAL
      customer: {},
      // Sidebar
      itemSelect: {}, // *
      // MAPS
      mapOptions: {},
      field: '',
    }
  },

  created() {
    this.customer = (new Customer).findBy(this.$route.params.customer)
    if (!this.customer) window.location.href = '/'

    this.itemSelect = this.customer

    // Filter with param UNITNAME
    if (this.$route.params.unitName) {
      this.itemSelect = this.customer.units.find(item => item.name == this.$route.params.unitName)
    }
    this.initMap()
    this.field = h.getKeyScore(this.itemSelect)
    this.setUnitMap()
  },

  methods: {
    handleInit (start='', end='') {
      this.customer = (new Customer(start, end)).findBy(this.$route.params.customer)
      this.itemSelect = this.customer
      this.initMap()
      this.setUnitMap()
    },

    setUnitMap () {
      let lat = []
      let lng = []

      this.customer.units.map(unit => {
        lat.push(unit.lat)
        lng.push(unit.long)
      })

      // Caso seja um customer
      this.mapOptions = {
        center: h.avgLatLong(lat, lng),
        zoom: 10,
      }
    },

    // Obrigatório para o LineBar
    setClickData (field) {
      this.field = field
    },

    getDataRadius(valueMax) {
      const data = []
      this.customer.units.map(unit => data.push(unit[`_${this.field}`].max))

      let baseCalc = Number((h.max(data) - h.min(data)) / 3 ).toFixed()

      let baseMin = h.min(data) + baseCalc
      let baseMax = h.max(data) - baseCalc

      // min
      let color = '#892d00'
      let radius = 1200;
      // avg
      if (valueMax >= baseMin && valueMax <= baseMax) {
        radius = 1500
        color = '#00558C'
      }
      // max
      if (valueMax > baseMax) {
        radius = 2000
        color = '#174664'
      }

      return { radius, color }
    },

    initMap () {
      const loader = h.load()
      // const tests = []
      loader.loadCallback(e => {
        if (e) { console.log(e) }
        else {
          const map = new google.maps.Map(document.getElementById('map'), this.mapOptions)
          let vm = this
          // LOOP
          this.customer.units.map((unit, i) => {

            // tests.push(unit[`_${this.field}`].max)

            const position = { lat: unit.lat, lng: unit.long }

            const href = this.$router.resolve({ name: 'devices', params: {
              unitName: unit.unit_name,
              customer: unit.customer_name,
            }}).href

            // JANELA DE CONTEUDO
            let contentTitle =
              `<div class="card border-0 p-0 m-0 text-center">` +
                `<h5 class="card-title"><i class="bi bi-house-heart"></i> ${unit.name} </h5>` +
              `</div>`

            let contentString =
              `<div class="card border-0 p-0 m-0 text-center">` +
                `<h5 class="card-title"><i class="bi bi-house-heart"></i> ${unit.name} </h5>` +
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

            let colorSelect = this.getDataRadius(unit[`_${this.field}`].max).color
            // Selected ITEM
            if (this.itemSelect.name == unit.name) {
              colorSelect = '#ff0000'
              infoWindow.setPosition(position)
              infoWindow.open(map)
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
              // radius: unit[`_${this.field}`].max * 20,
              radius: this.getDataRadius(unit[`_${this.field}`].max).radius,
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
              vm.setClickData(this.field)

              infoWindow.setPosition(ev.latLng)
              infoWindow.open(map)
            })
          }) // end LOOPs
        }
      })
    }
  },
}
</script>
