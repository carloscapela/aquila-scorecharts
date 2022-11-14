<template>
    <div>
        <slot></slot>
        <div class="list-group" v-if="main">
            <IndicatorComponent
                v-for="(label, scoreKey) in scores"
                :title="label"
                :options="main[`_${scoreKey}`]"
                :callback="() => this.handleClick(scoreKey)"
                :active="this.key===scoreKey"
                :strfix="this.symbol(scoreKey)"
                :value="scoreKey==='total_exams'?'total':'avg'"
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
    },
    setup () {
        return { scores: help.scores() }
    }
}
</script>
