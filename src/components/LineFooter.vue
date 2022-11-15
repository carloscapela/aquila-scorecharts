<template>
    <div>
        <apexchart
            type="area"
            height="300"
            :options="chartOptions"
            :series="series">
        </apexchart>
    </div>
</template>

<script>
import h from '../helpers'
export default {
    props: {
        field: String,
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
        getYaxis() {
            const is_avg = this.field === 'avg_exam_duration'
            return {
                title: { text: is_avg ? 'Time' : 'Percentage' },
                min: 0,
                max: this.main[`_${this.field}`].max,
            }
        },
        // convert date & time
        formatDate() {
            const dt = []
            this.main.study_date.map(d => dt.push(h.dateFormat(d)))
            this.dates = dt
        },
        handleInit() {
            this.series = [{
                name: h.scores(this.field),
                data: this.main[this.field],
            }]

            this.chartOptions = {
                chart: {
                    height: 300,
                    type: 'area',
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
                    toolbar: {
                        show: true
                    },
                },
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
                    horizontalAlign: 'right',
                    floating: true,
                    offsetY: -25,
                    offsetX: -5,
                },
                title: {
                    text: `${this.main.name} - ${h.scores(this.field)}`,
                    align: 'left'
                },
            }
        },
    },
    watch: {
        field(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.formatDate()
                this.handleInit()
            }
        },
        main(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.formatDate()
                this.handleInit()
            }
        },
    },
}
</script>