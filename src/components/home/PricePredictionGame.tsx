// 'use client'

// import { usePricePredictionGame } from '@/hooks/usePricePredictionGame'
// import { useAppStore } from '@/store/useAppStore'
// import { useTelegram } from '@/hooks/useTelegram'
// import { useRouter } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import {
//   ChevronLeft,
//   Lock,
//   TrendingUp,
//   TrendingDown,
//   Coins,
//   RefreshCw,
//   HelpCircle,
//   Award,
//   Flame,
// } from 'lucide-react'
// import { ConfettiEffect } from '@/components/ui/ConfettiEffect'

// export function PricePredictionGame() {
//   const router = useRouter()
//   const { tg } = useTelegram()
//   const isCurrentlySimulated = useAppStore((s) => s.isCurrentlySimulated)

//   const {
//     score,
//     currentPrice,
//     lockedPrice,
//     prediction,
//     timer,
//     isLocked,
//     result,
//     showConfetti,
//     priceHistory,
//     makePrediction,
//     forcePriceChange,
//     skipTimer,
//     resetGame,
//   } = usePricePredictionGame()

//   const handleBack = () => {
//     tg?.HapticFeedback?.impactOccurred('light')
//     router.push('/')
//   }

//   const handlePredict = (choice: 'up' | 'down') => {
//     makePrediction(choice)
//   }

//   // SVG Chart Computations
//   const minPrice = Math.min(...priceHistory, currentPrice)
//   const maxPrice = Math.max(...priceHistory, currentPrice)
//   const priceRange = maxPrice - minPrice || 1

//   const padding = 15
//   const width = 450
//   const height = 180

//   const getCoordinates = () => {
//     if (!priceHistory.length) return []
//     return priceHistory.map((val, idx) => {
//       const x = (idx / (priceHistory.length - 1)) * (width - padding * 2) + padding
//       const y = height - ((val - minPrice) / priceRange) * (height - padding * 2) - padding
//       return { x, y }
//     })
//   }

//   const coords = getCoordinates()

//   // Build dynamic smooth Bezier curve path
//   let pathD = ''
//   if (coords.length > 0) {
//     pathD = `M ${coords[0].x} ${coords[0].y}`
//     for (let i = 1; i < coords.length; i++) {
//       const prev = coords[i - 1]
//       const curr = coords[i]
//       const cpX1 = prev.x + (curr.x - prev.x) / 2
//       const cpY1 = prev.y
//       const cpX2 = prev.x + (curr.x - prev.x) / 2
//       const cpY2 = curr.y
//       pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`
//     }
//   }

//   const fillD = pathD && coords.length > 0
//     ? `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`
//     : ''

//   const lastCoord = coords[coords.length - 1]

//   // Decide indicator color based on live performance against locked price
//   const getTrendColor = () => {
//     if (!isLocked || lockedPrice === null) return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20'
//     if (currentPrice > lockedPrice) {
//       return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20'
//     }
//     if (currentPrice < lockedPrice) {
//       return 'text-rose-400 border-rose-500/30 bg-rose-950/20'
//     }
//     return 'text-amber-400 border-amber-500/30 bg-amber-950/20'
//   }

//   return (
//     <div className="relative min-h-screen bg-white text-[#242424] font-sans overflow-hidden select-none pb- safe">
//       {/* Visual Canvas Confetti spray */}
//       <ConfettiEffect active={showConfetti} />

//       {/* Decorative Neon Background Blurs */}
//       <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-[80px]" />
//       <div className="pointer-events-none absolute -right-20 top-1/3 h-64 w-64 rounded-full bg-cyan-600/10 blur-[80px]" />
//       <div className="pointer-events-none absolute left-1/3 bottom-10 h-72 w-72 rounded-full bg-emerald-600/5 blur-[90px]" />

//       {/* Header */}
//       <header className="relative flex items-center justify-between px-5 pt-4 pb-3 border-b bg-white border-b border-gray-100  backdrop-blur-md  z-10">
//         <button
//           type="button"
//           onClick={handleBack}
//           className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-300 active:scale-90 transition"
//         >
//           <ChevronLeft size={20} />
//         </button>

