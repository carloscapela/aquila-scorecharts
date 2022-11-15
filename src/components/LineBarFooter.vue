<template>
    <apexchart
        v-if="series.length"
        type="area"
        height="300"
        :options="chartOptions"
        :series="series">
    </apexchart>
    <apexchart
        v-if="field === 'prod_score'"
        type="bar"
        height="250"
        :options="barOptions"
        :series="barSeries">
    </apexchart>
</template>

<script>
import moment from 'moment'
import h from '../helpers'

export default {
    props: {
        // options: Array,
        field: String,
        main: {},
    },
    data() {
        return {
            series: [],
            chartOptions: {},
            dates: [],
            // Ocapations Bar
            barTitle: '',
            barOptions: {},
            barSeries: [],
            barCategories: [],
            barDurationMax: 120,
            barColors: ['#77B6EA'],
            // barColors: ['green'],
        }
    },
    created() {
        this.formatDate()
        this.handleInit()
        if (this.field === 'prod_score') {
            this.initChartColumn()
        }
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
                    // TEMP
                    events: {
                        click: (e, c, config) => {
                            this.setDataColumnChart(config.dataPointIndex)
                            this.initChartColumn()
                        }
                    }
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
        initChartColumn() {
            this.barOptions = {
                chart: {
                    type: 'bar',
                    height: 250,
                    toolbar: {
                        show: true
                    },
                    zoom: {
                        enabled: true
                    },
                },
                // colors: this.barColors,
                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '55%',
                        endingShape: 'rounded'
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                show: true,
                width: 2,
                    colors: ['transparent']
                },
                xaxis: {
                    categories: this.barCategories,
                },
                yaxis: {
                    title: { text: 'Duration (min)' },
                    min: 1,
                    max: this.barDurationMax,
                },
                fill: {
                    opacity: 1
                },
                tooltip: {
                    y: {
                        formatter: (val) => val + " m",
                    },
                    custom: ({series, seriesIndex, dataPointIndex, w}) => {
                        const i = dataPointIndex
                        return `<div style="padding: 5px;">`+
                            `<h6>Duration: ${series[seriesIndex][i]} min</h6>`+
                            `<ul>`+
                                `<li><b>AVG Grade:</b> ${this.main.avg_grade[i]}</li>`+
                                `<li><b>Study Description:</b> ${this.main.study_description[i]}</li>`+
                                `<li><b>N. Images:</b> ${this.main.n_images[i]}</li>`+
                            `<ul>`+
                        `</div>`
                    },
                },
                title: {
                    text: this.barTitle,
                    align: 'center',
                },
            }
        },
        setDataColumnChart (index) {
            const operatorDurations = []
            const durations = []
            const timeCategories = []
            const dates = this.main.study_date
            const dateSelected =  dates[index]
            const dateStr = h.dateFormat(dateSelected)

            dates.filter((d, i) => {
                if (moment(d).isSame(dateSelected)) {
                    let name = this.main.operator_name[i]

                    let key = operatorDurations.findIndex(d => d.name === name)
                    if (key < 0) {
                        operatorDurations.push({
                            name,
                            data: [this.main.exam_real_duration[i]],
                        })
                    } else {
                        operatorDurations[key].data.push(this.main.exam_real_duration[i])
                    }

                    durations.push(this.main.exam_real_duration[i])
                    timeCategories.push(this.main.start_time[i])
                }
            })

            this.barDurationMax = h.max(durations)
            this.barCategories = timeCategories
            this.barTitle = `One Day View: ${dateStr}`
            this.barSeries = operatorDurations
        },
    },
    watch: {
        field(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.formatDate()
                this.handleInit()
            }
            if (newValue === 'prod_score') this.initChartColumn()
        },
        main(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.formatDate()
                this.handleInit()
            }
            if (this.field === 'prod_score') this.initChartColumn()
        },
    },
}
</script>