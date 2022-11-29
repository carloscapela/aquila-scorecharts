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
import help from '../../../scorecharts/helpers'

export default {
    props: {
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

        scoreLabel (field) {
            return field === 'total_exams'
                ? 'Production'
                : help.scores(field)
        },

        handleSeries () {

            const data = []

            if (this.fieldX) {
                data.push({
                    name: this.scoreLabel(this.fieldX),
                    data: this.getOptionsPercent(this.fieldX, this.main[this.fieldX]),
                })
            }
            if (this.fieldY) {
                data.push({
                    name: this.scoreLabel(this.fieldY),
                    data: this.getOptionsPercent(this.fieldY, this.main[this.fieldY]),
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

        getOptionsPercent(field, array) {
            let options = []
            if (field==='avg_exam_duration' || field==='total_exams') {
                var max = this.main[`_${field}`].max
                array.map(value => options.push(help.toPercent(value, max)) )
                return options
            }
            return array
        },

        getYaxis () {
            let str = 'Percentage'
            return {
                title: { text: str },
                min: 0,
                max: 100,
            }
        },
    },
    watch: {
        fieldX(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.handleSeries()
            }
        },
        fieldY(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.handleSeries()
            }
        },
        main(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.handleSeries()
                this.formatDate()
                this.handleInit()
            }
        },
    },
}
</script>