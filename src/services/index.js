import timeline_9 from './timeline_9.json'
import timeline_12 from './timeline_12.json'
import help from '../helpers'

export default {

    // Can be replaced by another method that meets the Json request
    toObj(id, start='', end='') {
        let data = []
        const dataJson = eval(`timeline_${id}`)

        Object.entries(dataJson).forEach(item => {
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

        // preparing data
        data = this.toJson(data, start, end)

        return data
    },

    // TYPES
    // customer_name: String || Number,
    // unit_name: String,
    // name: String || Number,
    // type: String,
    // lat: Float,
    // long: Float,
    // Array
    // id: Array,
    // general_score: Array,
    // qual_score: Array,
    // prod_score: Array,
    // safety_score: Array,
    // nps_score: Array,
    // avg_exam_duration: Array,
    // total_exams: Array,
    // study_date: Array,
    // start_time: Array,
    // exam_real_duration: Array,
    // COLLECTIONS
    // units: Array,
    // operator_name: Array,
    // data: Array,
    // OPERATORS
    // // muscle_cc_detected: Array, # Removed
    // detected_imf: Array,
    // muscle_convex: Array,
    // pectoralis_width: Array,
    // minor_pec_detected: Array,
    // sagging_breast_mlo: Array,
    // complete_musc_evident: Array,
    // nipple_in_profile_CC: Array,
    // nipple_in_profile_MLO: Array,
    // nipple_centralized: Array,
    // medial_lateral_area_relation: Array,
    // symmetry_cc_images: Array,
    // symmetry_mlo_images: Array,
    // symmetry_left_images: Array,
    // symmetry_right_images: Array,
    toJson (dataJson, start='', end='') {
        const data = []
        // let dataJson = this.toObj(id)
        // Merge register
        dataJson.map(item => {
            // test key name
            var key = data.findIndex(d => d.name === item.name)
            // key not exists
            if (key < 0) {
                data.push({
                    customer_name: item.customer_name,
                    unit_name: item.unit_name || null,
                    name: item.name,
                    type: item.type,
                    lat: item.lat || null,
                    long: item.long || null,
                    // Array
                    id: [],
                    general_score: [],
                    qual_score: [],
                    prod_score: [],
                    safety_score: [],
                    nps_score: [],
                    avg_exam_duration: [],
                    total_exams: [],
                    study_date: [],
                    start_time: [],
                    exam_real_duration: [],
                    // Collection | Array
                    units: [],
                    operator_name: [],
                    data: [],
                    // Operators
                    // muscle_cc_detected: [],
                    detected_imf: [],
                    muscle_convex: [],
                    pectoralis_width: [],
                    minor_pec_detected: [],
                    sagging_breast_mlo: [],
                    complete_musc_evident: [],
                    nipple_in_profile_CC: [],
                    nipple_in_profile_MLO: [],
                    nipple_centralized: [],
                    medial_lateral_area_relation: [],
                    symmetry_cc_images: [],
                    symmetry_mlo_images: [],
                    symmetry_left_images: [],
                    symmetry_right_images: [],
                })
            }
        })
        // Filter to Date
        if (start && end) {
            dataJson = dataJson.filter(item => help.is_between(item.study_date, start, end))
        }

        // Set data chart - ARRAY
        dataJson.map(item => {
            var key = data.findIndex(d => d.name === item.name)
            if (key >= 0) {
                data[key].data.push(item)
                data[key].id.push(item.id)
                data[key].avg_exam_duration.push(help.float(item.avg_exam_duration))
                data[key].general_score.push(help.percent(item.general_score))
                data[key].qual_score.push(help.percent(item.qual_score))
                data[key].prod_score.push(help.percent(item.prod_score))
                data[key].safety_score.push(help.percent(item.safety_score))
                data[key].nps_score.push(help.percent(item.nps_score))
                data[key].exam_real_duration.push(help.decimal(item.exam_real_duration))
                data[key].study_date.push(item.study_date)
                data[key].total_exams.push(item.total_exams)
                data[key].start_time.push(item.start_time)
                data[key].operator_name.push(item.operator_name)
                // Operators
                // data[key].muscle_cc_detected.push(help.percent(item.muscle_cc_detected))
                data[key].detected_imf.push(help.percent(item.detected_imf))
                data[key].muscle_convex.push(help.percent(item.muscle_convex))
                data[key].pectoralis_width.push(help.percent(item.pectoralis_width))
                data[key].minor_pec_detected.push(help.percent(item.minor_pec_detected))
                data[key].sagging_breast_mlo.push(help.percent(item.sagging_breast_mlo))
                data[key].complete_musc_evident.push(help.percent(item.complete_musc_evident))
                data[key].nipple_in_profile_CC.push(help.percent(item.nipple_in_profile_CC))
                data[key].nipple_in_profile_MLO.push(help.percent(item.nipple_in_profile_MLO))
                data[key].nipple_centralized.push(help.percent(item.nipple_centralized))
                data[key].medial_lateral_area_relation.push(help.percent(item.medial_lateral_area_relation))
                data[key].symmetry_cc_images.push(help.percent(item.symmetry_cc_images))
                data[key].symmetry_mlo_images.push(help.percent(item.symmetry_mlo_images))
                data[key].symmetry_left_images.push(help.percent(item.symmetry_left_images))
                data[key].symmetry_right_images.push(help.percent(item.symmetry_right_images))
            }
        })
        // Add data AVGs
        data.map(item => {
            item = Object.assign(item,{
                _avg_exam_duration: help.math(item.avg_exam_duration),
                _general_score: help.math(item.general_score),
                _nps_score: help.math(item.nps_score),
                _prod_score: help.math(item.prod_score),
                _qual_score: help.math(item.qual_score),
                _safety_score: help.math(item.safety_score),
                _study_date: item.study_date,
                _total_exams: help.math(item.total_exams),
                _start_time: help.math(item.start_time),
                _exam_real_duration: item.exam_real_duration,
            })
        })

        // getToType(type){
        //     const data = this.getDataAll()
        //     return data.filter(item => item.type === type)
        // }

        return data
    },
}