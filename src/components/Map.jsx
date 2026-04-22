import React, { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import useGeolocation from '../hooks/useGeolocation'

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

        map.current.on('error', () => {
            setLoadError(true)
        })

        map.current.on('load', async () => {

            // --- OSM подложка ---
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
                minzoom: 0,
                maxzoom: 19,
                paint: {
                    'raster-opacity': 0.5,
                }
            })

            // --- фон ---
            map.current.addLayer({
                id: 'color-overlay',
                type: 'background',
                paint: {
                    'background-color': '#F5F5F5',
                    'background-opacity': 0.5,
                }
            })

            // =========================
            // 🟢 ЛОСИНЫЙ ОСТРОВ (общий)
            // =========================
            try {
                const response = await fetch('/data/losiny-boundary.geojson')
                const boundaryData = await response.json()

                map.current.addSource('losiny-boundary', {
                    type: 'geojson',
                    data: boundaryData,
                })

                map.current.addLayer({
                    id: 'losiny-boundary-fill',
                    type: 'fill',
                    source: 'losiny-boundary',
                    paint: {
                        'fill-color': '#4caf50',
                        'fill-opacity': 0.2
                    }
                })

                map.current.addLayer({
                    id: 'losiny-boundary-line',
                    type: 'line',
                    source: 'losiny-boundary',
                    paint: {
                        'line-color': '#2e7d32',
                        'line-width': 2,
                        'line-opacity': 0.8
                    }
                })

            } catch (err) {
                console.warn('Ошибка загрузки Лосиного острова:', err)
                setLoadError(true)
            }

            // =========================
            // 🟦 МОСКОВСКАЯ ЧАСТЬ
            // =========================
            try {
                const response = await fetch('/data/losiny_ostrov_moscow.geojson')
                const moscowData = await response.json()

                map.current.addSource('losiny-moscow', {
                    type: 'geojson',
                    data: moscowData,
                })

                map.current.addLayer({
                    id: 'losiny-moscow-fill',
                    type: 'fill',
                    source: 'losiny-moscow',
                    paint: {
                        'fill-color': '#2196f3',
                        'fill-opacity': 0.35
                    }
                })

                map.current.addLayer({
                    id: 'losiny-moscow-line',
                    type: 'line',
                    source: 'losiny-moscow',
                    paint: {
                        'line-color': '#1565c0',
                        'line-width': 2,
                        'line-opacity': 0.9
                    }
                })

            } catch (err) {
                console.warn('Ошибка загрузки московской части:', err)
            }

            // =========================
            // 🟠 ОБЛАСТНАЯ ЧАСТЬ
            // =========================
            try {
                const response = await fetch('/data/losiny_ostrov_oblast.geojson')
                const oblastData = await response.json()

                map.current.addSource('losiny-oblast', {
                    type: 'geojson',
                    data: oblastData,
                })

                map.current.addLayer({
                    id: 'losiny-oblast-fill',
                    type: 'fill',
                    source: 'losiny-oblast',
                    paint: {
                        'fill-color': '#ff9800',
                        'fill-opacity': 0.35
                    }
                })

                map.current.addLayer({
                    id: 'losiny-oblast-line',
                    type: 'line',
                    source: 'losiny-oblast',
                    paint: {
                        'line-color': '#ef6c00',
                        'line-width': 2,
                        'line-opacity': 0.9
                    }
                })

            } catch (err) {
                console.warn('Ошибка загрузки областной части:', err)
            }
        })
    }, [])

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