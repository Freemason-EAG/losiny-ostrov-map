import React, { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const Map = () => {
    const mapContainer = useRef(null) // ссылка на Dom-элемент
    const map = useRef(null) // ссылка на объект карты

    useEffect(() => {
        if (map.current) return  // защита от двойного создания
        
        map.current = new maplibregl.Map({
            container: mapContainer.current, // передаем Dom-элемент
            style: 'https://demotiles.maplibre.org/style.json',
            center: [37.8, 55.8],
            zoom: 10,
            dragPan: true,      // перемещение мышкой
            dragRotate: false,  // отключаем вращение (чтобы не путало)
            scrollZoom: true,   // зум колесиком
            touchZoomRotate: true, // зум на телефоне
            doubleClickZoom: true,  // зум по двойному клику
        })
        map.current.on('load', async () => {
            const response = await fetch('/data/losiny-boundary.geojson') // Загружаем GeoJSON файл из папки public
            const boundaryData = await response.json()

            map.current.addSource('losiny-boundary', {
                type: 'geojson',
                data: boundaryData,
            })
            map.current.addLayer({ // добавляем слой с линией (границей)
                id: 'losiny-boundary-line',
                type: 'line',
                source: 'losiny-boundary',
                paint: {
                    'line-color': '#2e7d32',
                    'line-width': 3,
                    'line-opacity': 0.8
                }
            })

            map.current.addLayer({ // добавляем слой с заливкой 
                id: 'losiny-boundary-fill',
                type: 'fill',
                source: 'losiny-boundary',
                filter: ['==', ['get', 'zonelineco'], 8], // только код 8
                paint: {
                    'fill-color': '#4caf50',
                    'fill-opacity': 0.3
                }
            })
        })
    }, [])

    return (
        <div
            ref={mapContainer}
            style={{ width: '100%', height: '100%' }}
        />
    )
}

export default Map