//         <div className="flex flex-col items-center">
//           <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest leading-none">Swifty Play</span>
//           <span className="text-sm font-extrabold text-white leading-tight mt-0.5">Swifty Pulse</span>
//         </div>

//         <div className="flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-[#EED868]/20 text-[#242424] border border-[#EED868]/40 px-3 py-1 text-xs font-bold shadow-[0_0_15px_rgba(234,179,8,0.1)]">
//           <Coins size={13} className="animate-pulse" />
//           <span>{score} PTS</span>
//         </div>
//       </header>

//       {/* Main Content Viewport */}
//       <div className="flex flex-col items-center px-5 py-4 max-w-md mx-auto relative z-10">

//         {/* Market Terminal Header Stats */}
//         <div className="w-full flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <div className="h-2.5 w-2.5 rounded-full  bg-[#377CC8] " />
//             <span className="text-[11px] font-semibold text-zinc-400 tracking-wider">USD/NGN SELL</span>
//           </div>

//           <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-semibold bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5">
//             <Flame size={10} className="text-orange-500" />
//             <span>30s Rounds</span>
//           </div>
//         </div>

//         {/* Live Display Counter */}
//         <div className="w-full flex flex-col items-center justify-center py-2 relative">
//           <AnimatePresence mode="popLayout">
//             {result === 'win' && (
//               <motion.div
//                 key="win-pts"
//                 initial={{ opacity: 0, y: 15, scale: 0.7 }}
//                 animate={{ opacity: 1, y: -75, scale: 1.4 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.8, ease: 'easeOut' }}
//                 className="absolute pointer-events-none text-emerald-400 font-extrabold text-3xl drop-shadow-[0_0_15px_rgba(52,211,153,0.5)] z-20 flex items-center gap-1"
//               >
//                 <Award size={24} /> +10 PTS
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Rate</span>
//           <motion.div
//             key={currentPrice}
//             initial={{ opacity: 0.85, scale: 0.98 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.15 }}
//             className={`text-4xl font-extrabold text-[#242424] font-mono tracking-tight transition-colors duration-300 ${getTrendColor().split(' ')[0]}`}
//           >
//             ₦{currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//           </motion.div>
//         </div>

//         {/* Interactive SVG Sparkline Chart */}
//         <div className="w-full h-48 rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-white/[0.01] shadow-[inset_0_2px_20px_rgba(255,255,255,0.02)] relative p-2 my-4 overflow-hidden">
//           {coords.length > 0 ? (
//             <svg
//               viewBox={`0 0 ${width} ${height}`}
//               className="w-full h-full overflow-visible"
//               preserveAspectRatio="none"
//             >
//               <defs>
//                 <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
//                   <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
//                 </linearGradient>
//                 <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
//                   <stop offset="0%" stopColor="#06b6d4" />
//                   <stop offset="50%" stopColor="#8b5cf6" />
//                   <stop offset="100%" stopColor="#ec4899" />
//                 </linearGradient>
//               </defs>

//               {/* Grid Lines */}
//               <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.03)" strokeDasharray="4,4" />
//               <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.02)" />
//               <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.02)" />

//               {/* Locked Price Threshold line */}
//               {isLocked && lockedPrice !== null && (
//                 <g>
//                   {/* Calculate y height for locked price */}
//                   {(() => {
//                     const y = height - ((lockedPrice - minPrice) / priceRange) * (height - padding * 2) - padding
//                     return (
//                       <>
//                         <line
//                           x1={padding}
//                           y1={y}
//                           x2={width - padding}
//                           y2={y}
//                           stroke="rgba(234,179,8,0.4)"
//                           strokeWidth="1.5"
//                           strokeDasharray="5,3"
//                         />
//                         <text
//                           x={padding + 5}
//                           y={y - 6}
//                           fill="rgba(234,179,8,0.8)"
//                           fontSize="9"
//                           fontWeight="bold"
//                           className="font-mono tracking-wider"
//                         >
//                           LOCKED: ₦{lockedPrice.toFixed(2)}
//                         </text>
//                       </>
//                     )
//                   })()}
//                 </g>
//               )}

