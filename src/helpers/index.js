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
        return moment(search).isBetween(
            moment(start),
            moment(end),
            'days',
            '[]'
        )
    },

    // Return format MMM DD YYYY
    dateFormat(dsn) {
        let value = dsn.replace('T00:00:00.000Z', '')
        return moment(value).format('MMM DD YYYY')
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

    // GMapCircle(lat,lng,rad,detail=8){
    //     var uri = 'https://maps.googleapis.com/maps/api/staticmap?key=' + API_KEY;
    //     // https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap
    //     // &markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318
    //     // &markers=color:red%7Clabel:C%7C40.718217,-73.998284
    //     // &key=YOUR_API_KEY&signature=YOUR_SIGNATURE

    //     // var staticMapSrc = '&center=' + lat + ',' + lng;
    //     var staticMapSrc = '&center=Brooklyn+Bridge,New+York,NY'
    //     staticMapSrc += '&size=850x650&zoom=13';
    //     staticMapSrc += '&path=color:0xff0000ff:weight:1';

    //     var r    = 6371;
    //     var pi   = Math.PI;
    //     var _lat  = (lat * pi) / 180;
    //     var _lng  = (lng * pi) / 180;
    //     var d    = (rad/1000) / r;
    //     var i = 0;

    //     for(i = 0; i <= 360; i+=detail) {
    //         var brng = i * pi / 180;
    //         var pLat = Math.asin(Math.sin(_lat) * Math.cos(d) + Math.cos(_lat) * Math.sin(d) * Math.cos(brng));
    //         var pLng = ((_lng + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(_lat), Math.cos(d) - Math.sin(_lat) * Math.sin(pLat))) * 180) / pi;
    //         pLat = (pLat * 180) / pi;
    //        staticMapSrc += "|" + pLat + "," + pLng;
    //     }

    //     return uri + encodeURI(staticMapSrc);
    // }
}