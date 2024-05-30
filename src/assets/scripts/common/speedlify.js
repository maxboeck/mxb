;(function () {
    if (!('customElements' in window) || !('fetch' in window)) {
        return
    }

    const NAME = 'speedlify-score'

    class SpeedlifyUrlStore {
        constructor() {
            this.fetches = {}
            this.responses = {}
            this.urls = {}
        }

        async fetch(speedlifyUrl, url) {
            if (this.urls[speedlifyUrl]) {
                return this.urls[speedlifyUrl][url]
                    ? this.urls[speedlifyUrl][url].hash
                    : false
            }

            if (!this.fetches[speedlifyUrl]) {
                this.fetches[speedlifyUrl] = fetch(
                    `${speedlifyUrl}/api/urls.json`
                )
            }

            let response = await this.fetches[speedlifyUrl]

            if (!this.responses[speedlifyUrl]) {
                this.responses[speedlifyUrl] = response.json()
            }

            let json = await this.responses[speedlifyUrl]

            this.urls[speedlifyUrl] = json

            return json[url] ? json[url].hash : false
        }
    }

    const urlStore = new SpeedlifyUrlStore()

    customElements.define(
        NAME,
        class extends HTMLElement {
            connectedCallback() {
                this.speedlifyUrl = this.getAttribute('speedlify-url')
                this.shorthash = this.getAttribute('hash')
                this.rawData = this.getAttribute('raw-data')
                this.url = this.getAttribute('url') || window.location.href
                this.urlStore = urlStore

                if (!this.rawData && !this.speedlifyUrl) {
                    console.log(
                        `Missing \`speedlify-url\` attributes in <${NAME}>`
                    )
                    return
                }

                // lol async in constructors
                this.init()
            }

            async init() {
                if (this.rawData) {
                    this.innerHTML = this.render(JSON.parse(this.rawData))
                    return
                }

                let hash = this.shorthash
                if (!hash) {
                    // It’s much faster if you supply a `hash` attribute!
                    hash = await this.urlStore.fetch(
                        this.speedlifyUrl,
                        this.url
                    )
                }

                if (!hash) {
                    console.error(
                        `<${NAME}> could not find hash for URL: ${this.url}`
                    )
                    return
                }

                let data = await this.fetchData(hash)
                this.innerHTML = this.render(data)
            }

            async fetchData(hash) {
                let response = await fetch(
                    `${this.speedlifyUrl}/api/${hash}.json`
                )
                let json = await response.json()

                return json
            }

            getScoreClass(score) {
                if (score < 0.5) {
                    return 'speedlify-score speedlify-score-bad'
                }
                if (score < 0.9) {
                    return 'speedlify-score speedlify-score-ok'
                }
                return 'speedlify-score speedlify-score-good'
            }

            getScoreTemplate(data) {
                let scores = []
                scores.push(
                    `<span title="Performance" class="${this.getScoreClass(
                        data.lighthouse.performance
                    )}">${parseInt(
                        data.lighthouse.performance * 100,
                        10
                    )}</span>`
                )
                scores.push(
                    `<span title="Accessibility" class="${this.getScoreClass(
                        data.lighthouse.accessibility
                    )}">${parseInt(
                        data.lighthouse.accessibility * 100,
                        10
                    )}</span>`
                )
                scores.push(
                    `<span title="Best Practices" class="${this.getScoreClass(
                        data.lighthouse.bestPractices
                    )}">${parseInt(
                        data.lighthouse.bestPractices * 100,
                        10
                    )}</span>`
                )
                scores.push(
                    `<span title="SEO" class="${this.getScoreClass(
                        data.lighthouse.seo
                    )}">${parseInt(data.lighthouse.seo * 100, 10)}</span>`
                )
                return scores.join(' ')
            }

            render(data) {
                let content = []
                let scoreHtml = this.getScoreTemplate(data)
                if (
                    (!this.hasAttribute('requests') &&
                        !this.hasAttribute('weight') &&
                        !this.hasAttribute('rank')) ||
                    this.hasAttribute('score')
                ) {
                    content.push(scoreHtml)
                }

                let summarySplit = data.weight.summary.split(' • ')
                if (this.hasAttribute('requests')) {
                    content.push(
                        `<span class="speedlify-requests">${summarySplit[0]}</span>`
                    )
                }
                if (this.hasAttribute('weight')) {
                    content.push(
                        `<span class="speedlify-weight">${summarySplit[1]}</span>`
                    )
                }
                if (this.hasAttribute('rank')) {
                    let rankUrl = this.getAttribute('rank-url')
                    content.push(
                        `<${
                            rankUrl ? `a href="${rankUrl}"` : 'span'
                        } class="speedlify-rank">${data.ranks.cumulative}</${
                            rankUrl ? 'a' : 'span'
                        }>`
                    )
                }
                if (this.hasAttribute('rank-change') && data.previousRanks) {
                    let change =
                        data.previousRanks.cumulative - data.ranks.cumulative
                    content.push(
                        `<span class="speedlify-rank-change ${
                            change > 0 ? 'up' : change < 0 ? 'down' : 'same'
                        }">${change !== 0 ? Math.abs(change) : ''}</span>`
                    )
                }

                return content.join('')
            }
        }
    )
})()