//               {/* Gradient Area Fill under Sparkline */}
//               {fillD && (
//                 <path d={fillD} fill="url(#chartGlow)" className="transition-all duration-300" />
//               )}

//               {/* Chart Line Path */}
//               {pathD && (
//                 <path
//                   d={pathD}
//                   fill="none"
//                   stroke="url(#lineGrad)"
//                   strokeWidth="3"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   className="transition-all duration-300"
//                 />
//               )}

//               {/* Pulsating Price Dot at latest coordinate */}
//               {lastCoord && (
//                 <g className="transition-all duration-300">
//                   <circle
//                     cx={lastCoord.x}
//                     cy={lastCoord.y}
//                     r="8"
//                     fill={currentPrice >= (lockedPrice ?? currentPrice) ? '#10b981' : '#f43f5e'}
//                     className="opacity-20 animate-ping"
//                   />
//                   <circle
//                     cx={lastCoord.x}
//                     cy={lastCoord.y}
//                     r="4.5"
//                     fill={currentPrice >= (lockedPrice ?? currentPrice) ? '#34d399' : '#fb7185'}
//                     stroke="#ffffff"
//                     strokeWidth="1.5"
//                   />
//                 </g>
//               )}
//             </svg>
//           ) : (
//             <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-xs font-semibold gap-2">
//               <RefreshCw className="animate-spin size-4" /> Loading market terminal chart...
//             </div>
//           )}
//         </div>

//         {/* Lock Overlay / Prediction status banner */}
//         {isLocked && (
//           <div className="w-full flex items-center gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-xs mb-4">
//             <Lock className="size-4 text-yellow-500 shrink-0 animate-bounce" />
//             <div className="flex-1 text-zinc-300 leading-normal">
//               You predicted the rate will go{' '}
//               <strong className={prediction === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
//                 {prediction?.toUpperCase()} 📈
//               </strong>{' '}
//               from <strong>₦{lockedPrice?.toFixed(2)}</strong>.
//             </div>

//             <div className="flex items-center gap-1.5 bg-black/30 border border-white/5 rounded-lg px-2.5 py-1 text-[11px] font-extrabold font-mono text-white">
//               <span>{timer}s</span>
//             </div>
//           </div>
//         )}

//         {/* Glowing Linear Timer Progress Bar */}
//         {isLocked && !result && (
//           <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden mb-6 relative">
//             <div
//               className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(139,92,246,0.5)]"
//               style={{ width: `${(timer / 30) * 100}%` }}
//             />
//           </div>
//         )}

//         {/* UP and DOWN Prediction Controls */}
//         {!isLocked && (
//           <div className="w-full flex gap-4 my-2">
//             <button
//               type="button"
//               onClick={() => handlePredict('up')}
//               className="flex-1 flex flex-col items-center justify-center gap-1 py-4.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 active:scale-95 transition shadow-[0_4px_20px_rgba(16,185,129,0.1)] hover:bg-emerald-500/15 hover:border-emerald-500/40"
//             >
//               <TrendingUp className="size-6 text-emerald-400 stroke-[2.5]" />
//               <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">UP</span>
//               <span className="text-[10px] text-zinc-500 mt-0.5">Expect Rise</span>
//             </button>

//             <button
//               type="button"
//               onClick={() => handlePredict('down')}
//               className="flex-1 flex flex-col items-center justify-center gap-1 py-4.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 active:scale-95 transition shadow-[0_4px_20px_rgba(244,63,94,0.1)] hover:bg-rose-500/15 hover:border-rose-500/40"
//             >
//               <TrendingDown className="size-6 text-rose-400 stroke-[2.5]" />
//               <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">DOWN</span>
//               <span className="text-[10px] text-zinc-500 mt-0.5">Expect Fall</span>
//             </button>
//           </div>
//         )}

