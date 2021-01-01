const htmlmin = require('html-minifier')
const markdownIt = require('markdown-it')()
const random = require('lodash/random')

const minify = (content) =>
    htmlmin.minify(content, {
        removeComments: true,
        collapseWhitespace: true
    })

const Spinner = () => {
    const layer = (
        index
    ) => `<div class="spinner__layer spinner__layer--${index}">
        <div class="spinner__circle-clipper spinner__left">
            <div class="spinner__circle"></div>
        </div>
        <div class="spinner__gap-patch">
            <div class="spinner__circle"></div>
        </div>
        <div class="spinner__circle-clipper spinner__right">
            <div class="spinner__circle"></div>
        </div>
    </div>`

    const layers = []
    for (let i = 1; i <= 4; i++) {
        layers.push(layer(i))
    }
    const output = `<div class="spinner">
        <div class="spinner__layercontainer">${layers.join('')}</div>
    </div>`

    return minify(output)
}

const Icon = (iconName, useInline = false) => {
    const spriteUrl = '/assets/icons/icons.sprite.svg'
    const iconId = `#icon-${iconName}`
    const href = useInline ? iconId : spriteUrl + iconId

    const output = `<svg class="icon icon--${iconName}" role="img" aria-hidden="true" width="24" height="24">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${href}"></use>
    </svg>`

    return minify(output)
}

const SignupForm = (source) => {
    const MC = {
        url: 'https://dev.us18.list-manage.com/subscribe/post',
        user: '64781452976687d0f4f2ea370',
        list: '772b9208b5'
    }

    const examples = [
        {
            name: 'Sam',
            email: 'sam@website.com'
        },
        {
            name: 'Alice',
            email: 'alice@awesome.io'
        },
        {
            name: 'Bob',
            email: 'bob@gmail.com'
        },
        {
            name: 'Lisa',
            email: 'lisa@website.com'
        },
        {
            name: 'Phil',
            email: 'phil@website.com'
        }
    ]
    const placeholder = examples[random(examples.length - 1)]
    const output = `<form 
        action="${MC.url}" 
        method="POST" 
        class="form form--signup" 
    >
        <div class="form__body">
            <input type="hidden" name="u" value="${MC.user}" />
            <input type="hidden" name="id" value="${MC.list}" />
            <input type="hidden" name="SOURCE" value="${source}" />

            <div class="form__fields">
                <p class="form__field">
                    <label for="mce-FNAME" class="form__label">First Name (optional)</label>
                    <input type="text" class="form__input" value="" name="FNAME" id="mce-FNAME" placeholder="${
                        placeholder.name
                    }">
                </p>

                <p class="form__field">
                    <label for="mce-EMAIL" class="form__label">Email Address</label>
                    <input type="email" class="form__input" value="" name="EMAIL" id="mce-EMAIL" placeholder="${
                        placeholder.email
                    }" required>
                </p>
            </div>

            <div class="sr-only" aria-hidden="true">
                <input type="text" name="b_${MC.user}_${
        MC.list
    }" tabindex="-1" value="">
            </div>
        </div>

        <div class="form__actions">
            <button type="submit" class="btn btn--primary" name="subscribe">Subscribe</button>
            <div class="form__feedback js-signup-widget-feedback" hidden></div>
            ${Spinner()}
        </div>
    </form>`

    return minify(output)
}

const SignupSection = (title, text, source) => {
    const form = SignupForm(source)
    const icon = Icon('check')
    const output = `
        <aside class="signup js-signup-widget" data-nosnippet>
            <div class="signup__front">
                <h2 class="signup__title">${title}</h2>
                <div class="signup__desc">
                    ${text}
                </div>
                <div class="signup__form">
                    ${form}
                </div>
            </div>
            <div class="signup__back js-signup-backside"></div>
            <div class="signup__icon">${icon}</div>
        </aside>
    `

    return minify(output)
}

const Callout = (content, type = 'info') => {
    let icon

    switch (type) {
        case 'action':
            icon = 'check'
            break

        case 'warning':
            icon = 'warning'
            break

        case 'tip':
            icon = 'lightbulb'
            break

        case 'info':
        default:
            icon = 'info'
            break
    }

    const output = `<div class="callout callout--${type}">
        <span class="callout__icon">${Icon(icon)}</span>
        <div class="callout__content">${markdownIt.render(content)}</div>
    </div>`

    return minify(output)
}

module.exports = {
    Spinner,
    Icon,
    SignupSection,
    Callout
}
