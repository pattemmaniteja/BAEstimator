import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { motion } from 'framer-motion';

interface AgeComparisonProps {
  chronologicalAge: number;
  biologicalAge: number;
}

export function AgeComparison({ chronologicalAge, biologicalAge }: AgeComparisonProps) {
  const data = [
    { name: 'Chronological Age', age: chronologicalAge, fill: 'hsl(var(--muted-foreground))' },
    { name: 'Biological Age', age: biologicalAge, fill: biologicalAge <= chronologicalAge ? 'hsl(var(--health-excellent))' : 'hsl(var(--health-risk))' },
  ];

  const maxAge = Math.max(chronologicalAge, biologicalAge) + 10;
  const difference = biologicalAge - chronologicalAge;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-48"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 60, left: 20, bottom: 20 }}>
          <XAxis type="number" domain={[0, maxAge]} hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 14 }}
            width={140}
          />
          <Bar dataKey="age" radius={[0, 8, 8, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList 
              dataKey="age" 
              position="right" 
              formatter={(value: number) => `${value} years`}
              style={{ fill: 'hsl(var(--foreground))', fontWeight: 600, fontSize: 14 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="text-center mt-4">
        <p className={`text-lg font-medium ${difference < 0 ? 'text-health-excellent' : difference > 0 ? 'text-health-risk' : 'text-muted-foreground'}`}>
          {difference < 0 
            ? `Your body is ${Math.abs(difference)} years younger than your calendar age! 🎉` 
            : difference > 0 
            ? `Your body is aging ${difference} years faster than average.`
            : 'Your biological age matches your chronological age.'}
        </p>
      </div>
    </motion.div>
  );
}
