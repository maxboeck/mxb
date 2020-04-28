const SELECTORS = {
    picker: '.js-themepicker',
    toggleBtn: '.js-themepicker-toggle',
    themeSelectBtn: '.js-theme-select'
}
const CLASSES = {
    open: 'is-open',
    active: 'is-active'
}
const THEME_STORAGE_KEY = 'theme'

class ThemePicker {
    constructor() {
        this.isOpen = false
        this.activeTheme = 'default'
        this.hasLocalStorage = typeof Storage !== 'undefined'

        this.picker = document.querySelector(SELECTORS.picker)
        this.toggleBtn = document.querySelector(SELECTORS.toggleBtn)
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
        this.toggleBtn.addEventListener('click', () => this.togglePicker())

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

    togglePicker() {
        this.isOpen = typeof force === 'boolean' ? force : !this.isOpen

        this.picker.classList.toggle(CLASSES.open, this.isOpen)
        this.toggleBtn.setAttribute('aria-expanded', String(this.isOpen))

        // if (this.isOpen) {
        //     this.focusTrap.activate()
        // } else {
        //     this.focusTrap.deactivate()
        // }
    }
}

if (window.CSS && CSS.supports('color', 'var(--fake-var)')) {
    new ThemePicker()
}
