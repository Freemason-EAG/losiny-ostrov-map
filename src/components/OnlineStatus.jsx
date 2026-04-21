import React from "react"
import useOnlineStatus from '../hooks/useOnlineStatus'

const OnlineStatus = () => {
    const isOnline = useOnlineStatus()

    return (
        <div style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            background: isOnline ? '#4caf50' : '#f44336',
            color: 'white',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 12,
            zIndex: 1000,
            fontFamily: 'sans-serif'
        }}>
            {isOnline ? '📡 Онлайн' : '📴 Офлайн-режим'}
        </div>
    )
}

export default OnlineStatus