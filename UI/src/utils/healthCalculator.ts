import { HealthFormData, HealthResults, Recommendation, MetricAnalysis } from '@/types/health';
export function calculateHealthResults(
  data: HealthFormData,
  biologicalAge: number,
  healthScore: number
): HealthResults {
  const recommendations: Recommendation[] = [];
  const metrics: MetricAnalysis[] = [];

  const sleepScore = analyzeSleep(data.sleepHours, data.sleepQuality);
  metrics.push(sleepScore.metric);
  if (sleepScore.recommendation) recommendations.push(sleepScore.recommendation);

  const exerciseScore = analyzeExercise(data.dailySteps, data.exerciseFrequency);
  metrics.push(exerciseScore.metric);
  if (exerciseScore.recommendation) recommendations.push(exerciseScore.recommendation);

  const habitsScore = analyzeHabits(data.smoker, data.alcoholFrequency);
  if (habitsScore.recommendation) recommendations.push(habitsScore.recommendation);

  const bmiScore = analyzeBMI(data.bmi);
  metrics.push(bmiScore.metric);
  if (bmiScore.recommendation) recommendations.push(bmiScore.recommendation);

  const heartScore = analyzeHeartRate(data.restingHeartRate);
  metrics.push(heartScore.metric);
  if (heartScore.recommendation) recommendations.push(heartScore.recommendation);

  const bpScore = analyzeBloodPressure(data.systolicBP, data.diastolicBP);
  metrics.push(bpScore.metric);
  if (bpScore.recommendation) recommendations.push(bpScore.recommendation);

  const cholesterolScore = analyzeCholesterol(data.cholesterolTotal);
  metrics.push(cholesterolScore.metric);
  if (cholesterolScore.recommendation) recommendations.push(cholesterolScore.recommendation);

  const bloodSugarScore = analyzeBloodSugar(data.bloodSugar);
  metrics.push(bloodSugarScore.metric);
  if (bloodSugarScore.recommendation) recommendations.push(bloodSugarScore.recommendation);

  const hydrationScore = analyzeHydration(data.waterIntake);
  metrics.push(hydrationScore.metric);
  if (hydrationScore.recommendation) recommendations.push(hydrationScore.recommendation);

  const familyScore = analyzeFamilyHistory(data);
  if (familyScore.recommendation) recommendations.push(familyScore.recommendation);

  const ageDifference = biologicalAge - data.chronologicalAge;

  let riskZone: 'low' | 'medium' | 'high';
  if (healthScore >= 7) riskZone = 'low';
  else if (healthScore >= 4) riskZone = 'medium';
  else riskZone = 'high';

  return {
    biologicalAge,
    healthScore,
    riskZone,
    ageDifference,
    recommendations: recommendations.slice(0, 5),
    metrics,
  };
}


function analyzeSleep(hours: number, quality: string) {
  let modifier = 0;
  let status: 'excellent' | 'good' | 'moderate' | 'warning' | 'risk';
  let recommendation: Recommendation | null = null;

  if (hours >= 7 && hours <= 9 && quality === 'excellent') {
    modifier = -2;
    status = 'excellent';
  } else if (hours >= 6 && hours <= 9 && (quality === 'good' || quality === 'excellent')) {
    modifier = -1;
    status = 'good';
  } else if (hours >= 5 && hours <= 10) {
    modifier = 1;
    status = 'moderate';
    recommendation = {
      id: 'sleep-1',
      category: 'sleep',
      title: 'Optimize Your Sleep',
      description: 'Aim for 7-9 hours of quality sleep. Consider establishing a consistent bedtime routine.',
      impact: 'high',
      icon: 'Moon',
    };
  } else {
    modifier = 3;
    status = 'warning';
    recommendation = {
      id: 'sleep-2',
      category: 'sleep',
      title: 'Critical: Improve Sleep Habits',
      description: 'Your sleep duration is far from optimal. Poor sleep significantly accelerates aging.',
      impact: 'high',
      icon: 'Moon',
    };
  }

  return {
    modifier,
    metric: {
      name: 'Sleep Quality',
      value: hours,
      status,
      optimal: '7-9 hours',
    },
    recommendation,
  };
}

