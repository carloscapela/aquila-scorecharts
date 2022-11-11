<template>
<div>
    <slot></slot>
    <div class="list-group" v-if="main">
        <IndicatorComponent
            title="General Score"
            :options="main._general_score"
            :callback="() => this.handleClick('general_score')"
            :active="key==='general_score'"
        />

        <IndicatorComponent
            title="Quality Score"
            :options="main._qual_score"
            :callback="() => this.handleClick('qual_score')"
            :active="key==='qual_score'"
        />

        <IndicatorComponent
            title="AVG Time (m)"
            :options="main._avg_exam_duration"
            :callback="() => this.handleClick('avg_exam_duration')"
            :active="key==='avg_exam_duration'"
        />

        <IndicatorComponent
            title="Ocupation"
            :options="main._prod_score"
            :callback="() => this.handleClick('prod_score')"
            :active="key==='prod_score'"
        />

        <IndicatorComponent
            title="Radiation Overdose"
            :options="main._safety_score"
            :callback="() => this.handleClick('safety_score')"
            :active="key==='safety_score'"
        />

        <IndicatorComponent
            title="NPS"
            :options="main._nps_score"
            :callback="() => this.handleClick('nps_score')"
            :active="key==='nps_score'"
        />
    </div>
</div>
</template>

<script>
import IndicatorComponent from './Indicator.vue'
export default {
    props: {
        main: Object,
        callback: Function,
    },
    components: {
        IndicatorComponent
    },
    data() {
        return {
            key: 'general_score',
        }
    },
    methods: {
        handleClick(field, key){
            this.key = field
            this.callback(field)
        },
    },
}
</script>
