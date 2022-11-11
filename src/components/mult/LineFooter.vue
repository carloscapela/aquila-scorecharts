<template>
    <div>
        <apexchart
            type="line"
            height="300"
            :options="chartOptions"
            :series="series">
        </apexchart>
        <!-- <apexchart
            v-if="enableBar"
            type="bar"
            height="250"
            :options="barOptions"
            :series="barSeries">
        </apexchart> -->
    </div>
</template>

<script>
import moment from 'moment'
import {labels} from '../../helpers/util'

export default {
    props: {
        // options: Array,
        fieldX: String,
        fieldY: String,
        main: {},
    },
    data() {
        return {
            series: [],
            chartOptions: {},
            dates: [],
        }
    },
    created() {
        this.formatDate()
        this.handleInit()
    },
    methods: {
        // getYaxis() {
        //     const is_avg = this.field === 'avg_exam_duration'
        //     return {
        //         title: { text: is_avg ? 'Time' : 'Percentage' },
        //         min: 0,
        //         max: is_avg ? this.main[`_${this.field}`].max : 100,
        //     }
        // },
        // convert date & time
        formatDate() {
            const dt = []
            this.main.study_date.map(d => dt.push(moment(d).format('MMM DD YYYY')))
            this.dates = dt
        },
        handleSeries () {
            const data = []
            if (this.fieldX) {
                data.push({
                    name: labels(this.fieldX),
                    data: this.main[this.fieldX],
                })
            }
            if (this.fieldY) {
                data.push({
                    name: labels(this.fieldY),
                    data: this.main[this.fieldY],
                })
            }

            this.series = data
        },
        handleInit() {
            this.chartOptions = {
                chart: {
                    height: 300,
                    type: 'line',
                    zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                    },
                    dropShadow: {
                        enabled: true,
                        color: '#000',
                        top: 18,
                        left: 7,
                        blur: 10,
                        opacity: 0.2
                    },
                    // toolbar: {
                    //     show: true
                    // },
                },
                colors: ['#828282', '#ffc700'],
                grid: {
                    borderColor: '#e7e7e7',
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5,
                    },
                },
                xaxis: {
                    categories: this.dates,
                    title: { text: 'Dates' },
                    type: 'datetime',
                },
                // yaxis: this.getYaxis(),
                yaxis: {
                    title: { text: 'Percentage' },
                    min: 0,
                    max: 100,
                },
                markers: {
                    size: 1
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'center',
                    floating: true,
                    offsetY: -25,
                    offsetX: -5,
                },
                title: {
                    // text: `${this.main.name} - ${labels(this.field)}`,
                    text: `${this.main.name}`,
                    align: 'left'
                },
            }
        },
    },
    watch: {
        fieldX(newValue, oldValue) {
            if (newValue !== oldValue) this.handleSeries()
        },
        fieldY(newValue, oldValue) {
            if (newValue !== oldValue) this.handleSeries()
        },
    },
}
</script>