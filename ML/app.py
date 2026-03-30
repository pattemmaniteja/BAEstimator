import pandas as pd
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

rf = joblib.load("rf_model.pkl")
xgb = joblib.load("xgb_model.pkl")
gb = joblib.load("gb_model.pkl")
meta = joblib.load("meta_model.pkl")
scaler = joblib.load("scaler.pkl")

features = [
"sleep_hours","sleep_quality","smoker","alcohol","exercise_minutes",
"daily_steps","diet_quality","water_intake","stress_level","bmi",
"resting_hr","systolic_bp","diastolic_bp","cholesterol","glucose",
"oxygen_saturation","family_history","inflammation_index"
]

class HealthData(BaseModel):
    age: int
    sleep_hours: float
    sleep_quality: int
    smoker: int
    alcohol: int
    exercise_minutes: float
    daily_steps: int
    diet_quality: int
    water_intake: float
    stress_level: int
    bmi: float
    resting_hr: float
    systolic_bp: float
    diastolic_bp: float
    cholesterol: float
    glucose: float
    oxygen_saturation: float
    family_history: int
    inflammation_index: float

def predict_pipeline(data):
    input_dict = data.model_dump()
    age = input_dict["age"]

    model_input = {k: input_dict[k] for k in features}
    df = pd.DataFrame([model_input])

    scaled = scaler.transform(df.values)

    rf_p = rf.predict(scaled)
    xgb_p = xgb.predict(scaled)
    gb_p = gb.predict(scaled)
    print("\n========== BASE MODEL OUTPUTS ==========")
    print("Random Forest:", rf_p)
    print("XGBoost:", xgb_p)
    print("Gradient Boosting:", gb_p)

    # Stacking
    stack = np.column_stack((rf_p, xgb_p, gb_p))

    print("\n========== STACKED INPUT ==========")
    print(stack)

    acc = meta.predict(stack)[0]
    bio_age = age + acc

    health_score = 10 - abs(acc)   
    health_score = (
        10 - abs(acc) +

        input_dict["sleep_quality"] * 0.5 +
        (1 - input_dict["smoker"]) * 1 +
        (input_dict["exercise_minutes"] / 30) * 0.5 +

        - abs(input_dict["bmi"] - 22) / 5
        - (input_dict["systolic_bp"] - 120) / 30
        - (input_dict["cholesterol"] - 180) / 60
    )
    health_score = max(0, min(10, health_score))

    bio_age = round(float(bio_age), 2)
    acc = round(float(acc), 2)
    health_score = round(float(health_score), 2)

    print("\n========== FINAL OUTPUT ==========")
    print("Chronological Age:", age)
    print("Biological Age:", bio_age)
    print("Age Acceleration:", acc)
    print("Health Score:", health_score)
    print("==================================\n")
    return {
        "chronological_age": age,
        "health_score": round(float(health_score), 2),
        "biological_age": round(float(bio_age), 2),
        "age_acceleration": round(float(acc), 2)
    }

@app.get("/")
def root():
    return {"message": "API running"}

@app.post("/predict")
def predict(data: HealthData):
    try:
        print("Received Data:", data.dict())
        return predict_pipeline(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/simulate")
def simulate(data: HealthData):
    try:
        print("Simulation Data:", data.dict())
        return predict_pipeline(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)