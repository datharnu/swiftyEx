'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'
import { mockRates } from '@/lib/mock'

export function usePricePredictionGame() {
  const { tg } = useTelegram()
  const storeRates = useAppStore((s) => s.rates)
  
  // Resolve base price from USD sell rate or fallback
  const getBasePrice = () => {
    const rateStr = storeRates?.USD?.sell || mockRates.USD.sell
    return parseFloat(rateStr) || 1340.00
  }

  const basePrice = getBasePrice()

  const [score, setScore] = useState<number>(0)
  const [currentPrice, setCurrentPrice] = useState<number>(basePrice)
  const [lockedPrice, setLockedPrice] = useState<number | null>(null)
  const [prediction, setPrediction] = useState<'up' | 'down' | null>(null)
  const [timer, setTimer] = useState<number>(30)
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [result, setResult] = useState<'win' | 'lose' | 'tie' | null>(null)
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [priceHistory, setPriceHistory] = useState<number[]>([])

  // Load score from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScore = localStorage.getItem('swiftypulse_score')
      if (savedScore) {
        setScore(parseInt(savedScore, 10) || 0)
      }
    }
  }, [])

  // Generate initial history points around base price to populate sparkline chart
  useEffect(() => {
    const initialHistory: number[] = []
    let tempPrice = basePrice
    for (let i = 0; i < 15; i++) {
      tempPrice += (Math.random() - 0.5) * 1.5
      initialHistory.push(parseFloat(tempPrice.toFixed(2)))
    }
    setPriceHistory(initialHistory)
    setCurrentPrice(initialHistory[initialHistory.length - 1])
  }, [basePrice])

  // Price ticking (random walk) - occurs every 1.5s
  useEffect(() => {
    // If game has ended (result is set), freeze price movements for clarity
    if (result) return

    const interval = setInterval(() => {
      setCurrentPrice((prev) => {
        // Drift can be up or down
        const change = (Math.random() - 0.5) * 1.2
        const nextPrice = parseFloat((prev + change).toFixed(2))
        
        setPriceHistory((prevHistory) => {
          const newHistory = [...prevHistory, nextPrice]
          if (newHistory.length > 20) {
            newHistory.shift()
          }
          return newHistory
        })
        
        return nextPrice
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [result])

  // We need refs to avoid stale closures in evaluating the result
  const stateRef = useRef({ currentPrice, lockedPrice, prediction, score })
  useEffect(() => {
    stateRef.current = { currentPrice, lockedPrice, prediction, score }
  }, [currentPrice, lockedPrice, prediction, score])

  const evaluateResult = useCallback(() => {
    const { currentPrice: finalPrice, lockedPrice: lockPrice, prediction: pred, score: currentScore } = stateRef.current
    if (lockPrice === null || !pred) return

    let gameResult: 'win' | 'lose' | 'tie'

    if (finalPrice > lockPrice) {
      gameResult = pred === 'up' ? 'win' : 'lose'
    } else if (finalPrice < lockPrice) {
      gameResult = pred === 'down' ? 'win' : 'lose'
    } else {
      gameResult = 'tie'
    }

    setResult(gameResult)

    if (gameResult === 'win') {
      const nextScore = currentScore + 10
      setScore(nextScore)
      if (typeof window !== 'undefined') {
        localStorage.setItem('swiftypulse_score', String(nextScore))
      }
      setShowConfetti(true)
      tg?.HapticFeedback?.notificationOccurred('success')
    } else {
      tg?.HapticFeedback?.notificationOccurred('error')
    }
  }, [tg])

  // Timer Countdown Logic
  useEffect(() => {
    if (!isLocked || timer <= 0 || result) return

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          // Evaluate game result on timer expiry
          evaluateResult()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isLocked, timer, result, evaluateResult])

  const makePrediction = (choice: 'up' | 'down') => {
    tg?.HapticFeedback?.impactOccurred('light')
    setPrediction(choice)
    setLockedPrice(currentPrice)
    setIsLocked(true)
    setTimer(30)
    setResult(null)
    setShowConfetti(false)
  }

  const forcePriceChange = (direction: 'up' | 'down') => {
    const shift = direction === 'up' ? 2.50 : -2.50
    setCurrentPrice((prev) => {
      const nextPrice = parseFloat((prev + shift).toFixed(2))
      setPriceHistory((prevHistory) => {
        const newHistory = [...prevHistory, nextPrice]
        if (newHistory.length > 20) {
          newHistory.shift()
        }
        return newHistory
      })
      return nextPrice
    })
  }

  const skipTimer = () => {
    setTimer(1)
  }

  const resetGame = () => {
    setPrediction(null)
    setLockedPrice(null)
    setIsLocked(false)
    setTimer(30)
    setResult(null)
    setShowConfetti(false)
  }

  return {
    score,
    currentPrice,
    lockedPrice,
    prediction,
    timer,
    isLocked,
    result,
    showConfetti,
    priceHistory,
    makePrediction,
    forcePriceChange,
    skipTimer,
    resetGame,
  }
}
