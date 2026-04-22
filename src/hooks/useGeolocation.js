import { useState, useEffect } from "react"

const useGeolocation = () => {
    const [location, setLocation] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Геолокация не поддерживается вашим браузером')
            setLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition( // запрашиваем текущее местоположение
            (position) => {
                setLocation({
                    lat: position.coords.latitude, // широта
                    lng: position.coords.longitude, // долгота
                })
                setLoading(false)
            },
            (err) => {
                let errorMessage = 'Не удалось определить местоположение'
                if (err.code === 1) errorMessage = 'Пользователь запретил доступ к геолокации'
                if (err.code === 2) errorMessage = 'Не удалось определить местоположение'
                if (err.code === 3) errorMessage = 'Таймаут при определении местоположения'

                setError(errorMessage)
                setLoading(false)
            }
        )
    }, [])

    return { location, error, loading }
}

export default useGeolocation