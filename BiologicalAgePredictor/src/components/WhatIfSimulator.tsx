import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { HealthFormData, HealthResults } from '@/types/health';
import { Sparkles, ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';

interface WhatIfSimulatorProps {
  baseData: HealthFormData;
  currentResults: HealthResults;
  onSimulate: (changes: Partial<HealthFormData>) => HealthResults;
}

export function WhatIfSimulator({ baseData, currentResults, onSimulate }: WhatIfSimulatorProps) {
  const [changes, setChanges] = useState<Partial<HealthFormData>>({});
  const [simulatedResults, setSimulatedResults] = useState<HealthResults | null>(null);

  const handleChange = <K extends keyof HealthFormData>(key: K, value: HealthFormData[K]) => {
    const newChanges = { ...changes, [key]: value };
    setChanges(newChanges);
    const results = onSimulate(newChanges);
    setSimulatedResults(results);
  };

  const ageDiff = simulatedResults 
    ? simulatedResults.biologicalAge - currentResults.biologicalAge 
    : 0;

  const scoreDiff = simulatedResults 
    ? simulatedResults.healthScore - currentResults.healthScore 
    : 0;

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="bg-accent/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>What-If Scenario Simulator</CardTitle>
            <CardDescription>
              See how lifestyle changes could affect your biological age
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Sleep Hours: {changes.sleepHours ?? baseData.sleepHours}h</Label>
              <Slider
                value={[changes.sleepHours ?? baseData.sleepHours]}
                onValueChange={([v]) => handleChange('sleepHours', v)}
                min={3}
                max={10}
                step={0.5}
              />
            </div>

            <div className="space-y-3">
              <Label>Daily Steps: {(changes.dailySteps ?? baseData.dailySteps).toLocaleString()}</Label>
              <Slider
                value={[changes.dailySteps ?? baseData.dailySteps]}
                onValueChange={([v]) => handleChange('dailySteps', v)}
                min={1000}
                max={20000}
                step={500}
              />
            </div>

            <div className="space-y-3">
              <Label>Water Intake: {changes.waterIntake ?? baseData.waterIntake}L</Label>
              <Slider
                value={[changes.waterIntake ?? baseData.waterIntake]}
                onValueChange={([v]) => handleChange('waterIntake', v)}
                min={0.5}
                max={5}
                step={0.25}
              />
            </div>

            <div className="space-y-3">
              <Label>BMI: {changes.bmi ?? baseData.bmi}</Label>
              <Slider
                value={[changes.bmi ?? baseData.bmi]}
                onValueChange={([v]) => handleChange('bmi', v)}
                min={15}
                max={40}
                step={0.5}
              />
            </div>

            {baseData.smoker && (
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <Label>Quit Smoking</Label>
                <Switch
                  checked={changes.smoker === false}
                  onCheckedChange={(v) => handleChange('smoker', !v)}
                />
              </div>
            )}
          </div>

          {/* Results comparison */}
          <div className="flex flex-col justify-center">
            {simulatedResults ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="text-center p-6 rounded-2xl bg-accent/50">
                  <p className="text-sm text-muted-foreground mb-2">Projected Biological Age</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-3xl font-display font-bold">{currentResults.biologicalAge}</span>
                    <ArrowRight className="w-6 h-6 text-primary" />
                    <span className="text-4xl font-display font-bold text-gradient">
                      {simulatedResults.biologicalAge}
                    </span>
                  </div>
                  {ageDiff !== 0 && (
                    <div className={`flex items-center justify-center gap-2 mt-3 ${ageDiff < 0 ? 'text-health-excellent' : 'text-health-risk'}`}>
                      {ageDiff < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      <span className="font-medium">
                        {ageDiff < 0 ? `${Math.abs(ageDiff)} years younger` : `${ageDiff} years older`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center p-6 rounded-2xl bg-accent/50">
                  <p className="text-sm text-muted-foreground mb-2">Projected Health Score</p>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-3xl font-display font-bold">{currentResults.healthScore}</span>
                    <ArrowRight className="w-6 h-6 text-primary" />
                    <span className="text-4xl font-display font-bold text-gradient">
                      {simulatedResults.healthScore}
                    </span>
                  </div>
                  {scoreDiff !== 0 && (
                    <div className={`flex items-center justify-center gap-2 mt-3 ${scoreDiff > 0 ? 'text-health-excellent' : 'text-health-risk'}`}>
                      {scoreDiff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-medium">
                        {scoreDiff > 0 ? `+${scoreDiff.toFixed(1)} points` : `${scoreDiff.toFixed(1)} points`}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-muted-foreground p-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Adjust the sliders to see how changes would affect your biological age</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
