import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Recommendation } from '@/types/health';
import { 
  Moon, Activity, Apple, Ban, Stethoscope, Users, TrendingUp, Wine, Droplet, Scale, Heart, Cookie, Droplets
} from 'lucide-react';

interface RecommendationCardsProps {
  recommendations: Recommendation[];
}

const iconMap: Record<string, any> = {
  Moon,
  Activity,
  Apple,
  Ban,
  Stethoscope,
  Users,
  Wine,
  Droplet,
  Scale,
  Heart,
  Cookie,
  Droplets,
};

const impactColors: Record<string, string> = {
  high: 'bg-primary text-primary-foreground',
  medium: 'bg-accent text-accent-foreground',
  low: 'bg-muted text-muted-foreground',
};

const categoryColors: Record<string, string> = {
  sleep: 'bg-indigo-100 text-indigo-700',
  exercise: 'bg-emerald-100 text-emerald-700',
  nutrition: 'bg-amber-100 text-amber-700',
  habits: 'bg-rose-100 text-rose-700',
  medical: 'bg-blue-100 text-blue-700',
};

export function RecommendationCards({ recommendations }: RecommendationCardsProps) {
  if (recommendations.length === 0) {
    return (
      <Card className="bg-health-excellent/5 border-health-excellent/20">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-health-excellent/10 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-health-excellent" />
          </div>
          <h3 className="font-display text-xl font-semibold mb-2">Excellent Health Profile!</h3>
          <p className="text-muted-foreground">
            Your health metrics are all within optimal ranges. Keep up the great work!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((rec, index) => {
        const Icon = iconMap[rec.icon] || Activity;
        
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="elevated" className="h-full hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${categoryColors[rec.category]}`}>
                      {rec.category}
                    </span>
                  </div>
                </div>
                <h4 className="font-display text-lg font-semibold mb-2">{rec.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{rec.description}</p>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Impact:</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${impactColors[rec.impact]}`}>
                      {rec.impact}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
