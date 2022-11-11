import { DOMDirectiveTransforms } from '@vue/compiler-dom'
import { query_json } from '../helpers/json'
import Operator from './Operator'

export default class Device {
    data = []

    constructor(date_start = '', date_end = ''){
        this.data = query_json('Device:', date_start, date_end)
    }

    all() {
        return this.data
    }

    findBy(name) {
        return this.data.find(item => item.name == name)
    }

    getToUnit(unit_name) {
        return this.data.filter(item => item.unit_name === unit_name)
    }

    getOperators(name, date_start = '', date_end = '') {
        const device = this.findBy(name)
        const operators = (new Operator(date_start, date_end)).all()
        // console.log(device)
        // let data = []
        let data = operators.filter(item => {
            if (device.operator_name.includes(item.name)) {
                return item
            }
        })

        return data
    }
}