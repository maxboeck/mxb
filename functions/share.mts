import { Context } from '@netlify/functions'
import fetch from 'node-fetch'
import slugify from 'slugify'
import { DateTime } from 'luxon'

interface Note {
    title: string
    token: string
    url: string
    via: string
    body: string
    syndicate: boolean
}

interface FrontMatter {
    title: string
    date: string
    link: string
    tags: string
    syndicate: boolean
}

// The place where new shared notes should go
const API_FILE_TARGET =
    'https://api.github.com/repos/maxboeck/mxb/contents/src/notes/'

// Helper function to clean strings for frontmatter
const sanitize = (str: String) => {
    // replace endash and emdash with hyphens
    str = str.replace(/–/g, '-')
    str = str.replace(/—/g, '-')

    // replace double quotes and apostrophes
    str = str.replace(/"/g, "'")
    str = str.replace(/“/g, "'")
    str = str.replace(/”/g, "'")
    str = str.replace(/’/g, "'")

    return str.trim()
}

// generate the frontmatter string
const getFrontmatter = (yaml: FrontMatter) => {
    let fm = new Array()
    fm.push('---')
    Object.keys(yaml).forEach((key) => {
        if (yaml[key] && yaml[key].constructor == String) {
            fm.push(`${key}: ${yaml[key]}`)
        } else if (typeof yaml[key] === 'boolean') {
            fm.push(`${key}: ${String(yaml[key])}`)
        }
    })
    fm.push('---')
    return fm.join('\n')
}

// generate the new md file content
const getFileContent = (data: Note) => {
    const { title, url, via, body, syndicate } = data
    const date = DateTime.utc().toISO({ suppressMilliseconds: true })

    const frontMatter = getFrontmatter({
        title: `"${sanitize(title)}"`,
        date: `"${date}"`,
        syndicate: syndicate,
        link: `"${url}"`,
        tags: 'link'
    })

    console.log('\n' + frontMatter)

    let content = frontMatter
    if (body) {
        content += '\n\n' + sanitize(body)
    }
    if (via) {
        const vialink =
            via.charAt(0) === '@'
                ? `[${via}](https://twitter.com/${via.substring(1)})`
                : via
        content += ` (via ${vialink})`
    }
    content += '\n\n' + `[${url}](${url})`

    return content
}

// generate the new md file name
const getFileName = (title: string) => {
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

// create the new file via the github API
const postFile = async (data: Note) => {
    const { title, token } = data
    const fileName = getFileName(title)
    const fileContent = getFileContent(data)
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

// Main Lambda Function
export default async (request: Request, context: Context) => {
    try {
        // Only allow POST
        if (request.method !== 'POST') {
            return new Response('Method Not Allowed', { status: 405 })
        }

        const data = await request.json()
        // Token is required
        if (!data.token) {
            return new Response('Missing Access Token', { status: 403 })
        }

        const postFileResponse = await postFile(data)
        if (postFileResponse.ok) {
            console.log('200 Note published!')
            return new Response('Note published!', { status: 200 })
        } else {
            console.log(
                `${postFileResponse.status} ${postFileResponse.statusText}`
            )
            return new Response(postFileResponse.statusText, {
                status: postFileResponse.status
            })
        }
    } catch (err) {
        console.log(err)
        return new Response(err.toString(), { status: 400 })
    }
}