//         {/* Result Overlay Dialog */}
//         <AnimatePresence>
//           {result && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="w-full rounded-2xl border border-white/10 bg-[#0e0c15] p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-2"
//             >
//               {result === 'win' ? (
//                 <>
//                   <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
//                     🏆
//                   </div>
//                   <h3 className="text-lg font-bold text-white">Correct Prediction!</h3>
//                   <p className="text-xs text-zinc-400 leading-normal mt-1 px-2">
//                     USD/NGN rate closed at <strong>₦{currentPrice.toFixed(2)}</strong>. You gained <strong>+10 points</strong>!
//                   </p>
//                 </>
//               ) : result === 'lose' ? (
//                 <>
//                   <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-3 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
//                     😢
//                   </div>
//                   <h3 className="text-lg font-bold text-white">Incorrect Prediction</h3>
//                   <p className="text-xs text-zinc-400 leading-normal mt-1 px-2">
//                     USD/NGN rate closed at <strong>₦{currentPrice.toFixed(2)}</strong>, failing to meet your prediction.
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-500/20 text-zinc-400 border border-zinc-500/30 mb-3">
//                     ⚖️
//                   </div>
//                   <h3 className="text-lg font-bold text-white">Flat Market</h3>
//                   <p className="text-xs text-zinc-400 leading-normal mt-1 px-2">
//                     The rate closed exactly at the entry price. No points were awarded.
//                   </p>
//                 </>
//               )}

//               <button
//                 type="button"
//                 onClick={resetGame}
//                 className="w-full mt-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-97 text-xs font-bold transition shadow-[0_4px_15px_rgba(124,58,237,0.3)]"
//               >
//                 Play Again
//               </button>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Developer Sandbox Panel (visible only when simulation mode is active) */}
//         {isCurrentlySimulated && (
//           <div className="w-full mt-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/[0.03] p-4 text-left">
//             <div className="flex items-center gap-2 mb-3">
//               <HelpCircle className="size-4 text-yellow-500" />
//               <span className="text-[11px] font-extrabold text-yellow-500 uppercase tracking-wider">Dev Game Controls</span>
//             </div>

//             <div className="flex flex-col gap-2">
//               <div className="flex gap-2">
//                 <button
//                   type="button"
//                   onClick={() => forcePriceChange('up')}
//                   className="flex-1 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 transition"
//                 >
//                   Simulate Rise (+₦2.50)
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => forcePriceChange('down')}
//                   className="flex-1 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-[10px] font-bold text-rose-400 transition"
//                 >
//                   Simulate Fall (-₦2.50)
//                 </button>
//               </div>

//               {isLocked && !result && (
//                 <button
//                   type="button"
//                   onClick={skipTimer}
//                   className="w-full py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-[10px] font-bold text-yellow-400 transition"
//                 >
//                   Skip Timer (1s remaining)
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Guidelines / Help */}
//         <div className="w-full text-center mt-6 px-4">
//           <p className="text-[10px] text-zinc-600 leading-normal">
//             Predict USD/NGN sell rate trend over 30s. Perfect forecasts award +10 points. Refreshes periodically.
//           </p>
//         </div>

//       </div>
//     </div>
//   )
// }




'use client'

import { usePricePredictionGame } from '@/hooks/usePricePredictionGame'
import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Lock,
  TrendingUp,
  TrendingDown,
  Coins,
  RefreshCw,
  HelpCircle,
  Award,
  Flame,
} from 'lucide-react'
import { ConfettiEffect } from '@/components/ui/ConfettiEffect'

