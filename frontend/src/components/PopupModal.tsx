import React, { useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface PopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  useEffect(() => {
    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  return <AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.2
      }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{
        scale: 0.9,
        opacity: 0,
        y: 20
      }} animate={{
        scale: 1,
        opacity: 1,
        y: 0
      }} exit={{
        scale: 0.95,
        opacity: 0,
        y: 10
      }} transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300
      }} className="relative w-full max-w-lg max-h-[90vh] overflow-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-100">
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.2
        }} className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-indigo-100 bg-white/90 backdrop-blur-md">
              <h3 className="text-xl font-semibold text-indigo-800">{title}</h3>
              <motion.button whileHover={{
            scale: 1.1,
            rotate: 90
          }} whileTap={{
            scale: 0.9
          }} onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
                <XIcon size={20} />
              </motion.button>
            </motion.div>
            <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.3
        }} className="p-5 sm:p-6">
              {children}
            </motion.div>
            <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.4
        }} className="sticky bottom-0 flex justify-end p-5 border-t border-indigo-100 bg-white/90 backdrop-blur-md">
              <motion.button whileHover={{
            scale: 1.05,
            backgroundColor: '#4f46e5'
          }} whileTap={{
            scale: 0.95
          }} onClick={onClose} className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/30">
                Got it
              </motion.button>
            </motion.div>
          </motion.div>
        </div>}
    </AnimatePresence>;
};
export default PopupModal;