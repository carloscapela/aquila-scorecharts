<template>
    <div>
        <apexchart
            type="line"
            height="300"
            :options="chartOptions"
            :series="series">
        </apexchart>
    </div>
</template>

<script>
import moment from 'moment'
import help from '../../helpers'

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
                    name: help.scores(this.fieldX),
                    data: this.main[this.fieldX],
                })
            }
            if (this.fieldY) {
                data.push({
                    name: help.scores(this.fieldY),
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
                yaxis: this.getYaxis(),
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
                    text: `${this.main.name}`,
                    align: 'left'
                },
            }
        },

        getYaxis () {
            let str = 'Percentage'
            if (this.fieldY==='avg_exam_duration') str = 'Time'
            if (this.fieldY==='total_exams') str = 'Totalizer'

            return {
                title: { text: str },
                min: 0,
                max: this.main[`_${this.fieldY}`].max,
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