class ShareHighlight extends HTMLElement {
    constructor() {
        super()
        this.label = this.getAttribute('label') || 'Share this'

        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
    }

    get template() {
        const template = document.createElement('template')

        // Styles
        const styles = `
            :host {
                position:relative;
                display:inline;
                cursor:pointer;
                outline:0;
            }
            :host(:hover) .tooltip,
            :host(:focus) .tooltip {
                display: block;
            }
            ::slotted(mark) {
                color: var(--share-highlight-text-color);
                background-color: var(--share-highlight-bg-color);
            }
            :host(:hover) ::slotted(mark),
            :host(:focus) ::slotted(mark) {
                color: var(--share-highlight-text-color-active) !important;
                background-color: var(--share-highlight-bg-color-active) !important;
            }
            .tooltip {
                display:none;
                position: absolute;
                bottom:100%;
                left:50%;
                transform: translate(-50%, -.75em);
                font-size: .75em;
                line-height: 1;
                padding: .5em;
                border-radius: .25em;
                border:0;
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
                transform: translate(-50%, -1px);
            }
            .icon {
                display: inline-block;
                font-size: 1em;
                height: 1em;
                width: 1em;
                margin-right: .25em;
                vertical-align: middle;
                fill: currentColor;
                pointer-events: none;
            }`

        // Tooltip
        const icon = !navigator.share
            ? `
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
            </svg>`
            : ''
        const tooltip = `<span class="tooltip">${icon}${this.label}</span>`

        // Template
        template.innerHTML = `
            <style>${styles}</style>
            <slot></slot>
            ${tooltip}
        `
        return template
    }

    connectedCallback() {
        if (!this.hasAttribute('tabindex')) {
            this.tabIndex = 0
        }
        if (!this.hasAttribute('aria-label')) {
            this.setAttribute('aria-label', this.label)
        }
        this.shadowRoot.addEventListener('click', () => this.share())
    }

    shareData() {
        const text = this.shadowRoot
            .querySelector('slot')
            .assignedNodes({ flatten: true })
            .map((node) => node.textContent.trim())
            .join(' ')

        return {
            url: window.location.href,
            title: document.title,
            text: `"${text}"`
        }
    }

    async share() {
        const data = this.shareData()

        if (navigator.share) {
            try {
                await navigator.share(data)
                this.emitEvent('shared', data)
            } catch (error) {
                if (error.name === 'AbortError') {
                    this.emitEvent('cancelled', data)
                }
            }
        } else {
            // native share API not supported.
            // fallback to twitter
            let tweetUrl = 'https://twitter.com/intent/tweet'
            tweetUrl += `?url=${encodeURIComponent(data.url)}`
            tweetUrl += `&text=${encodeURIComponent(data.text)}`

            window.open(tweetUrl, '_blank')
            this.emitEvent('shared', data)
        }
    }

    emitEvent(eventName, data) {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true
        })
        this.dispatchEvent(event)
    }
}

// Register custom element
if ('customElements' in window) {
    customElements.define('share-highlight', ShareHighlight)
}
