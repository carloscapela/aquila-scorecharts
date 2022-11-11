import { query_json } from '../helpers/json'

export default class Unit {
    data = []

    constructor(date_start = '', date_end = ''){
        this.data = query_json('Unit:', date_start, date_end)
    }

    all() {
        return this.data
    }

    findBy(name) {
        return this.data.find(item => item.name == name)
    }
}