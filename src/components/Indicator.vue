<template>
    <div v-if="isValid()" class="card shadow-sm border mb-2 pointer" :class="{ 'text-primary border border-primary' : active }">
        <div class="card-body row m-0 p-2">
            <div class="col-sm-12 col-md-6 col-lg-6">
                <div class="stretched-link" @click="callback()">
                    <h5>{{ title }}</h5>
                    <!-- IF not value -->
                    <h3 v-if="!value">
                        {{ options.avg }}{{ this.symbol(field) }}
                        <span v-if="help">
                            <i class="bi bi-question-circle"></i>
                        </span>
                    </h3>

                    <h3 v-if="value">
                        {{ value }}{{ this.symbol(field) }}
                        <span v-if="help">
                            <i class="bi bi-question-circle"></i>
                        </span>
                    </h3>
                </div>
            </div>
            <div  class="col-sm-12 col-md-6 col-lg-6">
                <div class="row text-center p-0">
                    <div class="col-6">
                        <p>MIN</p>
                        <div class="badge rounded-pill bg-danger text-danger bg-opacity-25">
                            {{ valueMin ? valueMin : options.min }}
                            {{ this.symbol(field) }}
                        </div>
                    </div>
                    <div class="col-6">
                        <p>MAX</p>
                        <div class="badge rounded-pill bg-success text-success bg-opacity-25">
                            {{ valueMax ? valueMax : options.max }}
                            {{ this.symbol(field) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import help from '../helpers'
export default {
    props: {
        title: String,
        options: Object,
        field: String,
        callback: {
            type: Function,
            required: false,
        },
        help: {
            type: String,
            required: false,
        },
        active: {
            type: Boolean,
            required: false,
            default: false,
        },
        value: 0,
        valueMin: 0,
        valueMax: 0,
    },

    methods: {
        isValid() { return this.options.avg },

        symbol (key) { return help.symbol(key) },
    },
}
</script>