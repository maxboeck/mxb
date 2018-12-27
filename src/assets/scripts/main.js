import 'focus-visible'

import Navigation from './inc/navigation'
import registerServiceWorker from './inc/register-serviceworker'

function init() {
    new Navigation()
    registerServiceWorker()
}

init()
