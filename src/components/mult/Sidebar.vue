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
            <input type="text" class="form-control border-secondary" :value="titleX || 'Score X'" disabled>
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
            <input type="text" class="form-control border-warning" :value="titleY || 'Score Y'" disabled>
        </div>
    </div>
    <!-- <div class="list-group" v-if="main"> -->
    <IndicatorComponent
        v-for="(label, scoreKey) in scores"
        :title="label"
        :options="main[`_${scoreKey}`]"
        :callback="() => this.handleClick(scoreKey)"
        :active="key===scoreKey"
    />
    <!-- </div> -->
</div>
<!-- <div>
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
            <input type="text" class="form-control border-secondary" :value="titleX || 'Score X'" disabled>
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
            <input type="text" class="form-control border-warning" :value="titleY || 'Score Y'" disabled>
        </div>
    </div>

    <div class="list-group text-center" v-if="main">
        <button
            class="list-group-item"
            aria-current="true"
            @click="handleClick('general_score', 1)"
            :class="getClassActive(1)"
        >
            <div class="row">
                <div class="col-12 fw-bold">General Score</div>
                <div class="col-lg-6 col-md-12">
                    <h1>{{ main._general_score.avg }}%</h1>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="col-12">
                        Max {{ main._general_score.max }}%
                    </div>
                    <div class="col-12">
                        Min {{ main._general_score.min }}%
                    </div>
                </div>
            </div>
        </button>

        <button
            class="list-group-item"
            aria-current="true"
            @click="handleClick('qual_score', 2)"
            :class="getClassActive(2)"
        >
            <div class="row">
                <div class="col-12 fw-bold">Quality Score</div>
                <div class="col-lg-6 col-md-12">
                    <h1>{{ main._qual_score.avg }}%</h1>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="col-12">
                        Max {{ main._qual_score.max }}%
                    </div>
                    <div class="col-12 col-md-12">
                        Min {{ main._qual_score.min }}%
                    </div>
                </div>
            </div>
        </button>

        <button
            class="list-group-item"
            aria-current="true"
            @click="handleClick('avg_exam_duration', 3)"
            :class="getClassActive(3)"
        >
            <div class="row">
                <div class="col-12 fw-bold">AVG Time (min)</div>
                <div class="col-lg-6 col-md-12">
                    <h1>{{ main._avg_exam_duration.avg }}</h1>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="col-12">
                        Max {{ main._avg_exam_duration.max }}
                    </div>
                    <div class="col-12">
                        Min {{ main._avg_exam_duration.min }}
                    </div>
                </div>
            </div>
        </button>

        <button
            class="list-group-item"
            aria-current="true"
            @click="handleClick('prod_score', 4)"
            :class="getClassActive(4)"
        >
            <div class="row">
                <div class="col-12 fw-bold">Ocupation</div>
                <div class="col-lg-6 col-md-12">
                    <h1>{{ main._prod_score.avg }}%</h1>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="col-12">
                        Max {{ main._prod_score.max }}%
                    </div>
                    <div class="col-12">
                        Min {{ main._prod_score.min }}%
                    </div>
                </div>
            </div>
        </button>

        <button
            class="list-group-item"
            aria-current="true"
            @click="handleClick('safety_score', 5)"
            :class="getClassActive(5)"
        >
            <div class="row">
                <div class="col-12 fw-bold">Radiation Overdose</div>
                <div class="col-6">
                    <h1>{{ main._safety_score.max }}%</h1>
                </div>
                <div class="col-6">
                    <div class="col-12">
                        Max {{ main._safety_score.max }}%
                    </div>
                    <div class="col-12">
                        Min {{ main._safety_score.min }}%
                    </div>
                </div>
            </div>
        </button>

        <button
            class="list-group-item"
            aria-current="true"
            @click="handleClick('nps_score', 6)"
            :class="getClassActive(6)"
        >
            <div class="row">
                <div class="col-12 fw-bold">NPS</div>
                <div class="col-lg-6 col-md-12">
                    <h1>{{ main._nps_score.avg }}%</h1>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="col-12">
                        Max {{ main._nps_score.max }}%
                    </div>
                    <div class="col-12">
                        Min {{ main._nps_score.min }}%
                    </div>
                </div>
            </div>
        </button>
    </div>
</div> -->
</template>

<script>
import h from '../../helpers'
import IndicatorComponent from '../Indicator.vue'
// import {labels} from '../../helpers/util'
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
        handleClick(field, key){
            if (!this.x && !this.y) {
                this.x = field
                this.titleX = labels(field)
                this.callbackX(field)
            } else if (this.x && !this.y) {
                this.y = field
                this.titleY = labels(field)
                this.callbackY(field)
            } else if (this.x && this.y) {
                this.y = field
                this.titleY = labels(field)
                this.callbackY(field)
            } else {
                this.x = field
                this.titleX = labels(field)
                this.callbackX(field)
            }
        },
        getClassActive (key) {
            let ObjectStyle = {}
            if (key===this.y) ObjectStyle = { 'list-group-item-warning': true }
            if (key===this.x) ObjectStyle = { 'list-group-item-secondary': true }

            return ObjectStyle
        },
    },
    setup() {
        return {
            scores: h.scores()
        }
    }
}
</script>