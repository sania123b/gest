import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import SeeIt from './pages/SeeIt';
import MeetIt from './pages/MeetIt';
import LearnIt from './pages/LearnIt';
import ChatIt from './pages/ChatIt';
export function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate loading delay for the animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return <>
      {/* Loading animation */}
      <AnimatePresence>
        {loading && <motion.div initial={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.5
      }} className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
            <motion.div initial={{
          scale: 0.8,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} exit={{
          scale: 1.2,
          opacity: 0
        }} transition={{
          duration: 0.5
        }} className="flex flex-col items-center">
              <motion.div animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }} transition={{
            rotate: {
              repeat: Infinity,
              duration: 4,
              ease: 'linear'
            },
            scale: {
              repeat: Infinity,
              duration: 1.5,
              ease: 'easeInOut'
            }
          }} className="w-24 h-24 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-4xl">G</span>
              </motion.div>
              <motion.h1 animate={{
            opacity: [0.5, 1, 0.5]
          }} transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          }} className="text-3xl font-bold text-white">
                Gestura
              </motion.h1>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
      {/* Main application */}
      <div className="min-h-screen bg-white">
        {!loading && <Navigation />}
        <motion.main initial={{
        opacity: 0
      }} animate={{
        opacity: loading ? 0 : 1
      }} transition={{
        duration: 0.5
      }} className="pt-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/seeit/*" element={<SeeIt />} />
              <Route path="/meetit/*" element={<MeetIt />} />
              <Route path="/learnit" element={<LearnIt />} />
              <Route path="/chatit" element={<ChatIt />} />
            </Routes>
          </AnimatePresence>
        </motion.main>
      </div>
    </>;
}