import React from 'react';
import { motion } from 'motion/react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#2C5F6F] to-[#1e4552] flex items-center justify-center z-[200]">
      <div className="text-center">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold text-white mb-2">
            SysConecta
          </h1>
          <p className="text-blue-100 text-lg">Enterprise Glass Management System</p>
        </motion.div>

        {/* Loading spinner */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white rounded-full"
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-blue-100 text-sm"
        >
          Carregando...
        </motion.p>
      </div>
    </div>
  );
}
