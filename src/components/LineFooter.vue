<template>
    <div v-if="this.main">
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
        options: {
            type: Array,
            required: false,
            default: [],
        },
    },
    data() {
        return {
            series: [],
            chartOptions: {},
            dates: [],
        }
    },
    created() {
        if (this.main) {
            this.formatDate()
            this.handleInit()
        }
    },
    computed: {
        scoreLabel () {
            return this.field === 'total_exams'
                ? 'Production'
                : h.scores(this.field)
        }
    },
    methods: {
        getYaxis() {
            let str = 'Percentage'
            if (this.field==='avg_exam_duration') str = 'Time'
            if (this.field==='total_exams') str = 'Totalizer'

            return {
                title: { text: str },
                min: 0,
                max: this.main[`_${this.field}`].max,
            }
        },
        // convert date & time
        formatDate() {
            const dt = []
            if (this.main) {
                this.main.study_date.map(d => dt.push(h.dateFormat(d)))
            }
            this.dates = dt
        },
        handleInit() {
            this.series = [{
                name: h.scores(this.field),
                data: this.options.length ? this.options : this.main[this.field],
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
                    horizontalAlign: 'center',
                    floating: true,
                    offsetY: -25,
                    offsetX: -5,
                },
                title: {
                    text: `${this.main.name} - ${this.scoreLabel}`,
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