class ShareHighlight extends HTMLElement {
    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.setTemplate()

        this.$ = {}
        this.$.tooltip = this.shadowRoot.querySelector('.tooltip')
        this.$.tooltipLabel = this.shadowRoot.querySelector('.tooltiplabel')
    }

    setTemplate() {
        const template = document.createElement('template')
        const styles = `
            :host {
                position:relative;
                display:inline;
                cursor:pointer;
            }
            mark {
                color: var(--share-highlight-text-color);
                background-color: var(--share-highlight-bg-color);
            }
            mark:hover,
            mark:focus {
                color: var(--share-highlight-text-color-active);
                background-color: var(--share-highlight-bg-color-active);
            }
            .tooltip {
                display:none;
                position: absolute;
                
                bottom:100%;
                left:50%;
                transform: translate(-50%, -.75rem);

                font-size: .75em;
                line-height: 1;
                padding: .5em;
                border-radius: .25em;
                border:0;
                outline:0;
                cursor: pointer;
                white-space: nowrap;

                color: var(--share-highlight-tooltip-text-color, #FFF);
                background-color: var(--share-highlight-tooltip-bg-color, #000);
            }
            .tooltip::after {
                content: "";
                display: flex;
                justify-content: center;
                align-items: center;
                width: 0; 
                height: 0; 
                border-left: .5em solid transparent;
                border-right: .5em solid transparent;
                border-top: .5em solid var(--share-highlight-tooltip-bg-color, #000);
                position: absolute;
                z-index: 100;
                top: 100%;
                left:50%;
                transform: translate(-50%, 0);
            }
            mark:hover + .tooltip,
            mark:focus + .tooltip {
                display: block;
            }
            .icon {
                display: inline-block;
                font-size: 1.25em;
                height: 1em;
                width: 1em;
                margin-right: .25em;
                vertical-align: middle;
                fill: currentColor;
                pointer-events: none;
            }`

        const twitterIcon = `
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
            </svg>`

        template.innerHTML = `
            <style>${styles}</style>
            <mark><slot></slot></mark>
            <span class="tooltip">${
                !navigator.share && twitterIcon
            }<span class="tooltiplabel">Share this</span></span>
        `

        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    getShareData() {
        const text = this.shadowRoot
            .querySelector('slot')
            .assignedNodes({ flatten: true })
            .map((node) => node.textContent.trim())
            .join(' ')

        // const fragment = this.getTextFragment(text)

        return {
            url: window.location.href,
            title: document.title,
            text: `"${text}"`
        }
    }

    getTextFragment(text) {
        const start = encodeURIComponent(text.split(' ').slice(0, 3).join(' '))
        const end = encodeURIComponent(text.split(' ').slice(-3).join(' '))
        return `#:~:text=${start},${end}`
    }

    connectedCallback() {
        if (this.hasAttribute('label')) {
            this.$.tooltipLabel.innerText = this.getAttribute('label')
        }
        this.shadowRoot.addEventListener('click', () => this.share())
    }

    async share() {
        const data = this.getShareData()
        if (navigator.share) {
            try {
                await navigator.share(data)
            } catch (err) {
                if (error.name === 'AbortError') {
                    // aborted
                }
            }
        } else {
            // native share API not supported. fallback to twitter
            const sharingUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                data.url
            )}&text=${encodeURIComponent(data.text)}`
            window.open(sharingUrl, '_blank')
        }
    }
}

// Register custom element
if ('customElements' in window) {
    customElements.define('share-highlight', ShareHighlight)
}
