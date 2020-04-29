// Utils

// get the windows accurate inner dimensions
export const getWindowDimensions = () => {
    const w = window
    const d = document
    const e = d.documentElement
    const g = d.getElementsByTagName('body')[0]

    const x = w.innerWidth || e.clientWidth || g.clientWidth
    const y = w.innerHeight || e.clientHeight || g.clientHeight

    return {
        width: x,
        height: y
    }
}

// IE user agent sniffing (I know, gross)
export const detectIE = () => {
    const sAgent = window.navigator.userAgent
    const idx = sAgent.indexOf('MSIE')

    // If IE, return version number.
    if (idx > 0) {
        return parseInt(sAgent.substring(idx + 5, sAgent.indexOf('.', idx)), 10)
    }

    // If IE 11 then look for Updated user agent string.
    else if (!!navigator.userAgent.match(/Trident\/7\./)) {
        return 11
    }

    return false
}
