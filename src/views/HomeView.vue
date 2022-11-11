<template>
  <LayoutMain>
    <div class="row justify-content-md-center">
      <div class="col">
        <img
          src="@/assets/aquila.jpg"
          class="rounded mx-auto d-block animate__animated animate__bounce"
          width="200"
        />

        <!-- <div class="g-3 mb-3 row">

          <div class="col-3">
            <div class="col-12 mb-3" v-for="value in h.labels()">
              <div class="card shadow-sm border">

                <div class="card-header bg-white border-0">
                  <h6 class="mb-0 mt-2 fs-5">
                    {{ value }}
                    <span>
                      <i class="bi bi-question-circle"></i>
                    </span>
                  </h6>
                </div>

                <div class="d-flex justify-content-between align-items-end card-body">
                  <div>
                    <h2 class="mb-1 text-700 fw-normal lh-1">
                      $47K
                    </h2>
                    <div class="badge rounded-pill bg-danger text-danger bg-opacity-25">
                      <i class="bi bi-caret-down-fill"></i> 3.5%
                    </div>
                    <div class="badge rounded-pill bg-success text-success bg-opacity-25 m-2">
                      <i class="bi bi-caret-up-fill"></i>
                      3.5%
                    </div>
                  </div>
                  <div class="border">
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div> -->

      </div>
    </div>
  </LayoutMain>
</template>

<script>
  import h from '../helpers'
  import Header from '../components/Header.vue'
  import LayoutMain from '../layouts/Main.vue'

  export default {
    components: {
      LayoutMain,
      Header,
    },
    setup() {
      return { h }
    },
    // data() {
    //   return {
    //     series: [{
    //       name: "STOCK ABC",
    //       data: [58,34, 23]
    //     }],
    //     chartOptions: {
    //       chart: {
    //         type: 'area',
    //         height: 50,
    //         zoom: {
    //           enabled: false
    //         }
    //       },
    //       dataLabels: {
    //         enabled: false
    //       },
    //       stroke: {
    //         curve: 'straight'
    //       },
    //       // title: {
    //       //   text: 'Fundamental Analysis of Stocks',
    //       //   align: 'left'
    //       // },
    //       subtitle: {
    //         text: 'Price Movements',
    //         align: 'left'
    //       },
    //       // labels: series.monthDataSeries1.dates,
    //       xaxis: {
    //         type: 'datetime',
    //       },
    //       yaxis: {
    //         opposite: true
    //       },
    //       legend: {
    //         horizontalAlign: 'left'
    //       }
    //     },
    //   }

    // }
  }
</script>