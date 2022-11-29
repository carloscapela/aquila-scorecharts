<template>
<div v-if="main">
    <slot></slot>
    <div class="card mb-2 text-center">
        <div class="card-header">
           Name: {{ main.name }}
        </div>
        <div class="card-body">
            <button
                class="btn btn-secondary btn-sm m-1"
                :class="{ disabled: !titleX }"
                @click="() => {
                    x = null
                    titleX = ''
                }"
                type="button"
            >
                <i class="bi bi-trash"></i>
                {{ titleX || 'Score X' }}
            </button>


            <button
                class="btn btn-warning btn-sm m-1"
                :class="{ disabled: !titleY }"
                @click="() => {
                    y = null
                    titleY = ''
                }"
                type="button"
            >
                <i class="bi bi-trash"></i>
                {{ titleY || 'Score X' }}
            </button>
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
    <!-- <IndicatorComponent
        v-for="(label, scoreKey) in scores"
        :title="label"
        :options="main[`_${scoreKey}`]"
        :callback="() => this.handleClick(scoreKey)"
        :active="getClassActive(scoreKey)"
        :value="scoreKey==='safety_score' ? main[`_${scoreKey}`].max : main[`_${scoreKey}`].avg"
    /> -->
    <IndicatorComponent
        v-for="(label, scoreKey) in scores"
        :title="label"
        :options="main[`_${scoreKey}`]"
        :callback="() => this.handleClick(scoreKey)"
        :active="getClassActive(scoreKey)"
        :field="scoreKey"
        :value="scoreKey==='safety_score' ? main[`_${scoreKey}`].max : main[`_${scoreKey}`].avg"
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