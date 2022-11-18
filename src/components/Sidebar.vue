<template>
    <div>
        <slot></slot>
        <div class="list-group" v-if="main">
            <IndicatorComponent
                title="Production"
                :options="main._total_exams"
                :callback="() => this.handleClick('total_exams')"
                :active="this.key==='total_exams'"
                :value="this.totalExams(main)"
                field="total_exams"
            />
            <IndicatorComponent
                v-for="(label, scoreKey) in scores"
                :title="label"
                :options="main[`_${scoreKey}`]"
                :callback="() => this.handleClick(scoreKey)"
                :active="this.key===scoreKey"
                :field="scoreKey"
            />
        </div>
    </div>
</template>

<script>
import IndicatorComponent from './Indicator.vue'
import help from '../helpers'
export default {
    props: {
        main: Object,
        callback: Function,
        field: {
            type: String,
            required: false,
            default: 'general_score',
        }
    },
    created() {
        if (this.field) this.key = this.field
    },
    components: { IndicatorComponent },
    data() {
        return { key: 'general_score' }
    },
    methods: {
        handleClick (field) {
            this.key = field
            this.callback(field)
        },
        symbol (key) {
            return help.symbol(key)
        },

        totalExams(main){
            return help.totalExams(main)
        }
    },
    setup () {
        return { scores: help.scores() }
    }
}
</script>