function analyzeExercise(steps: number, frequency: string) {
  let modifier = 0;
  let status: 'excellent' | 'good' | 'moderate' | 'warning' | 'risk';
  let recommendation: Recommendation | null = null;

  if (steps >= 10000 && frequency === 'daily') {
    modifier = -3;
    status = 'excellent';
  } else if (steps >= 7000 && (frequency === 'daily' || frequency === 'weekly')) {
    modifier = -1;
    status = 'good';
  } else if (steps >= 5000) {
    modifier = 1;
    status = 'moderate';
    recommendation = {
      id: 'exercise-1',
      category: 'exercise',
      title: 'Increase Physical Activity',
      description: 'Try to reach 10,000 steps daily and add strength training twice a week.',
      impact: 'high',
      icon: 'Activity',
    };
  } else {
    modifier = 3;
    status = 'warning';
    recommendation = {
      id: 'exercise-2',
      category: 'exercise',
      title: 'Start Moving More',
      description: 'Sedentary lifestyle is a major aging accelerator. Start with 30-minute daily walks.',
      impact: 'high',
      icon: 'Activity',
    };
  }

  return {
    modifier,
    metric: {
      name: 'Daily Activity',
      value: steps,
      status,
      optimal: '10,000+ steps',
    },
    recommendation,
  };
}

function analyzeHabits(smoker: boolean, alcohol: string) {
  let modifier = 0;
  let recommendation: Recommendation | null = null;

  if (smoker) {
    modifier += 5;
    recommendation = {
      id: 'habits-1',
      category: 'habits',
      title: 'Quit Smoking',
      description: 'Smoking adds years to your biological age. Consider cessation programs.',
      impact: 'high',
      icon: 'Ban',
    };
  }

  if (alcohol === 'daily') {
    modifier += 2;
    if (!recommendation) {
      recommendation = {
        id: 'habits-2',
        category: 'habits',
        title: 'Reduce Alcohol Intake',
        description: 'Daily alcohol consumption accelerates aging. Limit to occasional use.',
        impact: 'medium',
        icon: 'Wine',
      };
    }
  }

  if (!smoker && (alcohol === 'never' || alcohol === 'occasionally')) {
    modifier -= 1;
  }

  return { modifier, recommendation };
}

function analyzeBMI(bmi: number) {
  let modifier = 0;
  let status: 'excellent' | 'good' | 'moderate' | 'warning' | 'risk';
  let recommendation: Recommendation | null = null;

  if (bmi >= 18.5 && bmi <= 24.9) {
    modifier = -1;
    status = 'excellent';
  } else if (bmi >= 17 && bmi <= 27) {
    modifier = 1;
    status = 'moderate';
    recommendation = {
      id: 'bmi-1',
      category: 'nutrition',
      title: 'Optimize Body Composition',
      description: 'Work towards a BMI between 18.5-24.9 through balanced nutrition and exercise.',
      impact: 'medium',
      icon: 'Scale',
    };
  } else {
    modifier = 3;
    status = 'warning';
    recommendation = {
      id: 'bmi-2',
      category: 'nutrition',
      title: 'Address Weight Management',
      description: 'Your BMI is outside the healthy range. Consider consulting a nutritionist.',
      impact: 'high',
      icon: 'Scale',
    };
  }

  return {
    modifier,
    metric: {
      name: 'BMI',
      value: bmi,
      status,
      optimal: '18.5-24.9',
    },
    recommendation,
  };
}

