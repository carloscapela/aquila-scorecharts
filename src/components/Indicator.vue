<template>
    <div v-if="isValid()" class="card shadow-sm border mb-2 pointer" :class="{ 'text-primary border border-primary' : active }">
        <div class="card-body row m-0 p-2" style="height: 140px;">
            <div class="col-5 m-0 p-2">
                <div class="stretched-link" @click="callback()">
                    <p>{{ title }}</p>
                    <h3>
                        {{ options.avg }}%
                        <span v-if="help">
                            <i class="bi bi-question-circle"></i>
                        </span>
                    </h3>
                </div>
                <div class="badge rounded-pill bg-danger text-danger bg-opacity-25">
                    <i class="bi bi-caret-down-fill"></i>
                    {{ options.min }}%
                </div>
                <div class="badge rounded-pill bg-success text-success bg-opacity-25 m-2">
                    <i class="bi bi-caret-up-fill"></i>
                    {{ options.max }}%
                </div>
            </div>
            <div  class="col-7 m-0 p-2">
                <apexchart type="bar" height="120" :options="chartOptions" :series="series" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        options: Object,
        callback: {
            type: Function,
            required: false,
        },
        help: {
            type: String,
            required: false,
        },
        active: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return {
            series: [],
            chartOptions: {},
        }
    },

    created() {
        this.handleInit()
    },

    methods: {
        isValid() {
            return this.options.min || this.options.avg || this.options.max
        },

        handleInit () {
            this.series = [{
                name: this.title,
                data: [this.options.min, this.options.avg, this.options.max]
            }]

            this.chartOptions = {
                chart: {
                    height: 150,
                    type: 'bar',
                },
                plotOptions: {
                    bar: {
                        distributed: true, // this line is mandatory
                        horizontal: false,
                        barHeight: '85%',
                    },
                },

                dataLabels: {
                    enabled: true,
                    formatter: (val) => val + "%",
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#000"]
                    }
                },

                colors: ['#deb887', '#1870f4', '#64c97a'],

                xaxis: {
                    categories: ['min', 'avg', 'max'],
                    position: 'top',
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    tooltip: {
                        enabled: false,
                    }
                },

                yaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                        formatter: (val) => val + "%",
                    }
                },
            }
        }
    },
}
</script>