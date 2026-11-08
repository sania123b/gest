import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, VideoIcon, UsersIcon, BookOpenIcon, InfoIcon, XIcon, MenuIcon, MessageCircleIcon } from 'lucide-react';
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen
}) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname, setSidebarOpen]);
  return <>
      {/* Mobile menu button - visible only on mobile */}
      <motion.button initial={{
      opacity: 0,
      scale: 0.9
    }} animate={{
      opacity: 1,
      scale: 1
    }} transition={{
      duration: 0.3
    }} onClick={() => setSidebarOpen(true)} className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
        <MenuIcon size={24} className="text-indigo-600" />
      </motion.button>
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />}
      </AnimatePresence>
      {/* Sidebar */}
      <motion.aside initial={{
      x: -320
    }} animate={{
      x: sidebarOpen ? 0 : -320
    }} transition={{
      type: 'spring',
      damping: 25,
      stiffness: 300
    }} className="fixed md:translate-x-0 inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-indigo-900 to-purple-900 shadow-2xl flex flex-col h-full border-r border-white/10 md:shadow-none">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div whileHover={{
            rotate: [0, -10, 10, -10, 0],
            scale: 1.1
          }} transition={{
            duration: 0.5
          }} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-bold text-lg">G</span>
            </motion.div>
            <motion.span initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.2
          }} className="text-xl font-bold text-white">
              Gestura
            </motion.span>
          </Link>
          <motion.button whileHover={{
          rotate: 90
        }} whileTap={{
          scale: 0.9
        }} onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-full hover:bg-white/10 text-white">
            <XIcon size={20} />
          </motion.button>
        </div>
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          {[{
          path: '/',
          label: 'Home',
          icon: <HomeIcon size={20} />
        }, {
          path: '/seeit',
          label: 'SeeIT',
          icon: <VideoIcon size={20} />
        }, {
          path: '/meetit',
          label: 'MeetIT',
          icon: <UsersIcon size={20} />
        }, {
          path: '/learnit',
          label: 'LearnIT',
          icon: <BookOpenIcon size={20} />
        }, {
          path: '/chatit',
          label: 'ChatIT',
          icon: <MessageCircleIcon size={20} />
        }].map((item, index) => <NavItem key={index} to={item.path} icon={item.icon} label={item.label} active={location.pathname === item.path || location.pathname.includes(item.path + '/')} onHover={() => setHoveredItem(item.path)} onLeave={() => setHoveredItem(null)} isHovered={hoveredItem === item.path} index={index} />)}
        </nav>
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="p-6 border-t border-white/10">
          <motion.div whileHover={{
          scale: 1.03
        }} className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
            <h4 className="font-medium text-sm text-white/90 mb-1">
              Bridging the gap
            </h4>
            <p className="text-xs text-white/70">
              Empowering communication for all
            </p>
            <motion.div initial={{
            width: '0%'
          }} animate={{
            width: '100%'
          }} transition={{
            delay: 1,
            duration: 1.5
          }} className="h-1 bg-gradient-to-r from-emerald-400 to-blue-500 mt-3 rounded-full" />
          </motion.div>
        </motion.div>
      </motion.aside>
    </>;
};
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onHover: () => void;
  onLeave: () => void;
  isHovered: boolean;
  index: number;
}
const NavItem: React.FC<NavItemProps> = ({
  to,
  icon,
  label,
  active,
  onHover,
  onLeave,
  isHovered,
  index
}) => {
  return <motion.div initial={{
    opacity: 0,
    x: -20
  }} animate={{
    opacity: 1,
    x: 0
  }} transition={{
    delay: 0.1 * index
  }}>
      <Link to={to} className="relative flex items-center space-x-3 px-4 py-3 rounded-xl transition-all" onMouseEnter={onHover} onMouseLeave={onLeave}>
        <motion.div initial={false} animate={{
        backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0)',
        scale: isHovered && !active ? 1.02 : 1
      }} className="absolute inset-0 rounded-xl" />
        {active && <motion.div layoutId="activeNavIndicator" className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg" initial={{
        borderRadius: 12
      }} />}
        <motion.div animate={{
        scale: isHovered || active ? 1.1 : 1,
        color: active ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.7)'
      }} transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }} className="relative z-10">
          {icon}
        </motion.div>
        <span className={`font-medium relative z-10 ${active ? 'text-white' : 'text-white/70'}`}>
          {label}
        </span>
        {active && <motion.div layoutId="activeNavBullet" className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full" />}
      </Link>
    </motion.div>;
};
export default Sidebar;