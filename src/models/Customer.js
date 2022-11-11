import { query_json } from '../helpers/json'

export default class Customer {
    data = []

    constructor(date_start = '', date_end = ''){
        this.data = query_json('Customer:', date_start, date_end)
        this.setUnits(date_start, date_end)
    }

    all() {
        return this.data
    }

    findBy(name) {
        // console.log(this.data, name)
        return this.data.find(item => item.name == Number(name))
    }

    setUnits(date_start = '', date_end = ''){
        const units = query_json('Unit:', date_start, date_end)

        this.data.map((customer, index) => {
            units.map(unit => {
                if (unit.customer_name === customer.customer_name) {
                    this.data[index].units.push(unit)
                }
            })
        })
    }
}