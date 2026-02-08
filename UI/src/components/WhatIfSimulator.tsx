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
  onSimulate: (changes: Partial<HealthFormData>) => Promise<HealthResults>;
}

export function WhatIfSimulator({
  baseData,
  currentResults,
  onSimulate,
}: WhatIfSimulatorProps) {
  const [changes, setChanges] = useState<Partial<HealthFormData>>({});
  const [simulatedResults, setSimulatedResults] = useState<HealthResults | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async <K extends keyof HealthFormData>(
    key: K,
    value: HealthFormData[K]
  ) => {
    const newChanges = { ...changes, [key]: value };
    setChanges(newChanges);

    setLoading(true);
    try {
      const results = await onSimulate(newChanges);
      setSimulatedResults(results);
    } finally {
      setLoading(false);
    }
  };

  const ageDiff = simulatedResults
    ? simulatedResults.biologicalAge - currentResults.biologicalAge
    : 0;

  const scoreDiff = simulatedResults
    ? simulatedResults.healthScore - currentResults.healthScore
    : 0;

  return (
    <Card variant="elevated">
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
          <div className="space-y-6">
            <div>
              <Label>Sleep Hours: {changes.sleepHours ?? baseData.sleepHours}h</Label>
              <Slider
                value={[changes.sleepHours ?? baseData.sleepHours]}
                onValueChange={([v]) => handleChange('sleepHours', v)}
                min={3}
                max={10}
                step={0.5}
              />
            </div>

            <div>
              <Label>Daily Steps: {(changes.dailySteps ?? baseData.dailySteps).toLocaleString()}</Label>
              <Slider
                value={[changes.dailySteps ?? baseData.dailySteps]}
                onValueChange={([v]) => handleChange('dailySteps', v)}
                min={1000}
                max={20000}
                step={500}
              />
            </div>

            <div>
              <Label>Water Intake: {changes.waterIntake ?? baseData.waterIntake}L</Label>
              <Slider
                value={[changes.waterIntake ?? baseData.waterIntake]}
                onValueChange={([v]) => handleChange('waterIntake', v)}
                min={0.5}
                max={5}
                step={0.25}
              />
            </div>

            <div>
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

          <div className="flex flex-col justify-center">
            {loading ? (
              <p className="text-center text-muted-foreground">Simulating...</p>
            ) : simulatedResults ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="text-center p-6 rounded-2xl bg-accent/50">
                  <p className="text-sm text-muted-foreground">Projected Biological Age</p>
                  <div className="flex justify-center gap-4">
                    <span>{currentResults.biologicalAge}</span>
                    <ArrowRight />
                    <span className="font-bold text-gradient">{simulatedResults.biologicalAge}</span>
                  </div>
                  {ageDiff !== 0 && (
                    <div className={ageDiff < 0 ? 'text-health-excellent' : 'text-health-risk'}>
                      {ageDiff < 0 ? <TrendingDown /> : <TrendingUp />}
                      {Math.abs(ageDiff)} years
                    </div>
                  )}
                </div>

                <div className="text-center p-6 rounded-2xl bg-accent/50">
                  <p className="text-sm text-muted-foreground">Projected Health Score</p>
                  <div className="flex justify-center gap-4">
                    <span>{currentResults.healthScore}</span>
                    <ArrowRight />
                    <span className="font-bold text-gradient">{simulatedResults.healthScore}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <p className="text-center text-muted-foreground">
                Adjust sliders to simulate changes
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
