import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os

# Initialize FastAPI app
app = FastAPI(title="Biological Age Predictor API")

# Enable CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins. In production, replace with your frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
# Ensure health_model.pkl exists in the same directory
MODEL_PATH = "health_model.pkl"
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None
    print(f"Warning: {MODEL_PATH} not found. Make sure to run train_model.py first.")

# Define input data schema using Pydantic
class HealthData(BaseModel):
    age: int
    sleep_hours: float
    sleep_quality: int  # 0: Poor, 1: Average, 2: Good
    smoker: int         # 0: No, 1: Yes
    alcohol: int        # 0: No, 1: Yes
    bmi: float
    resting_hr: float
    systolic_bp: float
    diastolic_bp: float
    cholesterol: float
    daily_steps: int
    family_history: int # 0: No, 1: Yes
    water_intake: float

def compute_biological_age(age, health_score):
    """
    Calculates biological age based on chronological age and predicted health score.
    Logic replicated from predict_age.py.
    """
    if age <= 25:
        max_diff = 1
    elif age <= 35:
        max_diff = 2
    elif age <= 50:
        max_diff = 4
    elif age <= 65:
        max_diff = 6
    else:
        max_diff = 8

    raw_bio_age = age + (5 - health_score) * 2
    return max(age - max_diff, min(age + max_diff, raw_bio_age))

# Define log file path explicitly and create it immediately
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE_PATH = os.path.join(BASE_DIR, "backend_logs.txt")
print(f"✅ Validation logs will be saved to: {LOG_FILE_PATH}")

with open(LOG_FILE_PATH, "a") as f:
    f.write("\n--- Server Started ---\n")

# Middleware to log ALL requests (helps debug connection issues)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    with open(LOG_FILE_PATH, "a") as f:
        f.write(f"Incoming Request: {request.method} {request.url}\n")
    response = await call_next(request)
    return response

@app.get("/")
def read_root():
    return {"message": "Biological Age Predictor API is running"}

@app.post("/predict")
async def predict(request: Request):
    def log_validation(msg):
        print(msg, flush=True)
        with open(LOG_FILE_PATH, "a") as f:
            f.write(str(msg) + "\n")

    # Log immediately when the endpoint is hit
    log_validation("\n--- [REQUEST RECEIVED] ---")

    if model is None:
        log_validation("❌ Error: Model not loaded. 'health_model.pkl' is missing.")
        raise HTTPException(status_code=500, detail="Model file not found. Please train the model first.")

    try:
        # Get raw JSON body first to ensure we log it even if validation fails
        raw_body = await request.json()
        
        # Log received data IMMEDIATELY
        log_validation(f"1. Received Raw Data from UI: {raw_body}")

        # Validate data against schema manually
        try:
            data = HealthData(**raw_body)
        except Exception as e:
            log_validation(f"❌ Validation Error: {str(e)}")
            log_validation("--- [VALIDATION END (ERROR)] ---\n")
            raise HTTPException(status_code=422, detail=f"Validation Error: {str(e)}")

        # Prepare input dataframe matching the training features order
        features = [
            "sleep_hours", "sleep_quality",
            "smoker", "alcohol", "bmi",
            "resting_hr", "systolic_bp", "diastolic_bp",
            "cholesterol", "daily_steps",
            "family_history", "water_intake"
        ]

        # Extract data in the correct order
        input_dict = data.model_dump()
        model_input = {k: input_dict[k] for k in features}

        log_validation(f"2. Formatted Model Input: {model_input}")

        df = pd.DataFrame([model_input])

        # Predict health score
        health_score = model.predict(df)[0]
        log_validation(f"3. ML Model Predicted Health Score: {health_score}")

        # Calculate biological age
        bio_age = compute_biological_age(data.age, health_score)
        log_validation(f"4. ML Calculated Biological Age: {bio_age}")

        result = {
            "chronological_age": data.age,
            "health_score": round(float(health_score), 2),
            "biological_age": round(float(bio_age), 2),
            "age_acceleration": round(float(bio_age - data.age), 2)
        }

        log_validation(f"5. Sending Result back to UI: {result}")
        log_validation("--- [VALIDATION END] ---\n")
        return result
    except HTTPException:
        raise
    except Exception as e:
        log_validation(f"❌ Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/simulate")
async def simulate(request: Request):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        raw_body = await request.json()

        try:
            data = HealthData(**raw_body)
        except Exception as e:
            raise HTTPException(status_code=422, detail=str(e))

        features = [
            "sleep_hours", "sleep_quality",
            "smoker", "alcohol", "bmi",
            "resting_hr", "systolic_bp", "diastolic_bp",
            "cholesterol", "daily_steps",
            "family_history", "water_intake"
        ]

        input_dict = data.model_dump()
        model_input = {k: input_dict[k] for k in features}

        df = pd.DataFrame([model_input])

        health_score = float(model.predict(df)[0])
        biological_age = compute_biological_age(data.age, health_score)

        return {
            "health_score": round(health_score, 2),
            "biological_age": round(biological_age, 2),
            "age_acceleration": round(biological_age - data.age, 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    # Run the API server
    uvicorn.run(app, host="0.0.0.0", port=8000)
