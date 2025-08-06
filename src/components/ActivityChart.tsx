import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
  data: Array<{
    day: string;
    activities: number;
    xp: number;
    time: number;
  }>;
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              Activities: {payload[0]?.value}
            </p>
            <p className="text-sm text-green-600">
              XP Earned: {payload[1]?.value}
            </p>
            <p className="text-sm text-purple-600">
              Time Spent: {payload[2]?.value} min
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="activities" fill="#3B82F6" name="Activities" />
          <Bar dataKey="xp" fill="#10B981" name="XP" />
          <Bar dataKey="time" fill="#8B5CF6" name="Time (min)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 