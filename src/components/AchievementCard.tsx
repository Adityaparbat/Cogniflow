import { motion } from 'framer-motion';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

export default function AchievementCard({ title, description, icon, index }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </motion.div>
  );
} 