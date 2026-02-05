import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HealthFormData } from '@/types/health';
import { 
  User, Moon, Footprints, Heart, Dna, ChevronRight, ChevronLeft, 
  Activity, Droplet, Wine, Scale, Stethoscope, Users
} from 'lucide-react';

interface HealthFormProps {
  onSubmit: (data: HealthFormData) => void;
}

const steps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'lifestyle', title: 'Sleep & Lifestyle', icon: Moon },
  { id: 'habits', title: 'Habits', icon: Wine },
  { id: 'metrics', title: 'Health Metrics', icon: Heart },
  { id: 'family', title: 'Family History', icon: Users },
];

const defaultFormData: HealthFormData = {
  chronologicalAge: 35,
  gender: 'male',
  sleepHours: 7,
  sleepQuality: 'good',
  dailySteps: 6000,
  waterIntake: 2,
  smoker: false,
  alcoholFrequency: 'occasionally',
  exerciseFrequency: 'weekly',
  bmi: 24,
  restingHeartRate: 72,
  systolicBP: 120,
  diastolicBP: 80,
  cholesterolTotal: 190,
  bloodSugar: 95,
  familyHeartDisease: false,
  familyDiabetes: false,
  familyCancer: false,
  familyLongevity: false,
};

export function HealthForm({ onSubmit }: HealthFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<HealthFormData>(defaultFormData);

  const updateField = <K extends keyof HealthFormData>(key: K, value: HealthFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="age">Chronological Age</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[formData.chronologicalAge]}
                  onValueChange={([v]) => updateField('chronologicalAge', v)}
                  min={18}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-2xl font-display font-bold text-primary w-16 text-center">
                  {formData.chronologicalAge}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(v) => updateField('gender', v as any)}
                className="flex gap-4"
              >
                {['male', 'female', 'other'].map((g) => (
                  <div key={g} className="flex items-center space-x-2">
                    <RadioGroupItem value={g} id={g} />
                    <Label htmlFor={g} className="capitalize cursor-pointer">{g}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-primary" />
                Hours of Sleep (per night)
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[formData.sleepHours]}
                  onValueChange={([v]) => updateField('sleepHours', v)}
                  min={3}
                  max={12}
                  step={0.5}
                  className="flex-1"
                />
                <span className="text-2xl font-display font-bold text-primary w-16 text-center">
                  {formData.sleepHours}h
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Sleep Quality</Label>
              <Select 
                value={formData.sleepQuality} 
                onValueChange={(v) => updateField('sleepQuality', v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Footprints className="w-4 h-4 text-primary" />
                Daily Steps
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[formData.dailySteps]}
                  onValueChange={([v]) => updateField('dailySteps', v)}
                  min={1000}
                  max={20000}
                  step={500}
                  className="flex-1"
                />
                <span className="text-lg font-display font-bold text-primary w-20 text-center">
                  {formData.dailySteps.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-primary" />
                Water Intake (liters/day)
              </Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[formData.waterIntake]}
                  onValueChange={([v]) => updateField('waterIntake', v)}
                  min={0.5}
                  max={5}
                  step={0.25}
                  className="flex-1"
                />
                <span className="text-2xl font-display font-bold text-primary w-16 text-center">
                  {formData.waterIntake}L
                </span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <Label className="text-base">Smoker</Label>
                  <p className="text-sm text-muted-foreground">Do you currently smoke?</p>
                </div>
              </div>
              <Switch
                checked={formData.smoker}
                onCheckedChange={(v) => updateField('smoker', v)}
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-primary" />
                Alcohol Consumption
              </Label>
              <Select 
                value={formData.alcoholFrequency} 
                onValueChange={(v) => updateField('alcoholFrequency', v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="occasionally">Occasionally (1-2/month)</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Exercise Frequency
              </Label>
              <Select 
                value={formData.exerciseFrequency} 
                onValueChange={(v) => updateField('exerciseFrequency', v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="weekly">2-3 times/week</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  BMI
                </Label>
                <Input
                  type="number"
                  value={formData.bmi}
                  onChange={(e) => updateField('bmi', parseFloat(e.target.value) || 0)}
                  min={10}
                  max={50}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-primary" />
                  Resting Heart Rate
                </Label>
                <Input
                  type="number"
                  value={formData.restingHeartRate}
                  onChange={(e) => updateField('restingHeartRate', parseInt(e.target.value) || 0)}
                  min={40}
                  max={120}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-primary" />
                Blood Pressure (mmHg)
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Systolic</span>
                  <Input
                    type="number"
                    value={formData.systolicBP}
                    onChange={(e) => updateField('systolicBP', parseInt(e.target.value) || 0)}
                    min={80}
                    max={200}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Diastolic</span>
                  <Input
                    type="number"
                    value={formData.diastolicBP}
                    onChange={(e) => updateField('diastolicBP', parseInt(e.target.value) || 0)}
                    min={50}
                    max={130}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Cholesterol (mg/dL)</Label>
                <Input
                  type="number"
                  value={formData.cholesterolTotal}
                  onChange={(e) => updateField('cholesterolTotal', parseInt(e.target.value) || 0)}
                  min={100}
                  max={350}
                />
              </div>
              <div className="space-y-2">
                <Label>Fasting Blood Sugar (mg/dL)</Label>
                <Input
                  type="number"
                  value={formData.bloodSugar}
                  onChange={(e) => updateField('bloodSugar', parseInt(e.target.value) || 0)}
                  min={50}
                  max={300}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm mb-6">
              Family health history helps us understand genetic predispositions. Select all that apply 
              to immediate family members (parents, siblings).
            </p>

            {[
              { key: 'familyHeartDisease', label: 'Heart Disease', desc: 'Heart attacks, stroke, or cardiovascular issues' },
              { key: 'familyDiabetes', label: 'Diabetes', desc: 'Type 1 or Type 2 diabetes' },
              { key: 'familyCancer', label: 'Cancer', desc: 'Any form of cancer' },
              { key: 'familyLongevity', label: 'Longevity (80+ years)', desc: 'Family members who lived past 80' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <Label className="text-base">{item.label}</Label>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={formData[item.key as keyof HealthFormData] as boolean}
                  onCheckedChange={(v) => updateField(item.key as keyof HealthFormData, v as any)}
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="health-form" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Calculate Your Biological Age
          </h2>
          <p className="text-xl text-muted-foreground">
            Answer a few questions about your health and lifestyle to get your personalized assessment.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Progress steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${i <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                    i < currentStep
                      ? 'gradient-primary text-primary-foreground'
                      : i === currentStep
                      ? 'border-2 border-primary bg-primary/10'
                      : 'border-2 border-muted bg-background'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Form card */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {(() => {
                  const StepIcon = steps[currentStep].icon;
                  return <StepIcon className="w-6 h-6 text-primary" />;
                })()}
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {steps.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={nextStep}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button variant="hero" onClick={handleSubmit}>
                    Calculate My Biological Age
                    <Activity className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
