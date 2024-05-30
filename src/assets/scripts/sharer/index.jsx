import { h, render } from 'preact'
import Sharer from './Sharer'

const SHARING_ENDPOINT = import.meta.env.PROD
    ? '/.netlify/functions/share'
    : 'http://localhost:9000/share'

render(<Sharer action={SHARING_ENDPOINT} />, document.getElementById('sharer'))
