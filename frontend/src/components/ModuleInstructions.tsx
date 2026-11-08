import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from 'lucide-react';
interface ModuleInstructionsProps {
  title: string;
  description: string;
  features: string[];
  colorGradient: string;
}
const ModuleInstructions: React.FC<ModuleInstructionsProps> = ({
  title,
  description,
  features,
  colorGradient
}) => {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="relative mb-8">
      <div className={`absolute -inset-1 bg-gradient-to-r ${colorGradient} rounded-2xl blur-sm opacity-50`}></div>
      <div className="relative bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{description}</p>
        <div className="rounded-lg overflow-hidden border border-gray-200 mb-6">
          <div className={`bg-gradient-to-r ${colorGradient} bg-opacity-10 p-3`}>
            <h4 className="font-medium text-gray-800">Key Features:</h4>
          </div>
          <ul className="p-3 space-y-2">
            {features.map((feature, index) => <li key={index} className="flex items-start">
                <CheckCircleIcon size={18} className="mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>)}
          </ul>
        </div>
      </div>
    </motion.div>;
};
export default ModuleInstructions;