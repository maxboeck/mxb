import 'focus-visible'
import svg4everybody from 'svg4everybody'
import Navigation from './inc/navigation'
import registerServiceWorker from './inc/register-serviceworker'

function init() {
    new Navigation()
    registerServiceWorker()
    svg4everybody()
}

init()
