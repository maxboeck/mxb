import { h, render } from 'preact'
import Sharer from './Sharer'

const SHARING_ENDPOINT = '/.netlify/functions/share'
render(
    <Sharer action={SHARING_ENDPOINT} />,
    document.getElementById('sharer-root')
)
