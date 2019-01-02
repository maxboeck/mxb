import 'focus-visible'
import svg4everybody from 'svg4everybody'

import Navigation from './inc/navigation'
import infinitescroll from './inc/infinitescroll'
import registerServiceWorker from './inc/register-serviceworker'

function init() {
    new Navigation()
    infinitescroll()
    registerServiceWorker()
    svg4everybody()
}

init()
