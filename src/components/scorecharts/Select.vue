<template>
    <div class="card mb-1">
        <div class="card-header p-0 text-success text-center">
            <button
                type="botton"
                class="btn btn-link"
                @click="handleClick">
                {{ prefix }}
                {{ main ? main.name : '' }}
            </button>
        </div>
        <div class="card-body p-2">
            <v-select
                :options="options"
                v-model="input"
                :get-option-label="(op) => op.name"
            ></v-select>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        main: {},
        selected: {},
        options: Array,
        prefix: '',
        callback: Function,
    },
    data() {
        return {
            input: {},
            disabled: false,
        }
    },
    created() {
        if (this.selected && (this.selected!==this.main))
            this.input = this.selected
    },
    methods: {
        handleClick() {
            this.input = {}
            this.callback(this.main)
        },
    },
    watch: {
        input(newValue, oldValue) {
            if((newValue !== oldValue) && newValue.name) this.callback(newValue)
        },
        selected(newValue, oldValue) {
            // console.log(newValue, oldValue)
            if ((newValue !== oldValue) && newValue !== this.main) {
                this.input = newValue
            }
        }
    },
}
</script>