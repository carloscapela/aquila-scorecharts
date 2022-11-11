import API from '../services/api'
import {min, max, percent, avg, decimal} from './numbers'
import {is_between} from './util'

// UTIL EXCLUSIVE
// Geral
export function math (array) {
    return {
        min: min(array),
        max: max(array),
        avg: avg(array),
    }
}

// usado em time
export function math_time (array) {
    return {
        min: min(array),
        max: max(array),
        avg: avg(array),
    }
}

export function query_json (type = 'Customer:', start='', end='') {
    const data = []
    let customers = API.getToType(type)
    // Merge register
    customers.map(item => {
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
    // Filter
    if (start && end) {
        customers = customers.filter(item => is_between(item.study_date, start, end))
    }
    // Set data chart - ARRAY
    customers.map(item => {
        var key = data.findIndex(d => d.name === item.name)
        if (key >= 0) {
            data[key].data.push(item)
            data[key].id.push(item.id)
            data[key].avg_exam_duration.push(decimal(item.avg_exam_duration))
            data[key].general_score.push(percent(item.general_score))
            data[key].qual_score.push(percent(item.qual_score))
            data[key].prod_score.push(percent(item.prod_score))
            data[key].safety_score.push(percent(item.safety_score))
            data[key].nps_score.push(percent(item.nps_score))
            data[key].exam_real_duration.push(decimal(item.exam_real_duration))
            data[key].study_date.push(item.study_date)
            data[key].total_exams.push(item.total_exams)
            data[key].start_time.push(item.start_time)
            data[key].operator_name.push(item.operator_name)
            // Operators
            // data[key].muscle_cc_detected.push(percent(item.muscle_cc_detected))
            data[key].detected_imf.push(percent(item.detected_imf))
            data[key].muscle_convex.push(percent(item.muscle_convex))
            data[key].pectoralis_width.push(percent(item.pectoralis_width))
            data[key].minor_pec_detected.push(percent(item.minor_pec_detected))
            data[key].sagging_breast_mlo.push(percent(item.sagging_breast_mlo))
            data[key].complete_musc_evident.push(percent(item.complete_musc_evident))
            data[key].nipple_in_profile_CC.push(percent(item.nipple_in_profile_CC))
            data[key].nipple_in_profile_MLO.push(percent(item.nipple_in_profile_MLO))
            data[key].nipple_centralized.push(percent(item.nipple_centralized))
            data[key].medial_lateral_area_relation.push(percent(item.medial_lateral_area_relation))
            data[key].symmetry_cc_images.push(percent(item.symmetry_cc_images))
            data[key].symmetry_mlo_images.push(percent(item.symmetry_mlo_images))
            data[key].symmetry_left_images.push(percent(item.symmetry_left_images))
            data[key].symmetry_right_images.push(percent(item.symmetry_right_images))
        }
    })

    // Add data AVGs
    data.map(item => {
        item = Object.assign(item,{
            _avg_exam_duration: math(item.avg_exam_duration),
            _general_score: math(item.general_score),
            _nps_score: math(item.nps_score),
            _prod_score: math(item.prod_score),
            _qual_score: math(item.qual_score),
            _safety_score: math(item.safety_score),
            _study_date: item.study_date,
            _total_exams: math(item.total_exams),
            _start_time: math(item.start_time),
            _exam_real_duration: item.exam_real_duration,
        })
    })

    return data
}
