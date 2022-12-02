import { createStore } from 'vuex'
import help from '../helpers'
import axios from 'axios'
// TEMP
// import db from '../db'

export default createStore({
    state: {
        // Collection
        data: [],
        dataLoad: false,

        units: [],
        devices: [],
        operators: [],

        // Object
        customer: {},
        main: {},
    },
    actions: {
        // payload: {
        //     name: Number | String,
        //     start: String,
        //     end: String,
        // }
        async fetchApi({ commit, dispatch }, { name, start, end }) {

                commit('SET_DATA_LOAD', true)

                const customerId = Number(name)

                const response = await axios.get(
                    `https://scorechat-aquila.herokuapp.com/api/${customerId}`,
                    { params: { start, end } }
                )
                const resp = help.toObj(response.data)

                if (response.status === 200) {
                    commit('SET_DATA', resp)

                    dispatch('fetchCustomer', customerId)
                    dispatch('fetchUnits', customerId)
                } else {
                    commit('SET_DATA', [])
                }

                commit('SET_DATA_LOAD', false)
        },

        // @param name customer_name
        async fetchCustomer({ commit }, name) {
            const data = this.state.data

            const resp = data.find(item =>
                item.type === 'Customer:' && Number(item.customer_name) === name
            )

            commit('SET_CUSTOMER', resp)
        },

        async fetchUnits({ commit }, name) {
            const data = this.state.data

            const resp = data.filter(item =>
                item.type === 'Unit:' && Number(item.customer_name) === name
            )

            commit('SET_UNITS', resp)
        },

        // payload: {
        //     name: Number || String, # customer_name
        //     unitName: String,
        // }
        async fetchDevices({ commit }, payload) {
            const data = this.state.data

            const resp = data.filter(item => {
                if (item.type === 'Device:' && Number(item.customer_name) === Number(payload.name)) {
                    // filter to UNIT
                    if (payload.unitName) {
                        return payload.unitName === item.unit_name
                    }

                    return item
                }
            })

            commit('SET_DEVICES', resp)
        },

        // payload: {
        //     name: Number || String, # customer_name
        //     start: String,
        //     end: String,
        //     callback: Function
        // }
        async fetchOperators({ commit }, payload) {
            const data = this.state.data

            const resp = data.filter(item => {
                if (item.type === 'Operator:' && Number(item.customer_name) === Number(payload.name)) {
                    return item
                }
            })

            commit('SET_OPERATORS', resp)
        },

        // payload: {
        //     name: Number || String,
        //     type: String,
        // }
        async find({ commit }, { name, type }) {
            const data = this.state.data

            const resp = data.find(item => item.type == type && item.name == name)

            commit('SET_MAIN', resp)
        }
    },
    mutations: {
        SET_DATA_LOAD(state, data) { state.dataLoad = data },

        SET_DATA(state, data) { state.data = data },

        SET_UNITS(state, data) { state.units = data },

        SET_DEVICES(state, data) { state.devices = data },

        SET_OPERATORS(state, data) { state.operators = data },

        SET_CUSTOMER(state, data) { state.customer = data },

        SET_MAIN(state, data) { state.main = data },
    }
})