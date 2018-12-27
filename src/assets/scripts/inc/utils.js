// Utils

// get the windows accurate inner dimensions
export const getWindowDimensions = () => {
    const w = window
    const d = document
    const e = d.documentElement
    const g = d.getElementsByTagName('body')[0]

    const x = w.innerWidth || e.clientWidth || g.clientWidth
    const y = w.innerHeight || e.clientHeight || g.clientHeight

    return {
        width: x,
        height: y
    }
}

// Reusable Focus Trap Method
export const createFocusTrap = (el, opt = {}) => {
    let isActive = false

    const focusableElementSelectors = [
        'a[href]',
        'area[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'button:not([disabled])',
        'iframe',
        'object',
        'embed',
        '[contenteditable]',
        '[tabindex]:not([tabindex^="-"])'
    ]
    const focusableElements = el.querySelectorAll(
        focusableElementSelectors.join(', ')
    )
    const lastFocusableElement = focusableElements[focusableElements.length - 1]

    const defaults = {
        toggleElement: focusableElements[0],
        escape: true,
        onEscape: () => {}
    }
    const options = Object.assign({}, defaults, opt)

    const handleKeyPress = e => {
        if (!isActive || e.ctrlKey || e.metaKey || e.altKey) {
            return
        }
        switch (e.keyCode) {
            case 27: // ESC
                if (options.escape) {
                    options.onEscape()
                    options.toggleElement.focus()
                }
                break

            case 9: // TAB
                if (e.shiftKey) {
                    if (document.activeElement === options.toggleElement) {
                        lastFocusableElement.focus()
                        e.preventDefault()
                    }
                } else if (document.activeElement === lastFocusableElement) {
                    options.toggleElement.focus()
                    e.preventDefault()
                }
                break

            default:
                break
        }
    }

    function activate() {
        isActive = true
        el.addEventListener('keydown', handleKeyPress)
    }
    function deactivate() {
        isActive = false
        el.removeEventListener('keydown', handleKeyPress)
    }

    return {
        activate,
        deactivate
    }
}
