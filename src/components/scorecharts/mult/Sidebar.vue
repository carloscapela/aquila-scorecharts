<template>
<div v-if="main">
    <slot></slot>
    <div>
        <div class="input-group mb-2">
            <button
                class="btn btn-outline-secondary"
                type="button"
                :class="{ disabled: !titleX }"
                @click="() => {
                    x = null
                    titleX = ''
                }"
                title="Clean X"
            >
                <i class="bi bi-trash"></i>
            </button>
            <input
                type="text"
                class="form-control border-secondary"
                :value="titleX || 'Score X'"
                disabled
            />
        </div>

        <div class="input-group mb-2">
            <button
                class="btn btn-outline-warning"
                type="button"
                :class="{ disabled: !titleY }"
                @click="() => {
                    y = null
                    titleY = ''
                }"
                title="Clean Y"
            >
                <i class="bi bi-trash"></i>
            </button>
            <input
                type="text"
                class="form-control border-warning"
                :value="titleY || 'Score Y'"
                disabled
            >
        </div>
    </div>
    <IndicatorComponent
        title="Production"
        :options="main._total_exams"
        :callback="() => this.handleClick('total_exams')"
        :active="getClassActive('total_exams')"
        :value="this.totalExams(main)"
        field="total_exams"
    />
    <IndicatorComponent
        v-for="(label, scoreKey) in scores"
        :title="label"
        :options="main[`_${scoreKey}`]"
        :callback="() => this.handleClick(scoreKey)"
        :active="getClassActive(scoreKey)"
    />
</div>
</template>

<script>
import help from '../../../scorecharts/helpers'
import IndicatorComponent from '../Indicator.vue'
export default {
    props: {
        main: Object,
        callbackX: Function,
        callbackY: Function,
    },
    components: {
        IndicatorComponent
    },
    data() {
        return {
            x: null,
            y: null,
            titleX: '',
            titleY: '',
        }
    },
    methods: {
        handleClick(field){
            if (!this.x && !this.y) {
                this.x = field
                this.titleX = this.getLable(field)
                this.callbackX(field)
            } else if (this.x && !this.y) {
                this.y = field
                this.titleY = this.getLable(field)
                this.callbackY(field)
            } else if (this.x && this.y) {
                this.y = field
                this.titleY = this.getLable(field)
                this.callbackY(field)
            } else {
                this.x = field
                this.titleX = this.getLable(field)
                this.callbackX(field)
            }
        },
        getClassActive (key) {
            return (key===this.y || key===this.x) ? true : false
        },
        totalExams(main){
            return help.totalExams(main)
        },
        getLable(field) {
            return field === 'total_exams' ? 'Production' : help.scores(field)
        }
    },
    setup() {
        return { scores: help.scores() }
    }
}
</script>