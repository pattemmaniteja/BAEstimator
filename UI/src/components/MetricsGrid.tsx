import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MetricAnalysis } from '@/types/health';
import { 
  Moon, Activity, Scale, Heart, Stethoscope, Droplets, Cookie, Droplet 
} from 'lucide-react';

interface MetricsGridProps {
  metrics: MetricAnalysis[];
}

const iconMap: Record<string, any> = {
  'Sleep Quality': Moon,
  'Daily Activity': Activity,
  'BMI': Scale,
  'Resting Heart Rate': Heart,
  'Blood Pressure': Stethoscope,
  'Total Cholesterol': Droplets,
  'Fasting Blood Sugar': Cookie,
  'Daily Hydration': Droplet,
};

const statusColors: Record<string, string> = {
  excellent: 'bg-health-excellent/10 text-health-excellent border-health-excellent/30',
  good: 'bg-health-good/10 text-health-good border-health-good/30',
  moderate: 'bg-health-moderate/10 text-health-moderate border-health-moderate/30',
  warning: 'bg-health-warning/10 text-health-warning border-health-warning/30',
  risk: 'bg-health-risk/10 text-health-risk border-health-risk/30',
};

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = iconMap[metric.name] || Activity;
        
        return (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="metric" className="h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusColors[metric.status]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${statusColors[metric.status]}`}>
                    {metric.status}
                  </span>
                </div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">{metric.name}</h4>
                <p className="text-2xl font-display font-bold">
                  {typeof metric.value === 'number' 
                    ? metric.value.toLocaleString() 
                    : metric.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Optimal: {metric.optimal}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
