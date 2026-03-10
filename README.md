# Biological Age Estimation System (BAE)
A multi-factor intelligent system that estimates **biological age and longevity risk** using environmental, lifestyle, biological, and mental health indicators. The system applies **machine learning models** to analyze health data and generate personalized recommendations for improving long-term health outcomes.

---

## Overview
Traditional health assessments rely mainly on **chronological age**, which does not accurately reflect an individual's internal health condition. This project introduces an AI-driven approach to estimate **biological age**, identify longevity risk factors, and simulate lifestyle improvements that can enhance a person's health span.
The system integrates machine learning analysis with an interactive user interface to provide insights about aging patterns and preventive health strategies.

---

## Key Features
- Estimates a person's **biological age** based on multiple health indicators  
- Identifies **longevity risk contributors**  
- Predicts **health-span risk zones** (Low / Medium / High)  
- Generates **personalized longevity recommendations**  
- Supports **scenario-based simulations** such as:
  - What if I improve sleep?
  - What if stress reduces by 20%?
  - What if I move to a less polluted area?

---

## Biological vs Chronological Age
### Biological Age
Biological age represents the actual physiological condition of a person's body based on lifestyle, environment, and health indicators.
Biological Age = f (lifestyle, environment, health factors, mental state)

### Chronological Age
Chronological age is simply the number of years a person has lived since birth.
Biological Age ≠ Chronological Age

### Age Difference Indicator
ΔA = BA − CA
| Condition | Meaning |
|-----------|--------|
| ΔA > 0 | Risk Zone (accelerated aging) |
| ΔA = 0 | Stable Zone |
| ΔA < 0 | Healthy Zone (slower aging) |

---

## Installation and Setup
```bash
git clone https://github.com/pattemmaniteja/BAEstimator.git
cd BAEstimator

## Run the Machine Learning Model
##Navigate to the ml folder and run the training script.
cd ml  
python train.py  

## Run the User Interface
##Navigate to the ui folder and install dependencies.
cd ui  
npm install  

## Start the frontend application.
npm run dev  
```
The application will start locally and can be accessed in your browser.

## Technologies Used
### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
### Machine Learning
- Python
- Scikit-learn
- Pandas
- NumPy
## Use Cases
- Personal health awareness
- Preventive healthcare monitoring
- Longevity optimization
- Lifestyle improvement planning
## Ethical AI Considerations
The system promotes responsible AI usage by:
- Providing health insights instead of medical diagnoses
- Encouraging preventive healthcare awareness
- Maintaining transparency in prediction logic

## Disclaimer
This system provides health insights and recommendations for educational purposes only and should not replace professional medical advice.
