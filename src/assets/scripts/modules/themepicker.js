const SELECTORS = {
    picker: '.js-themepicker',
    toggleBtn: '.js-themepicker-toggle',
    themeSelectBtn: '.js-themepicker-themeselect',
    closeBtn: '.js-themepicker-close',
    navToggleBtn: '.js-nav-toggle'
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
        this.hasThemeColorMeta =
            !!document.querySelector('meta[name="theme-color"]') &&
            window.metaColors

        this.picker = document.querySelector(SELECTORS.picker)
        this.toggleBtn = document.querySelector(SELECTORS.toggleBtn)
        this.navToggleBtn = document.querySelector(SELECTORS.navToggleBtn)
        this.closeBtn = document.querySelector(SELECTORS.closeBtn)
        this.themeSelectBtns = Array.from(
            document.querySelectorAll(SELECTORS.themeSelectBtn)
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
        this.closeBtn.addEventListener('click', () => this.togglePicker(false))

        this.navToggleBtn.addEventListener('click', () => {
            if (this.isOpen) {
                this.togglePicker(false)
            }
        })

        this.themeSelectBtns.forEach((btn) => {
            const id = btn.dataset.theme

            if (id) {
                btn.addEventListener('click', () => this.setTheme(id))
            }
        })
    }

    getSystemPreference() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark'
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
        this.themeSelectBtns.forEach((btn) => {
            btn.parentNode.classList.remove(CLASSES.active)
            btn.removeAttribute('aria-checked')

            if (btn.dataset.theme === this.activeTheme) {
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
        if (this.hasThemeColorMeta) {
            const metaColor = window.metaColors[id]
            const metaTag = document.querySelector('meta[name="theme-color"]')
            metaTag.setAttribute('content', metaColor)
        }

        this.setActiveItem()
    }

    togglePicker(force) {
        this.isOpen = typeof force === 'boolean' ? force : !this.isOpen

        this.toggleBtn.setAttribute('aria-expanded', String(this.isOpen))

        if (this.isOpen) {
            this.picker.removeAttribute('hidden')
            window.setTimeout(() => {
                this.picker.classList.add(CLASSES.open)
            }, 1)
            this.themeSelectBtns[0].focus()
        } else {
            const transitionHandler = () => {
                this.picker.removeEventListener(
                    'transitionend',
                    transitionHandler
                )
                this.picker.setAttribute('hidden', true)
            }
            this.picker.addEventListener('transitionend', transitionHandler)
            this.picker.classList.remove(CLASSES.open)
            this.toggleBtn.focus()
        }
    }
}

if (window.CSS && CSS.supports('color', 'var(--fake-var)')) {
    new ThemePicker()
}
