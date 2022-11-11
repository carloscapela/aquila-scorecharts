import { query_json } from '../helpers/json'
// import Device  from './Device'
export default class Operator {
    data = []

    constructor(date_start = '', date_end = ''){
        this.data = query_json('Operator:', date_start, date_end)
    }

    all() {
        return this.data
    }
}