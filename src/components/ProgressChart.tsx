import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ProgressChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    icon: string;
  }>;
}

export default function ProgressChart({ data }: ProgressChartProps) {
  const COLORS = data.map(item => item.color.replace('bg-', '').replace('-500', ''));

  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ payload: { name: string; value: number; icon: string } }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">{data.icon}</span>
            <span className="font-medium text-gray-900">{data.name}</span>
          </div>
          <p className="text-sm text-gray-600">Progress: {data.value}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: {
    payload?: Array<{ color: string; value: string }>;
  }) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 