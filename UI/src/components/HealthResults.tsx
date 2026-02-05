import { motion } from 'framer-motion';
import { HealthResults as HealthResultsType, HealthFormData } from '@/types/health';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HealthGauge } from './HealthGauge';
import { AgeComparison } from './AgeComparison';
import { RecommendationCards } from './RecommendationCards';
import { MetricsGrid } from './MetricsGrid';
import { WhatIfSimulator } from './WhatIfSimulator';
import { Button } from '@/components/ui/button';
import { Download, RotateCcw, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

interface HealthResultsProps {
  results: HealthResultsType;
  formData: HealthFormData;
  onReset: () => void;
  onDownload: () => void;
  onSimulate: (changes: Partial<HealthFormData>) => HealthResultsType;
}

export function HealthResults({ results, formData, onReset, onDownload, onSimulate }: HealthResultsProps) {
  const getRiskZoneColor = (zone: string) => {
    switch (zone) {
      case 'low': return 'text-health-excellent bg-health-excellent/10';
      case 'medium': return 'text-health-warning bg-health-warning/10';
      case 'high': return 'text-health-risk bg-health-risk/10';
      default: return '';
    }
  };

  const getRiskZoneIcon = (zone: string) => {
    switch (zone) {
      case 'low': return Shield;
      case 'medium': return TrendingUp;
      case 'high': return AlertTriangle;
      default: return Shield;
    }
  };

  const RiskIcon = getRiskZoneIcon(results.riskZone);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Your Health Assessment
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Based on your health data, here's a comprehensive analysis of your biological age and longevity factors.
          </p>
        </motion.div>

        {/* Main results grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Biological Age Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="feature" className="h-full">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg text-muted-foreground mb-4">Your Biological Age</h3>
                <div className="relative inline-block">
                  <span className="text-7xl md:text-8xl font-display font-bold text-gradient">
                    {results.biologicalAge}
                  </span>
                  <span className="text-2xl text-muted-foreground ml-2">years</span>
                </div>
                <div className="mt-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    results.ageDifference < 0 
                      ? 'bg-health-excellent/10 text-health-excellent' 
                      : results.ageDifference > 0 
                      ? 'bg-health-risk/10 text-health-risk'
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {results.ageDifference < 0 
                      ? `${Math.abs(results.ageDifference)} years younger` 
                      : results.ageDifference > 0 
                      ? `${results.ageDifference} years older`
                      : 'Same as chronological age'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health Score Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="feature" className="h-full">
              <CardContent className="p-8">
                <h3 className="text-lg text-muted-foreground mb-4 text-center">Health Score</h3>
                <HealthGauge score={results.healthScore} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Risk Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="feature" className="h-full">
              <CardContent className="p-8 text-center">
                <h3 className="text-lg text-muted-foreground mb-4">Longevity Risk Zone</h3>
                <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${getRiskZoneColor(results.riskZone)}`}>
                  <RiskIcon className="w-8 h-8" />
                  <span className="text-3xl font-display font-bold capitalize">{results.riskZone}</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {results.riskZone === 'low' && 'Your health indicators suggest excellent longevity prospects.'}
                  {results.riskZone === 'medium' && 'Some areas need attention to optimize your healthspan.'}
                  {results.riskZone === 'high' && 'Consider lifestyle changes to improve your health trajectory.'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Age Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Age Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <AgeComparison 
                chronologicalAge={formData.chronologicalAge} 
                biologicalAge={results.biologicalAge} 
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="font-display text-2xl font-bold mb-6">Health Metrics Analysis</h3>
          <MetricsGrid metrics={results.metrics} />
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h3 className="font-display text-2xl font-bold mb-6">Personalized Recommendations</h3>
          <RecommendationCards recommendations={results.recommendations} />
        </motion.div>

        {/* What-If Simulator */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <WhatIfSimulator baseData={formData} onSimulate={onSimulate} currentResults={results} />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="hero" size="lg" onClick={onDownload}>
            <Download className="w-5 h-5 mr-2" />
            Download Health Report (PDF)
          </Button>
          <Button variant="outline" size="lg" onClick={onReset}>
            <RotateCcw className="w-5 h-5 mr-2" />
            Start New Assessment
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
