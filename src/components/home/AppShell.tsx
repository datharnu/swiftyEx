'use client'

import { useState, useEffect } from 'react'
import LoadingScreen from './LoadingScreen'


export function AppShell({ children }: { children: React.ReactNode }) {
    const [splashDone, setSplashDone] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setSplashDone(true), 2800)
        return () => clearTimeout(t)
    }, [])

    return (
        <>
            {!splashDone && <LoadingScreen message="SwiftyEx is loading..." />}
            {children}
        </>
    )
}