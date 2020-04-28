const SELECTORS = {
    togglePickerBtn: '.js-theme-toggle',
    themeSelectBtn: '.js-theme-select'
}
const CLASSES = {
    active: 'is-active'
}
const THEME_STORAGE_KEY = 'theme'

class ThemePicker {
    constructor() {
        this.activeTheme = 'default'
        this.hasLocalStorage = typeof Storage !== 'undefined'
        this.themeSelectBtns = document.querySelectorAll(
            SELECTORS.themeSelectBtn
        )

        this.init()
    }

    init() {
        const systemPreference = this.getSystemPreference()
        const storedPreference = this.getStoredPreference()

        if (storedPreference) {
            this.activeTheme = storedPreference
        } else if (systemPreference) {
            this.activeTheme = systemPreference
        }

        this.setActiveItem()
        this.bindEvents()
    }

    bindEvents() {
        Array.from(this.themeSelectBtns).forEach((btn) => {
            const id = btn.dataset.themeId
            if (id) {
                btn.addEventListener('click', () => this.setTheme(id))
            }
        })
    }

    getSystemPreference() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'default-dark'
        }
        return false
    }

    getStoredPreference() {
        if (this.hasLocalStorage) {
            return localStorage.getItem(THEME_STORAGE_KEY)
        }
        return false
    }

    setActiveItem() {
        Array.from(this.themeSelectBtns).forEach((btn) => {
            btn.parentNode.classList.remove(CLASSES.active)
            btn.removeAttribute('aria-checked')

            if (btn.dataset.themeId === this.activeTheme) {
                btn.parentNode.classList.add(CLASSES.active)
                btn.setAttribute('aria-checked', 'true')
            }
        })
    }

    setTheme(id) {
        this.activeTheme = id
        document.documentElement.setAttribute('data-theme', id)

        if (this.hasLocalStorage) {
            localStorage.setItem(THEME_STORAGE_KEY, id)
        }

        this.setActiveItem()
    }
}

if (window.CSS && CSS.supports('color', 'var(--fake-var)')) {
    new ThemePicker()
}
