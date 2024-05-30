// Module Preload
import 'vite/modulepreload-polyfill'

// Main Stylesheet
import '../styles/main.scss'

// Common Modules
import './common/navigation'
import './common/signup'
import './common/lazyload'
import './common/themepicker'
import './common/infinitescroll'
import './common/preload'
import './common/speedlify'
import './common/register-serviceworker'

// Dynamic Modules, Imported at Runtime
if (document.querySelector('#webmentions')) {
    import('./webmentions')
}
