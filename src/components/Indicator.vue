<template>
    <div v-if="isValid()" class="card shadow-sm border mb-2 pointer" :class="{ 'text-primary border border-primary' : active }">
        <div class="card-body row m-0 p-2">
            <div class="col-6">
                <div class="stretched-link" @click="callback()">
                    <h5>{{ title }}</h5>
                    <h2>
                        {{ options[value] }} {{ strfix }}
                        <span v-if="help">
                            <i class="bi bi-question-circle"></i>
                        </span>
                    </h2>
                </div>
            </div>
            <div  class="col-6">
                <div class="row text-center">
                    <div class="col-6">
                        <p>{{ valueMin }}</p>
                        <div class="badge rounded-pill bg-danger text-danger bg-opacity-25">
                            <i class="bi bi-caret-down-fill"></i>
                            {{ options[valueMin] }} {{ strfix }}
                        </div>
                    </div>
                    <div class="col-6">
                        <p>{{ valueMax }}</p>
                        <div class="badge rounded-pill bg-success text-success bg-opacity-25">
                            <i class="bi bi-caret-up-fill"></i>
                            {{ options[valueMax] }} {{ strfix }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        options: Object,
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
        strfix: {
            type: String,
            default: '%',
        },
        value: {
            type: String,
            default: 'avg',
        },
        valueMin: {
            type: String,
            default: 'min',
        },
        valueMax: {
            type: String,
            default: 'max',
        },
    },

    methods: {
        isValid() {
            return this.options.min || this.options.avg || this.options.max
        },
    },
}
</script>