export function PricePredictionGame() {
  const router = useRouter()
  const { tg } = useTelegram()
  const isCurrentlySimulated = useAppStore((s) => s.isCurrentlySimulated)

  const {
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
  } = usePricePredictionGame()

  const handleBack = () => {
    tg?.HapticFeedback?.impactOccurred('light')
    router.push('/')
  }

  const handlePredict = (choice: 'up' | 'down') => {
    makePrediction(choice)
  }

  // SVG Chart Computations
  const minPrice = Math.min(...priceHistory, currentPrice)
  const maxPrice = Math.max(...priceHistory, currentPrice)
  const priceRange = maxPrice - minPrice || 1

  const padding = 15
  const width = 450
  const height = 180

  const getCoordinates = () => {
    if (!priceHistory.length) return []
    return priceHistory.map((val, idx) => {
      const x = (idx / (priceHistory.length - 1)) * (width - padding * 2) + padding
      const y = height - ((val - minPrice) / priceRange) * (height - padding * 2) - padding
      return { x, y }
    })
  }

  const coords = getCoordinates()

  let pathD = ''
  if (coords.length > 0) {
    pathD = `M ${coords[0].x} ${coords[0].y}`
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1]
      const curr = coords[i]
      const cpX1 = prev.x + (curr.x - prev.x) / 2
      const cpY1 = prev.y
      const cpX2 = prev.x + (curr.x - prev.x) / 2
      const cpY2 = curr.y
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`
    }
  }

  const fillD = pathD && coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`
    : ''

  const lastCoord = coords[coords.length - 1]

  // Price direction relative to locked price
  const priceIsUp = lockedPrice !== null && currentPrice > lockedPrice
  const priceIsDown = lockedPrice !== null && currentPrice < lockedPrice

  return (
    <div className="relative min-h-screen bg-[#F5F6FA] text-[#1A1A2E] font-sans overflow-hidden select-none pb-safe">
      <ConfettiEffect active={showConfetti} />

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-[#EAEDF2]">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAEDF2] bg-[#F5F6FA] text-[#666] active:scale-90 transition"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#377CC8] uppercase tracking-widest leading-none">
            Swifty Play
          </span>
          <span className="text-sm font-extrabold text-[#1A1A2E] leading-tight mt-0.5">
            Swifty Pulse
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-[#EED868] bg-[#FEFBEF] px-3 py-1 text-xs font-bold text-[#7A5F10]">
          <Coins size={13} className="text-[#B8921A]" />
          <span>{score} PTS</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center px-5 py-4 max-w-md mx-auto gap-4">

        {/* Market Pair Row */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#377CC8]" />
            <span className="text-[11px] font-semibold text-[#8A9BB5] tracking-wider uppercase">
              USD/NGN Sell
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A9BB5] bg-white border border-[#EAEDF2] px-2.5 py-1 rounded-lg">
            <Flame size={10} className="text-[#F4813A]" />
            <span>30s Rounds</span>
          </div>
        </div>

        {/* Rate Card */}
        <div className="w-full rounded-2xl bg-white border border-[#EAEDF2] py-5 px-4 flex flex-col items-center relative overflow-hidden">
          {/* Subtle blue tint wash */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#377CC8]/[0.04] to-transparent" />

          {/* Win points animation */}
          <AnimatePresence mode="popLayout">
            {result === 'win' && (
              <motion.div
                key="win-pts"
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: -60, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute pointer-events-none z-20 flex items-center gap-1 text-[#1B8A52] font-extrabold text-2xl"
              >
                <Award size={20} /> +10 PTS
              </motion.div>
            )}
          </AnimatePresence>

          <span className="text-[11px] font-bold text-[#8A9BB5] uppercase tracking-widest mb-1.5 relative z-10">
            Current Rate
          </span>

          <motion.div
            key={currentPrice}
            initial={{ opacity: 0.85, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="text-4xl font-extrabold text-[#1A1A2E] font-mono tracking-tight relative z-10"
          >
            ₦{currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.div>

          {/* Live directional badge */}
          {isLocked && lockedPrice !== null && (
            <div
              className={`mt-2 relative z-10 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold ${priceIsUp
                ? 'bg-[#EAF7F0] text-[#1B8A52]'
                : priceIsDown
                  ? 'bg-[#FEECEC] text-[#B82828]'
                  : 'bg-[#F5F6FA] text-[#8A9BB5]'
                }`}
            >
              {priceIsUp ? <TrendingUp size={12} /> : priceIsDown ? <TrendingDown size={12} /> : null}
              {priceIsUp
                ? `+₦${(currentPrice - lockedPrice).toFixed(2)}`
                : priceIsDown
                  ? `-₦${(lockedPrice - currentPrice).toFixed(2)}`
                  : 'No change'}
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="w-full rounded-2xl bg-white border border-[#EAEDF2] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#8A9BB5] uppercase tracking-wider">
              Price History
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#8A9BB5]">
              <div className="h-2 w-2 rounded-full bg-[#377CC8]" />
              <span>USD/NGN</span>
            </div>
          </div>

          <div className="w-full h-[120px] relative overflow-hidden">
            {coords.length > 0 ? (
              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#377CC8" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#377CC8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#EAEDF2" strokeDasharray="4,4" />
                <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#EAEDF2" />
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#EAEDF2" />

                {/* Locked Price Line */}
                {isLocked && lockedPrice !== null && (() => {
                  const y = height - ((lockedPrice - minPrice) / priceRange) * (height - padding * 2) - padding
                  return (
                    <g>
                      <line
                        x1={padding} y1={y} x2={width - padding} y2={y}
                        stroke="#EED868" strokeWidth="1.5" strokeDasharray="5,3"
                      />
                      <text
                        x={padding + 5} y={y - 5}
                        fill="#B8921A" fontSize="9" fontWeight="bold"
                        className="font-mono"
                      >
                        LOCKED: ₦{lockedPrice.toFixed(2)}
                      </text>
                    </g>
                  )
                })()}

                {/* Fill */}
                {fillD && <path d={fillD} fill="url(#chartFill)" />}

                {/* Line */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#377CC8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Live dot */}
                {lastCoord && (
                  <g>
                    <circle cx={lastCoord.x} cy={lastCoord.y} r="8"
                      fill={priceIsUp ? '#1B8A52' : priceIsDown ? '#B82828' : '#377CC8'}
                      opacity="0.15"
                      className="animate-ping"
                    />
                    <circle cx={lastCoord.x} cy={lastCoord.y} r="4.5"
                      fill={priceIsUp ? '#1B8A52' : priceIsDown ? '#B82828' : '#377CC8'}
                      stroke="#fff" strokeWidth="2"
                    />
                  </g>
                )}
              </svg>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#8A9BB5] text-xs font-semibold gap-2">
                <RefreshCw className="animate-spin size-4" />
                Loading chart...
              </div>
            )}
          </div>
        </div>

        {/* Locked Banner */}
        {isLocked && (
          <div className="w-full flex items-center gap-3 rounded-2xl border border-[#EED868] bg-[#FFFBEB] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FEF3C7] border border-[#EED868] shrink-0">
              <Lock className="size-4 text-[#B8921A]" />
            </div>
            <div className="flex-1 text-xs text-[#6B5C2E] leading-relaxed">
              Predicted rate will go{' '}
              <strong className={prediction === 'up' ? 'text-[#1B8A52]' : 'text-[#B82828]'}>
                {prediction?.toUpperCase()}
              </strong>{' '}
              from <strong className="text-[#1A1A2E]">₦{lockedPrice?.toFixed(2)}</strong>
            </div>
            <div className="shrink-0 bg-white border border-[#EAEDF2] rounded-lg px-2.5 py-1 text-xs font-extrabold font-mono text-[#1A1A2E]">
              {timer}s
            </div>
          </div>
        )}

        {/* Timer Progress Bar */}
        {isLocked && !result && (
          <div className="w-full h-1.5 rounded-full bg-[#EAEDF2] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#377CC8] transition-all duration-1000 ease-linear"
              style={{ width: `${(timer / 30) * 100}%` }}
            />
          </div>
        )}

        {/* Predict Buttons */}
        {!isLocked && (
          <div className="w-full grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handlePredict('up')}
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-[1.5px] border-[#6DCF9E] bg-[#F1FBF6] active:scale-95 transition"
            >
              <TrendingUp className="size-7 text-[#1B8A52] stroke-[2]" />
              <span className="text-[11px] font-extrabold text-[#1B8A52] uppercase tracking-wider">Up</span>
              <span className="text-[10px] text-[#5DA57A]">Expect rise</span>
            </button>

            <button
              type="button"
              onClick={() => handlePredict('down')}
              className="flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-[1.5px] border-[#F4A7A7] bg-[#FFF1F1] active:scale-95 transition"
            >
              <TrendingDown className="size-7 text-[#B82828] stroke-[2]" />
              <span className="text-[11px] font-extrabold text-[#B82828] uppercase tracking-wider">Down</span>
              <span className="text-[10px] text-[#C57272]">Expect fall</span>
            </button>
          </div>
        )}

        {/* Result Card */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full rounded-2xl bg-white border border-[#EAEDF2] p-6 text-center"
            >
              {result === 'win' ? (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F0] border border-[#6DCF9E] text-2xl">
                    🏆
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1A1A2E]">Correct prediction!</h3>
                  <p className="text-xs text-[#8A9BB5] leading-relaxed mt-1.5 px-2">
                    Rate closed at <strong className="text-[#1A1A2E]">₦{currentPrice.toFixed(2)}</strong>. You earned{' '}
                    <strong className="text-[#1B8A52]">+10 points</strong>.
                  </p>
                </>
              ) : result === 'lose' ? (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEECEC] border border-[#F4A7A7] text-2xl">
                    😢
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1A1A2E]">Incorrect prediction</h3>
                  <p className="text-xs text-[#8A9BB5] leading-relaxed mt-1.5 px-2">
                    Rate closed at <strong className="text-[#1A1A2E]">₦{currentPrice.toFixed(2)}</strong>, not matching your call.
                  </p>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F6FA] border border-[#EAEDF2] text-2xl">
                    ⚖️
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1A1A2E]">Flat market</h3>
                  <p className="text-xs text-[#8A9BB5] leading-relaxed mt-1.5 px-2">
                    The rate closed exactly at entry price. No points awarded.
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={resetGame}
                className="w-full mt-5 py-3 rounded-xl bg-[#377CC8] hover:bg-[#2D6AAD] active:scale-[0.97] text-white text-sm font-bold transition"
              >
                Play again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dev Sandbox Panel */}
        {isCurrentlySimulated && (
          <div className="w-full rounded-2xl border border-[#EED868] bg-[#FFFBEB] p-4">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="size-4 text-[#B8921A]" />
              <span className="text-[11px] font-extrabold text-[#B8921A] uppercase tracking-wider">
                Dev Controls
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => forcePriceChange('up')}
                  className="flex-1 py-2 rounded-xl bg-[#EAF7F0] hover:bg-[#D5F0E3] border border-[#6DCF9E] text-[10px] font-bold text-[#1B8A52] transition"
                >
                  Simulate Rise (+₦2.50)
                </button>
                <button
                  type="button"
                  onClick={() => forcePriceChange('down')}
                  className="flex-1 py-2 rounded-xl bg-[#FFF1F1] hover:bg-[#FFE4E4] border border-[#F4A7A7] text-[10px] font-bold text-[#B82828] transition"
                >
                  Simulate Fall (-₦2.50)
                </button>
              </div>
              {isLocked && !result && (
                <button
                  type="button"
                  onClick={skipTimer}
                  className="w-full py-2 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#EED868] text-[10px] font-bold text-[#B8921A] transition"
                >
                  Skip Timer (1s remaining)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Help text */}
        <p className="text-[10px] text-[#B0BBC8] text-center leading-relaxed px-4 pb-2">
          Predict the USD/NGN sell rate trend over 30 seconds. Correct forecasts award +10 points.
        </p>

      </div>
    </div>
  )
}