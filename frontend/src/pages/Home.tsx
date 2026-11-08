import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, CheckCircleIcon, ArrowUpRightIcon, StarIcon, SparklesIcon, VideoIcon, UsersIcon, BookOpenIcon, InfoIcon, MessageCircleIcon } from 'lucide-react';
const Home = () => {
  const navigate = useNavigate();
  const {
    scrollYProgress
  } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, {
    once: false,
    amount: 0.3
  });
  const problemRef = useRef(null);
  const isProblemInView = useInView(problemRef, {
    once: false,
    amount: 0.3
  });
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, {
    once: false,
    amount: 0.3
  });
  const impactRef = useRef(null);
  const isImpactInView = useInView(impactRef, {
    once: false,
    amount: 0.3
  });
  const accessibilityRef = useRef(null);
  const isAccessibilityInView = useInView(accessibilityRef, {
    once: false,
    amount: 0.3
  });
  const finalRef = useRef(null);
  const isFinalInView = useInView(finalRef, {
    once: false,
    amount: 0.3
  });
  const [activeModule, setActiveModule] = useState<string | null>(null);
  return <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen py-20 px-6 bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-indigo-800/90 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={isHeroInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 50
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={isHeroInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.4
            }} className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="text-sm font-medium">
                  Revolutionizing Communication
                </span>
              </motion.div>
              <motion.h1 initial={{
              opacity: 0,
              y: 20
            }} animate={isHeroInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.5
            }} className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Bridge the gap with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-400">
                  Gestura
                </span>
              </motion.h1>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={isHeroInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.6
            }} className="text-xl text-indigo-100 mb-8 max-w-lg">
                Empowering communication between sign language users and
                non-signers through innovative AI technology
              </motion.p>
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={isHeroInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.7
            }} className="flex flex-wrap gap-4">
                <motion.button whileHover={{
                scale: 1.05,
                backgroundColor: '#4f46e5'
              }} whileTap={{
                scale: 0.98
              }} 
             onClick={() => setActiveModule('learn')} className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl transition-all flex items-center gap-2">
                  Learn More <ArrowRightIcon size={18} />
                </motion.button>
              </motion.div>
            </div>
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} animate={isHeroInView ? {
            opacity: 1,
            x: 0
          } : {
            opacity: 0,
            x: 50
          }} transition={{
            duration: 0.8,
            delay: 0.6
          }} className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/80 to-blue-500/80 rounded-2xl blur-sm opacity-70"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="w-full h-auto"
                  poster="/src/utils/adults-learning-sign-language-deaf-260nw-1873191883.webp"
                >
                  <source src="/src/utils/gestura-demo.mp4" type="video/mp4" />
                  <source src="/src/utils/gestura-demo.webm" type="video/webm" />
                  {/* Fallback image if video doesn't load */}
                  <img src="/src/utils/adults-learning-sign-language-deaf-260nw-1873191883.webp" alt="Gestura platform preview" className="w-full h-auto" />
                </video>
                <div className="absolute -bottom-2 -right-2 transform rotate-6">
                  <motion.div initial={{
                  rotate: 0
                }} animate={{
                  rotate: 360
                }} transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear'
                }} className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full opacity-30 blur-xl" />
                </div>
              </div>
              {/* Floating badges */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 1,
              duration: 0.5
            }} className="absolute -top-6 -left-6 px-4 py-2 bg-white/80 rounded-lg shadow-xl flex items-center gap-2">
                <SparklesIcon size={16} className="text-indigo-500" />
                <span className="font-medium">AI-Powered Translation</span>
              </motion.div>
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 1.2,
              duration: 0.5
            }} className="absolute -bottom-6 -right-6 px-4 py-2 bg-white/80 rounded-lg shadow-xl flex items-center gap-2">
                <StarIcon size={16} className="text-emerald-500" />
                <span className="font-medium">For 430M+ unheard voices</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Learn Mode Instructions */}
      <AnimatePresence>
        {activeModule === 'learn' && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{
          scale: 0.9
        }} animate={{
          scale: 1
        }} exit={{
          scale: 0.9
        }} className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Learn Mode - Select a Module
                  </h2>
                  <button onClick={() => setActiveModule(null)} className="p-2 rounded-full hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white rounded-xl shadow-xl border border-emerald-100 p-6 h-full">
                      <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white">
                        <VideoIcon size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        SeeIT
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Convert any uploaded video into a synchronized AI avatar
                        that signs the content, making videos accessible to the
                        deaf community.
                      </p>
                      <button onClick={() => navigate('/seeit')} className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-white rounded-lg flex items-center">
                        Explore SeeIT{' '}
                        <ArrowRightIcon size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white rounded-xl shadow-xl border border-blue-100 p-6 h-full">
                      <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white">
                        <UsersIcon size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        MeetIT
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Real-time online meeting platform with dynamic
                        speech-to-sign and sign-to-speech conversion for
                        inclusive communication.
                      </p>
                      <button onClick={() => navigate('/meetit')} className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-lg flex items-center">
                        Explore MeetIT{' '}
                        <ArrowRightIcon size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white rounded-xl shadow-xl border border-amber-100 p-6 h-full">
                      <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white">
                        <BookOpenIcon size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        LearnIT
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Interactive sign language learning platform with
                        practice features and real-time feedback on your signing
                        accuracy.
                      </p>
                      <button onClick={() => navigate('/learnit')} className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-lg flex items-center">
                        Explore LearnIT{' '}
                        <ArrowRightIcon size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative bg-white rounded-xl shadow-xl border border-violet-100 p-6 h-full">
                      <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white">
                        <MessageCircleIcon size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">
                        ChatIT
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Ask an AI assistant any question by typing or signing,
                        and get clear answers in simple text and sign language
                        from a human avatar.
                      </p>
                      <button onClick={() => navigate('/chatit')} className="px-4 py-2 bg-gradient-to-r from-violet-400 to-fuchsia-400 text-white rounded-lg flex items-center">
                        Explore ChatIT{' '}
                        <ArrowRightIcon size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
      {/* Problem Statement */}
      <section ref={problemRef} className="relative py-32 px-6 bg-indigo-100/80 text-gray-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => <div key={i} className="absolute rounded-full bg-indigo-500/20" style={{
            width: `${Math.random() * 300 + 50}px`,
            height: `${Math.random() * 300 + 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.3,
            filter: `blur(${Math.random() * 50 + 10}px)`
          }} />)}
          </div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={isProblemInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 50
        }} transition={{
          duration: 0.8
        }} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <motion.div initial={{
              opacity: 0,
              x: -20
            }} animate={isProblemInView ? {
              opacity: 1,
              x: 0
            } : {
              opacity: 0,
              x: -20
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }}>
                <span className="inline-block px-4 py-1 bg-indigo-200/70 backdrop-blur-sm rounded-full text-sm font-medium mb-4 text-indigo-700">
                  The Challenge
                </span>
                <h2 className="text-4xl font-bold mb-6 leading-tight">
                  The tools to transform communication
                </h2>
              </motion.div>
              <motion.p initial={{
              opacity: 0,
              x: -20
            }} animate={isProblemInView ? {
              opacity: 1,
              x: 0
            } : {
              opacity: 0,
              x: -20
            }} transition={{
              duration: 0.5,
              delay: 0.3
            }} className="text-lg mb-6 text-gray-700">
                Millions of deaf and hard-of-hearing individuals are excluded
                from meaningful interaction due to the communication gap between
                Sign Language users and non-signers. Current solutions are often
                unidirectional and fail to capture the visual expressiveness of
                sign language.
              </motion.p>
              <motion.p initial={{
              opacity: 0,
              x: -20
            }} animate={isProblemInView ? {
              opacity: 1,
              x: 0
            } : {
              opacity: 0,
              x: -20
            }} transition={{
              duration: 0.5,
              delay: 0.4
            }} className="text-lg text-gray-700">
                This limits equal access to media, education, workplaces, and
                online interactions, demanding urgent, inclusive technology for
                seamless, natural, and bidirectional communication.
              </motion.p>
            </div>
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={isProblemInView ? {
            opacity: 1,
            scale: 1
          } : {
            opacity: 0,
            scale: 0.9
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }} className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/60 to-purple-500/60 rounded-2xl blur-sm opacity-50"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-indigo-200">
                <h3 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Real-World Evidence
                </h3>
                <div className="space-y-6">
                  {['Linguistic Studies link the importance of visual communication', 'Community Testimony highlights communication barriers', 'Over 430 million people worldwide live with disabling hearing loss', '34 million children affected by hearing impairment'].map((item, index) => <motion.div key={index} initial={{
                  opacity: 0,
                  y: 20
                }} animate={isProblemInView ? {
                  opacity: 1,
                  y: 0
                } : {
                  opacity: 0,
                  y: 20
                }} transition={{
                  duration: 0.5,
                  delay: 0.5 + index * 0.1
                }} className="flex items-start">
                      <div className="mr-4 mt-1">
                        <motion.div whileHover={{
                      scale: 1.2,
                      rotate: 5
                    }} className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200">
                          <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
                        </motion.div>
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </motion.div>)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Features */}
      <section ref={featuresRef} className="relative py-32 px-6 bg-gradient-to-b from-emerald-50 to-emerald-100 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute left-0 top-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(16, 185, 129, 0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={isFeaturesInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 30
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-emerald-200 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Our Features
            </span>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              Make communication accessible
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gestura's easy-to-use features and AI-powered tools help bridge
              the gap between sign language users and non-signers.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
            title: 'SeeIT',
            description: 'Sign Language Translation for Videos. Convert any uploaded video into a synchronized AI avatar that signs the content.',
            icon: '📹',
            path: '/seeit',
            delay: 0.2
          }, {
            title: 'MeetIT',
            description: 'Real-Time Communication with dynamic speech-to-sign and sign-to-speech conversion for online meetings.',
            icon: '👥',
            path: '/meetit',
            delay: 0.3
          }, {
            title: 'LearnIT',
            description: 'Interactive Sign Language Learning with practice feature and real-time accuracy feedback.',
            icon: '📚',
            path: '/learnit',
            delay: 0.4
          }, {
            title: 'ChatIT',
            description: 'AI Assistant in Sign Language. Ask any question by typing or signing and a human avatar answers you in sign and simple text.',
            icon: '💬',
            path: '/chatit',
            delay: 0.5
          }].map((feature, index) => <FeatureCard key={index} title={feature.title} description={feature.description} icon={feature.icon} onClick={() => navigate(feature.path)} isVisible={isFeaturesInView} delay={feature.delay} />)}
          </div>

        </div>
      </section>
      {/* Global Impact */}
      <section ref={impactRef} className="relative py-32 px-6 bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => <motion.div key={i} animate={{
          x: [0, Math.random() * 100 - 50, 0],
          y: [0, Math.random() * 100 - 50, 0]
        }} transition={{
          repeat: Infinity,
          duration: 20 + Math.random() * 10,
          ease: 'easeInOut'
        }} className="absolute rounded-full bg-purple-300/30 blur-3xl" style={{
          width: `${Math.random() * 400 + 200}px`,
          height: `${Math.random() * 400 + 200}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.3
        }} />)}
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={isImpactInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 40
        }} transition={{
          duration: 0.8
        }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.span initial={{
              opacity: 0,
              y: 20
            }} animate={isImpactInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="inline-block px-4 py-1 bg-purple-200 text-purple-700 rounded-full text-sm font-medium mb-4">
                Powered by AI
              </motion.span>
              <motion.h2 initial={{
              opacity: 0,
              y: 20
            }} animate={isImpactInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.3
            }} className="text-4xl font-bold mb-6 text-gray-900">
                It's not magic, it's{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                  Gestura AI
                </span>
              </motion.h2>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={isImpactInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.4
            }} className="text-lg text-gray-700 mb-8">
                Every gesture has meaning, and Gestura AI transforms them into words, 
                breaking communication barriers and allowing you to connect with anyone, 
                anywhere, effortlessly — so every conversation becomes clear, inclusive, and meaningful.
              </motion.p>
              
            </div>
            <motion.div initial={{
            opacity: 0,
            x: 40
          }} animate={isImpactInView ? {
            opacity: 1,
            x: 0
          } : {
            opacity: 0,
            x: 40
          }} transition={{
            duration: 0.8,
            delay: 0.3
          }} className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl blur-sm opacity-50"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-200 shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center overflow-hidden">
                  <motion.div initial={{
                  scale: 0.8,
                  opacity: 0
                }} animate={isImpactInView ? {
                  scale: 1,
                  opacity: 1
                } : {
                  scale: 0.8,
                  opacity: 0
                }} transition={{
                  delay: 0.5,
                  duration: 0.6
                }} className="relative">
                    <motion.div animate={{
                    rotate: [0, 360]
                  }} transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear'
                  }} className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-xl" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                  </motion.div>
                </div>
                <p className="mt-4 text-center text-gray-500 font-medium">
                  Watch how Gestura works
                </p>
              </div>
              {/* Floating badge */}
              <motion.div initial={{
              opacity: 0,
              scale: 0.8
            }} animate={isImpactInView ? {
              opacity: 1,
              scale: 1
            } : {
              opacity: 0,
              scale: 0.8
            }} transition={{
              delay: 0.8,
              duration: 0.5
            }} className="absolute -top-6 -right-6 px-4 py-2 bg-white rounded-lg shadow-xl flex items-center gap-2 border border-purple-200">
                <SparklesIcon size={16} className="text-purple-500" />
                <span className="font-medium">AI-Powered Translation</span>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
            {[{
            title: 'Global Reach',
            description: 'Over 430 million people worldwide live with disabling hearing loss, including 34 million children.',
            delay: 0.3
          }, {
            title: 'Inclusion & Independence',
            description: 'Users can communicate naturally without relying on interpreters.',
            delay: 0.4
          }, {
            title: 'Enhanced Learning',
            description: 'AI-powered sign avatars can boost comprehension by 60-70%.',
            delay: 0.5
          }, {
            title: 'Social Value',
            description: 'Preserves cultural and emotional expression through sign language.',
            delay: 0.6
          }].map((item, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} animate={isImpactInView ? {
            opacity: 1,
            y: 0
          } : {
            opacity: 0,
            y: 30
          }} transition={{
            duration: 0.6,
            delay: item.delay
          }} className="group">
                <motion.div whileHover={{
              y: -5
            }} className="h-full bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-purple-200/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-purple-300">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-700">{item.description}</p>
                </motion.div>
              </motion.div>)}
          </div>
        </div>
      </section>
      {/* Accessibility Section */}
      <section ref={accessibilityRef} className="relative py-32 px-6 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <svg className="absolute left-0 top-0 h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="rgba(37, 99, 235, 0.2)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={isAccessibilityInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 40
        }} transition={{
          duration: 0.8
        }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.span initial={{
              opacity: 0,
              y: 20
            }} animate={isAccessibilityInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="inline-block px-4 py-1 bg-blue-200 text-blue-700 rounded-full text-sm font-medium mb-4">
                Accessibility First
              </motion.span>
              <motion.h2 initial={{
              opacity: 0,
              y: 20
            }} animate={isAccessibilityInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.3
            }} className="text-4xl font-bold mb-6 text-gray-900">
                The best in accessibility and inclusion
              </motion.h2>
              <motion.p initial={{
              opacity: 0,
              y: 20
            }} animate={isAccessibilityInView ? {
              opacity: 1,
              y: 0
            } : {
              opacity: 0,
              y: 20
            }} transition={{
              duration: 0.5,
              delay: 0.4
            }} className="text-lg text-gray-700 mb-8">
                We designed Gestura to ensure that every user 
                whether signing, speaking, or learning can communicate 
                naturally, seamlessly, and without barriers.
              </motion.p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[{
              title: 'Accessibility',
              description: 'From real-time AI translation to interactive learning, every feature is built to accommodate diverse communication needs and preferences.',
              delay: 0.3,
              color: 'blue'
            }, {
              title: 'Inclusivity',
              description: 'From real-time AI translation to interactive learning, every feature is built to accommodate diverse communication needs and preferences.',
              delay: 0.4,
              color: 'blue'
            }, {
              title: 'Empowering Independence',
              description: 'No more waiting for interpreters or limited tools. Gestura gives users autonomy in education, work, media, and daily interactions.',
              delay: 0.5,
              color: 'blue'
            }, {
              title: 'Reliability',
              description: 'Gestura works wherever and whenever you need it from live meetings to video content, providing consistent, accurate, and bidirectional translation.',
              delay: 0.6,
              color: 'blue'
            }].map((item, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30,
              scale: 0.9
            }} animate={isAccessibilityInView ? {
              opacity: 1,
              y: 0,
              scale: 1
            } : {
              opacity: 0,
              y: 30,
              scale: 0.9
            }} transition={{
              duration: 0.6,
              delay: item.delay
            }} whileHover={{
              y: -5
            }} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-xl border border-blue-200 shadow-xl h-full">
                    <h3 className={`text-xl font-semibold mb-3 text-${item.color}-800`}>
                      {item.title}
                    </h3>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                </motion.div>)}
            </div>
          </motion.div>
        </div>
      </section>
      {/* Final CTA */}
      <section ref={finalRef} className="relative py-32 px-6 bg-gradient-to-br from-indigo-900 to-purple-900 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{
          opacity: 0,
          y: 40
        }} animate={isFinalInView ? {
          opacity: 1,
          y: 0
        } : {
          opacity: 0,
          y: 40
        }} transition={{
          duration: 0.8
        }}>
            <motion.span initial={{
            opacity: 0,
            y: 20
          }} animate={isFinalInView ? {
            opacity: 1,
            y: 0
          } : {
            opacity: 0,
            y: 20
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4 border border-white/20">
              Get Started Today
            </motion.span>
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} animate={isFinalInView ? {
            opacity: 1,
            y: 0
          } : {
            opacity: 0,
            y: 20
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} className="text-5xl font-bold mb-6">
              Ready to Experience{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300">
                Gestura
              </span>
              ?
            </motion.h2>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={isFinalInView ? {
            opacity: 1,
            y: 0
          } : {
            opacity: 0,
            y: 20
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }} className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
              Explore our features and see how Gestura can transform
              communication for everyone.
            </motion.p>
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={isFinalInView ? {
            opacity: 1,
            y: 0
          } : {
            opacity: 0,
            y: 20
          }} transition={{
            duration: 0.5,
            delay: 0.5
          }} className="flex flex-wrap justify-center gap-4">
              {[{
              name: 'SeeIT',
              path: '/seeit'
            }, {
              name: 'MeetIT',
              path: '/meetit'
            }, {
              name: 'LearnIT',
              path: '/learnit'
            }, {
              name: 'ChatIT',
              path: '/chatit'
            }].map((button, index) => <motion.button key={index} whileHover={{
              scale: 1.05,
              backgroundColor: '#4f46e5'
            }} whileTap={{
              scale: 0.98
            }} onClick={() => navigate(button.path)} className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/30">
                  Try {button.name} <ArrowRightIcon size={18} />
                </motion.button>)}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>;
};
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  isVisible: boolean;
  delay: number;
}
const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  onClick,
  isVisible,
  delay
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 30
  }} animate={isVisible ? {
    opacity: 1,
    y: 0
  } : {
    opacity: 0,
    y: 30
  }} transition={{
    duration: 0.6,
    delay
  }} whileHover={{
    y: -10
  }} className="group relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
      <motion.div whileHover={{
      scale: 1.02
    }} whileTap={{
      scale: 0.98
    }} className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-emerald-200 p-8 cursor-pointer transition-all h-full flex flex-col" onClick={onClick}>
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mb-6 group-hover:bg-emerald-200 transition-colors">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-800 group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      </motion.div>
    </motion.div>;
};
export default Home;