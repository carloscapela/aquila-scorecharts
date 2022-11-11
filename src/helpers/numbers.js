export function percent(v) {
    return (v*100).toFixed()
}

export function decimal(v) {
    return Number(v).toFixed()
}

export function min(v) {
    return Math.min(...v)
}

export function max(v) {
    return Math.max(...v)
}

export function avg(array) {
    const sum = array.reduce((a, b) => Number(a) + Number(b), 0)
    // return sum
    return (sum <= 0) ? 0 : decimal(sum / array.length)
}