/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const FloatingShape = ({ type, size, position, rotation, delay, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  const shapeVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay || 0
      }
    },
    hover: {
      scale: 1.2,
      rotate: rotation + 20,
      transition: { duration: 0.3 }
    }
  };

  const renderShape = () => {
    switch (type) {
      case 'triangle':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon 
              points="50,10 90,90 10,90" 
              fill="currentColor" 
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        );
      case 'circle':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="currentColor" 
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        );
      case 'square':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect 
              x="10" 
              y="10" 
              width="80" 
              height="80" 
              fill="currentColor" 
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        );
      case 'hexagon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon 
              points="50,5 90,25 90,75 50,95 10,75 10,25" 
              fill="currentColor" 
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`absolute ${position} ${size} ${color} cursor-pointer`}
      variants={shapeVariants}
      initial="float"
      animate={isHovered ? "hover" : "float"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ rotate: rotation }}
    >
      {renderShape()}
    </motion.div>
  );
};

function Templates() {
  const floatingShapes = [
    { type: 'triangle', size: 'w-12 h-12', position: 'top-[20%] left-[10%]', color: 'text-purple-400/30', rotation: 15, delay: 0.2 },
    { type: 'circle', size: 'w-16 h-16', position: 'top-[30%] right-[15%]', color: 'text-blue-400/40', rotation: 45, delay: 0.5 },
    { type: 'hexagon', size: 'w-14 h-14', position: 'bottom-[25%] left-[20%]', color: 'text-pink-400/30', rotation: -10, delay: 0.8 },
    { type: 'square', size: 'w-10 h-10', position: 'bottom-[15%] right-[25%]', color: 'text-indigo-400/40', rotation: 30, delay: 0.3 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
        >
          Choose Your Template
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xl text-gray-300 text-center mb-16 max-w-3xl mx-auto"
        >
          Select from our professionally designed templates to showcase your portfolio
        </motion.p>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-12"
        >
          {/* Template 1 - Minimalist */}
          <motion.div 
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0.5 rounded-[23px] bg-slate-900 z-0"></div>
            
            {/* Floating shapes for template 1 */}
            {floatingShapes.map((shape, index) => (
              <FloatingShape
                key={`t1-${index}`}
                type={shape.type}
                size={shape.size}
                position={shape.position}
                color={shape.color}
                rotation={shape.rotation}
                delay={shape.delay}
              />
            ))}
            
            <div className="relative z-10 h-full">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white">Onyx</h3>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium">Popular</span>
                </div>
                <p className="text-gray-300 mb-8">Clean, professional design that highlights your content without distractions.</p>
                
                <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 mb-8">
                  {/* Template preview content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-gray-700/50 rounded-lg border border-gray-600/50 flex items-center justify-center" >
                      <img src='./onyx.jpeg' alt=''/>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-sm text-gray-300">Responsive</span>
                  </div>
                  <a 
                    href="https://sweet-parfait-a56ca9.netlify.app/onyx.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Live preview
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Template 2 - Modern */}
          <motion.div 
            variants={itemVariants}
            className="relative overflow-hidden rounded-3xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0.5 rounded-[23px] bg-slate-900 z-0"></div>
            
            {/* Floating shapes for template 2 */}
            {floatingShapes.map((shape, index) => (
              <FloatingShape
                key={`t2-${index}`}
                type={shape.type}
                size={shape.size}
                position={shape.position}
                color={index % 2 === 0 ? 'text-pink-400/30' : 'text-indigo-400/40'}
                rotation={shape.rotation * 1.5}
                delay={shape.delay * 1.5}
              />
            ))}
            
            <div className="relative z-10 h-full">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white">Duality</h3>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm font-medium">New</span>
                </div>
                <p className="text-gray-300 mb-8">Contemporary design with dynamic elements, make your portfolio stand out.</p>
                
                <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50 mb-8">
                  {/* Template preview content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 bg-gray-700/50 rounded-lg border border-gray-600/50 flex items-center justify-center">
                      <img src='./duality.jpeg' alt=''/>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-sm text-gray-300">Responsive</span>
                  </div>
                  <a 
                    href="https://starlit-platypus-fff4a2.netlify.app/duality.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  >
                    Live preview
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>      
      </div>
    </div>
  )
}

export default Templates