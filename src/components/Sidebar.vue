<template>
<div>
    <slot></slot>
    <div class="list-group" v-if="main">
        <IndicatorComponent
            v-for="(label, scoreKey) in scores"
            :title="label"
            :options="main[`_${scoreKey}`]"
            :callback="() => this.handleClick(scoreKey)"
            :active="key===scoreKey"
            :strfix="'avg_exam_duration'===scoreKey?'':'%'"
        />
    </div>
</div>
</template>

<script>
import IndicatorComponent from './Indicator.vue'
import h from '../helpers'

export default {
    props: {
        main: Object,
        callback: Function,
        field: {
            type: String,
            required: false,
        }
    },
    created() {
        if (this.field) this.key = this.field
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
    setup() {
        return {
            scores: h.scores()
        }
    }
}
</script>
