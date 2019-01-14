const SELECTORS = {
    toggleBtn: '.js-darkmode-toggle'
}

const CLASSES = {
    darkMode: 'theme-dark'
}

export default function() {
    const toggleBtn = document.querySelector(SELECTORS.toggleBtn)
    const supportsCSSVariables =
        window.CSS && CSS.supports('color', 'var(--fake-var)')

    if (toggleBtn) {
        // skip if we dont have css custom properites support
        if (!supportsCSSVariables) {
            return false
        }

        toggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle(CLASSES.darkMode)
        })
    }
}
