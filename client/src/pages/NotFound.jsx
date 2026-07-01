import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-grid-blue/8 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center relative"
      >
        <div className="font-orbitron text-[120px] md:text-[180px] font-black text-transparent leading-none mb-6" style={{WebkitTextStroke:'1px rgba(0,212,255,0.3)'}}>
          404
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-orbitron text-[120px] md:text-[180px] font-black text-grid-cyan/5 leading-none blur-sm select-none">
          404
        </div>

        <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-white mb-4 relative">
          SIGNAL <span className="text-gradient">LOST</span>
        </h1>
        <p className="text-gray-400 text-base mb-10 font-inter max-w-md mx-auto relative">
          This node doesn't exist in the GRID network. The page you're looking for has been disconnected or never existed.
        </p>

        <div className="flex items-center justify-center gap-4 relative">
          <Link to="/" className="btn-primary flex items-center gap-2 text-sm px-8 py-3">
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-outline flex items-center gap-2 text-sm px-8 py-3">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}
