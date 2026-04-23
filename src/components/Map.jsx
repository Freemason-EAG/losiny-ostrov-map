import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import useGeolocation from '../hooks/useGeolocation'
import { mapLayers } from '../config/mapLayers'

const Map = () => {
    const mapContainer = useRef(null)
    const map = useRef(null)
    const [loadError, setLoadError] = useState(false)

    const { location, error, loading } = useGeolocation()
    const markerRef = useRef(null)

    useEffect(() => {
        if (map.current) return

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://demotiles.maplibre.org/style.json',
            center: [37.8, 55.8],
            zoom: 10,
            dragPan: true,
            dragRotate: false,
            scrollZoom: true,
            touchZoomRotate: true,
            doubleClickZoom: true,
        })

        map.current.on('error', () => setLoadError(true))

        map.current.on('load', async () => {

            // =========================
            // OSM BASEMAP
            // =========================
            map.current.addSource('osm-basemap', {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors'
            })

            map.current.addLayer({
                id: 'osm-basemap-layer',
                type: 'raster',
                source: 'osm-basemap',
                paint: {
                    'raster-opacity': 0.5
                }
            })

            // =========================
            // LOAD LAYERS FROM CONFIG
            // =========================

            const loadGeoJSONLayer = async (layer) => {
                try {
                    const res = await fetch(layer.source)
                    const data = await res.json()

                    map.current.addSource(layer.id, {
                        type: 'geojson',
                        data
                    })

                    map.current.addLayer({
                        id: `${layer.id}-layer`,
                        type: layer.type,
                        source: layer.id,
                        paint: layer.paint
                    })
                } catch (err) {
                    console.warn(`Ошибка загрузки слоя ${layer.id}`, err)
                }
            }

            const allLayers = [
                ...Object.values(mapLayers.core),
                ...Object.values(mapLayers.areas),
                ...Object.values(mapLayers.paths),
                ...Object.values(mapLayers.polygons),
            ]

            for (const layer of allLayers) {
                await loadGeoJSONLayer(layer)
            }
        })
    }, [])

    // =========================
    // GEOLOCATION MARKER
    // =========================
    useEffect(() => {
        if (!map.current || !location) return

        if (markerRef.current) {
            markerRef.current.remove()
        }

        markerRef.current = new maplibregl.Marker({ color: '#2196f3' })
            .setLngLat([location.lng, location.lat])
            .setPopup(new maplibregl.Popup().setHTML('<strong>Вы здесь</strong>'))
            .addTo(map.current)

        map.current.flyTo({
            center: [location.lng, location.lat],
            zoom: 14
        })
    }, [location])

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

            {loadError && (
                <div style={{
                    position: 'absolute',
                    top: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: 8,
                    fontSize: 14,
                    zIndex: 1000
                }}>
                    📴 Ошибка загрузки данных
                </div>
            )}

            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    zIndex: 1000
                }}>
                    ⏳ Определение местоположения...
                </div>
            )}

            {error && (
                <div style={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    background: 'rgba(244,67,54,0.9)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    zIndex: 1000
                }}>
                    ⚠️ {error}
                </div>
            )}
        </div>
    )
}

export default Map
