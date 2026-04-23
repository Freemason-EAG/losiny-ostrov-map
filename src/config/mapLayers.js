export const mapLayers = {
    core: {
        losinyBoundary: {
            id: 'losiny-boundary',
            source: '/data/core/losiny-boundary.geojson',
            type: 'fill',
            paint: {
                'fill-color': '#4caf50',
                'fill-opacity': 0.2
            }
        }
    },
    areas: {
        moscowPart: {
            id: 'losiny-moscow',
            source: '/data/areas/losiny_ostrov_moscow.geojson',
            type: 'fill',
            paint: {
                'fill-color': '#2196f3',
                'fill-opacity': 0.35
            }
        }, 
        oblastPart: {
            id: 'losiny-oblast',
            source: '/data/areas/losiny_ostrov_oblast.geojson',
            type: 'fill',
            paint: {
                'fill-color': '#ff9800',
                'fill-opacity': 0.35
            }
        }
    },
    paths: {
        mainPaths: {
            id: 'losiny-paths',
            source: '/data/paths/losiny_path_moscow.geojson',
            type: 'line',
            paint: {
                'line-color': '#8e24aa',
                'line-width': 2
            }
        }
    },
    polygons: {
        nature: {
            id: 'losiny-polygons',
            source: '/data/polygons/losiny_polygons_moscow.geojson',
            type: 'fill',
            paint: {
                'fill-color': '#66bb6a',
                'fill-opacity': 0.25
            }
        }
    }
}