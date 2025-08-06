import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function StatsCard({ title, value, icon: Icon, color, bgColor }: StatsCardProps) {
  return (
    <div className={`flex items-center space-x-2 ${bgColor} px-3 py-1 rounded-full`}>
      <Icon className={`w-4 h-4 ${color}`} />
      <span className={`text-sm font-medium ${color.replace('text-', 'text-').replace('-600', '-800')}`}>
        {title}: {value}
      </span>
    </div>
  );
} 