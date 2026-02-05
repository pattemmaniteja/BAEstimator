import { useState, useRef } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { AgeExplainer } from '@/components/AgeExplainer';
import { HealthForm } from '@/components/HealthForm';
import { HealthResults } from '@/components/HealthResults';
import { HealthChatbot } from '@/components/HealthChatbot';
import { DisclaimerSection } from '@/components/DisclaimerSection';
import { Footer } from '@/components/Footer';
import { HealthFormData, HealthResults as HealthResultsType } from '@/types/health';
import { calculateHealthResults, simulateWhatIf } from '@/utils/healthCalculator';
import { generateHealthReport } from '@/utils/pdfGenerator';

const Index = () => {
  const [formData, setFormData] = useState<HealthFormData | null>(null);
  const [results, setResults] = useState<HealthResultsType | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (formData: HealthFormData) => {
  // 1. MAP Frontend Data to Backend Format
  const backendData = {
    age: formData.chronologicalAge,
    sleep_hours: formData.sleepHours,
    // Map 'poor'->0, 'fair'->1, 'good'->2, 'excellent'->2
    sleep_quality: ['poor', 'fair', 'good', 'excellent'].indexOf(formData.sleepQuality) > 1 ? 2 : ['poor', 'fair', 'good', 'excellent'].indexOf(formData.sleepQuality),
    // Map boolean to 0 or 1
    smoker: formData.smoker ? 1 : 0,
    // Map frequency to 0 or 1 (assuming 'never' is 0, others 1)
    alcohol: formData.alcoholFrequency === 'never' ? 0 : 1,
    bmi: formData.bmi,
    resting_hr: formData.restingHeartRate,
    systolic_bp: formData.systolicBP,
    diastolic_bp: formData.diastolicBP,
    cholesterol: formData.cholesterolTotal,
    daily_steps: formData.dailySteps,
    // Combine family history booleans into one flag
    family_history: (formData.familyHeartDisease || formData.familyDiabetes || formData.familyCancer) ? 1 : 0,
    water_intake: formData.waterIntake
  };

  try {
    // 2. SEND to correct URL (http://localhost:8000/predict)
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) throw new Error('Prediction failed');
    
    const apiResult = await response.json();
    console.log("Prediction Result:", apiResult);

    // Calculate local results to get rich data (metrics, recommendations)
    const localResults = calculateHealthResults(formData);

    // Merge API results with local structure
    const finalResults: HealthResultsType = {
      ...localResults,
      biologicalAge: apiResult.biological_age,
      healthScore: apiResult.health_score,
      ageDifference: apiResult.age_acceleration,
      riskZone: apiResult.health_score >= 8 ? 'low' : apiResult.health_score >= 5 ? 'medium' : 'high'
    };

    setFormData(formData);
    setResults(finalResults);
  } catch (error) {
    console.error("Error connecting to backend:", error);
    // Fallback to local calculation if backend fails
    const localResults = calculateHealthResults(formData);
    setFormData(formData);
    setResults(localResults);
  }
    
    // Scroll to results after a short delay
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  const handleSimulate = (changes: Partial<HealthFormData>): HealthResultsType => {
    if (formData) {
      return simulateWhatIf(formData, changes);
    }
    return results!;
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
