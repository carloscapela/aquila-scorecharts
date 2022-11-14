import { Loader } from '@googlemaps/js-api-loader'

const API_KEY = 'AIzaSyBP4mlIFGg5zQdgvUe0uxQ1bHCSt8847uE'
const VERSION = 'weekly'

export function load () {
    return new Loader({
        apiKey: API_KEY,
        version: VERSION,
        libraries: ['places'],
    })
}

export function avgLatLong (lats = [], longs = []) {
    const sumLat = lats.reduce((a, b) => Number(a) + Number(b), 0)
    const lat = sumLat / lats.length

    const sumLong = longs.reduce((a, b) => Number(a) + Number(b), 0)
    const lng = sumLong / longs.length

    return { lat, lng }
}