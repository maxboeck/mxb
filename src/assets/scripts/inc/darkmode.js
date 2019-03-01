const SELECTORS = {
    toggleBtn: '.js-darkmode-toggle'
}

const CLASSES = {
    darkMode: 'theme-dark'
}

class DarkMode {
    constructor() {
        this.toggleBtn = document.querySelector(SELECTORS.toggleBtn)
        this.storageKey = 'darkMode'
        this.isActive = false

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle())
        }

        this.init()
    }

    init() {
        if (this.hasLocalStorage()) {
            const preference = localStorage.getItem(this.storageKey) === 'true'
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
            localStorage.setItem(this.storageKey, this.isActive)
        }
    }

    hasLocalStorage() {
        return typeof Storage !== 'undefined'
    }
}

if (window.CSS && CSS.supports('color', 'var(--fake-var)')) {
    new DarkMode()
}
