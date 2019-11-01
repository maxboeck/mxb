import 'leaflet/dist/leaflet'

function initMap() {
    const mqMobile = window.matchMedia('(max-width: 600px)')
    const initialZoom = mqMobile.matches ? 2 : 3

    const map = L.map('mapcontainer', { minZoom: 2 }).setView(
        [35, 0],
        initialZoom
    )
    const mapdataScript = document.getElementById('mapdata')
    const mapData = mapdataScript ? JSON.parse(mapdataScript.textContent) : {}
    const tileSrc =
        'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'
    const tileAttribution =
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>, <a href="https://maps.stamen.com/">Stamen</a>'

    const markerIcon = L.icon({
        ...L.Icon.Default.prototype.options,
        iconUrl: '/assets/images/marker.png',
        iconRetinaUrl: '/assets/images/marker@2x.png',
        shadowUrl: '/assets/images/marker-shadow.png'
    })
    const makeMarkers = (feature, latlng) =>
        L.marker(latlng, { icon: markerIcon })

    const makePopup = (feature, layer) => {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(
                `${feature.properties.name}, ${feature.properties.country}`
            )
        }
    }

    L.tileLayer(tileSrc, { attribution: tileAttribution, noWrap: true }).addTo(
        map
    )
    L.geoJSON(mapData.features, {
        pointToLayer: makeMarkers,
        onEachFeature: makePopup
    }).addTo(map)
}

window.addEventListener('load', initMap)
