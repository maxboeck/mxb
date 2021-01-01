import { h, render } from 'preact'
import Sharer from './Sharer'

const SHARING_ENDPOINT =
    process.env.ELEVENTY_ENV === 'production'
        ? '/.netlify/functions/share'
        : 'http://localhost:9000/share'

render(
    <Sharer action={SHARING_ENDPOINT} />,
    document.getElementById('sharer-root')
)
