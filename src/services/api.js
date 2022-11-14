import dataAll from './all.json'
// import dataDevices from './devices.json'

export default class API {

    // GETs
    // static getDataDevices () {
    //     return this.getDataObject(dataDevices)
    // }

    static getDataAll() {
        return this.getDataObject(dataAll)
    }

    static getToType(type){
        const data = this.getDataAll()
        return data.filter(item => item.type === type)
    }

    // Ĉonverte para objetos humanizados, os dados do json
    static getDataObject(json) {
        const data = []

        Object.entries(json).forEach(item => {
            let [field, values] = item

            Object.entries(values).forEach(entity => {
                let [id, value] = entity

                if (!data.length) {
                    data.push({ id: id, [field]: value })
                } else {
                    if (data[id]) Object.assign(data[id], {[field]: value})
                    else data.push({ id: id, [field]: value })
                }
            })
        })

        return data
    }
}