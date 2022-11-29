import { Loader } from '@googlemaps/js-api-loader'
import moment from 'moment'

const API_KEY = 'AIzaSyBP4mlIFGg5zQdgvUe0uxQ1bHCSt8847uE'
const VERSION = 'weekly'
const QUALITIES = {
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
const SCORES = {
    // Removido devido as particularidades
    // total_exams: 'Production',
    general_score: 'General Score',
    qual_score: 'Quality Score',
    avg_exam_duration: 'AVG Time',
    prod_score: 'Ocupation',
    safety_score: 'Peak Radiation Overdose',
    nps_score: 'NPS',
}
const SYMBOL = {
    total_exams: '',
    general_score: '%',
    qual_score: '%',
    avg_exam_duration: 'min',
    prod_score: '%',
    safety_score: '%',
    nps_score: '%',
}

export default {

    // returns an object with all qualifiers
    qualities (key = '') { return key ? QUALITIES[key] : QUALITIES },

    // returns a scoring key
    getKeyScore (main) {
        const data = this.scores()
        // console.log(main)
        for (const field in data) {
            if (main[`_${field}`].avg) return field
        }

        return 'qual_score'
    },

    random() {
        return (Math.random() + 1).toString(36).substring(7)
    },

    scores (key = '') { return key ? SCORES[key] : SCORES },

    symbol (key) { return key ? SYMBOL[key] : ''  },

    // load Maps
    load () {
        return new Loader({ apiKey: API_KEY, version: VERSION, libraries: ['places'] })
    },

    avgLatLong (lats = [], longs = []) {
        const sumLat = lats.reduce((a, b) => Number(a) + Number(b), 0)
        const lat = sumLat / lats.length
        const sumLong = longs.reduce((a, b) => Number(a) + Number(b), 0)
        const lng = sumLong / longs.length
        return { lat, lng }
    },

    is_between(search, start, end) {
        let date = this.dateFormat(search)

        return moment(date).utc(0).isBetween(
            moment(start),
            moment(end),
            'days',
            '[]'
        )
    },

    // Return format MMM DD YYYY
    dateFormat(dsn) {
        let value = dsn.replace('T00:00:00.000Z', '')
        return moment(value).utc(0).format('MMM DD YYYY')
    },
    // Numbers
    percent (v) { return (v*100).toFixed() },

    decimal (v) { return Number(v).toFixed() },

    min (v) {
        const value = Math.min(...v)
        return value ? value : 0
    },

    max (v) {
        const value = Math.max(...v)
        return value ? value : 0
    },

    sum (array) { return array.reduce((a, b) => Number(a) + Number(b), 0) },

    avg (array) {
        const sum = this.sum(array)
        return (sum <= 0) ? 0 : this.decimal(sum / array.length)
    },

    avgFloat (array) {
        const sum = array.reduce((a, b) => Number(a) + Number(b), 0)
        return (sum <= 0) ? 0 : this.float(sum / array.length)
    },

    float (v) { return Number.parseFloat(v).toFixed(2) },

    math (array) {
        return {
            min: this.min(array),
            max: this.max(array),
            avg: this.avg(array),
            total: this.sum(array),
        }
    },

    mathTime (array) {
        return {
            min: this.min(array),
            max: this.max(array),
            avg: this.avgFloat(array),
            total: this.sum(array),
        }
    },
    // Devido a repetição de valores do total de exames
    // Tornou-se necessário a concatenação de dados por DATA
    totalExams(main) {
        let search = []
        let exames = []
        main.study_date.map((data, index) => {
            var values = {
                study_date: data,
                total_exams: main.total_exams[index],
            }
            var k = search.findIndex(d => d.study_date === data)

            if (k < 0) {
                search.push(values)
                exames.push(values.total_exams)
            }
        })


       return exames.length ? this.sum(exames) : 0
    },

    // Return Object { start, end } // date format YYYY-MM-DD
    // create a query with default date
    queryDate(query) {
        let start = moment().subtract(1, 'months').format('YYYY-MM-DD')
        let end = moment().format('YYYY-MM-DD')

        if (query.start) start = moment(query.start, 'YYYY-MM-DD').utc(0).format('YYYY-MM-DD')
        if (query.end) end = moment(query.end, 'YYYY-MM-DD').utc(0).format('YYYY-MM-DD')

        return { start, end }
    },

    toObj(dataJson, filterCallback = null) {
        let data = []

        for (const key in dataJson) data.push(dataJson[key])

        // preparing data
        data = this.toJson(data, filterCallback)

        return data
    },

    toJson (dataJson, filterCallback = null) {
        // console.log(dataJson)
        const data = []

        // filtercallback
        if (filterCallback) dataJson = filterCallback(dataJson)

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
                    // id: [],
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
                    // units: [],
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
                    // ADD 15-11-2022
                    accession_number: [],
                    avg_grade: [],
                    study_description: [],
                    n_images: [],
                })
            }
        })

        // Set data chart - ARRAY
        dataJson.map(item => {
            var key = data.findIndex(d => d.name === item.name)
            if (key >= 0) {
                data[key].data.push(item)
                // data[key].id.push(item.id)
                data[key].avg_exam_duration.push(this.float(item.avg_exam_duration))
                data[key].general_score.push(this.percent(item.general_score))
                data[key].qual_score.push(this.percent(item.qual_score))
                data[key].prod_score.push(this.percent(item.prod_score))
                data[key].safety_score.push(this.percent(item.safety_score))
                data[key].nps_score.push(this.percent(item.nps_score))
                data[key].exam_real_duration.push(this.float(item.exam_real_duration))
                data[key].study_date.push(item.study_date)
                data[key].total_exams.push(item.total_exams)
                data[key].start_time.push(item.start_time)
                data[key].operator_name.push(item.operator_name)
                // Operators
                // data[key].muscle_cc_detected.push(this.percent(item.muscle_cc_detected))
                data[key].detected_imf.push(this.percent(item.detected_imf))
                data[key].muscle_convex.push(this.percent(item.muscle_convex))
                data[key].pectoralis_width.push(this.percent(item.pectoralis_width))
                data[key].minor_pec_detected.push(this.percent(item.minor_pec_detected))
                data[key].sagging_breast_mlo.push(this.percent(item.sagging_breast_mlo))
                data[key].complete_musc_evident.push(this.percent(item.complete_musc_evident))
                data[key].nipple_in_profile_CC.push(this.percent(item.nipple_in_profile_CC))
                data[key].nipple_in_profile_MLO.push(this.percent(item.nipple_in_profile_MLO))
                data[key].nipple_centralized.push(this.percent(item.nipple_centralized))
                data[key].medial_lateral_area_relation.push(this.percent(item.medial_lateral_area_relation))
                data[key].symmetry_cc_images.push(this.percent(item.symmetry_cc_images))
                data[key].symmetry_mlo_images.push(this.percent(item.symmetry_mlo_images))
                data[key].symmetry_left_images.push(this.percent(item.symmetry_left_images))
                data[key].symmetry_right_images.push(this.percent(item.symmetry_right_images))
                // ADD 15-11-2022
                data[key].accession_number.push(item.accession_number)
                data[key].avg_grade.push(item.avg_grade)
                data[key].study_description.push(item.study_description)
                data[key].n_images.push(item.n_images)
            }
        })
        // Add data AVGs
        data.map(item => {
            item = Object.assign(item,{
                _avg_exam_duration: this.mathTime(item.avg_exam_duration),
                _general_score: this.math(item.general_score),
                _nps_score: this.math(item.nps_score),
                _prod_score: this.math(item.prod_score),
                _qual_score: this.math(item.qual_score),
                _safety_score: this.math(item.safety_score),
                _study_date: item.study_date,
                _start_time: this.math(item.start_time),
                _exam_real_duration: item.exam_real_duration,
                _total_exams: this.math(item.total_exams),
            })
        })

        return data
    },

    // Converts varying values to percentage.
    // Uses a simple three-rule pattern
    // used in Production and AVG Time
    toPercent(value, max) {
        let v = this.float(value)
        let m = this.float(max)
        // max ==> 100%
        // value ==> x
        return this.float( (v * 100) / m )
    },
}