import { Loader } from '@googlemaps/js-api-loader'

import moment from 'moment'

const API_KEY = 'AIzaSyBP4mlIFGg5zQdgvUe0uxQ1bHCSt8847uE'
const VERSION = 'weekly'

export default {

    // returns an object with all qualifiers
    qualitys (key = '') {
         data = {
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
    },

    // returns a scoring key
    getKeyScore (main) {
        const data = this.scores()

        for (const field in data) {
            if (main[`_${field}`].avg) return field
        }

        return 'qual_score'
    },

    // returns an object with all scores and their descriptions
    labels (score_name = '') {
        const data = {
            general_score: 'General Score',
            qual_score: 'Quality Score',
            avg_exam_duration: 'AVG Time',
            prod_score: 'Ocupation',
            safety_score: 'Peak Radiation Overdose',
            nps_score: 'NPS',
        }

        return score_name ? data[score_name] : data
    },

    scores (score_name = '') {
        const data = {
            general_score: 'General Score',
            qual_score: 'Quality Score',
            avg_exam_duration: 'AVG Time',
            prod_score: 'Ocupation',
            safety_score: 'Peak Radiation Overdose',
            nps_score: 'NPS',
        }

        return score_name ? data[score_name] : data
    },

    // load Maps
    load () {
        return new Loader({
            apiKey: API_KEY,
            version: VERSION,
            libraries: ['places'],
        })
    },

    avgLatLong (lats = [], longs = []) {
        const sumLat = lats.reduce((a, b) => Number(a) + Number(b), 0)
        const lat = sumLat / lats.length
        const sumLong = longs.reduce((a, b) => Number(a) + Number(b), 0)
        const lng = sumLong / longs.length
        return { lat, lng }
    },

    is_between(search, start, end) {
        return moment(search).isBetween(
            moment(start),
            moment(end),
            'days',
            '[]'
        )
    },

    // Numbers
    percent (v) {
        return (v*100).toFixed()
    },
    decimal (v) {
        return Number(v).toFixed()
    },
    min (v) {
        return Math.min(...v)
    },
    max (v) {
        return Math.max(...v)
    },
    avg (array) {
        const sum = array.reduce((a, b) => Number(a) + Number(b), 0)
        // return sum
        return (sum <= 0) ? 0 : this.decimal(sum / array.length)
    },

    float (v) {
        return Number.parseFloat(v).toFixed(2)
    },

    math (array) {
        return {
            min: this.min(array),
            max: this.max(array),
            avg: this.avg(array),
        }
    },
   mathTime (array) {
        return {
            min: this.min(array),
            max: this.max(array),
            avg: this.avg(array),
        }
    },
}