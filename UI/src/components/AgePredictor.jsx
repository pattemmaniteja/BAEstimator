import React, { useState } from 'react';
import { HealthForm } from './HealthForm';
import { calculateHealthResults } from '@/utils/healthcalculator';

const AgePredictor = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const payload = {
        age: formData.chronologicalAge,
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
        bmi: formData.bmi,
        resting_hr: formData.restingHeartRate,
        systolic_bp: formData.systolicBP,
        diastolic_bp: formData.diastolicBP,
        cholesterol: formData.cholesterolTotal,
        daily_steps: formData.dailySteps,
        family_history:
          formData.familyHeartDisease ||
          formData.familyDiabetes ||
          formData.familyCancer ? 1 : 0,
        water_intake: formData.waterIntake,
      };

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const mlResult = await response.json();

      const finalResults = calculateHealthResults(
        formData,
        mlResult.biological_age,
        mlResult.health_score
      );

      setResults(finalResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HealthForm onSubmit={handlePredict} />

      {loading && <p className="text-center mt-6">Calculating...</p>}
      {error && <p className="text-center text-red-500 mt-6">{error}</p>}
    </>
  );
};

export default AgePredictor;
