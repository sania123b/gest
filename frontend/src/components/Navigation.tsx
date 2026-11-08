import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { VideoIcon, UsersIcon, BookOpenIcon, InfoIcon, HomeIcon, MessageCircleIcon } from 'lucide-react';
const Navigation = () => {
  const location = useLocation();
  const navItems = [{
    path: '/',
    label: 'Home',
    icon: <HomeIcon size={20} />,
    color: 'from-indigo-400/90 to-purple-400/90'
  }, {
    path: '/seeit',
    label: 'SeeIT',
    icon: <VideoIcon size={20} />,
    color: 'from-emerald-400/90 to-teal-400/90'
  }, {
    path: '/meetit',
    label: 'MeetIT',
    icon: <UsersIcon size={20} />,
    color: 'from-blue-400/90 to-cyan-400/90'
  }, {
    path: '/learnit',
    label: 'LearnIT',
    icon: <BookOpenIcon size={20} />,
    color: 'from-amber-400/90 to-orange-400/90'
  }, {
    path: '/chatit',
    label: 'ChatIT',
    icon: <MessageCircleIcon size={20} />,
    color: 'from-violet-400/90 to-fuchsia-400/90'
  }];
  return <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-4 py-3 bg-white/60 backdrop-blur-lg shadow-lg rounded-2xl w-11/12 max-w-7xl border border-white/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <motion.div whileHover={{
          rotate: [0, -10, 10, -10, 0],
          scale: 1.1
        }} transition={{
          duration: 0.5
        }} className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/90 to-blue-400/90 flex items-center justify-center shadow-lg shadow-indigo-500/20">
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
        }} className="text-xl font-bold text-gray-800">
            Gestura
          </motion.span>
        </Link>
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map(item => <NavItem key={item.path} path={item.path} label={item.label} icon={item.icon} isActive={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)} colorClass={item.color} />)}
        </nav>
        <div className="md:hidden flex items-center">
          <select onChange={e => window.location.href = e.target.value} value={location.pathname} className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-lg px-3 py-2 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400">
            {navItems.map(item => <option key={item.path} value={item.path}>
                {item.label}
              </option>)}
          </select>
        </div>
      </div>
    </div>;
};
interface NavItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  colorClass: string;
}
const NavItem: React.FC<NavItemProps> = ({
  path,
  label,
  icon,
  isActive,
  colorClass
}) => {
  return <Link to={path} className="relative">
      <motion.div whileHover={{
      y: -2,
      scale: 1.05
    }} className={`px-4 py-2 rounded-xl flex items-center space-x-1 ${isActive ? `bg-gradient-to-r ${colorClass} text-white shadow-md` : 'text-gray-700 hover:bg-white/80 hover:shadow-sm'}`}>
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
      </motion.div>
      {isActive && <motion.div layoutId="activeNavIndicator" className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />}
    </Link>;
};
export default Navigation;