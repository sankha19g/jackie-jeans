import React from 'react';
import { motion } from 'framer-motion';

export default function VoiceAnimation({ isListening = true, size = 48 }) {
  // Scale factor based on a baseline size of 48px
  const scale = size / 48;

  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {isListening && (
        <>
          {/* Outer Wave Ring 1 */}
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500/20 border border-blue-500/30"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          
          {/* Inner Wave Ring 2 */}
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-500/20 border border-purple-500/30"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{
              duration: 2,
              delay: 0.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </>
      )}

      {/* Central Solid Circle & Icon */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 z-10"
        animate={isListening ? {
          scale: [1, 1.06, 1],
        } : { scale: 1 }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Simple inline SVG Microphone Icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          style={{ width: 20 * scale, height: 20 * scale }}
          className="text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
        </svg>
      </motion.div>
    </div>
  );
}