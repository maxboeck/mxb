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

        this.setActiveBtn()
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

    setActiveBtn() {
        Array.from(this.themeSelectBtns).forEach((btn) => {
            btn.classList.remove(CLASSES.active)

            if (btn.dataset.themeId === this.activeTheme) {
                btn.classList.add(CLASSES.active)
            }
        })
    }

    setTheme(id) {
        this.activeTheme = id
        document.documentElement.setAttribute('data-theme', id)

        if (this.hasLocalStorage) {
            localStorage.setItem(THEME_STORAGE_KEY, id)
        }

        this.setActiveBtn()
    }
}

if (window.CSS && CSS.supports('color', 'var(--fake-var)')) {
    new ThemePicker()
}
