import { createStore } from 'vuex'
import db from '../db'

export default createStore({
    state: {
        // Collection
        data: [],
        units: [],
        devices: [],
        operators: [],
        // Object
        customer: {},
        main: {},
    },
    actions: {
        // not async
        // payload: {
        //     name: Number | String,
        //     start: String,
        //     end: String,
        // }
        fetch({ commit, dispatch }, { name, start, end}) {
            try {
                const customerId = Number(name)

                const resp = db.toObj(customerId, start, end)

                commit('SET_DATA', resp)

                dispatch('fetchCustomer', customerId)
                dispatch('fetchUnits', customerId)
                dispatch('fetchDevices', customerId)
                dispatch('fetchOperators', customerId)
            }
            catch (error) { console.log(error) }
        },

        fetchCustomer({ commit }, name) {
            const data = this.state.data

            const resp = data.find(item =>
                item.type === 'Customer:' && Number(item.customer_name) === name
            )

            commit('SET_CUSTOMER', resp)
        },

        fetchUnits({ commit }, name) {
            const data = this.state.data

            const resp = data.filter(item =>
                item.type === 'Unit:' && Number(item.customer_name) === name
            )

            commit('SET_UNITS', resp)
        },

        fetchDevices({ commit }, name) {
            const data = this.state.data

            const resp = data.filter(item =>
                item.type === 'Device:' && Number(item.customer_name) === name
            )

            commit('SET_DEVICES', resp)
        },

        fetchOperators({ commit }, name) {
            const data = this.state.data

            const resp = data.filter(item =>
                item.type === 'Operator:' && Number(item.customer_name) === name
            )

            commit('SET_OPERATORS', resp)
        },

        // payload: {
        //     name: Number | String,
        //     type: String,
        // }
        find({ commit }, { name, type }) {
            const data = this.state.data

            const resp = data.find(item => item.type == type && item.name == name)

            commit('SET_MAIN', resp)
        }
    },
    mutations: {
        SET_DATA(state, data) { state.data = data },

        SET_UNITS(state, data) { state.units = data },

        SET_DEVICES(state, data) { state.devices = data },

        SET_OPERATORS(state, data) { state.operators = data },

        SET_CUSTOMER(state, data) { state.customer = data },

        SET_MAIN(state, data) { state.main = data },
    }
})