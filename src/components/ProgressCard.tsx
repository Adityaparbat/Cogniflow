import { motion } from 'framer-motion';

interface ProgressCardProps {
  title: string;
  progress: number;
  icon: string;
  color: string;
  onClick?: () => void;
}

export default function ProgressCard({ title, progress, icon, color, onClick }: ProgressCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border cursor-pointer transition-all hover:shadow-lg hover:border-blue-200"
      onClick={onClick}
    >
      <div className="text-2xl sm:text-3xl mb-2 hover:scale-110 transition-transform duration-300">{icon}</div>
      <h4 className="font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base">{title}</h4>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div 
          className={`h-2 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{progress}% complete</p>
    </motion.div>
  );
} 