function analyzeHeartRate(hr: number) {
  let modifier = 0;
  let status: 'excellent' | 'good' | 'moderate' | 'warning' | 'risk';
  let recommendation: Recommendation | null = null;

  if (hr >= 50 && hr <= 65) {
    modifier = -2;
    status = 'excellent';
  } else if (hr >= 60 && hr <= 80) {
    modifier = 0;
    status = 'good';
  } else if (hr >= 80 && hr <= 100) {
    modifier = 1;
    status = 'moderate';
    recommendation = {
      id: 'heart-1',
      category: 'exercise',
      title: 'Improve Cardiovascular Fitness',
      description: 'Regular cardio exercise can lower your resting heart rate.',
      impact: 'medium',
      icon: 'Heart',
    };
  } else {
    modifier = 2;
    status = 'warning';
    recommendation = {
      id: 'heart-2',
      category: 'medical',
      title: 'Monitor Heart Rate',
      description: 'Your resting heart rate is outside normal range. Consult a physician.',
      impact: 'high',
      icon: 'Heart',
    };
  }

  return {
    modifier,
    metric: {
      name: 'Resting Heart Rate',
      value: hr,
      status,
      optimal: '60-80 bpm',
    },
    recommendation,
  };
}

function analyzeBloodPressure(systolic: number, diastolic: number) {
  let modifier = 0;
  let status: 'excellent' | 'good' | 'moderate' | 'warning' | 'risk';
  let recommendation: Recommendation | null = null;

  if (systolic < 120 && diastolic < 80) {
    modifier = -1;
    status = 'excellent';
  } else if (systolic < 130 && diastolic < 85) {
    modifier = 0;
    status = 'good';
  } else if (systolic < 140 && diastolic < 90) {
    modifier = 2;
    status = 'moderate';
    recommendation = {
      id: 'bp-1',
      category: 'medical',
      title: 'Monitor Blood Pressure',
      description: 'Your BP is elevated. Reduce sodium intake and increase physical activity.',
      impact: 'high',
      icon: 'Stethoscope',
    };
  } else {
    modifier = 4;
    status = 'risk';
    recommendation = {
      id: 'bp-2',
      category: 'medical',
      title: 'High Blood Pressure Alert',
      description: 'Consult a healthcare provider immediately. Hypertension requires attention.',
      impact: 'high',
      icon: 'Stethoscope',
    };
  }

  return {
    modifier,
    metric: {
      name: 'Blood Pressure',
      value: systolic,
      status,
      optimal: '<120/80 mmHg',
    },
    recommendation,
  };
}

function analyzeCholesterol(total: number) {
  let modifier = 0;
  let status: 'excellent' | 'good' | 'moderate' | 'warning' | 'risk';
  let recommendation: Recommendation | null = null;

  if (total < 180) {
    modifier = -1;
    status = 'excellent';
  } else if (total < 200) {
    modifier = 0;
    status = 'good';
  } else if (total < 240) {
    modifier = 1;
    status = 'moderate';
    recommendation = {
      id: 'chol-1',
      category: 'nutrition',
      title: 'Manage Cholesterol',
      description: 'Increase fiber intake and reduce saturated fats to improve cholesterol levels.',
      impact: 'medium',
      icon: 'Droplets',
    };
  } else {
    modifier = 3;
    status = 'risk';
    recommendation = {
      id: 'chol-2',
      category: 'medical',
      title: 'High Cholesterol Alert',
      description: 'Consult your doctor about cholesterol management strategies.',
      impact: 'high',
      icon: 'Droplets',
    };
  }

  return {
    modifier,
    metric: {
      name: 'Total Cholesterol',
      value: total,
      status,
      optimal: '<200 mg/dL',
    },
    recommendation,
  };
}

