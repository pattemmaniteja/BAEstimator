import React, { useState } from 'react';

const AgePredictor = () => {
  const [formData, setFormData] = useState({
    age: '',
    sleep_hours: '',
    sleep_quality: 1, // 0: Poor, 1: Average, 2: Good
    smoker: 0,        // 0: No, 1: Yes
    alcohol: 0,       // 0: No, 1: Yes
    bmi: '',
    resting_hr: '',
    systolic_bp: '',
    diastolic_bp: '',
    cholesterol: '',
    daily_steps: '',
    family_history: 0, // 0: No, 1: Yes
    water_intake: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Convert inputs to correct types (int/float)
      const payload = {
        age: parseInt(formData.age),
        sleep_hours: parseFloat(formData.sleep_hours),
        sleep_quality: parseInt(formData.sleep_quality),
        smoker: parseInt(formData.smoker),
        alcohol: parseInt(formData.alcohol),
        bmi: parseFloat(formData.bmi),
        resting_hr: parseFloat(formData.resting_hr),
        systolic_bp: parseFloat(formData.systolic_bp),
        diastolic_bp: parseFloat(formData.diastolic_bp),
        cholesterol: parseFloat(formData.cholesterol),
        daily_steps: parseInt(formData.daily_steps),
        family_history: parseInt(formData.family_history),
        water_intake: parseFloat(formData.water_intake)
      };

      // Log UI inputs to console for validation
      console.log('UI Form Inputs:', payload);

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      // Log received result from ML backend for validation
      console.log('UI Received Result from ML Backend:', data);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Biological Age Predictor</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
        
        <label>Age: <input type="number" name="age" value={formData.age} onChange={handleChange} required /></label>
        
        <label>Sleep Hours: <input type="number" step="0.1" name="sleep_hours" value={formData.sleep_hours} onChange={handleChange} required /></label>
        
        <label>
          Sleep Quality:
          <select name="sleep_quality" value={formData.sleep_quality} onChange={handleChange}>
            <option value={0}>Poor</option>
            <option value={1}>Average</option>
            <option value={2}>Good</option>
          </select>
        </label>

        <label>
          Smoker:
          <select name="smoker" value={formData.smoker} onChange={handleChange}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </label>

        <label>
          Alcohol Consumer:
          <select name="alcohol" value={formData.alcohol} onChange={handleChange}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </label>

        <label>BMI: <input type="number" step="0.1" name="bmi" value={formData.bmi} onChange={handleChange} required /></label>
        
        <label>Resting Heart Rate: <input type="number" name="resting_hr" value={formData.resting_hr} onChange={handleChange} required /></label>
        
        <label>Systolic BP: <input type="number" name="systolic_bp" value={formData.systolic_bp} onChange={handleChange} required /></label>
        
        <label>Diastolic BP: <input type="number" name="diastolic_bp" value={formData.diastolic_bp} onChange={handleChange} required /></label>
        
        <label>Cholesterol: <input type="number" name="cholesterol" value={formData.cholesterol} onChange={handleChange} required /></label>
        
        <label>Daily Steps: <input type="number" name="daily_steps" value={formData.daily_steps} onChange={handleChange} required /></label>
        
        <label>
          Family History:
          <select name="family_history" value={formData.family_history} onChange={handleChange}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </label>

        <label>Water Intake (L): <input type="number" step="0.1" name="water_intake" value={formData.water_intake} onChange={handleChange} required /></label>

        <button type="submit" disabled={loading} style={{ padding: '10px', marginTop: '10px' }}>
          {loading ? 'Calculating...' : 'Predict Age'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Results</h3>
          <p><strong>Chronological Age:</strong> {result.chronological_age}</p>
          <p><strong>Biological Age:</strong> {result.biological_age}</p>
          <p><strong>Health Score:</strong> {result.health_score} / 10</p>
          <p><strong>Age Acceleration:</strong> {result.age_acceleration > 0 ? `+${result.age_acceleration} years` : `${result.age_acceleration} years`}</p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            {result.age_acceleration > 0 ? "Your biological age is higher than your actual age. Consider improving lifestyle habits." : "Great job! Your biological age is lower than your actual age."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AgePredictor;