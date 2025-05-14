/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// GitHub OAuth login function
const githubLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
};

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

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroRef = useRef(null);
  const howItWorksRef = useRef(null);

  // Scroll function to navigate to How It Works section
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  // Steps array for How It Works section
  const steps = [
    {
      title: "Upload Your Resume",
      description: "Upload your PDF or DOCX resume or paste your plain text resume content.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "AI Generates Portfolio",
      description: "Our AI analyzes your resume and creates a custom portfolio website with your skills and experience.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Deploy to GitHub",
      description: "With just a few clicks, deploy your portfolio to your GitHub account, ready to be published.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: "from-gray-600 to-gray-700"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;
      const progress = (scrollY / (fullHeight - windowHeight)) * 100;
      setScrollProgress(progress);
    };

    // Create Intersection Observer to detect when hero section is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3 // Trigger when at least 10% of the hero is visible
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  const floatingShapes = [
    { type: 'triangle', size: 'w-12 h-12', position: 'top-[20%] left-[10%] z-50', color: 'text-purple-400/30', rotation: 15, delay: 0.2 },
    { type: 'circle', size: 'w-16 h-16', position: 'top-[30%] right-[15%] z-50', color: 'text-blue-400/40', rotation: 45, delay: 0.5 },
    { type: 'hexagon', size: 'w-14 h-14', position: 'bottom-[25%] left-[20%] z-50', color: 'text-pink-400/30', rotation: -10, delay: 0.8 },
    { type: 'square', size: 'w-10 h-10', position: 'bottom-[15%] right-[25%] z-50', color: 'text-indigo-400/40', rotation: 30, delay: 0.3 },
    { type: 'triangle', size: 'w-8 h-8', position: 'top-[15%] left-[30%] z-50', color: 'text-teal-400/30', rotation: -20, delay: 0.7 },
    { type: 'circle', size: 'w-20 h-20', position: 'bottom-[30%] right-[10%] z-50', color: 'text-amber-400/20', rotation: 60, delay: 0.4 }
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden h-screen flex items-center">
        {/* Floating shapes */}
        {floatingShapes.map((shape, index) => (
          <FloatingShape
            key={index}
            type={shape.type}
            size={shape.size}
            position={shape.position}
            color={shape.color}
            rotation={shape.rotation}
            delay={shape.delay}
          />
        ))}

        {/* Dynamic gradient that follows mouse */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{
            backgroundPosition: `${50 + mousePosition.x * 10}% ${50 + mousePosition.y * 10}%`
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{
            background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
          }}
        />

        {/* Grid background at bottom */}
        <div className="absolute inset-0 h-full w-full z-[-1]">
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:linear-gradient(to_bottom,transparent_10%,#000_40%)]"></div>
        </div>
        
        {/* Centered gradient blur */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-purple-500/40 rounded-full filter blur-[120px]"></div>
        </div>
        
        {/* Floating gradient bubbles */}
        <div className="absolute -bottom-40 left-0 right-0 h-[500px] pointer-events-none z-0">
          <div className="absolute left-[30%] bottom-20 w-[300px] h-[300px] bg-blue-500/15 rounded-full filter blur-[90px]"></div>
          <div className="absolute left-[70%] bottom-10 w-[250px] h-[250px] bg-purple-500/20 rounded-full filter blur-[80px]"></div>
        </div>
        
        {/* Grid background at the top */}
        <div className="absolute inset-0 h-[50vh] pointer-events-none z-[-1]">
          <div className="relative h-full w-full bg-white">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10 mt-[4rem]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight max-w-4xl mx-auto"
          >
            Affordable, Accessible and Efficient
            <br />
            <span className="bg-clip-text font-semibold text-5xl text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              AI Compute for Everyone
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-[1rem] text-xl text-black max-w-3xl mx-auto"
          >
            Transform your resume into a stunning portfolio in just three simple steps
          </motion.p>

          {/* Get Started Button (Hero) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative z-20 mt-12 flex text-center justify-center"
          >
            <button
              onClick={githubLogin}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium px-8 py-4 rounded-full shadow-lg hover:from-blue-500/70 hover:to-purple-600/70 transition-all duration-500 border border-gray-600/50 text-lg group animate-float"
              aria-label="Get Started with GitHub"
            >
              <span>Get Started</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

          {/* Scroll to Explore - Only visible when hero is in view */}
          {isHeroVisible && (
            <motion.div 
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: 1, duration: 0.8 }
              }}
              whileHover={{ y: 5 }}
            >
              <div className='inline-flex flex-col items-center cursor-pointer' onClick={scrollToHowItWorks}>
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-2"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
                <div className='inline-flex item-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-black border border-gray-700/50 group hover:border-blue-500 transition-all duration-300'>
                  <span className="text-sm font-medium mr-2">Scroll to Explore</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 px-4 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 h-full w-full">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your resume into a stunning portfolio in just three simple steps.
            </p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 relative z-10"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -10 }}
                className="group perspective-1000"
              >
                <div className="h-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50 group-hover:border-purple-400/30 transition-all duration-500 transform-style-preserve-3d">
                  <div className={`absolute inset-0 rounded-2xl pointer-events-none overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    <div className={`absolute inset-[1px] rounded-[15px] bg-slate-900`}></div>
                  </div>
                  <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${step.color} blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  <div className="relative z-0 h-full flex flex-col p-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-8 text-white shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <div className="absolute inset-0 rounded-2xl border border-white/10"></div>
                      <div className="relative z-10">{step.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 relative">
                      {step.title}
                      <span className={`absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r ${step.color} transition-all duration-500 group-hover:w-full`}></span>
                    </h3>
                    <p className="text-gray-300 mb-6 flex-grow">{step.description}</p>
                    <div className="mt-auto">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${step.color} bg-opacity-10 border border-gray-700/50 group-hover:border-transparent transition-all duration-300`}>
                        <span className="text-sm font-medium text-white mr-2">Learn more</span>
                        <svg
                          className="w-4 h-4 text-white transform transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 h-full w-full">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to showcase your professional experience
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "AI-Powered Organization",
                description: "Our AI transforms your resume content into a professional portfolio website tailored to your experience.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
                color: "text-green-400 bg-green-900/50"
              },
              {
                title: "GitHub Integration",
                description: "Seamlessly connect with GitHub to save and host your portfolio website.",
                icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
                color: "text-blue-400 bg-blue-900/50"
              },
              {
                title: "Modern Designs",
                description: "Choose from professionally designed templates that highlight your work and experience.",
                icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
                color: "text-purple-400 bg-purple-900/50"
              },
              {
                title: "Responsive Design",
                description: "Your portfolio will look great on any device, from desktop to mobile.",
                icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
                color: "text-orange-400 bg-orange-900/50"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg ${feature.color} mr-6 border border-white/10`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 h-full w-full">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Create Your Portfolio?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Get started in minutes and have a professional portfolio to share with the world
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <button
              onClick={githubLogin}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium px-8 py-4 rounded-full shadow-lg hover:from-blue-500/70 hover:to-purple-600/70 transition-all duration-500 border border-gray-600/50 text-lg group"
              aria-label="Get Started Today with GitHub"
            >
              <span>Get Started Today</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Hero;
