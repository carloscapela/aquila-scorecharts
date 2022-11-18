<template>
    <div>
        <v-select
            :options="selectOptions"
            v-model="inputs"
            multiple
            :get-option-label="(op) => op.label"
        ></v-select>
        <apexchart
            type="line"
            height="300"
            :options="chartOptions"
            :series="series">
        </apexchart>
    </div>
</template>

<script>
import help from '../helpers'

export default {
    props: {
        options: Array,
        field: String,
        main: {},
    },
    data() {
        return {
            handleField: 'qual_score',
            series: [],
            chartOptions: {},
            dates: [],
            qualities: {},

            selectOptions: [],
            inputs: [],
        }
    },
    created() {
        this.qualities = help.qualities()
        this.formatDate()
        this.handleInit()
        this.handleOptions()
    },

    methods: {
        handleInit() {
            // Inicialize options
            this.setSeries()
            // Inicialize options
            this.chartOptions = {
                chart: {
                    type: 'line',
                    height: 300,
                    toolbar: { show: true },
                    zoom: { enabled: true },
                },
                grid: {
                    borderColor: '#e7e7e7',
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5,
                    },
                },
                xaxis: {
                    categories: this.dates,
                    title: { text: 'Dates' },
                    type: 'datetime',
                },
                yaxis: {
                    title:'Percentage',
                    min: 1,
                    max: 130,
                },
                markers: {
                    size: 1,
                },
                title: {
                    text: `${this.main.name}`,
                    align: 'left'
                },
            }
        },
        handleOptions(){
            for (let k in this.qualities)
                this.selectOptions.push({ id: k, label: this.qualities[k] })
        },
        // Sets and Formats
        setSeries () {
            const dt = []
            const media = []
            // if no value is selected
            if (!this.inputs.length) {

                for (let k in this.qualities) media.push( Number(help.avg(this.main[k])) )

                let valueMin = help.min(media)
                let valueMax = help.max(media)

                for (let k in this.qualities) {
                    let value = Number(help.avg(this.main[k]))
                    if (value === valueMin) {
                        dt.push({ name: this.qualities[k], data: this.main[k] })
                        this.inputs.push({ id: k, label: this.qualities[k] })
                    }
                    if (value === valueMax) {
                        dt.push({ name: this.qualities[k], data: this.main[k] })
                        this.inputs.push({ id: k, label: this.qualities[k] })
                    }
                }
            }
            else this.inputs.map(input => dt.push({ name: input.label, data: this.main[input.id] }))

            this.series = dt
        },
        // convert date & time
        formatDate() {
            const dt = []
            this.main.study_date.map(d => dt.push(help.dateFormat(d)))
            this.dates = dt
        },
    },
    watch: {
        main(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.formatDate()
                this.handleInit()
            }
        },
        inputs(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.formatDate()
                this.handleInit()
            }
        },
    },
}
</script>