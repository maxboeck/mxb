import fetch from 'node-fetch'
import slugify from 'slugify'
import querystring from 'querystring'

const API_FILE_TARGET =
    'https://api.github.com/repos/maxboeck/mxb/contents/src/notes/'

function sanitizeYAML(str) {
    // replace endash and emdash with hyphens
    str = str.replace(/–/g, '-')
    str = str.replace(/—/g, '-')

    // replace double quotes
    str = str.replace(/"/g, "'")
    return str
}

function getFileContent(data) {
    const { title, url, via, body, syndicate } = data
    const frontMatter = getFrontmatter({
        title: `"${sanitizeYAML(title)}"`,
        date: 'Created',
        syndicate: syndicate,
        tags: 'link'
    })
    console.log(frontMatter)

    let content = frontMatter
    if (body) {
        content += '\n\n' + body
    }
    if (via) {
        const vialink =
            via.charAt(0) === '@'
                ? `[${via}](https://twitter.com/${via.substring(1)})`
                : via
        content += ` (via ${vialink})`
    }
    content += '\n\n' + `[${url}](${url})`

    return unescape(encodeURIComponent(content))
}

function getFileName(title) {
    const d = new Date()
    const yyyy = d.getFullYear()
    let dd = d.getDate()
    let mm = d.getMonth() + 1

    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm

    let filename = `${yyyy}-${mm}-${dd}`

    if (!title) {
        filename = filename + '-' + d.getTime()
    } else {
        const slug = slugify(title, {
            remove: /[^a-z0-9 ]/gi,
            lower: true
        })
        filename += slug.length > 1 ? `-${slug}` : `-${d.getTime()}`
    }

    return `${filename}.md`
}

function getFrontmatter(yaml) {
    let fm = []
    fm.push('---')
    Object.keys(yaml).forEach(key => {
        if (yaml[key] && yaml[key].constructor == String) {
            fm.push(`${key}: ${yaml[key]}`)
        } else if (typeof yaml[key] === 'boolean') {
            fm.push(`${key}: ${String(yaml[key])}`)
        }
    })
    fm.push('---')
    return fm.join('\n')
}

async function postFile(params) {
    const { title, token } = params
    const fileName = getFileName(title)
    const fileContent = getFileContent(params)
    const url = API_FILE_TARGET + fileName

    const buffer = Buffer.from(fileContent)
    const payload = {
        message: 'new shared note',
        content: buffer.toString('base64'),
        committer: {
            name: 'Max Böck',
            email: 'hello@mxb.dev'
        }
    }

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/vnd.github.v3+json',
            Authorization: `token ${token}`
        },
        body: JSON.stringify(payload)
    }

    const response = await fetch(url, options)
    return response
}

// Main Lambda Function Handler
exports.handler = async event => {
    const params = querystring.parse(event.body)

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' }
    }

    // Token is required
    if (!params.token) {
        return { statusCode: 403, body: 'Missing Access Token' }
    }

    try {
        const response = await postFile(params)
        if (response.ok) {
            return {
                statusCode: 200,
                body: `Note published!`
            }
        } else {
            return {
                statusCode: response.status,
                body: `${response.statusText}`
            }
        }
    } catch (err) {
        return {
            statusCode: 400,
            body: err.message
        }
    }
}
