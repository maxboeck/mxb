import { h, render } from 'preact'
import App from './App'

const webmentionsElement = document.getElementById('webmentions')
const lastFetched = webmentionsElement.dataset.lastFetched

render(<App lastFetched={lastFetched} />, webmentionsElement)
