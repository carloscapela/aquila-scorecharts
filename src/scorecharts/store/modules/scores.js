// import { createStore } from 'vuex'
// to do API
import db from '../../db'

export default {
    namespaced: true,
    state: () => ({
        // Collection
        data: [],
        units: [],
        devices: [],
        operators: [],
        // Object
        customer: {},
        main: {},
    }),
    actions: {
        // not async
        // payload: {
        //     name: Number | String,
        //     start: String,
        //     end: String,
        // }
        fetch({ commit, dispatch }, { name, start, end }) {
            try {
                const customerId = Number(name)

                // to do API request
                const resp = db.toObj(customerId, start, end)

                commit('SET_DATA', resp)

                dispatch('fetchCustomer', customerId)
                dispatch('fetchUnits', customerId)
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

        // payload: {
        //     name: Number || String, # customer_name
        //     unitName: String,
        // }
        fetchDevices({ commit }, payload) {
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
        fetchOperators({ commit }, { name, start, end, callback }) {
            const customerId = Number(name)

            const data = db.toObj(customerId, start, end, (callback ? callback : null))

            const resp = data.filter(item =>
                item.type === 'Operator:' && Number(item.customer_name) === customerId
            )

            commit('SET_OPERATORS', resp)
        },

        // payload: {
        //     name: Number || String,
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
}