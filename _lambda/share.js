import fetch from 'node-fetch'
import slugify from 'slugify'
import { DateTime } from 'luxon'

const API_FILE_TARGET =
    'https://api.github.com/repos/maxboeck/mxb/contents/src/notes/'

const sanitizeYAML = str => {
    // replace endash and emdash with hyphens
    str = str.replace(/–/g, '-')
    str = str.replace(/—/g, '-')

    // replace double quotes and apostrophes
    str = str.replace(/"/g, "'")
    str = str.replace(/’/g, "'")

    return str.trim()
}

const getFileContent = data => {
    const { title, url, via, body, syndicate } = data
    const date = DateTime.utc().toISO({ suppressMilliseconds: true })

    const frontMatter = getFrontmatter({
        title: `"${sanitizeYAML(title)}"`,
        date: `"${date}"`,
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

const getFileName = title => {
    const date = DateTime.utc()
    const unixSeconds = date.toSeconds()
    let filename = date.toFormat('yyyy-LL-dd')

    if (!title) {
        filename = `${filename}-${unixSeconds}`
    } else {
        const slug = slugify(title, {
            remove: /[^a-z0-9 ]/gi,
            lower: true
        })
        filename += slug.length > 1 ? `-${slug}` : `-${unixSeconds}`
    }

    return `${filename}.md`
}

const getFrontmatter = yaml => {
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

const postFile = async params => {
    const { title, token } = params
    const fileName = getFileName(title)
    const fileContent = getFileContent(params)
    const url = API_FILE_TARGET + fileName

    const payload = {
        message: 'new shared note',
        content: Buffer.from(fileContent).toString('base64'),
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

    return await fetch(url, options)
}

const handleResponse = response => {
    if (response.ok) {
        return {
            statusCode: 200,
            body: `Note published!`
        }
    }

    return {
        statusCode: response.status,
        body: `${response.statusText}`
    }
}

// Main Lambda Function Handler
exports.handler = async event => {
    console.log(event.body)
    const params = JSON.parse(event.body)

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
        return handleResponse(response)
    } catch (err) {
        console.log(err)
        return {
            statusCode: 400,
            body: err.toString()
        }
    }
}
