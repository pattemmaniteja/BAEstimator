import numpy as np
import pandas as pd

np.random.seed(42)

N = 50000

data = pd.DataFrame()

# ---------------- AGE ----------------
data["age"] = np.random.randint(18, 80, N)

# ---------------- LIFESTYLE ----------------
data["sleep_hours"] = np.random.normal(7, 1.2, N).clip(4, 9)
data["sleep_quality"] = np.random.choice([0,1,2], N, p=[0.2,0.5,0.3])

data["smoker"] = np.random.choice([0,1], N, p=[0.75,0.25])
data["alcohol"] = np.random.choice([0,1], N, p=[0.6,0.4])

data["exercise_minutes"] = np.random.normal(40,25,N).clip(0,120)
data["daily_steps"] = (data["exercise_minutes"]*120 + np.random.normal(4000,1500,N)).clip(1000,18000)

data["diet_quality"] = np.random.choice([0,1,2], N, p=[0.3,0.5,0.2])
data["water_intake"] = np.random.normal(2.2,0.6,N).clip(1,4)

data["stress_level"] = np.random.choice([0,1,2], N, p=[0.3,0.5,0.2])

# ---------------- BODY METRICS ----------------
data["bmi"] = np.random.normal(24,4,N).clip(17,36)

# resting heart rate influenced by fitness
data["resting_hr"] = (
    75
    - data["exercise_minutes"]*0.15
    + data["smoker"]*6
    + data["stress_level"]*3
    + np.random.normal(0,4,N)
).clip(50,95)

# ---------------- BLOOD PRESSURE ----------------
data["systolic_bp"] = (
    110
    + (data["age"]*0.35)
    + (data["bmi"]-22)*1.2
    + data["stress_level"]*4
    + data["smoker"]*6
    + np.random.normal(0,7,N)
).clip(95,180)

data["diastolic_bp"] = (
    70
    + (data["age"]*0.18)
    + (data["bmi"]-22)*0.8
    + data["stress_level"]*3
    + np.random.normal(0,5,N)
).clip(60,110)

# ---------------- CHOLESTEROL ----------------
data["cholesterol"] = (
    170
    + (data["age"]*0.5)
    + (data["diet_quality"]*-10)
    + data["smoker"]*15
    + np.random.normal(0,15,N)
).clip(130,300)

# ---------------- BLOOD GLUCOSE ----------------
data["glucose"] = (
    90
    + (data["bmi"]-22)*2
    + data["stress_level"]*4
    + data["diet_quality"]*-5
    + np.random.normal(0,8,N)
).clip(70,160)

# ---------------- OXYGEN SATURATION ----------------
data["oxygen_saturation"] = (
    98
    - data["smoker"]*1.5
    - data["age"]*0.02
    + np.random.normal(0,0.5,N)
).clip(92,100)

# ---------------- FAMILY HISTORY ----------------
data["family_history"] = np.random.choice([0,1], N, p=[0.65,0.35])

# ---------------- INFLAMMATION INDEX ----------------
data["inflammation_index"] = (
    2
    + data["smoker"]*1.5
    + data["stress_level"]*0.8
    + (data["bmi"]-22)*0.2
    + np.random.normal(0,0.5,N)
).clip(0,10)

# ---------------- HEALTH INDEX ----------------
health_index = (
    6
    + data["sleep_quality"]*1.1
    + (data["sleep_hours"]-7)*0.4
    + (1-data["smoker"])*1.5
    + (1-data["alcohol"])*0.6
    + data["diet_quality"]*0.8
    + (data["daily_steps"]-6000)/3000
    + data["exercise_minutes"]/60
    - abs(data["bmi"]-22)/3
    - (data["resting_hr"]-65)/25
    - (data["systolic_bp"]-120)/30
    - (data["cholesterol"]-180)/50
    - (data["glucose"]-95)/35
    - data["inflammation_index"]/3
    + data["water_intake"]*0.2
)

health_index = np.clip(health_index,0,10)

data["health_index"] = health_index

# ---------------- BIOLOGICAL AGE ----------------
bio_age = (
    data["age"]
    + (5 - health_index)*1.4
    + data["stress_level"]*0.6
    + data["inflammation_index"]*0.5
)

data["biological_age"] = bio_age.clip(18,90)

# ---------------- LONGEVITY RISK ----------------
conditions = [
    health_index >= 7,
    (health_index >=4) & (health_index <7),
    health_index <4
]

choices = ["Low","Medium","High"]

data["longevity_risk"] = np.select(conditions, choices)

# ---------------- SAVE DATASET ----------------
data.to_csv("synthetic_biological_age_dataset_50k.csv",index=False)

print("Dataset Generated Successfully")
print("Shape:",data.shape)
print(data.head())