function analyzeBloodSugar(fasting: number) {
  let modifier = 0;
  let status: 'excellent' | 'good' | 'moderate' | 'warning' | 'risk';
  let recommendation: Recommendation | null = null;

  if (fasting < 90) {
    modifier = -1;
    status = 'excellent';
  } else if (fasting < 100) {
    modifier = 0;
    status = 'good';
  } else if (fasting < 126) {
    modifier = 2;
    status = 'moderate';
    recommendation = {
      id: 'sugar-1',
      category: 'nutrition',
      title: 'Pre-diabetes Warning',
      description: 'Your blood sugar is elevated. Reduce refined carbs and increase activity.',
      impact: 'high',
      icon: 'Cookie',
    };
  } else {
    modifier = 4;
    status = 'risk';
    recommendation = {
      id: 'sugar-2',
      category: 'medical',
      title: 'Diabetic Range Alert',
      description: 'Your blood sugar indicates diabetes. Seek medical attention immediately.',
      impact: 'high',
      icon: 'Cookie',
    };
  }

  return {
    modifier,
    metric: {
      name: 'Fasting Blood Sugar',
      value: fasting,
      status,
      optimal: '<100 mg/dL',
    },
    recommendation,
  };
}

function analyzeHydration(liters: number) {
  let modifier = 0;
  let status: 'excellent' | 'good' | 'moderate' | 'warning' | 'risk';
  let recommendation: Recommendation | null = null;

  if (liters >= 2.5) {
    modifier = -1;
    status = 'excellent';
  } else if (liters >= 2) {
    modifier = 0;
    status = 'good';
  } else if (liters >= 1.5) {
    modifier = 0.5;
    status = 'moderate';
    recommendation = {
      id: 'hydration-1',
      category: 'nutrition',
      title: 'Increase Water Intake',
      description: 'Aim for at least 2.5 liters of water daily for optimal cellular function.',
      impact: 'low',
      icon: 'Droplet',
    };
  } else {
    modifier = 1;
    status = 'warning';
    recommendation = {
      id: 'hydration-2',
      category: 'nutrition',
      title: 'Dehydration Warning',
      description: 'You are likely chronically dehydrated. This affects all body systems.',
      impact: 'medium',
      icon: 'Droplet',
    };
  }

  return {
    modifier,
    metric: {
      name: 'Daily Hydration',
      value: liters,
      status,
      optimal: '2.5+ liters',
    },
    recommendation,
  };
}

function analyzeFamilyHistory(data: HealthFormData) {
  let modifier = 0;
  let recommendation: Recommendation | null = null;

  if (data.familyHeartDisease) modifier += 1;
  if (data.familyDiabetes) modifier += 1;
  if (data.familyCancer) modifier += 0.5;
  if (data.familyLongevity) modifier -= 2;

  if (modifier > 1) {
    recommendation = {
      id: 'family-1',
      category: 'medical',
      title: 'Preventive Health Focus',
      description: 'Your family history suggests increased risk. Regular screenings are essential.',
      impact: 'high',
      icon: 'Users',
    };
  }

  return { modifier, recommendation };
}

export async function simulateWhatIf(
  baseData: HealthFormData,
  changes: Partial<HealthFormData>
): Promise<HealthResults> {

  const modifiedData: HealthFormData = {
    ...baseData,
    ...changes,
  };

  const payload = {
    age: modifiedData.chronologicalAge,
    sleep_hours: modifiedData.sleepHours,
    sleep_quality:
      modifiedData.sleepQuality === 'poor' ? 0 :
      modifiedData.sleepQuality === 'fair' ? 1 :
      modifiedData.sleepQuality === 'good' ? 2 : 3,
    smoker: modifiedData.smoker ? 1 : 0,
    alcohol:
      modifiedData.alcoholFrequency === 'never' ? 0 :
      modifiedData.alcoholFrequency === 'occasionally' ? 1 :
      modifiedData.alcoholFrequency === 'weekly' ? 2 : 3,
    bmi: modifiedData.bmi,
    resting_hr: modifiedData.restingHeartRate,
    systolic_bp: modifiedData.systolicBP,
    diastolic_bp: modifiedData.diastolicBP,
    cholesterol: modifiedData.cholesterolTotal,
    daily_steps: modifiedData.dailySteps,
    family_history:
      modifiedData.familyHeartDisease ||
      modifiedData.familyDiabetes ||
      modifiedData.familyCancer ? 1 : 0,
    water_intake: modifiedData.waterIntake,
  };

  const response = await fetch('http://localhost:8000/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Simulation failed');
  }

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
}
