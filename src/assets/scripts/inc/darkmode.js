const SELECTORS = {
    toggleBtn: '.js-darkmode-toggle'
}

const CLASSES = {
    darkMode: 'theme-dark'
}

const STORAGE_KEY = 'darkMode'
const COLOR_SCHEME_KEY = '--color-scheme'

class DarkMode {
    constructor() {
        this.toggleBtn = document.querySelector(SELECTORS.toggleBtn)
        this.isActive = false

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle())
        }

        this.init()
    }

    getSystemPreference() {
        let response = getComputedStyle(
            document.documentElement
        ).getPropertyValue(COLOR_SCHEME_KEY)

        if (response.length) {
            return response.replace(/\"/g, '').trim()
        }

        return null
    }

    init() {
        if (this.hasLocalStorage()) {
            const systemPreference = this.getSystemPreference()
            const storedSetting = localStorage.getItem(STORAGE_KEY)

            let preference
            if (storedSetting) {
                preference = storedSetting === 'true'
            } else if (systemPreference) {
                preference = systemPreference === 'dark'
            }

            this.toggle(preference)
        }
    }

    toggle(force) {
        this.isActive = typeof force === 'boolean' ? force : !this.isActive
        document.documentElement.classList.toggle(
            CLASSES.darkMode,
            this.isActive
        )
        this.toggleBtn.setAttribute('aria-checked', String(this.isActive))

        if (this.hasLocalStorage()) {
            localStorage.setItem(STORAGE_KEY, this.isActive)
        }
    }

    hasLocalStorage() {
        return typeof Storage !== 'undefined'
    }
}

if (window.CSS && CSS.supports('color', 'var(--fake-var)')) {
    new DarkMode()
}
