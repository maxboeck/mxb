import 'focus-visible'
import 'svgxuse'

import './inc/polyfills'
import './inc/infinitescroll'
import './inc/responsiveImage'
import './inc/preload'
import './inc/register-serviceworker'

import Navigation from './inc/navigation'
import DarkMode from './inc/darkmode'

function init() {
    new Navigation()
    new DarkMode()
}

init()
