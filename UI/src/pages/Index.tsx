import { useState, useRef } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { AgeExplainer } from '@/components/AgeExplainer';
import { HealthForm } from '@/components/HealthForm';
import { HealthResults } from '@/components/HealthResults';
import { HealthChatbot } from '@/components/HealthChatbot';
import { DisclaimerSection } from '@/components/DisclaimerSection';
import { Footer } from '@/components/Footer';
import { HealthFormData, HealthResults as HealthResultsType } from '@/types/health';
import { calculateHealthResults } from '@/utils/healthCalculator';
import { generateHealthReport } from '@/utils/pdfGenerator';

const Index = () => {
  const [formData, setFormData] = useState<HealthFormData | null>(null);
  const [results, setResults] = useState<HealthResultsType | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ MAIN PREDICT FUNCTION (MERGED)
  const handleFormSubmit = async (formData: HealthFormData) => {
    try {
      const payload = {
        age: formData.chronologicalAge,
        diet_quality:
          formData.dietQuality === 'poor' ? 0 :
          formData.dietQuality === 'good' ? 1 : 2,
        stress_level:
          formData.stressLevel === 'low' ? 0 :
          formData.stressLevel === 'medium' ? 1 : 2,
        sleep_hours: formData.sleepHours,
        sleep_quality:
          formData.sleepQuality === 'poor' ? 0 :
          formData.sleepQuality === 'fair' ? 1 :
          formData.sleepQuality === 'good' ? 2 : 3,
        smoker: formData.smoker ? 1 : 0,
        alcohol:
          formData.alcoholFrequency === 'never' ? 0 :
          formData.alcoholFrequency === 'occasionally' ? 1 :
          formData.alcoholFrequency === 'weekly' ? 2 : 3,
        exercise_minutes: formData.exerciseTime,
        bmi: formData.bmi,
        resting_hr: formData.restingHeartRate,
        systolic_bp: formData.systolicBP,
        diastolic_bp: formData.diastolicBP,
        cholesterol: formData.cholesterolTotal,
        glucose: formData.bloodSugar,
        oxygen_saturation: formData.oxygenSaturation,
        daily_steps: formData.dailySteps,
        family_history:
          formData.familyHeartDisease ||
          formData.familyDiabetes ||
          formData.familyCancer ? 1 : 0,
        water_intake: formData.waterIntake,
        inflammation_index: 0
      };

      const response = await fetch('http://13.201.33.196:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Prediction failed');

      const ml = await response.json();

      const finalResults: HealthResultsType = calculateHealthResults(
        formData,
        ml.biological_age,
        ml.health_score
      );

      setFormData(formData);
      setResults(finalResults);

    } catch (error) {
      console.error(error.message);
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // ✅ WHAT-IF SIMULATION (ASYNC)
  const handleSimulate = async (
    changes: Partial<HealthFormData>
  ): Promise<HealthResultsType> => {
    if (!formData) return results!;

    const modified = { ...formData, ...changes };

    const payload = {
      age: modified.chronologicalAge,
      diet_quality:
        modified.dietQuality === 'poor' ? 0 :
        modified.dietQuality === 'good' ? 1 : 2,
      stress_level:
        modified.stressLevel === 'low' ? 0 :
        modified.stressLevel === 'medium' ? 1 : 2,
      sleep_hours: modified.sleepHours,
      sleep_quality:
        modified.sleepQuality === 'poor' ? 0 :
        modified.sleepQuality === 'fair' ? 1 :
        modified.sleepQuality === 'good' ? 2 : 3,
      smoker: modified.smoker ? 1 : 0,
      alcohol:
        modified.alcoholFrequency === 'never' ? 0 :
        modified.alcoholFrequency === 'occasionally' ? 1 :
        modified.alcoholFrequency === 'weekly' ? 2 : 3,
      exercise_minutes: modified.exerciseTime,
      bmi: modified.bmi,
      resting_hr: modified.restingHeartRate,
      systolic_bp: modified.systolicBP,
      diastolic_bp: modified.diastolicBP,
      cholesterol: modified.cholesterolTotal,
      glucose: modified.bloodSugar,
      oxygen_saturation: modified.oxygenSaturation,
      daily_steps: modified.dailySteps,
      family_history:
        modified.familyHeartDisease ||
        modified.familyDiabetes ||
        modified.familyCancer ? 1 : 0,
      water_intake: modified.waterIntake,
      inflammation_index: 0
    };

    const response = await fetch('http://13.201.33.196:8000/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error('Simulation failed');

    const ml = await response.json();

    return {
      biologicalAge: ml.biological_age,
      healthScore: ml.health_score,
      ageDifference: ml.age_acceleration,
      riskZone:
        ml.health_score >= 7 ? 'low' :
        ml.health_score >= 4 ? 'medium' : 'high',
      recommendations: [],
      metrics: [],
    };
  };

  const handleReset = () => {
    setFormData(null);
    setResults(null);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = () => {
    if (formData && results) {
      generateHealthReport(formData, results);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onGetStarted={handleGetStarted} />
      <AgeExplainer />

      <div ref={formRef}>
        <HealthForm onSubmit={handleFormSubmit} />
      </div>

      {results && formData && (
        <div ref={resultsRef}>
          <HealthResults
            results={results}
            formData={formData}
            onReset={handleReset}
            onDownload={handleDownload}
            onSimulate={handleSimulate}
          />
        </div>
      )}

      <DisclaimerSection />
      <Footer />
      <HealthChatbot />
    </div>
  );
};

export default Index;