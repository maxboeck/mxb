const { DateTime } = require('luxon')

module.exports = {
    year: function(date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat('yyyy')
    },

    isoDate: function(date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISODate()
    },

    readableDate: function(date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            'dd LLL yyyy'
        )
    },

    obfuscate: function(str) {
        const chars = []
        for (var i = str.length - 1; i >= 0; i--) {
            chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
        }
        return chars.join('')
    }
}
