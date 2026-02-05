import { motion } from 'framer-motion';

interface HealthGaugeProps {
  score: number; // 0-10
}

export function HealthGauge({ score }: HealthGaugeProps) {
  const percentage = (score / 10) * 100;
  const strokeDashoffset = 283 - (283 * percentage) / 100;
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'hsl(var(--health-excellent))';
    if (score >= 6) return 'hsl(var(--health-good))';
    if (score >= 4) return 'hsl(var(--health-moderate))';
    if (score >= 2) return 'hsl(var(--health-warning))';
    return 'hsl(var(--health-risk))';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    if (score >= 2) return 'Needs Work';
    return 'Critical';
  };

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="283"
          initial={{ strokeDashoffset: 283 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-4xl font-display font-bold"
          style={{ color: getScoreColor(score) }}
        >
          {score.toFixed(1)}
        </motion.span>
        <span className="text-sm text-muted-foreground">out of 10</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs font-medium mt-1"
          style={{ color: getScoreColor(score) }}
        >
          {getScoreLabel(score)}
        </motion.span>
      </div>
    </div>
  );
}
