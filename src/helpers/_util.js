import moment from 'moment'

export function color_pick(score) {
    const data = {
        general_score: '#ffe500',
        qual_score: '#ff0000',
        avg_exam_duration: '#0015ff',
        prod_score: '#5e5d5d',
        safety_score: '#5e5d5d',
        nps_score : '#5e5d5d',
    }

    return data[score]
}

export function labels(score_name = '') {
    const data = {
        general_score: 'General Score',
        qual_score: 'Quality Score',
        avg_exam_duration: 'AVG Time (min)',
        prod_score: 'Ocupation',
        safety_score: 'Radiation Overdose',
        nps_score: 'NPS',
    }

    return score_name ? data[score_name] : data
}

export function qualitys(key = '') {
    const data = {
        // muscle_cc_detected: 'Muscle Detected',
        detected_imf: 'Inframammary Angle',
        muscle_convex: 'Convex Pectoral Muscle',
        pectoralis_width: 'Width Pect Muscle',
        minor_pec_detected: 'Pectoralis Minor',
        sagging_breast_mlo: 'Droopy Breast',
        complete_musc_evident: 'Pectoral muscle to Nipple Level',
        nipple_in_profile_CC: 'Nipple In Profile CC',
        nipple_in_profile_MLO: 'Nipple In Profile MLO',
        nipple_centralized: 'Nipple Centralized',
        medial_lateral_area_relation: 'Medial/Lateral Ratio',
        symmetry_cc_images: 'CC symmetrical images',
        symmetry_mlo_images: 'MLO symmetrical images',
        symmetry_left_images: 'Left PNL MLO/CC',
        symmetry_right_images: 'Right PNL MLO/CC',
    }

    return key ? data[key] : data
}

export function radius(value) {
    let radius
    if (value >= 50 && value <= 65)  radius = 800
    if (value > 65 && value <= 85)  radius = 1200
    if (value > 85)  radius = 1500

    return radius
}

export function is_between(search, start, end) {
    return moment(search).isBetween(
        moment(start),
        moment(end),
        'days',
        '[]'
    )
}

export function bg_randon(){
    const months = ["warning", "success", "info", "danger", "primary", "secondary", "July", 'light', 'dark'];

    const random = Math.floor(Math.random() * months.length);
    return months[random];
}
